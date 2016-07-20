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
  WIDTH : 800, HEIGH : 800, BACKGROUND_COLOR : "#FFFFFF"
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
  users[socket.id] = new UserObject(socket.id); //make userobject who newly connect
    
  io.to(socket.id).emit('get_initial_game_settings', GAME_SETTINGS); // give client to initial game settings for canvas drawing

  socket.on('disconnect', function() {
    delete users[socket.id];
    console.log('user disconnect', socket.id);
  });

  socket.on('keydown', function(keyCode){
    users[socket.id].key[keyCode]=true;
  });
  socket.on('keyup', function(keyCode){
    users[socket.id].key[keyCode]=false;
  });

  socket.on('mouseposition',function(x,y){
    users[socket.id].status.currentMousePos.x = x;
    users[socket.id].status.currentMousePos.y = y;
  })
  socket.on('spacePress', function(vecX,vecY){
    var t = Math.sqrt(Math.pow(users[socket.id].status.currentMousePos.x,2) + Math.pow(users[socket.id].status.currentMousePos.y,2));
    var dx = 35 * users[socket.id].status.currentMousePos.x / t;
    var dy = 35 * users[socket.id].status.currentMousePos.y / t;
    var bullet = new BulletObject(socket.id, users[socket.id].status.x+dx, users[socket.id].status.y+dy, vecX, vecY);

    //bullet.index = bulletArray.length(); index는 나중에 collision detection할떄 index를 같이 update를 하는걸로..지우는건 slice를 통해 없애기.
    bulletArray.push(bullet);

  });

});

var update = setInterval(function () {
  var idArray = [];
  var userStatusArray = {};


  for(var id in io.sockets.clients().connected) {

    if(users[id].key && users[id].key[LEFT]) {
      users[id].status.x -= 2;
    }
    else if(users[id].key && users[id].key[A]) {
      users[id].status.x -= 2;
    }
    if(users[id].key && users[id].key[UP]) {
      users[id].status.y -= 2;
    }
    else if(users[id].key && users[id].key[W]) {
      users[id].status.y -= 2;
    }
    if(users[id].key && users[id].key[RIGHT]) {
      users[id].status.x += 2;
    }
    else if(users[id].key && users[id].key[D]) {
      users[id].status.x += 2;
    }
    if(users[id].key && users[id].key[DOWN]) {
      users[id].status.y += 2;
    }
    else if(users[id].key && users[id].key[S]) {
      users[id].status.y += 2;
    }
    idArray.push(id);
    userStatusArray[id] = users[id].status;
  }

  for(var i=0;i<bulletArray.length;i++) {
    var v = bulletArray[i].status.vec;
    bulletArray[i].status.x +=v.x;
    bulletArray[i].status.y +=v.y;

  }

  //console.log(bylletArray[100].status.x);

  //여기서 collision detection을해서 지울거 지우고 처리한다음에 rendering 해주면 된다.

  io.emit('update',idArray, userStatusArray, bulletArray);

},20);
