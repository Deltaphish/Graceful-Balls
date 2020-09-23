//import _ from 'lodash';
import './index.html'
import './style.css';
import { update } from 'lodash';

const canvas = document.querySelector("canvas")

const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

function random(min,max) {
	const num = Math.floor(Math.random() * (max - min + 1)) + min;
	return num;
}

function Ball(x, y, velX, velY, color, size){
	this.x = x;
	this.y = y;
	this.velX = velX;
	this.velY = velY;
	this.color = color;
	this.size = size;
	this.inCollision = false;
}

Ball.prototype.draw = function() {
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.arc(this.x,this.y,this.size,0,2* Math.PI);
	ctx.fill();
	ctx.moveTo(this.x,this.y);
	ctx.lineTo(this.x + this.velX * 10, this.y + this.velY*10);
	ctx.stroke();
}

Ball.prototype.update = function(delta){
	if((this.x + this.size) >= width){
		this.velX = -(this.velX);
		this.x = width - this.size;
	}

	if ((this.x - this.size) <= 0){
		this.velX = -(this.velX);
		this.x = this.size;
	}

	if ((this.y + this.size) >= height){
		this.velY = -(this.velY);
		this.y = height - this.size;
	}

	if ((this.y - this.size) <= 0){
		this.velY = -(this.velY);
		this.y = 0 + this.size;
	}

	this.velY += 0.098*delta;

	this.x += this.velX*delta;
	this.y += this.velY*delta;
}

let balls = [];

while (balls.length < 2){
	let size = random(40,90);
	let ball = new Ball(
		random(0 + size, width - size),
		random(0 + size, height - size),
		random(-2,2),
		random(-2,2),
		'rgb(' + random(0,255) + "," + random(0,255) + "," + random(0,255) + ')',
		size);

	balls.push(ball);
}

var lastFrame = undefined;

function loop(timestamp){
	if(lastFrame === undefined){
		lastFrame = timestamp;
	}

	const elapsed = (timestamp - lastFrame) / 10;

	ctx.fillStyle = 'rgba(0,0,0,255)';
	ctx.fillRect(0,0,width,height);

	for (let i = 0; i < balls.length; i++){
		balls[i].update(elapsed);
		balls[i].draw();
	}

	check_collision();

	lastFrame = timestamp;
	requestAnimationFrame(loop);
}


function check_collision(){
	for(var i = 0; i < balls.length; i++){
		for(var j = i+1; j < balls.length; j++){

			let dist = Math.pow(balls[i].x - balls[j].x,2) + Math.pow(balls[i].y - balls[j].y,2)
			if(Math.sqrt(dist) <= (balls[i].size + balls[j].size)){
				if(!(balls[i].inCollision || balls[j].inCollision)){
					collide(i,j,dist);
				}
			}

		}
	}
}





function collide(i,j,dist){
	var ball_i = balls[i];
	var ball_j = balls[j];

	const new_vel_i = _collide(ball_i,ball_j,dist);
	const new_vel_j = _collide(ball_j,ball_i,dist);

	ball_i.velX = new_vel_i[0];
	ball_i.velY = new_vel_i[1];

	ball_j.velX = new_vel_j[0];
	ball_j.velY = new_vel_j[1];

	balls[i] = ball_i;
	balls[j] = ball_j;
}


function _collide(b1,b2,dist){
	// Find the new velocity by subracting the projection of the diffrence of velocities on th vector between the circles, from the current velocity.
	const mass_coeff = (2*b2.size)/(b2.size + b1.size)
	const dot = (b1.velX - b2.velX) * (b1.x - b2.x) + (b1.velY - b2.velY)* (b1.y - b2.y);

	let new_vel_x = b1.velX - (mass_coeff * dot / dist) * (b1.x - b2.x);
	let new_vel_y = b1.velY - (mass_coeff * dot / dist) * (b1.y - b2.y);

	return [new_vel_x,new_vel_y];
}

requestAnimationFrame(loop);
