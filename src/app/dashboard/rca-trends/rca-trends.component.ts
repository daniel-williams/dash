import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgRedux } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';

import {
  IWorkItem,
  WorkItem,
  VsoService } from '../../shared/services';
import {
  ISearchCriteria,
  SearchControlMask } from '../../shared/types'
import {
  IAppState,
  SearchActions } from '../../store';
import {
  logToElement,
  clearElement } from '../../shared/utils';

import { ISearchOptions, SearchService } from '../shared/search';
import {
  mockProblemRecords,
  ChartRange,
  DatasetType,
  DateRange,
  GroupType,
  IProblemRecord,
  MONTH_LABELS,
  ONE_DAY,
  rcaData,
  ScaleType,
  ChartService,
 } from './shared';

 

class MockDataDM {
  _startDate: Date;
  detectedDate: Date;
  resolvedDate: Date;
  finishDate: Date;

  constrcutor(date?: Date) {
    let d = date || new Date();
    this.startDate = new Date(d.getTime());
    this.detectedDate = new Date(d.getTime());
    this.resolvedDate = new Date(d.getTime());
    this.finishDate = new Date(d.getTime());
  }

  get startDate(): Date {
    return this._startDate;
  }
  set startDate(d: Date) {
    this._startDate = new Date(d);
  }

  get startDateString(): string {
    return !!this._startDate
      ? this._startDate.toDateString()
      : '';
  }
  set startDateString(d: string) {
    try {
      this._startDate = new Date(d);
    } catch(e) { }
  }

}

@Component({
  selector: 'rca-trends',
  templateUrl: './rca-trends.component.html',
  styleUrls: ['./rca-trends.component.scss'],
  providers: [ChartService]
})
export class RcaTrends {
  @ViewChild('rcaChart') rcaChartRef: ElementRef;
  @ViewChild('startDate') startDateRef: ElementRef;
  @ViewChild('detectedDate') detectedDateRef: ElementRef;
  @ViewChild('resolvedDate') resolvedDateRef: ElementRef;
  @ViewChild('finishDate') finishDateRef: ElementRef;

  private rcaChartEl: HTMLCanvasElement;
  private rcaChart: any;

  private chartRanges: ChartRange[];
  private scale: ScaleType = ScaleType.monthly;
  private groupBy: GroupType = GroupType.start;
  private datasetType: DatasetType = DatasetType.vso;

  private problemRecords: IProblemRecord[] = [];
  private mockData: IProblemRecord[] = [];
  private mockDataDM: MockDataDM;

  private showOptionsPanel: boolean = false;
  private showMockPanel: boolean = false;

  private searchOptions: SearchControlMask;
  
  private subs: Subscription[] = [];

  constructor(
    private searchService: SearchService,
    private actions: SearchActions,
    private chartService: ChartService,
    private ngRedux: NgRedux<IAppState>,
    private vso: VsoService
    ) {
    
    this.searchService.setControlMask({
      release: false,
      promise: false,
      iteration: false,
      pmGroupLead: false,
      devGroupLead: false,
      dnaGroupLead: false,
      designGroupLead: false,
    });

    this.subs.push(this.searchService
      .searchCriteria$.subscribe(searchCriteria => {
        this.datasetType = DatasetType.vso;
        this.ngRedux.dispatch(this.actions.updateSearchStatus('fetching'));
        this.vso
          .getProblemRecords(searchCriteria)
          .then(problemRecords => {
            this.problemRecords = this.toProblemRecords(problemRecords);
            this.createChart();
          })
          .catch(err => console.log('error retrieving problem records', err))
          .then(x => this.ngRedux.dispatch(this.actions.updateSearchStatus('ready')));
      })
    );
  }

