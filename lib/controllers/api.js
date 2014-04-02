'use strict';



/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {



  var wordpress = require('wordpress');

  var wp = wordpress.createClient({
      "url": 'http://dev.badcass.com/', 
      "username": 'admin', 
      "password": 'ino258' 
  });

  wp.authenticatedCall("wp.getUsers", function() {
    console.log(arguments);
  });

  res.json([
    {
      name : 'HTML5 Boilerplate',
      info : 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.',
      awesomeness: 10
    }, {
      name : 'AngularJS',
      info : 'AngularJS is a toolset for building the framework most suited to your application development.',
      awesomeness: 10
    }, {
      name : 'Karma',
      info : 'Spectacular Test Runner for JavaScript.',
      awesomeness: 10
    }, {
      name : 'Express',
      info : 'Flexible and minimalist web application framework for node.js.',
      awesomeness: 10
    }
  ]);
};



