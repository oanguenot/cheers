import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Signin from "./Signin";
import Signed from "./Signed";

function AppRouter() {
    return (
        <Router>
            <Route path="/" exact component={Signin} />
            <Route path="/signed" component={Signed} />
        </Router>
    );
}

export default AppRouter;
