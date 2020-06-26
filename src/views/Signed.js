import React, { useEffect, useContext, useReducer } from "react";
import { useLocation, Redirect } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";

import TopBar from "./TopBar";
import Files from "./Files";
import Uploader from "./Uploader";
import Footer from "./Footer";
import InProgress from "./InProgress";
import Header from "./Header";

import ConnectionContext from "../contexts/connectionContext";
import ShareContext from "../contexts/shareContext";
import BubbleContext from "../contexts/bubbleContext";

import { shareReducer, initialShareState } from "../reducers/shareReducer";
import { bubbleReducer, initialBubbleState } from "../reducers/bubbleReducer";
import { STATE } from "../reducers/connectionReducer";
import { signinWithOAuthToken } from "../actions/connectionAction";
import { initializeBubble } from "../actions/bubbleAction";

function Signed({ dispatch }) {
    const appState = useContext(ConnectionContext);

    let location = useLocation();

    const [shareState, dispatchShare] = useReducer(shareReducer, initialShareState);
    const [bubbleState, dispatchBubble] = useReducer(bubbleReducer, initialBubbleState);

    let query = new URLSearchParams(location.search);
    const access_token = query.get("access_token");

    useEffect(() => {
        signinWithOAuthToken(access_token, dispatch);
    }, []);

    useEffect(() => {
        if (appState.connectionState === "connected") {
            initializeBubble(dispatchBubble);
        }
    }, [appState.connectionState, dispatchBubble]);

    const useStyles = makeStyles((theme) => ({
        connected_area: {
            height: "calc(100% - 200px)",
        },
    }));

    const classes = useStyles();

    return (
        <React.Fragment>
            {appState.connectionState === STATE.ERROR && <Redirect to="/" />}
            <CssBaseline />
            <TopBar />
            <main>
                <Header />
                {appState.connectionState === STATE.CONNECTED && (
                    <BubbleContext.Provider value={bubbleState}>
                        <ShareContext.Provider value={shareState}>
                            <div className={classes.connected_area}>
                                <Uploader dispatchShare={dispatchShare} dispatchBubble={dispatchBubble} />
                                <Files dispatchShare={dispatchShare} dispatchBubble={dispatchBubble} />
                            </div>
                        </ShareContext.Provider>
                    </BubbleContext.Provider>
                )}
                {appState.connectionState === STATE.INPROGRESS && <InProgress />}
            </main>
            <Footer />
        </React.Fragment>
    );
}

export default Signed;
