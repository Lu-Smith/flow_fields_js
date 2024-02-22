import './style.css';

const canvas: HTMLCanvasElement = document.getElementById('canvas1') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

if (ctx) {
  //canvas settings
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(100,200);
  ctx.lineTo(400, 500);
  ctx.stroke();
}

class Particle {
  x: number;
  y: number;
  effect: Effect;

  constructor(effect: Effect) {
    this.effect = effect;
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);

  }
  update() {

  }
  draw(context: CanvasRenderingContext2D ) {
    context.fillRect(this.x, this.y, 10, 10);
  }
}

class Effect {
  width: number;
  height: number;
  particles: Particle[];

    constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
      this.particles = []
    }
    init() {
      this.particles.push(new Particle(this));
    }
}

const effect = new Effect(canvas.width, canvas.height);
effect.init();
console.log(effect);
