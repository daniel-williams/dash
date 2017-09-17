import { Component, Input } from '@angular/core';

@Component({
  selector: 'workitem-link-presenter',
  templateUrl: './workitem-link-presenter.component.html'
})
export class WorkitemLinkPresenter {
  @Input() data: string;
}