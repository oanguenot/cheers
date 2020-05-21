import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./Signin.css";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import FileCopy from "@material-ui/icons/FileCopy";
import { palette } from "@material-ui/system";

import Image from "material-ui-image";
import { makeStyles } from "@material-ui/core/styles";

import { signinWithOauth } from "../modules/Oauth";
import { SWITCH_TO_DISCONNECTED } from "../actions/connectionAction";
import { requestId } from "../modules/Config";

function Signin({ dispatch }) {
    useEffect(() => {
        dispatch({ type: SWITCH_TO_DISCONNECTED, payload: {} });

        const test = async () => {
            const id = await requestId(1000);
            console.log(">>>", id);
        };
        test();
    }, []);

    function Copyright() {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {"Copyright © "}
                <Link color="inherit" href="https://material-ui.com/">
                    ALE-International
                </Link>{" "}
                {new Date().getFullYear()}
                {"."}
            </Typography>
        );
    }

    const init = async (e) => {
        e.stopPropagation();
        signinWithOauth();
    };

    const useStyles = makeStyles((theme) => ({
        root: {
            height: "100vh",
        },
        image: {
            backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundRepeat: "no-repeat",
            backgroundColor: theme.palette.type === "light" ? theme.palette.grey[50] : theme.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
        },
        paper: {
            margin: theme.spacing(8, 4),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        avatar: {
            margin: theme.spacing(10, 0, 1),
            backgroundColor: theme.palette.secondary.main,
        },
        form: {
            width: "100%", // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
        title: {
            fontWeight: "bold",
            marginBottom: theme.spacing(1),
        },
        subtitle: {
            color: theme.palette.type === "light" ? theme.palette.grey[700] : theme.palette.grey[50],
            marginBottom: theme.spacing(1),
        },
        rainbow: {
            width: "32px",
            paddingBottom: theme.spacing(4),
        },
        logo: {
            fontSize: "112px",
            margin: theme.spacing(1, 1, 4),
            color: theme.palette.grey[800],
        },
    }));

    const classes = useStyles();

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <form className={classes.paper}>
                    <Typography component="h1" variant="h1" className={classes.title}>
                        SHARING&nbsp;
                        <img className={classes.rainbow} src="./rainbow.png" alt="rainbow" />
                    </Typography>

                    <Typography className={classes.subtitle} component="h5" variant="h5">
                        Share files temporarily
                    </Typography>
                    <FileCopy className={classes.logo} />

                    <hr />
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <div className={classes.form} noValidate>
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={init}
                        >
                            Sign In With Your Rainbow Account
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="https://web.openrainbow.com" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>

                        <Box mt={5}>
                            <Copyright />
                        </Box>
                        <Grid container>
                            <Grid item></Grid>
                        </Grid>
                    </div>
                </form>
            </Grid>
        </Grid>
    );
}

export default Signin;
