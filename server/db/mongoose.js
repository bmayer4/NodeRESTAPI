var mongoose = require('mongoose');

var url = process.env.MONGODB_URI;

mongoose.Promise = global.promise;
mongoose.connect(url);

module.exports = {
  mongoose: mongoose
};
