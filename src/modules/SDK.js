import { loadConfigFromServer, isValidConfig } from "./Config";

let sdk = window.rainbowSDK.default;

let _config = null;
let _token = "";

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

export const getConversationFromContactId = (id) => {
    return new Promise((resolve, reject) => {
        sdk.contacts
            .searchById(id)
            .then((guest) => {
                if (!guest) {
                    console.error("[sdk] guest not found");
                    reject({ reason: "Can't find guest" });
                    return;
                }
                console.log("[sdk] guest found by id", guest);

                return sdk.conversations.openConversationForContact(guest);
            })
            .then((conversation) => {
                if (!conversation) {
                    console.error("[sdk] can't get conversation - no conversation");
                    reject({ reason: "Can't get conversation" });
                    return;
                }

                resolve(conversation);
            })
            .catch((err) => {
                console.error("[sdk] can't get conversation from guest id", err);
                reject({ reason: "Can't get conversation" });
            });
    });
};

export const shareFileInConversation = async (file, conversation, onUploadProgress, onUploadEnded, onUploadError) => {
    const onChunk = (event) => {
        console.log("[sdk] upload progress", event.detail);
        onUploadProgress(event.detail.id, event.detail.chunkPerformedPercent || 5);
    };

    const onSuccess = (event) => {
        console.log("[sdk] upload successfully", event.detail);
        onUploadEnded(event.detail.id);
    };

    const onError = (event) => {
        console.log("[sdk] upload error", event.detail);
        onUploadError(event.detail.id);
    };

    const resetListener = () => {
        document.removeEventListener(sdk.fileStorage.RAINBOW_ONCHUNKLOADMESSAGE, onChunk);
        document.removeEventListener(sdk.fileStorage.RAINBOW_ONFILEUPLOADED, onSuccess);
        document.removeEventListener(sdk.fileStorage.RAINBOW_ONFILEUPLOADED_ERROR, onError);
    };

    const addListener = () => {
        document.addEventListener(sdk.fileStorage.RAINBOW_ONCHUNKLOADMESSAGE, onChunk);
        document.addEventListener(sdk.fileStorage.RAINBOW_ONFILEUPLOADED, onSuccess);
        document.addEventListener(sdk.fileStorage.RAINBOW_ONFILEUPLOADED_ERROR, onError);
    };

    return new Promise((resolve, reject) => {
        addListener();

        sdk.fileStorage
            .uploadFileToConversation(conversation, file)
            .then((message) => {
                console.log("[sdk] file shared", message);
                resetListener();
                resolve(message);
            })
            .catch((err) => {
                console.error("[sdk] can't share file - error", err);
                resetListener();
                reject();
            });
    });
};

export const closeOpenedConversation = (conversation) => {
    return new Promise((resolve, reject) => {
        sdk.conversations
            .closeConversation(conversation)
            .then(() => {
                console.log("[sdk] conversation closed");
                resolve();
            })
            .catch((err) => {
                console.error("[sdk] can't close conversation - error", err);
                reject();
            });
    });
};

export const addFileToBubbleCustomData = (fileId, guestId, publicURL, expirationDate, bubble) => {
    return new Promise((resolve, reject) => {
        const data = {
            guestId,
            publicURL,
            expirationDate,
        };

        const customData = {};
        customData[fileId] = data;

        const updatedCustomData = Object.assign(bubble.customData, customData);

        sdk.bubbles
            .updateCustomDataForBubble(updatedCustomData, bubble)
            .then((updatedBubble) => {
                console.log("[sdk] bubble updated", updatedBubble);
                resolve(bubble);
            })
            .catch((err) => {
                console.error("[sdk] can't update custom data", err);
                reject();
            });
    });
};

export const removeFileFromBubbleCustomData = (fileId, bubble) => {
    return new Promise((resolve, reject) => {
        let updatedCustomData = Object.assign({}, bubble.customData);
        delete updatedCustomData[fileId];

        sdk.bubbles
            .updateCustomDataForBubble(updatedCustomData, bubble)
            .then((updatedBubble) => {
                console.log("[sdk] bubble updated", updatedBubble);
                resolve(bubble);
            })
            .catch((err) => {
                console.error("[sdk] can't update custom data", err);
                reject();
            });
    });
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
            let data = Object.assign({}, bubble.customData[file.id]);
            data.file = file;
            return data;
        });

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
            return;
        }

        sdk.bubbles
            .createBubble("Sharing", "Created by Sharing application - do not remove")
            .then((bubble) => {
                console.log("[sdk] bubble created", bubble);
                resolve(bubble);
            })
            .catch((err) => {
                console.log("[sdk] can't create bubble", err);
                reject({ reason: "can't create bubble" });
            });
    });
};

export const deleteFile = async (file) => {
    return new Promise((resolve, reject) => {
        sdk.fileStorage
            .removeFile(file)
            .then((res) => {
                console.log("[sdk] file deleted", file.id);
            })
            .catch((err) => {
                console.log("[sdk] can't delete file", file.id);
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
