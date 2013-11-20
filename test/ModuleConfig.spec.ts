/// <reference path="../typings/for-tests.d.ts" />
/// <reference path="../lib/tsmc/moduleRef.ts" />
/// <reference path="getme.ts" />

var chai = require('chai')
  , expect = chai.expect
  , should = chai.should();

describe('ModuleConfig', function(){

  describe('new (configPath: string)', function(){
    
    it('should throw a meaningful error if configPath is invalid', function() {
      expect(function() { new ModuleConfig('/an/invalid/path') })
      .to.throw(/Invalid config path/)
    });

    it('should allow passing a parent directory path', function() {
      var dir = getme('a valid module root');
      var config = new ModuleConfig(dir);
      
      config.moduleRoot.should.equal(dir);
      config.name.should.not.be.empty;
    })

    it('should allow overriding the moduleRoot from inside the config', function() {
      var config = new ModuleConfig({ 
        name: "testing", 
        moduleRoot: getme<string>('a valid module root')}, getme<string>('an empty dir path'))
    });

    it('should default the moduleRoot to configuration file directory');
  })

  describe('new (config: object, moduleRoot?)', function(){
    
    it('should require a name', function() {
      expect(() => new ModuleConfig({}))
      .to.throw(/name.*cannot be empty/);
    });

    it('should allow moduleRoot to be null when moduleRoot is defined in the config parameter');

    it('should require the moduleRoot to be specified inside config or in moduleRoot param');

    it('should take the moduleRoot param over the config property');

  })

})