const axios = require("axios");
const crypto = require("crypto-js");

module.exports = {
    loginAsAdmin: async (email, password, id, secret, host) => {
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
                    console.log("[admin] loginAsAdmin - got token", response.data.token);
                    resolve(response.data.token);
                })
                .catch((err) => {
                    console.log("[admin] loginAsAdmin - can't log-in", err);
                    reject(err);
                });
        });
    },

    getGuestById: async (guestId, host, token) => {
        console.log("getGuestById enter");

        return new Promise((resolve, reject) => {
            const getUserURL = `https://${host}:443/api/rainbow/admin/v1.0/users/${guestId}`;

            const headers = {
                Accept: "application/json",
                "content-type": "application/json",
                Authorization: "Bearer " + token,
            };

            axios
                .get(getUserURL, { headers: headers })
                .then((response) => {
                    console.log("[admin] getGuestById - got guest data", response.data.data);
                    resolve(response.data.data);
                })
                .catch((err) => {
                    console.log("[admin] getGuestById - can't get guest data", err);
                    reject(err);
                });
        });
    },
};
