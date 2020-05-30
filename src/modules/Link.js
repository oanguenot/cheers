import axios from "axios";

export const generateLink = async (guestId, fileId) => {
    let publicURL;

    await axios
        .post("/api/link", {
            guestId: guestId,
            fileId: fileId,
        })
        .then(function (response) {
            // handle success
            publicURL = response.data.publicUrl;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });

    return publicURL;
};
