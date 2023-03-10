const { model, Schema } = require("mongoose");
const { db } = require("../firebase/firebase-config");

class Message {
  constructor({ role, content }) {
    this.role = role;
    this.content = content;
  }

  async save(user_id) {
    return await db
      .collection("users")
      .doc(user_id)
      .collection("messages")
      .add({ role: this.role, content: this.content });
  }

  static async getAll(user_id) {
    const querySnapshot = await db
      .collection("users")
      .doc(user_id)
      .collection("messages")
      .get();
    return querySnapshot.docs.map((doc) => doc.data());
  }
}

module.exports = Message;
