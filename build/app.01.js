(()=>{var Q=Object.defineProperty;var Z=(o,t,e)=>t in o?Q(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var n=(o,t,e)=>(Z(o,typeof t!="symbol"?t+"":t,e),e);function z(o,t,e){return Math.max(o,Math.min(t,e))}var W=class{advance(t){var a;if(!this.isRunning)return;let e=!1;if(this.lerp)this.value=(i=this.value,s=this.to,r=60*this.lerp,h=t,function(l,c,p){return(1-p)*l+p*c}(i,s,1-Math.exp(-r*h))),Math.round(this.value)===this.to&&(this.value=this.to,e=!0);else{this.currentTime+=t;let l=z(0,this.currentTime/this.duration,1);e=l>=1;let c=e?1:this.easing(l);this.value=this.from+(this.to-this.from)*c}var i,s,r,h;(a=this.onUpdate)==null||a.call(this,this.value,e),e&&this.stop()}stop(){this.isRunning=!1}fromTo(t,e,{lerp:i=.1,duration:s=1,easing:r=l=>l,onStart:h,onUpdate:a}){this.from=this.value=t,this.to=e,this.lerp=i,this.duration=s,this.easing=r,this.currentTime=0,this.isRunning=!0,h==null||h(),this.onUpdate=a}},I=class{constructor({wrapper:t,content:e,autoResize:i=!0}={}){n(this,"resize",()=>{this.onWrapperResize(),this.onContentResize()});n(this,"onWrapperResize",()=>{this.wrapper===window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)});n(this,"onContentResize",()=>{this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth});if(this.wrapper=t,this.content=e,i){let s=function(r,h){let a;return function(){let l=arguments,c=this;clearTimeout(a),a=setTimeout(function(){r.apply(c,l)},h)}}(this.resize,250);this.wrapper!==window&&(this.wrapperResizeObserver=new ResizeObserver(s),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(s),this.contentResizeObserver.observe(this.content)}this.resize()}destroy(){var t,e;(t=this.wrapperResizeObserver)==null||t.disconnect(),(e=this.contentResizeObserver)==null||e.disconnect()}get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},T=class{constructor(){this.events={}}emit(t,...e){let i=this.events[t]||[];for(let s=0,r=i.length;s<r;s++)i[s](...e)}on(t,e){var i;return(i=this.events[t])!=null&&i.push(e)||(this.events[t]=[e]),()=>{var s;this.events[t]=(s=this.events[t])==null?void 0:s.filter(r=>e!==r)}}off(t,e){var i;this.events[t]=(i=this.events[t])==null?void 0:i.filter(s=>e!==s)}destroy(){this.events={}}},N=class{constructor(t,{wheelMultiplier:e=1,touchMultiplier:i=2,normalizeWheel:s=!1}){n(this,"onTouchStart",t=>{let{clientX:e,clientY:i}=t.targetTouches?t.targetTouches[0]:t;this.touchStart.x=e,this.touchStart.y=i,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:t})});n(this,"onTouchMove",t=>{let{clientX:e,clientY:i}=t.targetTouches?t.targetTouches[0]:t,s=-(e-this.touchStart.x)*this.touchMultiplier,r=-(i-this.touchStart.y)*this.touchMultiplier;this.touchStart.x=e,this.touchStart.y=i,this.lastDelta={x:s,y:r},this.emitter.emit("scroll",{deltaX:s,deltaY:r,event:t})});n(this,"onTouchEnd",t=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:t})});n(this,"onWheel",t=>{let{deltaX:e,deltaY:i}=t;this.normalizeWheel&&(e=z(-100,e,100),i=z(-100,i,100)),e*=this.wheelMultiplier,i*=this.wheelMultiplier,this.emitter.emit("scroll",{deltaX:e,deltaY:i,event:t})});this.element=t,this.wheelMultiplier=e,this.touchMultiplier=i,this.normalizeWheel=s,this.touchStart={x:null,y:null},this.emitter=new T,this.element.addEventListener("wheel",this.onWheel,{passive:!1}),this.element.addEventListener("touchstart",this.onTouchStart,{passive:!1}),this.element.addEventListener("touchmove",this.onTouchMove,{passive:!1}),this.element.addEventListener("touchend",this.onTouchEnd,{passive:!1})}on(t,e){return this.emitter.on(t,e)}destroy(){this.emitter.destroy(),this.element.removeEventListener("wheel",this.onWheel,{passive:!1}),this.element.removeEventListener("touchstart",this.onTouchStart,{passive:!1}),this.element.removeEventListener("touchmove",this.onTouchMove,{passive:!1}),this.element.removeEventListener("touchend",this.onTouchEnd,{passive:!1})}},M=class{constructor({wrapper:t=window,content:e=document.documentElement,wheelEventsTarget:i=t,eventsTarget:s=i,smoothWheel:r=!0,syncTouch:h=!1,syncTouchLerp:a=.075,touchInertiaMultiplier:l=35,duration:c,easing:p=d=>Math.min(1,1.001-Math.pow(2,-10*d)),lerp:u=!c&&.1,infinite:g=!1,orientation:b="vertical",gestureOrientation:j="vertical",touchMultiplier:Y=1,wheelMultiplier:A=1,normalizeWheel:X=!1,autoResize:D=!0}={}){this.__isSmooth=!1,this.__isScrolling=!1,this.__isStopped=!1,this.__isLocked=!1,this.onVirtualScroll=({deltaX:d,deltaY:w,event:m})=>{if(m.ctrlKey)return;let f=m.type.includes("touch"),F=m.type.includes("wheel");if(this.options.syncTouch&&f&&m.type==="touchstart")return void this.reset();let K=d===0&&w===0,G=this.options.gestureOrientation==="vertical"&&w===0||this.options.gestureOrientation==="horizontal"&&d===0;if(K||G)return;let y=m.composedPath();if(y=y.slice(0,y.indexOf(this.rootElement)),y.find(v=>{var E,L,O,C;return((E=v.hasAttribute)===null||E===void 0?void 0:E.call(v,"data-lenis-prevent"))||f&&((L=v.hasAttribute)===null||L===void 0?void 0:L.call(v,"data-lenis-prevent-touch"))||F&&((O=v.hasAttribute)===null||O===void 0?void 0:O.call(v,"data-lenis-prevent-wheel"))||((C=v.classList)===null||C===void 0?void 0:C.contains("lenis"))}))return;if(this.isStopped||this.isLocked)return void m.preventDefault();if(this.isSmooth=this.options.syncTouch&&f||this.options.smoothWheel&&F,!this.isSmooth)return this.isScrolling=!1,void this.animate.stop();m.preventDefault();let S=w;this.options.gestureOrientation==="both"?S=Math.abs(w)>Math.abs(d)?w:d:this.options.gestureOrientation==="horizontal"&&(S=d);let J=f&&this.options.syncTouch,q=f&&m.type==="touchend"&&Math.abs(S)>5;q&&(S=this.velocity*this.options.touchInertiaMultiplier),this.scrollTo(this.targetScroll+S,Object.assign({programmatic:!1},J?{lerp:q?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}))},this.onNativeScroll=()=>{if(!this.__preventNextScrollEvent&&!this.isScrolling){let d=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.velocity=0,this.direction=Math.sign(this.animatedScroll-d),this.emit()}},window.lenisVersion="1.0.37",t!==document.documentElement&&t!==document.body||(t=window),this.options={wrapper:t,content:e,wheelEventsTarget:i,eventsTarget:s,smoothWheel:r,syncTouch:h,syncTouchLerp:a,touchInertiaMultiplier:l,duration:c,easing:p,lerp:u,infinite:g,gestureOrientation:j,orientation:b,touchMultiplier:Y,wheelMultiplier:A,normalizeWheel:X,autoResize:D},this.animate=new W,this.emitter=new T,this.dimensions=new I({wrapper:t,content:e,autoResize:D}),this.toggleClassName("lenis",!0),this.velocity=0,this.isLocked=!1,this.isStopped=!1,this.isSmooth=h||r,this.isScrolling=!1,this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll,{passive:!1}),this.virtualScroll=new N(s,{touchMultiplier:Y,wheelMultiplier:A,normalizeWheel:X}),this.virtualScroll.on("scroll",this.onVirtualScroll)}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll,{passive:!1}),this.virtualScroll.destroy(),this.dimensions.destroy(),this.toggleClassName("lenis",!1),this.toggleClassName("lenis-smooth",!1),this.toggleClassName("lenis-scrolling",!1),this.toggleClassName("lenis-stopped",!1),this.toggleClassName("lenis-locked",!1)}on(t,e){return this.emitter.on(t,e)}off(t,e){return this.emitter.off(t,e)}setScroll(t){this.isHorizontal?this.rootElement.scrollLeft=t:this.rootElement.scrollTop=t}resize(){this.dimensions.resize()}emit(){this.emitter.emit("scroll",this)}reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.velocity=0,this.animate.stop()}start(){this.isStopped=!1,this.reset()}stop(){this.isStopped=!0,this.animate.stop(),this.reset()}raf(t){let e=t-(this.time||t);this.time=t,this.animate.advance(.001*e)}scrollTo(t,{offset:e=0,immediate:i=!1,lock:s=!1,duration:r=this.options.duration,easing:h=this.options.easing,lerp:a=!r&&this.options.lerp,onComplete:l,force:c=!1,programmatic:p=!0}={}){if(!this.isStopped&&!this.isLocked||c){if(["top","left","start"].includes(t))t=0;else if(["bottom","right","end"].includes(t))t=this.limit;else{let u;if(typeof t=="string"?u=document.querySelector(t):t!=null&&t.nodeType&&(u=t),u){if(this.options.wrapper!==window){let b=this.options.wrapper.getBoundingClientRect();e-=this.isHorizontal?b.left:b.top}let g=u.getBoundingClientRect();t=(this.isHorizontal?g.left:g.top)+this.animatedScroll}}if(typeof t=="number"){if(t+=e,t=Math.round(t),this.options.infinite?p&&(this.targetScroll=this.animatedScroll=this.scroll):t=z(0,t,this.limit),i)return this.animatedScroll=this.targetScroll=t,this.setScroll(this.scroll),this.reset(),void(l==null||l(this));if(!p){if(t===this.targetScroll)return;this.targetScroll=t}this.animate.fromTo(this.animatedScroll,t,{duration:r,easing:h,lerp:a,onStart:()=>{s&&(this.isLocked=!0),this.isScrolling=!0},onUpdate:(u,g)=>{this.isScrolling=!0,this.velocity=u-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=u,this.setScroll(this.scroll),p&&(this.targetScroll=u),g||this.emit(),g&&(this.reset(),this.emit(),l==null||l(this),this.__preventNextScrollEvent=!0,requestAnimationFrame(()=>{delete this.__preventNextScrollEvent}))}})}}}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return this.options.orientation==="horizontal"}get actualScroll(){return this.isHorizontal?this.rootElement.scrollLeft:this.rootElement.scrollTop}get scroll(){return this.options.infinite?(t=this.animatedScroll,e=this.limit,(t%e+e)%e):this.animatedScroll;var t,e}get progress(){return this.limit===0?1:this.scroll/this.limit}get isSmooth(){return this.__isSmooth}set isSmooth(t){this.__isSmooth!==t&&(this.__isSmooth=t,this.toggleClassName("lenis-smooth",t))}get isScrolling(){return this.__isScrolling}set isScrolling(t){this.__isScrolling!==t&&(this.__isScrolling=t,this.toggleClassName("lenis-scrolling",t))}get isStopped(){return this.__isStopped}set isStopped(t){this.__isStopped!==t&&(this.__isStopped=t,this.toggleClassName("lenis-stopped",t))}get isLocked(){return this.__isLocked}set isLocked(t){this.__isLocked!==t&&(this.__isLocked=t,this.toggleClassName("lenis-locked",t))}get className(){let t="lenis";return this.isStopped&&(t+=" lenis-stopped"),this.isLocked&&(t+=" lenis-locked"),this.isScrolling&&(t+=" lenis-scrolling"),this.isSmooth&&(t+=" lenis-smooth"),t}toggleClassName(t,e){this.rootElement.classList.toggle(t,e),this.emitter.emit("className change",this)}};var B=o=>Math.min(1,1.001-Math.pow(2,-10*o)),x=class extends M{constructor(){super({duration:1,smoothWheel:!0,easing:B,orientation:"vertical",smoothTouch:!1,touchMultiplier:2}),this.isActive=!0,this.callbacks=[],this.init(),window.sscroll=this}init(){this.y=window.scrollY,this.max=window.innerHeight,this.speed=0,this.percent=this.y/(document.body.scrollHeight-window.innerHeight),this.on("scroll",({scroll:t,limit:e,velocity:i,progress:s})=>{this.y=t||0,this.max=e||window.innerHeight,this.speed=i||0,this.percent=s||0,this.callbackRaf()})}to(t){this.scrollTo(t,{offset:0,duration:.8,easing:B,immediate:!1})}resize(){}render(t){this.isActive&&this.raf(t)}set active(t){this.isActive=t}callbackRaf(){this.callbacks.forEach(t=>t())}subscribe(t){this.callbacks.push(t)}unsubscribe(t){this.callbacks=this.callbacks.filter(e=>e!==t)}unsunbscribeAll(){this.callbacks=[]}};var P=o=>{let t=o.getBoundingClientRect(),e=0;return e=sscroll.y,{top:t.top+e,bottom:t.bottom+e,width:t.width,height:t.height,left:t.left,right:t.right,wh:window.innerHeight,ww:window.innerWidth,offset:t.top+e}};function U(o,t,e){return o*(1-e)+t*e}function V(o,t,e,i,s){return i+(s-i)*(o-t)/(e-t)}function $(o,t,e){return Math.min(Math.max(e,o),t)}var _=class{constructor(t,{config:e,addClass:i,cb:s}={}){this.element=t,this.config={root:(e==null?void 0:e.root)||null,margin:(e==null?void 0:e.margin)||"10px",threshold:(e==null?void 0:e.threshold)||0,autoStart:(e==null?void 0:e.autoStart)||!1},s&&(this.cb=s),i!==void 0&&(this.addClass=i),this.init(),this.config.autoStart&&this.start()}init(){this.in=new IntersectionObserver(t=>{t.forEach(e=>{e.isIntersecting&&this.isIn()})},{root:this.config.root,rootMargin:this.config.margin,threshold:this.config.threshold}),this.out=new IntersectionObserver(t=>{t.forEach(e=>{e.isIntersecting||this.isOut()})},{root:this.config.root,rootMargin:"0px",threshold:0})}start(){this.in.observe(this.element),this.out.observe(this.element)}stop(){this.in.unobserve(this.element),this.out.unobserve(this.element)}isIn(){var t;(t=this.cb)!=null&&t.in&&this.cb.in(),this.addClass&&this.element.classList.add(this.addClass)}isOut(){var t;(t=this.cb)!=null&&t.out&&this.cb.out(),this.addClass&&this.element.classList.remove(this.addClass)}};var R=class extends _{constructor({element:e,config:i,cb:s,addClass:r}){super({element:e,config:i,cb:s,addClass:r});n(this,"value",0);this.element=e,this.config={bounds:[0,1],top:"bottom",bottom:"top",...i},this.resize(),window.sscroll&&window.sscroll.subscribe(this.render.bind(this))}resize(){this.bounds=tt(this.element,this.config)}render(){this.value=$(0,1,V(window.sscroll.y,this.bounds.top,this.bounds.bottom,this.config.bounds[0],this.config.bounds[1])),this.afterRender()}afterRender(){}};function tt(o,t){let e=P(o);switch(t.top){case"top":e.top=e.top;break;case"center":e.top=e.top-e.wh/2;break;case"bottom":e.top=e.top-e.wh;break}switch(t.bottom){case"top":e.bottom=e.bottom;break;case"center":e.bottom=e.bottom-e.wh/2;break;case"bottom":e.bottom=e.bottom-e.wh;break}return{...e}}var k=class extends R{constructor({element:e,config:i,cb:s,addClass:r,settings:h}){super({element:e,config:i,cb:s,addClass:r});n(this,"current",0);n(this,"target",0);n(this,"shouldRender",!1);this.settings=h,this.settings.end=+this.settings.end,this.canvas=this.element.querySelector("canvas"),this.ctx=this.canvas.getContext("2d"),this.preloadImages(),this.drawImage(0)}preloadImages(){for(let e=0;e<this.settings.end;e++){let i=new Image;i.src=this.currentFrame(e)}}currentFrame(e){return`${this.settings.track}img${e.toString()}.webp`}drawImage(e=0){if(this.drawnFrame===e)return;this.drawnFrame=e;let i=new Image;i.onload=()=>{this.canvas.width=i.naturalWidth,this.canvas.height=i.naturalHeight,this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.drawImage(i,0,0)},i.src=this.currentFrame(e)}isIn(){this.shouldRender=!0}isOut(){this.shouldRender=!1}update(){if(!this.shouldRender)return;this.current=U(this.current,this.value,.5);let e=Math.floor(this.value*this.settings.end);this.drawImage(e)}};var H=class{constructor(){n(this,"items",[...document.querySelectorAll("[data-track]")]);this.scroll=new x,setTimeout(()=>{this.init(),this.render(),et(document.body,()=>this.resize())},0)}init(){this.scrollers=this.items.map(t=>{let{end:e,track:i}=t.dataset,s=new k({element:t,settings:{end:e,track:i}});return s.start(),s})}resize(){this.scrollers.forEach(t=>t.resize())}render(t){this.scroll.render(t),this.scrollers.forEach(e=>e.update(this.scroll.y)),requestAnimationFrame(this.render.bind(this))}};window.add=new H;function et(o,t){new ResizeObserver(e=>t(e[0].contentRect)).observe(o)}})();