  ngOnInit() {
    this.mockDataDM = new MockDataDM();
    if (this.rcaChartRef) {
      this.rcaChartEl = this.rcaChartRef.nativeElement;
    }

    this.mockData = this.toProblemRecords(mockProblemRecords);

    let d = new Date();

    let el1 = this.startDateRef.nativeElement as HTMLInputElement;
    let el2 = this.detectedDateRef.nativeElement as HTMLInputElement;
    let el3 = this.resolvedDateRef.nativeElement as HTMLInputElement;
    let el4 = this.finishDateRef.nativeElement as HTMLInputElement;

    el1.valueAsDate = d;
    el2.valueAsDate = d;
    el3.valueAsDate = d;
    el4.valueAsDate = d;
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  toProblemRecords(items: WorkItem[]): IProblemRecord[] {
    return items.map(x => {
      return Object.assign({}, x, {
        timeToDetect: this.daysBetween(x.startDate, x.detectedDate),
        timeToResolve: this.daysBetween(x.startDate, x.resolvedDate),
        timeToComplete: this.daysBetween(x.resolvedDate, x.finishDate)
      });
    }) as IProblemRecord[];
  }

  onScaleChange(val: string) {
    switch (val) {
      case 'daily':
        this.scale = ScaleType.daily;
        break;
      case 'monthly':
        this.scale = ScaleType.monthly;
        break;
      case 'quarterly':
        this.scale = ScaleType.quarterly;
        break;
      default:
        this.scale = ScaleType.monthly;
        break;
    }
    this.createChart();
  }

  // onGroupByChange(val: string) {
  //   switch (val) {
  //     case 'start':
  //       this.groupBy = GroupType.start;
  //       break;
  //     case 'resolved':
  //       this.groupBy = GroupType.resolved;
  //       break;
  //     default:
  //       this.groupBy = GroupType.start;
  //       break;
  //   }
  //   this.createChart();
  // }

  onDatasetChange(val: string) {
    this.showMockPanel = false;

    switch (val) {
      case 'vso':
        this.datasetType = DatasetType.vso;
        break;
      case 'mocked':
        this.datasetType = DatasetType.mocked;
        this.showMockPanel = true;
        break;
      default:
        this.datasetType = DatasetType.vso;
        break;
    }
    this.createChart();
  }

  private mockId = 0;
  addMockData(evt: MouseEvent) {

    if(this.mockDataDM.startDate != null) {
      let item = new WorkItem({
        id: ++this.mockId,
        workItemType: 'mocked',
        startDate: new Date(this.mockDataDM.startDate),
        detectedDate: new Date(this.mockDataDM.detectedDate),
        resolvedDate: new Date(this.mockDataDM.resolvedDate),
        finishDate: new Date(this.mockDataDM.finishDate),
      });
      let pr = this.toProblemRecords([item]);

      this.mockData.push(pr[0]);
      this.createChart();
    }
  }

  resetMockData(evt: MouseEvent) {
    this.mockData = [];
    this.createChart();
  }

  createChart() {
    let self = this;

    let problemRecords = this.datasetType === DatasetType.vso
      ? this.problemRecords
      : this.datasetType === DatasetType.mocked
        ? this.mockData
        : [...this.problemRecords, ...this.mockData];

    problemRecords = problemRecords.sort((a, b) => {
        let aTime = a.startDate && a.startDate.getTime() || 0;
        let bTime = b.startDate && b.startDate.getTime() || 0;

        return aTime < bTime
          ? -1
          : aTime > bTime
            ? 1
            : 0;
      });

    logToElement(problemRecords, '#debug', true);

    this.chartRanges = this.getChartRanges(problemRecords);

    problemRecords.forEach(problemRecord => {
        let groupByProp = problemRecord.startDate;

        if(!!groupByProp) {
          let chartRange = self.chartRanges.find(x => groupByProp >= x.startDate && groupByProp < x.endDate);

          if(chartRange) {
            let data = chartRange.data;

            if(problemRecord.timeToDetect != undefined) {
              data.timeToDetect.count++;
              data.timeToDetect.total += problemRecord.timeToDetect;
            }

            if(problemRecord.timeToResolve != undefined) {
              data.timeToResolve.count++;
              data.timeToResolve.total += problemRecord.timeToResolve;
            }

            if(problemRecord.timeToComplete != undefined) {
              data.timeToComplete.count++;
              data.timeToComplete.total += problemRecord.timeToComplete;
            }

          }
        }
      });

    rcaData.labels = this.chartRanges.map(x => x.label);
    rcaData.datasets = [];

    let timeToDetectData = this.chartRanges.map(x => {
      let d = x.data.timeToDetect;

      if(d.count) {
        return Math.round(d.total / d.count)
      } else {
        return null;
      }
    });
    let timeToResolveData = this.chartRanges.map(x => {
      let d = x.data.timeToResolve;

      if(d.count) {
        return Math.round(d.total / d.count)
      } else {
        return null;
      }
    });
    let timeToCompleteData = this.chartRanges.map(x => {
      let d = x.data.timeToComplete;

      if(d.count) {
        return Math.round(d.total / d.count)
      } else {
        return null;
      }
    });

    rcaData.datasets.push(this.getChartDataset(
      'Time to detect',
      timeToDetectData,
      '#ff0000'
    ));
    rcaData.datasets.push(this.getChartDataset(
      'Time to resolve',
      timeToResolveData,
      '#00ff00'
    ));
    rcaData.datasets.push(this.getChartDataset(
      'Time to complete',
      timeToCompleteData,
      '#0000ff'
    ));

    this.chartService.lineChartOptions['tooltips']['callbacks'] = {
      afterLabel: function(tooltipItem: any, data: any) {
        return ['average of ' + self.chartRanges[tooltipItem.index].getCountByIndex(tooltipItem.datasetIndex) + ' items', ''];
      }
    }

    if (!!this.rcaChartEl) {
      let ctx = this.rcaChartEl.getContext("2d");

      this.rcaChart = new this.chartService.chart(ctx, {
        type: 'line',
        data: rcaData,
        options: Object.assign({}, this.chartService.lineChartOptions, {
          title: {
            display: true,
            text: 'RCA Trends'
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: false,
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Days'
              }
            }]
          },
        })
      });
    }
  }

  getChartDataset(label: string, data: number[], color: string) {
    return {
      label: label,
      lineTension: 0,
      fill: false,
      spanGaps: true,
      backgroundColor: color,
      borderColor: color,
      data: data
    };
  }

  copyToClipboard(): void {
    let wrap = document.getElementById('imageWrap') as HTMLDivElement;
    let imgEl = document.getElementById('canvasImage') as HTMLImageElement;

    if (imgEl) {
      let selection = window.getSelection();

      imgEl.src = this.rcaChart.toBase64Image();

      if (selection.rangeCount > 0) {
        selection.removeAllRanges();
      }

      if (imgEl) {
        let elRange = document.createRange();

        elRange.selectNode(wrap);
        selection.addRange(elRange);

        document.execCommand('copy');

        selection.removeAllRanges();
      }
    }

  }

  daysBetween(d1: Date, d2: Date): number {
    if (!d1 || !d2) { return null; }

    return Math.round(Math.abs((d1.getTime() - d2.getTime())) / ONE_DAY);
  }

  getChartRanges(problemRecords: IProblemRecord[]): ChartRange[] {
    let chartRanges: ChartRange[] = [];
    let dateRange = new DateRange();

    problemRecords.forEach(x => this.expandDateRange(dateRange, x));

    while (dateRange.startDate != null && dateRange.endDate != null && dateRange.startDate <= dateRange.endDate) {
      let s: Date;
      let e: Date;
      let l = '';

      switch (this.scale) {
        case ScaleType.daily:
          s = new Date(dateRange.startDate.getFullYear(), dateRange.startDate.getMonth(), dateRange.startDate.getDate(), 0, 0, 0, 0);
          e = new Date(s.getTime());
          e.setDate(e.getDate() + 1);
          l = s.getDate().toString();

          if (l === '1' || chartRanges.length === 0) {
            l = MONTH_LABELS[s.getMonth()] + ' ' + l;
          }

          break;
        case ScaleType.monthly:
          s = new Date(dateRange.startDate.getFullYear(), dateRange.startDate.getMonth(), 1, 0, 0, 0, 0);
          e = new Date(s.getTime());
          e.setMonth(e.getMonth() + 1);

          l = MONTH_LABELS[s.getMonth()]
          break;
        case ScaleType.quarterly:
          s = new Date(dateRange.startDate.getFullYear(), dateRange.startDate.getMonth(), 1, 0, 0, 0, 0);
          e = new Date(s.getTime());
          e.setMonth(e.getMonth() + 3);

          l = 'Q' + (1 + Math.floor(s.getMonth() / 3)).toString();
          break;
      }

      chartRanges.push(new ChartRange({
        startDate: new Date(s.getTime()),
        endDate: new Date(e.getTime()),
        label: l
      }));

      switch (this.scale) {
        case ScaleType.daily:
          dateRange.startDate.setDate(dateRange.startDate.getDate() + 1);
          break;
        case ScaleType.monthly:
          dateRange.startDate.setDate(1);
          dateRange.startDate.setMonth(dateRange.startDate.getMonth() + 1);
          break;
        case ScaleType.quarterly:
          dateRange.startDate.setDate(1);
          dateRange.startDate.setMonth(dateRange.startDate.getMonth() + 3);
          break;
      }
    }

    return chartRanges;
  }

  expandDateRange(r: DateRange, item: WorkItem) {
    let dates: Date[] = [];

    if(this.groupBy === GroupType.start) {
      dates.push(item.startDate);
    } else {
      dates.push(item.resolvedDate);
    }

    dates.forEach(d => {
      if (!!d) {
        if (!r.startDate || d < r.startDate) {
          r.startDate = new Date(d.getTime());
        }
        if (!r.endDate || d > r.endDate) {
          r.endDate = new Date(d.getTime());
        }
      }
    });
  }

}

