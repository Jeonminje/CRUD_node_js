const express = require('express');
const app = express();
const fs = require('fs');
var bodyParser = require('body-parser'); // 미들웨어 request에 body 추가해줌
var compression = require('compression');
const helmet = require("helmet");
var session = require('express-session')
var FileStore = require('session-file-store')(session)


app.use(helmet()); // 보안 자동으로 해줌 npm install --save helmet

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false})); // 바디파서 사용하도록 (use안은 미들웨어 표현식.)
app.use(compression()); // 적어주기만해도 자동으로 response에 압축해서 보냄, 웹브라우저가 압축풀어서 보여줌.
app.use(session({
  secret: 'asdfas#!@dt', // 내마음대로
  resave: false,
  saveUninitialized: true, // 세션이 필요하기 전까진 세션구동하지않는다.
  store: new FileStore()
}))

//passport는 session 다음에 적어야함 / 세션이 필요해서
var passport =require('./lib/passport')(app);

app.get('*', function(request, response, next){ // get방식에만
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  })
})

var topicRouter = require('./routes/topic');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth')(passport);

app.use('/',indexRouter);

app.use('/topic', topicRouter);

app.use('/auth',authRouter);

app.use(function(request, response,next){
  response.status(404).send("sorry cant find that!!");
})

app.use(function(err,req,res,next){
  console.log(err.stack);
  res.status(500).send('Something broke!!')
})

app.listen(3000)


