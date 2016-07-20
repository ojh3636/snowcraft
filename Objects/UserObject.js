function UserObject(id){
  var color="#";

  for(var i=1;i<=6;i++){
    color+=(Math.floor(Math.random()*16)).toString(16);
  }

  this.status = {};
  this.status.name = null;
  this.status.id = null;
  this.status.x = Math.floor(Math.random() * 560) + 20;
  this.status.y = Math.floor(Math.random() * 560) + 20;
  this.status.acclerate = {x:0,y:0};

  this.status.radius = 24;
  this.status.color = color;
  this.status.currentMousePos = {};
  this.status.hp = 8;
  this.status.Check = -1;

  this.key = [];
}

module.exports = UserObject;
