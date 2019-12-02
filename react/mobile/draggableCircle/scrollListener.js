// 用于监听超过 x 屏事件
function scorllListener(screenNum = 1, lessFn, moreFn) {
  // 获取屏幕高度
  let clientHeight = document.documentElement.clientHeight;
  // 滚动距离
  let commonScrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;

  if (commonScrollTop > clientHeight * screenNum) {
    lessFn && lessFn();
  } else {
    moreFn && moreFn();
  }
}

export default scorllListener;
