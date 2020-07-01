import React, { useContext, useEffect } from "react";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import GuestContext from "../contexts/guestContext";
import { downloadFile } from "../actions/guestAction";

const saveToFile = (blob, filename) => {
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
};

function File({ dispatch }) {
    const guestState = useContext(GuestContext);

    const useStyles = makeStyles((theme) => ({
        heroContent: {
            padding: theme.spacing(8),
            height: "200px",
        },
        logo: {
            fontSize: "48px",
        },
        avatar: {
            margin: "auto",
            width: theme.spacing(16),
            height: theme.spacing(16),
        },
        root: {
            display: "flex",
        },
    }));

    useEffect(() => {
        if (guestState.blob) {
            saveToFile(guestState.blob, guestState.file.fileName);
        }
    }, [guestState.blob]);

    const classes = useStyles();

    let fileName = guestState.file ? guestState.file.fileName : "";

    const handleDownload = () => {
        downloadFile(guestState.file, dispatch);
    };

    return (
        <div className={classes.heroContent}>
            <Container maxWidth="sm">
                <Grid item align="center">
                    <Typography variant="h5" align="center" color="textPrimary" paragraph>
                        {fileName}
                    </Typography>
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" color="primary" component="span" onClick={handleDownload}>
                            Download
                        </Button>
                    </label>
                </Grid>
            </Container>
        </div>
    );
}

export default File;
