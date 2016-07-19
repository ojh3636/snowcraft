function UserObject(id){
  var color="#";

  for(var i=1;i<=6;i++){
    color+=(Math.floor(Math.random()*16)).toString(16);
  }
  this.name = null;
  this.color = color;
  this.id = null;

  this.status = {};
  this.status.x = 0;
  this.status.y = 0;
  this.status.radius = 10 * Math.PI;

  this.keypress = [];
}

module.exports = UserObject;
