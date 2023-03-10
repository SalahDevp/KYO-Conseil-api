const { model, Schema } = require("mongoose");

const messageSchema = new Schema({
  role: { type: String, required: true },
  content: { type: String, required: true },
});

const Message = model("Message", messageSchema);

module.exports = Message;
