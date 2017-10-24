import {
  Injectable } from '@angular/core';
import {
  Headers,
  Http } from '@angular/http';

import {
  Observable } from 'rxjs';

import {
  AppConstants } from '../../../app.constants';
import {
  SelectOption,
  ISearchCriteria,
  SearchControlMask } from '../../types/search.types';

import {
  vso } from './vso.mappings';
import {
  allFields,
  bugFields,
  deliverableFields,
  measureFields,
  problemRecordFields,
  scenarioFields } from './vso.typeFields';
import {
  Related,
  RelatedMap,
  ScenarioWorkItem,
  VsoLinkType,
  VsoWortItemType,
  WorkItem } from './vso.types';


// TODO djw: move to secrets
const cred: string = new Buffer('v-wildan@microsoft.com:o2lhnmth3ka3zzdewqh2dub5gy7smvtysxxc5aimutyyahektm4q').toString('base64');

const vsoRoot: string = 'https://microsoft.visualstudio.com/DefaultCollection';
const vsoApi: string = vsoRoot + '/_apis/wit/'

const vsoApiWiql: string = vsoApi + 'wiql?api-version=1.0';
const vsoApiWorkItems: string = vsoApi + 'WorkItems?api-version=1.0';

const vsoPostEndpoint: string = vsoRoot + '/_apis/wit/wiql?api-version=1.0';
const vsoGetEndpoint: string = vsoRoot + '/_apis/wit/WorkItems?api-version=1.0';

// TODO djw: test if vsoQuery endpoint would work here.
const vsoAreaPathsEndpoint: string = 'https://microsoft.visualstudio.com/DefaultCollection/OS/_apis/wit/classificationnodes/areas/WE/EDGE?api-version=1.0&$depth=10';


