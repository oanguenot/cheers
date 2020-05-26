import React from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import FileCopy from "@material-ui/icons/FileCopy";
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
                <FileCopy className={classes.icon} />
                <Typography variant="h6" color="inherit" noWrap>
                    FileRing
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default TopBar;
