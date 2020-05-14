module.exports = async (req, res) => {
    console.log("[login] client");

    // TODO: décoder la requete entrante afin de récupérer le code + appeler Rainbow pour générer un token

    //const { code, state } = req.query;
    //console.log("[login] code " + code);
    //console.log("[login] state " + state);
    //console.log("res", res);

    let code = "toto";

    switch (req.method) {
        case "GET":
            console.log("SERVER GET");
            res.writeHead("301", {
                location: `http://localhost:3000/signed#access_token=${code}&access_type=oauth`,
            }).end("coucou");
            break;
        case "POST":
            console.log("SERVER GET");
            res.status(200).send({ id: 12345 });
            break;
        case "DELETE":
            console.log("SERVER DELETE");
            break;
        default:
            console.log("SERVER OTHER");
            break;
    }
};
