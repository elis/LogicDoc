'use strict';

angular.module('logicdocApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('ldoc', {
        url: '/ldoc',
        templateUrl: 'app/ldoc/ldoc.html',
        controller: 'LdocCtrl'
      });
  });