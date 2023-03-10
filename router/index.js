const router = require("express").Router();

router.get("/test", (req, res) => {
  res.json({ message: "hi!" });
});

module.exports = router;

// AIzaSyCoy45XkHEzV50UXX0DOTsuSY0tzbJxZwA
