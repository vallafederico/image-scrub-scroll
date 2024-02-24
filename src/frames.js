import { Transform } from "./animation/transform";
import { lerp } from "../util/math.js";

// TRACK       data-track="sat"
// CANVAS      data-a="sat"
// img size    1160 × 850
// length      0-56

const frames = 151;

export class Satellite {
  constructor() {
    // TRACK   data-track="sat"
    // CANVAS  data-a="sat"
    this.canvas = document.querySelector('[data-a="sat"]');

    this.canvas.width = 1160;
    this.canvas.height = 850;
    this.ctx = this.canvas.getContext("2d");

    this.track = new Transform({
      element: document.querySelector('[data-track="sat"]'),
    });

    this.current = 0;
    this.target = 0;

    this.preloadImages();
    this.drawImage(0);
  }

  preloadImages() {
    for (let i = 1; i < frames; i++) {
      const img = new Image();
      img.src = this.currentFrame(i);
    }
  }

  currentFrame(i) {
    return `/sat3/sat${i.toString().padStart(5, "0")}.webp`;
  }

  drawImage(i = 0) {
    if (this.drawnFrame === i) return;
    this.drawnFrame = i;

    const img = new Image();
    img.src = this.currentFrame(i);

    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0);
    };
  }

  render() {
    this.track?.render();
    // console.log(this.track.perc);

    this.target = this.track.perc;
    // if (Math.abs(this.current - this.target) < 0.05) return;
    this.current = lerp(this.current, this.target, 0.1);

    const frameIndex = Math.min(frames - 1, Math.floor(this.current * frames));
    // console.log("frameIndex", frameIndex);
    this.drawImage(frameIndex);
  }
}
