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
  color: string;
  colors: string[];

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
    this.colors = ['#025919', '#128230', '#42b031', '#6ad15a'];
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
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
    } else if (this.history.length > 1){
      this.history.shift();
    } else {
      this.reset();
    }
  }
  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.moveTo(this.history[0].x, this.history[0].y);
    for (let i = 0; i < this.history.length; i++) {
      context.lineTo(this.history[i].x, this.history[i].y);
    };
    context.strokeStyle = this.color;
    context.stroke();
  }
  reset() {
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
    this.history = [{x: this.x, y: this.y}];
    this.timer = this.maxLength * 2;
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
  debug: boolean;
  canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height =this.canvas. height;
      this.particles = [];
      this.numberOfParticles = 1600;
      this.cellSize = 20;
      this.rows = 0;
      this.cols = 0;
      this.flowField = [];
      this.curve = 8.5;
      this.zoom = 0.2;
      this.debug = false;
      this.init();

      window.addEventListener('keydown', e => {
        if (e.key === 'd' ) this.debug = !this.debug;
      })

      window.addEventListener('resize', e => {
        if (e.target instanceof Window) {
          this.resize(e.target.innerWidth, e.target.innerHeight);
        }
      })
    }
    init() {
      //create flow field
      this.rows = Math.floor(this.height / this.cellSize);
      this.cols = Math.floor(this.width / this.cellSize);
      this.flowField = [];
      for (let y = 0; y <this.rows; y++) {
        for ( let x = 0; x <= this.cols; x++) {
          let angle= (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) + this.curve;
          this.flowField.push(angle);
        }
      }
      //create particles
      this.particles = [];
      for( let i = 0; i < this.numberOfParticles; i++) {
        this.particles.push(new Particle(this));
      }
    }
    drawGrid(context: CanvasRenderingContext2D) {
      context.save();
      context.strokeStyle = 'red';
      context.lineWidth = 0.4;
      for ( let c = 0; c < this.cols; c++) {
        context.beginPath();
        context.moveTo(this.cellSize * c, 0);
        context.lineTo(this.cellSize * c, this.height);
        context.stroke();
      }
      for ( let r = 0; r < this.rows; r++) {
        context.beginPath();
        context.moveTo(0, this.cellSize * r);
        context.lineTo(this.width, this.cellSize * r);
        context.stroke();
      }
      context.restore();
    }
    resize(width: number, height: number) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.width = this.canvas.width;
      this.height =this.canvas. height;
      this.init();
    }
    render(context: CanvasRenderingContext2D){
      if (this.debug) this.drawGrid(context);
      this.particles.forEach(particle => {
        particle.draw(context);
        particle.update();
      })
    }
}

const effect = new Effect(canvas);

const animate = () => {
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render(ctx);
  }
  requestAnimationFrame(animate);
}

animate();
