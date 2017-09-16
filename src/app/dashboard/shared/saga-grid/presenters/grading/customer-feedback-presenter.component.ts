import {
  Component,
  Input,
  SimpleChange } from '@angular/core';

import { CustomerFeedbackGradeDetail } from '../../../../scenario-readiness';


@Component({
  selector: 'customer-feedback-presenter',
  templateUrl: './customer-feedback-presenter.component.html'
})
export class CustomerFeedbackPresenter {
  @Input() data: any = {};

  private _cellStyle: any = null; // backing field for prop
  private grade: CustomerFeedbackGradeDetail = new CustomerFeedbackGradeDetail();

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    // reset style
    this._cellStyle = null;
  }

  get cellStyle(): any {
    if(!this._cellStyle) {
      let readinessGrade = this.data['readinessGrade'] || {};

      this.grade = (readinessGrade['customerFeedbackGradeDetail'] || new CustomerFeedbackGradeDetail()) as CustomerFeedbackGradeDetail;
      this._cellStyle = {
        padding: '5px 15px',
        backgroundColor: this.grade.gradeColor || 'inherit'
      }
    }
    return this._cellStyle;
  }
}
