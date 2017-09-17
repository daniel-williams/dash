import {
  AfterContentInit,
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
  BugMap,
  Easing,
  FabricService,
  ISearchOptions,
  ScrollMagic,
  SearchService,
  Sort,
  TweenMax,
  VsoService,
  WorkItem,
} from '../shared';
import { SelectOption, SearchControlMask, ISearchCriteria } from '../shared/types';
import { IAppState, SearchActions } from '../store';
import { GridSchema, SagaGrid } from '../shared/saga-grid';
import { PlanningBase } from '../planning.base';

import {
  columnSchemas,
  idColumnSchema,
} from './bugs.schemas';


@Component({
  templateUrl: './bugs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Bugs extends PlanningBase {
  @HostListener('window:resize', ['$event'])
    onWindowResize(evt: any) {
      this.onResize(evt);
    }

  @ViewChild('clickTarget') clickTargetRef: ElementRef;

  @ViewChild('servicingGrid') servicingGrid: SagaGrid;
  @ViewChild('edgeCritGrid') edgeCritGrid: SagaGrid;
  @ViewChild('hotBugsGrid') hotBugsGrid: SagaGrid;
  @ViewChild('riBlockingGrid') riBlockingGrid: SagaGrid;
  @ViewChild('blockingEngineeringSignoffGrid') blockingEngineeringSignoffGrid: SagaGrid;

  private showServicing: boolean = true;
  private showEdgeCrit: boolean = true;
  private showHot: boolean = true;
  private showRiBlocking: boolean = true;
  private showBlockingEngineeringSignoff: boolean = true;

  private bugMap: BugMap;
  private servicingData: any[] = [];
  private edgeCritData: any[] = [];
  private hotData: any[] = [];
  private riBlockingData: any[] = [];
  private blockingEngineeringSignoffData: any[] = [];

  private gridSchema: GridSchema = new GridSchema(columnSchemas);
  private tableTitle: string = '';

  private controller: any;

  private searchOptions: SearchControlMask;

  private fabric: any;
  private subs: Subscription[] = [];

  constructor(
    private searchService: SearchService,
    private animationService: AnimationService,
    private appConstants: AppConstants,
    private changeDetectorRef: ChangeDetectorRef,
    private fabricService: FabricService,
    private ngRedux: NgRedux<IAppState>,
    private actions: SearchActions,
    private vso: VsoService
  ) {
    super(changeDetectorRef);

    this.controller = AnimationService.CreateController();

    this.searchService.setControlMask({
      promise: false,
    });

    this.fabric = this.fabricService.api;

    this.subs.push(this.searchService
      .searchSummary$.subscribe(summary => this.tableTitle = summary)
    );
    this.subs.push(this.searchService
      .searchCriteria$.subscribe(searchCriteria => {
        this.servicingData = [];
        this.edgeCritData = [];
        this.hotData = [];
        this.riBlockingData = [];
        this.blockingEngineeringSignoffData = [];

        this.ngRedux.dispatch(this.actions.updateSearchStatus('fetching'));
        this.vso
          .getBugMap(searchCriteria)
          .then(bugMap => {
            this.bugMap = bugMap;
            this.servicingData = this.bugMap.servicingBugs;
            this.edgeCritData = this.bugMap.edgeHighImpactBugs;
            this.hotData = this.bugMap.hotBugs;
            this.riBlockingData = this.bugMap.riBlockingBugs;
            this.blockingEngineeringSignoffData = this.bugMap.blockingEngineeringSignoffBugs;
          })
          .catch(err => console.log('error retrieving bugs', err))
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

  ngAfterContentInit() {
    let fabric = this.fabric;

    if(fabric) {
      let CheckBoxEls = document.querySelectorAll(".ms-CheckBox");

      for (var i = 0; i < CheckBoxEls.length; i++) {
        new fabric['CheckBox'](CheckBoxEls[i]);
      }
    }
  }

  applyDefaultSort() {
    this.servicingGrid.setSorts([
      idColumnSchema
    ]);
    this.edgeCritGrid.setSorts([
      idColumnSchema
    ]);
  }

  toggleBugCategory(evt: any, type: string) {
    switch(type) {
      case 'servicing':
        this.showServicing = !this.showServicing;
        break;
      case 'edgeCrit':
        this.showEdgeCrit = !this.showEdgeCrit;
        break;
      case 'hot':
        this.showHot = !this.showHot;
        break;
      case 'riBlocking':
        this.showRiBlocking = !this.showRiBlocking;
        break;
      case 'blockingEngineeringSignoff':
        this.showBlockingEngineeringSignoff = !this.showBlockingEngineeringSignoff;
        break;
    }
  }

  vpScroll(id: string): void {
    event.preventDefault();
    let el = document.getElementById(id);

    if(el) {
      let posY = this.animationService.getPageOffset(el).top;

      this.controller.scrollTo(posY);
    }
  }

  scrollTo(id: string) {
    let el = document.getElementById(id);

    event.preventDefault();
    if(el) {
      let posY = this.animationService.getPageOffset(el).top;

      this.controller.scrollTo(posY);
    }
  }
}
