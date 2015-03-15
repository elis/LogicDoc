'use strict';

describe('Controller: LdocCtrl', function () {

  // load the controller's module
  beforeEach(module('logicdocApp'));

  var LdocCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LdocCtrl = $controller('LdocCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
