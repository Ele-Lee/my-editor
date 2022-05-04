export function debounce(fn: Function, wait: number, immediate?: boolean) {
  let timer: any = null;
  return function () {
    const context = this;
    const args = arguments;
    timer && clearTimeout(timer);
    if (immediate) {
      const now = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      now && fn.apply(context, args);
    } else {
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, wait);
    }
  };
}
