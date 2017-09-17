import {
  Component,
  Input,
  SimpleChange } from '@angular/core';

import { GradeColor } from '../../../../scenario-readiness';

@Component({
  selector: 'planning-state-presenter',
  templateUrl: './planning-state-presenter.component.html'
})
export class PlanningStatePresenter {
  @Input() data: any;

  private text: string;
  private _cellStyle: any = null; // backing field for prop

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    // reset style
    this._cellStyle = null;
  }

  get cellStyle(): any {
    if(!this._cellStyle) {
      this.text = (this.data['state'] || '');
      let gradeColor = GradeColor.None

      switch(this.text.toLowerCase()) {
        case 'started':
          gradeColor = GradeColor.Green;
          break;
        case 'committed':
          gradeColor = GradeColor.Green;
          break;
        case 'proposed':
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
