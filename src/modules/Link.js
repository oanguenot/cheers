import axios from "axios";

export const generateLink = (guestId, fileId) => {
    return new Promise((resolve, reject) => {
        axios
            .post("/api/link", {
                guestId: guestId,
                fileId: fileId,
            })
            .then(function (response) {
                // handle success
                resolve(response.data.publicUrl);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                reject({ reason: "can't create link" });
            });
    });
};

export const getInfoFromLink = async (link) => {
    console.log("LINK", link);

    return new Promise((resolve, reject) => {
        axios
            .get(`/api/link`, {
                params: {
                    value: link,
                },
            })
            .then(function (response) {
                // handle success
                resolve(response.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                reject({ reason: "can't get info from link" });
            });
    });
};
