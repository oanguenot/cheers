import React from "react";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CloudCircle from "@material-ui/icons/CloudCircleTwoTone";

function Header({ dispatch }) {
    const useStyles = makeStyles((theme) => ({
        heroContent: {
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(8, 0, 6),
            height: "276px",
        },
        logo: {
            fontSize: "48px",
        },
    }));

    const classes = useStyles();

    return (
        <div className={classes.heroContent}>
            <Container maxWidth="sm">
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    FileRing&nbsp;
                    <CloudCircle className={classes.logo} />
                </Typography>

                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                    Share a file instantaneously and temporarily with someone!
                </Typography>
            </Container>
        </div>
    );
}

export default Header;
