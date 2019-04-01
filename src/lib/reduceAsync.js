function reduceAsync (array, handler, startingValue) {
  return array.reduce(function (promise, value) {
    return promise.then(acc => {
      return Promise.resolve(handler(acc, value))
    })
  }, Promise.resolve(startingValue))
}

export default reduceAsync
