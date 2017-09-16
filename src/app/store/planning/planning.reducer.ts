import { Action } from '../Action';
import { PlanningActions } from './planning.actions';

export interface IPlanningState { }

const initialState: IPlanningState = { };

export function planningReducer(state: IPlanningState = initialState, action: Action) {
  switch(action.type) {
    default: {
      return state;
    }
  }
}
