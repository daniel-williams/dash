import {
  Component,
  Input,
  SimpleChange } from '@angular/core';

import { GradeColor } from '../../../../scenario-readiness';

@Component({
  selector: 'planning-func-spec-presenter',
  templateUrl: './planning-func-spec-presenter.component.html'
})
export class PlanningFuncSpecPresenter {
  @Input() data: any;

  private text: string = '';
  private url: string = '';
  private _cellStyle: any = null; // backing field for prop
  private _hasUrl: boolean = null;

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    this.url = (this.data['funcSpecUrl'] || '');
    this.text = (this.data['funcSpecStatus'] || '');

    // reset style
    this._cellStyle = null;
    this._hasUrl = null;
  }

  get cellStyle(): any {
    if(!this._cellStyle) {
      let gradeColor = GradeColor.None

      this._cellStyle = {
        padding: '5px 15px',
        backgroundColor: gradeColor || 'inherit'
      }
    }
    return this._cellStyle;
  }

  get hasUrl(): boolean {
    if(!this._hasUrl) {
      this._hasUrl = this.url.length > 0;
    }
    return this._hasUrl;
  }
}
