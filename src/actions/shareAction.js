import moment from "moment";

import { requestId } from "../modules/Config";
import {
    getConversationFromContactId,
    shareFileInConversation,
    closeOpenedConversation,
    deleteFile,
} from "../modules/SDK";
import { generateLink } from "../modules/Link";

const UPDATE_PROGRESS = "UPDATE_PROGRESS";
const UPDATE_CANCELED = "UPDATE_CANCELED";
const UPDATE_COMPLETED = "UPDATE_COMPLETED";
const UPDATE_ERROR = "UPDATE_ERROR";
const UPDATE_START = "UPDATE_START";
const DELETE_PROGRESS = "DELETE_PROGRESS";
const DELETE_ERROR = "DELETE_ERROR";
const DELETE_COMPLETED = "DELETE_COMPLETED";

export {
    UPDATE_PROGRESS,
    UPDATE_CANCELED,
    UPDATE_COMPLETED,
    UPDATE_ERROR,
    UPDATE_START,
    DELETE_COMPLETED,
    DELETE_PROGRESS,
    DELETE_ERROR,
};

export const uploadFile = (file, ttl, dispatch) => {
    const onFileUploadProgress = (id, progress) => {
        dispatch({ type: UPDATE_PROGRESS, payload: { id, progress } });
    };

    const onFileUploadError = (id) => {
        dispatch({ type: UPDATE_ERROR, payload: { id } });
    };

    const onFileUploadDone = (id) => {
        dispatch({ type: UPDATE_COMPLETED, payload: { id } });
    };

    return new Promise((resolve, reject) => {
        console.log("model::action uploadFile");

        dispatch({ type: UPDATE_START, payload: {} });

        const expirationDate = moment(Date.now()).add(ttl, "seconds").toDate();
        let fileId = null;
        let guestId = null;
        let conversation = null;
        let publicLink = null;

        requestId(ttl)
            .then((id) => {
                guestId = id;
                return getConversationFromContactId(guestId);
            })
            .then((conv) => {
                conversation = conv;
                return shareFileInConversation(
                    file,
                    conversation,
                    onFileUploadProgress,
                    onFileUploadDone,
                    onFileUploadError
                );
            })
            .then((message) => {
                fileId = message.fileId;
                return generateLink(guestId, fileId);
            })
            .then((link) => {
                publicLink = link;
                return closeOpenedConversation(conversation);
            })
            .then(() => {
                dispatch({ type: UPDATE_COMPLETED, payload: {} });

                const data = {
                    fileId,
                    guestId,
                    publicLink,
                    expirationDate,
                };

                resolve(data);
            })
            .catch((err) => {
                dispatch({ type: UPDATE_ERROR, payload: {} });
                reject();
            });
    });
};

export const removeFile = async (file, dispatch) => {
    return new Promise((resolve, reject) => {
        console.log("model::action uploadFile");

        dispatch({ type: DELETE_PROGRESS, payload: {} });

        deleteFile(file)
            .then((res) => {
                dispatch({ type: DELETE_COMPLETED, payload: {} });
                resolve();
            })
            .catch((err) => {
                dispatch({ type: DELETE_ERROR, payload: {} });
                reject();
            });
    });
};
