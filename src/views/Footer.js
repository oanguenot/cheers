import React from "react";

import Copyright from "./Copyright";
import Link from "@material-ui/core/Link";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

function Footer({ dispatch }) {
    const useStyles = makeStyles((theme) => ({
        footer: {
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(2),
            display: "block",
            left: "0",
            bottom: "0",
            width: "100%",
            position: "fixed",
            height: "100px",
        },
    }));

    const classes = useStyles();

    return (
        <footer className={classes.footer}>
            <Typography variant="h6" align="center" gutterBottom>
                FileRing
                <small>
                    &nbsp;is propulsed by{" "}
                    <Link color="info.main" href="https://www.openrainbow.com/">
                        Rainbow
                    </Link>
                </small>
            </Typography>
            <Copyright />
        </footer>
    );
}

export default Footer;
