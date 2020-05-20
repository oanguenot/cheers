module.exports = async (req, res) => {
    const vercel_url = process.env.VERCEL_URL.length > 0 ? process.env.VERCEL_URL : "http://localhost:3000";

    const config = {
        app_id: process.env.APP_ID,
        host: vercel_url,
        rainbow_host: process.env.RAINBOW_HOST,
        oauth_redirect_uri: process.env.RAINBOW_REDIRECT_URI,
        oauth_state: process.env.RAINBOW_OAUTH_STATE,
    };

    switch (req.method) {
        case "GET":
            console.log("[config] get configuration parameters");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(config));
            break;
        default:
            console.log("[config] others");
            res.status(500).send({});
            break;
    }
};
