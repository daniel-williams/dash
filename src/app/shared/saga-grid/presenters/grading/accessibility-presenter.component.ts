import {
  Component,
  Input,
  SimpleChange } from '@angular/core';

import { AccessibilityGradeDetail } from '../../../../scenario-readiness';


@Component({
  selector: 'accessibility-presenter',
  templateUrl: './accessibility-presenter.component.html'
})
export class AccessibilityPresenter {
  @Input() data: any;

  private _cellStyle: any = null; // backing field for prop
  private grade: AccessibilityGradeDetail = new AccessibilityGradeDetail();

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    // reset style
    this._cellStyle = null;
  }

  get cellStyle(): any {
    if(!this._cellStyle) {
      let readinessGrade = this.data['readinessGrade'] || {};

      this.grade = (readinessGrade['accessibilityGradeDetail'] || new AccessibilityGradeDetail()) as AccessibilityGradeDetail;
      this._cellStyle = {
        padding: '5px 15px',
        backgroundColor: this.grade.gradeColor || 'inherit'
      }
    }
    return this._cellStyle;
  }
}
