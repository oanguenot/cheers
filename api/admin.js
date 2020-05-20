module.exports = async (req, res) => {
  const rainbow_host = process.env.RAINBOW_HOST;
  const rainbow_appId = process.env.APP_ID;
  const rainbow_appSecret = process.env.APP_SECRET;


  const loginAsAdmin

  
  switch (req.method) {
      case "GET":
          console.log("[config] get configuration parameters");
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(config));
          break;
      default:
          console.log("[config] others");
          res.status(500).send({});
          break;
  }
};