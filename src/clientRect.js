export const clientRect = (element) => {
  const bounds = element.getBoundingClientRect();

  // console.log(sscroll.y, "scroll");
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
    offset: bounds.top + scroll,
  };
};
