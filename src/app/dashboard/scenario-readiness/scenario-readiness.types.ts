const red: string = '#F4A4A4';
const green: string = '#AFE9B2';
const yellow: string = '#FFFCCF';
const gray: string = '#F2F2F2';
const none: string = 'transparent';

export enum GradeColor {
  Red = <any>red,
  Green = <any>green,
  Yellow = <any>yellow,
  Gray = <any>gray,
  None = <any>none,
}

interface IGrade {
  calculateGrade: () => string;
}

class GradeDetail {
  gradeColor: GradeColor = GradeColor.None; // determines cell background color
  gradeValue?: string = ''; // used for sorting
  gradeText?: string = ''; // display text

  constructor() { }

  resetGrade() {
    this.gradeColor = GradeColor.None;
    this.gradeValue = '';
    this.gradeText = '';
  }
}

export class OverallGradeDetail extends GradeDetail implements IGrade {

  gradeItemCount: number = 0;
  score: number = 0;

  redCount: number = 0;
  yellowCount: number = 0;
  greenCount: number = 0;
  exemptCount: number = 0;

  constructor(private isCoreReadiness: boolean = false) {
    super();
    this.resetGrade();
  }

  setGrades(grades: GradeDetail[]) {
    this.resetGrade();

    if(grades && grades.length) {
      grades.forEach(x => {
        switch(x.gradeColor) {
          case GradeColor.Green:
            this.gradeItemCount++;
            this.greenCount++;
            break;
          case GradeColor.Yellow:
            this.gradeItemCount++;
            this.yellowCount++;
            break;
          case GradeColor.Red:
            this.gradeItemCount++;
            this.redCount++;
            break;
          case GradeColor.Gray:
          case GradeColor.None:
            this.exemptCount++;
            break;
        }
      })
    }
  }

  resetGrade() {
    super.resetGrade();

    this.gradeItemCount = 0;
    this.exemptCount = 0;
    this.redCount = 0;
    this.yellowCount = 0;
    this.greenCount = 0;
    this.score = 0;
  }

  calculateGrade() {
    this.score = Math.round(10000 * ((this.greenCount * 1) + (this.yellowCount * .5)) / this.gradeItemCount) / 100;
    this.gradeText = this.score.toString();
    this.gradeValue = this.score.toString();

    if(this.isCoreReadiness) {
      this.gradeColor = GradeColor.Gray;
      this.gradeValue = '101';
      this.gradeText = 'Not Applicable'
    } else if( this.redCount > 0) {
      this.gradeColor = GradeColor.Red;
    } else if(this.yellowCount > 0) {
      this.gradeColor = GradeColor.Yellow;
    } else if (this.greenCount > 0) {
      this.gradeColor = GradeColor.Green;
    } else if (this.exemptCount > 0) {
      this.gradeColor = GradeColor.Gray;
    } else {
      this.gradeColor = GradeColor.None;
    }

    return this.gradeValue;
  }
}

export class AccessibilityGradeDetail extends GradeDetail implements IGrade {
  exempt: boolean;
  red: number[];
  yellow: number[];
  lime: number[];

  constructor(private isCoreReadiness: boolean = false) {
    super();
    this.resetGrade();
  }

  resetGrade() {
    super.resetGrade();

    this.exempt = false;
    this.red = [];
    this.yellow = [];
    this.lime = [];
  }

  calculateGrade() {
    if(this.isCoreReadiness) {
      this.gradeColor = GradeColor.Gray;
      this.gradeValue = '6';
      this.gradeText = 'Not Applicable'
    } else if(this.exempt) {
      this.gradeColor = GradeColor.Gray;
      this.gradeValue = '5';
      this.gradeText = 'Not Applicable'
    } else if(this.red.length || this.yellow.length) {
      this.gradeColor = GradeColor.Red;
      this.gradeValue = '1';
      this.gradeText = 'Red';
    } else if(this.lime.length > 5) {
      this.gradeColor = GradeColor.Yellow;
      this.gradeValue = '2';
      this.gradeText = 'Yellow';
    } else if(this.lime.length > 0) {
      this.gradeColor = GradeColor.Green;
      this.gradeValue = '3';
      this.gradeText = 'Green';
    } else {
      this.gradeColor = GradeColor.Green;
      this.gradeValue = '4';
      this.gradeText = 'Green';
    }

    return this.gradeValue;
  }

  get redAndYellow(): number[] {
    return [...this.red, ...this.yellow];
  }

  get yellowAndLime(): number[] {
    return [...this.yellow, ...this.lime];
  }

  totals(): number {
    return (this.isCoreReadiness || this.exempt)
      ? 0
      : this.red.length + this.yellow.length + this.lime.length;
  }

