import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {
  SelectOption,
  ISearchControls,
  ISearchCriteria,
  SearchControlMask,
} from '../types';

const NO_CRITERIA = 'no search criteria';

@Injectable()
export class SearchService {
  public controlMask$: Observable<SearchControlMask>;
  public searchCriteria$: Observable<ISearchCriteria>;
  public searchOptions$: Observable<ISearchOptions>;
  public searchSummary$: Observable<string>;

  private controlMaskSubject = new BehaviorSubject<SearchControlMask>(new SearchControlMask());
  private searchCriteriaSubject = new Subject<ISearchCriteria>();
  private searchOptionsSubject = new Subject<ISearchOptions>();
  private searchSummarySubject = new BehaviorSubject<string>(NO_CRITERIA);

  constructor() {
    this.setupObservables();
  }

  setControlMask(controlMask: ISearchControls) {
    this.controlMaskSubject.next(new SearchControlMask(controlMask));
  }

  setSearch(criteria: ISearchOptions) {
    this.searchOptionsSubject.next(criteria);
    this.updateSearchCriteria(criteria);
    this.updateSummary(criteria);
  }

  private setupObservables() {
    this.controlMask$ = this.controlMaskSubject.asObservable();
    this.searchOptions$ = this.searchOptionsSubject.asObservable();
    this.searchCriteria$ = this.searchCriteriaSubject.asObservable();
    this.searchSummary$ = this.searchSummarySubject.asObservable();
  }

  private updateSearchCriteria(criteria: ISearchOptions) {
    let mask = this.controlMaskSubject.value;
    let searchCriteria: ISearchCriteria = {
      areaPaths: mask.areaPath ? criteria.areaPaths : [],
      release: (mask.release && criteria.release) ? criteria.release.value : null,
      promise: (mask.promise && criteria.promise) ? criteria.promise.value : null,
      iterationPath: (mask.iteration && criteria.iterationPath) ? criteria.iterationPath.value : null,
      pmGroupLead: (mask.pmGroupLead && criteria.pmGroupLead) ? criteria.pmGroupLead.value : null,
      devGroupLead: (mask.devGroupLead && criteria.devGroupLead) ? criteria.devGroupLead.value : null,
      dnaGroupLead: (mask.dnaGroupLead && criteria.dnaGroupLead) ? criteria.dnaGroupLead.value : null,
      designGroupLead: (mask.designGroupLead && criteria.designGroupLead) ? criteria.designGroupLead.value : null,
    };

    this.searchCriteriaSubject.next(searchCriteria);
  }

  private updateSummary(criteria: ISearchOptions): void {
    let mask = this.controlMaskSubject.value;
    let builder: string[] = [];

    if(mask.areaPath && criteria.areaPaths && criteria.areaPaths.length) {
      builder.push(criteria.areaPaths.join('; '));
    }

    if(mask.release && criteria.release && criteria.release.value) {
      builder.push(criteria.release.value);
    }

    if(mask.promise && criteria.promise && criteria.promise.value) {
      builder.push(criteria.promise.display);
    }

    if(mask.iteration && criteria.iterationPath && criteria.iterationPath.value) {
      builder.push(criteria.iterationPath.value);
    }

    if(mask.pmGroupLead && criteria.pmGroupLead && criteria.pmGroupLead.value) {
      builder.push(criteria.pmGroupLead.display);
    }

    if(mask.devGroupLead && criteria.devGroupLead && criteria.devGroupLead.value) {
      builder.push(criteria.devGroupLead.display);
    }

    if(mask.dnaGroupLead && criteria.dnaGroupLead && criteria.dnaGroupLead.value) {
      builder.push(criteria.dnaGroupLead.display);
    }

    if(mask.designGroupLead && criteria.designGroupLead && criteria.designGroupLead.value) {
      builder.push(criteria.designGroupLead.display);
    }

    let result = builder.length
      ? builder.join(' | ')
      : NO_CRITERIA;

    this.searchSummarySubject.next(result);
  }
}

export interface ISearchOptions {
  areaPaths?: string[];
  release?: SelectOption;
  promise?: SelectOption;
  iterationPath?: SelectOption;
  pmGroupLead?: SelectOption;
  devGroupLead?: SelectOption;
  dnaGroupLead?: SelectOption;
  designGroupLead?: SelectOption;
}