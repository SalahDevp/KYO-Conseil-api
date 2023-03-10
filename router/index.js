const router = require("express").Router();
const Message = require("../data/Message");
const getChatCompletion = require("../gpt/gptConfig");

router.get("/test", async (req, res) => {
  res.json({ message: "hi" });
});

router.post("/get-response", async (req, res) => {
  reqMsg = req.body.message;
  try {
    //get previous chat messages
    prvMsgs = await Message.getAll(req.user_id);
    //get response from chat gpt
    gptRes = await getChatCompletion([
      ...prvMsgs,
      { content: reqMsg, role: "user" },
    ]);
    //save question and response from chat gpt
    const gptQuestion = new Message({ content: reqMsg, role: "user" });
    const gptResponse = new Message(gptRes);
    gptQuestion.save(req.user_id);
    gptResponse.save(req.user_id);

    res.json({ message: gptResponse });
  } catch (e) {
    //TODO: remember to implement error handling in app
    res
      .status(400)
      .json({ message: "An error occurred, please try again later. " });
  }
});

module.exports = router;
