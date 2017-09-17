import { SortType } from './SortType';
import { EditorType } from './EditorType';
import { PresenterType } from './PresenterType';

export interface IColumnSchemaOptions {
  key: string;
  title?: string; // table column header
  presenter?: PresenterType;
  editor?: EditorType;
  sorter?: SortType;
  visible?: boolean;
  isCollapsible?: boolean; // can the column be hidden
  headerClass?: string;
  bodyClass?: string;
}

const DEFAULT_OPTIONS = {
  presenter: PresenterType.Text,
  editor: EditorType.None,
  sorter: SortType.Alpha,
  visible: true,
  isCollapsible: true,
  headerClass: '',
  bodyClass: ''
};

export class ColumnSchema {
  key: string;
  title: string;
  presenter: PresenterType;
  editor: EditorType;
  sorter: SortType;
  visible: boolean;
  isCollapsible: boolean;
  headerClass: string;
  bodyClass: string;

  constructor(options: IColumnSchemaOptions) {
    let opt = Object.assign({}, DEFAULT_OPTIONS, options);

    this.key = opt.key;
    this.title = opt.title || opt.key;
    this.presenter = opt.presenter;
    this.editor = opt.editor;
    this.sorter = opt.sorter;
    this.visible = opt.visible;
    this.isCollapsible = opt.isCollapsible;
    this.headerClass = (opt.headerClass + ' cell-header').trim();
    this.bodyClass = (opt.bodyClass + ' cell-body').trim();
  }
}
