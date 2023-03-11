const router = require("express").Router();
const Message = require("../data/Message");
const getChatCompletion = require("../gpt/gptConfig");

router.get("/test", async (req, res) => {
  const msg = new Message({ role: "user", content: "bruh2" });
  msg.save(req.user_id);
  res.json({ message: "hi" });
});

router.post("/get-response", async (req, res) => {
  reqMsg = req.body.message;
  try {
    //get previous chat messages
    prvMsgs = [];
    if (req.user_id)
      prvMsgs = (await Message.getAll(req.user_id)).map(
        (msg) => new Message(msg)
      );
    //get response from chat gpt
    gptRes = await getChatCompletion([
      ...prvMsgs,
      { content: reqMsg, role: "user" },
    ]);
    if (req.user_id) {
      //save question and response from chat gpt
      const gptQuestion = new Message({ content: reqMsg, role: "user" });
      const gptResponse = new Message(gptRes);
      gptQuestion.save(req.user_id);
      gptResponse.save(req.user_id);
    }

    res.json({ message: gptRes.content });
  } catch (e) {
    //TODO: remember to implement error handling in app
    res
      .status(400)
      .json({ message: "An error occurred, please try again later. " });
  }
});

//get recommended articles for user based on conversation
router.get("/get-articles", async (req, res) => {
  try {
    //NOTE: don't save this conversation
    //get previous chat messages
    //prvMsgs = await Message.getAll(req.user_id);
    //get response from chat gpt
    gptRes = await getChatCompletion([
      ...prvMsgs,
      {
        content:
          "can you suggest me some interesting or helpful articles based on our conversation, but only include articles link no description or title, and put the links in an array form",
        role: "user",
      },
    ]);
    //extract the articles from response as array
    const arrayStr = gptRes.content.match(/\[((.|\n)*)\]/);
    // Parse the array string into an actual JavaScript array
    const articles = JSON.parse(arrayStr[0]);

    res.json({ message: articles });
  } catch (e) {
    res
      .status(400)
      .json({ message: "An error occurred, please try again later. " });
  }
});

module.exports = router;
