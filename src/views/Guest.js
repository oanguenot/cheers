import React, { useEffect } from "react";

import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import { getUserFrom, getFileFrom } from "../actions/guestAction";
import User from "./User";
import File from "./File";

function Guest({ dispatch }) {
    useEffect(() => {
        // Get active conversation (user + file shared)
        getUserFrom(dispatch);
        getFileFrom(dispatch);
    }, []);

    const useStyles = makeStyles((theme) => ({
        heroContent: {
            padding: theme.spacing(8),
            height: "200px",
        },
        logo: {
            fontSize: "48px",
        },
    }));

    const classes = useStyles();

    return (
        <div className={classes.heroContent}>
            <Container maxWidth="sm">
                <User />
                <File dispatch={dispatch} />
            </Container>
        </div>
    );
}

export default Guest;
