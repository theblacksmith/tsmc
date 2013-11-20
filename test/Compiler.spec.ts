/// <reference path="../typings/for-tests.d.ts" />
/// <reference path="../lib/tsmc/compiler.ts" />
/// <reference path="getme.ts" />

var chai = require('chai')
  , expect = chai.expect
  , should = chai.should();


describe('Compiler', function(){

  describe('.removeRefsFromFile', function() {
    
    it('should remove all references from compile submodules when compiling the parent module'/*, function(){
      var c = new Compiler(getme('the abs path of', 'fixtures'));
      var someRefs = ['ref1.d.ts', 'ref2.ts', 'AndRef3.whatever.d.ts'];

      var file = getme('a file which references', someRefs);
      
      expect(
        c.removeRefsFromFile(file, someRefs).trim())
      .to.be.empty;
    }*/)
    
    it('should NOT remove other references'/*, function(){
      var c = new Compiler(getme('the abs path of', 'fixtures'));
      var someRefs = ['ref1.d.ts', 'ref2.ts', 'AndRef3.whatever.d.ts'];

      var file = getme('a file which references', someRefs);
      
      expect(
        c.removeRefsFromFile(file, someRefs.slice(0,-1)).trim())
      .to.be.equal("/// <reference path='AndRef3.whatever.d.ts' />");
    }*/)
  })

  //compile(tsmPath: string, onError?: (error: string) => void);
  //compile(tsmRef: ModuleRef, onError?: (error: string) => void);
  //compile(tsmConfig: ModuleConfig, modPath: string, onError?: (error: string) => void);
  describe('.compile', function(){
    
    it('should find and compile a module from a path');
    it('should find and compile a module from a ModuleRef');
    it('should compile a module from a ModuleConfig');

  })

})