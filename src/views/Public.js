import React, { useEffect, useContext, useReducer } from "react";
import { useLocation, Redirect } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";

import ConnectionContext from "../contexts/connectionContext";
import TopBar from "./TopBar";
import Footer from "./Footer";
import InProgress from "./InProgress";
import Header from "./Header";
import GuestError from "./GuestError";

import GuestContext from "../contexts/guestContext";

import { guestReducer, initialGuestState } from "../reducers/guestReducer";

import { signinWithLink } from "../actions/connectionAction";
import Guest from "./Guest";

function Public({ dispatch }) {
    let location = useLocation();

    const [guestState, dispatchGuest] = useReducer(guestReducer, initialGuestState);

    let query = new URLSearchParams(location.search);
    const link = query.get("link");

    const appState = useContext(ConnectionContext);

    useEffect(() => {
        signinWithLink(link, dispatch);
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
                    <GuestContext.Provider value={guestState}>
                        <div className={classes.connected_area}>
                            <Guest dispatch={dispatchGuest} />
                        </div>
                    </GuestContext.Provider>
                )}
                {appState.connectionState === "inprogress" && <InProgress />}
                {(appState.connectionState === "aborded" || appState.connectionState === "error") && <GuestError />}
            </main>
            <Footer />
        </React.Fragment>
    );
}

export default Public;
