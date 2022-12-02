const express = require('express');
var router = express.Router();
var template = require('../lib/template.js');

  module.exports = function(passport) {
    router.get('/login',function(request,response){
        var title = 'login';
        var list = template.list(request.list);
        var html = template.html(title, list,
          `<form action="/auth/login_process" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="submit" value="submit"></p>
            </form>`,
          `<a href="/topic/create">create</a>`);
        response.send(html);
      })
      /*
      router.post('/login_process',function(request,response){
        var post = request.body;
        if(post.email === authData.id && post.password === authData.password){
            request.session.is_logined = true;
            request.session.nckname = authData.nickname;
            request.session.save(function(){ // 세션저장
                response.redirect('/');
            })
        }
        else{
          response.send('Who??');
        }
      })
    */
    
    router.post('/login_process', passport.authenticate('local',{
        successRedirect: '/', // 성공했을때
        failureRedirect: '/auth/login' // 실패 시
      }));
    
      router.get('/logout_process',function(request, response){
        console.log(1);
        request.logout(function(err){
            if(err){
                return next(err);
            }
            request.session.save(function(){
                response.redirect('/');
            })
        });
        // request.session.destroy(function(err){
        //     response.redirect('/');
        // })
        // response.setHeader('Set-Cookie',[
        //     `email=; Max-Age = 0`,
        //     `password=; Max-Age = 0`,
        //     `nickname=; Max-Age = 0`
        //   ]
        // );
      })
      return router;
  };