import React, { useContext } from "react";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";

import GuestContext from "../contexts/guestContext";

function User() {
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

    const classes = useStyles();

    let avatarSrc = guestState.user ? guestState.user.avatarSrc : "";

    let userName = guestState.user ? `${guestState.user.firstname} ${guestState.user.lastname}` : "";

    return (
        <div className={classes.heroContent}>
            <Container maxWidth="sm">
                <Avatar alt="" src={avatarSrc} className={classes.avatar} />
                <Typography variant="h5" align="center" color="textPrimary" paragraph>
                    {userName}
                </Typography>
                <Typography variant="h6" align="center" color="textPrimary" paragraph>
                    shares file
                </Typography>
            </Container>
        </div>
    );
}

export default User;
