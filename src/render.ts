import * as states from './states';

export const render = states.State.match<string>({
    Form: () => 'Form',
    Loading: ({ query }) => `Loading results for ${query}`,
    Failed: () => 'Failed',
    Success: ({ items }) => `Results: ${items.length}`,
});