@Injectable()
export class VsoService {
  private headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + cred
  });

  constructor(private appConstants: AppConstants, private http: Http) { }

  fetchIds(
    searchCriteria: ISearchCriteria,
    workItemTypes?: VsoWortItemType[],
    whereClause?: string): Promise<number[]> {

    let query = `
      Select
        [${vso.id}]
      From
        WorkItems
      Where
        [${vso.state}] <> 'Cut'
      `;

    query += !!whereClause ? whereClause : '';
    query += this.applyTypeFilters(workItemTypes);
    query += this.applySearchFilters(searchCriteria);

    return this.http
      .post(vsoApiWiql, { query: query }, { headers: this.headers })
      .map(res => res.json())
      .toPromise()
      .then(json => {
        let items = json.workItems as any[];

        return items.map(item => item.id);
      });
  }

  fetchScenariosByPromise(searchCriteria: ISearchCriteria): Promise<number[]> {
    let query = `
      SELECT
        [${vso.id}]
      FROM
        WorkItemLinks
      WHERE
        (Source.[System.Id] = ${searchCriteria.promise})
        And ([System.Links.LinkType] = 'System.LinkTypes.Hierarchy-Forward')
        And (Target.[System.WorkItemType] = 'Scenario')
        And (Target.[System.State] <> 'Cut')
        And (Target.[System.State] <> 'Complete')
        And (Target.[System.State] <> 'Completed')
        And (Target.[OSG.Product] <> 'Internal')
    `;

    delete searchCriteria['promise'];
    query += this.applySearchFilters(searchCriteria, null, true);
    query += `
      ORDER BY
        [System.ChangedDate] desc mode(Recursive)
    `;

    return this.http
      .post(vsoApiWiql, { query: query }, { headers: this.headers })
      .map(res => res.json())
      .toPromise()
      .then(json => {
        let items: number[] = [];
        let workItemRelations = json.workItemRelations as any[];

        workItemRelations.forEach(x => {
          if(x.source) {
            items.push(x.target.id);
          }
        })

        return items;
      });
  }

  /**
  *  Fetches related workitems
  *  @param {number[]} idList - ids of workitems to fetch related workitems for
  *  @param {workItemTypes} - fetched workitems are limited to these types
  *  @return {RelatedMap}
  */
  fetchRelated(idList: number[] = [], workItemTypes?: VsoWortItemType[]): Promise<RelatedMap> {
    // Query vso's WorkItemLinks table to find related workitem ids
    let query = `
      SELECT
        [Target].[${vso.id}],
        [Target].[${vso.workItemType}]
      FROM
        WorkItemLinks
      WHERE
        [Target].[${vso.state}] <> 'Cut' And
        [Target].[${vso.state}] <> 'Obsolete' And
        [Target].[${vso.state}] <> 'Deprecated' And
        [Source].[${vso.id}] in (${idList.join(',')})
    `;

    // Gaurd against zero ids
    if(!idList || !idList.length) { return Promise.resolve(new RelatedMap()); }

    query += this.applyTypeFilters(workItemTypes, true);

    return this.http
      .post(vsoApiWiql, { query: query }, { headers: this.headers })
      .map(response => response.json())
      .toPromise()
      .then(json => {
        let workItemRelations = json.workItemRelations as any[];
        let relatedMap = new RelatedMap();

        // Pull related workitem ids into relatedMap
        workItemRelations.forEach(relation => relatedMap.addRelation(relation));

        return Promise.resolve(relatedMap);
      })
      .then(relatedMap => {
        // vso limits fetched workitems to 200 per request
        // so we need to batch requests and combine results
        let asyncCalls: Observable<any>[] = [];
        let relatedIds = relatedMap.relatedIds.slice();

        do {
          let upperBounds = Math.min(200, relatedIds.length);
          let idBatch = relatedIds.splice(0, upperBounds);

          asyncCalls.push(this.http
            .get(`${vsoGetEndpoint}&ids=${idBatch.join(',')}&fields=${allFields.join(',')}`, { headers: this.headers})
            .map(response => response.json()));
        } while(relatedIds.length);

        return Observable.forkJoin(asyncCalls)
          .toPromise()
          .then(batchResults => {
            batchResults.forEach(batch => {
              let vsoWorkItemResults = (batch as any).value as any[];

              vsoWorkItemResults.forEach(vsoWorkItemResult => {
                let id = vsoWorkItemResult.fields[vso.id];
                let workItemType = vsoWorkItemResult.fields[vso.workItemType];
                let workItem: WorkItem;

                if(relatedMap.comsumingFromIds.includes(id)) {
                  workItemType = 'ConsumingFrom';
                }

                // Construct appropriate workitem type and add to relatedMap
                // of target scenario
                switch(workItemType) {
                  case 'Bug':
                    workItem = toWorkItem(vsoWorkItemResult, allFields);
                    relatedMap.related[workItem.id].forEach(id => relatedMap.parents[id].bugs.push(workItem));
                    break;
                  case 'Measure':
                    workItem = toWorkItem(vsoWorkItemResult, allFields);
                    relatedMap.related[workItem.id].forEach(id => relatedMap.parents[id].measures.push(workItem));
                    break;
                  case 'Deliverable':
                    workItem = toWorkItem(vsoWorkItemResult, allFields);
                    relatedMap.related[workItem.id].forEach(id => relatedMap.parents[id].deliverables.push(workItem));
                    break;
                  case 'ConsumingFrom':
                    workItem = toWorkItem(vsoWorkItemResult, allFields);
                    if(workItem.workItemType === VsoWortItemType.Deliverable.toString()) {
                      relatedMap.related[workItem.id].forEach(id => relatedMap.parents[id].consumingFrom.push(workItem));
                    }
                    break;
                }

              });
            });

            return Promise.resolve(relatedMap);
          });
        })
        .catch(err => Promise.resolve(new RelatedMap()));
  }

  getScenarioReadiness(searchCriteria: ISearchCriteria): Promise<ScenarioWorkItem[]> {
    let release = searchCriteria.release || '';
    let types = [VsoWortItemType.Scenario];
    let where = `
      And [${vso.state}] <> 'Cut'
      And [${vso.product}] <> 'Internal'
    `;

    if(release) {
      where += `
        And
        (
          (
            [${vso.release}] = '${release}' And
            [${vso.tags}] Contains 'EDGE_${release}_READINESS'
          ) Or
          [${vso.tags}] Contains 'EDGE_CORE_SCENARIO_READINESS'
        )
      `;
    } else {
      where += `
        And
        (
          (
            [${vso.tags}] Contains 'EDGE_RS2_READINESS' Or
            [${vso.tags}] Contains 'EDGE_RS3_READINESS' Or
            [${vso.tags}] Contains 'EDGE_RS4_READINESS' Or
            [${vso.tags}] Contains 'EDGE_RS5_READINESS'
          ) Or
          [${vso.tags}] Contains 'EDGE_CORE_SCENARIO_READINESS'
        )
      `;
    }

    // pull all readiness scenarios and let downstream logic filter which to show (e.g., via core legacy toggle)
    let maskedSearchCriteria = Object.assign({}, searchCriteria, {release: null});

    return this.fetchIds(maskedSearchCriteria, types, where)
      .then(ids => {
        if(ids.length === 0) { return []; }

        let asyncCalls: Observable<any>[] = [];

        do {
          let upperBounds = Math.min(200, ids.length);
          let idBatch = ids.splice(0, upperBounds);

          asyncCalls.push(this.http
            .get(`${vsoApiWorkItems}&ids=${idBatch.join(',')}&fields=${scenarioFields.join(',')}`, { headers: this.headers})
            .map(res => res.json() as any[])
          );
        } while(ids.length);

        return Observable.forkJoin(asyncCalls)
          .toPromise()
          .then(batchResults => {
            let scenarios: ScenarioWorkItem[] = [];

            batchResults.forEach(batch => {
              let batchItems = (batch as any).value as any[];

              batchItems.forEach(item => scenarios.push(toScenario(item, scenarioFields)));
            });

            return scenarios;
          });
      });
  }

  getScenarios(searchCriteria: ISearchCriteria): Promise<Array<ScenarioWorkItem>> {
    let types = [VsoWortItemType.Scenario];
    let where = `
      And [${vso.state}] <> 'Cut'
      And [${vso.state}] <> 'Complete'
      And [${vso.state}] <> 'Completed'
      And [${vso.product}] <> 'Internal'
    `;

    if(searchCriteria.promise) {
      return this.fetchScenariosByPromise(searchCriteria)
        .then(ids => {
          if(ids.length === 0) { return []; }

          let asyncCalls: Observable<any>[] = [];

          do {
            let upperBounds = Math.min(200, ids.length);
            let idBatch = ids.splice(0, upperBounds);

            asyncCalls.push(this.http
              .get(`${vsoApiWorkItems}&ids=${idBatch.join(',')}&fields=${scenarioFields.join(',')}`, { headers: this.headers})
              .map(response => response.json() as any[])
            );
          } while(ids.length);

          return Observable.forkJoin(asyncCalls)
            .toPromise()
            .then(batchResults => {
              let scenarios: ScenarioWorkItem[] = [];

              batchResults.forEach(batch => {
                let batchItems = (batch as any).value as any[];

                batchItems.forEach(item => scenarios.push(toScenario(item, scenarioFields)));
              });

              return scenarios;
            });
        });
    } else {
      return this.fetchIds(searchCriteria, types, where)
        .then(ids => {
          if(ids.length === 0) { return []; }

          let asyncCalls: Observable<any>[] = [];

          do {
            let upperBounds = Math.min(200, ids.length);
            let idBatch = ids.splice(0, upperBounds);

            asyncCalls.push(this.http
              .get(`${vsoApiWorkItems}&ids=${idBatch.join(',')}&fields=${scenarioFields.join(',')}`, { headers: this.headers})
              .map(response => response.json() as any[])
            );
          } while(ids.length);

          return Observable.forkJoin(asyncCalls)
            .toPromise()
            .then(batchResults => {
              let scenarios: ScenarioWorkItem[] = [];

              batchResults.forEach(batch => {
                let batchItems = (batch as any).value as any[];

                batchItems.forEach(item => scenarios.push(toScenario(item, scenarioFields)));
              });

              return scenarios;
            });
        });
    }
  }

  getProblemRecords(searchCriteria?: ISearchCriteria): Promise<WorkItem[]> {
    let types = [VsoWortItemType.ProblemRecord];
    let where = `
      And [${vso.tags}] Contains 'EDGERCA'
      And [${vso.state}] <> 'Cut'
      And [${vso.state}] <> 'Obsolete'
    `;

    return this.fetchIds(searchCriteria, types, where)
      .then(ids => {
        if(ids.length === 0) { return []; }

        let asyncCalls: Observable<any>[] = [];

        do {
          let upperBounds = Math.min(200, ids.length);
          let idBatch = ids.splice(0, upperBounds);

          asyncCalls.push(this.http
            .get(`${vsoApiWorkItems}&ids=${idBatch.join(',')}&fields=${problemRecordFields.join(',')}`, { headers: this.headers})
            .map(response => response.json() as any[])
          );
        } while(ids.length);

        return Observable.forkJoin(asyncCalls)
          .toPromise()
          .then(batchResults => {
            let workItems: WorkItem[] = [];

            batchResults.forEach(batch => {
              let batchItems = (batch as any).value as any[];

              batchItems.forEach(item => workItems.push(toWorkItem(item, problemRecordFields)));
            });

            return workItems;
          });
      });
  }

  getDeliverables(searchCriteria: ISearchCriteria): Promise<Array<WorkItem>> {
    let query = `
      Select
        [${vso.state}],
        [${vso.workItemType}],
        [${vso.release}],
        [${vso.areaPath}]
      From
        WorkItems
      Where
        [${vso.state}] <> 'Complete' And
        [${vso.state}] <> 'Completed' And
        [${vso.state}] <> 'Cut' And
        [${vso.state}] <> 'Deprecated' And
        [${vso.state}] <> 'Obsolete' And
        [${vso.workItemType}]='Deliverable'
      `;

    // searchCriteria.areaPaths.push('OS\\WE\\EDGE'); // ensure query isn't too broad

    query += this.applySearchFilters(searchCriteria);

    return this.http.post(vsoPostEndpoint, { query: query }, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as any)
      .then(json => {
        let items = json.workItems as Array<any>;
        let ids: Array<any> = [];

        items.forEach(item => ids.push(item.id));

        // vso limits fetched workitems to 200 per request
        // so we need to batch requests and combine results
        let asyncCalls: Observable<any>[] = [];
        do {
          let upperBounds = Math.min(200, ids.length);
          let idBatch = ids.splice(0, upperBounds);

          asyncCalls.push(this.http
            .get(`${vsoGetEndpoint}&ids=${idBatch.join(',')}&fields=${deliverableFields.join(',')}`, { headers: this.headers})
            .map(response => response.json()));

        } while(ids.length);

        return Observable.forkJoin(asyncCalls)
          .toPromise()
          .then(batchResults => {
            let workItems: WorkItem[] = [];

            batchResults.forEach(batch => {
              let vsoWorkItems = (batch as any).value as any[];

              vsoWorkItems.forEach(vsoWorkItem => workItems.push(toWorkItem(vsoWorkItem, deliverableFields)));
            });

            return workItems;
          });
      });

  }

  getMeasures(searchCriteria: ISearchCriteria): Promise<Array<WorkItem>> {
    let query = `
      Select
        [${vso.state}],
        [${vso.workItemType}],
        [${vso.release}],
        [${vso.areaPath}]
      From
        WorkItems
      Where
        [${vso.state}] <> 'Cut' And
        [${vso.state}] <> 'Deprecated' And
        [${vso.state}] <> 'Obsolete' And
        [${vso.workItemType}]='Measure'
      `;

    // searchCriteria.areaPaths.push('OS\\WE\\EDGE'); // ensure query isn't too broad

    query += this.applySearchFilters(searchCriteria);

    return this.http.post(vsoPostEndpoint, { query: query }, { headers: this.headers })
      .toPromise()
      .then(res => res.json() as any)
      .then(json => {
        let items = json.workItems as Array<any>;
        let ids: Array<any> = [];

        items.forEach(item => ids.push(item.id));

        if(ids.length === 0) { return []; }

        // vso limits fetched workitems to 200 per request
        // so we need to batch requests and combine results
        let asyncCalls: Observable<any>[] = [];
        do {
          let upperBounds = Math.min(200, ids.length);
          let idBatch = ids.splice(0, upperBounds);

          asyncCalls.push(this.http
            .get(`${vsoGetEndpoint}&ids=${idBatch.join(',')}&fields=${measureFields.join(',')}`, { headers: this.headers})
            .map(response => response.json()));

        } while(ids.length);

        return Observable.forkJoin(asyncCalls)
          .toPromise()
          .then(batchResults => {
            let workItems: WorkItem[] = [];

            batchResults.forEach(batch => {
              let vsoWorkItems = (batch as any).value as any[];

              vsoWorkItems.forEach(vsoWorkItem => workItems.push(toWorkItem(vsoWorkItem, measureFields)));
            });

            return workItems;
          });
      });
  }

  getBugMap(searchCriteria: ISearchCriteria): Promise<BugMap> {
    let bugMap = new BugMap();
    let baseQuery = `
      Select
        [${vso.id}],
        [${vso.workItemType}]
      From
        WorkItems
      Where
        [${vso.state}] <> 'Cut' And
        [${vso.workItemType}]='Bug'
      `;
    let baseQueryNoAreaPath = JSON.parse(JSON.stringify(baseQuery));
    let searchCriteriaNoAreaPath = {
      areaPaths: [],
      release: searchCriteria.release,
      iterationPath: searchCriteria.iterationPath,
      pmGroupLead: searchCriteria.pmGroupLead,
      devGroupLead: searchCriteria.devGroupLead,
      dnaGroupLead: searchCriteria.dnaGroupLead,
      designGroupLead: searchCriteria.designGroupLead
    } as ISearchCriteria;

    baseQuery += this.applySearchFilters(searchCriteria);
    baseQueryNoAreaPath += this.applySearchFilters(searchCriteriaNoAreaPath);

    let servicingQuery = baseQuery + ` And
      [${vso.productFamily}] = 'Windows Servicing' And
      [${vso.state}] = 'Active' And
      [${vso.issueType}] <> 'Localization' And
      (
        (
          [${vso.issueSubType}] = 'Security' And
          [${vso.triage}] <> 'Investigate' And
          [${vso.triage}] <> 'Triage Needed'
        ) Or
        [${vso.issueSubType}] <> 'Security'
      )
    `;
    let edgeCritQuery = baseQuery + ` And
      [${vso.state}] = 'Active' And
      [${vso.tags}] Contains 'EDGE_CRIT' And
      [${vso.tags}] Contains 'EDGEApproved'
    `;
    let hotQuery = baseQuery + ` And
      [${vso.state}] = 'Active' And
      [${vso.hotBug}] = 'Approved'
    `;
    let riBlockingQuery = baseQuery + ` And
      [${vso.state}] = 'Active' And
      (
        (
          [${vso.blocking}] = 'RI' And
          [${vso.impactedBranch}] In ('rs_edge', 'rs2_release_edge', 'rs_edge_app', 'rs_edge_app_lique', 'rs_edge_app_arition', 'rs_edge_app_eal')
        ) Or
        [${vso.tags}] Contains 'EDGE_RIBLOCKER'
      )
    `;
    let blockingEngineeringSignoffQuery = baseQuery + ` And
      [${vso.state}] = 'Active' And
      [${vso.product}] <> 'Watson' And
      [${vso.product}] <> 'Internal' And
      [${vso.product}] <> 'Static Analysis Future' And
      (
        [${vso.blocking}] Contains 'Engineering' Or
        [${vso.blocking}] Contains 'Flighting' Or
        [${vso.blocking}] Contains 'Xbox'
      ) And
      (
        [${vso.areaPath}] Under 'OS\\WE\\EDGE' Or
        (
          [${vso.substatus}] <> 'ExternalToMS' And
          [${vso.tags}] Contains 'EDGEREL_MUSTFIX'
        )
      )
    `;

    let asyncIds: Observable<any>[] = [];

    asyncIds.push(this.http
      .post(vsoPostEndpoint, { query: servicingQuery }, { headers: this.headers })
      .map(response => response.json()));
    asyncIds.push(this.http
      .post(vsoPostEndpoint, { query: edgeCritQuery }, { headers: this.headers })
      .map(response => response.json()));
    asyncIds.push(this.http
      .post(vsoPostEndpoint, { query: hotQuery }, { headers: this.headers })
      .map(response => response.json()));
    asyncIds.push(this.http
      .post(vsoPostEndpoint, { query: riBlockingQuery }, { headers: this.headers })
      .map(response => response.json()));
    asyncIds.push(this.http
      .post(vsoPostEndpoint, { query: blockingEngineeringSignoffQuery }, { headers: this.headers })
      .map(response => response.json()));

    return Observable.forkJoin(asyncIds)
      .toPromise()
      .then(responses => {
        let servicingResponse = responses[0].workItems as Array<any>;
        let servicingIds: number[] = [];
        let edgeCritResponse = responses[1].workItems as Array<any>;
        let edgeCritIds: number[] = [];
        let hotResponse = responses[2].workItems as Array<any>;
        let hotIds: number[] = [];
        let riBlockingResponse = responses[3].workItems as Array<any>;
        let riBlockingIds: number[] = [];
        let blockingEngineeringSignoffResponse = responses[4].workItems as Array<any>;
        let blockingEngineeringSignoffIds: number[] = [];

        servicingResponse.map(x => servicingIds.push(x.id));
        edgeCritResponse.map(x => edgeCritIds.push(x.id));
        hotResponse.map(x => hotIds.push(x.id));
        riBlockingResponse.map(x => riBlockingIds.push(x.id));
        blockingEngineeringSignoffResponse.map(x => blockingEngineeringSignoffIds.push(x.id));

        bugMap.addIds(servicingIds, BugTypes.servicing);
        bugMap.addIds(edgeCritIds, BugTypes.edgeCrit);
        bugMap.addIds(hotIds, BugTypes.hot);
        bugMap.addIds(riBlockingIds, BugTypes.riBlocking);
        bugMap.addIds(blockingEngineeringSignoffIds, BugTypes.blockingEngineeringSignoff);

        return bugMap;
      })
      .then(bugMap => {
        let ids = bugMap.ids;
        let asyncWorkitems: Observable<any>[] = [];

        // vso limits fetched workitems to 200 per request
        // so we need to batch requests and combine results
        do {
          let upperBounds = Math.min(200, ids.length);
          let idBatch = ids.splice(0, upperBounds);

          asyncWorkitems.push(this.http
            .get(`${vsoGetEndpoint}&ids=${idBatch.join(',')}&fields=${bugFields.join(',')}`, { headers: this.headers})
            .map(response => response.json()));

        } while(ids.length);

        return Observable.forkJoin(asyncWorkitems)
          .toPromise()
          .then(batchResults => {
            let workItems: WorkItem[] = [];

            batchResults.forEach(batch => {
              let vsoWorkItems = (batch as any).value as any[];

              vsoWorkItems.forEach(vsoWorkItem => workItems.push(toWorkItem(vsoWorkItem, bugFields)));
            });

            bugMap.AddBugs(workItems);

            return bugMap;
          })
          .catch(() => bugMap);
      })
      .catch(() => bugMap);
  }

  getRelated(id: number): Promise<Related> {
    let query = `
      Select
        [${vso.workItemType}],
        [${vso.id}],
        [${vso.title}],
        [${vso.state}],
        [${vso.areaPath}]
      From
        WorkItemLinks
      Where
        ([Source].[${vso.id}] = ${id}) And
        ([${vso.linkType}] In ('System.LinkTypes.Related-Forward', 'System.LinkTypes.Hierarchy-Forward', 'OSG.ProducingFor-Reverse'))
      `;

    return this.http.post(vsoPostEndpoint, { query: query }, { headers: this.headers })
      .map(res => res.json() as any)
      .toPromise()
      .then(json => {
        let items = json.workItemRelations as Array<any>;
        let ids: Array<any> = [];
        let consumingFromIds: Array<any> = [];

        if(items && items.length) {
          items.forEach(item => {
            if(item.target.id !== id) {
              ids.push(item.target.id);
              if(item.rel === 'OSG.ProducingFor-Reverse') {
                consumingFromIds.push(item.target.id);
              }
            }
          });
        }

        if(ids.length === 0) { return new Related(); }

        let index = 0;
        let asyncCalls: Array<Observable<any>> = [];

        do {
          let upperBounds = Math.min(200, ids.length);
          let idBatch = ids.splice(0, upperBounds);
          asyncCalls.push(
            this.http.get(`${vsoGetEndpoint}&ids=${idBatch.join(',')}`, { headers: this.headers})
              .map(res => res.json() as Array<any>)
          );
          index = index + upperBounds;
        } while(ids.length);

        return Observable.forkJoin(asyncCalls)
          .toPromise()
          .then(results => {
            let related: Related = new Related();

            // results is an array of results produced by the asyncCalls
            results.forEach(result => {
              let items = (result as any).value as Array<any>;

              items.forEach(item => {
                let state = item.fields[vso.state].toLowerCase();

                if(['cut', 'complete', 'completed'].includes(state)) { return; }

                let newItem = {
                  assignedTo: item.fields[vso.assignedTo],
                  compliance: item.fields[vso.compliance],
                  confidence: confidenceFromTags(item.fields[vso.tags]),
                  customString08: item.fields[vso.customString08],
                  customString09: item.fields[vso.customString09],
                  devOwner: item.fields[vso.devOwner],
                  id: item.id,
                  iteration: item.fields[vso.iteration],
                  originalEstimate: item.fields[vso.originalEstimate],
                  priority: item.fields[vso.priority],
                  release: item.fields[vso.release],
                  remainingDays: item.fields[vso.remainingDays],
                  remainingDevDays: item.fields[vso.remainingDevDays],
                  rank: item.fields[vso.rank],
                  risk: item.fields[vso.risk],
                  riskComment: item.fields[vso.riskComment],
                  shortname: toShortname(item.fields[vso.customString08]),
                  state: item.fields[vso.state],
                  tags: splitTags(item.fields[vso.tags]),
                  title: item.fields[vso.title],
                  workItemType: item.fields[vso.workItemType],

                  funcSpecStatus: item.fields[vso.funcSpecStatus],
                  funcSpecUrl: item.fields[vso.funcSpecUrl],
                  devDesignStatus: item.fields[vso.devDesignStatus],
                  devDesignUrl: item.fields[vso.devDesignUrl],
                  measureType: item.fields[vso.measureType],
                };

                if(consumingFromIds.indexOf(newItem.id) > -1) {
                  related.consumingFrom.push(newItem);
                } else {
                  switch(newItem.workItemType) {
                    case 'Deliverable':
                      related.deliverables.push(newItem);
                      break;
                    case 'Measure':
                      if(newItem.state.toLowerCase() !== 'obsolete') {
                        related.measures.push(newItem);
                      }
                      break;
                  }
                }

              });
            });

            return related;
          });
        });
  }

  getAreaPaths(): Promise<Array<string>> {
    return this.http.get(vsoAreaPathsEndpoint, { headers: this.headers })
      .map(res => res.json() as any)
      .toPromise()
      .then(json => {
        let paths = this.processAreaPaths(json).sort();

        paths.push('OS\\WE\\ICE\\Homepages\\Compass');

        return paths;
      });
  }

  getReleaseOptions(): Promise<SelectOption[]> {
    return Promise.resolve([
      new SelectOption('RS2', 'RS2'),
      new SelectOption('RS3', 'RS3', true),
      new SelectOption('RS4', 'RS4'),
      new SelectOption('RS5', 'RS5'),
    ]);
  }

  getPromiseOptions(): Promise<SelectOption[]> {
    return Promise.resolve([
      new SelectOption('9839007', '01. [Reliable+Responsive]'),
      new SelectOption('9839400', '02. [Retain+Engage]'),
      new SelectOption('12931347', '03. [Attract]'),
      new SelectOption('12845633', '04. [Intelligent & Monetizable Services]'),
      new SelectOption('12731018', '05. [Enterprise]'),
      new SelectOption('9839128', '06. [Shell]'),
      new SelectOption('12507638', '07. [WindowsDevices]'),
      new SelectOption('12964544', '08. [MMX]'),
      new SelectOption('9839420', '09. [Edu]'),
      new SelectOption('5346262', '10. [agility]'),
    ]);
  }

  getIterationPathOptions(): Promise<SelectOption[]> {
    let paths = [
      'OS',
      'OS\\Future',
      'OS\\1701',
      'OS\\1702',
      'OS\\1703',
      'OS\\1704',
      'OS\\1705',
      'OS\\1706',
      'OS\\1707',
      'OS\\1708',
      'OS\\1709',
      'OS\\1710',
      'OS\\1711',
      'OS\\1712',
      'OS\\1601',
      'OS\\1602',
      'OS\\1603',
      'OS\\1604',
      'OS\\1605',
      'OS\\1606',
      'OS\\1607',
      'OS\\1608',
      'OS\\1609',
      'OS\\1610',
      'OS\\1611',
      'OS\\1612'
    ];
    let options: SelectOption[] = [];
    paths.forEach(path => options.push(new SelectOption(path)));

    return Promise.resolve(options);
  }

  getPmLeadOptions(): Promise<SelectOption[]> {
    return Promise.resolve([
      new SelectOption('lec', 'Leslie Chen'),
      new SelectOption('dalena', 'Dalen Abraham'),
      new SelectOption('seanlynd', 'Sean Lyndersay'),
      new SelectOption('davebu', 'Dave Buchthal'),
      new SelectOption('brucemor', 'Bruce Morgan'),
      new SelectOption('sebpoulo', 'Sebastian Poulose'),
      new SelectOption('timscud', 'Tim Scudder'),
      new SelectOption('warrens', 'Warren Stevens'),
      new SelectOption('sboehmer', 'Scott Boehmer'),
      new SelectOption('vpai', 'Vasu Pai'),
      new SelectOption('miens', 'Michael Ens'),
      new SelectOption('bobs', 'Bob Schroder'),
      new SelectOption('lauramcd', 'Laura McDermott'),
      new SelectOption('dsheldon', 'David Sheldon'),
      new SelectOption('mahesht', 'Mahesh Tharamal'),
    ]);
  }

  getDevLeadOptions(): Promise<SelectOption[]> {
    return Promise.resolve([
      new SelectOption('brucemor', 'Bruce Morgan'),
      new SelectOption('miens', 'Michael Ens'),
      new SelectOption('dsheldon', 'David Sheldon'),
      new SelectOption('sboehmer', 'Scott Boemer'),
      new SelectOption('bobs', 'Bob Schroder'),
      new SelectOption('sebpoulo', 'Sebastian Poulose'),
      new SelectOption('timscud', 'Tim Scudder'),
      new SelectOption('vpai', 'Vasu Pai'),
      new SelectOption('warrens', 'Warren Stevens'),
      new SelectOption('amitkun', 'Amit Kundlia'),
      new SelectOption('aprabhu', 'Akshay Prabhu'),
      new SelectOption('maheshjh', 'Mahesh Kumar'),
      new SelectOption('irfana', 'Irfan Ahmed'),
      new SelectOption('manojb', 'Manoj Biswas'),
      new SelectOption('lauramcd', 'Laura McDermott'),
    ]);
  }

  getDnaLeadOptions(): Promise<SelectOption[]> {
    return Promise.resolve([
      new SelectOption('rajkm', 'Rajkumar Mohanram'),
      new SelectOption('joonc', 'Joon Chang'),
      new SelectOption('imrans', 'Imran Sargusingh'),
      new SelectOption('psing', 'Prashant Singh'),
      new SelectOption('shriramn', 'Shriram Nanjundaiah'),
      new SelectOption('poornims', 'Poornima Siddabattuni'),
    ]);
  }

  getDesignLeadOptions(): Promise<SelectOption[]> {
    return Promise.resolve([
      new SelectOption('ryanhas', 'Ryan Hastings'),
      new SelectOption('daosborn', 'Dan Osborn'),
      new SelectOption('keno', 'Ken Ouellette'),
      new SelectOption('lacascio', 'Lauren Cascio'),
    ]);
  }

  // private
  private processAreaPaths(vsoPathNode: any, root: string = 'OS\\WE', paths: Array<string> = []): Array<string> {
    if(vsoPathNode.name) {
      let path = root + '\\' + vsoPathNode.name;

      // if(path === 'OS\\WE\\EDGE' || path.startsWith('OS\\WE\\EDGE\\z')) {
      if(true) {
        let segmentCount = path.split('\\').length;

        if(segmentCount <= 10) {
          paths.push(path);

          if(vsoPathNode.hasChildren) {
            vsoPathNode.children.forEach((child: any) => this.processAreaPaths(child, path, paths));
          }
        }
      }
    }
    return paths;
  }

  private applyTypeFilters(workItemTypes: VsoWortItemType[], useTarget: boolean = false): string {
    let types = !!workItemTypes && workItemTypes.length
      ? workItemTypes.map(item => item.toString())
      : [];
    // Required when querying WorkItemLink table
    let prefix = useTarget
      ? '[Target].'
      : '';

    return types.length
      ? `And ${prefix}[${vso.workItemType}] In ('${types.join("','")}')`
      : '';
  }

  private applySearchFilters(searchCriteria: ISearchCriteria, options?: SearchControlMask, asRelated = false): string {
    if(!searchCriteria) { return ''; }

    let query = '';
    let {
      areaPaths,
      release,
      promise,
      iterationPath,
      pmGroupLead,
      devGroupLead,
      dnaGroupLead,
      designGroupLead
    } = searchCriteria;
    let underPaths: Array<string> = [];

    let prefix = asRelated ? 'Target.' : '';

    options = options || new SearchControlMask();

    if(options.areaPath) {
      if(!areaPaths || !areaPaths.length) {
        areaPaths.push('OS\\WE\\EDGE');
      }
      let paths = this.unique(areaPaths || []);

      paths.forEach(path => underPaths.push(`${prefix}[${vso.areaPath}] Under '${path}'`));
      query += ' And (' + underPaths.join(' Or ') + ')';
    }

    if(options.release) {
      if(!!release) {
        query += ` And ${prefix}[${vso.release}] = '${release}'`;
      }
    }

    if(options.iteration) {
      if(!!iterationPath) {
        query += ` And ${prefix}[${vso.iteration}] = '${iterationPath}'`;
      }
    }

    if(options.pmGroupLead) {
      if(!!pmGroupLead) {
        query += ` And ${prefix}[${vso.pmOwner}] In Group '[microsoft]\\o_${pmGroupLead}'`;
      }
    }

    if(options.devGroupLead) {
      if(!!devGroupLead) {
        query += ` And ${prefix}[${vso.devOwner}] In Group '[microsoft]\\o_${devGroupLead}'`;
      }
    }

    if(options.dnaGroupLead) {
      if(!!dnaGroupLead) {
        query += ` And ${prefix}[${vso.qualityOwner}] In Group '[microsoft]\\o_${dnaGroupLead}'`;
      }
    }

    if(options.designGroupLead) {
      if(!!designGroupLead) {
        query += ` And ${prefix}[${vso.assignedTo}] In Group '[microsoft]\\o_${designGroupLead}'`;
      }
    }

    return query;
  }

  unique(array: any[]): any[] {
    let a = array.concat();

    for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
        if(a[i] === a[j]) {
          a.splice(j--, 1);
        }
      }
    }

    return a;
  }
}

