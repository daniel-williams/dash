import {
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Params,
  Router,
} from '@angular/router';

import {
  AppConstants,
} from '../../app.constants';

import {
  BrowserScore,
  ExperienceScorecardService,
} from './shared';


@Component({
  selector: 'scorecard-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class ScorecardOverview {
  private scorecardData: BrowserScore[];

  constructor(
    private appConstants: AppConstants,
    private changeDetector: ChangeDetectorRef,
    private experienceScorecardService: ExperienceScorecardService,
    private router: Router) { }

  ngAfterViewInit() {
    if(!this.scorecardData) {
      this.experienceScorecardService.getBroswerScores().then(scores => {
        let edge = scores.find(x => x.title === 'Edge');
        let comp = scores.find(x => x.title !== 'Edge');

        this.highlightEdgeScores(edge, comp);

        this.scorecardData = [edge, comp];
        this.changeDetector.detectChanges();
      });
    }
  }

  highlightEdgeScores(edge: BrowserScore, comp: BrowserScore) {
    for(let i = 0; i < edge.experienceScores.length; i++) {
      let edgeExp = edge.experienceScores[i];
      let compExp = comp.experienceScores[i];

      if(edgeExp.hasScore) {
        edgeExp.scoreDelta = edgeExp.averageScore - compExp.averageScore;

        for(let j = 0; j < edgeExp.featureScores.length; j++) {
          let edgeFeature = edgeExp.featureScores[j];
          let compFeature = compExp.featureScores[j];

          if(edgeFeature.hasScore) {
            edgeFeature.scoreDelta = edgeFeature.averageScore - compFeature.averageScore;

            for(let k = 0; k < edgeFeature.dimensionScores.length; k++) {
              let edgeDim = edgeFeature.dimensionScores[k];
              let compDim = compFeature.dimensionScores[k];

              if(edgeDim.hasScore) {
                edgeDim.scoreDelta = edgeDim.averageScore - compDim.averageScore;
              }
            }
          }
        }
      }
    }
  }
}
