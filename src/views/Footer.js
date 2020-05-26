import React from "react";

import Copyright from "./Copyright";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

function Footer({ dispatch }) {
    const useStyles = makeStyles((theme) => ({
        icon: {
            marginRight: theme.spacing(2),
        },
        footer: {
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(6),
            display: "block",
            left: "0",
            bottom: "0",
            width: "100%",
            position: "fixed",
            height: "150px",
        },
    }));

    const classes = useStyles();

    return (
        <footer className={classes.footer}>
            <Typography variant="h6" align="center" gutterBottom>
                FileRing
            </Typography>
            <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                <i>Propulsed by Rainbow!</i>
            </Typography>
            <Copyright />
        </footer>
    );
}

export default Footer;
