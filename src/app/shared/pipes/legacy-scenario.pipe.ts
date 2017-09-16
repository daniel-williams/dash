import { Pipe, PipeTransform } from '@angular/core';

import { IWorkItem } from '../services/vso';

@Pipe({
  name: 'legacyScenario'
})
export class LegacyScenarioPipe {
  transform(list: Array<IWorkItem>, showLegacyCore: boolean = true): Array<IWorkItem> {
    if(showLegacyCore) { return list; }

    let legacyTag = 'EDGE_CORE_SCENARIO_READINESS'.toLowerCase();
    return list.filter(item => item.tags.includes(legacyTag));
  }
}
