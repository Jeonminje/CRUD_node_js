var http = require('http');
var cookie = require('cookie');

http.createServer(function(request,response){
  console.log(request.headers.cookie);
  if(request.headers.cookie !== undefined){
    var cookies = cookie.parse(request.headers.cookie);
  }
  console.log(cookies.yummy_cookie);
response.writeHead(200, {
  'Set-Cookie':[
    'yummy_cookie=choco',
    'tasty_cookie=strawberry',
    `Permanant=cookies; Max-age=${60*60*24}`,
    'Secure=Secure; Secure', // https에서만 쿠키
    'HttpOnly=HttpOnly; HttpOnly', // 자바스크립트에서 쿠키를 못
    'Path=path; Path=/cookie', // diretory와 그 디렉토리 아래에서만 쿠키가 활성
    'Domain=Domain; Domain=o2.org' // 이 도메인의 앞의 어떤 서브도메인에서도살아남음

  ]
});

  response.end('Cookie')

}).listen(3000);
