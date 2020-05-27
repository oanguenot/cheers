import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import AppRouter from "./views/Router";
import * as serviceWorker from "./serviceWorker";
import moment from "moment";

const load = () => {
    let lang = navigator.language || navigator.userLanguage || "en-US";

    moment.locale(lang, {
        week: {
            dow: 1,
            doy: 4,
        },
    });
};

// Wait for the DOM complete to start
if (document.readyState !== "complete") {
    document.addEventListener("DOMContentLoaded", load);
} else {
    load();
}

ReactDOM.render(
    <React.StrictMode>
        <AppRouter />
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
