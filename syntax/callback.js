function a(){
  console.log('A');
}



a();

var b = function(){
  console.log('A');
}


function slowfunc(callback){
  callback();
}

slowfunc(b);
