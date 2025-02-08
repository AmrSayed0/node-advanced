require("../models/User");

const mongoose = require("mongoose");
const keys = require("../config/keys");

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

// Jest will automatically run this file before any tests are executed.
// This is useful for setting up any global configuration or state that
// needs to be shared across all tests.
afterAll(() => {
  mongoose.disconnect();
});
