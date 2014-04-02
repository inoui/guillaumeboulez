'use strict';


var index = require('./controllers');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  

  // All other routes to use Angular routing in app/scripts/app.js
  // app.get('/partials/*', index.partials);
    app.get('/listing', index.listing);
    app.get('/*', index.index);
};