import { Pipe, PipeTransform } from '@angular/core';

import { IMultiSelectOption } from './multi-select-dropdown.types';

@Pipe({
  name: 'searchFilter'
})
export class MultiSelectSearchFilter implements PipeTransform {
  transform(options: Array<IMultiSelectOption>, args: string): Array<IMultiSelectOption> {
    const matchPredicate = (option: IMultiSelectOption) => option.name.toLowerCase().indexOf((args || '').toLowerCase()) > -1;
    const getChildren = (option: IMultiSelectOption) => options.filter(child => child.parentId === option.id);
    const getParent = (option: IMultiSelectOption) => options.find(parent => option.parentId === parent.id);

    return options.filter((option: IMultiSelectOption) => {
      return matchPredicate(option) ||
        (typeof (option.parentId) === 'undefined' && getChildren(option).some(matchPredicate)) ||
        (typeof (option.parentId) !== 'undefined' && matchPredicate(getParent(option)));
    });
  }
}