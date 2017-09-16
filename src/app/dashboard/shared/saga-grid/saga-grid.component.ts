import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  HostListener,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewEncapsulation,
  ChangeDetectionStrategy } from '@angular/core';
import {
  Headers,
  Http,
  RequestOptions } from '@angular/http';

import {
  AppConstants
} from '../../../app.constants';
import {
  ScrollMagic } from '../../../shared/services';

import {
  ColumnSchema,
  GridSchema,
  IColumnSort,
  EditorType,
  SortType } from './types';
import {
  AlphaSort,
  MeasurableOutcomesMetSort,
  NumberSort,
  RiskSort,
  StateSort } from './sorters';


let BASE_WIDTH = 1200;

@Component({
  selector: 'saga-grid',
  templateUrl: './saga-grid.component.html',
  styleUrls: ['./saga-grid.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SagaGrid {
  @HostListener('window:resize', ['$event'])
    onWindowResize(evt: any) {
      this.resizeHeaders(); // TODO djw: throttle
      this.calculateSizeRelative();
    }
  @HostListener('window:scroll', ['$event'])
    onWindowScroll(evt: UIEvent) {
      if(this.target) {
        let doc = evt.target as HTMLDocument;

        this.target.style.left = this.target.style.position === 'fixed'
          ? -(doc.scrollingElement.scrollLeft) + 15 + 'px'
          : '0';
      }
    }

  @Input() data: any[] = [];
  @Input() schema: GridSchema = new GridSchema([]);
  @Input() title: string;
  @Input() pinPrefix: string = 'pin';
  @Input() paged: boolean = false;
  @Input() pageSize: number = 100;
  @Input() showTotals: boolean = false;

  @Output() save = new EventEmitter<any>();

  private controller: any;
  private gridData: any[] = [];
  private requestOptions: RequestOptions = new RequestOptions({
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  });
  private scene: any;
  private scrollLeft: number;
  private showOptionsPanel: boolean = false;
  private sizeRelative: number = 1;

  private trigger: any;
  private target: any;
  private grid: HTMLElement;

  public sorts: IColumnSort[] = [];

  constructor(
    private appConstants: AppConstants,
    private changeDetector: ChangeDetectorRef,
    private http: Http
    ) {
    this.controller = new ScrollMagic.Controller();
    this.calculateSizeRelative();
  }

  ngAfterViewInit() {
    this.trigger = document.querySelector('.' + this.triggerName);
    this.target = document.querySelector('.' + this.targetName);
    this.grid = document.querySelector('.grid-data.' + this.pinPrefix) as HTMLElement;

    this.scene = new ScrollMagic
      .Scene({
        triggerElement: this.trigger,
        triggerHook: 0,
        duration: 1
      })
      .setClassToggle(this.target, "pinned")
      .setPin(this.target, {pushFollowers: false})
      .addTo(this.controller);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.applySorts();

    setTimeout(() => this.resizeHeaders(), 100);
  }

  get pagedGridData(): any[] {
    if(this.paged) {
      return this.gridData.slice(0, this.pageSize);
    }

    return this.gridData;
  }

  get workitemIds(): number[] {
    return this.gridData.map(x => x.id);
  }

  get triggerName(): string {
    return this.pinPrefix + '-trigger';
  }

  get targetName(): string {
    return this.pinPrefix + '-target';
  }

  calculateSizeRelative(): void {
    this.sizeRelative = window.innerWidth / BASE_WIDTH;
  }

  resizeHeaders() {
    let totalTableWidth = 0;
    let stickyControls = this.trigger.querySelector('.grid-controls') as HTMLDivElement;
    let stickyTable = this.trigger.querySelector('table') as HTMLTableElement;
    let stickyHeaderCells = stickyTable.querySelectorAll('thead > tr.headings > td');
    let headerCells = this.grid.querySelectorAll('table > thead > tr.headings > td');

    for(let i = 0; i < headerCells.length; i++) {
      let headerCell = headerCells[i] as Element;
      let stickyHeaderCell = stickyHeaderCells[i] as HTMLDivElement;

      if(headerCell && stickyHeaderCell) {
        stickyHeaderCell.setAttribute('style',`width:${headerCell.clientWidth}px`);
        stickyHeaderCell.style.width = `${headerCell.clientWidth}px`;
        totalTableWidth += headerCell.clientWidth;
      }
    }

    if(stickyControls) {
      stickyControls.style.width = totalTableWidth + 'px';
    }
    if(stickyTable) {
      stickyTable.style.width = totalTableWidth + 'px';
    }
    let self = this;
    setTimeout(() => {
      let duration = self.grid.getBoundingClientRect().height;

      self.scene.duration(Math.max(1, duration - 100));
    }, 0);
  }

  setEditMode(row: any, schema: ColumnSchema) {
    if(schema.editor !== EditorType.None) {
      row.editMode = schema.key;
    }
    setTimeout(() => this.resizeHeaders(), 0);
  }

  onCancel(row: any) {
    row.editMode = '';
    setTimeout(() => this.resizeHeaders(), 0);
  }

  // TODO djw: This need to raise event on component and save handled by parent
  onSave(row: any, key: string, value: any) {
    this.updateCell(row, key, value);
    row.editMode = '';

    let payload = {
      id: row.id,
      measurableOutcomeMet: row.measurableOutcomeMet || "",
      comments: row.comments || "",
      testCoverageExists: row.testCoverageExists || "",
    };

    if(this.appConstants.useCorpResources) {

      this.http.post(this.appConstants.sagaApiEndpoint + 'readiness/', payload, this.requestOptions)
        .toPromise()
        .catch(err => console.log('error posting readiness: ', err));
    }
    setTimeout(() => this.resizeHeaders(), 0);

    this.save.emit(payload);
  }

  setColumnVisibility(key: string, evt: MouseEvent): void {
    evt.preventDefault();
    evt.stopImmediatePropagation();

    this.schema.toggleVisibility(key);
    setTimeout(() => this.resizeHeaders(), 0);
  }

  toggleColumnOptions(evt: MouseEvent): void {
    evt.preventDefault();
    evt.stopImmediatePropagation();

    this.showOptionsPanel = !this.showOptionsPanel;
  }

  hideColumnOptions(evt: MouseEvent): void {
    evt.preventDefault();
    evt.stopImmediatePropagation();

    this.showOptionsPanel = false;
  }

  copyToClipboard(id: string): void {
    let gridEl = document.getElementById(id);
    let selection = window.getSelection();

    if(selection.rangeCount > 0) {
      selection.removeAllRanges();
    }

    if(gridEl) {
      let elRange = document.createRange();


      elRange.selectNode(gridEl);
      selection.addRange(elRange);

      document.execCommand('copy');
      // console.info('[-] copyToClipboard', gridEl);

      selection.removeAllRanges();
    }
  }


  private addSort(columnSchema: ColumnSchema, event: MouseEvent = null): void {
    if(event && event.ctrlKey) {
      let initSortCount = this.sorts.length;

      // if exists, remove it
      this.sorts = this.sorts.reduce((accum: IColumnSort[], x: IColumnSort): IColumnSort[] => {
        if(x.key !== columnSchema.key) {
          accum.push(x);
        }
        return accum;
      }, []);

      if(this.sorts.length === initSortCount) {
        // else add it
        this.addSchemaSorter(columnSchema);
      }
    } else {
      let sortAdded = false;

      // if exits, reverse it
      this.sorts.forEach(x => {
        if(sortAdded) { return; }

        if(x.key === columnSchema.key) {
          x.asc = !x.asc;
          sortAdded = true;
        }
      });

      if(!sortAdded) {
        // new sort
        this.clearSorts();
        this.addSchemaSorter(columnSchema);
      }
    }

    this.applySorts();
  }

  public setSorts(sorts: ColumnSchema[]) {
    this.clearSorts();
    if(sorts && sorts.length) {
      sorts.forEach(x => this.addSchemaSorter(x));
    }
    this.applySorts();
  }

  private applySorts(): void {
    // console.log('[-] applying sort',  this.sorts.map(x => (x.key + (x.asc ? ':asc' : ':desc'))).join(', '));

    if(!this.data || !this.data.length) {
      this.gridData = [];
    } else {
      this.gridData = this.data.sort((a, b) => {
        let res = 0;

        for(let i = 0; i < this.sorts.length; i++) {
          res = this.sorts[i].sort(a, b);
          if(res !== 0) { break; }
        }

        return res;
      });
    }

    this.schema.updateSorts(this.sorts);
  }

  private addSchemaSorter(columnSchema: ColumnSchema): void {
    let {sorter, key} = columnSchema;

    switch(sorter) {
      case SortType.Number:
        this.sorts.push(new NumberSort(key));
        break;
      case SortType.Risk:
        this.sorts.push(new RiskSort(key));
        break;
      case SortType.State:
        this.sorts.push(new StateSort(key));
        break;
      default:
        this.sorts.push(new AlphaSort(key));
    }
  }

  private clearSorts(): void {
    this.sorts = [];
  }

  private updateCell(row: any, key: string, value: any) {
    this.data.forEach(item => {
      if(item.id === row.id) {
        item[key] = value;
      }
    });
    this.applySorts();
  }

  private getSortOrderOf(key: string): number {
    for(let i = 0; i < this.sorts.length; i++) {
      if(this.sorts[i].key === key) {
        return i;
      }
    }
    return null;
  }

  private getSortAscOf(key: string): boolean {
    for(let i = 0; i < this.sorts.length; i++) {
      if(this.sorts[i].key === key) {
        return this.sorts[i].asc;
      }
    }
    return null;
  }

  isLink(schema: ColumnSchema): boolean {
    return schema.key === 'accessibility' ||
           schema.key === 'craftsmanship' ||
           schema.key === 'scenarioValidation' ||
           schema.key === 'completeness' ||
           schema.key === 'highImpactBugs' ||
           schema.key === 'telemetry' ||
           schema.key === 'customerFeedback';
  }

  getTotals(schema: ColumnSchema): number | string {
    let accum: number[] = [];
    let total = 0;
    let count = 0;

    switch(schema.key) {
      case 'completeness':
        count = 0;
        accum = [];

        this.gridData.forEach(row => {
          let gradeData = row['readinessGrade'] && row['readinessGrade']['completenessGradeDetail'];

          if(gradeData) {
            accum = accum.concat(gradeData.ids());
          }
        });
        count = dedupeIds(accum).length;
        if(count || count === 0) { total = count; }
        break;
      case 'scenarioValidation':
        count = 0;
        accum = [];

        this.gridData.forEach(row => {
          let gradeData = row['readinessGrade'] && row['readinessGrade']['scenarioValidationGradeDetail'];

          if(gradeData) {
            accum = accum.concat(gradeData.ids());
          }
        });
        count = dedupeIds(accum).length;
        if(count || count === 0) { total = count; }
        break;
      case 'stateValue':
        count = 0;
        accum = [];

        this.gridData.forEach(row => {
          let gradeData = row['readinessGrade'] && row['readinessGrade']['stateGradeDetail'];

          if(gradeData) {
            accum = accum.concat(gradeData.ids());
          }
        });
        count = dedupeIds(accum).length;
        if(count || count === 0) { total = count; }
        break;
      case 'highImpactBugs':
        count = 0;
        accum = [];

        this.gridData.forEach(row => {
          let gradeData = row['readinessGrade'] && row['readinessGrade']['highImpactBugsGradeDetail'];

          if(gradeData) {
            accum = accum.concat(gradeData.ids());
          }
        });
        count = dedupeIds(accum).length;
        if(count || count === 0) { total = count; }
        break;
      case 'telemetry':
        count = 0;
        accum = [];

        this.gridData.forEach(row => {
          let gradeData = row['readinessGrade'] && row['readinessGrade']['telemetryGradeDetail'];

          if(gradeData) {
            accum = accum.concat(gradeData.ids());
          }
        });
        count = dedupeIds(accum).length;
        if(count || count === 0) { total = count; }
        break;
      case 'customerFeedback':
        count = 0;
        accum = [];

        this.gridData.forEach(row => {
          let gradeData = row['readinessGrade'] && row['readinessGrade']['customerFeedbackGradeDetail'];

          if(gradeData) {
            accum = accum.concat(gradeData.ids());
          }
        });
        count = dedupeIds(accum).length;
        if(count || count === 0) { total = count; }
        break;
      case 'accessibility':
        count = 0;
        accum = [];

        this.gridData.forEach(row => {
          let gradeData = row['readinessGrade'] && row['readinessGrade']['accessibilityGradeDetail'];

          if(gradeData) {
            accum = accum.concat(gradeData.ids());
          }
        });
        count = dedupeIds(accum).length;
        if(count || count === 0) { total = count; }
        break;
      case 'craftsmanship':
        count = 0;
        accum = [];

        this.gridData.forEach(row => {
          let gradeData = row['readinessGrade'] && row['readinessGrade']['craftsmanshipGradeDetail'];

          if(gradeData) {
            accum = accum.concat(gradeData.ids());
          }
        });
        count = dedupeIds(accum).length;
        if(count || count === 0) { total = count; }
        break;
      case 'riskAssessment':
        count = 0;
        accum = [];

        this.gridData.forEach(row => {
          let gradeData = row['readinessGrade'] && row['readinessGrade']['riskAssessmentGradeDetail'];

          if(gradeData) {
            accum = accum.concat(gradeData.ids());
          }
        });
        count = dedupeIds(accum).length;
        if(count || count === 0) { total = count; }
        break;
      default:
        return '';
    }

    return total;
  }

  getIds(schema: ColumnSchema): number[] {
    let accum: number[] = [];
    let ids: number[] = [];

    switch(schema.key) {
      case 'scenarioValidation':
        accum = [];

        this.gridData.forEach(row => {
          let gradeData = row['readinessGrade'] && row['readinessGrade']['scenarioValidationGradeDetail'];

          if(gradeData) {
            accum = accum.concat(gradeData.ids());
          }
        });
        ids = dedupeIds(accum);
        break;
      case 'accessibility':
        accum = [];

        this.gridData.forEach(row => {
          let gradeData = row['readinessGrade'] && row['readinessGrade']['accessibilityGradeDetail'];

          if(gradeData) {
            accum = accum.concat(gradeData.ids());
          }
        });
        ids = dedupeIds(accum);
        break;
      case 'craftsmanship':
        accum = [];

        this.gridData.forEach(row => {
          let gradeData = row['readinessGrade'] && row['readinessGrade']['craftsmanshipGradeDetail'];

          if(gradeData) {
            accum = accum.concat(gradeData.ids());
          }
        });
        ids = dedupeIds(accum);
        break;
      case 'completeness':
        accum = [];

        this.gridData.forEach(row => {
          let gradeData = row['readinessGrade'] && row['readinessGrade']['completenessGradeDetail'];

          if(gradeData) {
            accum = accum.concat(gradeData.ids());
          }
        });
        ids = dedupeIds(accum);
        break;
      case 'highImpactBugs':
        accum = [];

        this.gridData.forEach(row => {
          let gradeData = row['readinessGrade'] && row['readinessGrade']['highImpactBugsGradeDetail'];

          if(gradeData) {
            accum = accum.concat(gradeData.ids());
          }
        });
        ids = dedupeIds(accum);
        break;
      case 'telemetry':
        accum = [];

        this.gridData.forEach(row => {
          let gradeData = row['readinessGrade'] && row['readinessGrade']['telemetryGradeDetail'];

          if(gradeData) {
            accum = accum.concat(gradeData.ids());
          }
        });
        ids = dedupeIds(accum);
        break;
      case 'customerFeedback':
        accum = [];

        this.gridData.forEach(row => {
          let gradeData = row['readinessGrade'] && row['readinessGrade']['customerFeedbackGradeDetail'];

          if(gradeData) {
            accum = accum.concat(gradeData.ids());
          }
        });
        ids = dedupeIds(accum);
        break;

    }

    return ids;
  }

}

function dedupeIds(ids: number[]) {
  var o = {};
  ids.forEach(item => o[item] = item)

  return Object.keys(o).map(key => o[key]);
}