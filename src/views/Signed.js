import React, { useEffect, useContext, useReducer } from "react";
import { useLocation, Redirect } from "react-router-dom";

import { connectWithToken } from "../modules/SDK";
import "./Signed.css";

import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";

import ConnectionContext from "../contexts/connectionContext";
import TopBar from "./TopBar";
import Files from "./Files";
import Uploader from "./Uploader";
import Footer from "./Footer";
import InProgress from "./InProgress";
import Header from "./Header";

import ShareContext from "../contexts/shareContext";

import { shareReducer, initialShareState } from "../reducers/shareReducer";

function Signed() {
    let location = useLocation();

    const [bubbleState, dispatch] = useReducer(shareReducer, initialShareState);

    let query = new URLSearchParams(location.search);
    const access_token = query.get("access_token");

    const appState = useContext(ConnectionContext);

    useEffect(() => {
        connectWithToken(access_token);
    }, []);

    useEffect(() => {}, [appState]);

    const useStyles = makeStyles((theme) => ({
        connected_area: {
            height: "calc(100% - 340px)",
        },
    }));

    const classes = useStyles();

    return (
        <React.Fragment>
            {appState.connectionState === "error" && <Redirect to="/" />}
            <CssBaseline />
            <TopBar />
            <main>
                <Header />
                {appState.connectionState === "connected" && (
                    <ShareContext.Provider value={bubbleState}>
                        <div className={classes.connected_area}>
                            <Uploader />
                            <Files dispatch={dispatch} />
                        </div>
                    </ShareContext.Provider>
                )}
                {(appState.connectionState === "inprogress" || appState.connectionState === "error") && <InProgress />}
            </main>
            <Footer />
        </React.Fragment>
    );
}

export default Signed;
