[![Build Status](https://travis-ci.org/advanced-rest-client/raml-request-panel.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/raml-request-panel)

## undefined component
Tag: `<raml-request-panel>`

### Installation
Using bower:
```
bower install --save advanced-rest-client/raml-request-panel
```

The request panel view for the request defined as a RAML method.
It is a main view element for the API console to display the request panel related to the RAML
specification.

The element has it's own XHR / Fetch transport method and it will be used if the hostng application
do not handle the `api-console-request` event.

When the user request to make the HTTP request then cancellable `api-console-request` event will
be fired with the request details (see below).
The hosting application, if it about to use different transport method, should cancel the event by
calling `preventDefault()` function on the event (and possibly `stopPropagation()`) and handle the
request. If the event was not prevented (canceled) then internall Fetch/XHR will be used.

When the request is ready then the hosting app must fire the `api-console-response` event with
created Request and Response objects. This element listens on the `window` property for the
`api-console-response` event.

## Events
### api-console-request
This event is fired when the user request to make a HTTP request.
This event will have the following properties set on the `detail` object:

Property | Type | Description
----------------|-------------|----------
`url` | String | The request URL
`method` | String | The HTTP method
`headers` | String | Headers to send
`payload` | String | Payload to send
`auth` | Object | Optional. For some authorization methodss (like NTLM) the authorization header or query param can't be set and the authorization must be made on the connection. In this cases the auth object will be set with `type` and `settings` properties. While `type` is the name of the authorization method, the `settings` object depends on the authorization method and may vary. Detailed documentation for the auth methods is in the `auth-methods` element.

### api-console-response
This event must be fired when the hosring app finish the request. It must contains generated Request
and Response object according to the [Fetch specification](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).

Becaue the Fetch API is a new API not all browsers support it. In this case the polyfill must be used
in the hosted app. Add the `fetch-polyfill` element (advanced-rest-client/fetch-polyfill) to the
hosted app to have the support. It is recommended to use this element so the polyfill will be loaded
only once. See the `raml-request-panel-simple-xhr` element for example implementation.

Property | Type | Description
----------------|-------------|----------
`request` | Object | The request object as defined in the Fetch API spec.
`response` | Object | The response object as defined in the Fetch API spec.
`isXhr` | Boolean | If not set the element assumes it's true. Indicated if the transport method doesn't support advanced timings and redirects information. See below.
`error` | Error | When the request / response is errored (`request.ok` equals `false`) then the error object should be set with the human readable message that will be displayed to the user.
`loadingTime` | Number | The response full loading time

See `Advanced transport options` for more event options.

### Example
```
<raml-request-panel
  method="[[ramlMethod]]"
  redirect-url="http://oauth.redirect.url"
  request="{{request}}"
  response="{{response}}"
  response-error="{{responseError}}"
  loading-time="{{loadingTime}}"></raml-request-panel>
```

## Advanced transport options
The response panel in the ARC elements is able to display the response in simple and advanced view.

Simple is meant to be used when the HTTP request has been made by the simple transports like XHR or
Fetch. It just displays the response status, headers and paylaod.

Advanced view is reserved for transport methods that are able to generate additional informations
about the request and resposne. This information is timings for the request/response, timings for
the redirects and information about redirects.

When the advanced options are set then the `isXhr` flag on the `api-console-response` event's detail
object must be set to true.

#### timings
The `timings` propery added to the `api-console-response` is the request / response timings as
defined in HAR 1.2 spec. For example:
```
"timings": {
  "blocked": 0,
  "dns": -1,
  "connect": 15,
  "send": 20,
  "wait": 38,
  "receive": 12,
  "ssl": -1,
  "comment": ""
}
```
If the `timings` property is set the `loadingTime` property is optional since it will be calculated
from the detailed timing.

#### redirectTimings
The `redirectTimings` propery added to the `api-console-response` is the list of the `timings`
objects as defined in HAR 1.2 specification.
The list should be ordered list of redirections. For example:

```
"redirect-timings": [{
  "blocked": 0,
  "dns": -1,
  "connect": 15,
  "send": 20,
  "wait": 38,
  "receive": 12,
  "ssl": -1,
  "comment": ""
}]
```

#### redirects
The `redirects` property added to the `api-console-response` event is the list of objects. Each
object should have the `headers` property as a HTTP headers string, `status` as a HTTP status
and optionally `statusText`. It is consisted with the `Response` object except the headers are
String instead of the Headers object.

```
"redirects": [Response {
  "status": 301,
  "statusText": "Moved Permanently",
  "headers": "Content-lenght: 0"
}]
```

#### sourceMessage
The HTTP source message sent to the server. It should be full message from the message header to
the request body.

### Advanced event example
```
var event = new CustomEvent('api-console-response', {
  cancelable: true,
  bubbles: true,
  composed: true,
  detail: {
    isXhr: true,
    request: request,
    response: response,
    error: new Error('Dummy error'), // Has the response details so it shouldn't be set.
    loadingTime: 125, // This is optional because timings is set
    timings: { dns: 123, ... }
    redirectTimings: [{ dns: 123, ... }],
    redirects: [redirectResponse1, ...],
    sourceMessage: 'HTTP/1.1 200 OK\n ....'
  }
});
document.body.dispatchEvent(event);
```

### Styling
`<raml-request-panel>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--raml-request-panel` | Mixin applied to the element | `{}`
`--raml-request-panel-panel-border-color` | Border color of each block in the tabs | `rgba(0, 0, 0, 0.24)`
`--raml-request-panel-container` | Mixin applied to the main content container | `{}`
`--raml-request-panel-container-narrow` | Mixin applied to the main content container when layout is narrow | `{}`
`--action-button` | Mixin applied to the action button | `{}`
`--action-button-hover` | Mixin applied to :hover state for the action button | `{}`
`--action-button-disabled` | Mixin applied to disbaled action button | `{}`
`--primary-color` | background-color of the main action button | `--primary-color`
`--primary-action-color` | Color of the main action button | `--primary-action-color`
`--action-accent-button-disabled-color` | Color of disabled action button | ``
`--primary-button-background-color` | Background color of the primary button. |`--accent-color`
`--primary-button-color` | Font color of the primary button | `#fff`
`--primary-button-hover-background-color` | Background color of the primary button when hovered. |`--accent-color`
`--primary-button-hover-color` | Font color of the primary button when hovered. | `#fff`

You can set the `narrow` property so the element will be rendered in the mobile view.
This property will be propagated to all sub-elements that uses this property to change layout.

## API
### Component properties (attributes)

#### method
- Type: `Object`
A RAML node representing a method node in RAML definition.
It should be obtained from the `raml-path-to-object` element.

#### selectedTab
- Type: `number`
- Default: `0`
Selected request tab.

#### contentType
- Type: `string`
Current content type.

#### isPayloadRequest
- Type: `boolean`
- Default: `false`
- Read only property
Computed value if the method can carry a payload

#### headers
- Type: `string`
Headers for the request.

#### payload
- Type: `string`
Body for the request

#### url
- Type: `string`
Current URL

#### narrow
- Type: `boolean`
If set it will renders the view in the narrow layout.

#### narrowWidth
- Type: `string`
- Default: `"768px"`
A widith below which the `narrow` property will be set to true.

#### loadingRequest
- Type: `boolean`
- Default: `false`
- Read only property
If true then the request is currently loaded.

#### responseIsXhr
- Type: `boolean`
- Read only property
If true then the request was made using the XHR object (it has less data in the response).

#### request
- Type: `Request`
- Read only property
The request object created by the transport.
It should be the `Request` object as defined in the Fetch API spec.
This element provides the polyfill for this API.

#### response
- Type: `Response`
- Read only property
The response object from the transport.
It should be the `Response` object as defined in the Fetch API spec.
This element provides the polyfill for this API.

#### responseError
- Type: `Object`
- Read only property
Set when the response errored.

#### loadingTime
- Type: `number`
- Read only property
Response full loading time.

#### timings
- Type: `Object`
- Read only property
If the transport method is able to collect detailed information about request timings
then this value will be set. It's the `timings` property from the HAR 1.2 spec.

#### redirectTimings
- Type: `Array`
- Read only property
If the transport method is able to collect detailed information about redirects timings
then this value will be set. It's a list of `timings` property from the HAR 1.2 spec.

#### redirects
- Type: `Array`
- Read only property
It will be set if the transport method can generate information about redirections.

#### sourceMessage
- Type: `string`
- Read only property
Http message sent to the server.

This information should be available only in case of advanced HTTP transport.

#### authRequired
- Type: `boolean`
Received from the authorization panel state if authorization is required

#### authValid
- Type: `boolean`
Received from the authorization panel state if authorization data is valid

#### redirectUrl
- Type: `string`
OAuth2 redirect URL

#### authMethod
- Type: `string`
Selected by the user auth method (if any)

#### authSettings
- Type: `Object`
Current authorization settings.

#### urlInvalid
- Type: `boolean`
Computed value when the URL change.
If not valid form submission won't be possible.

#### noUrlEditor
- Type: `boolean`
Hides the URL editor from the view.
The editor is still in the DOM and the `urlInvalid` property still will be set.

#### baseUri
- Type: `string`
A base URI for the API. To be set if RAML spec is missing `baseUri`
declaration and this produces invalid URL input. This information
is passed to the URL editor that prefixes the URL with `baseUri` value
if passed URL is a relative URL.

#### queryModel
- Type: `Object`
Computed model for query parameters

#### uriModel
- Type: `Object`
Computed model for URI parameters

#### hasUriParameters
- Type: `boolean`
Computed value from the parameters model

#### hasQueryParameters
- Type: `boolean`
Computed value from the parameters model

#### hasParameters
- Type: `boolean`
Computed value from the parameters model

#### noAuth
- Type: `boolean`
- Default: `true`
- Read only property
Value computed when RAML method change.
It is set to true when authorization is not defined for current
endpoint's method.


### Component methods

#### execute
- Return type: `undefined`
Execute the request with current settings.
This method fires the `api-console-request` so the request can be handled by the
hosting app.
Hosting app must call `event.preventDefault()` on the event otherwise the console
will attempt to make a request usnig XHR object.
#### authAndExecute
- Return type: `undefined`
Performs an authorization by bringing up the authorization
form in a popup and after successful authorization executes the
request.
#### serializeRequest
- Return type: `undefined`
Returns an object with the request properties.
The object contains:
- method (String)
- url (String)
- headers (String)
- payload (String)
- auth (Object)

The `auth` property is optional and is only added to the request if simple `authorization`
header will not work. For example NTLM auth method has to be made on a single socket
connection (authorization and the request) so it can't be made before the request.

The `auth` object contains 2 properties:
- type (String) the authorization type - one of from the `auth-methods` element
- settings (Object) Authorization parameters entered by the user. It vary and depends on
selected auth method. For example in case of the NTLM it will be: `username`, `password` and
`domain`.

## undefined component
Tag: `<raml-request-panel-simple-xhr>`

### Installation
Using bower:
```
bower install --save advanced-rest-client/raml-request-panel-simple-xhr
```

The `raml-request-panel-simple-xhr` is an element that executes the request if the hosted app do
not handle the `api-console-request` event.

It can be used as a boilerplate for communication with the `raml-request-panel` element to handle
request event, execute the request and return the result.

The `raml-request-panel` is based on the fetch's API Request and Response object. The returning
event transport them to the source element.
Because the Response object is not intended to carry a custom errors, in case of error, the
Response object only carrying nformation `response.ok` equals `false` and the `error` Error
object is added to the event's detail object.

This element don't listen for the `api-console-request` event giving a chance for the hosted app to
handle it. If the hosted app intend to handle the requests it should listen for an event:

```
window.addEventListener('api-console-request', function(e) {
  var data = e.detail;
  console.log(data.url);
  console.log(data.method);
  console.log(data.payload);
  console.log(data.headers);
  console.log(data.auth); // optional, see `raml-request-panel.serializeRequest()`
});

```

After the request is made (successfully or not) the `api-console-response` event must be fired.
It should have `request` and `response` objects added to the event's `detail` object. If the request
is errored the it must contain additional `error` proeprty which is JS' Error object with the human
readable message (it will be displayed as an error message).
Additionaly the detail object can contain the `isXhr` property which is set to true be default.
It should be set to false if the request has been made by more than XHR advanced transport which
dives information about timings and redirects.

See the `response-panel` for more information.

```
var event = new CustomEvent('api-console-request', {
  cancelable: false,
  bubbles: true,
  composed: true,
  detail: {
    request: new Request(...),
    response: new Response(body, {status: 200})
  }
});
this.dispatchEvent(event);
```

Becaue the Fetch API is a new API not all browsers support it. Therefore the polyfill must be used
in the hosted app. Add the `fetch-polyfill` element (advanced-rest-client/fetch-polyfill) to the
hosted app to have it supported.

Because this element fires back an event it has to be attached to the DOM.

## API
### Component properties (attributes)

#### loading
- Type: `boolean`
- Default: `false`
- Read only property
If true then the request is currently loaded.

#### request
- Type: `Object`
Generated Request object during the latest request

#### response
- Type: `Object`
Generated Response object during the latest request

#### error
- Type: `Object`
Generated error object during the latest request

#### loadingTime
- Type: `number`
Total request / response time


### Component methods

#### execute
- Return type: `undefined`
Executes the request.

