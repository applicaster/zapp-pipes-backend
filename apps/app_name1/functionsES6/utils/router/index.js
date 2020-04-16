
import { buildProviderEngine, buildProviderMap } from '../providers';
import { parseRequest, forceAsync } from './routerUtils';
import { compose, reduce  } from 'ramda';

export function createRouterForProviders(providers) {
  const providersEngine = compose(
    buildProviderEngine,
    reduce(buildProviderMap, {}),
  )(providers);

  const router = (request, reply) => {

    const parserResult = compose(
      providersEngine,
      parseRequest
    )(request);

    if (!parserResult) {
      return reply('parser result is null or undefined').code(500);
    }

    return forceAsync(parserResult)
      .then(({ code, response }) => {
        reply(response).code(code);
      });
  };

  return {
    method: 'GET',
    path: '/{provider}/{command?}',
    handler: router
  };

}

