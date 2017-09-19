import { Injectable } from '@angular/core';

const ENV = process.env.ENV;

const env = {
  production: 'production',
  staging: 'staging',
  dev: 'dev',
  remote: 'remote',
  debug: 'debug',
};

// Used in page titles
let siteTitle = 'Studio SAGA';

// Development options
let logErrors = inEnv([
  env.debug,
  env.dev,
  env.remote]);

let logInfo = inEnv([
  env.debug]);

let logRouteChanges = inEnv([
  env.debug]);

// Saga API (for telemetry, scenario readiness, query deeplinking)
const apiDevEndpoint = 'http://localhost:5000/api/';
const apiProdEndpoint = 'http://studiosaga:35494/api/';

// let useDevEndpoint = true;
let useDevEndpoint = inEnv([
  env.debug,
  env.remote]);

let useCorpResources = inEnv([
  env.dev,
  env.production,
  env.staging]);

let reportTelemetry = inEnv([
  env.production]);

let isProduction = inEnv([
  env.production
]);

let isDev = inEnv([
  env.dev,
  env.remote,
])

@Injectable()
export class AppConstants {

  get sagaApiEndpoint(): string {
    return useDevEndpoint
      ? apiDevEndpoint
      : apiProdEndpoint;
  }

  get logErrors(): boolean {
    return logErrors;
  }

  get logInfo(): boolean {
    return logInfo;
  }

  get logRouteChanges(): boolean {
    return logRouteChanges;
  }

  get reportTelemetry(): boolean {
    return reportTelemetry;
  }

  get siteTitle(): string {
    return siteTitle;
  }

  get useCorpResources(): boolean {
    return (useCorpResources && (ENV !== 'remote'));
  }

  get isProduction(): boolean {
    return isProduction;
  }

  get isDev(): boolean {
    return isDev;
  }
}

function inEnv(types: string[]): boolean {
  return types.includes(ENV);
}
