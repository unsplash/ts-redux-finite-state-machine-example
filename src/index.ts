import * as actions from './actions';
import { render } from './render';
import { configureAndCreateStore } from './store';

const example = () => {
    const store = configureAndCreateStore();

    const renderWithState = () => {
        const state = store.getState();

        const renderResult = render(state);
        console.log({ renderResult });
    };

    renderWithState();
    store.subscribe(renderWithState);

    // Simulate actions

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
