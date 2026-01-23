import * as appInsights from "applicationinsights";

const cs = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

if (cs) {
  appInsights
    .setup(cs)
    .setUseDiskRetryCaching(true)
    .start();

  // safe set cloud role name (service name)
  if (appInsights.defaultClient) {
    appInsights.defaultClient.context.tags[
      appInsights.defaultClient.context.keys.cloudRole
    ] = "week1-api";
  }

  console.log("✅ Application Insights initialized");
} else {
  console.log("ℹ️ APPLICATIONINSIGHTS_CONNECTION_STRING missing -> telemetry disabled");
}
