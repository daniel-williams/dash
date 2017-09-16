import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import {
  Headers,
  Http,
  RequestOptions } from '@angular/http';
import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AppConstants } from '../../app.constants';
import {
  FabricService,
  ScrollMagic,
  Sort,
  VsoService } from '../../shared/services';
import {
  IWorkItem,
  ScenarioWorkItem,
  VsoTags,
  VsoWortItemType,
  WorkItem } from '../../shared/services/vso';
import { IAppState, SearchActions } from '../../store';
import {
  ISearchCriteria,
  SelectOption,
  SearchControlMask } from '../../shared/types';
import { GridSchema, SagaGrid } from '../shared/saga-grid';
import {
  AccessibilityGradeDetail,
  CompletenessGradeDetail,
  CraftsmanshipGradeDetail,
  HighImpactBugsGradeDetail,
  CustomerFeedbackGradeDetail,
  GradeColor,
  MeasurableOutcomeMetGradeDetail,
  OverallGradeDetail,
  RiskAssessmentGradeDetail,
  ScenarioValidationGradeDetail,
  StateGradeDetail,
  TelemetryGradeDetail } from './scenario-readiness.types';
import { PlanningBase } from '../planning.base';
import { ISearchOptions, SearchService } from '../shared/search';


import {
  columnSchemas,
  riskAssessmentColumnSchema
} from './scenario-readiness.schemas';



