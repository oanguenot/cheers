import React from "react";
import logo from "./logo.svg";
import "./App.css";
import sdk from "rainbow-web-sdk";

function App() {
    const initialize = () => {
        document.addEventListener(sdk.RAINBOW_ONREADY, () => {
            console.log("[sdk] ready");
        });

        document.addEventListener(sdk.RAINBOW_ONLOADED, () => {
            console.log("[sdk] loaded");

            sdk.initialize()
                .then(() => {
                    console.log("[sdk] initialized");
                })
                .catch((err) => {
                    console.log("[sdk] error", err);
                });
        });

        sdk.start();
        sdk.load();
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <button onClick={initialize}>Start</button>
            </header>
        </div>
    );
}

export default App;
