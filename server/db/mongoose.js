var mongoose = require('mongoose');

var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp';

mongoose,Promise = global.promise;
mongoose.connect(url);

module.exports = {
  mongoose: mongoose
};
