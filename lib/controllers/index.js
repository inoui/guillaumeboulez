'use strict';

var fs = require('fs'),
    path = require('path'),
    config = require('../config/config');
/**
 * Send our single page app
 */
exports.index = function(req, res) {
  
  var filename = config.root+'/app/images';
  var images = dirTree(filename);
  res.render('index', images);

};



exports.listing = function(req, res) {
  var filename = config.root+'/app/media';
  var images = dirTree(filename);
  res.render('index', images);
};




function dirTree(filename) {
    var stats = fs.lstatSync(filename),
        info = {
            path: filename,
            name: path.basename(filename)
        };

    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
    } else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        info.type = "file";
    }

    return info;
}
