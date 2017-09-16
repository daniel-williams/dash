import {
  Component,
  Input,
  SimpleChange } from '@angular/core';

import { CraftsmanshipGradeDetail } from '../../../../scenario-readiness';


@Component({
  selector: 'craftsmanship-presenter',
  templateUrl: './craftsmanship-presenter.component.html'
})
export class CraftsmanshipPresenter {
  @Input() data: any;

  private _cellStyle: any = null; // backing field for prop
  private grade: CraftsmanshipGradeDetail;

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    // reset style
    this._cellStyle = null;
  }

  get cellStyle(): any {
    if(!this._cellStyle) {
      let readinessGrade = this.data['readinessGrade'] || {};

      this.grade = (readinessGrade['craftsmanshipGradeDetail'] || new CraftsmanshipGradeDetail()) as CraftsmanshipGradeDetail;
      this._cellStyle = {
        padding: '5px 15px',
        backgroundColor: this.grade.gradeColor || 'inherit'
      }
    }
    return this._cellStyle;
  }
}
