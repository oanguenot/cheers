import React, { useEffect, useState, useRef } from "react";

import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

function SharePopup(props) {
    const useStyles = makeStyles((theme) => ({
        root: {
            margin: theme.spacing(1),
            width: "100%",
        },
        link: {
            marginTop: theme.spacing(3),
            width: "100%",
            color: theme.palette.primary.main,
        },
        buttonCopied: {
            marginTop: theme.spacing(2),
        },
        copied: {
            marginLeft: theme.spacing(1),
            marginTop: theme.spacing(2),
        },
    }));

    const fileName = props.fileData ? props.fileData.file.fileName : "";
    const link = props.fileData ? props.fileData.publicURL : "";

    const [copied, setCopied] = useState(false);

    const classes = useStyles();

    const handleClose = () => {
        props.onClose();
        setCopied(false);
    };

    const handleCopyToClipboard = (e) => {
        navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
            if (result.state === "granted" || result.state === "prompt") {
                navigator.clipboard.writeText(link).then(
                    function () {
                        setCopied(true);
                    },
                    function (err) {
                        console.log("error copied", err);
                    }
                );
            }
        });
    };

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Share your file"}</DialogTitle>
                <DialogContent>
                    <form noValidate autoComplete="off" className={classes.root}>
                        <DialogContentText id="alert-dialog-description">
                            Give the following link to any persons you want.
                        </DialogContentText>
                        <DialogContentText id="alert-dialog-description">
                            {`People receiving the link are able to download the file ${fileName} until the defined expiration date.`}
                        </DialogContentText>

                        <TextField
                            disabled
                            id="outlined-multiline-static"
                            label={`Link to file ${fileName}`}
                            multiline
                            defaultValue={link}
                            variant="outlined"
                            className={classes.link}
                        />
                        <div className={classes.buttonCopied}>
                            <Button
                                color="primary"
                                fullwidth="true"
                                onClick={handleCopyToClipboard}
                                variant="contained"
                            >
                                Copy to Clipboard
                            </Button>
                            {copied && (
                                <Typography
                                    component="h6"
                                    variant="body1"
                                    color="textPrimary"
                                    display="inline"
                                    className={classes.copied}
                                >
                                    Copied!
                                </Typography>
                            )}
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined" color="secondary">
                        Delete
                    </Button>
                    <Button onClick={handleClose} variant="contained" color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default SharePopup;
