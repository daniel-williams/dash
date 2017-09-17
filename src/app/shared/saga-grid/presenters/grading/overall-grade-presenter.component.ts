import {
  Component,
  Input,
  SimpleChange } from '@angular/core';

import { OverallGradeDetail } from '../../../../scenario-readiness';

@Component({
  selector: 'overall-grade-presenter',
  templateUrl: './overall-grade-presenter.component.html'
})
export class OverallGradePresenter {
  @Input() data: any;

  private _cellStyle: any = null;
  private grade: OverallGradeDetail = new OverallGradeDetail();

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    // reset style
    this._cellStyle = null;
  }

  get cellStyle(): any {
    if(!this._cellStyle) {
      let readinessGrade = this.data['readinessGrade'] || {};

      this.grade = (readinessGrade['overallGradeDetail'] || new OverallGradeDetail()) as OverallGradeDetail;
      this._cellStyle = {
        padding: '5px 15px',
        // backgroundColor: this.grade.gradeColor || 'inherit'
      }
    }
    return this._cellStyle;
  }
}
