import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

// providers
import {
  AnimationService,
  ClipboardService,
  FabricService,
  IdentityService,
  SearchService,
  VsoService,
} from '../shared';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [

  ],
  providers: [
    AnimationService,
    ClipboardService,
    FabricService,
    IdentityService,
    SearchService,
    VsoService,
  ]
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}