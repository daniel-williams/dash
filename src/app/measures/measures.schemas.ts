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

export const priorityColumnSchema = new ColumnSchema({
  key: 'priority',
  title: 'Priority',
  sorter: SortType.Number,
  headerClass: 'gray',
});

export const rankColumnSchema = new ColumnSchema({
  key: 'rank',
  title: 'Rank',
  sorter: SortType.Number,
  headerClass: 'gray',
});

export const typeColumnSchema = new ColumnSchema({
  key: 'measureType',
  title: 'Type',
  headerClass: 'gray',
});

export const titleColumnSchema = new ColumnSchema({
  key: 'title',
  title: 'Title',
  presenter: PresenterType.CollapsibleText,
  headerClass: 'gray',
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

export const stateColumnSchema = new ColumnSchema({
  key: 'state',
  title: 'State',
  presenter: PresenterType.PlanningState,
  sorter: SortType.State,
  headerClass: 'gray'
});

export const assignedToColumnSchema = new ColumnSchema({
  key: 'assignedTo',
  title: 'Assigned To',
  presenter: PresenterType.Assigned,
  headerClass: 'gray'
});


export const columnSchemas: ColumnSchema[] = [
  idColumnSchema,
  priorityColumnSchema,
  rankColumnSchema,
  typeColumnSchema,
  titleColumnSchema,
  iterationColumnSchema,
  availableDateColumnSchema,
  stateColumnSchema,
  assignedToColumnSchema,
];
