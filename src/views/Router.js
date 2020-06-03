import React, { useReducer } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Signin from "./Signin";
import Signed from "./Signed";
import Public from "./Public";

import ConnectionContext from "../contexts/connectionContext";

import { connectionReducer, initialConnectionState } from "../reducers/connectionReducer";

function AppRouter() {
    const [connectionState, dispatch] = useReducer(connectionReducer, initialConnectionState);

    return (
        <ConnectionContext.Provider value={connectionState}>
            <Router>
                <Route path="/" exact render={(props) => <Signin dispatch={dispatch} {...props} />} />
                <Route path="/signed" render={(props) => <Signed dispatch={dispatch} {...props} />} />
                <Route path="/public" render={(props) => <Public dispatch={dispatch} {...props} />} />
            </Router>
        </ConnectionContext.Provider>
    );
}

export default AppRouter;
