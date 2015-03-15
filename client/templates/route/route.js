'use strict';

angular.module('logicdocApp')
  .config(function ($stateProvider) {
    var rootConfig = {{root}};
    console.log('rootConfig:', rootConfig);
    $stateProvider
      .state(rootConfig.state, {
        url: rootConfig.url,
        template: rootConfig.template,
        controller: 'LdocCtrl'
      });
  });