import {
  Action } from '../Action';
import {
  SearchActions } from './search.actions';
import {
  SelectOption } from '../../shared/types';


export interface ISearchOptions {
  areaPathOptions: string[];
  releaseOptions: SelectOption[];
  promiseOptions: SelectOption[];
  iterationPathOptions: SelectOption[];
  pmGroupLeadOptions: SelectOption[];
  devGroupLeadOptions: SelectOption[];
  dnaGroupLeadOptions: SelectOption[];
  designGroupLeadOptions: SelectOption[];
}

export const initSearchOptions: ISearchOptions = {
  areaPathOptions: [],
  releaseOptions: [],
  promiseOptions: [],
  iterationPathOptions: [],
  pmGroupLeadOptions: [],
  devGroupLeadOptions: [],
  dnaGroupLeadOptions: [],
  designGroupLeadOptions: [],
}

export function searchOptionsReducer(state: ISearchOptions = initSearchOptions, action: Action): ISearchOptions {
  switch(action.type) {

    case SearchActions.FETCH_AREA_PATH_SUCCESS: {
      return Object.assign({}, state, {
        areaPathOptions: action.payload
      });
    }
    
    case SearchActions.FETCH_RELEASE_SUCCESS: {
      return Object.assign({}, state, {
        releaseOptions: action.payload
      });
    }
    
    case SearchActions.FETCH_PROMISE_SUCCESS: {
      return Object.assign({}, state, {
        promiseOptions: action.payload
      });
    }

    case SearchActions.FETCH_ITERATION_PATH_SUCCESS: {
      return Object.assign({}, state, {
        iterationPathOptions: action.payload
      });
    }

    case SearchActions.FETCH_PM_GROUP_LEADS_SUCCESS: {
      return Object.assign({}, state, {
        pmGroupLeadOptions: action.payload
      });
    }

    case SearchActions.FETCH_DEV_GROUP_LEADS_SUCCESS: {
      return Object.assign({}, state, {
        devGroupLeadOptions: action.payload
      });
    }

    case SearchActions.FETCH_DNA_GROUP_LEADS_SUCCESS: {
      return Object.assign({}, state, {
        dnaGroupLeadOptions: action.payload
      });
    }

    case SearchActions.FETCH_DESIGN_GROUP_LEADS_SUCCESS: {
      return Object.assign({}, state, {
        designGroupLeadOptions: action.payload
      });
    }

    default: {
      return state;
    }
  }
}