import { ChangeDetectorRef } from '@angular/core';

import { WorkItem, Sort } from '../shared/services/vso';
import {
  IMultiSelectOption,
  IMultiSelectSettings,
  IMultiSelectTexts } from './shared/multi-select-dropdown';

let BASE_WIDTH = 1200;
let GRID_STYLE_ID = 'grid-style';

export class PlanningBase {
  private colorWhite = 'white';
  private colorLightGreen = 'lightgreen';
  private colorDarkGreen = 'darkgreen';
  private colorYellow = 'yellow';
  private colorRed = 'tomato';
  private colorNone = '';

  public sizeRelative: number = 1;
  public multiSelectSettings: IMultiSelectSettings;
  public multiSelectTexts: IMultiSelectTexts;
  public multiSelectOptions: IMultiSelectOption[];

  constructor(private changeDetector: ChangeDetectorRef) {
    this.multiSelectSettings = {
      enableSearch: true,
      showUncheckAll: true,
      dynamicTitleMaxItems: 1,
      maxHeight: '300px',
    };

    this.multiSelectTexts = {
      checkAll: 'all',
      uncheckAll: 'clear',
      searchPlaceholder: 'filter...',
      defaultTitle: 'select'
    };

    this.calculateSizeRelative();
  }

  calculateSizeRelative(): void {
    this.sizeRelative = window.innerWidth / BASE_WIDTH;
  }

  onResize(evt: any) {
    this.calculateSizeRelative();
  }

  setMultiSelectOptions(paths: Array<string>) {
    this.multiSelectOptions = paths.map(path => {
      return {id: path, name: path} as IMultiSelectOption
    });
  }

  setSort(sort: Sort, sortOn: string) {
    if(sort.sortOn !== sortOn) {
      sort.sortOn = sortOn;
      sort.asc = true;
    } else {
      sort.asc = !sort.asc;
    }
    this.changeDetector.detectChanges();
  }

  copyToClipboard(id: string, gridStyleId: string = GRID_STYLE_ID): void {
    let gridEl = document.getElementById(id);
    let styleEl = document.getElementById(gridStyleId);
    let selection = window.getSelection();

    if(selection.rangeCount > 0) {
      selection.removeAllRanges();
    }

    if(gridEl) {
      let elRange = document.createRange();

      if(styleEl) {
        let styleRange = document.createRange();

        styleRange.selectNode(styleEl);
        selection.addRange(styleRange);
      }

      elRange.selectNode(gridEl);
      selection.addRange(elRange);

      document.execCommand('copy');
      console.info('copyToClipboard', gridEl, styleEl);

      selection.removeAllRanges();
    }
  }


  stateColor(workItem: WorkItem) {
    let value = (workItem.state || '').trim().toLowerCase();

    switch(value) {
      case 'proposed':
        return this.colorYellow;
      case 'committed':
      case 'started':
        return this.colorLightGreen;
      case 'closed':
      case 'complete':
      case 'completed':
        return this.colorDarkGreen;
      default:
        return this.colorNone;
    }
  }

  complianceColor(workItem: WorkItem) {
    let value = (workItem.compliance || '').trim().toLowerCase();

    switch(value) {
      case 'not assessed':
        return this.colorYellow;
      case 'assessment completed':
      case 'approved exception to not complete assessment':
        return this.colorLightGreen;
      default:
        return this.colorNone;
    }
  }

  riskColor(workItem: WorkItem) {
    let value = (workItem.risk || '').trim().toLowerCase();

    switch(value) {
      case 'on track':
        return this.colorLightGreen;
      case 'at risk':
        return this.colorYellow;
      case 'not on track':
      case 'off track':
        return this.colorRed;
      default:
        return this.colorNone;
    }
  }

  get tblStyle(): any {
    return {
      border: '1px solid #777777'
    };
  }

  get tblHeadStyle(): any {
    return {
      padding: '10px',
      verticalAlign: 'top',
      borderTop: '1px solid #777777',
      backgroundColor: 'lightgrey'
    };
  }

  get tblCellStyle(): any {
    return {
      padding: '10px',
      verticalAlign: 'top',
      borderBottom: '1px solid #777777',
    };
  }
}
