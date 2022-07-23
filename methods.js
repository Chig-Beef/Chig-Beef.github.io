function bound_point(value) {
  if (value[0] > width - 10) {
    value[0] = width - 10;
  }
  else if (value[0] < 10) {
    value[0] = 10;
  }
  if (value[1] > height - 10) {
    value[1] = height - 10;
  }
  else if (value[1] < 10) {
    value[1] = 10;
  }
  return value;
}

function bound_angle(num) {
  if (num > 180) {
    num -= 360;
  }
  else if (num < -180) {
    num += 360;
  }
  return num;
}

function add_boid() {
  population_size++;
  x = (random()*(width-20))+10;
  y = (random()*(height-20))+10;
  arrows.push(new Arrow([x, y]))
}