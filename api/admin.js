const axios = require("axios");
const crypto = require("crypto-js");
const { v4: uuidv4 } = require("uuid");

let createPassword = (size) => {
    let possible = [
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "abcdefghijklmnopqrstuvwxyz",
        "?=.*[_~!@#$%^&*-+=`|(){}[]:;\"'<>,.?/]",
        "0123456789",
    ];
    let key = "";
    for (let i = 0; i < size - 4; i++) {
        let index = Math.floor(Math.random() * possible.length);
        key += possible[index].charAt(Math.floor(Math.random() * possible[index].length));
    }
    for (let i = 0; i < 4; i++) {
        key += possible[i].charAt(Math.floor(Math.random() * possible[i].length));
    }
    return key;
};

const loginAsAdmin = async (email, password, id, secret, host) => {
    return new Promise((resolve, reject) => {
        const auth = Buffer.from(email + ":" + password).toString("base64");
        const appAuth = Buffer.from(id + ":" + crypto.SHA256(secret + password)).toString("base64");
        const authenticateURL = `https://${host}:443/api/rainbow/authentication/v1.0/login`;

        const headers = {
            Accept: "application/json",
            Authorization: "Basic " + auth,
            "x-rainbow-app-auth": "Basic " + appAuth,
        };

        axios
            .get(authenticateURL, { headers: headers })
            .then((response) => {
                console.log("[admin] login - got token", response.data.token);
                resolve(response.data.token);
            })
            .catch((err) => {
                console.log("[admin] login - can't log-in", err);
                reject(err);
            });
    });
};

const createGuest = async (token, ttl, appId, host, guestHost) => {
    return new Promise((resolve, reject) => {
        const createGuestURL = `https://${host}:443/api/rainbow/admin/v1.0/users`;

        const headers = {
            Accept: "application/json",
            "content-type": "application/json",
            Authorization: "Bearer " + token,
        };

        const password = createPassword(8);
        const email = `guest.${uuidv4()}@${appId}.${guestHost}`;

        const requestBody = {
            loginEmail: email,
            password: password,
            roles: ["guest"],
            timeToLive: ttl,
            userInfo1: password,
        };

        axios
            .post(createGuestURL, requestBody, { headers: headers })
            .then((response) => {
                console.log("[admin] guest - got guest", response.data.data);
                resolve(response.data.data.id);
            })
            .catch((err) => {
                console.log("[admin] guest - can't create guest", err);
                reject(err);
            });
    });
};

module.exports = async (req, res) => {
    const rainbow_host = process.env.RAINBOW_HOST;
    const rainbow_appId = process.env.RAINBOW_APP_ID;
    const rainbow_appSecret = process.env.RAINBOW_APP_SECRET;
    const rainbow_admin_login = process.env.RAINBOW_ADMIN_LOGIN;
    const rainbow_admin_password = process.env.RAINBOW_ADMIN_PASSWORD;

    const vercel_url = process.env.VERCEL_URL.length > 0 ? process.env.VERCEL_URL : "http://localhost:3000";

    const url = new URL(req.url, vercel_url);

    const ttl = url.searchParams.get("ttl") || 172800;
    const host = url.hostname;

    switch (req.method) {
        case "GET":
            console.log("[admin] get a guest ID");
            try {
                const token = await loginAsAdmin(
                    rainbow_admin_login,
                    rainbow_admin_password,
                    rainbow_appId,
                    rainbow_appSecret,
                    rainbow_host
                );
                let guestId = await createGuest(token, ttl, rainbow_appId, rainbow_host, host);

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ id: guestId }));
            } catch (err) {
                res.writeHead(401, { "Content-Type": "application/json" });
                res.end(JSON.stringify(err));
            }
            break;
        default:
            console.log("[admin] others");
            res.status(500).send({});
            break;
    }
};
