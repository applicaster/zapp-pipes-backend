import nativeBridge from './nativeBridge';
import config from '../config';
import { prop } from 'ramda';
import { parseQueryParameters } from './utils';

const { errorMessages } = config;

export const buildProviderMap = (providers, currentProvider) => ({
  ...providers,
  [currentProvider.name]: currentProvider,
});

export const buildProviderEngine = providers => ({
  provider: providerName,
  command,
  params,
}) => {
  if (Object.keys(providers).indexOf(providerName) === -1) {
    return nativeBridge.sendResponse(
      errorMessages.unknownProvider(providerName),
      404
    );
  }

  const provider = providers[providerName];
  const manifest = prop('manifest', provider);

  if (command === 'help') {
    return nativeBridge.sendResponse(manifest.help);
  }

  const { type } = params;
  if (manifest && manifest.handlers && manifest.handlers.indexOf(type) === -1) {
    return nativeBridge.sendResponse(
      errorMessages.unknownCommand(providerName, type),
      404
    );
  }

  const handlerParams = parseQueryParameters(params);

  return provider.handler(nativeBridge)(handlerParams);
};
