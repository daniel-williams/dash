import { Component, Input } from '@angular/core';

@Component({
  selector: 'assigned-presenter',
  templateUrl: './assigned-presenter.component.html',
  styleUrls: ['./assigned-presenter.component.scss']
})
export class AssignedPresenter {
  @Input() data: string;
}