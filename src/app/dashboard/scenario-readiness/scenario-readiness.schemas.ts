import {
  ColumnSchema,
  PresenterType,
  EditorType,
  SortType,
} from '../shared/saga-grid';



export const shortnameColumnSchema = new ColumnSchema({
  key: 'shortname',
  title: 'Short Name',
  headerClass: 'gray',
});

export const followUpColumnSchema = new ColumnSchema({
  key: 'comments',
  title: 'Follow Up',
  editor: EditorType.TextArea,
  headerClass: 'gray',
  bodyClass: 'calc',
  visible: false
});

export const overallGradeColumnSchema = new ColumnSchema({
  key: 'overallGrade',
  title: 'Overall Grade',
  presenter: PresenterType.OverallGrade,
  sorter: SortType.Number,
  headerClass: 'blue',
  bodyClass: 'calc',
  visible: false
});

export const stateColumnSchema = new ColumnSchema({
  key: 'stateValue',
  title: 'State',
  presenter: PresenterType.State,
  headerClass: 'blue',
  bodyClass: 'calc',
  visible: false
});

export const measurableOutcomeMetColumnSchema = new ColumnSchema({
  key: 'measurableOutcomeMet',
  title: 'Measurable Outcome Met',
  presenter: PresenterType.ColorBox,
  editor: EditorType.Option,
  headerClass: 'blue',
  bodyClass: 'calc',
  visible: false
});

export const scenarioValidationColumnSchema = new ColumnSchema({
  key: 'scenarioValidation',
  title: 'Scenario Validation',
  presenter: PresenterType.ScenarioValidation,
  headerClass: 'blue',
  bodyClass: 'calc'
});

export const completenessColumnSchema = new ColumnSchema({
  key: 'completeness',
  title: 'Completeness',
  presenter: PresenterType.Completeness,
  editor: EditorType.Option,
  headerClass: 'blue',
  bodyClass: 'calc'
});

export const highImpactBugsColumnSchema = new ColumnSchema({
  key: 'highImpactBugs',
  title: 'High Impact Bugs',
  presenter: PresenterType.HighImpactBugs,
  headerClass: 'blue',
  bodyClass: 'calc'
});

export const telemetryColumnSchema = new ColumnSchema({
  key: 'telemetry',
  title: 'Telemetry (RQV only)',
  presenter: PresenterType.Telemetry,
  headerClass: 'blue',
  bodyClass: 'calc'
});

export const testCoverageExistsColumnSchema = new ColumnSchema({
  key: 'testCoverageExists',
  title: 'Test Coverage',
  presenter: PresenterType.ColorBox,
  editor: EditorType.Option,
  headerClass: 'blue',
  bodyClass: 'calc',
  visible: false
});

export const customerFeedbackColumnSchema = new ColumnSchema({
  key: 'customerFeedback',
  title: 'Customer Feedback',
  presenter: PresenterType.CustomerFeedback,
  headerClass: 'blue',
  bodyClass: 'calc'
});

export const accessibilityColumnSchema = new ColumnSchema({
  key: 'accessibility',
  title: 'Accessibility',
  presenter: PresenterType.Accessibility,
  headerClass: 'blue',
  bodyClass: 'calc'
});

export const craftsmanshipColumnSchema = new ColumnSchema({
  key: 'craftsmanship',
  title: 'Craftsmanship',
  presenter: PresenterType.Craftsmanship,
  headerClass: 'blue',
  bodyClass: 'calc'
});

export const riskAssessmentColumnSchema = new ColumnSchema({
  key: 'riskAssessment',
  title: 'Risk Assessment',
  presenter: PresenterType.RiskAssessment,
  headerClass: 'blue',
  bodyClass: 'calc'
});

export const riskCommentColumnSchema = new ColumnSchema({
  key: 'riskComment',
  title: 'Risk Comment',
  presenter: PresenterType.CollapsibleText,
  headerClass: 'gray',
});

export const shortname2ColumnSchema = new ColumnSchema({
  key: 'shortname2',
  title: 'Short Name',
  headerClass: 'gray',
  isCollapsible: true,
  visible: false,
});

export const pmOwnerColumnSchema = new ColumnSchema({
  key: 'pmOwner',
  title: 'PM',
  presenter: PresenterType.Assigned,
  headerClass: 'gray',
  visible: false
});

export const qualityOwnerColumnSchema = new ColumnSchema({
  key: 'qualityOwner',
  title: 'DNA',
  presenter: PresenterType.Assigned,
  headerClass: 'gray',
  visible: false
});

export const releaseColumnSchema = new ColumnSchema({
  key: 'release',
  title: 'Release',
  headerClass: 'gray',
  visible: false,
});

export const titleColumnSchema = new ColumnSchema({
  key: 'title',
  title: 'Title',
  presenter: PresenterType.CollapsibleText,
  headerClass: 'gray',
  visible: false
});

export const idColumnSchema = new ColumnSchema({
  key: 'id',
  title: 'ID',
  presenter: PresenterType.WorkitemLink,
  headerClass: 'gray',
});

export const columnSchemas: ColumnSchema[] = [
  shortnameColumnSchema,
  followUpColumnSchema,
  overallGradeColumnSchema,
  stateColumnSchema,
  measurableOutcomeMetColumnSchema,
  scenarioValidationColumnSchema,
  completenessColumnSchema,
  highImpactBugsColumnSchema,
  telemetryColumnSchema,
  testCoverageExistsColumnSchema,
  customerFeedbackColumnSchema,
  accessibilityColumnSchema,
  craftsmanshipColumnSchema,
  riskAssessmentColumnSchema,
  riskCommentColumnSchema,
  shortname2ColumnSchema,
  pmOwnerColumnSchema,
  qualityOwnerColumnSchema,
  releaseColumnSchema,
  titleColumnSchema,
  idColumnSchema,
];
