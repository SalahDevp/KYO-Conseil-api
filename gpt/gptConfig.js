require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

async function getChatCompletion(messages) {
  completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
  });
  return completion.data.choices[0].message;
}

module.exports = getChatCompletion;
