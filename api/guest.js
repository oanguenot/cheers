var sdk = require("./sdk");

module.exports = async (req, res) => {
    const vercel_url = process.env.VERCEL_URL.length > 0 ? process.env.VERCEL_URL : "http://localhost:3000";
    const rainbow_host = process.env.RAINBOW_HOST;
    const rainbow_appId = process.env.RAINBOW_APP_ID;
    const rainbow_appSecret = process.env.RAINBOW_APP_SECRET;
    const rainbow_admin_login = process.env.RAINBOW_ADMIN_LOGIN;
    const rainbow_admin_password = process.env.RAINBOW_ADMIN_PASSWORD;

    switch (req.method) {
        case "GET":
            console.log("[svless guest] GET");

            const url = new URL(req.url, vercel_url);
            const guestId = url.searchParams.get("id");

            if (!guestId || guestId.length === 0) {
                res.writeHead(401, "ERROR", { "Content-Type": "application/json" });
                res.end(JSON.stringify({ code: 401, reason: "invalid id parameter" }));
                return;
            }

            try {
                // Se logguer avec le compte admin
                const token = await sdk.loginOnBehalf(
                    rainbow_admin_login,
                    rainbow_admin_password,
                    rainbow_appId,
                    rainbow_appSecret,
                    rainbow_host
                );

                // Récupérer les données du guest et surtout son password
                const guest = await sdk.getGuestById(guestId, rainbow_host, token);

                // Se logguer avec le loginEmail + password du guest
                const guestToken = await sdk.loginOnBehalf(
                    guest.loginEmail,
                    guest.userInfo1,
                    rainbow_appId,
                    rainbow_appSecret,
                    rainbow_host
                );

                // Retourner le token
                res.writeHead(200, "OK", { "Content-Type": "application/json" });
                res.end(JSON.stringify({ token: guestToken }));
            } catch (err) {
                // En cas d'erreur ou d'expiration du compte guest
                res.writeHead(403, "ERROR", { "Content-Type": "application/json" });
                res.end(JSON.stringify({ code: 403, reason: "invalid account" }));
            }

            break;
        default:
            console.log("[svless guest] OTHER");
            res.writeHead(404, "ERROR", { "Content-Type": "application/json" });
            res.end(JSON.stringify({ code: 404, reason: "no valid endpoint" }));
            break;
    }
};
