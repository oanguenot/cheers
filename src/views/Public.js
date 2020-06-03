import React, { useEffect, useContext, useReducer } from "react";
import { useLocation, Redirect } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";

import ConnectionContext from "../contexts/connectionContext";
import TopBar from "./TopBar";
import Footer from "./Footer";
import InProgress from "./InProgress";
import Header from "./Header";

import ShareContext from "../contexts/shareContext";

import { shareReducer, initialShareState } from "../reducers/shareReducer";
import { getInfoFromLink } from "../modules/Link";
import { getValidTokenForGuest } from "../modules/Guest";

function Public({ dispatch }) {
    let location = useLocation();

    const [shareState, dispatcher] = useReducer(shareReducer, initialShareState);

    let query = new URLSearchParams(location.search);
    const link = query.get("link");

    const appState = useContext(ConnectionContext);

    useEffect(() => {
        getInfoFromLink(link)
            .then((info) => {
                console.log(">>>INFO", info);
                return getValidTokenForGuest(info.guestId);
            })
            .then((token) => {
                console.log("token", token);
            })
            .catch((err) => {
                console.error(">>> ERROR", err);
            });
        //signinWithOAuthToken(access_token, dispatch);
    }, []);

    useEffect(() => {}, [appState]);

    const useStyles = makeStyles((theme) => ({
        connected_area: {
            height: "calc(100% - 200px)",
        },
    }));

    const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />
            <TopBar />
            <main>
                <Header />
                {appState.connectionState === "connected" && (
                    <ShareContext.Provider value={shareState}>
                        <div className={classes.connected_area}>
                            <h1>Welcome guest!</h1>
                        </div>
                    </ShareContext.Provider>
                )}
                {(appState.connectionState === "inprogress" || appState.connectionState === "error") && <InProgress />}
            </main>
            <Footer />
        </React.Fragment>
    );
}

export default Public;
