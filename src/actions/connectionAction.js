import { connectWithToken } from "../modules/SDK";
import { getInfoFromLink } from "../modules/Link";
import { getValidTokenForGuest } from "../modules/Guest";

const SWITCH_TO_CONNECTED = "SWITCH_TO_CONNECTED";
const SWITCH_TO_DISCONNECTED = "SWITCH_TO_DISCONNETED";
const SWITCH_TO_INPROGRESS = "SWITCH_TO_INPROGRESS";
const SWITCH_TO_ERROR = "SWITCH_TO_ERROR";
const SWITCH_TO_ABORTED = "SWITCH_TO_ABORTED";

export { SWITCH_TO_CONNECTED, SWITCH_TO_DISCONNECTED, SWITCH_TO_ERROR, SWITCH_TO_INPROGRESS, SWITCH_TO_ABORTED };

export const signinWithOAuthToken = (oauth_token, dispatch) => {
    console.log("model::action signinWithOAuthToken");
    dispatch({ type: SWITCH_TO_INPROGRESS, payload: {} });

    connectWithToken(oauth_token)
        .then(() => {
            dispatch({ type: SWITCH_TO_CONNECTED, payload: {} });
        })
        .catch((err) => {
            dispatch({ type: SWITCH_TO_ABORTED, payload: err });
        });
};

export const signinWithLink = (link, dispatch) => {
    console.log("model::action signinWithLink");
    dispatch({ type: SWITCH_TO_INPROGRESS, payload: {} });

    getInfoFromLink(link)
        .then((info) => {
            return getValidTokenForGuest(info.guestId);
        })
        .then((token) => {
            return connectWithToken(token);
        })
        .then(() => {
            dispatch({ type: SWITCH_TO_CONNECTED, payload: {} });
        })
        .catch((err) => {
            dispatch({ type: SWITCH_TO_ABORTED, payload: err });
        });
};
