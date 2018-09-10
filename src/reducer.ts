import { Reducer } from 'redux';

import { Action, ActionType } from './actions';
import * as states from './states';

const initialState: states.State = states.form();

export const reducer: Reducer<states.State, Action> = (state = initialState, action) => {
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
