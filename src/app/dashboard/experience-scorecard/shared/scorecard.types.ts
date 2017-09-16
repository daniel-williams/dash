const videoBaseUrl: string = '/content/videos/exp-scorecard/UserTesting-';

export class ParticipantFeatureResponse {
  public id: string;
  public username: string;

  public experience: string;
  public feature: string;
  public dimensions: {
    Feedback?: string;
    Desirable?: string;
    Findable?: number;
    Useful?: number;
    Usable?: number;
    Predictable?: number;
    Satisfaction?: number;
    Ease?: number;
  };
  public averageScore: number;
  public videoUrl: string;
  public videoOffset: number;
  public videoDuration: number;

  constructor(
    id: string,
    username: string,
    experience: string,
    feature: string) {

    this.id = id;
    this.username = username;
    this.experience = experience;
    this.feature = feature;
    this.dimensions = {};
    this.videoUrl = videoBaseUrl + id + '.mp4';
  }
}

export class BrowserScore {
  private _experienceScores: ExperienceScore[];

  public title: string;
  public version?: string;
  public iconPath?: string;
  public imagePath?: string;

  constructor(title: string) {
    this.title = title;
    this._experienceScores = [];
  }

  get hasScore(): boolean {
    return !!this.scoreCount;
  }

  get totalScore(): number {
    if(!this._experienceScores.length) { return 0; }

    return this._experienceScores.reduce((totalScore, item) => {
      totalScore += item.totalScore;

      return totalScore;
    }, 0);
  }

  get scoreCount(): number {
    return this._experienceScores.reduce((count, item) => {
      count += item.scoreCount;

      return count;
    }, 0);
  }

  get averageScore(): number {
    if(!this.scoreCount) { return 0; }

    return this.formatScore(this.totalScore / this.scoreCount);
  }

  addExperienceScore(item: ExperienceScore) {
    this._experienceScores.push(item);
  }

  findExperienceScore(feature: string): ExperienceScore {
    return this._experienceScores.find(x => x.title === feature);
  }

  orderExperiences(names: string[]) {
    let orderExperienceScores: ExperienceScore[] = [];

    names.forEach((name: any) => {
      let es = this._experienceScores.find(es => es.title === name);

      if(es) {
        orderExperienceScores.push(es);
      }
    });

    this._experienceScores = orderExperienceScores;
  }

  get experienceScores(): ExperienceScore[] {
    return this._experienceScores;
  }

  private formatScore(score: number): number {
    return (Math.round(score * 10) / 10);
  }
}

export class ExperienceScore {
  private _featureScores: FeatureScore[];

  public title: string;
  public description: string;
  public scoreDelta: number;
  public insights: string[];

  constructor(title: string, description: string, insights: string[] = []) {
    this.title = title;
    this.description = description;
    this.insights = insights;
    this._featureScores = [];
  }

  get hasScore(): boolean {
    return !!this.scoreCount;
  }

  get totalScore(): number {
    if(!this._featureScores.length) { return 0; }

    return this._featureScores.reduce((totalScore, item) => {
      totalScore += item.totalScore;

      return totalScore;
    }, 0);
  }

  get scoreCount(): number {
    return this._featureScores.reduce((count, item) => {
      count += item.scoreCount;

      return count;
    }, 0);
  }

  get averageScore(): number {
    if(!this.scoreCount) { return 0; }

    return this.formatScore(this.totalScore / this.scoreCount);
  }

  addDimensionScore(item: FeatureScore) {
    this._featureScores.push(item);
  }

  findDimensionScore(feature: string): FeatureScore {
    return this._featureScores.find(x => x.title === feature);
  }

  get featureScores(): FeatureScore[] {
    return this._featureScores;
  }

  private formatScore(score: number): number {
    return (Math.round(score * 10) / 10);
  }
}

export class FeatureScore {
  private _dimensionScores: DimensionScore[];

  public title: string;
  public description: string;
  public scoreDelta: number;

  constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
    this._dimensionScores = [];
  }

  get hasScore(): boolean {
    return !!this.scoreCount;
  }

  get totalScore(): number {
    if(!this._dimensionScores.length) { return 0; }

    return this._dimensionScores.reduce((totalScore, item) => {
      totalScore += item.totalScore;

      return totalScore;
    }, 0);
  }

  get scoreCount(): number {
    return this._dimensionScores.reduce((count, item) => {
      count += item.scoreCount;

      return count;
    }, 0);
  }

  get averageScore(): number {
    if(!this.scoreCount) { return 0; }

    return this.formatScore(this.totalScore / this.scoreCount);
  }

  addDimensionScore(item: DimensionScore) {
    this._dimensionScores.push(item);
  }

  findDimensionScore(dimension: string): DimensionScore {
    return this._dimensionScores.find(x => x.title === dimension);
  }

  get dimensionScores(): DimensionScore[] {
    return this._dimensionScores;
  }

  private formatScore(score: number): number {
    return (Math.round(score * 10) / 10);
  }
}

export class DimensionScore {
  public title: string;

  private _scores: number[];
  public wordCount?: WordCount;
  public feedback: string[] = [];

  public maybeCount = 0;
  public yesCount = 0;
  public noCount = 0;

  public scoreDelta: number;

  constructor(title: string) {
    this.title = title;
    this._scores = [];
  }

  get hasScore(): boolean {
    return !!this.scoreCount;
  }

  get totalScore(): number {
    if(!this._scores.length) { return 0; }

    return this._scores.reduce((totalScore, score) => {
      totalScore += score;

      return totalScore;
    }, 0);
  }

  get scoreCount(): number {
    return this._scores.length;
  }

  get averageScore(): number {
    if(!this.scoreCount) { return 0; }

    return this.formatScore(this.totalScore / this.scoreCount);
  }

  public wasCompleted(outcome: number) {
    switch(outcome) {
      case 1:
        this.yesCount++;
        break;
      case -1:
        this.noCount++;
        break;
      case 0:
        this.maybeCount++;
        break;
    }
  }

  public addScore(score: number) {
    this._scores.push(score);
  }

  private formatScore(score: number): number {
    return (Math.round(score * 10) / 10);
  }
}

export class WordCount {
  [key: string]: number;
}

export interface StudyTask {
  id: string;
  type: TaskType;
  subtype: null | TaskSubtype;
  description: string[];
  dimension: null | string;
  experience: null | string;
  feature: null | string;
}

export enum TaskType {
  instruction = <any>'instruction',
  question = <any>'question',
}

export enum TaskSubtype {
  none = <any>'none',
  yesNoMaybe = <any>'yesNoMaybe',
  timeOnTask = <any>'timeOnTask',
  agreementScale = <any>'agreementScale',
  wordAssociation = <any>'wordAssociation',
  satisfactionScale = <any>'satisfactionScale',
  written = <any>'written',
}
