import { Action } from '../Action';
import { GlobalsActions } from './globals.actions';

export interface IGlobalState {
  displayNav: boolean;
}

const initialState: IGlobalState = {
  displayNav: true,
};

export function globalsReducer(state: IGlobalState = initialState, action: Action) {
  switch(action.type) {
    case GlobalsActions.SET_DISPLAY_NAV: {
      return Object.assign({}, state, {
        displayNav: action.payload
      });
    }
    default: {
      return state;
    }
  }
}
