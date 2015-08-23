# Code challenge: Watchmen

# Library

Watchmen is a lightweight cross-browser library for event tracking. Using Web Sockets, we can track some interesting interactions of the user in a web page. It's only 6.4Kb minified and its only dependency is [socket.io](http://socket.io/).

## Getting started

Just include `dist/watchmen.min.js` in your project and do:

```js
Watchmen.init();
```

You can optionally pass an array of the events you want to track, otherwise all supported events will be tracked. When you're done, simply call:

```js
Watchmen.teardown();
```

And all event listeners will be removed. If you want to log a custom event, or manually add an entry for an event that you cancelled/stopped from propagating, do:

```js
Watchmen.logCustomEvent(event);
```

and the info you pass will be sent to the server, with the property `isCustom: true`.

## Supported events

+ `init`
  + Custom event used to track when a page is loaded and send the user id, user agent and timestamp to the server
+ `click`
+ `keyup`
  + Throttled so we don't add lag
+ `scroll`, `wheel`, `mousewheel`
  + Throttled so we don't add lag
+ `mousemove`
  + Logs the cursor position every x seconds (throttled)
+ `focus` and `blur`
  + Track when a field gets or losts focus
  + Also track inactivity (focus out of the page)
+ `resize`
  + Track width and height of the window
  + Debounced so we don't add lag
+ `submit`

## Tampering

Watchmen only exposes the three methods detailed above. The only way a user can interfere with the plugin is by calling `Watchmen.teardown();`. A way to avoid this would be to remove the public API and assume that whenever the plugin is included, it will be logging events.

## Future work

+ Adding a way to remove the public API.
+ Add aliases to avoid event "duplication" (focus: focusin, focusout).
+ Add a heatmap on top of the page for cursor positions.
+ Do client side optimizations such as aggregating events ([wheel, mousewheel] for IE, [submit, click on button], ...).
+ Add browserify for `require` support and better build workflow.
+ Pass initial timestamp from the server, sending timestamps relative to that.
+ Generate a unique user id (randomized now), ideally calculated in the backend from user IP, geolocation, etc.
+ To be able to tell apart submits (enter on field vs. click on submit button).
+ Add a way to configure the socket.io server.
+ Add a way to configure/extend the EventLogger features.
+ Implement Web Sockets communication from scratch.

# Watchmen Server

## Getting started

To start Watchmen Server, run:

```bash
$ cd server
$ npm install
$ node index.js
```

The socket.io server will listen on `http://localhost:3000/`. Then visit http://localhost:3000/ to see the dashboard logging the received events from the clients.

## Future work

+ Implementing a server that listens to Web Sockets from scratch.
+ Send events *only* to dashboard, avoid the broadcast.

# Watchmen example

Just open `client.html` in your favourite browser and see the events logged both here and in the dashboard.

## Future work

+ Add a way to start/stop logging from the UI.

# References

+ http://www.anujgakhar.com/2013/05/22/cross-browser-event-handling-in-javascript/
+ http://blog.garstasio.com/you-dont-need-jquery/events/
+ https://gist.github.com/nuxodin/9250e56a3ce6c0446efa
+ http://stackoverflow.com/questions/7790725/javascript-track-mouse-position
+ https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
+ https://github.com/jashkenas/underscore/blob/master/underscore.js#L800
+ http://stackoverflow.com/questions/7790725/javascript-track-mouse-position
+ https://gist.github.com/spektraldevelopment/c878922803e6101f66f4
+ http://ryanve.com/lab/dimensions/
+ http://socket.io/get-started/chat/
