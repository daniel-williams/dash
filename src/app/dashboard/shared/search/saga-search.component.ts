import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Headers, Http, RequestOptions } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';

import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AppConstants } from '../../../app.constants';
import { VsoService } from '../../../shared/services';
import { newId } from '../../../shared/utils';
import { IAppState, SearchActions, IRestoreSearch } from '../../../store';
import { ISearchCriteria, SelectOption, SearchControlMask } from '../../../shared/types';
import {
  IMultiSelectOption,
  IMultiSelectSettings,
  IMultiSelectTexts } from '../multi-select-dropdown';

import { SearchService } from './search.service';


@Component({
  selector: 'saga-search',
  templateUrl: './saga-search.component.html',
  styleUrls: ['./saga-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SagaSearch {
  @select(['search', 'data', 'deepLink']) readonly deepLink$: Observable<string>;
  @select(['search', 'data', 'searchStatus']) readonly searchStatus$: Observable<string>;

  @select(['search', 'data', 'areaPaths']) readonly areaPaths$: Observable<string[]>;
  @select(['search', 'data', 'release']) readonly release$: Observable<SelectOption>;
  @select(['search', 'data', 'promise']) readonly promise$: Observable<SelectOption>;
  @select(['search', 'data', 'iterationPath']) readonly iterationPath$: Observable<SelectOption>;
  @select(['search', 'data', 'pmGroupLead']) readonly pmGroupLead$: Observable<SelectOption>;
  @select(['search', 'data', 'devGroupLead']) readonly devGroupLead$: Observable<SelectOption>;
  @select(['search', 'data', 'dnaGroupLead']) readonly dnaGroupLead$: Observable<SelectOption>;
  @select(['search', 'data', 'designGroupLead']) readonly designGroupLead$: Observable<SelectOption>;

  @select(['search', 'options', 'areaPathOptions']) readonly areaPathOptions$: Observable<string[]>;
  @select(['search', 'options', 'releaseOptions']) readonly releaseOptions$: Observable<SelectOption[]>;
  @select(['search', 'options', 'promiseOptions']) readonly promiseOptions$: Observable<SelectOption[]>;
  @select(['search', 'options', 'iterationPathOptions']) readonly iterationPathOptions$: Observable<SelectOption[]>;
  @select(['search', 'options', 'pmGroupLeadOptions']) readonly pmGroupLeadOptions$: Observable<SelectOption[]>;
  @select(['search', 'options', 'devGroupLeadOptions']) readonly devGroupLeadOptions$: Observable<SelectOption[]>;
  @select(['search', 'options', 'dnaGroupLeadOptions']) readonly dnaGroupLeadOptions$: Observable<SelectOption[]>;
  @select(['search', 'options', 'designGroupLeadOptions']) readonly designGroupLeadOptions$: Observable<SelectOption[]>;

  public multiSelectSettings: IMultiSelectSettings;
  public multiSelectTexts: IMultiSelectTexts;
  public multiSelectOptions: IMultiSelectOption[];

  private searchControlMask: SearchControlMask;

  private deepLink: string;

  private searchStatus: string;

  private areaPaths: string[] = [];

  private releaseOptions: SelectOption[] = [];
  private release: SelectOption;

  private promiseOptions: SelectOption[] = [];
  private promise: SelectOption;

  private iterationPathOptions: SelectOption[];
  private iterationPath: SelectOption;

  private pmGroupLeadOptions: SelectOption[] = [];
  private pmGroupLead: SelectOption;

  private devGroupLeadOptions: SelectOption[] = [];
  private devGroupLead: SelectOption;

  private dnaGroupLeadOptions: SelectOption[] = [];
  private dnaGroupLead: SelectOption;

  private designGroupLeadOptions: SelectOption[] = [];
  private designGroupLead: SelectOption;

  private subs: Subscription[] = [];

  private requestOptions = new RequestOptions({
    headers: new Headers({ 'Content-Type': 'application/json' })
  });
  private lastDeepLink: string = '';

  constructor(
    private searchService: SearchService,
    private appConstants: AppConstants,
    private http: Http,
    private vso: VsoService,
    private ngRedux: NgRedux<IAppState>,
    private actions: SearchActions,
    private route: ActivatedRoute,
    private router: Router) {

    this.multiSelectSettings = {
      enableSearch: true,
      showUncheckAll: true,
      dynamicTitleMaxItems: 2,
      maxHeight: '300px',
    };

    this.multiSelectTexts = {
      uncheckAll: 'clear all',
      searchPlaceholder: 'filter...',
      defaultTitle: ''
    };

    this.subs.push(this.searchService
      .controlMask$.subscribe(x => this.searchControlMask = x)
    );
    this.subs.push(this.searchService
      .searchCriteria$.subscribe(searchCriteria => {
        let deepLinkPlayload = {
          AreaPath: searchCriteria.areaPaths.join(';'),
          Release: searchCriteria.release,
          Promise: searchCriteria.promise,
          IterationPath: searchCriteria.iterationPath,
          PmGroup: searchCriteria.pmGroupLead,
          DevGroup: searchCriteria.devGroupLead,
          QualityGroup: searchCriteria.dnaGroupLead,
          DesignGroup: searchCriteria.designGroupLead
        };

        if(this.appConstants.useCorpResources) {
          this.http
            .post(this.appConstants.sagaApiEndpoint + 'readiness/deep-link', deepLinkPlayload, this.requestOptions)
            .map(res => res.json())
            .toPromise()
            .then(res => this.ngRedux.dispatch(this.actions.updateDeepLink(res)))
            .catch(err => console.log('deep link error: ', err));
        } else {
          // Mock deeplink generation
          console.log('mocking deepLink.');
          this.ngRedux.dispatch(this.actions.updateDeepLink(newId()));
        }
      })
    );

    let deepLinkReconciliation$ = Observable.combineLatest(
      route.queryParams,
      this.deepLink$,
      (params, deepLink) => {
        return {
          queryDeepLink: (params || {}) && (params['q'] || ''),
          deepLink: deepLink || ''
        };
      });

    this.subs.push(deepLinkReconciliation$
      .subscribe(x => {
        if(!!x.queryDeepLink && x.queryDeepLink !== this.lastDeepLink) {
          this.lastDeepLink = x.queryDeepLink;

          if(appConstants.useCorpResources) {

            this.http
              .get(this.appConstants.sagaApiEndpoint + 'readiness/deep-link/' + x.queryDeepLink, this.requestOptions)
              .map(response => response.json())
              .toPromise()
              .then(json => {
                let restoreSearch: IRestoreSearch = {
                  areaPaths: [],
                  release: null,
                  iterationPath: null,
                  promise: null,
                  pmGroupLead: null,
                  devGroupLead: null,
                  dnaGroupLead: null,
                  designGroupLead: null
                };

                if(json.AreaPath) {
                  try {
                    restoreSearch.areaPaths = ((json.AreaPath || '').split(';') as string[]).filter(x => !!x.trim());
                  } catch(err) { }
                }
                if(json.Release) {
                  restoreSearch.release = this.releaseOptions.find(x => x.value === json.Release);
                }
                if(json.Promise) {
                  restoreSearch.promise = this.promiseOptions.find(x => x.value === json.Promise);
                }
                if(json.IterationPath) {
                  restoreSearch.iterationPath = this.iterationPathOptions.find(x => x.value === json.IterationPath);
                }
                if(json.PmGroup) {
                  restoreSearch.pmGroupLead = this.pmGroupLeadOptions.find(x => x.value === json.PmGroup);
                }
                if(json.DevGroup) {
                  restoreSearch.devGroupLead = this.devGroupLeadOptions.find(x => x.value === json.DevGroup);
                }
                if(json.QualityGroup) {
                  restoreSearch.dnaGroupLead = this.dnaGroupLeadOptions.find(x => x.value === json.QualityGroup);
                }
                if(json.DesignGroup) {
                  restoreSearch.designGroupLead = this.designGroupLeadOptions.find(x => x.value === json.DesignGroup);
                }

                setTimeout(() => {
                  this.ngRedux.dispatch(this.actions.restoreSearchOptions(restoreSearch));
                  setTimeout(() => this.triggerSearch(), 0);
                }, 0);
              })
              .catch(err => console.log('error fetching saved search options', err));
          }

        } else if(!!x.deepLink && x.deepLink !== this.lastDeepLink) {
          this.lastDeepLink = x.deepLink;

          this.router.navigate([], {
              queryParams: {q: x.deepLink},
              relativeTo: this.route
          });
        }
      }));

    this.subs.push(this.searchStatus$
      .subscribe(x => this.searchStatus = x)
    );

    this.subs.push(this.areaPathOptions$
      .subscribe(options => {
        if(!options.length) {
          vso.getAreaPaths()
            .then(paths => {
              this.ngRedux.dispatch(this.actions.fetchAreaPathOptionsSuccess(paths));
              this.setMultiSelectOptions(paths);
            });
        } else {
          this.setMultiSelectOptions(options);
        }
      }));

    this.subs.push(this.areaPaths$
      .subscribe(x => this.areaPaths = x));


    this.subs.push(this.releaseOptions$
      .subscribe(options => {
        if(!options.length) {
          vso.getReleaseOptions()
            .then(options => {
              this.ngRedux.dispatch(this.actions.fetchReleaseOptionsSuccess(options));
              this.setReleaseOptions(options);
              let selected = options.find(item => item.isSelected);
              if(selected) {
                this.onReleaseChanged(selected);
              }
            });
        } else {
          this.setReleaseOptions(options);
        }
      }));

    this.subs.push(this.release$
      .subscribe(x => this.release = x));



    this.subs.push(this.promiseOptions$
      .subscribe(options => {
        if(!options.length) {
          vso.getPromiseOptions()
            .then(options => {
              this.ngRedux.dispatch(this.actions.fetchPromiseOptionsSuccess(options));
              this.setPromiseOptions(options);
              let selected = options.find(item => item.isSelected);
              if(selected) {
                this.onPromiseChanged(selected);
              }
            });
        } else {
          this.setPromiseOptions(options);
        }
      }));

    this.subs.push(this.promise$
      .subscribe(x => this.promise = x));


      this.subs.push(this.iterationPathOptions$
        .subscribe(options => {
          if(!options.length) {
            vso.getIterationPathOptions()
              .then(paths => {
                this.ngRedux.dispatch(this.actions.fetchIterationPathOptionsSuccess(paths));
                this.setIterationPathOptions(paths);
              });
          } else {
            this.setIterationPathOptions(options);
          }
        }));

      this.subs.push(this.iterationPath$
        .subscribe(x => this.iterationPath = x));

    this.subs.push(this.pmGroupLeadOptions$
      .subscribe(options => {
        if(!options.length) {
          vso.getPmLeadOptions()
            .then(paths => {
              this.ngRedux.dispatch(this.actions.fetchPmGroupLeadOptionsSuccess(paths));
              this.setPmGroupLeadOptions(paths);
            });
        } else {
          this.setPmGroupLeadOptions(options);
        }
      }));

    this.subs.push(this.pmGroupLead$
      .subscribe(x => this.pmGroupLead = x));

    this.subs.push(this.devGroupLeadOptions$
      .subscribe(options => {
        if(!options.length) {
          vso.getDevLeadOptions()
            .then(paths => {
              this.ngRedux.dispatch(this.actions.fetchDevGroupLeadOptionsSuccess(paths));
              this.setDevGroupLeadOptions(paths);
            });
        } else {
          this.setDevGroupLeadOptions(options);
        }
      }));

    this.subs.push(this.devGroupLead$
      .subscribe(x => this.devGroupLead = x));

    this.subs.push(this.dnaGroupLeadOptions$
      .subscribe(options => {
        if(!options.length) {
          vso.getDnaLeadOptions()
            .then(paths => {
              this.ngRedux.dispatch(this.actions.fetchDnaGroupLeadOptionsSuccess(paths));
              this.setDnaGroupLeadOptions(paths);
            });
        } else {
          this.setDnaGroupLeadOptions(options);
        }
      }));

    this.subs.push(this.dnaGroupLead$
      .subscribe(x => this.dnaGroupLead = x));

    this.subs.push(this.designGroupLeadOptions$
      .subscribe(options => {
        if(!options.length) {
          vso.getDesignLeadOptions()
            .then(x => {
              this.ngRedux.dispatch(this.actions.fetchDesignGroupLeadOptionsSuccess(x));
              this.setDesignGroupLeadOptions(x);
            });
        } else {
          this.setDesignGroupLeadOptions(options);
        }
      }));

    this.subs.push(this.designGroupLead$
      .subscribe(x => this.designGroupLead = x));

  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  setMultiSelectOptions(paths: Array<string>) {
    this.multiSelectOptions = paths.map(path => {
      return {id: path, name: path} as IMultiSelectOption
    });
  }

  setReleaseOptions(options: SelectOption[]) {
    this.releaseOptions = options;
  }

  setPromiseOptions(options: SelectOption[]) {
    this.promiseOptions = options;
  }

  setIterationPathOptions(options: SelectOption[]) {
    this.iterationPathOptions = options;
  }

  setPmGroupLeadOptions(options: SelectOption[]) {
    this.pmGroupLeadOptions = options;
  }

  setDevGroupLeadOptions(options: SelectOption[]) {
    this.devGroupLeadOptions = options;
  }

  setDnaGroupLeadOptions(options: SelectOption[]) {
    this.dnaGroupLeadOptions = options;
  }

  setDesignGroupLeadOptions(options: SelectOption[]) {
    this.designGroupLeadOptions = options;
  }

  onAreaPathChanged(paths: any) {
    this.ngRedux.dispatch(this.actions.setAreaPaths(paths));
  }

  onReleaseChanged(option: SelectOption) {
    this.release = option;
    this.ngRedux.dispatch(this.actions.setRelease(this.release));
  }

  onPromiseChanged(option: SelectOption) {
    this.promise = option;
    this.ngRedux.dispatch(this.actions.setPromise(this.promise));
  }

  onIterationChanged(option: SelectOption) {
    this.iterationPath = option;
    this.ngRedux.dispatch(this.actions.setIterationPath(this.iterationPath));
  }

  onPmGroupLeadChanged(option: SelectOption) {
    this.pmGroupLead = option;
    this.ngRedux.dispatch(this.actions.setPmGroupLead(this.pmGroupLead));
  }

  onDevGroupLeadChanged(option: SelectOption) {
    this.devGroupLead = option;
    this.ngRedux.dispatch(this.actions.setDevGroupLead(this.devGroupLead));
  }

  onDnaGroupLeadChanged(option: SelectOption) {
    this.dnaGroupLead = option;
    this.ngRedux.dispatch(this.actions.setDnaGroupLead(this.dnaGroupLead));
  }

  onDesignGroupLeadChanged(option: SelectOption) {
    this.designGroupLead = option;
    this.ngRedux.dispatch(this.actions.setDesignGroupLead(this.designGroupLead));
  }

  triggerSearch() {
    this.searchService.setSearch({
      areaPaths: this.areaPaths,
      release: this.release,
      promise: this.promise,
      iterationPath: this.iterationPath,
      pmGroupLead: this.pmGroupLead,
      devGroupLead: this.devGroupLead,
      dnaGroupLead: this.dnaGroupLead,
      designGroupLead: this.designGroupLead,
    });
  }
}
