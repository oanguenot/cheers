const axios = require("axios");
const qs = require("qs");

const generateJWTTokenFromAccessToken = async (accessCode) => {
    return new Promise((resolve, reject) => {
        const url = `https://${process.env.RAINBOW_HOST}:443/api/rainbow/authentication/v1.0/oauth/token`;
        const applicationAuthent = process.env.APP_ID + ":" + process.env.APP_SECRET;

        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + Buffer.from(applicationAuthent).toString("base64"),
        };

        const requestBody = {
            grant_type: "authorization_code",
            code: accessCode,
            redirect_uri: process.env.RAINBOW_REDIRECT_URI,
        };

        const encodedBody = qs.stringify(requestBody);

        axios
            .post(url, encodedBody, { headers: headers })
            .then((response) => {
                resolve({ refresh_token: response.data.refresh_token, access_token: response.data.access_token });
            })
            .catch((err) => {
                reject(err);
            });
    });
};

module.exports = async (req, res) => {
    const vercel_url = process.env.VERCEL_URL.length > 0 ? process.env.VERCEL_URL : "http://localhost:3000";

    console.log("VERCEL2", vercel_url);

    const url = new URL(req.url, vercel_url);

    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const oauth = await generateJWTTokenFromAccessToken(code);

    console.log("TOKEN", oauth);

    //call to rainbow to generate a token

    switch (req.method) {
        case "GET":
            console.log("SERVER GET");
            res.writeHead("301", {
                location: `${vercel_url}/signed?access_token=${oauth.access_token}&access_type=oauth`,
            }).end("coucou");
            break;
        case "POST":
            console.log("SERVER POST");
            break;
        case "DELETE":
            console.log("SERVER DELETE");
            break;
        default:
            console.log("SERVER OTHER");
            break;
    }
};
