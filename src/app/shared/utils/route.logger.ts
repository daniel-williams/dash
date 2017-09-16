import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

// import { TelemetryService } from '../../telemetry';
 
@Injectable()
export class RouteLogger implements CanActivate {

  // constructor(private telemetryService: TelemetryService) { }
  constructor() { }
 
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    // this.telemetryService.addPageView(url);

    return true;
  }
}