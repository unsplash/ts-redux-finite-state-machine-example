import { applyMiddleware, createStore } from 'redux';

import { loggerMiddleware } from './logger-middleware';
import { reducer } from './reducer';

export const configureAndCreateStore = () => {
    const store = createStore(reducer, applyMiddleware(loggerMiddleware));

    return store;
};
