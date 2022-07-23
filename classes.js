class Arrow {
  constructor(pos) {
    this.pos = pos;
    //this.angle = bound_angle(random()*360);
    this.angle = random(-180, 180);
    //this.angle = random()+180;
    this.others;
    this.dist;
  }

  update() {
    this.others;
    this.dist;

    
    let [total_x, total_y, total_cos, total_sin, total_arrows] = this.get_total();
    //console.log(total_x);

    // Rules
    if (total_arrows != 0) {
        total_cos /= total_arrows;
        total_sin /= total_arrows;
        total_x /= total_arrows;
        total_y /= total_arrows;
        this.align(total_cos, total_sin);
        this.angle = bound_angle(this.angle);
        this.spread();
        this.angle = bound_angle(this.angle);
        this.gather(total_x, total_y);
        this.angle = bound_angle(this.angle);
    }

    this.avoid_obstacle();
    this.angle = bound_angle(this.angle);
    this.avoid_wall();
    this.angle = bound_angle(this.angle);
  }

  draw() {
    fill(110+int(sin(this.angle)*90), 110+int(cos(this.angle)*90), 255)
    circle(this.pos[0], this.pos[1], 20);
    stroke(255, 255, 255)
    line(this.pos[0], this.pos[1], this.pos[0]+(cos(this.angle)*10), this.pos[1]-(sin(this.angle)*10))
    noStroke();
  }

  get_total() {
    let total_x = 0;
    let total_y = 0;
    let total_cos = 0;
    let total_sin = 0;
    let total_arrows = 0;
    let x, y, z;
    for (let a = 0; a < population_size; a++) {

      if (arrows[a] == this) {
        continue;
      }

      x = arrows[a].pos[0] - this.pos[0];
      y = arrows[a].pos[1] - this.pos[1];
      z = Math.sqrt(Math.pow(x, 2)+Math.pow(y, 2));
      if (z <= sight_distance) {
        total_arrows += 1;
        total_cos += cos(arrows[a].angle);
        total_sin += sin(arrows[a].angle);
        total_x += arrows[a].pos[0];
        total_y += arrows[a].pos[1];
        if (z <= 20) {
          if (this.others === undefined) {
            this.others = a;
            this.dist = z;
          }
          else {
            if (z < dist) {
              this.others = a;
              this.dist = z;
            }
          }
        }
      }
    }
    return [total_x, total_y, total_cos, total_sin, total_arrows];
  }

  move_forward() {
    this.pos[0] += cos(this.angle)*spd;
    this.pos[1] -= sin(this.angle)*spd;
  }

  align(cos, sin) {
    let angle = acos(cos);
    if (sin < 0) {
      angle = -angle;
    }
    if (Math.abs(angle-this.angle) > Math.abs((angle-360)-this.angle)) {
      angle -= 360;
    }
    else if (Math.abs(angle-this.angle) > Math.abs((angle+360)-this.angle)) {
      angle += 360;
    }
    if (Math.abs(angle-this.angle) < str_align) {
      this.angle = angle;
    }
    else {
      if (angle > this.angle) {
        this.angle += str_align;
      }
      else if (angle < this.angle) {
        this.angle -= str_align;
      }
    }
  }

  spread() {
    let ar = this.others;
    if (ar === undefined) {
      return;
    }
      // Get the distance
      let z = this.dist;
      if (z === 0) {
        let co = cos(arrows[ar].angle);
        let cs = cos(this.angle);
        if (co < cs) {
          if (this.angle > 0) {
            this.angle -= str_spread;
          }
          else if (this.angle < 0) {
            this.angle += str_spread;
          }
        }
        else if (co > cs) {
          if (this.angle > 0) {
            this.angle += str_spread;
          }
          else if (this.angle < 0) {
            this.angle -= str_spread;
          }
        }
        return;
      }
      let a = arrows[ar].angle;
      if (Math.abs(a - this.angle) > Math.abs((a - 360) - this.angle)) {
        a -= 360;
      }
      else if (Math.abs(a - this.angle) > Math.abs((a + 360) - this.angle)) {
        a += 360;
      }
      if (a < this.angle) {
        this.angle += str_spread;
      }
      else if (a > this.angle) {
        this.angle -= str_spread;
      }
  }

  gather(in_x, in_y) {
    let x = in_x - this.pos[0];
    let y = in_y - this.pos[1];
    let z = Math.sqrt(Math.pow(x, 2)+Math.pow(y, 2));
    if (z != 0) {
      let a = acos(x/z);
      let c = y/z;
      if (c < 0) {
        a = -a;
      }
      a = bound_angle(a);

      if (Math.abs(a-this.angle) > Math.abs((a-360)-this.angle)) {
        a -= 360;
      }
      else if (Math.abs(a-this.angle) > Math.abs((a+360)-this.angle)) {
        a += 360;
      }

      if (Math.abs(a-this.angle) < str_gather) {
        this.angle = a;
      }
      else {
        if (a < this.angle) {
          this.angle -= str_gather;
        }
        else if (a > this.angle) {
          this.angle += str_gather;
        }
      }

    }
  }

  avoid_obstacle() {
    let x, y, obs;
    for (let i = 0; i < obs_amount; i++) {
      obs = obstacles[i];
      x = this.pos[0] - (obs.pos[0] + obs.width);
      if (x < 30 && x >= 0 && this.pos[1] >= (obs.pos[1]-30) && this.pos[1] <= (obs.pos[1]+obs.height+30)) {
        if (0 > this.angle) {
          this.angle += str_avoid;
        }
        else {
          this.angle -= str_avoid;
        }
      }
      else {
        x = obs.pos[0] - this.pos[0];
        if (x < 30 && x >= 0 && this.pos[1] >= (obs.pos[1]-30) && this.pos[1] <= (obs.pos[1]+obs.height+30)) {
          if (0 < this.angle) {
            this.angle += str_avoid;
          }
          else {
            this.angle -= str_avoid;
          }
        }
        else {
          y = this.pos[1] - (obs.pos[1]+obs.height);
          if (y < 30 && y >= 0 && this.pos[0] >= (obs.pos[0]-30) && this.pos[0] <= (obs.pos[0] + obs.width+30)) {
            if (this.angle > 0) {
              if (90 > this.angle) {
                this.angle -= str_avoid;
              }
              else {
                this.angle += str_avoid;
              }
            }
            else {
              if (-90 < this.angle) {
                this.angle -= str_avoid;
              }
              else {
                this.angle += str_avoid;
              }
            }
          }
          else {
            y = obs.pos[1] - this.pos[1];
            if (y < 30 && y >= 0 && this.pos[0] >= (obs.pos[0]-30) && this.pos[0] <= (obs.pos[0] + obs.width+30)) {
              if (this.angle < 0) {
                if (-90 < this.angle) {
                  this.angle += str_avoid;
                }
                else {
                  this.angle -= str_avoid;
                }
              }
              else {
                if (90 > this.angle) {
                  this.angle += str_avoid;
                }
                else {
                  this.angle -= str_avoid;
                }
              }
            }
          }
        }
      }
    }
  }

  avoid_wall() {
    let x = this.pos[0];
    if (x < 30) {
      if (0 > this.angle) {
        this.angle += str_avoid;
      }
      else {
        this.angle -=  str_avoid;
      }
    }
    else {
      x = width-this.pos[0];
      if (x < 30) {
        if (0 < this.angle) {
          this.angle +=  str_avoid;
        }
        else {
          this.angle -=  str_avoid;
        }
      }
      else {
        let y = this.pos[1];
        if (y < 30) {
          if (this.angle > 0) {
            if (90 > this.angle) {
              this.angle -=  str_avoid;
            }
            else {
              this.angle +=  str_avoid;
            }
          }
          else {
            if (-90 < this.angle) {
              this.angle -= str_avoid;
            }
            else {
              this.angle += str_avoid;
            }
          }
        }
        else {
          y = height-this.pos[1];
          if (y < 30) {
            if (this.angle < 0) {
              if (-90 < this.angle) {
                this.angle += str_avoid;
              }
              else {
                this.angle -= str_avoid;
              }
            }
            else {
              if (90 > this.angle) {
                this.angle += str_avoid;
              }
              else {
                this.angle -= str_avoid;
              }
            }
          }
        }
      }
    }
  }
}


class Obstacle {
  constructor(x, y, width, height) {
    this.pos = [x, y];
    this.width = width;
    this.height = height;
  }

  draw() {
    rect(this.pos[0], this.pos[1], this.width, this.height);
  }
}
