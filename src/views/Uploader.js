import React, { useRef, useEffect, useState, useContext } from "react";
import moment from "moment";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";

import { requestId, config } from "../modules/Config";

import { generateLink } from "../modules/Link";
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
            paddingTop: theme.spacing(4),
        },
        input: {
            display: "none",
        },
        progress: {
            marginTop: theme.spacing(1),
        },
    }));

    const classes = useStyles();

    useEffect(() => {
        inputFile.current.addEventListener("change", handleFiles, false);
    }, []);

    useEffect(() => {
        const uploadFile = async (fileToShare, bubble) => {
            const ttl = config().guest_ttl;

            try {
                // Generate GuestID
                const guestId = await requestId(ttl);

                const expirationDate = moment(Date.now()).add(86400, "seconds").toDate();

                const conversation = await getConversationFromContactId(guestId);

                const message = await shareFileInConversation(fileToShare, conversation);

                const fileId = message.fileId;

                const publicLink = await generateLink(guestId, fileId);

                await closeOpenedConversation(conversation);

                const updatedbubble = await updateBubbleCustomData(fileId, guestId, publicLink, expirationDate, bubble);

                dispatch({ type: SET_BUBBLE, payload: { bubble: updatedbubble } });
            } catch (err) {}
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
                <Grid container justify="center">
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
