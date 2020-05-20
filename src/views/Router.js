import React, { useReducer } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Signin from "./Signin";
import Signed from "./Signed";

import ConnectionContext from "../contexts/connectionContext";

import { connectionReducer, initialConnectionState } from "../reducers/connectionReducer";

import { dispatcher } from "../modules/SDK";

function AppRouter() {
    const [connectionState, dispatch] = useReducer(connectionReducer, initialConnectionState);

    dispatcher(dispatch);
    return (
        <ConnectionContext.Provider value={connectionState}>
            <Router>
                <Route path="/" exact render={(props) => <Signin dispatch={dispatch} {...props} />} />
                <Route path="/signed" component={Signed} />
            </Router>
        </ConnectionContext.Provider>
    );
}

export default AppRouter;
