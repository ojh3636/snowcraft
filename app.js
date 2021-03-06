var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require("path");
var UserObject = require("./Objects/UserObject.js");
var BulletObject = require("./Objects/BulletObject");
var port = process.env.PORT || 3000;

var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40, W = 87, A = 65, S = 83, D = 68;

var GAME_SETTINGS = {
  WIDTH : 1000, HEIGH : 900, BACKGROUND_COLOR : "#FFFFFF"
};



http.listen(port, function() {
  console.log("server on!");
});
// open http listner

app.use(express.static(path.join(__dirname + '/public')));

// setting static file to send to client web browser

var users = {};
var bulletArray = [];
// the user array (who still connected)

io.on('connection', function(socket) {
  console.log('user connected: ', socket.id);
  users[socket.id] = new UserObject(socket.id);
   //make userobject who newly connect

  io.to(socket.id).emit('get_initial_game_settings', GAME_SETTINGS); // give client to initial game settings for canvas drawing

  socket.on('disconnect', function() {
    delete users[socket.id];
    console.log('user disconnect', socket.id);
  });

  socket.on('keydown', function(keyCode, uid){
    uid = "/#" + uid;
    if(users[uid]) users[uid].key[keyCode]=true;
    //bullet.index = bulletArray.length(); index는 나중에 collision detection할떄 index를 같이 update를 하는걸로..지우는건 slice를 통해 없애기.

  });
  socket.on('keyup', function(keyCode, uid){
    uid = "/#" + uid;
    if(users[uid]) {
      users[uid].key[keyCode]=false;
      if(keyCode == 32) users[uid].status.Check = -1;
    }
  });

  socket.on('mouseposition',function(x, y, uid){
    if(users[uid]) {
      users[uid].status.currentMousePos.x = x;
      users[uid].status.currentMousePos.y = y;
    }

  });
  socket.on('modal_on',function(){
    users[socket.id].status.modal_exist = true;
  });
  socket.on('nick', function(a){
    users[socket.id].status.name=a;
    users[socket.id].status.hp = 8;
    users[socket.id].status.modal_exist = false;
  });

});


var update = setInterval(function () {
  var idArray = [];
  var userStatusArray = {};


  for(var id in io.sockets.clients().connected) {

    if(users[id].key && users[id].key[LEFT] && users[id].status.hp !==0) {
      if(users[id].status.acclerate.x>-7) {
        users[id].status.acclerate.x-=0.5;
      }

    }
    else if(users[id].key && users[id].key[A] && users[id].status.hp !==0) {
      if(users[id].status.acclerate.x>-7) {
        users[id].status.acclerate.x-=0.5;
      }
    }
    if(users[id].key && users[id].key[UP] && users[id].status.hp !==0) {
      if(users[id].status.acclerate.y>-7) {
        users[id].status.acclerate.y-=0.5;
      }
    }
    else if(users[id].key && users[id].key[W] && users[id].status.hp !==0) {
      if(users[id].status.acclerate.y>-7) {
        users[id].status.acclerate.y-=0.5;
      }
    }
    if(users[id].key && users[id].key[RIGHT] && users[id].status.hp !==0) {
      if(users[id].status.acclerate.x<7) {
        users[id].status.acclerate.x+=0.5;
      }
    }
    else if(users[id].key && users[id].key[D] && users[id].status.hp !==0) {
      if(users[id].status.acclerate.x<7) {
        users[id].status.acclerate.x+=0.5;
      }
    }
    if(users[id].key && users[id].key[DOWN] && users[id].status.hp !==0) {
      if(users[id].status.acclerate.y<7) {
        users[id].status.acclerate.y+=0.5;
      }
    }
    else if(users[id].key && users[id].key[S] && users[id].status.hp !==0) {
      if(users[id].status.acclerate.y<7) {
        users[id].status.acclerate.y+=0.5;
      }
    }
    users[id].status.x += users[id].status.acclerate.x;
    users[id].status.y += users[id].status.acclerate.y;

    if(users[id].status.x >= GAME_SETTINGS.WIDTH - 24){
      users[id].status.x = GAME_SETTINGS.WIDTH -24;

    } else if(users[id].status.x <= 24 ) {
      users[id].status.x = 24;
    }

    if(users[id].status.y >= GAME_SETTINGS.HEIGH - 24){
      users[id].status.y = GAME_SETTINGS.HEIGH -24;
    } else if(users[id].status.y <= 24 ) {
      users[id].status.y = 24;
    }


    if(users[id].status.acclerate.x >= 0.5){
      users[id].status.acclerate.x-=0.2;
    }else if(users[id].status.acclerate.x <=-0.5){
      users[id].status.acclerate.x+=0.2;
    }else{
      users[id].status.acclerate.x = 0;
    }

    if(users[id].status.acclerate.y >= 0.5){
      users[id].status.acclerate.y-=0.2;
    }else if(users[id].status.acclerate.y <=-0.5){
      users[id].status.acclerate.y+=0.2;
    } else{
      users[id].status.acclerate.y = 0;
    }

    if(users[id].key && users[id].key[32] && users[id].status.hp !==0) {
      if(users[id].status.Check === 10 || users[id].status.Check === -1){
        var square = Math.sqrt(Math.pow(users[id].status.currentMousePos.x,2) + Math.pow(users[id].status.currentMousePos.y,2));
        var vecX = (13*users[id].status.currentMousePos.x)/square;
        var vecY = (13*users[id].status.currentMousePos.y)/square;
        var dx = 35 * users[id].status.currentMousePos.x / square;
        var dy = 35 * users[id].status.currentMousePos.y / square;
        var bullet = new BulletObject(id, users[id].status.x+dx, users[id].status.y+dy, vecX, vecY);
        bulletArray.push(bullet);
        users[id].status.Check = 0;
      }
      users[id].status.Check++;

    }

    idArray.push(id);
    userStatusArray[id] = users[id].status;
  }

  for(var i=0;i<bulletArray.length;i++) {
    var v = bulletArray[i].status.vec;
    bulletArray[i].status.x +=v.x;
    bulletArray[i].status.y +=v.y;
    if(bulletArray[i].status.x > GAME_SETTINGS.WIDTH || bulletArray[i].status.y > GAME_SETTINGS.HEIGH || bulletArray[i].status.x<0 || bulletArray[i].status.y<0){
      bulletArray.splice(i,1);
      i--;
    }
  }

  idArray.forEach(function(id,i,a) {
    for(var j=0;j<bulletArray.length;j++) {
      if(users[id].status.hp !==0){
        var distance = Math.sqrt( Math.pow((users[id].status.x - bulletArray[j].status.x),2) + Math.pow((users[id].status.y - bulletArray[j].status.y),2) );

        if(distance <= 32){

          users[id].status.hp--;
          if(users[id].status.hp ===0 ){
            users[bulletArray[j].status.id].status.hp +=3;
            if(users[bulletArray[j].status.id].status.hp>8) users[bulletArray[j].status.id].status.hp=8;
            users[bulletArray[j].status.id].status.score +=1;
          }

          bulletArray.splice(j,1);
          j--;

        }

      }

      //console.log(distance);
    }
  });

  //console.log(bylletArray[100].status.x);

  //여기서 collision detection을해서 지울거 지우고 처리한다음에 rendering 해주면 된다.

  io.emit('update',idArray, userStatusArray, bulletArray);

},15);
