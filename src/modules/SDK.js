import { loadConfigFromServer } from "./Config";
import {
    SWITCH_TO_DISCONNECTED,
    SWITCH_TO_CONNECTED,
    SWITCH_TO_ERROR,
    SWITCH_TO_INPROGRESS,
    SWITCH_TO_ABORTED,
} from "../actions/connectionAction";
import { UPDATE_PROGRESS, UPDATE_COMPLETED, UPDATE_ERROR } from "../actions/shareAction";

let sdk = window.rainbowSDK.default;

let _config = null;
let _token = "";
let _dispatch = null;
let _shareDispatch = null;

const signinOnRainbow = async (token, host) => {
    try {
        const result = await sdk.connection.signinOnRainbowHostedWithToken(_token, _config.rainbow_host);
        console.log("[sdk] signed successfully", result);
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

export const initialize = async () => {
    sdk.start();
    sdk.load();
};

export const dispatcher = (dispatch) => {
    _dispatch = dispatch;
};

export const shareDispatcher = (dispatch) => {
    _shareDispatch = dispatch;
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

export const updateBubbleCustomData = async (message, bubble) => {
    try {
        let customData = bubble.customData;

        if (!customData.files) {
            customData.files = [];
        }

        customData.files.push(message.fileId);

        return await sdk.bubbles.updateCustomDataForBubble(customData, bubble);
    } catch (err) {
        console.error("Can't update custom data - error", err);
    }
};

export const getSharedFilesFromBubble = async (bubble) => {
    try {
        const customData = bubble.customData;

        const fileIdShared = customData.files || [];

        let files = await sdk.fileStorage.getAllFilesSent();

        console.log(">>>FILES", files);

        files = files.filter((file) => {
            if (fileIdShared.length === 0) {
                return false;
            }

            return fileIdShared.includes(file.id);
        });

        console.log(">>>INCLUDES", files);

        return files;
    } catch (err) {
        console.error("Can't get files - error", err);
    }
};

export const getOrCreateRoom = async () => {
    try {
        let bubble = await sdk.bubbles.getAllBubbles().filter((bubble) => {
            return bubble.name === "Sharing" && bubble.desc === "Created by Sharing application - do not remove";
        });

        if (bubble.length === 1) {
            console.log("BUBBLE1", bubble[0]);
            return bubble[0];
        }

        bubble = await sdk.bubbles.createBubble("Sharing", "Created by Sharing application - do not remove");

        console.log("BUBBLE", bubble);

        return bubble;
    } catch (err) {
        console.error("can't create room - error", err);
    }
};
