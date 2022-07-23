let width = 1200;
let height = 600;
let population_size = 100;
const sight_distance = 35;
const obs_amount = 0;
const str_spread = 5;
const str_gather = 5;
const str_align = 1;
const str_avoid = 6;
const spd = 2;

let arrows = [];
let obstacles = [];

function setup() {
  width = windowWidth;
  height = windowHeight;
  const cnv = createCanvas(width, height);
  //cnv.center(HORIZONTAL);
  let x;
  let y;
  for (let i = 0; i < population_size; i++) {
    x = (random()*(width-20))+10;
    y = (random()*(height-20))+10;
    arrows.push(new Arrow([x, y]));
  }
  //obstacles.push(new Obstacle(500, 300, 50, 50));
  //obstacles.push(new Obstacle(300, 300, 50, 50));
  //obstacles.push(new Obstacle(100, 300, 50, 50));
  angleMode(DEGREES);
  textSize(100);
  textAlign(CENTER);
}

function draw() {
  background(0);

  text("CHIG BEEF", width/2, height/2);

  for (let i = 0; i < population_size; i++) {
    arrows[i].update();
    arrows[i].move_forward();
    arrows[i].pos = bound_point(arrows[i].pos);
    arrows[i].draw();
  }

  fill(128, 128, 128);
  for (let i = 0; i < obs_amount; i++) {
    obstacles[i].draw();
  }
}
