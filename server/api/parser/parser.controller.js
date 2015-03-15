'use strict';

var _ = require('lodash');
var Parser = require('./parser.model');
var cache = {};

var LogicDoc = {
  parse: function (source, tags, parentTag) {
    var result = source.replace(/\{\{(.*)\}\}/g, function (match, tag, offset, string) {
      if (tags[tag]) {
        if (typeof tags[tag] == 'function') {
          return tags[tag]();
        } 
        else if (typeof tags[tag] == 'string') {
          return LogicDoc.parse(tags[tag], tags, tag);
        }
        else
          return tags[tag];
      }
      return "{{ NOMATCH: "+tag+" }}";
    });

    return result;
  }
}


// Get list of parsers
exports.index = function(req, res) {

  


  var toml = require('toml'),
      fs = require('fs');

  var templateFile = './client/app/ldoc/ldoc.html';

  // var lraw = fs.readFileSync('./client/first.ldoc');
  var lraw = fs.readFileSync('./client/test.ldoc');
  var ldoc = toml.parse(lraw);

  if (ldoc.page) {
    if (ldoc.page.lmod == 'angular-app') {
      var mainJSPath = './client/components/logic/main.js';
      var jsData = '';

      if (ldoc.page.content && (cache["ldoc.page.content"] != ldoc.page.content)) {
        cache["ldoc.page.content"] = ldoc.page.content;
        fs.writeFileSync(templateFile, ldoc.page.content)
      }

      if (ldoc.page.js) {
        // if (cache['ldoc.page.js'] != ldoc.page.js) {
          // cache['ldoc.page.js'] = ldoc.page.js;
          jsData += ldoc.page.js
          // fs.writeFileSync(mainJSPath, ldoc.page.js);
        // }
      }
      var keys = _.keys(ldoc);

      _.forEach(ldoc.page, function (item, index) {
        var colon = index.split(':');
        if (colon[0] == 'route' && colon[1]) {
          var route = {};
          route.state = 'ldoc.' + colon[1];

          if (item.template) {
            route.template = item.template;
          }
          if (item.url) {
            route.url = item.url;
          }

          var routeJs = fs.readFileSync('./client/templates/route/route.js').toString();

          routeJs = routeJs.replace(/\{\{(.*)\}\}/g, function (match, tag, offset, string) {
            if (tag == 'root') {
              return JSON.stringify(route, true);
            } 
          });

          jsData += routeJs;
        }
      })

      var fileData = fs.readFileSync(mainJSPath).toString();
      if (fileData != jsData) {
        console.log("fileData != jsData, setting new.\n\ncache:\n", fileData, '\n\njsData:\n', jsData, '\n---------');
        fs.writeFileSync(mainJSPath, jsData);
      }

      // res.json(200, ldoc);
      res.sendfile('./client/index.html');
    }
  }
  else if (ldoc.doc) {
    var templateData = '',
      docContent = '';

    if (ldoc.settings) {
      if (ldoc.settings.template) {
        templateData = ldoc.settings.template;
      }
    }


    _.forEach(ldoc.doc, function (item, key) {
        var colon = key.split(':');
        if (!colon[1]) {
          if (typeof item == 'string') {
            if (item.substr(0,3) == '!md') {
              var marked = require('marked');
              docContent += marked(item.replace(/^(!md\s*)/, ''));
            } else
              docContent += item;
          } else {
            docContent += JSON.stringify(item, true);
          }
        } else {
          docContent += key + ": " + JSON.stringify(item, true);
        }
    })

    if (templateData) {
      var tags = _.merge({}, ldoc);
      tags.content = docContent;

      docContent = LogicDoc.parse(templateData, tags);

      fs.writeFileSync(templateFile, docContent);
    }

      res.sendfile('./client/index.html');

  }

  else res.json(200, ldoc);

  // res.json(200, ldoc);


  // Parser.find(function (err, parsers) {
  //   if(err) { return handleError(res, err); }
  //   return res.json(200, parsers);
  // });
};

// Get a single parser
exports.show = function(req, res) {
  Parser.findById(req.params.id, function (err, parser) {
    if(err) { return handleError(res, err); }
    if(!parser) { return res.send(404); }
    return res.json(parser);
  });
};

// Creates a new parser in the DB.
exports.create = function(req, res) {
  Parser.create(req.body, function(err, parser) {
    if(err) { return handleError(res, err); }
    return res.json(201, parser);
  });
};

// Updates an existing parser in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Parser.findById(req.params.id, function (err, parser) {
    if (err) { return handleError(res, err); }
    if(!parser) { return res.send(404); }
    var updated = _.merge(parser, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, parser);
    });
  });
};

// Deletes a parser from the DB.
exports.destroy = function(req, res) {
  Parser.findById(req.params.id, function (err, parser) {
    if(err) { return handleError(res, err); }
    if(!parser) { return res.send(404); }
    parser.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}