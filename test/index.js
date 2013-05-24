
var expect = require("chai").expect
  , tnt = require('test-and-target');

mocha.globals(['mboxUpdate', 'mboxDefine']);

var clickElement = function(el){
  if (!el.click){ // phantomjs
    var ev = document.createEvent("MouseEvent");
    ev.initEvent('click', true, false);
    el.dispatchEvent(ev);
  } else {
    el.click();
  }
};

describe("test-and-target", function(){

  it('should fail if no mBoxName is given', function(){
    expect(tnt(document.body, {})).to.be.false;
  });
  it('should fail if no href is found', function(){
    expect(tnt(document.body, {mBoxName: 'box'})).to.be.false;
  });

  describe('given an <a> tag with an href', function(){
    var el
      , log
      , hash = '#nav-to';

    beforeEach(function(){
      el = document.createElement('a');
      el.setAttribute('href', hash);
      document.body.appendChild(el);
      log = {};
      window.mboxDefine = sinon.spy();
    });
    afterEach(function(){
      el.parentNode.removeChild(el);
      window.mboxDefine = undefined;
      log = null;
      tnt.clearBoxes();
    });

    it('should succeed', function(){
      window.mboxDefine = function(){};
      window.mboxUpdate = function(){};
      expect(tnt(el, {mBoxName: 'french'})).to.be.true;
    });
    it('should call mboxDefine once', function(){
      expect(tnt(el, {mBoxName: 'french'})).to.be.true;
      expect(mboxDefine.callCount).to.eql(1);
      expect(mboxDefine.firstCall.args[1]).to.eql('french');
    });

    it('should fail if mboxUpdate is not in global scope', function(){
      window.mboxUpdate = null;
      expect(tnt(el, {mBoxName: 'french'})).to.be.false;
    });

    it('should fail if mboxDefine is not in global scope', function(){
      window.mboxDefine = null;
      expect(tnt(el, {mBoxName: 'french'})).to.be.false;
    });

    describe('when the element is clicked', function(){
      var ulog, oldTimeout, delay = 100, mBoxName = 'french';
      beforeEach(function(){
        oldTimeout = setTimeout;
        window.setTimeout = sinon.spy();
        window.mboxUpdate = sinon.spy();
        tnt(el, {mBoxName: mBoxName, delay: delay});
        clickElement(el);
      });
      afterEach(function(){
        window.setTimeout = oldTimeout;
        window.mboxUpdate = undefined;
      });
      it('setTimeout should be called with the right delay', function(){
        expect(setTimeout.callCount).to.eql(1);
        expect(setTimeout.firstCall.args[1]).to.eql(delay);
      });
      it('the location should change after <delay>', function(){
        setTimeout.firstCall.args[0]();
        expect(window.location.hash).to.equal(hash);
        window.location.hash = '';
      });
      describe('mboxUpdate', function(){
        it('should be fired', function(){
          expect(mboxUpdate.callCount).to.eql(1);
        });
        it('should be called with the mboxname', function(){
          expect(mboxUpdate.firstCall.args[0]).to.eql(mBoxName);
        });
      });
    });
  });
  describe('called twice with the same mboxname and two different els', function(){
    var el, el2, log, mBoxName = 'german';

    beforeEach(function(){
      el = document.createElement('a');
      el.setAttribute('href', '#el1');
      document.body.appendChild(el);
      el2 = document.createElement('a');
      el2.setAttribute('href', '#el2');
      document.body.appendChild(el2);
      log = {};
      window.mboxDefine = sinon.spy();
      window.mboxUpdate = function(){};
    });
    afterEach(function(){
      el.parentNode.removeChild(el);
      el2.parentNode.removeChild(el2);
      window.mboxDefine = undefined;
      log = null;
      tnt.clearBoxes();
    });

    it("shouldn't call mboxDefine twice", function(){
      expect(tnt(el, {mBoxName: mBoxName})).to.be.true;
      expect(tnt(el2, {mBoxName: mBoxName})).to.be.true;
      expect(mboxDefine.callCount).to.eql(1);
      expect(mboxDefine.firstCall.args[1]).to.eql(mBoxName);
    });
  });
});
