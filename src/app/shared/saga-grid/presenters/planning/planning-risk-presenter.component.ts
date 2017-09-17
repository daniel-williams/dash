import {
  Component,
  Input,
  SimpleChange } from '@angular/core';

import { GradeColor } from '../../../../scenario-readiness';

@Component({
  selector: 'planning-risk-presenter',
  templateUrl: './planning-risk-presenter.component.html'
})
export class PlanningRiskPresenter {
  @Input() data: any;

  private text: string;
  private _cellStyle: any = null; // backing field for prop

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    // reset style
    this._cellStyle = null;
  }

  get cellStyle(): any {
    if(!this._cellStyle) {
      this.text = (this.data['risk'] || '');
      let gradeColor = GradeColor.None

      switch(this.text.toLowerCase()) {
        case 'on track':
          gradeColor = GradeColor.Green;
          break;
        case 'at risk':
          gradeColor = GradeColor.Yellow;
          break;
        case 'off track':
          gradeColor = GradeColor.Red;
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
