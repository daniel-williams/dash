import { Injectable } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import * as Redux from 'redux';

import { Action, IAppState } from '../';

// import { UxScorecardService } from '../../dashboard/scorecard/shared';


@Injectable()
export class ScorecardActions {

  static FETCHING_STUDIES = 'FETCHING_STUDIES';
  static FETCH_STUDIES_SUCCESS = 'FETCH_STUDIES_SUCCESS';
  static FETCHING_STUDIES_FAILED = 'FETCHING_STUDIES_FAILED';

  static FETCHING_BROWSERS = 'FETCHING_BROWSERS';
  static FETCH_BROWSERS_SUCCESS = 'FETCH_BROWSERS_SUCCESS';
  static FETCHING_BROWSERS_FAILED = 'FETCHING_BROWSERS_FAILED';

  static SET_STUDY = 'SET_STUDY';
  static SET_BROWSERS = 'SET_BROWSERS';

  // constructor(private ngRedux: NgRedux<IAppState>, private uxss: UxScorecardService) {}
  constructor(private ngRedux: NgRedux<IAppState>) {}

  fetchStudies(): void {
    this.ngRedux.dispatch({
      type: ScorecardActions.FETCHING_STUDIES
    });

    // this.uxss.getStudies()
    //   .then(studies => this.ngRedux.dispatch({
    //     type: ScorecardActions.FETCH_STUDIES_SUCCESS,
    //     payload: studies }))
    //   .catch(err => this.ngRedux.dispatch({
    //     type: ScorecardActions.FETCHING_STUDIES_FAILED }));
  }

  setStudy(payload: string): void {
    this.ngRedux.dispatch({
      type: ScorecardActions.SET_STUDY,
      payload: payload
    });
  }

  setBrowsers(payload: string[]): void {
    this.ngRedux.dispatch({
      type: ScorecardActions.SET_BROWSERS,
      payload: payload
    });
  }
}
