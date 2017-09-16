import { IWorkItem } from '../../../shared/services/vso'


export interface IProblemRecord extends IWorkItem {
  detectedDate?: Date;
  finishDate?: Date;
  resolvedDate?: Date;
  startDate?: Date;

  timeToDetect?: number;
  timeToResolve?: number;
  timeToComplete?: number;
}

export enum DatasetType {
  vso = <any>'vso',
  mocked = <any>'mocked',
}

export enum ScaleType {
  daily = <any>'daily',
  monthly = <any>'monthly',
  quarterly = <any>'quarterly',
}

export enum GroupType {
  start = <any>'start',
  resolved = <any>'resolved',
}

export class DateRange {
  startDate: Date = null;
  endDate: Date = null;
}

export interface IMean {
  count: number,
  total: number
}

export interface IChartRangeData {
  timeToComplete: IMean;
  timeToDetect: IMean;
  timeToResolve: IMean;
}

export interface IChartRange {
  data?: IChartRangeData
  endDate?: Date;
  label?: string;
  startDate?: Date;
}

export class ChartRange implements IChartRange {
  public data = {
    timeToDetect: {
      count: 0,
      total: 0
    },
    timeToResolve: {
      count: 0,
      total: 0
    },
    timeToComplete: {
      count: 0,
      total: 0
    }
  }
  public endDate: Date;
  public label: string;
  public startDate: Date;

  constructor(options?: IChartRange) {
    Object.keys(options || {}).forEach(x => this[x] = options[x]);
  }

  getCountByIndex(index: number): number {
    switch(index) {
      case 0:
        return this.data.timeToDetect.count;
      case 1:
        return this.data.timeToResolve.count;
      case 2:
        return this.data.timeToComplete.count;
      default:
        return 0;
    }
  }
}

export const ONE_DAY = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
export const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const rcaData = {
  labels: [] as string[],
  datasets: [] as any[],
};