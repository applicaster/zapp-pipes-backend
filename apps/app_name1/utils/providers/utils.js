import url from 'url';
import queryString from 'query-string';
import atob from 'atob';
import {
  tryCatch,
  identity,
  has,
  compose,
  prop,
  unless,
  when,
  test,
  merge,
  over,
  lensProp,
  flip,
} from 'ramda';

const isValidUrl = compose(test(/^(http)/), prop('url'));

const parseAdditionalParams = obj =>
  compose(
    merge(obj),
    when(has('search'), compose(queryString.parse, prop('search'))),
    url.parse,
    prop('url')
  )(obj);

const decodeZappUrl = tryCatch(
  compose(atob, decodeURIComponent),
  flip(identity)
);

const decodeUrl = over(lensProp('url'), decodeZappUrl);

const processUrl = compose(
  parseAdditionalParams,
  unless(isValidUrl, decodeUrl)
);

export const parseQueryParameters = when(has('url'), processUrl);
