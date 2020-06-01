import {
    SWITCH_TO_CONNECTED,
    SWITCH_TO_DISCONNECTED,
    SWITCH_TO_ERROR,
    SWITCH_TO_INPROGRESS,
    SWITCH_TO_ABORTED,
    SET_BUBBLE,
} from "../actions/connectionAction";

const initialConnectionState = {
    connectionState: "disconnected",
};

export const STATE = {
    DISCONNECTED: "disconnected",
    INPROGRESS: "inprogress",
    CONNECTED: "connected",
    ERROR: "error",
    ABORTED: "aborted",
    bubble: null,
};

const connectionReducer = (state = initialConnectionState, action) => {
    console.log("[connection state] --> ", action.type);

    switch (action.type) {
        case SWITCH_TO_CONNECTED:
            return { ...state, connectionState: STATE.CONNECTED };
        case SWITCH_TO_DISCONNECTED:
            return { ...state, connectionState: STATE.DISCONNECTED };
        case SWITCH_TO_ERROR:
            return { ...state, connectionState: STATE.ERROR };
        case SWITCH_TO_INPROGRESS:
            return { ...state, connectionState: STATE.INPROGRESS };
        case SWITCH_TO_ABORTED:
            return { ...state, connectionState: STATE.ERROR };
        case SET_BUBBLE:
            return { ...state, bubble: action.payload.bubble };
        default:
            return state;
    }
};

export { connectionReducer, initialConnectionState };
