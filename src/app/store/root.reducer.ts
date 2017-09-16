import { routerReducer } from '@angular-redux/router';

import { Action } from './Action';
import { IGlobalState, globalsReducer } from './globals';
import { IPlanningState, planningReducer } from './planning';
import { IScorecardState, scorecardReducer } from './scorecard';
import { ISearchState, searchReducer } from './search';


export interface IAppState {
  router?: any;

  globals?: IGlobalState;
  planning?: IPlanningState;
  scorecard?: IScorecardState;
  search?: ISearchState;
};

export const rootReducer = (state: IAppState = {}, action: Action): IAppState => {
  return Object.assign({}, state, {
    router: routerReducer(state.router, action as any),

    globals: globalsReducer(state.globals, action),
    planning: planningReducer(state.planning, action),
    scorecard: scorecardReducer(state.scorecard, action),
    search: searchReducer(state.search, action),
  });
}
