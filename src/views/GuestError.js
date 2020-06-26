import React from "react";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Warning from "@material-ui/icons/Warning";

function GuestError({ dispatch }) {
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
                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                    Unfortunately, the file is no more accessible!
                    <br />
                    <Warning className={classes.logo} />
                </Typography>
            </Container>
        </div>
    );
}

export default GuestError;
