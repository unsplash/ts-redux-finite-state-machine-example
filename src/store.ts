import { createStore } from 'redux';

import { reducer } from './reducer';

export const configureAndCreateStore = () => {
    const store = createStore(reducer);

    return store;
};
