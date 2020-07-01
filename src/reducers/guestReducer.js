import {
    SEARCH_FOR_USER_PROGRESS,
    SEARCH_FOR_USER_COMPLETED,
    SEARCH_FOR_USER_ERROR,
    RETRIEVE_FILE_PROGRESS,
    RETRIEVE_FILE_COMPLETED,
    RETRIEVE_FILE_ERROR,
    DOWNLOAD_FILE_START,
    DOWNLOAD_FILE_PROGRESS,
    DOWNLOAD_FILE_COMPLETED,
    DOWNLOAD_FILE_CANCELED,
    DOWNLOAD_FILE_ERROR,
} from "../actions/guestAction";

const STATE = {
    UNKNOWN: "UNKNOWN",
    INPROGRESS: "INPROGRESS",
    KNOWN: "KNOWN",
};

export const DOWNLOAD_STATE = {
    NOT_STARTED: "notstarted",
    STARTED: "started",
    INPROGRESS: "inprogress",
    SUCCESS: "success",
    ERROR: "error",
    ABORTED: "aborted",
};

const initialGuestState = {
    user: null,
    userState: STATE.UNKNOWN,
    file: null,
    fileState: STATE.UNKNOWN,
    progress: 0,
    downloadInProgress: false,
    downloadStatus: DOWNLOAD_STATE.NOT_STARTED,
    blob: null,
};

const guestReducer = (state = initialGuestState, action) => {
    console.log(`model::reduce ${action.type}`);

    switch (action.type) {
        case SEARCH_FOR_USER_PROGRESS:
            return { ...state, user: null, userState: STATE.INPROGRESS };
        case SEARCH_FOR_USER_COMPLETED:
            return { ...state, user: action.payload.user, userState: STATE.KNOWN };
        case SEARCH_FOR_USER_ERROR:
            return { ...state, user: null, userState: STATE.UNKNOWN };
        case RETRIEVE_FILE_PROGRESS:
            return { ...state, file: null, fileState: STATE.INPROGRESS };
        case RETRIEVE_FILE_COMPLETED:
            return { ...state, file: action.payload.file, fileState: STATE.KNOWN };
        case RETRIEVE_FILE_ERROR:
            return { ...state, file: null, fileState: STATE.UNKNOWN };
        case DOWNLOAD_FILE_START:
            return {
                ...state,
                downloadInProgress: true,
                progress: 0,
                downloadStatus: DOWNLOAD_STATE.STARTED,
                blob: null,
            };
        case DOWNLOAD_FILE_PROGRESS:
            return {
                ...state,
                downloadInProgress: true,
                progress: action.payload.progress,
                downloadStatus: DOWNLOAD_STATE.INPROGRESS,
            };
        case DOWNLOAD_FILE_COMPLETED:
            return {
                ...state,
                downloadInProgress: false,
                downloadStatus: DOWNLOAD_STATE.SUCCESS,
                blob: action.payload.blob,
            };
        case DOWNLOAD_FILE_CANCELED:
            return { ...state, downloadInProgress: false, downloadStatus: DOWNLOAD_STATE.ABORTED, blob: null };
        case DOWNLOAD_FILE_ERROR:
            return { ...state, downloadInProgress: false, downloadStatus: DOWNLOAD_STATE.ERROR, blob: null };
        default:
            return state;
    }
};

export { guestReducer, initialGuestState };
