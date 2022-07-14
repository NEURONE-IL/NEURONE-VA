const { Schema, model } = require("mongoose");

const chatOption5 = new Schema(
  {
    textOption: { type: String, required: true },
    replyType: { type: String, required: true },
    textReply: { type: String },
    filename: { type: String },
    optionsIn: {type: [] }
  },
  {
    versionKey: false,
  }
);

const chatOption4 = new Schema(
  {
    textOption: { type: String, required: true },
    replyType: { type: String, required: true },
    textReply: { type: String },
     filename: { type: String },
    optionsIn: {type: [chatOption5] }
  },
  {
    versionKey: false,
  }
);

const chatOption3 = new Schema(
  {
    textOption: { type: String, required: true },
    replyType: { type: String, required: true },
    textReply: { type: String },
     filename: { type: String },
    optionsIn: {type: [chatOption4] }
  },
  {
    versionKey: false,
  }
);

const chatOption2 = new Schema(
  {
    textOption: { type: String, required: true },
    replyType: { type: String, required: true },
    textReply: { type: String },
    filename: { type: String },
    optionsIn: {type: [chatOption3] }
  },
  {
    versionKey: false,
  }
);

const chatOption1 = new Schema(
  {
    textOption: { type: String, required: true },
    replyType: { type: String, required: true },
    textReply: { type: String },
    filename: { type: String },
    optionsIn: {type: [chatOption2] }
  },
  {
    versionKey: false,
  }
);

const chatbotSchema = new Schema(
  {
    message: { type: String, required: true }, //mensaje inicial
    optionList: { type: [chatOption1], required: true },
  },
  {
    versionKey: false,
  }
);

const messageSchema = new Schema(
  {
    message: { type: String, required: true }, //mensaje inicial
    image: { type: String },
  },
  {
    versionKey: false,
  }
);

const actionSchema = new Schema(
  {
    name: {type: String, required: true },
    assistant: { type: String, required: true },
    type: { type: String, required: true },
    chatbot: { type: chatbotSchema, required: false },
    message: { type:messageSchema, required: false},
  },
  {
    versionKey: false,
  }
);

module.exports = model("action", actionSchema);
