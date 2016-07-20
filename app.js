
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require("path");
var UserObject = require("./Objects/UserObject.js");
var BulletObject = require("./Objects/BulletObject");
var port = process.env.PORT || 3000;

var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;

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

  socket.on('spacePress', function(vecX,vecY){

    var bullet = new BulletObject(socket.id, users[socket.id].status.x, users[socket.id].status.y, vecX, vecY);

    //bullet.index = bulletArray.length(); index는 나중에 collision detection할떄 index를 같이 update를 하는걸로..지우는건 slice를 통해 없애기.
    bulletArray.push(bullet);
  });

});

var update = setInterval(function () {
  var idArray = [];
  var userStatusArray = {};

  for(var id in io.sockets.clients().connected) {
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
