# Infrastructure Layer Setup

Infrastructure layer boilerplate for Front-End applications

## What's included

### cache-service

For caching sync/async function calls.

### error-reporter-service

Abstraction around anything that you want to use in your app for error reporting. For example, you can configure Sentry.

### persisted-storage-service

Abstraction around browsers localStorage api, but can be any storage you want.

### http

Basic Http service setup for handing application api requests/responses. With access/refresh token pair authorization flow. Access token saved on client-side, refresh token transfered via cookies.

**Refresh token flow**:

1. Setup api call retries. Three retries each 1.5s.

2. For each api call (including post, put, delete, patch) that has failed with `invalid_token` - allow retry.

3. Otherwise - deny retry flow for post, put, delete, patch calls.

4. For first failed request with `invalid_token` try to refresh token. If for some reason token has not been refreshed withing retry period from point 1 - terminate session. If refreshed - all previously failed routes will be automatically retried.

5. If refresh token failed - terminate session immediately.

6. Refresh token call won't be triggered again, even if multiple requests have failed one by one, if refresh is already in progress or next refresh request has been triggered in < 5 seconds interval. 
