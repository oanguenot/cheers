import { loadConfigFromServer } from "./Config";

export const signinWithOauth = async () => {
    const serverConfig = await loadConfigFromServer();

    const appID = serverConfig.app_id; // Fill with your application ID
    const oauthResponseType = "code"; // Grant
    const oauthRedirectURI = encodeURIComponent(serverConfig.oauth_redirect_uri);

    const oauthScope = "all";
    const oauthState = serverConfig.oauth_state;

    let path = `?response_type=${oauthResponseType}&client_id=${appID}&redirect_uri=${oauthRedirectURI}&scope=${oauthScope}&state=${oauthState}`;

    let url = `https://${serverConfig.rainbow_host}/api/rainbow/authentication/v1.0/oauth/authorize${path}`;
    window.location.href = url;
};
