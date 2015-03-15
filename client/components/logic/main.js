    console.log('Are we there yet?');
    'use strict';

angular.module('logicdocApp')
  .config(function ($stateProvider) {
    var rootConfig = {"state":"ldoc.sample","template":"Welcome to the jungle.<br/>\r\n      <a href=\"/ldoc\">back</a>\r\n      ","url":"/test/"};
    console.log('rootConfig:', rootConfig);
    $stateProvider
      .state(rootConfig.state, {
        url: rootConfig.url,
        template: rootConfig.template,
        controller: 'LdocCtrl'
      });
  });