  ids(): number[] {
    return (this.isCoreReadiness || this.exempt)
      ? []
      : [...this.red, ...this.yellow, ...this.lime];
  }
}

export class CompletenessGradeDetail extends GradeDetail implements IGrade {
  all: number[];
  red: number[];
  yellow: number[];

  constructor(private isCoreReadiness: boolean = false) {
    super();
    this.resetGrade();
  }

  resetGrade() {
    super.resetGrade();

    this.all = [];
    this.red = [];
    this.yellow = [];
  }

  calculateGrade() {
    if(this.isCoreReadiness) {
      this.gradeColor = GradeColor.Gray;
      this.gradeValue = '4';
      this.gradeText = 'Not Applicable'
    } else if(this.red.length) {
      this.gradeColor = GradeColor.Red;
      this.gradeValue = '1';
      this.gradeText = 'Red';
    } else if(this.yellow.length) {
      this.gradeColor = GradeColor.Yellow;
      this.gradeValue = '2';
      this.gradeText = 'Yellow';
    } else if(this.all.length) {
      this.gradeColor = GradeColor.Green;
      this.gradeValue = '5';
      this.gradeText = 'Green';
    } else {
      this.gradeColor = GradeColor.Gray;
      this.gradeValue = '3';
      this.gradeText = 'Not Applicable';
    }

    return this.gradeValue;
  }

  get hasDeliverables(): boolean {
    return !!this.all.length;
  }

  totals(): number {
    return this.isCoreReadiness ? 0 : this.red.length + this.yellow.length;
  }

  ids(): number[] {
    return (this.isCoreReadiness)
      ? []
      : [...this.red, ...this.yellow];
  }
}

export class CraftsmanshipGradeDetail extends GradeDetail implements IGrade {
  exempt: boolean;
  reviewed: boolean;
  bugs: number[];
  bugsUnder50: number[];
  bugsUnder80: number[];
  bugs80AndOver: number[];

  constructor(private isCoreReadiness: boolean = false) {
    super();
    this.resetGrade();
  }

  resetGrade() {
    super.resetGrade();

    this.exempt = false;
    this.reviewed = false;
    this.bugs = [];
    this.bugsUnder50 = [];
    this.bugsUnder80 = [];
    this.bugs80AndOver = [];
  }

  calculateGrade() {
    if(this.isCoreReadiness) {
      this.gradeColor = GradeColor.Gray;
      this.gradeValue = '7';
      this.gradeText = 'Not Applicable'
    } else if(this.exempt) {
      this.gradeColor = GradeColor.Gray;
      this.gradeValue = '6';
      this.gradeText = 'Not Applicable';
    } else {
      if(this.bugsUnder50.length || this.bugsUnder80.length > 3) {
        this.gradeColor = GradeColor.Red;
        this.gradeValue = '1';
        this.gradeText = 'Red';
      } else if(this.bugsUnder80.length || this.bugs80AndOver.length >= 9) {
        this.gradeColor = GradeColor.Yellow;
        this.gradeValue = '2';
        this.gradeText = 'Yellow';
      } else if(this.bugs80AndOver.length > 0 && this.bugs80AndOver.length < 9) {
        this.gradeColor = GradeColor.Green;
        this.gradeValue = '3';
        this.gradeText = 'Green';
      } else if(this.bugs.length > 0 && !this.reviewed) {
        this.gradeColor = GradeColor.Gray;
        this.gradeValue = '4';
        this.gradeText = 'Not Graded';
      } else {
        this.gradeColor = GradeColor.Green;
        this.gradeValue = '5'
        this.gradeText = 'Green';
      }
    }

    return this.gradeValue;
  }

  totals(): number {
    return this.isCoreReadiness || this.exempt ? 0 : this.bugsUnder50.length + this.bugsUnder80.length + this.bugs80AndOver.length;
  }

  ids(): number[] {
    return (this.isCoreReadiness || this.exempt)
      ? []
      : [...this.bugsUnder50, ...this.bugsUnder80, ...this.bugs80AndOver];
  }
}

export class CustomerFeedbackGradeDetail extends GradeDetail implements IGrade {
  highImpact: number[] = [];
  mediumImpact: number[] = [];

  constructor(private isCoreReadiness: boolean = false) {
    super();
    this.resetGrade();
  }

  resetGrade() {
    super.resetGrade();

    this.highImpact = [];
    this.mediumImpact = [];
  }

