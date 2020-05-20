import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import "./index.css";
import AppRouter from "./views/Router";
import * as serviceWorker from "./serviceWorker";
import { loadConfigFromServer } from "./modules/Config";

ReactDOM.render(
    <React.StrictMode>
        <RecoilRoot>
            <AppRouter />
        </RecoilRoot>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

async function load() {
    await loadConfigFromServer();
    console.log("[index] config loaded successfully");
}

//Get configuration from server
load();
