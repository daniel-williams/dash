import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { studyData } from './study.data';
import { studyFormat } from './study.format';
import {
  BrowserScore,
  DimensionScore,
  ExperienceScore,
  FeatureScore,
  ParticipantFeatureResponse,
  StudyTask,
  TaskType,
  TaskSubtype,
  WordCount,
} from './scorecard.types';


const SCORED_DIMENSIONS = [
  'Findable',
  'Useful',
  'Usable',
  'Desirable',
  'Predictable',

  'App Icon',
  'Overflow Menu',
  'Buttons',
  'Layout',
];

@Injectable()
export class ExperienceScorecardService {
  private studyData: any;
  private studyFormat: any;
  private study: any;
  private participants: any[];

  private browserScores: BrowserScore[];

  constructor() {
    this.studyData = studyData;
    this.studyFormat = studyFormat;
    this.study = this.studyFormat.studies[0];
    this.browserScores = [];
    this.participants = [];
  }

  getBroswerScores(): Promise<BrowserScore[]> {
    return Promise.resolve().then(() => {
      if(!this.browserScores.length) {
        this.loadParticipants();
        this.readyScoreContainers();
        this.calculateDimensionScores();
      }

      let expOrder = this.study.experienceList.map((x: any) => x.name);

      this.browserScores.forEach(bs => {
        bs.orderExperiences(expOrder);
      });

      return this.browserScores;
    });
  }

  getFeatureResponses(browser: string, experience: string, feature: string): Observable<ParticipantFeatureResponse[]> {

    return Observable.fromPromise(
      Promise.resolve().then(() => {
        let pfrList: ParticipantFeatureResponse[] = [];
        let dataTaskMap: { group: string, dimension: string, index: number}[] = [];

        this.study.groups.forEach((studyGroup: any) => {
          let studyGroupTitle = studyGroup.title;

          studyGroup.tasks.forEach((studyTask: any, index: number) => {

            if(studyTask.experience === experience && studyTask.feature === feature) {
              // currently, data starts @ index 1, but study definition starts @ index 0
              dataTaskMap.push({group: studyGroupTitle, dimension: studyTask.dimension || 'VideoClip', index: index + 1});
            }
          });
        });


        Object.keys(this.studyData).forEach(key => {
          let participantData = this.studyData[key];
          if(participantData.__browser !== browser) { return; }

          let pfr = new ParticipantFeatureResponse(key, participantData.Username, experience, feature);
          let hasResponses = false;

          dataTaskMap.forEach(task => {
            if(participantData.__taskGroup === task.group) {
              let data = participantData.__tasks[task.index];

              switch(task.dimension) {
                case 'App Icon':
                case 'Overflow Menu':
                case 'Buttons':
                case 'Layout':
                case 'Desirable':
                  pfr.dimensions[task.dimension] = Object.keys(data).join(', ');
                  hasResponses = true;
                  break;
                case 'VideoClip':
                  pfr.videoOffset = data.offset;
                  pfr.videoDuration = data.duration;
                  hasResponses = true;
                  break;
                default:
                  pfr.dimensions[task.dimension] = data;
                  hasResponses = true;
                  break;
              }
            }
          });

          if(hasResponses) {
            pfr.averageScore = (
              pfr.dimensions.Findable +
              pfr.dimensions.Usable +
              pfr.dimensions.Useful +
              pfr.dimensions.Predictable) / 4;
            pfrList.push(pfr);
          }

        });

        return pfrList;
      }));
  }

  getDemographics(username: string): Promise<any> {
    return Promise.resolve().then(() => {
      let demograhpics = null;

      Object.keys(this.studyData).find(key => {
        if(this.studyData[key].Username === username) {
          demograhpics = this.studyData[key];
          return true;
        }
      });

      return demograhpics;
    });
  }

  // private
  private loadParticipants() {
    Object.keys(this.studyData).forEach(key => this.participants.push(this.studyData[key]));
  }

