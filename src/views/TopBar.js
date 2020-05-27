import React from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloudCircle from "@material-ui/icons/CloudCircleTwoTone";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

function TopBar({ dispatch }) {
    const useStyles = makeStyles((theme) => ({
        icon: {
            marginRight: theme.spacing(2),
        },
    }));

    const classes = useStyles();

    return (
        <AppBar position="relative">
            <Toolbar>
                <CloudCircle className={classes.icon} />
                <Typography variant="h6" color="inherit" noWrap>
                    FileRing
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default TopBar;
