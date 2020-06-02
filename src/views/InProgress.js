import React from "react";

import Container from "@material-ui/core/Container";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import CloudCircle from "@material-ui/icons/CloudCircle";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

function InProgress({ dispatch }) {
    const useStyles = makeStyles((theme) => ({
        icon: {
            marginRight: theme.spacing(2),
        },
        progress: {
            width: "100%",
            "& > * + *": {
                marginTop: theme.spacing(2),
            },
        },
        placeHolder: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            minHeight: "40vh",
        },
        placeHolderLogo: {
            fontSize: "128px",
        },
        placeHolderTitle: {
            color: theme.palette.grey[800],
        },
    }));

    const classes = useStyles();

    return (
        <Container maxWidth="sm">
            <Grid container spacing={2} justify="center">
                <div className={classes.progress}>
                    <LinearProgress />
                </div>
                <div className={classes.placeHolder}>
                    <CloudCircle className={classes.placeHolderLogo} />
                    <Typography variant="h6" className={classes.placeHolderTitle}>
                        We are loading your data...
                    </Typography>
                    <Typography variant="h5">Please wait</Typography>
                </div>
            </Grid>
        </Container>
    );
}

export default InProgress;
