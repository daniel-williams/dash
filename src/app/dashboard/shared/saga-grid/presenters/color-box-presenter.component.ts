import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'color-box-presenter',
  templateUrl: './color-box-presenter.component.html',
  styleUrls: ['./color-box-presenter.component.scss']
})
export class ColorBoxPresenter {
  @Input() data: string;
  @Input() key: string;

  private _cellStyle: any = null;
  private colorMap: ColorMap[] = [];

  constructor() { }

  ngOnInit() {
    // TODO djw: really dislike
    switch(this.key) {
      case 'state':
        this.colorMap = stateColorMap;
        break;
      case 'measurableOutcomeDefined':
        this.colorMap = measurableOutcomeDefinedColorMap;
        break;
      case 'measurableOutcomeMet':
        this.colorMap = measurableOutcomeMetColorMap;
        break;
      case 'scenarioValidation':
        this.colorMap = ScenarioValidationColorMap;
        break;
      case 'testCoverageExists':
        this.colorMap = testCoverageExistsMap;
        break;
      default:
        this.colorMap = [];
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this._cellStyle = null;
  }

  get cellStyle(): any {
    if(!this._cellStyle) {
      let map = this.colorMap.find(x => x.key === this.data) || {} as ColorMap;
      let color = map.color || 'inherit';

      this._cellStyle = {
        position: 'relative',
        padding: '5px 10px',
        backgroundColor: color,
      }
    }
    return this._cellStyle;
  }
}

interface ColorMap {
  key: string;
  color: string;
}


const red: string = '#F4A4A4';
const Green: string = '#AFE9B2';
const yellow: string = '#FFFCCF';
const gray: string = '#F2F2F2';

const stateColorMap: ColorMap[]  = [
  { key: 'Proposed', color: red },
  { key: 'Committed', color: Green },
  { key: 'Started', color: Green },
  { key: 'Completed', color: Green },
];

const measurableOutcomeDefinedColorMap: ColorMap[]  = [
  { key: 'Not Applicable', color: gray },
  { key: 'Yes', color: Green },
  { key: 'No', color: red },
  { key: 'Not Graded', color: gray },
  { key: 'Renew Grade', color: gray },
];

const measurableOutcomeMetColorMap: ColorMap[]  = [
  { key: 'Gray', color: gray },
  { key: 'Red', color: red },
  { key: 'Yellow', color: yellow },
  { key: 'Green', color: Green },
  { key: 'Not Graded', color: gray },
  { key: 'Renew Grade', color: gray },
];

const ScenarioValidationColorMap: ColorMap[]  = [
  { key: 'Gray', color: gray },
  { key: 'Red', color: red },
  { key: 'Yellow', color: yellow },
  { key: 'Green', color: Green },
  { key: 'Not Graded', color: gray },
  { key: 'Renew Grade', color: gray },
];

const testCoverageExistsMap: ColorMap[] = [
  { key: 'Exists', color: Green },
  { key: 'Does Not Exist', color: red },
  { key: 'Not Applicable', color: gray },
];
