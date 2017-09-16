import { Injectable } from '@angular/core';

import { Action } from '../Action';
import { SelectOption } from '../../shared/types';

import { IRestoreSearch } from './IRestoreSearch';

@Injectable()
export class SearchActions {
  static FETCH_AREA_PATH = 'FETCH_AREA_PATH';
  static FETCH_AREA_PATH_SUCCESS = 'FETCH_AREA_PATH_SUCCESS';
  static SET_AREA_PATHS = 'SET_AREA_PATHS';
  
  static FETCH_RELEASE = 'FETCH_RELEASE';
  static FETCH_RELEASE_SUCCESS = 'FETCH_RELEASE_SUCCESS';
  static SET_RELEASE = 'SET_RELEASE';
  
  static FETCH_PROMISE = 'FETCH_PROMISE';
  static FETCH_PROMISE_SUCCESS = 'FETCH_PROMISE_SUCCESS';
  static SET_PROMISE = 'SET_PROMISE';

  static FETCH_ITERATION_PATH = 'FETCH_ITERATION_PATH';
  static FETCH_ITERATION_PATH_SUCCESS = 'FETCH_ITERATION_PATH_SUCCESS';
  static SET_ITERATION_PATH = 'SET_ITERATION_PATH';
  
  static FETCH_PM_GROUP_LEADS = 'FETCH_PM_GROUP_LEADS';
  static FETCH_PM_GROUP_LEADS_SUCCESS = 'FETCH_PM_GROUP_LEADS_SUCCESS';
  static SET_PM_GROUP_LEAD = 'SET_PM_GROUP_LEAD';

  static FETCH_DEV_GROUP_LEADS = 'FETCH_DEV_GROUP_LEADS';
  static FETCH_DEV_GROUP_LEADS_SUCCESS = 'FETCH_DEV_GROUP_LEADS_SUCCESS';
  static SET_DEV_GROUP_LEAD = 'SET_DEV_GROUP_LEAD';

  static FETCH_DNA_GROUP_LEADS = 'FETCH_DNA_GROUP_LEADS';
  static FETCH_DNA_GROUP_LEADS_SUCCESS = 'FETCH_DNA_GROUP_LEADS_SUCCESS';
  static SET_DNA_GROUP_LEAD = 'SET_DNA_GROUP_LEAD';

  static FETCH_DESIGN_GROUP_LEADS = 'FETCH_DESIGN_GROUP_LEADS';
  static FETCH_DESIGN_GROUP_LEADS_SUCCESS = 'FETCH_DESIGN_GROUP_LEADS_SUCCESS';
  static SET_DESIGN_GROUP_LEAD = 'SET_DESIGN_GROUP_LEAD';

  static UPDATE_SEARCH_STATUS = 'UPDATE_SEARCH_STATUS';

  static UPDATE_DEEP_LINK = 'UPDATE_DEEP_LINK';
  static RESTORE_SEARCH_OPTIONS = 'RESTORE_SEARCH_OPTIONS';

  restoreSearchOptions(payload: IRestoreSearch): Action {
    return {
      type: SearchActions.RESTORE_SEARCH_OPTIONS,
      payload: payload
    };
  }

  // AreaPath
  fetchAreaPathOptions(): Action {
    return {
      type: SearchActions.FETCH_AREA_PATH
    };
  }

  // AreaPath
  fetchAreaPathOptionsSuccess(options: Array<string>): Action {
    return {
      type: SearchActions.FETCH_AREA_PATH_SUCCESS,
      payload: options
    };
  }

  // AreaPath
  setAreaPaths(payload: Array<string>): Action {
    return {
      type: SearchActions.SET_AREA_PATHS,
      payload: payload
    };
  }

  // Release
  fetchReleaseOptions(): Action {
    return {
      type: SearchActions.FETCH_RELEASE
    };
  }

  // Release
  fetchReleaseOptionsSuccess(payload: SelectOption[]): Action {
    return {
      type: SearchActions.FETCH_RELEASE_SUCCESS,
      payload: payload
    };
  }

