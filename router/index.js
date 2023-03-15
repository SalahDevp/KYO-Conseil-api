const router = require("express").Router();
const Message = require("../data/Message");
const getChatCompletion = require("../gpt/gptConfig");
const { db } = require("../firebase/firebase-config");

router.get("/test", async (req, res) => {
  const msg = new Message({ role: "user", content: "bruh2" });
  //msg.save(req.user_id);
  res.json({ message: "hi" });
});

router.post("/get-response", async (req, res) => {
  reqMsg = req.body.message;
  try {
    //get previous chat messages
    prvMsgs = [];
    let description = "hi";
    if (req.user_id) {
      prvMsgs = (await Message.getAll(req.user_id)).map(
        (msg) => new Message(msg)
      );
      const userData = await db.collection("users").doc(req.user_id).get();
      description = userData.data().description;
    }
    //get response from chat gpt
    gptRes = await getChatCompletion([
      {
        content:
          "you are a professional assistant, from now on  only answer questions in a formal way",
        role: "user",
      },
      {
        content:
          "this is a description about me, use it as a context for your next replies: " +
          description,
        role: "user",
      },
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
router.get("/get-conversation", async (req, res) => {
  if (!req.user_id) return res.sendStatus(400); //user not authentified
  try {
    prvMsgs = (await Message.getAll(req.user_id)).map(
      (msg) => new Message(msg)
    );

    return res.json(prvMsgs);
  } catch (e) {
    res
      .status(400)
      .json({ message: "An error occurred, please try again later. " });
  }
});

router.post("/save-description", async (req, res) => {
  if (!req.user_id) return res.sendStatus(400); //user not authentified
  try {
    await db
      .collection("users")
      .doc(req.user_id)
      .set({ description: req.body.description });

    return res.json({ description: req.body.description });
  } catch (e) {
    res
      .status(400)
      .json({ message: "An error occurred, please try again later. " });
  }
});

router.get("/get-description", async (req, res) => {
  if (!req.user_id) return res.sendStatus(400); //user not authentified
  try {
    const userData = await db.collection("users").doc(req.user_id).get();
    const data = userData.data();
    return res.json({ description: data.description || "" });
  } catch (e) {
    res
      .status(400)
      .json({ message: "An error occurred, please try again later. " });
  }
});

router.get("/get-smart-replies", async (req, res) => {
  try {
    gptRes = await getChatCompletion([
      {
        content: `i received this email :
          ${req.body.email}`,
        role: "user",
      },
      {
        content:
          "can you generate 4 smart replies as noun phrase and in short format without any description, and put each smart replie between double quotes",
        role: "user",
      },
    ]);
    const regex = /"([^"]+)"/g;

    const matches = gptRes.content.match(regex);
    res.json(matches);
  } catch (e) {
    res
      .status(400)
      .json({ message: "An error occurred, please try again later. " });
  }
});

module.exports = router;
