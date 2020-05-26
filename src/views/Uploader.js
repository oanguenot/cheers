import React, { useRef, useEffect, useState, useContext } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";

import { requestId } from "../modules/Config";
import {
    getConversationFromContactId,
    shareFileInConversation,
    closeOpenedConversation,
    updateBubbleCustomData,
} from "../modules/SDK";
import ShareContext from "../contexts/shareContext";

function Uploader({ dispatch }) {
    const [file, setFile] = useState(null);
    const [bubble, setBubble] = useState(null);

    const shareState = useContext(ShareContext);

    const useStyles = makeStyles((theme) => ({
        heroButtons: {
            marginTop: theme.spacing(4),
        },
        input: {
            display: "none",
        },
    }));

    useEffect(() => {
        inputFile.current.addEventListener("change", handleFiles, false);
    }, []);

    useEffect(() => {
        console.log("shareStateUpdated");
        if (!shareState.bubble) {
            console.log(">>>>WARNING BUBBLE REMOVED");
        } else {
            console.log(">>>>BUBBLE ADDED", shareState.bubble);
            setBubble(shareState.bubble);
        }
    }, [shareState]);

    useEffect(() => {
        const uploadFile = async (fileToShare, bubble) => {
            const id = await requestId(1000);
            console.log("ID:", id);

            const conversation = await getConversationFromContactId(id);
            console.log("CONV:", conversation);

            const message = await shareFileInConversation(fileToShare, conversation);
            console.log("MESSAGE:", message);

            await closeOpenedConversation(conversation);

            const updatedbubble = await updateBubbleCustomData(message, bubble);
            setBubble(updatedbubble);
        };

        if (file) {
            uploadFile(file, shareState.bubble);
        }
    }, [file]);

    const classes = useStyles();

    const inputFile = useRef();

    const handleFiles = async () => {
        const fileToShare = inputFile.current.files[0];
        console.log("Handled", fileToShare);
        setFile(fileToShare);
    };

    return (
        <Container maxWidth="sm">
            <div className={classes.heroButtons}>
                <Grid container spacing={2} justify="center">
                    <Grid item>
                        <input id="contained-button-file" className={classes.input} ref={inputFile} type="file" />
                        <label htmlFor="contained-button-file">
                            <Button variant="contained" color="primary" component="span">
                                Share a file
                            </Button>
                        </label>
                        &nbsp;
                        {shareState.uploadInProgress && (
                            <CircularProgress
                                variant="static"
                                value={shareState.progress}
                                color="secondary"
                                style={{ paddingTop: "8px" }}
                            />
                        )}
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
}

export default Uploader;
