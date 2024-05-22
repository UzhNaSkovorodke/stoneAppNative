export function saveOrDeleteElementInArray(array, el) {
  array.includes(el) ? array.splice(array.indexOf(el), 1) : array.push(el);
  return array;
}
