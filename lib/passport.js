module.exports = function(app){
    var authData = {
        id: 'egoing777@gmail.com',
        password: '111111',
        nickname:'egoing'
      }

    var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done){ // 로그인할 때 딱한번 호출, 사용자 식별자를 세션에 저장
  console.log('serializeUser',user);
  done(null, user.id);
})

passport.deserializeUser(function(id, done){ // user.id가 여기로 들어옴. 저장된 데이터를 기반으로 필요한 정보를 조회할 때마다 호출.
  console.log('deserializeUser',id);
  done(null, authData);
  // User.findById(id, function(err, user){
  //   done(err, user);
  // });
})

passport.use(new LocalStrategy(
  {
    usernameField: 'email', // login에서 보내준 값을 username으로 세팅
    passwordField: 'password'
  },
  function(username, password, done) {
    console.log(username, password);
    if(username === authData.id){
      if(password === authData.password){
        return done(null,authData); // serializeUser의 첫번째 인자로 줌 user
      }
      else{
        return done(null, false, {
          message: 'Incorrect password'
        })
      }
    }
    else{
      return done(null, false, {
        message: 'Incorrect id'
      })
    }
  }
));
return passport;
}

