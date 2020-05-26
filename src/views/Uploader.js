import React, { useRef, useEffect, useState, useContext } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";

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

    const shareState = useContext(ShareContext);

    const useStyles = makeStyles((theme) => ({
        heroButtons: {
            marginTop: theme.spacing(4),
        },
    }));

    const handleFiles = () => {
        const file = inputFile.current.files[0];
        console.log("Handled", file);
        setFile(file);
    };

    useEffect(() => {
        inputFile.current.addEventListener("change", handleFiles, false);
    }, []);

    const classes = useStyles();

    const inputFile = useRef();

    const onShare = async () => {
        console.log(">>>share");

        const id = await requestId(1000);
        console.log("ID:", id);

        const conversation = await getConversationFromContactId(id);
        console.log("CONV:", conversation);

        const message = await shareFileInConversation(file, conversation);
        console.log("MESSAGE:", message);

        await closeOpenedConversation(conversation);

        const bubble = await updateBubbleCustomData(message, shareState.bubble);
        console.log("Done", bubble);
    };

    return (
        <Container maxWidth="sm">
            <div className={classes.heroButtons}>
                <Grid container spacing={2} justify="center">
                    <Grid item>
                        <input ref={inputFile} type="file" />
                        <Button variant="contained" color="primary" onClick={onShare}>
                            SHARE
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
}

export default Uploader;
