import { Injectable } from '@angular/core';

import { Action } from '../Action';


@Injectable()
export class GlobalsActions {
  static SET_DISPLAY_NAV = 'SET_DISPLAY_NAV';

  setDisplayNav(val: boolean): Action {
    return {
      type: GlobalsActions.SET_DISPLAY_NAV,
      payload: val
    };
  }
}