  // Release
  setRelease(payload: SelectOption): Action {
    return {
      type: SearchActions.SET_RELEASE,
      payload: payload
    };
  }

  // Promise
  fetchPromiseOptions(): Action {
    return {
      type: SearchActions.FETCH_PROMISE
    };
  }

  // Promise
  fetchPromiseOptionsSuccess(payload: SelectOption[]): Action {
    return {
      type: SearchActions.FETCH_PROMISE_SUCCESS,
      payload: payload
    };
  }

  // Promise
  setPromise(payload: SelectOption): Action {
    return {
      type: SearchActions.SET_PROMISE,
      payload: payload
    };
  }

  // IterationPath
  fetchIterationPathOptions(): Action {
    return {
      type: SearchActions.FETCH_ITERATION_PATH
    };
  }

  // IterationPath
  fetchIterationPathOptionsSuccess(payload: SelectOption[]): Action {
    return {
      type: SearchActions.FETCH_ITERATION_PATH_SUCCESS,
      payload: payload
    };
  }

  // IterationPath
  setIterationPath(payload: SelectOption): Action {
    return {
      type: SearchActions.SET_ITERATION_PATH,
      payload: payload
    };
  }

  // PM
  fetchPmGroupLeadOptions(): Action {
    return {
      type: SearchActions.FETCH_PM_GROUP_LEADS
    };
  }

  // PM
  fetchPmGroupLeadOptionsSuccess(payload: SelectOption[]): Action {
    return {
      type: SearchActions.FETCH_PM_GROUP_LEADS_SUCCESS,
      payload: payload
    };
  }

  // PM
  setPmGroupLead(payload: SelectOption): Action {
    return {
      type: SearchActions.SET_PM_GROUP_LEAD,
      payload: payload
    };
  }

  // Dev
  fetchDevGroupLeadOptions(): Action {
    return {
      type: SearchActions.FETCH_DEV_GROUP_LEADS
    };
  }

  // Dev
  fetchDevGroupLeadOptionsSuccess(payload: SelectOption[]): Action {
    return {
      type: SearchActions.FETCH_DEV_GROUP_LEADS_SUCCESS,
      payload: payload
    };
  }

  // Dev
  setDevGroupLead(payload: SelectOption): Action {
    return {
      type: SearchActions.SET_DEV_GROUP_LEAD,
      payload: payload
    };
  }


  // Qaulity
  fetchDnaGroupLeadOptions(): Action {
    return {
      type: SearchActions.FETCH_DNA_GROUP_LEADS
    };
  }

  // Qaulity
  fetchDnaGroupLeadOptionsSuccess(options: SelectOption[]): Action {
    return {
      type: SearchActions.FETCH_DNA_GROUP_LEADS_SUCCESS,
      payload: options
    };
  }

  // Qaulity
  setDnaGroupLead(payload: SelectOption): Action {
    return {
      type: SearchActions.SET_DNA_GROUP_LEAD,
      payload: payload
    };
  }


  // Design
  fetchDesignGroupLeadOptions(): Action {
    return {
      type: SearchActions.FETCH_DESIGN_GROUP_LEADS
    };
  }

  // Design
  fetchDesignGroupLeadOptionsSuccess(options: SelectOption[]): Action {
    return {
      type: SearchActions.FETCH_DESIGN_GROUP_LEADS_SUCCESS,
      payload: options
    };
  }

  // Design
  setDesignGroupLead(payload: SelectOption): Action {
    return {
      type: SearchActions.SET_DESIGN_GROUP_LEAD,
      payload: payload
    };
  }


  // DeepLink
  updateDeepLink(payload: string): Action {
    return {
      type: SearchActions.UPDATE_DEEP_LINK,
      payload: payload
    };
  }

  // SearchStatus
  updateSearchStatus(payload: string): Action {
    return {
      type: SearchActions.UPDATE_SEARCH_STATUS,
      payload: payload
    };
  }
}