import { loadConfigFromServer } from "./Config";
import {
    SWITCH_TO_DISCONNECTED,
    SWITCH_TO_CONNECTED,
    SWITCH_TO_ERROR,
    SWITCH_TO_INPROGRESS,
    SWITCH_TO_ABORTED,
} from "../actions/connectionAction";

let sdk = window.rainbowSDK.default;

let _config = null;
let _token = "";
let _dispatch = null;

const signinOnRainbow = async (token, host) => {
    try {
        const result = await sdk.connection.signinOnRainbowHostedWithToken(_token, _config.rainbow_host);
        console.log("[sdk] signed from await", result);
        _dispatch({ type: SWITCH_TO_CONNECTED, payload: {} });
    } catch (err) {
        console.error("[sdk] can't sign to Rainbow", err);
        _dispatch({ type: SWITCH_TO_ERROR, payload: { error: err } });
    }
};

document.addEventListener(sdk.RAINBOW_ONREADY, () => {
    console.log("[sdk] ready");
    signinOnRainbow(_token, _config.rainbow_host);
});

document.addEventListener(sdk.RAINBOW_ONLOADED, () => {
    console.log("[sdk] loaded");

    sdk.initialize()
        .then(() => {
            console.log("[sdk] initialized");
        })
        .catch((err) => {
            console.error("[sdk] can't initialize - Rainbow SDK error", err);
        });
});

document.addEventListener(sdk.connection.RAINBOW_ONSIGNED, () => {
    console.log("[sdk] signed");
});

document.addEventListener(sdk.connection.RAINBOW_ONCONNECTIONSTATECHANGED, (state) => {
    console.log("[sdk] progress", state);
});

export const initialize = async () => {
    sdk.start();
    sdk.load();
};

export const dispatcher = (dispatch) => {
    _dispatch = dispatch;
};

export const connectWithToken = async (token) => {
    if (!sdk) {
        console.error("[sdk] can't signin - Rainbow SDK not loaded correctly!");
        _dispatch({ type: SWITCH_TO_ABORTED, payload: { reason: "sdk" } });
        return;
    }

    if (!token) {
        console.error("[sdk] can't signin - no valid token!");
        _dispatch({ type: SWITCH_TO_ABORTED, payload: { reason: "token" } });
        return;
    }

    _token = token;
    _config = await loadConfigFromServer();

    if (!_config) {
        console.error("[sdk] can't signin - no valid config!");
        _dispatch({ type: SWITCH_TO_ABORTED, payload: { reason: "config" } });
        return;
    }

    _dispatch({ type: SWITCH_TO_INPROGRESS, payload: {} });

    initialize();
};
