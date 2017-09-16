import { Component, Input } from '@angular/core';

@Component({
  selector: 'shortname-presenter',
  templateUrl: './shortname-presenter.component.html'
})
export class ShortnamePresenter {
  @Input() data: string;

  get formattedShortname(): string {
    let original = this.data || "";
    let segments = original.split('|');

    return segments.length > 1
      ? segments[segments.length - 1].trim()
      : original;
  }
}