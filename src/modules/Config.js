import axios from "axios";

console.log("rebooted");

let _config = {
    app_id: "",
    host: "",
    rainbow_host: "",
    oauth_redirect_uri: "",
    oauth_state: "",
};

export const loadConfigFromServer = async () => {
    await axios
        .get("/api/config")
        .then(function (response) {
            // handle success
            _config = response.data;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });

    return _config;
};

export const config = () => {
    return _config;
};

export const requestId = async (ttl) => {
    let id = null;

    await axios
        .get(`/api/admin?ttl=${ttl}`)
        .then(function (response) {
            // handle success
            id = response.data;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });

    return id;
};
