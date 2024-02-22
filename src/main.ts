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

  constructor(effect: Effect) {
    this.effect = effect;
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
    this.speedX = Math.random() * 5 - 2.5;
    this.speedY = Math.random() * 5 - 2.5;
    this.history = [{x: this.x, y: this.y}];
  }
  update() {
    this.x += this.speedX + Math.random() * 15 - 7.5;
    this.y += this. speedY + Math.random() * 15 - 7.5;
    this.history.push({x: this.x, y: this.y})
  }
  draw(context: CanvasRenderingContext2D) {
    context.fillRect(this.x, this.y, 6, 6);
    context.beginPath();
    context.moveTo(this.history[0].x, this.history[0].y);
    for (let i = 0; i < this.history.length; i++) {
      context.lineTo(this.history[i].x, this.history[i].y);
    }
    context.stroke();
  }
}

class Effect {
  width: number;
  height: number;
  particles: Particle[];
  numberOfParticles: number; 

    constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
      this.particles = [];
      this.numberOfParticles = 50;
      this.init();
    }
    init() {
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
