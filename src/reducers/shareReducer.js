import {
    SET_BUBBLE,
    UPDATE_PROGRESS,
    UPDATE_COMPLETED,
    UPDATE_CANCELED,
    UPDATE_ERROR,
    UPDATE_START,
} from "../actions/shareAction";

export const UPLOAD_STATE = {
    NOT_STARTED: "notstarted",
    INPROGRESS: "inprogress",
    SUCCESS: "success",
    ERROR: "error",
    ABORTED: "aborted",
};

const initialShareState = {
    bubble: null,
    progress: 0,
    uploadInProgress: false,
    lastFilesUpdate: new Date(),
    uploadStatus: UPLOAD_STATE.NOT_STARTED,
};

const shareReducer = (state = initialShareState, action) => {
    switch (action.type) {
        case SET_BUBBLE:
            return { ...state, bubble: action.payload.bubble, lastFilesUpdate: new Date() };
        case UPDATE_PROGRESS:
            return {
                ...state,
                uploadInProgress: true,
                progress: action.payload.progress,
                uploadStatus: UPLOAD_STATE.INPROGRESS,
            };
        case UPDATE_COMPLETED:
            return { ...state, uploadInProgress: false, uploadStatus: UPLOAD_STATE.SUCCESS };
        case UPDATE_CANCELED:
            return { ...state, uploadInProgress: false, uploadStatus: UPLOAD_STATE.ABORTED };
        case UPDATE_ERROR:
            return { ...state, uploadInProgress: false, uploadStatus: UPLOAD_STATE.ERROR };
        default:
            return state;
    }
};

export { shareReducer, initialShareState };
