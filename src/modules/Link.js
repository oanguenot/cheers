import axios from "axios";

export const generateLink = async (guestId, fileId) => {
    await axios
        .post("/api/link", {
            guestId: guestId,
            fileId: fileId,
        })
        .then(function (response) {
            // handle success
            console.log("RESPONSE", response);
            return {};
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            return;
        });
};