@Component({
  selector: 'scenario-readiness',
  templateUrl: './scenario-readiness.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScenarioReadiness extends PlanningBase {
  // @HostListener('window:resize', ['$event'])
  //   onWindowResize(evt: any) {
  //     this.onResize(evt);
  //   }

  @ViewChild('clickTarget') clickTargetRef: ElementRef;
  @ViewChild('itemGrid') itemGrid: SagaGrid;

  private error: string;
  private gridData: IWorkItem[] = [];
  private filteredGridData: IWorkItem[] = [];
  private gridSchema: GridSchema = new GridSchema(columnSchemas);
  private requestOptions = new RequestOptions({
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  });
  private searchCriteria: ISearchCriteria;
  private searchStatus: string;
  private tableTitle: string = '';

  private vsoTags = VsoTags;
  private showLegacyCore: boolean = true;
  
  private searchOptions: SearchControlMask;

  private fabric: any;
  private subs: Subscription[] = [];

  constructor(
    private searchService: SearchService,
    private appConstants: AppConstants,
    private changeDetectorRef: ChangeDetectorRef,
    private fabricService: FabricService,
    private http: Http,
    private ngRedux: NgRedux<IAppState>,
    private actions: SearchActions,
    private vso: VsoService
    ) {
    super(changeDetectorRef);

    Observable.fromEvent(window, 'resize')
      .debounceTime(300)
      .subscribe((event) => {
        this.onResize(event);
      });

    this.fabric = this.fabricService.api;

    this.searchService.setControlMask({
      promise: false,
    });

    this.subs.push(this.searchService
      .searchSummary$.subscribe(summary => this.tableTitle = summary)
    );
    this.subs.push(this.searchService
      .searchCriteria$.subscribe(searchCriteria => {
        this.searchCriteria = searchCriteria;
        
        this.ngRedux.dispatch(this.actions.updateSearchStatus('fetching'));
        this.vso.getScenarioReadiness(searchCriteria)
          .then(scenarios => {
            return this.vso.fetchRelated(scenarios.map(item => item.id), [VsoWortItemType.Bug, VsoWortItemType.Deliverable, VsoWortItemType.Measure])
              .then(relatedMap => {
                if(this.appConstants.useCorpResources) {
                  // fetch ancillary readiness data and
                  // merge into relatedMap
                  return this.http.get(this.appConstants.sagaApiEndpoint + 'readiness', this.requestOptions)
                    .map(response => response.json())
                    .toPromise()
                    .then(json => {
                      let readinessData = (json as any[]);
    
                      // merge fetched readiness data into relatedMap
                      if(readinessData && readinessData.length) {
                        readinessData.forEach(source => {
                          let target = relatedMap.parents[source.Id];
    
                          if(target) {
                            // these are the properties under manual management
                            target.measurableOutcomeMet = source.MeasurableOutcomeMet;
                            target['comments'] = source['Comments'];
                            target['testCoverageExists'] = source['TestCoverageExists'];
                          }
                        });
                      }
    
                      return { scenarios, relatedMap };
                    });
                } else {
                  return { scenarios, relatedMap };
                }
              });
          })
          .then(data => {
            let { scenarios, relatedMap } = data;
    
            scenarios = scenarios.map(scenario => {
              // Merge relatedMap data into scenario
              return Object.assign({}, scenario, relatedMap.parents[scenario.id] || {}) as ScenarioWorkItem;
            });
    
            if(this.appConstants.useCorpResources) {
              let bm: missionControlItem[] = [];
    
              scenarios.forEach(x => {
                let ctqIds = x.measures
                  .filter(m => (m.state || '').toLowerCase() === 'closed' && (m.measureType || '').toLowerCase() === 'ctq' && (m.showOnReport || '').toLowerCase() === 'central')
                  .map(m => m.id);
    
                if(ctqIds.length) {
                  let a: number[] = [];
    
                  ctqIds.forEach(id => pushUnique(a, id));
                  bm.push({
                    scenarioId: x.id.toString(),
                    ctqIdSet: a.join(',')
                  } as missionControlItem);
                }
              });
    
              let mcBm: missionControlBM = {
                scenarioIds: bm.map(x => x.scenarioId).join(';'),
                ctqIdSets: bm.map(x => x.ctqIdSet).join(';')
              };
    
              return this.http.post(this.appConstants.sagaApiEndpoint + 'readiness/ctq-telemetry', mcBm, this.requestOptions)
                .map(response => response.json())
                .toPromise()
                .then(json => {
                  let telemetry: any[] = json;
                  let failedMeasures: { measureId: number, scenarioId: number}[] = [];
      
                  if(!!telemetry && telemetry.length) {
                    telemetry.forEach(x => {
                      // an empty measureId column means no data found
                      if(!!x['measureId']) {
      
                        scenarios.forEach(s => {
                          if(s.id == x.scenarioId) {
      
                            if(!s['telemetry']) {
                              s['telemetry'] = [];
                            }
                            s['telemetry'].push(x);
      
                            if(x['measureResult'].trim().toLowerCase() === 'fail') {
                              if(!s['failedMeasures']) {
                                s['failedMeasures'] = [];
                              }
      
                              s['failedMeasures'] = x['measureId'];
                              failedMeasures.push({ measureId: x['measureId'], scenarioId: s.id });
                            }
                          }
                        });
                      }
                    });
                  }
      
                  return failedMeasures;
                })
                .then(failedMeasures => {
                  if(!failedMeasures.length) { return; }
      
                  return this.vso.fetchRelated(failedMeasures.map(x => x.measureId), [VsoWortItemType.Bug])
                    .then(relatedMap => {
      
                      if(relatedMap.parents) {
                        Object.keys(relatedMap.parents).forEach(key => {
                          let measureId = parseInt(key);
                          let scenarioIds = failedMeasures.filter(x => x.measureId === measureId).map(x => x.scenarioId);
      
                          scenarioIds.forEach(scenarioId => {
                            let s = scenarios.find(x => x.id === scenarioId);
      
                            if(!s) { return; }
      
                            if(relatedMap.parents[key].bugs && relatedMap.parents[key].bugs.length) {
                              relatedMap.parents[key].bugs.forEach(b => {
                                if((b.state || '').toLowerCase() === 'active' && b.blocking === 'Engineering Sign-off') {
                                  s.bugs.push(b);
                                }
                              });
                            }
                          });
                        });
                      }
                    });
                })
                .catch(err => console.log('error retrieving mc readiness', err))
                .then(x => {
                  return { scenarios, relatedMap}
                });
            }
    
            return { scenarios, relatedMap };
          })
          .then(data => {
            let { scenarios, relatedMap } = data;
    
            this.ngRedux.dispatch(this.actions.updateSearchStatus('calculating'));
            this.gridData = scenarios.map(scenario => {
              this.gradeScenario(scenario, searchCriteria);
    
              return scenario;
            });
          })
          .catch(err => console.log('error retrieving scenarios', err))
          .then(x => {
            this.filterGridData();
            this.ngRedux.dispatch(this.actions.updateSearchStatus('ready'));
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
      let toggleEls = document.querySelectorAll(".ms-Toggle");
      let pivotEls = document.querySelectorAll(".ms-Pivot");
      let panelEls = document.getElementsByClassName("panel-test");

      for (var i = 0; i < toggleEls.length; i++) {
        new fabric['Toggle'](toggleEls[i]);
      }

      for (var i = 0; i < pivotEls.length; i++) {
        new fabric['Pivot'](pivotEls[i]);
      }

      for (var i = 0; i < panelEls.length; i++) {
        (function() {
          let panelButton = panelEls[i].querySelector(".ms-Button");
          let msPanel = panelEls[i].querySelector(".ms-Panel");

          panelButton.addEventListener("click", function(i) {
            new fabric['Panel'](msPanel);
          });
        }());
      }


    }
  }

  showGradingRubric(evt: MouseEvent) {
    let panelComponent = document.querySelector(".ms-Panel") as HTMLDivElement;

    new this.fabric['Panel'](panelComponent);
  }

  cancelEvent(evt: MouseEvent) {
    evt.preventDefault();
    evt.stopImmediatePropagation();
  }

  legacyToggle(evt: any) {
    let el = document.getElementById('demo-toggle-3') as HTMLInputElement;

    this.showLegacyCore = !this.showLegacyCore;
    this.filterGridData();

    try {
      this.changeDetectorRef.detectChanges();
      let clickTarget = this.clickTargetRef.nativeElement as HTMLSelectElement;
      clickTarget.click();
    } catch (err) { }
  }


  /**
   * The retrieved Scenarios are filtered based on UI state (e.g., "Include Core Legacy" toggle)
   */
  filterGridData() {
    let release = (this.searchCriteria.release || '').toLowerCase();

    this.filteredGridData = this.gridData.filter(item => {
      let itemRelease = (item.release || '').toLowerCase();

      if(this.showLegacyCore && item.tags.includes(''+this.vsoTags.coreReadiness)) {
        return true;
      }

      if(release === 'rs2' && itemRelease === 'rs2' && item.tags.includes(''+this.vsoTags.rs2Readiness)) {
        return true;
      }

      if(release === 'rs3' && itemRelease === 'rs3' && item.tags.includes(''+this.vsoTags.rs3Readiness)) {
        return true;
      }

      if(release === 'rs4' && itemRelease === 'rs4' && item.tags.includes(''+this.vsoTags.rs4Readiness)) {
        return true;
      }

      if(release === 'rs5' && itemRelease === 'rs5' && item.tags.includes(''+this.vsoTags.rs5Readiness)) {
        return true;
      }

      if(!release && (
        item.tags.includes(''+this.vsoTags.rs2Readiness) ||
        item.tags.includes(''+this.vsoTags.rs3Readiness) ||
        item.tags.includes(''+this.vsoTags.rs4Readiness) ||
        item.tags.includes(''+this.vsoTags.rs5Readiness))) {
        return true;
      }

      return false;
    });
  }

  applyDefaultSort() {
    this.itemGrid.setSorts([
      riskAssessmentColumnSchema
    ]);
  }

  onSave(payload: any) {
    let scenario = this.gridData.find(item => item.id === payload.id);

    if(scenario) {
      this.gradeScenario(scenario as ScenarioWorkItem, this.searchCriteria);
    }
  }

  gradeScenario(scenario: ScenarioWorkItem, searchCriteria: ISearchCriteria): void {
    // Init
    scenario['readinessGrade'] = {};

    // case insensitive comparisons
    let scenarioTags = scenario.tags;

    let isCoreReadiness = scenarioTags.includes(''+this.vsoTags.coreReadiness);

    // init grading
    let overallGradeDetail = new OverallGradeDetail(isCoreReadiness);
    let accessibilityGradeDetail = new AccessibilityGradeDetail(isCoreReadiness);
    let highImpactBugsGradeDetail = new HighImpactBugsGradeDetail(isCoreReadiness);
    let completenessGradeDetail = new CompletenessGradeDetail(isCoreReadiness);
    let craftsmanshipGradeDetail = new CraftsmanshipGradeDetail(isCoreReadiness);
    let customerFeedbackGradeDetail = new CustomerFeedbackGradeDetail(isCoreReadiness);
    let measurableOutcomeMetGradeDetail = new MeasurableOutcomeMetGradeDetail(isCoreReadiness);
    let riskAssessmentGradeDetail = new RiskAssessmentGradeDetail(isCoreReadiness);
    let scenarioValidationGradeDetail = new ScenarioValidationGradeDetail(isCoreReadiness);
    let stateGradeDetail = new StateGradeDetail(isCoreReadiness);
    let telemetryGradeDetail = new TelemetryGradeDetail(isCoreReadiness);

    // process scenario tags
    accessibilityGradeDetail.exempt = scenarioTags.includes(''+this.vsoTags.accessibilityExempt);
    craftsmanshipGradeDetail.exempt = scenarioTags.includes(''+this.vsoTags.craftsmanshipExempt);
    craftsmanshipGradeDetail.reviewed = scenarioTags.includes(''+this.vsoTags.craftsmanshipReviewed);
    scenarioValidationGradeDetail.exempt = scenarioTags.includes(''+this.vsoTags.scenarioValidationExempt);
    scenarioValidationGradeDetail.tbd = scenarioTags.includes(''+this.vsoTags.scenarioValidationTbd);

    // TODO djw: might not need this anymore
    if(scenarioTags.includes(''+this.vsoTags.telemetryExemptExist)) {
      telemetryGradeDetail.exempt = true;
      telemetryGradeDetail.testNeeded = false;
    } else if(scenarioTags.includes(''+this.vsoTags.telemetryExemptNeeded)) {
      telemetryGradeDetail.exempt = true;
      telemetryGradeDetail.testNeeded = true;
    }

    // state
    stateGradeDetail.state = scenario.state;

    // measurable outcomes met
    measurableOutcomeMetGradeDetail.value = scenario['measurableOutcomeMet'] || '';

    // completeness
    scenario.deliverables.forEach(deliverable => {
      if(deliverable.productFamily === 'Windows' &&
         deliverable.state !== 'Cut' &&
         deliverable.releaseType !== 'Internal' &&
         (!searchCriteria.release || deliverable.release === searchCriteria.release)) {

          pushUnique(completenessGradeDetail.all, deliverable.id);

          if(deliverable.state !== 'Completed') {
            let rank = deliverable.rank && parseInt(deliverable.rank);

            if(!rank || rank > 100) {
              pushUnique(completenessGradeDetail.yellow, deliverable.id);
            } else if(rank <= 100) {
              pushUnique(completenessGradeDetail.red, deliverable.id);
            }
          }
        }
    });

    // Risk Assessment
    riskAssessmentGradeDetail.risk = scenario['risk'];

    // Telemetry
    if(!telemetryGradeDetail.exempt) {
      // scenario.measures
      //   .filter(m => (m.measureType || '').toLowerCase() === 'ctq' && ((m.state || '').toLowerCase() !== 'closed' || (m.showOnReport || '').toLowerCase() !== 'central'))
      //   .forEach(m => pushUnique(telemetryGradeDetail.ctqInProgress, m.id));

      scenario.measures
        .filter(m => (m.measureType || '').toLowerCase() === 'ctq')
        .forEach(m => {

          // bucket CTQ in progress measures
          if(((m.state || '').toLowerCase() !== 'closed' || (m.showOnReport || '').toLowerCase() !== 'central')) {
            pushUnique(telemetryGradeDetail.ctqInProgress, m.id)
          }


        });

      if(scenario['telemetry'] && scenario['telemetry'].length) {
        (scenario['telemetry'] as any[]).forEach(m => {
          switch(m.measureResult) {
            case 'pass':
              pushUnique(telemetryGradeDetail.pass, m.measureId);
              break;
            case 'fail':
              pushUnique(telemetryGradeDetail.fail, m.measureId);
              break;
            case 'insufficient':
              pushUnique(telemetryGradeDetail.insufficientData, m.measureId);
              break;
            case 'nodata':
            default:
              pushUnique(telemetryGradeDetail.noData, m.measureId);
              break;
          }
        });
      }

      // if(!!scenario['telemetry']) {
      //   let telemetry = scenario['telemetry'];

      //   telemetryGradeDetail.pass = telemetry.pass;
      //   telemetryGradeDetail.fail = telemetry.fail;
      //   telemetryGradeDetail.insufficientData = telemetry.insufficientData;
      //   telemetryGradeDetail.noData = telemetry.noData;
      // }
    }

// testing link
// http://localhost:3000/saga-planning/scenario-readiness?q=5nghp7p

    scenario.bugs.forEach(bug => {
      // bug must be active to be used in readiness calculations
      if(bug.state === 'Active') {
        // for case insensitive comparisons
        let bugTags = bug.tags;

        pushUnique(highImpactBugsGradeDetail.allActive, bug.id);
        pushUnique(scenarioValidationGradeDetail.allActive, bug.id);

        // critical bugs & priority
        if(bug.blocking === 'Engineering Sign-off') {
          // if searching on specific release, we should bucket this bug into releaseCritical
          if(bug.release === searchCriteria.release) {
            pushUnique(highImpactBugsGradeDetail.releaseCritical, bug.id)
          }

          // regardless of above, bucket bug into allCritical
          pushUnique(highImpactBugsGradeDetail.allCritical, bug.id);
        }

        switch(bug.priority) {
          case 0:
            pushUnique(highImpactBugsGradeDetail.p0, bug.id);
            break;
          case 1:
            pushUnique(highImpactBugsGradeDetail.p1, bug.id);
            break;
          case 2:
            pushUnique(highImpactBugsGradeDetail.p2, bug.id);
            break;
          default:
            pushUnique(highImpactBugsGradeDetail.pOther, bug.id);
        }

        if(bug.issueType === 'Data') {
          if(bugTags.includes(''+this.vsoTags.customerFeedbackRed)) {
            pushUnique(customerFeedbackGradeDetail.highImpact, bug.id);
          }

          if(bugTags.includes(''+this.vsoTags.customerFeedbackYellow)) {
            pushUnique(customerFeedbackGradeDetail.mediumImpact, bug.id);
          }
        }

        // process bug tags
        if(bugTags && bugTags.length) {

          // Scenario Validation tags
          if(bugTags.includes(''+this.vsoTags.scenarioValidationRed)) {
            pushUnique(scenarioValidationGradeDetail.red, bug.id);
          } else if(bugTags.includes(''+this.vsoTags.scenarioValidationYellow)) {
            pushUnique(scenarioValidationGradeDetail.yellow, bug.id);
          }

          // accessibility tags
          if(!accessibilityGradeDetail.exempt) {
            if(bugTags.includes(''+this.vsoTags.accSelfRed)) {
              pushUnique(accessibilityGradeDetail.red, bug.id);
            }
            if(bugTags.includes(''+this.vsoTags.accSelfYellow)) {
              pushUnique(accessibilityGradeDetail.yellow, bug.id);
            }
            if(bugTags.includes(''+this.vsoTags.accSelfLime)) {
              pushUnique(accessibilityGradeDetail.lime, bug.id);
            }
          }
        }

        if(!craftsmanshipGradeDetail.exempt && !bugTags.includes(''+this.vsoTags.craftsman)) {
          let rank = bugTags.find(tag => tag.indexOf('c:') >= 0 && tag.indexOf('saga') === -1);

          if(!!rank &&
              bug.resolution !== (''+this.vsoTags.wontFix) &&
              bug.resolution !== (''+this.vsoTags.duplicate) &&
              bug.resolution !== (''+this.vsoTags.external) &&
              !bugTags.includes(''+this.vsoTags.craftsmanshipRejected)) {

              let rankValue = parseInt(rank.split(':')[1]);

              pushUnique(craftsmanshipGradeDetail.bugs, bug.id);

              if(rankValue < 50) {
                pushUnique(craftsmanshipGradeDetail.bugsUnder50, bug.id);
              } else if(rankValue < 80) {
                pushUnique(craftsmanshipGradeDetail.bugsUnder80, bug.id);
              } else {
                pushUnique(craftsmanshipGradeDetail.bugs80AndOver, bug.id);
              }
          }
        }
      }

    });

    // calculate grade
    // then set gradeValue back to scenario
    scenario['accessibility'] = accessibilityGradeDetail.calculateGrade();
    scenario['highImpactBugs'] = highImpactBugsGradeDetail.calculateGrade();
    scenario['completeness'] = completenessGradeDetail.calculateGrade();
    scenario['craftsmanship'] =  craftsmanshipGradeDetail.calculateGrade();
    scenario['customerFeedback'] = customerFeedbackGradeDetail.calculateGrade();
    scenario['riskAssessment'] = riskAssessmentGradeDetail.calculateGrade();
    scenario['scenarioValidation'] = scenarioValidationGradeDetail.calculateGrade();
    scenario['telemetry'] = telemetryGradeDetail.calculateGrade();

    // scenario prop already exists
    scenario['stateValue'] = stateGradeDetail.calculateGrade();
    measurableOutcomeMetGradeDetail.calculateGrade();

    // set grade items to be used in overall grading
    overallGradeDetail.setGrades([
      accessibilityGradeDetail,
      highImpactBugsGradeDetail,
      completenessGradeDetail,
      craftsmanshipGradeDetail,
      customerFeedbackGradeDetail,
      measurableOutcomeMetGradeDetail,
      riskAssessmentGradeDetail,
      scenarioValidationGradeDetail,
      stateGradeDetail,
      telemetryGradeDetail
    ]);
    scenario['overallGrade'] = overallGradeDetail.calculateGrade();


    scenario['readinessGrade'] = {
      accessibilityGradeDetail,
      highImpactBugsGradeDetail,
      completenessGradeDetail,
      craftsmanshipGradeDetail,
      customerFeedbackGradeDetail,
      measurableOutcomeMetGradeDetail,
      overallGradeDetail,
      riskAssessmentGradeDetail,
      scenarioValidationGradeDetail,
      stateGradeDetail,
      telemetryGradeDetail,
    };
  }

}

function pushUnique(bucket: number[], id: number) {
  if(!bucket.includes(id)) {
    bucket.push(id);
  }
}

interface missionControlItem {
  scenarioId: string;
  ctqIdSet: string;
}

interface missionControlBM {
 scenarioIds: string;
 ctqIdSets: string;
}