  private readyScoreContainers() {
    let browsersUsed: string[] = [];

    // find all browsers used in study
    this.participants.forEach(participant => {
      let browser = participant['__browser'];

      if(!browsersUsed.includes(browser)) {
        browsersUsed.push(browser);
      }
    });

    // ensure Edge is first
    browsersUsed.sort((a, b) => {
      let _a = a.toLowerCase();
      let _b = b.toLowerCase();

      if(_a === 'edge') {
        return -1;
      } else if (_b === 'edge') {
        return 1;
      } else {
        return _a < _b ? -1 : _a > _b ? 1 : 0;
      }
    });

    // new up score contains for each browser used
    browsersUsed.forEach(browser => {
      let bs = this.browserScores.find(x => x.title === browser);

      if(!bs) {
        bs = new BrowserScore(browser);
        this.browserScores.push(bs);
      }
    });
  }

  private calculateDimensionScores() {
    let groups: any[] = this.study.groups;
    let experiences: any = this.study.experienceList;

    groups.forEach(group => {
      let tasks: StudyTask[] = group.tasks;

      tasks.forEach((task, index) => {
        if(!task.experience) { return; }

        this.browserScores.forEach(bs => {
          let es = bs.experienceScores.find(es => es.title === task.experience);
          if(!es) {
            let exp = experiences.find((x: any) => x.name === task.experience);

            // let summary = exp.summary;
            es = new ExperienceScore(task.experience, exp.summary || '-', exp.insights);
            bs.experienceScores.push(es);
          }

          let fs = es.featureScores.find(fs => fs.title === task.feature);
          if(!fs) {
            fs = new FeatureScore(task.feature, task.description.join('<br>'));
            es.featureScores.push(fs);
          }
        });
      });

      tasks.forEach((task, index) => {
        let {
          experience: taskExperience,
          feature: taskFeature,
          dimension: taskDimension,
          description
        } = task;
        let taskIndex = index + 1;

        // Skip calculations if task is not included within an Experience or Feature,
        // or if the task's Dimension is not to be included in scoring
        if(!taskExperience || !taskFeature || !SCORED_DIMENSIONS.includes(task.dimension)) { return; }

        this.browserScores.forEach(bs => {
          let bps = this.participants.filter(x => x.__taskGroup === group.title && x.__browser === bs.title);
          let es = bs.experienceScores.find(es => es.title === taskExperience);
          let fs = es.featureScores.find(fs => fs.title === taskFeature);

          // Ensure feature scoring containers exist (* Appearance has alternate format)
          if(!fs) {
            fs = new FeatureScore(taskFeature, '');
            es.featureScores.push(fs);
          }

          // New up dimension scoring container
          let ds = new DimensionScore(taskDimension);

          // Set dimension data/score base on type
          switch(task.subtype) {
            case TaskSubtype.agreementScale:
            case TaskSubtype.satisfactionScale:
            case TaskSubtype.timeOnTask:
              bps.forEach(x => ds.addScore(x.__tasks[taskIndex]));
              break;
            case TaskSubtype.wordAssociation:
              let wordCount = {};

              bps.forEach(x => {
                let words = x.__tasks[taskIndex];

                Object.keys(words).forEach(key => {
                  wordCount[key] = wordCount[key] || 0;
                  wordCount[key]++;
                });
              });

              ds.wordCount = wordCount;
              break;
            case TaskSubtype.written:
              bps.forEach(x => ds.feedback.push(x.__tasks[taskIndex]));
              break;
            case TaskSubtype.yesNoMaybe:
              bps.forEach(x => ds.wasCompleted(x.__tasks[taskIndex]));
              break;
            default:
              ; // noop
          }

          fs.addDimensionScore(ds);

        });

      });
    });
  }

  private formatScore(score: number): number {
    return (Math.round(score * 10) / 10);
  }

  private formatScoreAsPercentage(score: number): string {
    return '' + ((Math.round(score * 100) / 100) * 100) + '%';
  }
}


