/**
 * 立即调用 callback，delay 秒内不会调用第二次，一直调用会一直延迟
 */
export const debounce = (callback: any, delay: number) => {
  let timer: any = null;

  return function () {
    if (timer) {
      clearTimeout(timer);
    } else {
      callback(...arguments);
    }
    timer = setTimeout(() => {
      timer = null;
    }, delay);
  };
};
