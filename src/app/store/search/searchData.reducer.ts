import { Action } from '../Action';
import { SearchActions } from './search.actions';
import { SelectOption } from '../../shared/types';

export interface ISearchData {
  searchStatus: string;
  deepLink: string;

  areaPaths: string[];
  release?: SelectOption;
  promise?: SelectOption;
  iterationPath?: SelectOption;
  pmGroupLead?: SelectOption;
  devGroupLead?: SelectOption;
  dnaGroupLead?: SelectOption;
  designGroupLead?: SelectOption;
}

export const initSearchData: ISearchData = {
  searchStatus: 'ready',
  deepLink: '',
  areaPaths: [] as string[],
}

export function searchDataReducer(state: ISearchData = initSearchData, action: Action): ISearchData {
  switch(action.type) {

    case SearchActions.RESTORE_SEARCH_OPTIONS: {
      return Object.assign({}, state, action.payload);
    }
    case SearchActions.UPDATE_SEARCH_STATUS: {
      return Object.assign({}, state, {
        searchStatus: action.payload
      });
    }
    case SearchActions.UPDATE_DEEP_LINK: {
      return Object.assign({}, state, {
        deepLink: action.payload
      })
    }

    case SearchActions.SET_AREA_PATHS: {
      return Object.assign({}, state, {
        areaPaths: action.payload
      });
    }

    case SearchActions.SET_RELEASE: {
      return Object.assign({}, state, {
        release: action.payload
      });
    }

    case SearchActions.SET_PROMISE: {
      return Object.assign({}, state, {
        promise: action.payload
      });
    }

    case SearchActions.SET_ITERATION_PATH: {
      return Object.assign({}, state, {
        iterationPath: action.payload
      });
    }

    case SearchActions.SET_PM_GROUP_LEAD: {
      return Object.assign({}, state, {
        pmGroupLead: action.payload
      });
    }

    case SearchActions.SET_DEV_GROUP_LEAD: {
      return Object.assign({}, state, {
        devGroupLead: action.payload
      });
    }

    case SearchActions.SET_DNA_GROUP_LEAD: {
      return Object.assign({}, state, {
        dnaGroupLead: action.payload
      });
    }

    case SearchActions.SET_DESIGN_GROUP_LEAD: {
      return Object.assign({}, state, {
        designGroupLead: action.payload
      });
    }
    default: {
      return state;
    }
  }
}