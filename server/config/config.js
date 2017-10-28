var env = process.env.NODE_ENV || 'development';  //first one set on production and test, second on dev
console.log('env *****', env);   //set to development by default

if (env === 'development' || env === 'test') {
  //when you require a json file, it automatically parses it into a javascript object, no need for JSON.parse
  var config = require('./config.json');
  var envConfig = config[env]; //when you use variable to access a property, you have to use bracket notation
  console.log(envConfig);

  console.log(envConfig['PORT']);  //3000
    console.log(envConfig['MONGODB_URI']);  //mongodb://localhost:27017/TodoApp
    console.log(envConfig['JWT_SECRET']);  //de3ud3hd340hd30io4
  //Object.keys() takes an object like env.config, returns the object keys as an array
  Object.keys(envConfig).forEach((key) => {  //[PORT, MONGODB_URI, JWT_SECRET]
    process.env[key] = envConfig[key]
  });

}

//for heroku, set custom env variable
//heroku config:set MYNAME=Brett

//gets var
//heroku config:get MYNAME

//unsets
//heroku config:unset MYNAME

//NOW I have to set this variable in heroku since we  use it in the app 
//heroku config:set JWT_SECRET=343efijrio544h



//moved this to config.json for security reasons
// if (env === 'development') {
//   process.env.PORT = 3000;   //port PORT and MONGODB_URI are both set by heroku on production
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === "test") {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
