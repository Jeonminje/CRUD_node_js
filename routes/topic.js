var express = require('express');
var router = express.Router();
var path = require('path');
const fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var auth = require('../lib/auth');

router.get('/create', function(request,response){
    if(auth.isOwner(request,response) === false){
      response.redirect('/');
      return false;
    }
      var title = 'WEB - create';
      var list = template.list(request.list);
      var html = template.html(title, list, `
        <form action="/topic/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
        </form>
        `,
        '', auth.statusUI(request,response));
      response.send(html);
  })
  
  router.post('/create_process', function(request, response){
    if(auth.isOwner(request,response) === false){
      response.end('Login required!!');
      return false;
    }
    /*
    var body = '';
    request.on('data',function(data){ //데이터 많을 경우 대비, 서버에서 수신할떄마다 콜백함수 호출.
      body = body + data;
    });
    request.on('end',function(){ // 더이상 수신할 정보없으면, 실행
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`,description,'utf8',function(err){
        response.writeHead(301, {Location: `/?id=${title}`});
        response.end('success!');
      })
    });
    */
  
    var post = request.body;
    var title = post.title;
    var description = post.description;
     fs.writeFile(`data/${title}`,description,'utf8',function(err){
       response.writeHead(301, {Location: `/topic/${title}`});
       response.end('success!');
     })
    
  })
  
  router.post('/delete_process', function(request, response){
    if(auth.isOwner(request,response) === false){
      response.redirect('/');
      return false;
    }
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(error){
      response.redirect('/');
    })
  })
  
  router.post('/update_process', function(request, response){
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(error){
      fs.writeFile(`data/${title}`,description,'utf8',function(err){
        response.status(301).redirect(`/topic/${title}`);
      })
    })
  })
  
  router.get('/:pageId', function(request,response,next){
      var list = template.list(request.list);
      var filteredId = path.parse(request.params.pageId).base; // 한번 걸러줌.
      fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
        if(err){
          next(err);
        }
        else{
          var title = request.params.pageId;
        var sanitizeTitle = sanitizeHtml(title);
        var sanitizeDescription = sanitizeHtml(description);
        var html =template.html(title, list,
          `<h2>${sanitizeTitle}</h2>${sanitizeDescription}`,
          `<a href="/topic/create">create</a>
          <a href="/topic/update/${sanitizeTitle}">update</a>
          <form action="/topic/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizeTitle}">
            <input type="submit" value="delete">
          </form>`,
          auth.statusUI(request,response)
        );
        response.send(html);
        }
      })
  })
  
  router.get('/update/:pageId', function(request, response){
    if(auth.isOwner(request,response) === false){
      response.redirect('/');
      return false;
    }
    var filteredId = path.parse(request.params.pageId).base;
  
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
        
          var list = template.list(request.list);
          var title = request.params.pageId;
          var html =template.html(title, list,
            `
            <form action="/topic/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
            </form>
            `,
            `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`, auth.statusUI(request,response));
          response.status(200).send(html);
        })
  
  })

  module.exports = router;