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

export const titleColumnSchema = new ColumnSchema({
  key: 'title',
  title: 'Title',
  presenter: PresenterType.CollapsibleText,
  headerClass: 'gray',
});

// export const stateColumnSchema = new ColumnSchema({
//   key: 'state',
//   title: 'State',
//   headerClass: 'gray'
// });

export const subStatusColumnSchema = new ColumnSchema({
  key: 'substatus',
  title: 'Substatus',
  headerClass: 'gray'
});

export const priorityColumnSchema = new ColumnSchema({
  key: 'priority',
  title: 'Priority',
  sorter: SortType.Number,
  headerClass: 'gray',
});

export const availableDateColumnSchema = new ColumnSchema({
  key: 'availableDateString',
  title: 'Available',
  headerClass: 'gray',
});

export const iterationPathColumnSchema = new ColumnSchema({
  key: 'iteration',
  title: 'Iteration Path',
  headerClass: 'gray',
});

export const releaseColumnSchema = new ColumnSchema({
  key: 'release',
  title: 'Release',
  headerClass: 'gray',
});

export const nodeNameColumnSchema = new ColumnSchema({
  key: 'nodeName',
  title: 'Node Name',
  headerClass: 'gray',
});

export const customString09ColumnSchema = new ColumnSchema({
  key: 'customString09',
  title: 'Comment',
  headerClass: 'gray',
});


export const columnSchemas: ColumnSchema[] = [
  idColumnSchema,
  titleColumnSchema,
  subStatusColumnSchema,
  priorityColumnSchema,
  availableDateColumnSchema,
  iterationPathColumnSchema,
  releaseColumnSchema,
  nodeNameColumnSchema,
  customString09ColumnSchema,
];
