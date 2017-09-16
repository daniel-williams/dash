import {
  Component,
  Input,
  SimpleChange } from '@angular/core';

import { TelemetryGradeDetail } from '../../../../scenario-readiness';


@Component({
  selector: 'telemetry-presenter',
  templateUrl: './telemetry-presenter.component.html'
})
export class TelemetryPresenter {
  @Input() data: any;

  private _cellStyle: any = null; // backing field for prop
  private grade: TelemetryGradeDetail = new TelemetryGradeDetail();

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    // reset style
    this._cellStyle = null;
  }

  get cellStyle(): any {
    if(!this._cellStyle) {
      let readinessGrade = this.data['readinessGrade'] || {};

      this.grade = (readinessGrade['telemetryGradeDetail'] || new TelemetryGradeDetail()) as TelemetryGradeDetail;
      this._cellStyle = {
        padding: '5px 15px',
        backgroundColor: this.grade.gradeColor || 'inherit'
      }
    }
    return this._cellStyle;
  }
}
