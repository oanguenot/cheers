const CryptoJS = require("crypto-js");

const processPost = (request, response, callback) => {
    var queryData = "";
    if (typeof callback !== "function") return null;

    if (request.method === "POST") {
        request.on("data", function (data) {
            queryData += data;
            if (queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, { "Content-Type": "text/plain" }).end();
                request.connection.destroy();
            }
        });

        request.on("end", function () {
            request.post = JSON.parse(queryData);
            callback();
        });
    } else {
        response.writeHead(405, { "Content-Type": "text/plain" });
        response.end();
    }
};

const encode = (fileId, guestId, host, secret) => {
    var cipherText = CryptoJS.AES.encrypt(`${fileId}|${guestId}`, secret).toString();
    return `${host}/public/${cipherText}`;
};

const decode = (encodedString, secret) => {
    const bytes = CryptoJS.AES.decrypt(encodedString, secret);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    const data = originalText.split("|");

    if (data.length === 2) {
        return {
            guestId: data[0],
            fileId: data[1],
        };
    } else {
        return null;
    }
};

module.exports = async (req, res) => {
    const vercel_url = process.env.VERCEL_URL.length > 0 ? process.env.VERCEL_URL : "http://localhost:3000";
    const secret = process.env.CRYPTO_SECRET_KEY;

    switch (req.method) {
        case "GET":
            // Decode the public URL and return the guestId and fileID
            console.log("SERVER GET");

            break;
        case "POST":
            // Encode the public URL
            console.log("SERVER POST");
            processPost(req, res, function () {
                const publicUrl = encode(req.post.fileId, req.post.guestId, vercel_url, secret);

                res.writeHead(200, "OK", { "Content-Type": "application/json" });
                res.end(JSON.stringify({ publicUrl: publicUrl }));
                res.end();
            });
            break;
        case "DELETE":
            console.log("SERVER DELETE");
            break;
        default:
            console.log("SERVER OTHER");
            break;
    }
};
