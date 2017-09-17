import {
  Component,
  Input,
  SimpleChange } from '@angular/core';

import { CompletenessGradeDetail } from '../../../../scenario-readiness';


@Component({
  selector: 'completeness-presenter',
  templateUrl: './completeness-presenter.component.html'
})
export class CompletenessPresenter {
  @Input() data: any;

  private _cellStyle: any = null; // backing field for prop
  private grade: CompletenessGradeDetail = new CompletenessGradeDetail();

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    // reset style
    this._cellStyle = null;
  }

  get cellStyle(): any {
    if(!this._cellStyle) {
      let readinessGrade = this.data['readinessGrade'] || {};

      this.grade = (readinessGrade['completenessGradeDetail'] || new CompletenessGradeDetail()) as CompletenessGradeDetail;
      this._cellStyle = {
        padding: '5px 15px',
        backgroundColor: this.grade.gradeColor || 'inherit'
      }
    }
    return this._cellStyle;
  }
}
