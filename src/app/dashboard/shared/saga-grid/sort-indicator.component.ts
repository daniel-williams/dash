import { Component, Input, SimpleChanges } from '@angular/core';

import { GridData, IColumnSort, ISortInfo } from './types';

@Component({
  selector: 'sort-indicator',
  templateUrl: './sort-indicator.component.html',
  styleUrls: ['./sort-indicator.component.scss']
})
export class SortIndicator {
  @Input ('sortOrder') order: number = 0;
  @Input ('sortAsc') asc: boolean = true;
}