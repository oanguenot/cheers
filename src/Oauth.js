export function authenticateOauth() {
    const appID = "57b9a34095e311ea907e6f42c1248a7b"; // Fill with your application ID
    const oauthResponseType = "code"; // Grant
    const oauthRedirectURI = encodeURIComponent("http://localhost:3000/api/login");

    const oauthScope = "all";
    const oauthState = "7U3QRyn2d";

    let path = `?response_type=${oauthResponseType}&client_id=${appID}&redirect_uri=${oauthRedirectURI}&scope=${oauthScope}&state=${oauthState}`;

    let url = "https://sandbox.openrainbow.com/api/rainbow/authentication/v1.0/oauth/authorize" + path;

    window.location.href = url;
}
