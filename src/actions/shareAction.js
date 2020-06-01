import moment from "moment";

import { requestId } from "../modules/Config";
import {
    getConversationFromContactId,
    shareFileInConversation,
    closeOpenedConversation,
    updateBubbleCustomData,
} from "../modules/SDK";
import { generateLink } from "../modules/Link";

const UPDATE_PROGRESS = "UPDATE_PROGRESS";
const UPDATE_CANCELED = "UPDATE_CANCELED";
const UPDATE_COMPLETED = "UPDATE_COMPLETED";
const UPDATE_ERROR = "UPDATE_ERROR";
const UPDATE_START = "UPDATE_START";

export { UPDATE_PROGRESS, UPDATE_CANCELED, UPDATE_COMPLETED, UPDATE_ERROR, UPDATE_START };

export const uploadFile = (file, ttl, bubble, dispatch) => {
    const onFileUploadProgress = (id, progress) => {
        dispatch({ type: UPDATE_PROGRESS, payload: { id, progress } });
    };

    const onFileUploadError = (id) => {
        dispatch({ type: UPDATE_ERROR, payload: { id } });
    };

    const onFileUploadDone = (id) => {
        dispatch({ type: UPDATE_COMPLETED, payload: { id } });
    };

    dispatch({ type: UPDATE_PROGRESS, payload: {} });

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
            return updateBubbleCustomData(fileId, guestId, publicLink, expirationDate, bubble);
        })
        .then((updatedBubble) => {
            //dispatch({ type: SET_BUBBLE, payload: { bubble: updatedBubble } });
            dispatch({ type: UPDATE_COMPLETED, payload: {} });
        })
        .catch((err) => {
            dispatch({ type: UPDATE_ERROR, payload: {} });
        });

    // Generate GuestID
};
