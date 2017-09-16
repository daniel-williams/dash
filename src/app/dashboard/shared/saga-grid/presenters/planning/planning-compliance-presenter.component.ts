import {
  Component,
  Input,
  SimpleChange } from '@angular/core';

import { GradeColor } from '../../../../scenario-readiness';

@Component({
  selector: 'planning-compliance-presenter',
  templateUrl: './planning-compliance-presenter.component.html'
})
export class PlanningCompliancePresenter {
  @Input() data: any;

  private text: string;
  private _cellStyle: any = null; // backing field for prop

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    // reset style
    this._cellStyle = null;
  }

  get cellStyle(): any {
    if(!this._cellStyle) {
      this.text = (this.data['compliance'] || '');
      let gradeColor = GradeColor.None

      switch(this.text.toLowerCase()) {
        case 'assessment completed':
          gradeColor = GradeColor.Green;
          break;
        case 'not assessed':
          gradeColor = GradeColor.Yellow;
          break;
        default:
          gradeColor = GradeColor.None;
      }

      this._cellStyle = {
        padding: '5px 15px',
        backgroundColor: gradeColor || 'inherit'
      }
    }
    return this._cellStyle;
  }
}