const toWorkItem = function(vsoWorkItemResult: any, fields: string[] = []): WorkItem {
  // All vso workitem data is in fields prop
  let source = vsoWorkItemResult.fields;
  // Init workitem with required fields
  let item = new WorkItem({
    id: source[vso.id] || 0,
    workItemType: source[vso.workItemType] || ''
  });

  fields.forEach(field => {
    let key = vso.keyOf(field);

    if(key === 'tags') {
      item.tags = splitTags(source[field]);
    } else if(
      key === 'availableDate' ||
      key === 'createdDate' ||
      key === 'detectedDate' ||
      key === 'finishDate' ||
      key === 'resolvedDate' ||
      key === 'startDate'
      ) {
      let d = new Date(source[field]);

      if(!isNaN(d.getTime())) {
        let yyyy = d.getFullYear().toString();
        let mm = (d.getMonth()+1).toString();
        let dd  = d.getDate().toString();

        item[key] = d;
        item[key + 'String'] = `${mm}/${dd}/${yyyy}`;
      }
    } else {
      item[key] = source[field];

      if(key === 'customString08') {
        item['shortname'] = toShortname(source[field]);
        // to accomodate a 2nd SagaGrid shortname column
        item['shortname2'] = item['shortname'];
      }
    }
  });

  return item;
}

