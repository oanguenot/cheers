import { getUserFromActiveConversation, getFileReceived, downloadeFileFromConversation } from "../modules/SDK";

const SEARCH_FOR_USER_PROGRESS = "SEARCH_FOR_USER_PROGRESS";
const SEARCH_FOR_USER_COMPLETED = "SEARCH_FOR_USER_COMPLETED";
const SEARCH_FOR_USER_ERROR = "SEARCH_FOR_USER_ERROR";

const RETRIEVE_FILE_PROGRESS = "RETRIEVE_FILE_PROGRESS";
const RETRIEVE_FILE_COMPLETED = "RETRIEVE_FILE_COMPLETED";
const RETRIEVE_FILE_ERROR = "RETRIEVE_FILE_ERROR";

const DOWNLOAD_FILE_START = "DOWNLOAD_FILE_START";
const DOWNLOAD_FILE_PROGRESS = "DOWNLOAD_FILE_PROGRESS";
const DOWNLOAD_FILE_COMPLETED = "DOWNLOAD_FILE_COMPLETED";
const DOWNLOAD_FILE_ERROR = "DOWNLOAD_FILE_ERROR";
const DOWNLOAD_FILE_CANCELED = "DOWNLOAD_FILE_CANCELED";

export {
    SEARCH_FOR_USER_PROGRESS,
    SEARCH_FOR_USER_COMPLETED,
    SEARCH_FOR_USER_ERROR,
    RETRIEVE_FILE_PROGRESS,
    RETRIEVE_FILE_COMPLETED,
    RETRIEVE_FILE_ERROR,
    DOWNLOAD_FILE_START,
    DOWNLOAD_FILE_PROGRESS,
    DOWNLOAD_FILE_COMPLETED,
    DOWNLOAD_FILE_ERROR,
    DOWNLOAD_FILE_CANCELED
};

export const getUserFrom = async (dispatch) => {
    return new Promise((resolve, reject) => {
        console.log("model::action getUserFrom");

        dispatch({ type: SEARCH_FOR_USER_PROGRESS, payload: {} });

        getUserFromActiveConversation()
            .then((user) => {
                dispatch({ type: SEARCH_FOR_USER_COMPLETED, payload: { user } });
                resolve();
            })
            .catch((err) => {
                dispatch({ type: SEARCH_FOR_USER_ERROR, payload: {} });
                reject();
            });
    });
};

export const getFileFrom = async (dispatch) => {
    return new Promise((resolve, reject) => {
        console.log("model::action getFileFrom");

        dispatch({ type: RETRIEVE_FILE_PROGRESS, payload: {} });

        getFileReceived()
            .then((file) => {
                console.log(">>>file", file);
                dispatch({ type: RETRIEVE_FILE_COMPLETED, payload: { file } });
                resolve();
            })
            .catch((err) => {
                dispatch({ type: RETRIEVE_FILE_ERROR, payload: {} });
                reject();
            });
    });
};

export const downloadFile = (file, dispatch) => {
    const onFileDownloadProgress = (id, progress) => {
        dispatch({ type: DOWNLOAD_FILE_PROGRESS, payload: { id, progress } });
    };

    const onFileDownloadError = (id) => {
        dispatch({ type: DOWNLOAD_FILE_ERROR, payload: { id } });
    };

    const onFileDownloadDone = (id) => {
        //dispatch({ type: DOWNLOAD_FILE_COMPLETED, payload: { id } });
    };

    return new Promise((resolve, reject) => {
        console.log("model::action downloadFile");

        dispatch({ type: DOWNLOAD_FILE_START, payload: {} });

        downloadeFileFromConversation(file, onFileDownloadProgress, onFileDownloadDone, onFileDownloadError)
            .then((blob) => {
                dispatch({ type: DOWNLOAD_FILE_COMPLETED, payload: { blob } });
                resolve();
            })
            .catch((err) => {
                dispatch({ type: DOWNLOAD_FILE_ERROR, payload: {} });
                reject();
            });
    });
};
