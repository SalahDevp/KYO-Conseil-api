const router = require("express").Router();
const Message = require("../data/Message");
const { db } = require("../firebase/firebase-config");
router.get("/test", async (req, res) => {
  res.json({ message: "hi" });
});

module.exports = router;
