import { loadConfigFromServer } from "./Config";

let sdk = window.rainbowSDK.default;

let config = null;

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
            console.error("[sdk] can't initialize - Rainbow SDK error", err);
        });
});

document.addEventListener(sdk.connection.RAINBOW_ONSIGNED, () => {
    console.log("[sdk] signed");
});

export const initialize = async () => {
    if (!sdk) {
        console.error("[sdk] can't signin - Rainbow SDK not loaded correctly!");
        return;
    }

    config = await loadConfigFromServer();

    sdk.start();
    sdk.load();
};

export const connectWithToken = (token) => {
    if (!sdk) {
        console.error("[sdk] can't signin - Rainbow SDK not loaded correctly!");
        return;
    }

    if (!token) {
        console.error("[sdk] can't signin - no valid token!");
        return;
    }

    if (!config) {
        console.error("[sdk] can't signin - no config!");
        return;
    }

    sdk.connection.signinOnRainbowHostedWithToken(token, config.rainbow_host);
};
