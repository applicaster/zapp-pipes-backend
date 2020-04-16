
export const parseRequest = request => {
  const { provider, command } = request.params;
  const params = request.query;
  return { provider, command, params };
}

const makeThenable = object => {
  object.then = f => f(object);
  return object;
}

const isThenable = object => (!!object.then && typeof object.then === 'function');

export const forceAsync = object => isThenable(object) ?
  object :
  makeThenable(object);
