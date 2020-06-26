import axios from "axios";

export const getValidTokenForGuest = (guestId) => {
    return new Promise((resolve, reject) => {
        axios
            .get(`/api/guest?id=${guestId}`)
            .then(function (response) {
                // handle success
                resolve(response.data.token);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                reject({ reason: "can't connect with guest" });
            });
    });
};