const toScenario = function(vsoResult: any, fields: string[] = []): ScenarioWorkItem {

  let source = vsoResult.fields;

  let item = new ScenarioWorkItem({
    id: source[vso.id] || 0,
    workItemType: source[vso.workItemType] || 'Scenario'
  });

  fields.forEach(field => {
    let key = vso.keyOf(field);

    if(key === 'tags') {
      item[key] = splitTags(source[field]);
    } else {
      item[key] = source[field];

      // we always want a shortname and shortname2 version of customString08
      if(key === 'customString08') {
        item['shortname'] = toShortname(source[field]);
        // to accomodate a 2nd SagaGrid shortname column
        item['shortname2'] = item['shortname'];
      }
    }
  });

  return item;
}

const toShortname = function(val: string): string {
  let original = val || "";
  let segments = original.split('|');

  return segments.length > 1
    ? segments[segments.length - 1].trim()
    : original;
}

const confidenceFromTags = function(tagString: string): string {
  if(!tagString || !tagString.length) { return ''; }

  let tags = splitTags(tagString);

  let confidence = ConfidenceLevel.UNKNOWN;

  tags.forEach(tag => {
    let t = tag.toLowerCase();

    if(t.startsWith('edgeconf:')) {
      switch(t.slice(9)) {
        case 'low':
          confidence = ConfidenceLevel.LOW;
          break;
        case 'med':
          confidence = ConfidenceLevel.MED;
          break;
        case 'high':
          confidence = ConfidenceLevel.HIGH;
          break;
      }
    }
  });

  return confidence.toString();
}

