import {
  IWorkItem,
  WorkItem } from './WorkItem';

class Related {
  constructor(
    public deliverables: WorkItem[] = [],
    public measures: WorkItem[] = [],
    public consumingFrom: WorkItem[] = [],
    public bugs: WorkItem[] = []) { }
}

class RelatedMap {
  parents: { [key: string]: WorkItemRelations } = {}; // related to
  relatedIds: number[] = []; // every related item
  comsumingFromIds: number[] = []; // assumed consumingFrom if relation.rel is null
  related: { [key: string]: number[] } = {}; // hash relating child to parents (one-to-many)

  addRelation(relation: any) {
    if(!!relation.source) {
      this.addRelationship(relation.source.id, relation.target.id);
    }
    
    if(relation.rel === 'OSG.ProducingFor-Reverse') {
      this.comsumingFromIds.push(relation.target.id);
    }
  }

  addRelationship(parentId: number, relatedId: number) {
    this.relatedIds.push(relatedId);

    // Ensure keys are initialized
    this.related[relatedId] = this.related[relatedId] || [];
    this.parents[parentId] = this.parents[parentId] || new WorkItemRelations();

    this.related[relatedId].push(parentId);
  }
}

class WorkItemRelations {
  deliverables: WorkItem[] = [];
  measures: WorkItem[] = [];
  bugs: WorkItem[] = [];
  consumingFrom: WorkItem[] = [];

  measurableOutcomeMet: string; // TODO djw: do not like these here
  comments: string;
}

class ScenarioWorkItem extends WorkItem {

  // non-vso props
  deliverables: WorkItem[] = [];
  dsort: Sort = new Sort('iteration', true);

  measures: WorkItem[] = [];
  msort: Sort = new Sort('iteration', true);

  consumingFrom: WorkItem[] = [];
  psort: Sort = new Sort('iteration', true);

  bugs: WorkItem[] = [];
  bsort: Sort = new Sort('iteration', true);

  constructor(workItem: WorkItem) {
    super(workItem);
  }
}

class Sort {
  constructor(public sortOn: string, public asc: boolean) {
    this.sortOn = sortOn || '';
    this.asc = asc || true;
  }
}

enum VsoLinkType {
  hierarchyForward = <any>'System.LinkTypes.Hierarchy-Forward', // link type
  related = <any>'System.LinkTypes.Related', // link type
  child = <any>'System.LinkTypes.Child', // link type
  parent = <any>'System.LinkTypes.Parent', // link type
}

enum VsoTags {
  // tag comparisons will assume lower case
  accessibilityExempt = <any>'edge_readiness_accessibility-na',
  craftsmanshipExempt = <any>'edge_readiness_craftsmanship_na',
  craftsmanshipReviewed = <any>'craftsmanshipreviewed',
  craftsmanshipRejected = <any>'craftsmanshiprejected',
  telemetryExemptExist = <any>'ctq_testcvg_exist',
  telemetryExemptNeeded = <any>'ctq_testcvg_needed',

  criticalBug = <any>'edge_crit',
  edgeApproved = <any>'edgeapproved',
  edgeRelRed = <any>'edgerel_red',

  scenarioValidationExempt = <any>'scenario_validation_na',
  scenarioValidationRed = <any>'scenario_validation_red',
  scenarioValidationYellow = <any>'scenario_validation_yellow',
  scenarioValidationTbd = <any>'scenario_validation_tbd',

  accSelfRed = <any>'accselfred',
  accSelfYellow = <any>'accselfyellow',
  accSelfLime = <any>'accselflime',
  craftsman = <any>'craftsman',

  wontFix = <any>`won't fix`,
  duplicate = <any>'duplicate',
  external = <any>'external',

  rs2Readiness = <any>'edge_rs2_readiness',
  rs3Readiness = <any>'edge_rs3_readiness',
  rs4Readiness = <any>'edge_rs4_readiness',
  rs5Readiness = <any>'edge_rs5_readiness',
  coreReadiness = <any>'edge_core_scenario_readiness',

  customerFeedbackRed = <any>'feedback_red',
  customerFeedbackYellow = <any>'feedback_yellow'
}

enum VsoWortItemType {
  Promise = <any>'Customer Promise',
  Scenario = <any>'Scenario',
  Deliverable = <any>'Deliverable',
  Task = <any>'Task',
  Measure = <any>'Measure',
  Bug = <any>'Bug',
  ProblemRecord = <any>'Problem Record',
}

export {
  IWorkItem,
  Related,
  RelatedMap,
  ScenarioWorkItem,
  Sort,
  VsoTags,
  VsoWortItemType,
  VsoLinkType,
  WorkItem,
  WorkItemRelations,
}
