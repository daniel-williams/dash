
export interface ISearchCriteria {
  areaPaths?: string[];
  release?: string;
  promise?: string;
  iterationPath?: string;
  pmGroupLead?: string;
  devGroupLead?: string;
  dnaGroupLead?: string;
  designGroupLead?: string;
}

export class SearchControlMask implements ISearchControls {
  areaPath: boolean = true;
  release: boolean = true;
  promise: boolean = true;
  iteration: boolean = true;
  pmGroupLead: boolean = true;
  devGroupLead: boolean = true;
  dnaGroupLead: boolean = true;
  designGroupLead: boolean = true;

  constructor(options?: ISearchControls) {
    if(options) {
      this.areaPath = (typeof options.areaPath === 'boolean') ? options.areaPath : this.areaPath;
      this.release = (typeof options.release === 'boolean') ? options.release : this.release;
      this.promise = (typeof options.promise === 'boolean') ? options.promise : this.promise;
      this.iteration = (typeof options.iteration === 'boolean') ? options.iteration : this.iteration;
      this.pmGroupLead = (typeof options.pmGroupLead === 'boolean') ? options.pmGroupLead : this.pmGroupLead;
      this.devGroupLead = (typeof options.devGroupLead === 'boolean') ? options.devGroupLead : this.devGroupLead;
      this.dnaGroupLead = (typeof options.dnaGroupLead === 'boolean') ? options.dnaGroupLead : this.dnaGroupLead;
      this.designGroupLead = (typeof options.designGroupLead === 'boolean') ? options.designGroupLead : this.designGroupLead;
    }
  }
}

export interface ISearchControls {
  areaPath?: boolean;
  release?: boolean;
  promise?: boolean;
  iteration?: boolean;
  pmGroupLead?: boolean;
  devGroupLead?: boolean;
  dnaGroupLead?: boolean;
  designGroupLead?: boolean;
}

export class SelectOption {
  value: string;
  display: string;
  isSelected: boolean;

  constructor(value: string, display?: string, isSelected: boolean = false) {
    this.value = value;
    this.display = display || this.value;
    this.isSelected = isSelected;
   }
}
