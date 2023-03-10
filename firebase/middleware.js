const { admin } = require("./firebase-config.js");

async function decodeToken(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decodeValue = await admin.auth().verifyIdToken(token);
    if (decodeValue) {
      console.log(decodeValue);
      //save user id
      req.user_id = decodeToken.user_id;
      return next();
    }
    return res.json({ message: "Unauthorized" });
  } catch (e) {
    //console.error(e);
    return res.json({ message: "Unauthorized" });
  }
}

module.exports = decodeToken;
