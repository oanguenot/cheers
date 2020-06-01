import { connectWithToken, getOrCreateRoom } from "../modules/SDK";

const SWITCH_TO_CONNECTED = "SWITCH_TO_CONNECTED";
const SWITCH_TO_DISCONNECTED = "SWITCH_TO_DISCONNETED";
const SWITCH_TO_INPROGRESS = "SWITCH_TO_DISCONNSWITCH_TO_INPROGRESSTED";
const SWITCH_TO_ERROR = "SWITCH_TO_ERROR";
const SWITCH_TO_ABORTED = "SWITCH_TO_ABORTED";
const SET_BUBBLE = "SET_BUBBLE";

export {
    SWITCH_TO_CONNECTED,
    SWITCH_TO_DISCONNECTED,
    SWITCH_TO_ERROR,
    SWITCH_TO_INPROGRESS,
    SWITCH_TO_ABORTED,
    SET_BUBBLE,
};

export const signinWithOAuthToken = (oauth_token, dispatch) => {
    dispatch({ type: SWITCH_TO_INPROGRESS, payload: {} });

    // 1. signin
    connectWithToken(oauth_token)
        .then(() => {
            //2. get bubble
            return getOrCreateRoom();
        })
        .then((bubble) => {
            dispatch({ type: SET_BUBBLE, payload: { bubble: bubble } });
            dispatch({ type: SWITCH_TO_CONNECTED, payload: {} });
        })
        .catch((err) => {
            dispatch({ type: SWITCH_TO_ABORTED, payload: err });
        });
};
