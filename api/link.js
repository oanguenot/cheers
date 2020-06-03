const CryptoJS = require("crypto-js");

const processRequestData = (request) => {
    return new Promise((resolve, reject) => {
        var queryData = "";

        if (request.method === "POST") {
            request.on("data", function (data) {
                queryData += data;
                if (queryData.length > 1e6) {
                    queryData = "";
                    reject({ code: 413, reason: "too many data received" });
                    //request.connection.destroy();
                }
            });

            request.on("end", function () {
                resolve(JSON.parse(queryData));
            });
        } else {
            reject({ code: 405, reason: "not valid request method" });
        }
    });
};

const encode = (fileId, guestId, host, secret) => {
    var cipherText = CryptoJS.AES.encrypt(`${guestId}|${fileId}`, secret).toString();
    var encoded = encodeURIComponent(cipherText);
    return `${host}/public?link=${encoded}`;
};

const decode = (encodedString, secret) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encodedString, secret);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        const data = originalText.split("|");

        if (data && data.length === 2) {
            return {
                guestId: data[0],
                fileId: data[1],
            };
        } else {
            console.log("[svless link] can't decode link");
            return null;
        }
    } catch (err) {
        console.log("[svless link] error decoding link", err);
        return null;
    }
};

module.exports = async (req, res) => {
    const vercel_url = process.env.VERCEL_URL.length > 0 ? process.env.VERCEL_URL : "http://localhost:3000";
    const secret = process.env.CRYPTO_SECRET_KEY;

    switch (req.method) {
        case "GET":
            console.log("[svless link] GET");

            const url = new URL(req.url, vercel_url);
            const link = url.searchParams.get("value");

            if (!link || link.length === 0) {
                res.writeHead(401, "ERROR", { "Content-Type": "application/json" });
                res.end(JSON.stringify({ code: 401, reason: "invalid link parameter" }));
                return;
            }

            const info = decode(decodeURIComponent(link), secret);

            if (!info) {
                res.writeHead(404, "ERROR", { "Content-Type": "application/json" });
                res.end(JSON.stringify({ code: 401, reason: "invalid link content" }));
                return;
            }

            res.writeHead(200, "OK", { "Content-Type": "application/json" });
            res.end(JSON.stringify(info));

            break;
        case "POST":
            // Encode the public URL
            console.log("[svless link] POST");
            processRequestData(req)
                .then((data) => {
                    const publicUrl = encode(data.fileId, data.guestId, vercel_url, secret);
                    res.writeHead(200, "OK", { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ publicUrl: publicUrl }));
                })
                .catch((err) => {
                    res.writeHead(err.code, "ERROR", { "Content-Type": "application/json" });
                    res.end(JSON.stringify(err));
                });
            break;
        default:
            console.log("[svless link] OTHER");
            res.writeHead(404, "ERROR", { "Content-Type": "application/json" });
            res.end(JSON.stringify({ code: 404, reason: "no valid endpoint" }));
            break;
    }
};
