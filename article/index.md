# Strongly-typed finite-state machines with Redux and TypeScript

Finite-state machines have been [all][david talk] [the](https://statecharts.github.io/) [rage](https://medium.com/@asolove/pure-ui-control-ac8d1be97a8d) recently. There are [many][xstate] [libraries](https://github.com/MicheleBertoli/react-automata) that allow you to work with finite-state machines. However, I wondered: how far can we get with our existing tools—[Redux] and the [reducer] pattern?

Note that this article is not concerned with why finite-state machines are useful. If you're interested in learning about why they are useful, I recommend [David Khourshid]'s talk ["Simplifying Complex UIs with Finite Automata & Statecharts"][david talk].

## Reducer is a state machine

At the core of state machines is the following function:

```ts
(state: State, action: Action) => State;
```

If you're familiar with [Redux], that might look familiar to you. A Redux [reducer] function is a state machine! A reducer function describes how the machine should [_transition_](https://statecharts.github.io/glossary/transition.html), given the previous state and an [action] (aka an [event](https://statecharts.github.io/glossary/event.html) in [statechart] terminology), to the next state.

This article is interested in how we can utilise Redux to write a _strongly-typed_ _finite_-state machine, in the interests of code correctness and readability. By _finite_, we mean that the machine may only be in one of a finite number of states at any given time. By _strongly-typed_, we mean that the states and actions should carry the types of their parameters, and these parameters should only be accessible when we've narrowed the union of states or actions to a single variant.

The examples in this article are [available on GitHub][example].

## Setting the scene

Throughout this article we will use the example of a simple photo gallery search. The application starts in a `Form` state, where the user may enter a query. Upon form submission the `Search` event is triggered, and the application should transition into a `Loading` state. When request either fails or succeeds, corresponding events `SearchFailure` and `SearchSuccess` are triggered the application should transition into the `Failed` or `Success` states, respectively. We can represent this as a [statechart] diagram:

![](./statechart.png)

(Generated via https://musing-rosalind-2ce8e7.netlify.com/?machine=%7B%22initial%22%3A%22Form%22%2C%22states%22%3A%7B%22Form%22%3A%7B%22on%22%3A%7B%22Search%22%3A%22Loading%22%7D%7D%2C%22Loading%22%3A%7B%22on%22%3A%7B%22SearchSuccess%22%3A%7B%22Gallery%22%3A%7B%7D%7D%2C%22SearchFailure%22%3A%22Failed%22%7D%7D%2C%22Failed%22%3A%7B%22on%22%3A%7B%22Search%22%3A%22Loading%22%7D%7D%2C%22Gallery%22%3A%7B%22on%22%3A%7B%22Search%22%3A%22Loading%22%7D%7D%7D%7D.)

## Prerequisites

To begin we must define some basic types and helpers which we'll need to use later on:

```ts
// types.ts
export type GalleryItem = { id: string };
```

## Defining states

Our `State` type is a tagged union of all the possible state variants. By expressing our state as a union, we're defining which states are valid. Later we'll use these states to define which transitions are valid.

Note how the `query` parameter is only available in the `Loading` state, and the `items` parameter is only available in the `Gallery` state. By restricting these parameters so that they only exist in their corresponding states, we are making [impossible states impossible](https://www.youtube.com/watch?v=IcgmSRJHu_8): the type system only allows us to access the parameters when we are in a state where they can exist.

(Note there are cleaner ways to define tagged unions in TypeScript, but I refrained from using them in this example for simplicity. See [the note at the end](#going-further).)

```ts
// states.ts
import { GalleryItem } from './types';

export enum StateType {
    Form = 'Form',
    Loading = 'Loading',
    Failed = 'Failed',
    Gallery = 'Gallery',
}

type Form = { type: StateType.Form };
export const form = (): Form => ({ type: StateType.Form });

type Loading = { type: StateType.Loading; query: string };
export const loading = ({ query }: { query: string }): Loading => ({
    type: StateType.Loading,
    query,
});

type Failed = { type: StateType.Failed };
export const failed = (): Failed => ({ type: StateType.Failed });

type Gallery = { type: StateType.Gallery; items: GalleryItem[] };
export const gallery = ({ items }: { items: GalleryItem[] }): Gallery => ({
    type: StateType.Gallery,
    items,
});

export type State = Form | Loading | Failed | Gallery;
```

## Defining actions

Our `Action` type is a tagged union of all the possible action variants.

```ts
// actions.ts
import { GalleryItem } from './types';

export enum ActionType {
    Search = 'Search',
    SearchFailure = 'SearchFailure',
    SearchSuccess = 'SearchSuccess',
}

type Search = { type: ActionType.Search; query: string };
export const search = ({ query }: { query: string }): Search => ({
    type: ActionType.Search,
    query,
});

type SearchFailure = { type: ActionType.SearchFailure };
export const searchFailure = (): SearchFailure => ({
    type: ActionType.SearchFailure,
});

type SearchSuccess = { type: ActionType.SearchSuccess; items: GalleryItem[] };
export const searchSuccess = ({
    items,
}: {
    items: GalleryItem[];
}): SearchSuccess => ({
    type: ActionType.SearchSuccess,
    items,
});

export type Action = Search | SearchFailure | SearchSuccess;
```

## Defining transitions

Earlier we saw how Redux's reducer functions allow us to describe our state transitions. As well how the transition should be performed, we can define which transitions are valid for given states. For example, a valid transition would be from a `Loading` state, given a `SearchFailure` event, to the `Failed` state—but the `SearchFailure` event should not cause a transition when we're in the `Form` state.

```ts
// reducer.ts
import { Reducer } from 'redux';

import { Action, ActionType } from './actions';
import * as states from './states';

const initialState: states.State = states.form();

export const reducer: Reducer<states.State, Action> = (
    state = initialState,
    action,
) => {
    switch (state.type) {
        // For each state, we match each valid event and perform the corresponding state transition.
        case states.StateType.Form:
        case states.StateType.Failed:
        case states.StateType.Gallery:
            switch (action.type) {
                case ActionType.Search:
                    return states.loading({ query: action.query });
                default:
                    return state;
            }
        case states.StateType.Loading: {
            switch (action.type) {
                case ActionType.SearchFailure:
                    return states.failed();
                case ActionType.SearchSuccess:
                    return states.gallery({ items: action.items });
                default:
                    return state;
            }
        }
    }
};
```

## Tying it all together

To demonstrate our state machine, we can simulate actions. In a real world application, these would be driven by outside events such as user interactions or HTTP responses.

```ts
// render.ts
import * as states from './states';

export const render = (state: states.State) => {
    switch (state.type) {
        case states.StateType.Form:
            return 'Form';
        case states.StateType.Loading:
            return `Loading results for ${state.query}`;
        case states.StateType.Failed:
            return 'Failed';
        case states.StateType.Gallery:
            return `Results: ${state.items.length}`;
    }
};
```

```ts
// index.ts
import * as actions from './actions';
import { render } from './render';
import { configureAndCreateStore } from './store';

const wait = (ms: number) =>
    new Promise<void>(resolve => setTimeout(resolve, ms));

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

    actions.searchSuccess({
        items: [{ id: 'english-setter' }, { id: 'irish-setter' }],
    });

    await wait(1000);

    store.dispatch(actions.search({ query: 'cats' }));

    await wait(1000);

    store.dispatch(actions.searchFailure());
};

example().catch(error => {
    console.error(error);
    process.exit(1);
});
```

This produces the following output in the console:

```
{ renderResult: 'Form' }
{ renderResult: 'Loading results for dogs' }
{ renderResult: 'Results: 2' }
{ renderResult: 'Loading results for cats' }
{ renderResult: 'Failed' }
```

## Going further

There is much more to state machines than this example demonstrates. However, the simple primitive of a reducer allows for all types of state machines. For example, ["nested state machines"](https://en.wikipedia.org/wiki/UML_state_machine#Hierarchically_nested_states) can simply be modelled as nested reducers. Likewise, ["parallel state machines"](https://statecharts.github.io/glossary/parallel-state.html) are just [combined reducers](https://redux.js.org/recipes/structuringreducers/usingcombinereducers).

Our `Action` and `State` types are known as [tagged union] types. There are much cleaner ways of defining and using tagged union types in TypeScript, but I refrained from using them in this example for simplicity. At Unsplash we tend to use [unionize]. For example, here is how we might define the `Action` tagged union type if we were to use unionize:

```ts
// actions.ts
import { ofType, unionize, UnionOf } from 'unionize';

import { GalleryItem } from './types';

export type SearchAction = { query: string };

export const Action = unionize(
    {
        Search: ofType<SearchAction>(),
        SearchFailure: ofType<{}>(),
        SearchSuccess: ofType<{ items: GalleryItem[] }>(),
    },
    // Tag must be `type` to conform to expected Redux action type.
    { tag: 'type' },
);
export type Action = UnionOf<typeof Action>;
```

A full example using unionize can be seen at https://github.com/unsplash/ts-redux-finite-state-machine-example/tree/unionize.

---

If you like how we do things at Unsplash, consider [joining us](https://medium.com/unsplash/unsplash-is-hiring-3rd-full-stack-engineer-fc883d9ebde3)!

[tagged union]: https://en.wikipedia.org/wiki/Tagged_union
[statechart]: https://statecharts.github.io/
[redux]: https://redux.js.org/
[reducer]: https://redux.js.org/basics/reducers
[action]: (https://redux.js.org/basics/actions)
[xstate]: https://github.com/davidkpiano/xstate
[unionize]: https://github.com/pelotom/unionize
[example]: https://github.com/unsplash/ts-redux-finite-state-machine-example
[david talk]: https://www.youtube.com/watch?v=RqTxtOXcv8Y
[david khourshid]: https://twitter.com/DavidKPiano
