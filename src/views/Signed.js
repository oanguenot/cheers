import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { connectWithToken, initialize } from "../modules/SDK";
import "./Signed.css";

function Signed() {
    let location = useLocation();
    console.log("[signed] switch to main interface");

    let query = new URLSearchParams(location.search);
    const access_token = query.get("access_token");

    useEffect(() => {
        async function load() {
            await initialize();
            connectWithToken(access_token);
        }
        load();
    }, []);

    return (
        <div className="Signed">
            <header className="Signed-header">
                <h2>SIGNED!</h2>
            </header>
        </div>
    );
}

export default Signed;
