const { admin, db } = require("./firebase-config.js");

async function decodeToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next(); //continue without auth
  try {
    const decodedValue = await admin.auth().verifyIdToken(token);
    if (decodedValue) {
      //save user id
      req.user_id = decodedValue.user_id;
      return next();
    }
    return res.json({ message: "Unauthorized" });
  } catch (e) {
    console.error(e);
    return res.json({ message: "Unauthorized" });
  }
}

module.exports = decodeToken;
