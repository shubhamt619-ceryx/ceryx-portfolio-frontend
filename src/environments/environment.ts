// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appVersion: 'ceryxPortfoliov0.0.1',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: false,
  //apiUrl: 'http://103.148.157.103:8081/'
  apiUrl: 'http://13.234.70.155:5000/',
  s3BaseUrl : 'https://s3tomb1.s3.ap-south-1.amazonaws.com/',
  viewerUrl: 'http://localhost:4300/view/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
