const { Schema, model } = require("mongoose");

const assistantSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    type:{ type: String, required: true },
    metrics: { type: [String], required: false },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Assistant", assistantSchema);
