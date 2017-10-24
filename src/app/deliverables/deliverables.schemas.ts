import {
  ColumnSchema,
  PresenterType,
  EditorType,
  SortType,
} from '../shared/saga-grid';


export const idColumnSchema = new ColumnSchema({
  key: 'id',
  title: 'ID',
  presenter: PresenterType.WorkitemLink,
  sorter: SortType.Number,
  headerClass: 'gray',
});

export const rankColumnSchema = new ColumnSchema({
  key: 'rank',
  title: 'Rank',
  sorter: SortType.Number,
  headerClass: 'gray',
});

export const shortnameColumnSchema = new ColumnSchema({
  key: 'shortname',
  title: 'Short Name',
  headerClass: 'gray',
});

export const titleColumnSchema = new ColumnSchema({
  key: 'title',
  title: 'Title',
  presenter: PresenterType.CollapsibleText,
  headerClass: 'gray',
});

export const devOwnerColumnSchema = new ColumnSchema({
  key: 'devOwner',
  title: 'Dev Owner',
  presenter: PresenterType.Assigned,
  headerClass: 'gray'
});

export const stateColumnSchema = new ColumnSchema({
  key: 'state',
  title: 'State',
  presenter: PresenterType.PlanningState,
  sorter: SortType.State,
  headerClass: 'gray'
});

export const releaseColumnSchema = new ColumnSchema({
  key: 'release',
  title: 'Release',
  headerClass: 'gray'
});

export const iterationColumnSchema = new ColumnSchema({
  key: 'iteration',
  title: 'Iteration',
  headerClass: 'gray'
});

export const availableDateColumnSchema = new ColumnSchema({
  key: 'availableDateString',
  title: 'Available',
  headerClass: 'gray'
});

export const originalEstimateColumnSchema = new ColumnSchema({
  key: 'originalEstimate',
  title: 'Original Estimate',
  headerClass: 'gray'
});

export const remainingDevDaysColumnSchema = new ColumnSchema({
  key: 'remainingDevDays',
  title: 'Remaining Days',
  headerClass: 'gray'
});

export const riskColumnSchema = new ColumnSchema({
  key: 'risk',
  title: 'Risk',
  presenter: PresenterType.PlanningRisk,
  sorter: SortType.Risk,
  headerClass: 'gray'
});

export const riskCommentColumnSchema = new ColumnSchema({
  key: 'riskComment',
  title: 'Risk Comment',
  presenter: PresenterType.CollapsibleText,
  headerClass: 'gray'
});

export const complianceColumnSchema = new ColumnSchema({
  key: 'compliance',
  title: 'Compliance',
  presenter: PresenterType.PlanningCompliance,
  headerClass: 'gray'
});

export const funcSpecColumnSchema = new ColumnSchema({
  key: 'funcSpecStatus',
  title: 'Func Spec',
  presenter: PresenterType.PlanningFuncSpec,
  headerClass: 'gray'
});

export const devDesignColumnSchema = new ColumnSchema({
  key: 'devDesignStatus',
  title: 'Dev Design',
  presenter: PresenterType.PlanningDevDesign,
  headerClass: 'gray'
});

export const pmOwnerColumnSchema = new ColumnSchema({
  key: 'pmOwner',
  title: 'PM',
  presenter: PresenterType.Assigned,
  headerClass: 'gray'
});

export const qualityOwnerColumnSchema = new ColumnSchema({
  key: 'qualityOwner',
  title: 'DNA',
  presenter: PresenterType.Assigned,
  headerClass: 'gray'
});



export const columnSchemas: ColumnSchema[] = [
  idColumnSchema,
  rankColumnSchema,
  shortnameColumnSchema,
  titleColumnSchema,
  devOwnerColumnSchema,
  stateColumnSchema,
  releaseColumnSchema,
  iterationColumnSchema,
  availableDateColumnSchema,
  originalEstimateColumnSchema,
  remainingDevDaysColumnSchema,
  riskColumnSchema,
  riskCommentColumnSchema,
  complianceColumnSchema,
  funcSpecColumnSchema,
  devDesignColumnSchema,
  pmOwnerColumnSchema,
  qualityOwnerColumnSchema,
];