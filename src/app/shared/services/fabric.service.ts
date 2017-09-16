import { Injectable } from '@angular/core';


@Injectable()
class FabricService {

  public api: any;

  constructor() {
    this.api = (window as any).fabric;
  }
}

export {
  FabricService
};
