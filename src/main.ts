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
  constructor() {

  }
  update() {

  }
  draw() {
    
  }
}

class Effect {
    constructor(width, height) {
      
    }
}

