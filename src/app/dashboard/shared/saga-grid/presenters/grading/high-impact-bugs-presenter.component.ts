import {
  Component,
  Input,
  SimpleChange } from '@angular/core';

import { HighImpactBugsGradeDetail } from '../../../../scenario-readiness';


@Component({
  selector: 'high-impact-bugs-presenter',
  templateUrl: './high-impact-bugs-presenter.component.html'
})
export class HighImpactBugsPresenter {
  @Input() data: any;

  private _cellStyle: any = null; // backing field for prop
  private grade: HighImpactBugsGradeDetail = new HighImpactBugsGradeDetail();

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    // reset style
    this._cellStyle = null;
  }

  get cellStyle(): any {
    if(!this._cellStyle) {
      let readinessGrade = this.data['readinessGrade'] || {};

      this.grade = (readinessGrade['highImpactBugsGradeDetail'] || new HighImpactBugsGradeDetail()) as HighImpactBugsGradeDetail;
      this._cellStyle = {
        padding: '5px 15px',
        backgroundColor: this.grade.gradeColor || 'inherit'
      }
    }
    return this._cellStyle;
  }
}
