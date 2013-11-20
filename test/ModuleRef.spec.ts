/// <reference path="../typings/for-tests.d.ts" />
/// <reference path="../lib/tsmc/moduleRef.ts" />

var path = require('path');
var chai = require('chai')
  , expect = chai.expect
  , should = chai.should();

describe('ModuleRef', function(){

  describe('.factory(location)', function(){
    it('should complain when location is a directory which contains multiple configuration files', function(){
      expect(function() {
        var ref = ModuleRef.factory("test/fixtures/multipleConfigs");
      }).to.throw(/Multiple module definition/);
    })

    it('should find .tsm configuration', function() {
      var ref = ModuleRef.factory("test/fixtures/tsmConfigured");
      ref.location.should.equal(path.join(__dirname, "fixtures/tsmConfigured/module.tsm"));
    })

    it('should find package.json configuration', function() {
      var ref = ModuleRef.factory("test/fixtures/pkgConfigured");
      ref.location.should.equal(path.join(__dirname, "fixtures/pkgConfigured/package.json"));
    })

    it('should find module with absolute location', function() {
      var ref = ModuleRef.factory(path.join(__dirname, "fixtures/pkgConfigured"));
      ref.location.should.equal(path.join(__dirname, "fixtures/pkgConfigured/package.json"));
    })
  })

  describe('.factory(location, declaringModulePath)', function(){
    it('should find modules with path relative to declaringModulePath', function() {
      var ref = ModuleRef.factory("aChildModule", "test/fixtures/aParentModule");
      ref.location.should.equal(path.join(__dirname, "fixtures/aParentModule/aChildModule/module.tsm"));
    })

    it('should find module with absolute location', function() {
      var ref = ModuleRef.factory(path.join(__dirname, "fixtures/aParentModule/aChildModule"), "test/aParentModule");
      ref.location.should.equal(path.join(__dirname, "fixtures/aParentModule/aChildModule", "module.tsm"));
    })
  })
})