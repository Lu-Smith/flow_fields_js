import './style.css';

const canvas: HTMLCanvasElement = document.getElementById('canvas1') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

if (ctx) {
  //canvas settings
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  ctx.lineCap = 'round';
}

class Particle {
  x: number;
  y: number;
  effect: Effect;
  speedX: number;
  speedY: number;
  history: [{x: number, y: number}];
  maxLength: number;
  angle: number;
  speedModifier: number;
  timer: number;

  constructor(effect: Effect) {
    this.effect = effect;
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
    this.speedX = 0;
    this.speedY = 0;
    this.speedModifier = Math.floor(Math.random() * 5 + 1);
    this.history = [{x: this.x, y: this.y}];
    this.maxLength = Math.floor(Math.random() * 200 + 10);
    this.angle = 0;
    this.timer = this.maxLength * 2;
  }
  update() {
    this.timer--;
    if (this.timer >= 1) {
      let x = Math.floor(this.x / this.effect.cellSize);
      let y = Math.floor(this.y / this.effect.cellSize);
      let index = y * this.effect.cols + x;
      this.angle = this.effect.flowField[index];
  
      this.speedX = Math.cos(this.angle);
      this.speedY = Math.sin(this.angle);
      this.x += this.speedX * this.speedModifier;
      this.y += this.speedY * this.speedModifier;
  
      this.history.push({x: this.x, y: this.y});
      if( this.history.length > this.maxLength) {
        this.history.shift();
      };
    }
  }
  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.moveTo(this.history[0].x, this.history[0].y);
    for (let i = 0; i < this.history.length; i++) {
      context.lineTo(this.history[i].x, this.history[i].y);
    };
    context.stroke();
  }
  reset() {
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
    this.history = [{x: this.x, y: this.y}];
  }
}

class Effect {
  width: number;
  height: number;
  particles: Particle[];
  numberOfParticles: number; 
  cellSize: number;
  rows: number;
  cols: number;
  flowField: number[];
  curve: number;
  zoom: number;

    constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
      this.particles = [];
      this.numberOfParticles = 300;
      this.cellSize = 20;
      this.rows = 0;
      this.cols = 0;
      this.flowField = [];
      this.curve = 0.5;
      this.zoom = 0.13;
      this.init();
    }
    init() {
      //create flow field
      this.rows = Math.floor(this.height / this.cellSize);
      this.cols = Math.floor(this.width / this.cellSize);
      this.flowField = [];
      for (let y = 0; y <this.rows; y++) {
        for ( let x = 0; x < this.cols; x++) {
          let angle= (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * this.curve;
          this.flowField.push(angle);
        }
      }
      console.log(this.flowField);
      //create particles
      for( let i = 0; i < this.numberOfParticles; i++) {
        this.particles.push(new Particle(this));
      }
    }
    render(context: CanvasRenderingContext2D){
      this.particles.forEach(particle => {
        particle.draw(context);
        particle.update();
      })
    }
}

const effect = new Effect(canvas.width, canvas.height);

const animate = () => {
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render(ctx);
  }
  requestAnimationFrame(animate);
}

animate();
