function scrollendEvent(scrollingFn, scrollEndFn, timer = 300) {
  let lastScrollTop = 0;
  let currentScrollTop = 0;
  let t = null; // 定时器
  window.addEventListener("scroll", () => {
    clearTimeout(t);
    t = setTimeout(isScrollEnd, timer);
    lastScrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    scrollingFn && scrollingFn();
  });

  function isScrollEnd() {
    currentScrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScrollTop == lastScrollTop) {
      scrollEndFn && scrollEndFn();
    }
  }
}

export default scrollendEvent;
