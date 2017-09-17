import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';

import { AppConstants } from '../app.constants';
import {
  AnimationService,
  Easing,
  ISearchOptions,
  ScrollMagic,
  SearchService,
  Sort,
  TweenMax,
  VsoService,
  WorkItem,
} from '../shared/services';
import { SelectOption, SearchControlMask, ISearchCriteria } from '../shared/types';
import { IAppState, SearchActions } from '../store';
import { GridSchema, SagaGrid } from '../shared/saga-grid';
import { PlanningBase } from '../planning.base';

import {
  columnSchemas,
  iterationColumnSchema,
  riskColumnSchema,
  rankColumnSchema,
  stateColumnSchema,
} from './deliverables.schemas';


@Component({
  templateUrl: './deliverables.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Deliverables extends PlanningBase {
  @HostListener('window:resize', ['$event'])
    onWindowResize(evt: any) {
      this.onResize(evt);
    }

  @ViewChild('clickTarget') clickTargetRef: ElementRef;
  @ViewChild('itemGrid') itemGrid: SagaGrid;

  private gridData: any[];
  private gridSchema: GridSchema = new GridSchema(columnSchemas);
  private tableTitle: string = '';

  private controller: any;
  private searchOptions: SearchControlMask;

  private subs: Subscription[] = [];

  constructor(
    private searchService: SearchService,
    private animationService: AnimationService,
    private appConstants: AppConstants,
    private changeDetectorRef: ChangeDetectorRef,
    private ngRedux: NgRedux<IAppState>,
    private actions: SearchActions,
    private vso: VsoService) {

    super(changeDetectorRef);

    this.controller = AnimationService.CreateController();

    this.searchService.setControlMask({
      promise: false,
    });

    this.subs.push(this.searchService
      .searchSummary$.subscribe(summary => this.tableTitle = summary)
    );
    this.subs.push(this.searchService
      .searchCriteria$.subscribe(searchCriteria => {
        this.ngRedux.dispatch(this.actions.updateSearchStatus('fetching'));
        this.vso.getDeliverables(searchCriteria)
        .then(deliverables => this.gridData = deliverables)
        .catch(err => console.log('error retrieving deliverables', err))
        .then(x => {
          this.ngRedux.dispatch(this.actions.updateSearchStatus('ready'));

          try {
            this.changeDetectorRef.detectChanges();
            let clickTarget = this.clickTargetRef.nativeElement as HTMLSelectElement;

            clickTarget.click();
          } catch (err) { }
        });
      })
    );
  }

  ngOnInit() {
    this.applyDefaultSort();
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  applyDefaultSort() {
    this.itemGrid.setSorts([
      iterationColumnSchema,
      stateColumnSchema
    ]);
  }

  applyCommitmentSort() {
    this.itemGrid.setSorts([
      iterationColumnSchema,
      stateColumnSchema,
      riskColumnSchema,
      rankColumnSchema
    ]);
  }

  scrollTo(id: string) {
    event.preventDefault();
    let el = document.getElementById(id);

    if(el) {
      let posY = this.animationService.getPageOffset_Parent(el).top;

      this.controller.scrollTo(posY);
    }
  }
}
