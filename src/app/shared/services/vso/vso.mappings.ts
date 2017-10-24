class VsoStringMap {
  private _keys: string[] = [];
  private _values: string[] = [];

  areaPath: string;
  availableDate: string;
  assignedTo: string;
  blocking: string;
  compliance: string;
  createdDate: string;
  customString08: string;
  customString09: string;
  designOwner: string;
  detectedDate: string;
  devDesignStatus: string;
  devDesignUrl: string;
  devOwner: string;
  finishDate: string;
  funcSpecStatus: string;
  funcSpecUrl: string;
  hotBug: string;
  id: string;
  impactedBranch: string;
  issueSubType: string;
  issueType: string;
  iteration: string;
  linkType: string;
  measureType: string;
  nodeName: string;
  originalEstimate: string;
  pmOwner: string;
  priority: string;
  product: string;
  productFamily: string;
  qualityOwner: string;
  qualityPlanUrl: string;
  rank: string;
  release: string;
  releaseType: string;
  remainingDays: string;
  remainingDevDays: string;
  resolution: string;
  resolvedDate: string;
  risk: string;
  riskComment: string;
  scenarioSpecStatus: string;
  scenarioSpecUrl: string;
  shortname: string;
  showOnReport: string;
  state: string;
  startDate: string;
  substatus: string;
  tags: string;
  title: string;
  triage: string;
  workItemType: string;

  constructor(init: { key: string; value: string; }[]) {

    for (var i = 0; i < init.length; i++) {
      this[init[i].key] = init[i].value;
      this._keys.push(init[i].key);
      this._values.push(init[i].value);
    }
  }

  add(key: string, value: string) {
    this[key] = value;
    this._keys.push(key);
    this._values.push(value);
  }

  remove(key: string) {
    var index = this._keys.indexOf(key, 0);
    this._keys.splice(index, 1);
    this._values.splice(index, 1);

    delete this[key];
  }

  keys(): string[] {
    return this._keys;
  }

  values(): string[] {
    return this._values;
  }

  containsKey(key: string) {
    return (typeof this[key] !== "undefined");
  }

  keyOf(value: string): string {
    let index = this._values.indexOf(value, 0);

    return index >= 0
      ? this._keys[index]
      : null;
  }
}

export const vso = new VsoStringMap([
  { key: 'areaPath', value: 'System.AreaPath' },
  { key: 'assignedTo', value: 'System.AssignedTo' },
  { key: 'availableDate', value: 'OSG.AvailableDate' },
  { key: 'blocking', value: 'Microsoft.VSTS.Common.Blocking' },
  { key: 'compliance', value: 'OSG.Tenets.ComplianceAssessmentState' },
  { key: 'createdDate', value: 'System.CreatedDate' },
  { key: 'customString08', value: 'Microsoft.VSTS.Common.CustomString08' },
  { key: 'customString09', value: 'Microsoft.VSTS.Common.CustomString09' },
  { key: 'designOwner', value: 'Microsoft.VSTS.Common.QGDesignOwner' },
  { key: 'detectedDate', value: 'OSG.DetectedDate' },
  { key: 'devDesignStatus', value: 'OSG.DevDesignStatus' },
  { key: 'devDesignUrl', value: 'OSG.DevDesignURL' },
  { key: 'devOwner', value: 'OSG.DevOwner' },
  { key: 'finishDate', value: 'Microsoft.VSTS.Scheduling.FinishDate' },
  { key: 'funcSpecStatus', value: 'OSG.FuncSpecStatus' },
  { key: 'funcSpecUrl', value: 'OSG.FuncSpecURL' },
  { key: 'hotBug', value: 'OSG.HotBug' },
  { key: 'id', value: 'System.Id' },
  { key: 'impactedBranch', value: 'OSG.ImpactedBranch' },
  { key: 'issueSubType', value: 'OSG.IssueSubType' },
  { key: 'issueType', value: 'OSG.IssueType' },
  { key: 'iteration', value: 'System.IterationPath' },
  { key: 'linkType', value: 'System.Links.LinkType' },
  { key: 'measureType', value: 'OSG.Measure.MeasureType' },
  { key: 'nodeName', value: 'System.NodeName' },

  { key: 'originalEstimate', value: 'Microsoft.VSTS.Scheduling.OriginalEstimate' },
  { key: 'pmOwner', value: 'OSG.PMOwner' },
  { key: 'priority', value: 'Microsoft.VSTS.Common.Priority' },
  { key: 'product', value: 'OSG.Product' },
  { key: 'productFamily', value: 'OSG.ProductFamily' },
  { key: 'qualityOwner', value: 'OSG.QualityOwner' },
  { key: 'qualityPlanUrl', value: 'OSG.QualityPlanURL' },
  { key: 'rank', value: 'OSG.Rank' },
  { key: 'release', value: 'Microsoft.VSTS.Common.Release' },
  { key: 'releaseType', value: 'Microsoft.VSTS.Common.ReleaseType' },

  { key: 'remainingDays', value: 'OSG.RemainingDays' },
  { key: 'remainingDevDays', value: 'OSG.RemainingDevDays' },
  { key: 'resolution', value: 'Microsoft.VSTS.Common.ResolvedReason' },
  { key: 'resolvedDate', value: 'Microsoft.VSTS.Common.ResolvedDate' },
  { key: 'risk', value: 'OSG.RiskAssessment' },
  { key: 'riskComment', value: 'OSG.RiskAssessmentComment' },
  { key: 'scenarioSpecStatus', value: 'OSG.ScenarioSpecStatus' },
  { key: 'scenarioSpecUrl', value: 'OSG.ScenarioSpecURL' },
  { key: 'shortname', value: 'Microsoft.VSTS.Common.CustomString08' },
  { key: 'showOnReport', value: 'OSG.ShowOnReport' },

  { key: 'state', value: 'System.State' },
  { key: 'startDate', value: 'Microsoft.VSTS.Scheduling.StartDate' },
  { key: 'substatus', value: 'OSG.Substatus' },
  { key: 'tags', value: 'System.Tags' },
  { key: 'title', value: 'System.Title' },
  { key: 'triage', value: 'Microsoft.VSTS.Common.Triage' },
  { key: 'workItemType', value: 'System.WorkItemType' },

]);
