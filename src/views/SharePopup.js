import React, { useEffect } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { generateLink } from "../modules/Link";

function SharePopup(props) {
    const handleClose = () => {
        props.onClose();
    };

    const generatePublicLink = async (guestId, fileId) => {
        const link = await generateLink(guestId, fileId);
        return link;
    };

    const fileName = props.file ? props.file.fileName : "";

    useEffect(() => {
        if (props.open) {
            generatePublicLink();
        }
    }, [props.open]);

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"FileRing"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`Share the following link to any persons you want. He will have access to the file ${fileName}`}
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description">
                        {`Share the following link to any persons you want. He will have access to the file ${fileName}`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Disagree
                    </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default SharePopup;
