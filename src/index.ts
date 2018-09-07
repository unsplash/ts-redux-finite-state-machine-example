import * as actions from './actions';
import { configureAndCreateStore } from './store';

const example = () => {
    const store = configureAndCreateStore();

    console.log('Initial state', store.getState());

    store.dispatch(actions.Action.Search({ query: 'dogs' }));

    setTimeout(() => {
        store.dispatch(
            actions.Action.SearchSuccess({
                items: [{ id: 'english-setter' }, { id: 'irish-setter' }],
            }),
        );

        setTimeout(() => {
            store.dispatch(actions.Action.Search({ query: 'cats' }));

            setTimeout(() => {
                store.dispatch(actions.Action.SearchFailure());
            }, 1000);
        }, 1000);
    }, 1000);
};

example();