const splitTags = function(tagList: string): string[] {
  let tags: string[] = [];

  if(tagList) {
    tags = tagList.split(';').map(item => item.trim().toLowerCase());
  }

  return tags;
}

enum ConfidenceLevel {
  UNKNOWN = <any>'',
  LOW = <any>'Low',
  MED = <any>'Med',
  HIGH = <any>'High'
}


export enum BugTypes {
  servicing = <any>'servicing',
  edgeCrit = <any>'edgeCrit',
  riBlocking = <any>'riBlocking',
  blockingEngineeringSignoff = <any>'blockingEngineeringSignoff',
  hot = <any>'hot',
  triagedP0 = <any>'triagedP0',
  triagedP1 = <any>'triagedP1',
  triagedP2 = <any>'triagedP2',
  triagedP3 = <any>'triagedP3',
  triagedOther = <any>'triagedOther',
  resolved = <any>'resolved',
}

export class BugMap {
  private _ids: number[] = [];
  private _bugs: {[key: string]: WorkItem} = {};

  private _servicingIds: number[] = [];
  private _edgeCritIds: number[] = [];
  private _riBlockingIds: number[] = [];
  private _blockingEngineeringSignoffIds: number[] = [];
  private _hotIds: number[] = [];

  private _triagedP0Ids: number[] = [];
  private _triagedP1Ids: number[] = [];
  private _triagedP2Ids: number[] = [];
  private _triagedP3Ids: number[] = [];
  private _triagedOtherIds: number[] = [];

