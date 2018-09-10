import * as actions from './actions';
import { render } from './render';
import { configureAndCreateStore } from './store';

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const example = async () => {
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

    await wait(1000);

    store.dispatch(
        actions.searchSuccess({
            items: [{ id: 'english-setter' }, { id: 'irish-setter' }],
        }),
    );

    await wait(1000);

    store.dispatch(actions.search({ query: 'cats' }));

    await wait(1000);

    store.dispatch(actions.searchFailure());
};

example().catch(error => {
    console.error(error);
    process.exit(1);
});
