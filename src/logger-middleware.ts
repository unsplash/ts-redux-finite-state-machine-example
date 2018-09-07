import { Middleware } from 'redux';

import { State } from './states';

export const loggerMiddleware: Middleware<{}, State> = _store => next => action => {
    // The current version of the Redux typings are poor and return `any` here, so we must assert
    // the type.
    const nextState = next(action) as State;

    console.log({ action, nextState });

    return nextState;
};
