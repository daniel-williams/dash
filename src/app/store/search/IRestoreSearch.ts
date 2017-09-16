import { SelectOption } from '../../shared/types';

export interface IRestoreSearch {
  areaPaths?: string[];
  release?: SelectOption;
  promise?: SelectOption;
  iterationPath?: SelectOption;
  pmGroupLead?: SelectOption;
  devGroupLead?: SelectOption;
  dnaGroupLead?: SelectOption;
  designGroupLead?: SelectOption;
}