  calculateGrade() {
    if(this.highImpact.length) {
      this.gradeColor = GradeColor.Red;
      this.gradeValue = '1';
      this.gradeText = 'Red';
    } else if(this.mediumImpact.length) {
      this.gradeColor = GradeColor.Yellow;
      this.gradeValue = '2';
      this.gradeText = 'Yellow';
    } else {
      this.gradeColor = GradeColor.Green;
      this.gradeValue = '3';
      this.gradeText = 'Green';
    }

    return this.gradeValue;
  }

  totals(): number {
    return this.highImpact.length + this.mediumImpact.length;
  }

  ids(): number[] {
    return [...this.highImpact, ...this.mediumImpact];
  }
}

export class HighImpactBugsGradeDetail extends GradeDetail implements IGrade {
  allActive: number[];
  releaseCritical: number[];
  allCritical: number[];
  p0: number[];
  p1: number[];
  p2: number[];
  pOther: number[];

  constructor(private isCoreReadiness: boolean = false) {
    super();
    this.resetGrade();
  }

  resetGrade() {
    super.resetGrade();

    this.allActive = [];
    this.releaseCritical = [];
    this.allCritical = [];
    this.p0 = [];
    this.p1 = [];
    this.p2 = [];
    this.pOther = [];
  }

  calculateGrade() {
    if(this.releaseCritical.length || this.allCritical.length) {
      this.gradeColor = GradeColor.Red;
      this.gradeValue = '1';
      this.gradeText = 'Red';
    } else {
      this.gradeColor = GradeColor.Green;
      this.gradeValue = '2';
      this.gradeText = 'Green';
    }

    return this.gradeValue;
  }

  totals(): number {
    return this.allCritical.length;
  }

  ids(): number[] {
    return [...this.allCritical];
  }
}

export class MeasurableOutcomeMetGradeDetail extends GradeDetail implements IGrade {

  value: string = '';

  constructor(private isCoreReadiness: boolean = false) {
    super();
    this.resetGrade();
  }

  resetGrade() {
    super.resetGrade();

    this.value = '';
  }

  calculateGrade() {
    switch(this.value) {
      case 'Red':
        this.gradeColor = GradeColor.Red;
        this.gradeValue = '1';
        this.gradeText = 'Red';
        break;
      case 'Yellow':
        this.gradeColor = GradeColor.Yellow;
        this.gradeValue = '2';
        this.gradeText = 'Yellow';
        break;
      case 'Green':
        this.gradeColor = GradeColor.Green;
        this.gradeValue = '6';
        this.gradeText = 'Green';
        break;
      case 'Gray':
        this.gradeColor = GradeColor.Gray;
        this.gradeValue = '3';
        this.gradeText = 'Gray';
        break;
      case 'Not Graded':
        this.gradeColor = GradeColor.Gray;
        this.gradeValue = '4';
        this.gradeText = 'Not Graded';
        break;
      case 'Renew Grade':
        this.gradeColor = GradeColor.Gray;
        this.gradeValue = '5';
        this.gradeText = 'Renew Grade';
        break;
      default:
        this.gradeColor = GradeColor.None;
        this.gradeValue = '7';
        this.gradeText = '';
    }

    return this.gradeValue;
  }
}

export class RiskAssessmentGradeDetail extends GradeDetail implements IGrade {
  risk: string = '';

  constructor(private isCoreReadiness: boolean = false) {
    super();
    this.resetGrade();
  }

  resetGrade() {
    super.resetGrade();
  }

  calculateGrade() {
    this.gradeText = (this.risk || '').trim();

    if(this.isCoreReadiness) {
      // this.gradeColor = GradeColor.Gray
      this.gradeValue = '5';
      this.gradeText = this.gradeText
    }
    // } else {
      switch(this.gradeText) {
        case 'On Track':
          this.gradeColor = GradeColor.Green;
          this.gradeValue = '3';
          break;
        case 'At Risk':
          this.gradeColor = GradeColor.Yellow;
          this.gradeValue = '2';
          break;
        case 'Not On Track':
        case 'Off Track':
          this.gradeColor = GradeColor.Red;
          this.gradeValue = '1';
          break;
        default:
          this.gradeColor = GradeColor.Gray;
          this.gradeText = 'Not Graded';
          this.gradeValue = '4';
      }
    // }

    return this.gradeValue;
  }

  totals(): number {
    return this.isCoreReadiness
      ? 0
      : (this.gradeColor === GradeColor.Red || this.gradeColor === GradeColor.Yellow)
        ? 1
        : 0;
  }

  ids(): number[] {
    return [];
  }
}

export class ScenarioValidationGradeDetail extends GradeDetail implements IGrade {
  exempt: boolean = false;
  tbd: boolean = false;
  allActive: number[] = [];
  red: number[] = [];
  yellow: number[] = [];