  private _resolvedIds: number[] = [];

  addIds(bugIds: number[], bugType: BugTypes) {

    this._ids = this._ids.concat(bugIds);

    switch(bugType) {
      case BugTypes.servicing:
        this._servicingIds = this._servicingIds.concat(bugIds);
        break;
      case BugTypes.edgeCrit:
        this._edgeCritIds = this._edgeCritIds.concat(bugIds);
        break;
      case BugTypes.riBlocking:
        this._riBlockingIds = this._riBlockingIds.concat(bugIds);
        break;
      case BugTypes.blockingEngineeringSignoff:
        this._blockingEngineeringSignoffIds = this._blockingEngineeringSignoffIds.concat(bugIds);
        break;
      case BugTypes.hot:
        this._hotIds = this._hotIds.concat(bugIds);
        break;
      case BugTypes.triagedP0:
        this._triagedP0Ids = this._triagedP0Ids.concat(bugIds);
        break;
      case BugTypes.triagedP1:
        this._triagedP1Ids = this._triagedP1Ids.concat(bugIds);
        break;
      case BugTypes.triagedP2:
        this._triagedP2Ids = this._triagedP2Ids.concat(bugIds);
        break;
      case BugTypes.triagedP3:
        this._triagedP3Ids = this._triagedP3Ids.concat(bugIds);
        break;
      case BugTypes.triagedOther:
        this._triagedOtherIds = this._triagedOtherIds.concat(bugIds);
        break;
      case BugTypes.resolved:
        this._resolvedIds = this._resolvedIds.concat(bugIds);
        break;
    }
  }

