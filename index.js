
/**
 * This adds and onclick handler to the element which first fires an
 * mBox event and delays navigation (default 500ms).
 *
 * Usage: test_and_target(element, {mBoxName: "MyMBox"});
 * config options:
 *   mBoxName (required) : the name of the mbox
 *   href : (default el.href) the link to travel to after firing mBox event
 *   delay : (default 500ms) how long to wait before navigation
 */

var events = require('event')
  , definedBoxes = {};

module.exports = function(el, config){
  var delay = config.delay || 500
    , href = config.href || el.href;

  if (!config.mBoxName) {
    console.error("No mBoxName given");
    return false;
  }
  if (!href) {
    console.error('Element has no href, and config.href not given');
    return false;
  }
  if (!window.mboxDefine || !window.mboxUpdate) {
    console.error('mboxDefine and mboxUpdate must be available');
    return false;
  }

  // Couldn't find any reasonable omniture API for detecting whether
  // it's been created or not. But then, their documentation is
  // terrible.
  if (!definedBoxes[config.mBoxName]){
    definedBoxes[config.mBoxName] = true;
    try {
      var mboxDiv = document.createElement('div')
        , id = 'mbox-' + config.mBoxName + '-' + Math.random().toFixed(10).slice(2);
      mboxDiv.id = id;
      document.body.appendChild(mboxDiv);
      mboxDefine(id, config.mBoxName);
    } catch (ex) {
      console.error('mboxDefine failed: ' + ex);
      return false;
    }
  }

  events.bind(el, 'click', function(e){
    if (e.preventDefault)
      e.preventDefault();
    else // IE 8
      e.returnValue = false;
    mboxUpdate(config.mBoxName, 'Destination=' + href);
    window.setTimeout(function(){
      window.location.href = href;
    }, delay);
    return false;
  });
  return true;
};

module.exports.clearBoxes = function(){
  definedBoxes = {};
};
