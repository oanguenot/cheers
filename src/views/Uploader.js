import React, { useRef, useEffect, useState, useContext } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";

import { requestId } from "../modules/Config";
import {
    getConversationFromContactId,
    shareFileInConversation,
    closeOpenedConversation,
    updateBubbleCustomData,
} from "../modules/SDK";

import ShareContext from "../contexts/shareContext";

import { SET_BUBBLE } from "../actions/shareAction";
import { LinearProgress } from "@material-ui/core";

function Uploader({ dispatch }) {
    const inputFile = useRef();

    const [file, setFile] = useState(null);

    const shareState = useContext(ShareContext);

    const useStyles = makeStyles((theme) => ({
        heroButtons: {
            marginTop: theme.spacing(4),
        },
        input: {
            display: "none",
        },
        progress: {
            marginTop: theme.spacing(2),
        },
    }));

    const classes = useStyles();

    useEffect(() => {
        inputFile.current.addEventListener("change", handleFiles, false);
    }, []);

    useEffect(() => {
        const uploadFile = async (fileToShare, bubble) => {
            const id = await requestId(1000);

            const conversation = await getConversationFromContactId(id);

            const message = await shareFileInConversation(fileToShare, conversation);

            await closeOpenedConversation(conversation);

            const updatedbubble = await updateBubbleCustomData(message, bubble);

            dispatch({ type: SET_BUBBLE, payload: { bubble: updatedbubble } });
        };

        if (file) {
            uploadFile(file, shareState.bubble);
        }
    }, [file]);

    const handleFiles = async () => {
        const fileToShare = inputFile.current.files[0];
        setFile(fileToShare);
    };

    return (
        <Container maxWidth="sm">
            <div className={classes.heroButtons}>
                <Grid container spacing={2} justify="center">
                    <Grid item align="center">
                        <input id="contained-button-file" className={classes.input} ref={inputFile} type="file" />
                        <label htmlFor="contained-button-file">
                            <Button variant="contained" color="primary" component="span">
                                Share a file
                            </Button>
                        </label>

                        {shareState.uploadInProgress && (
                            <div className={classes.progress}>
                                <LinearProgress variant="determinate" value={shareState.progress} color="secondary" />

                                <Typography variant="body2" color="secondary" align="center">
                                    Transfer is in progress. Please wait...
                                </Typography>
                            </div>
                        )}
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
}

export default Uploader;