  AddBugs(bugs: WorkItem[]) {
    bugs.forEach(bug => this._bugs[bug.id] = bug);
  }

  get bugs(): WorkItem[] {
    return this.pullBugs(this._ids);
  }

  get ids(): number[] {
    return this._ids.slice();
  }

  get servicingBugs(): WorkItem[] {
    return this.pullBugs(this._servicingIds);
  }

  get servicingIds(): number[] {
    return this._servicingIds.slice();
  }

  get edgeHighImpactBugs(): WorkItem[] {
    return this.pullBugs(this._edgeCritIds);
  }

  get edgeCritIds(): number[] {
    return this._edgeCritIds.slice();
  }

  get riBlockingBugs(): WorkItem[] {
    return this.pullBugs(this._riBlockingIds);
  }

  get riBlockingIds(): number[] {
    return this._riBlockingIds.slice();
  }

  get blockingEngineeringSignoffBugs(): WorkItem[] {
    return this.pullBugs(this._blockingEngineeringSignoffIds);
  }

  get blockingEngineeringSignoffIds(): number[] {
    return this._blockingEngineeringSignoffIds.slice();
  }

  get hotBugs(): WorkItem[] {
    return this.pullBugs(this._hotIds);
  }

  get hotIds(): number[] {
    return this._hotIds.slice();
  }

