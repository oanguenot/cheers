import axios from "axios";

let _config = {
    app_id: "",
    host: "",
    rainbow_host: "",
    oauth_redirect_uri: "",
    oauth_state: "",
    guest_ttl: 0,
};

export const isValidConfig = () => {
    return _config.host.length > 0;
};

export const config = () => {
    return _config;
};

export const loadConfigFromServer = () => {
    return new Promise((resolve, reject) => {
        axios
            .get("/api/config")
            .then(function (response) {
                // handle success
                _config = response.data;
                resolve(_config);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                reject(_config);
            });
    });
};

export const requestId = async (ttl) => {
    return new Promise((resolve, reject) => {
        axios
            .get(`/api/admin?ttl=${ttl}`)
            .then(function (response) {
                // handle success
                resolve(response.data.id);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                reject(null);
            });
    });
};
