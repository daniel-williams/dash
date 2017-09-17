import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule }  from '@angular/platform-browser';

// vendor mods
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { NgReduxRouterModule, NgReduxRouter  } from '@angular-redux/router';

// app mods
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core';
import { SharedModule } from './shared';

// app comps
import { App } from './app.component';
import { PlanningNav } from './planning-nav.component';
import { PlanningSearch } from './planning-search.component';

import { AppConstants } from './app.constants';
import { RouteLogger } from './shared/utils';

// Redux related
import {
  IAppState,
  rootReducer,
  GlobalsActions,
  PlanningActions,
  SearchActions } from './store';

const createLogger = require('redux-logger');


@NgModule({
  bootstrap: [App],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,

    NgbModule.forRoot(),
    NgReduxModule,
    NgReduxRouterModule,

    AppRoutingModule,
    CoreModule,
    SharedModule,
  ],
  declarations: [
    App,
    PlanningNav,
    PlanningSearch,
  ],
  providers: [
    AppConstants,
    RouteLogger,

    GlobalsActions,
    PlanningActions,
    SearchActions,
  ]
})
export class AppModule {
  private middleWare: Array<any> = [];

    constructor(
      private appConstants: AppConstants,
      private ngRedux: NgRedux<IAppState>,
      private ngReduxRouter: NgReduxRouter
    ) {

      if(appConstants.logRouteChanges) {
        this.middleWare.push(createLogger());
      }

      this.ngRedux.configureStore(
        rootReducer,
        {},
        this.middleWare,
        []);

      this.ngReduxRouter.initialize();
    }
}
