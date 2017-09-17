import { Component, ViewEncapsulation, } from '@angular/core';

@Component({
  selector: 'app',
  template: `
  <planning-nav></planning-nav>
  <router-outlet></router-outlet>
  `,
  styleUrls: ['./planning.base.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class App { }