  get triagedP0Bugs(): WorkItem[] {
    return this.pullBugs(this._triagedP0Ids);
  }

  get triagedP0Ids(): number[] {
    return this._triagedP0Ids.slice();
  }

  get triagedP1Bugs(): WorkItem[] {
    return this.pullBugs(this._triagedP1Ids);
  }

  get triagedP1Ids(): number[] {
    return this._triagedP1Ids.slice();
  }

  get triagedP2Bugs(): WorkItem[] {
    return this.pullBugs(this._triagedP2Ids);
  }

  get triagedP2Ids(): number[] {
    return this._triagedP2Ids.slice();
  }

  get triagedP3Bugs(): WorkItem[] {
    return this.pullBugs(this._triagedP3Ids);
  }

  get triagedP3Ids(): number[] {
    return this._triagedP3Ids.slice();
  }

  get triagedOtherBugs(): WorkItem[] {
    return this.pullBugs(this._triagedOtherIds);
  }

  get triagedOtherIds(): number[] {
    return this._triagedOtherIds.slice();
  }

  get resolvedBugs(): WorkItem[] {
    return this.pullBugs(this._resolvedIds);
  }

  get resolvedIds(): number[] {
    return this._resolvedIds.slice();
  }

  private pullBugs(ids: number[]) {
    let uniqueIds = this.unique(ids);

    return uniqueIds.reduce((accum, id) => {
      if(!!this._bugs[id]) {
        accum.push(this._bugs[id]);
      }
      return accum;
    }, []);
  }

  private unique(array: any[]): any[] {
    let a = array.concat();

    for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
        if(a[i] === a[j]) {
          a.splice(j--, 1);
        }
      }
    }

    return a;
  }
}
