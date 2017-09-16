import { Component, Input } from '@angular/core';

@Component({
  selector: 'text-presenter',
  templateUrl: './text-presenter.component.html'
})
export class TextPresenter {
  @Input() data: string;
}