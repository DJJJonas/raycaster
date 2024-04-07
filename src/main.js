const gamemap = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
];

const e = {};

function setup() {
  createCanvas(320, 200);

  e.player = {
    pos: createVector(4.5, 4.5),
    dir: createVector(0, -1),
  };
  e.camera = {
    plane: createVector(0.66, 0),
    target: e.player,
    rotateBy: (angle) => {
      e.camera.plane.rotate(angle);
      e.player.dir.rotate(angle);
    },
  };
  window["player"] = e.player;
}

function drawRaycast() {
  for (let px = 0; px < width; px++) {
    const multplier = 2 * (px / width) - 1;
    const pxPlane = p5.Vector.mult(e.camera.plane, multplier);
    const ray = {};
    ray.dir = p5.Vector.add(e.player.dir, pxPlane);

    const deltaDist = {
      x: abs(1 / ray.dir.x),
      y: abs(1 / ray.dir.y),
    };
    const mapPos = {
      x: Math.floor(e.player.pos.x),
      y: Math.floor(e.player.pos.y),
    };
    const sideDist = {};
    const step = {
      x: 0,
      y: 0,
    };

    if (ray.dir.x < 0) {
      sideDist.x = (e.player.pos.x - mapPos.x) * deltaDist.x;
      step.x = -1;
    } else {
      sideDist.x = (mapPos.x + 1 - e.player.pos.x) * deltaDist.x;
      step.x = 1;
    }

    if (ray.dir.y < 0) {
      sideDist.y = (e.player.pos.y - mapPos.y) * deltaDist.y;
      step.y = -1;
    } else {
      sideDist.y = (mapPos.y + 1 - e.player.pos.y) * deltaDist.y;
      step.y = 1;
    }

    let hitside = 0;
    let ddaLine = {
      x: sideDist.x,
      y: sideDist.y,
    };

    const wallHitPos = {
      x: mapPos.x,
      y: mapPos.y,
    };

    let hit = false;
    while (!hit) {
      if (ddaLine.x < ddaLine.y) {
        wallHitPos.x += step.x;
        ddaLine.x += deltaDist.x;
        hitside = 0;
      } else {
        wallHitPos.y += step.y;
        ddaLine.y += deltaDist.y;
        hitside = 1;
      }

      const block = gamemap[wallHitPos.x][wallHitPos.y];
      if (block > 0) {
        hit = true;
      }
    }

    let rayDistToWall;

    if (hitside == 0) {
      rayDistToWall =
        abs(wallHitPos.x - e.player.pos.x + (1 - step.x) / 2) / ray.dir.x;
    } else {
      rayDistToWall =
        abs(wallHitPos.y - e.player.pos.y + (1 - step.y) / 2) / ray.dir.y;
    }

    const lineHeight = height / rayDistToWall;

    const lineStart = height / 2 - lineHeight / 2;
    const lineEnd = height / 2 + lineHeight / 2;

    stroke(hitside ? 255 : 180, 0, 0);
    line(px, lineStart, px, lineEnd);
  }
}
let rSpeed = 0.002;
function draw() {
  e.camera.rotateBy(rSpeed);
  background(50);
  noStroke();
  fill(30);
  rect(0, height / 2, width, height / 2);
  drawRaycast();
}
