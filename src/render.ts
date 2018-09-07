import * as states from './states';

export const render = (state: states.State) => {
    switch (state.type) {
        case states.StateType.Form:
            return 'Form';
        case states.StateType.Loading:
            return `Loading results for ${state.value.query}`;
        case states.StateType.Failed:
            return 'Failed';
        case states.StateType.Gallery:
            return `Results: ${state.value.items.length}`;
    }
};
