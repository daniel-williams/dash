import { Component, HostListener, Input } from '@angular/core';

let BASE_WIDTH = 1200;

@Component({
  selector: 'collapsible-text-presenter',
  templateUrl: './collapsible-text-presenter.component.html',
  styleUrls: ['./collapsible-text-presenter.component.scss']
})
export class CollapsibleTextPresenter {
  @HostListener('window:resize', ['$event'])
    onWindowResize(evt: any) {
      this.calculateSizeRelative();
    }

  @Input() data: string;
  @Input() length: number;

  private sizeRelative: number = 1;
  private collapsed: boolean = true;

  calculateSizeRelative(): void {
    this.sizeRelative = window.innerWidth / BASE_WIDTH;
  }

  toggle(evt: MouseEvent) {
    if(evt.ctrlKey) {
      this.collapsed = !this.collapsed;
      evt.preventDefault();
      evt.stopImmediatePropagation();
    }
  }
}