  constructor(private isCoreReadiness: boolean = false) {
    super();
    this.resetGrade();
  }

  resetGrade() {
    super.resetGrade();

    this.exempt = false;
    this.tbd = false;
    this.allActive = [];
    this.red = [];
    this.yellow = [];
  }

  calculateGrade() {
    if(this.exempt) {
      this.gradeColor = GradeColor.Gray;
      this.gradeValue = '5'
      this.gradeText = 'Not Applicable';
    } else if (this.tbd) {
      this.gradeColor = GradeColor.Gray;
      this.gradeValue = '3'
      this.gradeText = 'Not Yet Graded';
    } else if(this.red.length) {
      this.gradeColor = GradeColor.Red;
      this.gradeValue = '1';
      this.gradeText = 'Red';
    } else if(this.yellow.length) {
      this.gradeColor = GradeColor.Yellow;
      this.gradeValue = '2';
      this.gradeText = 'Yellow';
    } else {
      this.gradeColor = GradeColor.Green;
      this.gradeValue = '4';
      this.gradeText = 'Green';
    }

    return this.gradeValue;
  }

  totals(): number {
    return (this.exempt)
      ? 0
      : this.red.length + this.yellow.length;
  }

  ids(): number[] {
    return (this.exempt)
      ? []
      : [...this.red, ...this.yellow];
  }
}

export class StateGradeDetail extends GradeDetail implements IGrade {
  state: string = '';

  constructor(private isCoreReadiness: boolean = false) {
    super();
    this.resetGrade();
  }

  resetGrade() {
    super.resetGrade();

    this.state = '';
  }

  calculateGrade() {
    this.gradeText = this.state.trim();

    if(this.isCoreReadiness) {
      this.gradeColor = GradeColor.Gray;
      this.gradeValue = '4';
      this.gradeText = 'Not Applicable'
    } else {
      switch(this.gradeText) {
        case 'Proposed':
          this.gradeColor = GradeColor.Red;
          this.gradeValue = '1';
          break;
        case 'Committed':
          this.gradeColor = GradeColor.Green;
          this.gradeValue = '3';
          break;
        default:
          this.gradeColor = GradeColor.Gray;
          this.gradeValue = '2';
      }
    }

    return this.gradeValue;
  }

  totals(): number {
    return this.isCoreReadiness
      ? 0
      : this.gradeColor === GradeColor.Red
        ? 1
        : 0;
  }

  ids(): number[] {
    return [];
  }
}

export class TelemetryGradeDetail extends GradeDetail implements IGrade {
  exempt: boolean = false;
  testNeeded: boolean = false;

  ctqInProgress: number[] = [];
  pass: number[] = [];
  fail: number[] = [];
  insufficientData: number[] = [];
  noData: number[] = [];

  constructor(private isCoreReadiness: boolean = false) {
    super();
    this.resetGrade();
  }

  resetGrade() {
    super.resetGrade();

    this.exempt = false;
    this.testNeeded = false;
    this.ctqInProgress = [];
    this.pass = [];
    this.fail = [];
    this.insufficientData = [];
    this.noData = [];
  }

  calculateGrade() {
    if(this.exempt) {
      this.gradeColor = GradeColor.Gray;
      this.gradeValue = '7';
      this.gradeText = 'RQV Not Required.';
    } else if(this.fail.length) {
      this.gradeColor = GradeColor.Red;
      this.gradeValue = '2';
      this.gradeText = 'Red';
    } else if(this.noData.length) {
      this.gradeColor = GradeColor.Yellow;
      this.gradeValue = '4';
      this.gradeText = 'Yellow';
    } else if(this.insufficientData.length) {
      this.gradeColor = GradeColor.Yellow;
      this.gradeValue = '5';
      this.gradeText = 'Yellow';
    } else if(this.ctqInProgress.length) {
      this.gradeColor = GradeColor.Yellow;
      this.gradeValue = '3';
      this.gradeText = 'RQVs in progress';
    } else if(this.pass.length) {
      this.gradeColor = GradeColor.Green;
      this.gradeValue = '6';
      this.gradeText = 'Green';
    } else {
      this.gradeColor = GradeColor.Red;
      this.gradeValue = '1';
      this.gradeText = 'no RQVs';
    }

    return this.gradeValue;
  }

  get noCtq(): boolean {
    return (this.ctqInProgress.length + this.pass.length + this.fail.length + this.insufficientData.length + this.noData.length) === 0;
  }

  totals(): number {
    return (this.exempt)
      ? 0
      : this.fail.length;
  }

  ids(): number[] {
    return (this.exempt)
      ? []
      : [...this.fail];
  }
}
