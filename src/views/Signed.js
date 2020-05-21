import React, { useEffect, useContext } from "react";
import { useLocation, Redirect } from "react-router-dom";

import { connectWithToken, initialize } from "../modules/SDK";
import "./Signed.css";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import FileCopy from "@material-ui/icons/FileCopy";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import { Table } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";

import ConnectionContext from "../contexts/connectionContext";

function Signed() {
    let location = useLocation();
    console.log("[signed] switch to main interface");

    let query = new URLSearchParams(location.search);
    const access_token = query.get("access_token");

    const appState = useContext(ConnectionContext);

    useEffect(() => {
        connectWithToken(access_token);
    }, []);

    useEffect(() => {
        console.log(">>>STATE", appState);
    }, [appState]);

    const useStyles = makeStyles((theme) => ({
        icon: {
            marginRight: theme.spacing(2),
        },
        heroContent: {
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(8, 0, 6),
        },
        heroButtons: {
            marginTop: theme.spacing(4),
        },
        cardGrid: {
            paddingTop: theme.spacing(8),
            paddingBottom: theme.spacing(8),
        },
        card: {
            height: "100%",
            display: "flex",
            flexDirection: "column",
        },
        cardMedia: {
            paddingTop: "56.25%", // 16:9
        },
        cardContent: {
            flexGrow: 1,
        },
        footer: {
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(6),
            display: "block",
            left: "0",
            bottom: "0",
            width: "100%",
            position: "fixed",
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
            color: theme.palette.grey[10],
        },
        placeHolderTitle: {
            color: theme.palette.grey[800],
        },
    }));

    function Copyright() {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {"Copyright © "}
                <Link color="inherit" href="https://www.al-enterprise.com/">
                    Alcatel-Lucent Enterprise
                </Link>{" "}
                {new Date().getFullYear()}
                {"."}
            </Typography>
        );
    }

    function generate(element) {
        return [0, 1, 2].map((value) =>
            React.cloneElement(element, {
                key: value,
            })
        );
    }

    const classes = useStyles();

    return (
        <React.Fragment>
            {appState.connectionState === "error" && <Redirect to="/" />}
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                    <FileCopy className={classes.icon} />
                    <Typography variant="h6" color="inherit" noWrap>
                        SHARING
                    </Typography>
                </Toolbar>
            </AppBar>
            <main>
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            SHARING
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            Share a file temporarily with someone or several persons instantaneously !
                        </Typography>
                    </Container>
                </div>
                {appState.connectionState === "connected" && (
                    <div>
                        <Container maxWidth="sm">
                            <div className={classes.heroButtons}>
                                <Grid container spacing={2} justify="center">
                                    <Grid item>
                                        <input type="file" />
                                        <Button variant="contained" color="primary">
                                            SHARE
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </Container>
                        <Container className={classes.cardGrid} maxWidth="md">
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" className={classes.title}>
                                    Files currently shared
                                </Typography>
                                <div className={classes.demo}>
                                    <List dense={true}>
                                        {generate(
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <FolderIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="Math-TD-n4" secondary="Devoir à rendre" />
                                                <ListItemSecondaryAction>
                                                    <IconButton edge="end" aria-label="delete">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        )}
                                    </List>
                                </div>
                            </Grid>
                        </Container>
                    </div>
                )}
                {(appState.connectionState === "inprogress" || appState.connectionState === "error") && (
                    <Container maxWidth="sm">
                        <Grid container spacing={2} justify="center">
                            <div className={classes.progress}>
                                <LinearProgress />
                            </div>
                            <div className={classes.placeHolder}>
                                <FileCopy className={classes.placeHolderLogo} />
                                <Typography variant="h6" className={classes.placeHolderTitle}>
                                    We are loading your data...
                                </Typography>
                                <Typography variant="h5">Please wait</Typography>
                            </div>
                        </Grid>
                    </Container>
                )}
            </main>
            <footer className={classes.footer}>
                <Typography variant="h6" align="center" gutterBottom>
                    SHARING
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    <i>Propulsed by Rainbow!</i>
                </Typography>
                <Copyright />
            </footer>
        </React.Fragment>
    );
}

export default Signed;
