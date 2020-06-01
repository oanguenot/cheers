import { loadConfigFromServer, isValidConfig } from "./Config";
import { UPDATE_PROGRESS, UPDATE_COMPLETED, UPDATE_ERROR } from "../actions/shareAction";

let sdk = window.rainbowSDK.default;

let _config = null;
let _token = "";
let _shareDispatch = null;

export const shareDispatcher = (dispatch) => {
    _shareDispatch = dispatch;
};

export const connectWithToken = async (token) => {
    return new Promise((resolve, reject) => {
        document.addEventListener(sdk.RAINBOW_ONREADY, () => {
            console.log("[sdk] ready");
            sdk.connection
                .signinOnRainbowHostedWithToken(_token, _config.rainbow_host)
                .then((result) => {
                    console.log("[sdk] signed successfully", result);
                    resolve();
                })
                .catch((err) => {
                    console.error("[sdk] can't sign to Rainbow", err);
                    reject({ reason: "can't login" });
                });
        });

        document.addEventListener(sdk.RAINBOW_ONLOADED, () => {
            console.log("[sdk] loaded");

            sdk.initialize()
                .then(() => {
                    console.log("[sdk] initialized");
                })
                .catch((err) => {
                    console.error("[sdk] can't initialize - Rainbow SDK error", err);
                    reject({ reason: "No valid SDK" });
                });
        });

        if (!sdk) {
            console.error("[sdk] can't signin - Rainbow SDK not loaded correctly!");
            reject({ reason: "No SDK loaded" });
            return;
        }

        if (!token) {
            console.error("[sdk] can't signin - no valid token!");
            reject({ reason: "No valid token" });
            return;
        }

        _token = token;
        loadConfigFromServer()
            .then((config) => {
                if (!isValidConfig()) {
                    console.error("[sdk] can't signin - no valid config!");
                    reject({ reason: "No valid config" });
                    return;
                }
                _config = config;
                sdk.start();
                sdk.load();
            })
            .catch((err) => {
                console.error("[sdk] can't signin - can't get config!");
                reject({ reason: "No config" });
                return;
            });
    });
};

export const getQuota = async () => {
    if (!sdk) {
        console.error("[sdk] can't compute quota - Rainbow SDK not loaded correctly!");
        return;
    } else {
        try {
            const quota = await sdk.fileStorage.getUserQuotaConsumption();
            console.log("[sdk] quota found", quota);
            return quota;
        } catch (err) {
            console.error("[sdk] can't compute quota - error!", err);
            return;
        }
    }
};

export const getConversationFromContactId = async (id) => {
    try {
        const contact = await sdk.contacts.searchById(id);
        console.log("CONTACT:", contact);
        if (!contact) {
            console.error("Can't get conversation - no contact found");
            return;
        }
        const conversation = sdk.conversations.openConversationForContact(contact);
        if (!conversation) {
            console.error("Can't get conversation - no conversation");
        }
        return conversation;
    } catch (err) {
        console.error("Can't get conversation - error", err);
        return;
    }
};

export const shareFileInConversation = async (file, conversation) => {
    try {
        const message = await sdk.fileStorage.uploadFileToConversation(conversation, file);
        return message;
    } catch (err) {
        console.error("Can't share file - error", err);
        return;
    }
};

export const closeOpenedConversation = async (conversation) => {
    try {
        await sdk.conversations.closeConversation(conversation);
    } catch (err) {
        console.error("Can't close conversation - error", err);
    }
};

export const updateBubbleCustomData = async (fileId, guestId, publicURL, expirationDate, bubble) => {
    try {
        let customData = bubble.customData;

        const file = {
            guestId,
            publicURL,
            expirationDate,
        };

        console.log("UP.file", file);

        customData[fileId] = file;

        console.log("UP.custo", customData);

        return await sdk.bubbles.updateCustomDataForBubble(customData, bubble);
    } catch (err) {
        console.error("Can't update custom data - error", err);
    }
};

export const getSharedFilesFromBubble = async (bubble) => {
    try {
        const filesList = Object.keys(bubble.customData);

        if (filesList.length === 0) {
            return [];
        }

        let files = await sdk.fileStorage.getAllFilesSent();

        files = files.filter((file) => {
            return filesList.includes(file.id);
        });

        const filesWithData = files.map((file) => {
            let data = bubble.customData[file.id];
            data.file = file;
            return data;
        });

        console.log(">>>filesWithData", filesWithData);

        return filesWithData;
    } catch (err) {
        console.error("Can't get files - error", err);
    }
};

export const getOrCreateRoom = async () => {
    return new Promise((resolve, reject) => {
        let bubble = sdk.bubbles.getAllBubbles().filter((bubble) => {
            return bubble.name === "Sharing" && bubble.desc === "Created by Sharing application - do not remove";
        });

        if (bubble.length === 1) {
            console.log("[sdk] bubble found", bubble[0]);
            resolve(bubble[0]);
        }

        sdk.bubbles
            .createBubble("Sharing", "Created by Sharing application - do not remove")
            .then((bubble) => {
                resolve(bubble);
            })
            .catch((err) => {
                console.log("[sdk] can't create bubble", err);
                reject({ reason: "can't create bubble" });
            });
    });
};

/* --------------------------- SDK Listeners ----------------------------------- */

document.addEventListener(sdk.connection.RAINBOW_ONSIGNED, () => {
    console.log("[sdk] signed");
});

document.addEventListener(sdk.connection.RAINBOW_ONCONNECTIONSTATECHANGED, (state) => {
    console.log("[sdk] progress", state);
});

document.addEventListener(sdk.fileStorage.RAINBOW_ONCHUNKLOADMESSAGE, (event) => {
    console.log("[sdk] upload progress", event.detail);
    _shareDispatch({
        type: UPDATE_PROGRESS,
        payload: { id: event.detail.id, progress: event.detail.chunkPerformedPercent || 5 },
    });
});

document.addEventListener(sdk.fileStorage.RAINBOW_ONFILEUPLOADED, (event) => {
    console.log("[sdk] upload successfully", event.detail);
    _shareDispatch({ type: UPDATE_COMPLETED, payload: { id: event.detail.id } });
});

document.addEventListener(sdk.fileStorage.RAINBOW_ONFILEUPLOADED_ERROR, (event) => {
    console.log("[sdk] upload error", event.detail);
    _shareDispatch({ type: UPDATE_ERROR, payload: { id: event.detail.id } });
});
