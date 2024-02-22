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
}

class Particle {
  x: number;
  y: number;
  effect: Effect;
  speedX: number;
  speedY: number;

  constructor(effect: Effect) {
    this.effect = effect;
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
    this.speedX = Math.random() * 5 - 2.5;
    this.speedY = Math.random() * 5 - 2.5;
  }
  update() {
    this.x += this.speedX;
    this.y += this. speedY;
  }
  draw(context: CanvasRenderingContext2D) {
    context.fillRect(this.x, this.y, 20, 20);
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
