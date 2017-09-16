import { Action } from '../Action';

import { ScorecardActions } from './scorecard.actions';

export interface IScorecardState {
  study: string;
  browsers: string[];
}

const initialState: IScorecardState = {
  study: null,
  browsers: [], 
};

export function scorecardReducer(state: IScorecardState = initialState, action: Action) {
  switch(action.type) {
    case ScorecardActions.SET_STUDY: {
      return Object.assign({}, state, {
        study: action.payload
      });
    }
    case ScorecardActions.SET_BROWSERS: {
      return Object.assign({}, state, {
        browsers: action.payload
      });
    }
    default: {
      return state;
    }
  }
}
