/**
 * 时间日期相关操作 2019-xx-xx
 */

export function getDate () {
  let date = new Date()
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  return y + '-' + m + '-' + d
}
