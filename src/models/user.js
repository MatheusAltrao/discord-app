const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: String,
    invite: {
      code: String,
      url: String,
    },
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  }
);

const User = mongoose.model('Users', userSchema);

module.exports = { User };
