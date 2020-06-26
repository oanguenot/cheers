import { addFileToBubbleCustomData, getOrCreateRoom, removeFileFromBubbleCustomData } from "../modules/SDK";

const SET_BUBBLE = "SET_BUBBLE";

export { SET_BUBBLE };

export const initializeBubble = (dispatch) => {
    console.log("model::action initializeBubble");
    getOrCreateRoom().then((bubble) => {
        dispatch({ type: SET_BUBBLE, payload: { bubble: bubble } });
    });
};

export const addFileToBubble = (data, bubble, dispatch) => {
    console.log("model::action addFileToBubble");
    addFileToBubbleCustomData(data.fileId, data.guestId, data.publicLink, data.expirationDate, bubble)
        .then((updatedBubble) => {
            dispatch({ type: SET_BUBBLE, payload: { bubble: updatedBubble } });
        })
        .catch((err) => {});
};

export const removeFileFromBubble = (fileDescriptor, bubble, dispatch) => {
    console.log("model::action removeFileFromBubble");
    removeFileFromBubbleCustomData(fileDescriptor.id, bubble)
        .then((updatedBubble) => {
            dispatch({ type: SET_BUBBLE, payload: { bubble: updatedBubble } });
        })
        .catch((err) => {});
};
