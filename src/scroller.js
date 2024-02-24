import { Track } from "./track";

import { lerp } from "./math";

export class Scroller extends Track {
  current = 0;
  target = 0;
  shouldRender = false;

  constructor({ element, config, cb, addClass, settings }) {
    super({ element, config, cb, addClass });
    this.settings = settings;
    this.settings.end = +this.settings.end;

    this.canvas = this.element.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.preloadImages();
    this.drawImage(0);
  }

  preloadImages() {
    for (let i = 0; i < this.settings.end; i++) {
      const img = new Image();
      img.src = this.currentFrame(i);
    }
  }

  currentFrame(i) {
    return `${this.settings.track}img${i.toString()}.webp`;
  }

  drawImage(i = 0) {
    if (this.drawnFrame === i) return;
    this.drawnFrame = i;

    const img = new Image();
    img.onload = () => {
      this.canvas.width = img.naturalWidth;
      this.canvas.height = img.naturalHeight;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0);
    };

    img.src = this.currentFrame(i);
  }

  isIn() {
    this.shouldRender = true;
  }

  isOut() {
    this.shouldRender = false;
  }

  update() {
    if (!this.shouldRender) return;

    this.current = lerp(this.current, this.value, 0.5);
    const frameIndex = Math.floor(this.value * this.settings.end);
    this.drawImage(frameIndex);
  }
}
