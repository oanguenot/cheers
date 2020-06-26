import { addFileToBubbleCustomData, getOrCreateRoom } from "../modules/SDK";

const SET_BUBBLE = "SET_BUBBLE";

export { SET_BUBBLE };

export const initializeBubble = (dispatch) => {
    console.log("model::action initializeBubble");
    getOrCreateRoom().then((bubble) => {
        dispatch({ type: SET_BUBBLE, payload: { bubble: bubble } });
    });
};

export const updateDataInBubble = (data, bubble, dispatch) => {
    addFileToBubbleCustomData(data.fileId, data.guestId, data.publicLink, data.expirationDate, bubble)
        .then((updatedBubble) => {
            dispatch({ type: SET_BUBBLE, payload: { bubble: updatedBubble } });
        })
        .catch((err) => {});
};
