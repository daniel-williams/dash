import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import {
  ActivatedRoute,
  Params,
  Router,
} from '@angular/router';

import {
  AnimationService,
  Easing,
  ScrollMagic,
  TweenMax
} from '../shared';

import {
  BrowserScore,
} from './shared';


@Component({
  selector: 'browser-card',
  templateUrl: './browser-card.component.html',
  styleUrls: ['./browser-card.component.scss'],
  host: {
    class: 'overview-card'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrowserCard {
  @Input() browserScore: BrowserScore;

  private controller: any;
  private isEdge: boolean;

  constructor(
    private animationService: AnimationService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {

    this.controller = AnimationService.CreateController();
  }

  ngOnInit() {
    this.isEdge = this.browserScore && this.browserScore.title === 'Edge';
  }

  ngAfterViewInit() {
    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      let scrollTarget = this.createAnchor(queryParams['target'] || 'top');
      let el = document.getElementById(scrollTarget);

      if(el) {
        let posY = this.animationService.getPageOffset(el).top;

        this.controller.scrollTo(posY);
      }
    });
  }

  createAnchor(name: string): string {
    var rx = new RegExp('\\W+', 'g');

    return name.replace(rx, '-');
  }

  encodeWordCloudData(data: any) {
    return JSON.stringify(data);
  }

  calculateSentiment(data: any) {
    let total = 0;
    let positive = 0;
    let negative = 0;

    Object.keys(data).forEach((key: string) => {
      total += data[key];

      switch(key) {
        case 'Calm':
        case 'Creative':
        case 'Cutting-edge':
        case 'Exciting':
        case 'Familiar':
        case 'Fresh':
        case 'Impressive':
        case 'Innovative':
        case 'Inspiring':
        case 'Professional':
        case 'Trustworthy':
          positive += data[key];
          break;
        case 'Boring':
        case 'Complicated':
        case 'Intimidating':
        case 'Old':
        case 'Unprofessional':
          negative += data[key];
          break;
      }
    });

    let percentPositive = Math.round((positive / total) * 100);

    // return '(' + percentPositive + '%)';
    return '';
  }
}