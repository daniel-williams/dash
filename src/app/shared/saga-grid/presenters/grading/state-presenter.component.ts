import {
  Component,
  Input,
  SimpleChange } from '@angular/core';

import { StateGradeDetail } from '../../../../scenario-readiness';


@Component({
  selector: 'state-presenter',
  templateUrl: './state-presenter.component.html'
})
export class StatePresenter {
  @Input() data: any;

  private _cellStyle: any = null; // backing field for prop
  private grade: StateGradeDetail = new StateGradeDetail();

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    // reset style
    this._cellStyle = null;
  }

  get cellStyle(): any {
    if(!this._cellStyle) {
      let readinessGrade = this.data['readinessGrade'] || {};

      this.grade = (readinessGrade['stateGradeDetail'] || new StateGradeDetail()) as StateGradeDetail;
      this._cellStyle = {
        padding: '5px 15px',
        backgroundColor: this.grade.gradeColor || 'inherit'
      }
    }
    return this._cellStyle;
  }
}
