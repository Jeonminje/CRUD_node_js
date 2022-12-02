module.exports = {

    isOwner : function(request, response){
        if(request.user){ // 로그인 되어있다면 passport가 request에 user값을 넣어줌.
            return true;
        }
        return false;
      },
      
      statusUI : function(request, response){
          var isOwner = this.isOwner(request,response);
          var authStatusUI = '<a href="/auth/login">login</a>';
          if(isOwner){
            authStatusUI = `${request.user.nickname} | <a href="/auth/logout_process">logout</a>`;
          }
          return authStatusUI;
        }

}
