import { AfterContentInit, Component } from '@angular/core';

import { AppConstants } from '../app.constants';
import { FabricService } from '../shared';


@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class ScorecardAbout implements AfterContentInit {
  private fabric: any;

  constructor(private appConstants: AppConstants, private fabricService: FabricService) {
    this.fabric = this.fabricService.api;
  }

  ngAfterContentInit() {
    let fabric = this.fabric;

    if(fabric) {
      // fabric init goes here
    }
  }

}