function BulletObject(id, x, y, vecX, vecY) {
  this.status = {};
  this.index = 0;

  this.status.id = id;
  this.status.x = x;
  this.status.y = y;
  this.status.vec = {};
  this.status.vec.x = vecX;
  this.status.vec.y = vecY;

}

module.exports = BulletObject;
