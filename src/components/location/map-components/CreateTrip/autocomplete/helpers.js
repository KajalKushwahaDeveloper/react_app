export const compose =
  (...fns) =>
    (...args) => {
      fns.forEach((fn) => fn && fn(...args))
    }

export const pick = (obj, ...props) => {
  return props.reduce((newObj, prop) => {
    if (obj && Object.prototype.hasOwnProperty.call(obj, prop)) {
      newObj[prop] = obj[prop]
    }
    return newObj
  }, {})
}
