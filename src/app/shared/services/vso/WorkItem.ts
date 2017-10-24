export interface IWorkItem {
  id: number;
  workItemType: string;

  assignedTo?: string;
  availableDate?: Date;
  availableDateString?: string;
  blocking?: string;
  compliance?: string;
  confidence?: string;
  createdDate?: Date;
  createdDateString?: string;
  customString08?: string;
  customString09?: string;
  designOwner?: string;
  detectedDate?: Date;
  detectedDateString?: string;
  devDesignStatus?: string;
  devDesignUrl?: string;
  devOwner?: string;
  finishDate?: Date,
  finishDateString?: string,
  funcSpecStatus?: string;
  funcSpecUrl?: string;
  hotBug?: string;
  issueType?: string;
  iteration?: string;
  measureType?: string;
  nodeName?: string;
  originalEstimate?: number;
  pmOwner?: string;
  priority?: number;
  productFamily?: string;
  product?: string;
  qualityOwner?: string;
  qualityPlanUrl?: string;
  rank?: string;
  release?: string;
  releaseType?: string;
  remainingDays?: number;
  remainingDevDays?: number;
  resolution?: string;
  resolvedDate?: Date;
  resolvedDateString?: string;
  risk?: string;
  riskComment?: string;
  scenarioSpecStatus?: string;
  scenarioSpecUrl?: string;
  shortname?: string;
  showOnReport?: string;
  state?: string;
  startDate?: Date;
  startDateString?: string;
  tags?: string[];
  title?: string;
}

export class WorkItem implements IWorkItem {
  id: number;
  workItemType: string;

  assignedTo?: string;
  availableDate?: Date;
  availableDateString?: string;
  blocking?: string;
  compliance?: string;
  confidence?: string;
  createdDate?: Date;
  createdDateString?: string;
  customString08?: string;
  customString09?: string;
  designOwner?: string;
  detectedDate?: Date;
  detectedDateString?: string;
  devDesignStatus?: string;
  devDesignUrl?: string;
  devOwner?: string;
  finishDate?: Date;
  finishDateString?: string;
  funcSpecStatus?: string;
  funcSpecUrl?: string;
  hotBug?: string;
  issueType?: string;
  iteration?: string;
  measureType?: string;
  nodeName?: string;
  originalEstimate?: number;
  pmOwner?: string;
  priority?: number;
  productFamily?: string;
  product?: string;
  qualityOwner?: string;
  qualityPlanUrl?: string;
  rank?: string;
  release?: string;
  releaseType?: string;
  remainingDays?: number;
  remainingDevDays?: number;
  resolution?: string;
  resolvedDate?: Date;
  resolvedDateString?: string;
  risk?: string;
  riskComment?: string;
  scenarioSpecStatus?: string;
  scenarioSpecUrl?: string;
  shortname?: string;
  showOnReport?: string;
  state?: string;
  startDate?: Date;
  startDateString?: string;
  tags?: string[] = [];
  title?: string;

  constructor(init: IWorkItem) {
    Object.keys(init || {}).forEach(x => this[x] = init[x]);
  }
}
