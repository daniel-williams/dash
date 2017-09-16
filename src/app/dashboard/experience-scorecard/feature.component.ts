import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Params,
  Router,
} from '@angular/router';
import { Subject, Observable } from 'rxjs';

import {
  AnimationService,
  Easing,
  ScrollMagic,
  TweenMax
} from '../../shared/services';
import {
  FabricService,
} from '../../shared/services';

import {
  BrowserScore,
  ExperienceScorecardService,
  ParticipantFeatureResponse,
} from './shared';


@Component({
  selector: 'scorecard-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScorecardFeature {
  private controller: any;
  private fabric: any;
  private browser: string = '';
  private experience: string = '';
  private feature: string = '';

  private sortedResponses$ = new Observable();
  private responses$ = new Observable();
  private sortOn$: Subject<string> = new Subject();

  private lastSort: string;
  private sortToggle: boolean = true;

  private demographics: any = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private experienceScorecardService: ExperienceScorecardService,
    private fabricService: FabricService,
    private router: Router) {

    this.fabric = this.fabricService.api;
    this.controller = AnimationService.CreateController();

    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      this.browser = queryParams['browser'];
      this.experience = queryParams['experience'];
      this.feature = queryParams['feature'];

      this.sortOn$.subscribe(x => {
        if(this.lastSort === x) {
          this.sortToggle = !this.sortToggle;
        } else {
          this.sortToggle = true;
        }
        this.lastSort = x;
      });

      this.responses$ = this.experienceScorecardService
        .getFeatureResponses(this.browser, this.experience, this.feature).do(x => {
          this.sortOn$.next('average');
          setTimeout(this.queueFabric, 0);
        });
    });
  }

  ngOnInit() {
    this.sortedResponses$ = Observable.combineLatest(this.responses$, this.sortOn$, (responses: ParticipantFeatureResponse[], sortOn: string) => {
      return this.sort(responses, sortOn);
    });
  }

  ngAfterViewInit() {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.controller.scrollTo(0);
      }
    });
  }

  queueFabric() {
    let fabric = this.fabric;

    if(fabric) {
      var CalloutExamples = document.querySelectorAll(".ms-CalloutExample");

      for (var i = 0; i < CalloutExamples.length; i++) {
        var Example = CalloutExamples[i];
        var ExampleButtonElement = Example.querySelector(".username > span");
        var CalloutElement = Example.querySelector(".ms-Callout");

        new fabric['Callout'](
          CalloutElement,
          ExampleButtonElement,
          "right"
        );
      }

    }
  }

  getDemographics(username: string) {
    this.experienceScorecardService.getDemographics(username).then(x => {
      if(x) {
        this.demographics = [
          'Gender: ' + x['Gender'],
          'Age: ' + x['Age'],
          'Income: ' + x['Annual household income'],
          'Country: ' + x['Country'],
          'Web expertise: ' + x['Web expertise'],
          'Operating System: ' + x['Operating System'],
          'Social Networking: ' + x['Social Networking'],
        ];
        let feedback = x['Please tell us a bit about how this session went... (too few or too many questions?  too simple or too complex?  etc.)'];
        if(!!feedback) {
          this.demographics.push('Study feedback: ' + feedback);
        }
      } else {
        this.demographics = null;
      }
    });
  }

  back() {
    this.router.navigate(['../overview'], {
      queryParams: { target: this.browser + " " + this.feature + " " + this.experience },
      relativeTo: this.activatedRoute });
  }

  sortBy(column: string) {
    this.sortOn$.next(column);
  }

  sort(responses: ParticipantFeatureResponse[], sortOn: string) {
    switch(sortOn) {
      case 'username':
        responses.sort((a, b) => {
          let res = a.username < b.username ? -1 : a.username > b.username ? 1: 0;

          return this.sortDirection(res);
        });
        break;
      case 'average':
        responses.sort((a, b) => {
          let res = a.averageScore < b.averageScore ? -1 : a.averageScore > b.averageScore ? 1: 0;

          return this.sortDirection(res);
        });
        break;
      case 'useful':
        responses.sort((a, b) => {
          let res = a.dimensions.Useful < b.dimensions.Useful ? -1 : a.dimensions.Useful > b.dimensions.Useful ? 1: 0;

          return this.sortDirection(res);
        });
        break;
      case 'usable':
        responses.sort((a, b) => {
          let res = a.dimensions.Usable < b.dimensions.Usable ? -1 : a.dimensions.Usable > b.dimensions.Usable ? 1: 0;

          return this.sortDirection(res);
        });
        break;
      case 'findable':
        responses.sort((a, b) => {
          let res = a.dimensions.Findable < b.dimensions.Findable ? -1 : a.dimensions.Findable > b.dimensions.Findable ? 1: 0;

          return this.sortDirection(res);
        });
        break;
      case 'predictable':
        responses.sort((a, b) => {
          let res = a.dimensions.Predictable < b.dimensions.Predictable ? -1 : a.dimensions.Predictable > b.dimensions.Predictable ? 1: 0;

          return this.sortDirection(res);
        });
        break;
      case 'desirable':
        responses.sort((a, b) => {
          let res = a.dimensions.Desirable < b.dimensions.Desirable ? -1 : a.dimensions.Desirable > b.dimensions.Desirable ? 1: 0;

          return this.sortDirection(res);
        });
        break;
      case 'feedback':
        responses.sort((a, b) => {
          let res = a.dimensions.Feedback < b.dimensions.Feedback ? -1 : a.dimensions.Feedback > b.dimensions.Feedback ? 1: 0;

          return this.sortDirection(res);
        });
        break;
      case 'video':
        responses.sort((a, b) => {
          let res = a.videoDuration < b.videoDuration ? -1 : a.videoDuration > b.videoDuration ? 1: 0;

          return this.sortDirection(res);
        });
        break;
    }

    return responses;
  }

  sortDirection(val: number) {
    return val * (this.sortToggle ? 1 : -1);
  }
}
