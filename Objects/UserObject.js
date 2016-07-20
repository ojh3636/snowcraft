function UserObject(id){
  var color="#";

  for(var i=1;i<=6;i++){
    color+=(Math.floor(Math.random()*16)).toString(16);
  }
  this.name = null;

  this.id = null;

  this.status = {};
  this.status.x = 300;
  this.status.y = 300;

  this.status.radius = 0;
  this.status.color = color;

  this.key = [];
}

module.exports = UserObject;
