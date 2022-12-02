var express = require('express')
var session = require('express-session')
var FileStore = require('session-file-store')(session)

var app = express();

app.use(session({
    secret: 'asdfas#!@!dt', // 내마음대로
    resave: false,
    saveUninitialized: true, // 세션이 필요하기 전까진 세션구동하지않는다.
    store: new FileStore()
}))

app.get('/',function(req, res, next){
    console.log(req.session);
    if(req.session.num === undefined){
        req.session.num = 1;
    }
    else{
        req.session.num = req.session.num + 1;
    }
    res.send(`View : ${req.session.num}`);
})

app.listen(3001, function(){
    console.log('3000!');
})