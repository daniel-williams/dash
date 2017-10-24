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
  ScenarioWorkItem,
  ScrollMagic,
  SearchService,
  Sort,
  TweenMax,
  VsoService,
  VsoWortItemType,
} from '../shared';
import { SelectOption, SearchControlMask, ISearchCriteria } from '../shared/types';
import { IAppState, SearchActions } from '../store';
import { PlanningBase } from '../planning.base';


@Component({
  templateUrl: './scenarios.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Scenarios extends PlanningBase {
  @HostListener('window:resize', ['$event'])
    onWindowResize(evt: any) {
      this.onResize(evt);
    }

  @ViewChild('clickTarget') clickTargetRef: ElementRef;

  private controller: any;
  private scenarios: ScenarioWorkItem[] = [];
  private error: string;

  private sort: Sort = new Sort('rank', true);
  private tableTitle: string;

  private subs: Subscription[] = [];

  constructor(
    private searchService: SearchService,
    private animationService: AnimationService,
    private appConstants: AppConstants,
    private changeDetectorRef: ChangeDetectorRef,
    private ngRedux: NgRedux<IAppState>,
    private actions: SearchActions,
    private vso: VsoService
    ) {
    super(changeDetectorRef);

    this.controller = AnimationService.CreateController();

    this.searchService.setControlMask({
    });

    this.subs.push(this.searchService
      .searchSummary$.subscribe(summary => this.tableTitle = summary)
    );
    this.subs.push(this.searchService
      .searchCriteria$.subscribe(searchCriteria => {
        this.ngRedux.dispatch(this.actions.updateSearchStatus('fetching'));
        this.vso.getScenarios(searchCriteria)
          .then(scenarios => {
            return this.vso
              .fetchRelated(scenarios.map(item => item.id), [VsoWortItemType.Deliverable, VsoWortItemType.Measure])
              .then(relatedMap => {
                return scenarios.map(scenario => {
                  let remainingDevDays = 0;

                  scenario = Object.assign({}, scenario, relatedMap.parents[scenario.id] || {});
                  scenario.deliverables.forEach(x => {
                    remainingDevDays += !!x.remainingDevDays
                      ? x.remainingDevDays
                      : 0;
                  });
                  scenario.remainingDevDays = remainingDevDays;

                  return scenario;
                });
              });
          })
          .then(scenarios => {
            this.scenarios = scenarios;
            return true;
          })
          .catch(err => {
            console.log('error retrieving scenarios', err);
            this.scenarios = [];
            return true;
          })
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

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
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

function sortItems(items: Array<any>, sortOn: string) {
  return items.sort((a, b) => {
    let result: any;
    let hasEmptyA = !a[sortOn];
    let hasEmptyB = !b[sortOn];

    if(hasEmptyA || hasEmptyB) {
      result = hasEmptyA && hasEmptyB
        ? 0
        : hasEmptyA
          ? 1
          : -1;
    } else {
      result = a[sortOn] < b[sortOn]
        ? -1
        : b[sortOn] < a[sortOn]
          ? 1
          : 0;
    }

    return result;
  });
}
