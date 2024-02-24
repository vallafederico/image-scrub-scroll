import { Scroll } from "./scroll";
import { Scroller } from "./scroller";

class App {
  items = [...document.querySelectorAll("[data-track]")];

  constructor() {
    // console.log(this.items);

    this.scroll = new Scroll();

    setTimeout(() => {
      this.init();
      this.render();
      handleResize(document.body, () => this.resize());
    }, 0);
  }

  init() {
    this.scrollers = this.items.map((item) => {
      const { end, track } = item.dataset;
      // console.log(start, end, track);

      const scroller = new Scroller({
        element: item,
        settings: {
          end,
          track,
        },
        // config: {
        //   bounds: [0, 1],
        //   top: "bottom",
        //   bottom: "top",
        // },
        // cb: {
        //   in: () => {
        //     console.log("in");
        //   },
        //   out: () => {
        //     console.log("out");
        //   },
        // },
      });

      scroller.start();
      return scroller;
    });
  }

  resize() {
    this.scrollers.forEach((scroller) => scroller.resize());
  }

  render(t) {
    this.scroll.render(t);
    this.scrollers.forEach((scroller) => scroller.update(this.scroll.y));
    requestAnimationFrame(this.render.bind(this));
  }
}

window.add = new App();

// utils
function handleResize(container, cb) {
  new ResizeObserver((entry) => cb(entry[0].contentRect)).observe(container);
}
