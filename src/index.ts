import * as actions from './actions';
import { configureAndCreateStore } from './store';

const example = () => {
    const store = configureAndCreateStore();

    console.log('Initial state', store.getState());

    store.dispatch(actions.search({ query: 'dogs' }));

    setTimeout(() => {
        store.dispatch(
            actions.searchSuccess({
                items: [{ id: 'english-setter' }, { id: 'irish-setter' }],
            }),
        );

        setTimeout(() => {
            store.dispatch(actions.search({ query: 'cats' }));

            setTimeout(() => {
                store.dispatch(actions.searchFailure());
            }, 1000);
        }, 1000);
    }, 1000);
};

example();
