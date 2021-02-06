const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const MessageSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    username: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
);

MessageSchema
.virtual('timestamp_formatted')
.get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_SHORT);
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = {
  Message,
};
