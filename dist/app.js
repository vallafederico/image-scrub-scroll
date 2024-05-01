(() => {
  // node_modules/.pnpm/@studio-freight+lenis@1.0.37/node_modules/@studio-freight/lenis/dist/lenis.mjs
  function t(t2, e, i) {
    return Math.max(t2, Math.min(e, i));
  }
  var Animate = class {
    advance(e) {
      if (!this.isRunning)
        return;
      let i = false;
      if (this.lerp)
        this.value = (s = this.value, o = this.to, n = 60 * this.lerp, l = e, function(t2, e2, i2) {
          return (1 - i2) * t2 + i2 * e2;
        }(s, o, 1 - Math.exp(-n * l))), Math.round(this.value) === this.to && (this.value = this.to, i = true);
      else {
        this.currentTime += e;
        const s2 = t(0, this.currentTime / this.duration, 1);
        i = s2 >= 1;
        const o2 = i ? 1 : this.easing(s2);
        this.value = this.from + (this.to - this.from) * o2;
      }
      var s, o, n, l;
      this.onUpdate?.(this.value, i), i && this.stop();
    }
    stop() {
      this.isRunning = false;
    }
    fromTo(t2, e, { lerp: i = 0.1, duration: s = 1, easing: o = (t3) => t3, onStart: n, onUpdate: l }) {
      this.from = this.value = t2, this.to = e, this.lerp = i, this.duration = s, this.easing = o, this.currentTime = 0, this.isRunning = true, n?.(), this.onUpdate = l;
    }
  };
  var Dimensions = class {
    constructor({ wrapper: t2, content: e, autoResize: i = true } = {}) {
      if (this.wrapper = t2, this.content = e, i) {
        const t3 = function(t4, e2) {
          let i2;
          return function() {
            let s = arguments, o = this;
            clearTimeout(i2), i2 = setTimeout(function() {
              t4.apply(o, s);
            }, e2);
          };
        }(this.resize, 250);
        this.wrapper !== window && (this.wrapperResizeObserver = new ResizeObserver(t3), this.wrapperResizeObserver.observe(this.wrapper)), this.contentResizeObserver = new ResizeObserver(t3), this.contentResizeObserver.observe(this.content);
      }
      this.resize();
    }
    destroy() {
      this.wrapperResizeObserver?.disconnect(), this.contentResizeObserver?.disconnect();
    }
    resize = () => {
      this.onWrapperResize(), this.onContentResize();
    };
    onWrapperResize = () => {
      this.wrapper === window ? (this.width = window.innerWidth, this.height = window.innerHeight) : (this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight);
    };
    onContentResize = () => {
      this.scrollHeight = this.content.scrollHeight, this.scrollWidth = this.content.scrollWidth;
    };
    get limit() {
      return { x: this.scrollWidth - this.width, y: this.scrollHeight - this.height };
    }
  };
  var Emitter = class {
    constructor() {
      this.events = {};
    }
    emit(t2, ...e) {
      let i = this.events[t2] || [];
      for (let t3 = 0, s = i.length; t3 < s; t3++)
        i[t3](...e);
    }
    on(t2, e) {
      return this.events[t2]?.push(e) || (this.events[t2] = [e]), () => {
        this.events[t2] = this.events[t2]?.filter((t3) => e !== t3);
      };
    }
    off(t2, e) {
      this.events[t2] = this.events[t2]?.filter((t3) => e !== t3);
    }
    destroy() {
      this.events = {};
    }
  };
  var VirtualScroll = class {
    constructor(t2, { wheelMultiplier: e = 1, touchMultiplier: i = 2, normalizeWheel: s = false }) {
      this.element = t2, this.wheelMultiplier = e, this.touchMultiplier = i, this.normalizeWheel = s, this.touchStart = { x: null, y: null }, this.emitter = new Emitter(), this.element.addEventListener("wheel", this.onWheel, { passive: false }), this.element.addEventListener("touchstart", this.onTouchStart, { passive: false }), this.element.addEventListener("touchmove", this.onTouchMove, { passive: false }), this.element.addEventListener("touchend", this.onTouchEnd, { passive: false });
    }
    on(t2, e) {
      return this.emitter.on(t2, e);
    }
    destroy() {
      this.emitter.destroy(), this.element.removeEventListener("wheel", this.onWheel, { passive: false }), this.element.removeEventListener("touchstart", this.onTouchStart, { passive: false }), this.element.removeEventListener("touchmove", this.onTouchMove, { passive: false }), this.element.removeEventListener("touchend", this.onTouchEnd, { passive: false });
    }
    onTouchStart = (t2) => {
      const { clientX: e, clientY: i } = t2.targetTouches ? t2.targetTouches[0] : t2;
      this.touchStart.x = e, this.touchStart.y = i, this.lastDelta = { x: 0, y: 0 }, this.emitter.emit("scroll", { deltaX: 0, deltaY: 0, event: t2 });
    };
    onTouchMove = (t2) => {
      const { clientX: e, clientY: i } = t2.targetTouches ? t2.targetTouches[0] : t2, s = -(e - this.touchStart.x) * this.touchMultiplier, o = -(i - this.touchStart.y) * this.touchMultiplier;
      this.touchStart.x = e, this.touchStart.y = i, this.lastDelta = { x: s, y: o }, this.emitter.emit("scroll", { deltaX: s, deltaY: o, event: t2 });
    };
    onTouchEnd = (t2) => {
      this.emitter.emit("scroll", { deltaX: this.lastDelta.x, deltaY: this.lastDelta.y, event: t2 });
    };
    onWheel = (e) => {
      let { deltaX: i, deltaY: s } = e;
      this.normalizeWheel && (i = t(-100, i, 100), s = t(-100, s, 100)), i *= this.wheelMultiplier, s *= this.wheelMultiplier, this.emitter.emit("scroll", { deltaX: i, deltaY: s, event: e });
    };
  };
  var Lenis = class {
    constructor({ wrapper: t2 = window, content: e = document.documentElement, wheelEventsTarget: i = t2, eventsTarget: s = i, smoothWheel: o = true, syncTouch: n = false, syncTouchLerp: l = 0.075, touchInertiaMultiplier: r = 35, duration: h, easing: a = (t3) => Math.min(1, 1.001 - Math.pow(2, -10 * t3)), lerp: c = !h && 0.1, infinite: u = false, orientation: p = "vertical", gestureOrientation: d = "vertical", touchMultiplier: m = 1, wheelMultiplier: g = 1, normalizeWheel: v = false, autoResize: S = true } = {}) {
      this.__isSmooth = false, this.__isScrolling = false, this.__isStopped = false, this.__isLocked = false, this.onVirtualScroll = ({ deltaX: t3, deltaY: e2, event: i2 }) => {
        if (i2.ctrlKey)
          return;
        const s2 = i2.type.includes("touch"), o2 = i2.type.includes("wheel");
        if (this.options.syncTouch && s2 && "touchstart" === i2.type)
          return void this.reset();
        const n2 = 0 === t3 && 0 === e2, l2 = "vertical" === this.options.gestureOrientation && 0 === e2 || "horizontal" === this.options.gestureOrientation && 0 === t3;
        if (n2 || l2)
          return;
        let r2 = i2.composedPath();
        if (r2 = r2.slice(0, r2.indexOf(this.rootElement)), r2.find((t4) => {
          var e3, i3, n3, l3;
          return (null === (e3 = t4.hasAttribute) || void 0 === e3 ? void 0 : e3.call(t4, "data-lenis-prevent")) || s2 && (null === (i3 = t4.hasAttribute) || void 0 === i3 ? void 0 : i3.call(t4, "data-lenis-prevent-touch")) || o2 && (null === (n3 = t4.hasAttribute) || void 0 === n3 ? void 0 : n3.call(t4, "data-lenis-prevent-wheel")) || (null === (l3 = t4.classList) || void 0 === l3 ? void 0 : l3.contains("lenis"));
        }))
          return;
        if (this.isStopped || this.isLocked)
          return void i2.preventDefault();
        if (this.isSmooth = this.options.syncTouch && s2 || this.options.smoothWheel && o2, !this.isSmooth)
          return this.isScrolling = false, void this.animate.stop();
        i2.preventDefault();
        let h2 = e2;
        "both" === this.options.gestureOrientation ? h2 = Math.abs(e2) > Math.abs(t3) ? e2 : t3 : "horizontal" === this.options.gestureOrientation && (h2 = t3);
        const a2 = s2 && this.options.syncTouch, c2 = s2 && "touchend" === i2.type && Math.abs(h2) > 5;
        c2 && (h2 = this.velocity * this.options.touchInertiaMultiplier), this.scrollTo(this.targetScroll + h2, Object.assign({ programmatic: false }, a2 ? { lerp: c2 ? this.options.syncTouchLerp : 1 } : { lerp: this.options.lerp, duration: this.options.duration, easing: this.options.easing }));
      }, this.onNativeScroll = () => {
        if (!this.__preventNextScrollEvent && !this.isScrolling) {
          const t3 = this.animatedScroll;
          this.animatedScroll = this.targetScroll = this.actualScroll, this.velocity = 0, this.direction = Math.sign(this.animatedScroll - t3), this.emit();
        }
      }, window.lenisVersion = "1.0.37", t2 !== document.documentElement && t2 !== document.body || (t2 = window), this.options = { wrapper: t2, content: e, wheelEventsTarget: i, eventsTarget: s, smoothWheel: o, syncTouch: n, syncTouchLerp: l, touchInertiaMultiplier: r, duration: h, easing: a, lerp: c, infinite: u, gestureOrientation: d, orientation: p, touchMultiplier: m, wheelMultiplier: g, normalizeWheel: v, autoResize: S }, this.animate = new Animate(), this.emitter = new Emitter(), this.dimensions = new Dimensions({ wrapper: t2, content: e, autoResize: S }), this.toggleClassName("lenis", true), this.velocity = 0, this.isLocked = false, this.isStopped = false, this.isSmooth = n || o, this.isScrolling = false, this.targetScroll = this.animatedScroll = this.actualScroll, this.options.wrapper.addEventListener("scroll", this.onNativeScroll, { passive: false }), this.virtualScroll = new VirtualScroll(s, { touchMultiplier: m, wheelMultiplier: g, normalizeWheel: v }), this.virtualScroll.on("scroll", this.onVirtualScroll);
    }
    destroy() {
      this.emitter.destroy(), this.options.wrapper.removeEventListener("scroll", this.onNativeScroll, { passive: false }), this.virtualScroll.destroy(), this.dimensions.destroy(), this.toggleClassName("lenis", false), this.toggleClassName("lenis-smooth", false), this.toggleClassName("lenis-scrolling", false), this.toggleClassName("lenis-stopped", false), this.toggleClassName("lenis-locked", false);
    }
    on(t2, e) {
      return this.emitter.on(t2, e);
    }
    off(t2, e) {
      return this.emitter.off(t2, e);
    }
    setScroll(t2) {
      this.isHorizontal ? this.rootElement.scrollLeft = t2 : this.rootElement.scrollTop = t2;
    }
    resize() {
      this.dimensions.resize();
    }
    emit() {
      this.emitter.emit("scroll", this);
    }
    reset() {
      this.isLocked = false, this.isScrolling = false, this.animatedScroll = this.targetScroll = this.actualScroll, this.velocity = 0, this.animate.stop();
    }
    start() {
      this.isStopped = false, this.reset();
    }
    stop() {
      this.isStopped = true, this.animate.stop(), this.reset();
    }
    raf(t2) {
      const e = t2 - (this.time || t2);
      this.time = t2, this.animate.advance(1e-3 * e);
    }
    scrollTo(e, { offset: i = 0, immediate: s = false, lock: o = false, duration: n = this.options.duration, easing: l = this.options.easing, lerp: r = !n && this.options.lerp, onComplete: h, force: a = false, programmatic: c = true } = {}) {
      if (!this.isStopped && !this.isLocked || a) {
        if (["top", "left", "start"].includes(e))
          e = 0;
        else if (["bottom", "right", "end"].includes(e))
          e = this.limit;
        else {
          let t2;
          if ("string" == typeof e ? t2 = document.querySelector(e) : (null == e ? void 0 : e.nodeType) && (t2 = e), t2) {
            if (this.options.wrapper !== window) {
              const t3 = this.options.wrapper.getBoundingClientRect();
              i -= this.isHorizontal ? t3.left : t3.top;
            }
            const s2 = t2.getBoundingClientRect();
            e = (this.isHorizontal ? s2.left : s2.top) + this.animatedScroll;
          }
        }
        if ("number" == typeof e) {
          if (e += i, e = Math.round(e), this.options.infinite ? c && (this.targetScroll = this.animatedScroll = this.scroll) : e = t(0, e, this.limit), s)
            return this.animatedScroll = this.targetScroll = e, this.setScroll(this.scroll), this.reset(), void (null == h || h(this));
          if (!c) {
            if (e === this.targetScroll)
              return;
            this.targetScroll = e;
          }
          this.animate.fromTo(this.animatedScroll, e, { duration: n, easing: l, lerp: r, onStart: () => {
            o && (this.isLocked = true), this.isScrolling = true;
          }, onUpdate: (t2, e2) => {
            this.isScrolling = true, this.velocity = t2 - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = t2, this.setScroll(this.scroll), c && (this.targetScroll = t2), e2 || this.emit(), e2 && (this.reset(), this.emit(), null == h || h(this), this.__preventNextScrollEvent = true, requestAnimationFrame(() => {
              delete this.__preventNextScrollEvent;
            }));
          } });
        }
      }
    }
    get rootElement() {
      return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
    }
    get limit() {
      return this.dimensions.limit[this.isHorizontal ? "x" : "y"];
    }
    get isHorizontal() {
      return "horizontal" === this.options.orientation;
    }
    get actualScroll() {
      return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop;
    }
    get scroll() {
      return this.options.infinite ? (t2 = this.animatedScroll, e = this.limit, (t2 % e + e) % e) : this.animatedScroll;
      var t2, e;
    }
    get progress() {
      return 0 === this.limit ? 1 : this.scroll / this.limit;
    }
    get isSmooth() {
      return this.__isSmooth;
    }
    set isSmooth(t2) {
      this.__isSmooth !== t2 && (this.__isSmooth = t2, this.toggleClassName("lenis-smooth", t2));
    }
    get isScrolling() {
      return this.__isScrolling;
    }
    set isScrolling(t2) {
      this.__isScrolling !== t2 && (this.__isScrolling = t2, this.toggleClassName("lenis-scrolling", t2));
    }
    get isStopped() {
      return this.__isStopped;
    }
    set isStopped(t2) {
      this.__isStopped !== t2 && (this.__isStopped = t2, this.toggleClassName("lenis-stopped", t2));
    }
    get isLocked() {
      return this.__isLocked;
    }
    set isLocked(t2) {
      this.__isLocked !== t2 && (this.__isLocked = t2, this.toggleClassName("lenis-locked", t2));
    }
    get className() {
      let t2 = "lenis";
      return this.isStopped && (t2 += " lenis-stopped"), this.isLocked && (t2 += " lenis-locked"), this.isScrolling && (t2 += " lenis-scrolling"), this.isSmooth && (t2 += " lenis-smooth"), t2;
    }
    toggleClassName(t2, e) {
      this.rootElement.classList.toggle(t2, e), this.emitter.emit("className change", this);
    }
  };

  // src/scroll.js
  var lenisDefault = (t2) => Math.min(1, 1.001 - Math.pow(2, -10 * t2));
  function handleEditor(onEditorView = null) {
    if (Webflow.env("editor") !== void 0) {
      if (onEditorView !== null)
        onEditorView();
      console.log("Webflow Editor View");
      return true;
    } else {
      return false;
    }
  }
  var Scroll = class extends Lenis {
    constructor() {
      super({
        duration: 1,
        smoothWheel: true,
        easing: lenisDefault,
        orientation: "vertical",
        smoothTouch: false,
        touchMultiplier: 2
      });
      this.isActive = true;
      this.callbacks = [];
      this.init();
      window.sscroll = this;
    }
    init() {
      this.y = window.scrollY;
      this.max = window.innerHeight;
      this.speed = 0;
      this.percent = this.y / (document.body.scrollHeight - window.innerHeight);
      this.on("scroll", ({ scroll, limit, velocity, progress }) => {
        this.y = scroll || 0;
        this.max = limit || window.innerHeight;
        this.speed = velocity || 0;
        this.percent = progress || 0;
        this.callbackRaf();
        handleEditor(this.destroy.bind(this));
      });
    }
    to(target) {
      this.scrollTo(target, {
        offset: 0,
        duration: 0.8,
        easing: lenisDefault,
        immediate: false
      });
    }
    resize() {
    }
    render(t2) {
      if (!this.isActive)
        return;
      this.raf(t2);
    }
    set active(value) {
      this.isActive = value;
    }
    callbackRaf() {
      this.callbacks.forEach((cb) => cb());
    }
    subscribe(callback) {
      this.callbacks.push(callback);
    }
    unsubscribe(callback) {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    }
    unsunbscribeAll() {
      this.callbacks = [];
    }
  };

  // src/clientRect.js
  var clientRect = (element) => {
    const bounds = element.getBoundingClientRect();
    let scroll = 0;
    scroll = sscroll.y;
    return {
      // screen
      top: bounds.top + scroll,
      bottom: bounds.bottom + scroll,
      width: bounds.width,
      height: bounds.height,
      left: bounds.left,
      right: bounds.right,
      wh: window.innerHeight,
      ww: window.innerWidth,
      offset: bounds.top + scroll
    };
  };

  // src/math.js
  function lerp(v0, v1, t2) {
    return v0 * (1 - t2) + v1 * t2;
  }
  function map(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }
  function clamp(min, max, num) {
    return Math.min(Math.max(num, min), max);
  }

  // src/observe.js
  var Observe = class {
    /**
     * Creates an instance of Observe.
     * @param {Object} options - The options object.
     * @param {HTMLElement} options.element - The element to observe.
     * @param {Object} [options.config] - The IntersectionObserver configuration options.
     * @param {HTMLElement} [options.config.root=null] - The element that is used as the viewport for checking visibility of the target.
     * @param {string} [options.config.margin='10px'] - Margin around the root element.
     * @param {number} [options.config.threshold=0] - A threshold of 0.0 means that the target will be visible when it intersects with the root element.
     * @param {boolean} [options.config.autoStart=false] - Whether to start observing the element automatically.
     * @param {string} [options.addClass] - The CSS class to add to the element when it is in view.
     * @param {Object} [options.cb] - The callback functions to execute when the element is in or out of view.
     * @param {Function} [options.cb.in] - The function to execute when the element is in view.
     * @param {Function} [options.cb.out] - The function to execute when the element is out of view.
     */
    constructor(element, { config, addClass, cb } = {}) {
      this.element = element;
      this.config = {
        root: config?.root || null,
        margin: config?.margin || "10px",
        threshold: config?.threshold || 0,
        autoStart: config?.autoStart || false
      };
      if (cb)
        this.cb = cb;
      if (addClass !== void 0)
        this.addClass = addClass;
      this.init();
      if (this.config.autoStart)
        this.start();
    }
    init() {
      this.in = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.isIn();
            }
          });
        },
        {
          root: this.config.root,
          rootMargin: this.config.margin,
          threshold: this.config.threshold
        }
      );
      this.out = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              this.isOut();
            }
          });
        },
        {
          root: this.config.root,
          rootMargin: "0px",
          threshold: 0
        }
      );
    }
    start() {
      this.in.observe(this.element);
      this.out.observe(this.element);
    }
    stop() {
      this.in.unobserve(this.element);
      this.out.unobserve(this.element);
    }
    isIn() {
      if (this.cb?.in)
        this.cb.in();
      if (this.addClass)
        this.element.classList.add(this.addClass);
    }
    isOut() {
      if (this.cb?.out)
        this.cb.out();
      if (this.addClass)
        this.element.classList.remove(this.addClass);
    }
  };

  // src/track.js
  var Track = class extends Observe {
    value = 0;
    constructor({ element, config, cb, addClass }) {
      super({ element, config, cb, addClass });
      this.element = element;
      this.config = {
        bounds: [0, 1],
        top: "bottom",
        bottom: "top",
        ...config
      };
      this.resize();
      if (window.sscroll)
        window.sscroll.subscribe(this.render.bind(this));
    }
    resize() {
      this.bounds = computeBounds(this.element, this.config);
    }
    render() {
      this.value = clamp(
        0,
        1,
        map(
          window.sscroll.y,
          // value
          this.bounds.top,
          // low1
          this.bounds.bottom,
          // high1
          this.config.bounds[0],
          this.config.bounds[1]
          // low2, high2
        )
      );
      this.afterRender();
    }
    afterRender() {
    }
  };
  function computeBounds(el, config) {
    const bounds = clientRect(el);
    switch (config.top) {
      case "top":
        bounds.top = bounds.top;
        break;
      case "center":
        bounds.top = bounds.top - bounds.wh / 2;
        break;
      case "bottom":
        bounds.top = bounds.top - bounds.wh;
        break;
    }
    switch (config.bottom) {
      case "top":
        bounds.bottom = bounds.bottom;
        break;
      case "center":
        bounds.bottom = bounds.bottom - bounds.wh / 2;
        break;
      case "bottom":
        bounds.bottom = bounds.bottom - bounds.wh;
        break;
    }
    return { ...bounds };
  }

  // src/scroller.js
  var Scroller = class extends Track {
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
      if (this.drawnFrame === i)
        return;
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
      if (!this.shouldRender)
        return;
      this.current = lerp(this.current, this.value, 0.5);
      const frameIndex = Math.floor(this.value * this.settings.end);
      this.drawImage(frameIndex);
    }
  };

  // src/app.js
  var App = class {
    items = [...document.querySelectorAll("[data-track]")];
    constructor() {
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
        const scroller = new Scroller({
          element: item,
          settings: {
            end,
            track
          }
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
    render(t2) {
      this.scroll.render(t2);
      this.scrollers.forEach((scroller) => scroller.update(this.scroll.y));
      requestAnimationFrame(this.render.bind(this));
    }
  };
  window.add = new App();
  function handleResize(container, cb) {
    new ResizeObserver((entry) => cb(entry[0].contentRect)).observe(container);
  }
})();
//# sourceMappingURL=app.js.map
