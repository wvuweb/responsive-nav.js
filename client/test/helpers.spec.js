/*global describe: false, it: false */
describe("helpers", function () {

  var el;
  var event;
  var eventName;
  var memo = {};

  if (document.createEvent) {
    event = document.createEvent("HTMLEvents");
    event.initEvent("dataavailable", true, true);
  } else {
    event = document.createEventObject();
    event.eventType = "dataavailable";
  }

  event.eventName = eventName;
  event.memo = memo || {};

  function insertEl() {
    el = document.createElement("div");
    document.getElementsByTagName("body")[0].prepend(el);
  }

  function clean(){
    el.parentNode.removeChild(el);
  }

  /**
   * addEvent
   */
  describe("addEvent", function () {

    it("adds a DOM event", function () {
      var obj;
      function customEvent() {
        obj = { a : 1, b : 2 };
      }
      addEvent(window, "dataavailable", customEvent, false);
      if (document.createEvent) {
        window.dispatchEvent(event);
      } else {
        window.fireEvent("on" + event.eventType, event);
      }
      expect(obj).toEqual({ a : 1, b : 2 });
    });

  });

  /**
   * removeEvent
   */
  describe("removeEvent", function () {

    it("removes a DOM event", function () {
      var obj;
      function customEvent() {
        obj = { a : 1, b : 2 };
      }
      addEvent(window, "dataavailable", customEvent, false);
      removeEvent(window, "dataavailable", customEvent, false);
      if (document.createEvent) {
        window.dispatchEvent(event);
      } else {
        window.fireEvent("on" + event.eventType, event);
      }
      expect(obj).toEqual(undefined);
    });

  });

  describe("element modification", function () {

    beforeEach(function () {
      insertEl();
    });

    afterEach(function () {
      clean();
    });

    /**
     * getChildren
     */
    describe("getChildren", function () {

      it("gets and stores all children in an array", function () {
        el.innerHTML = "<div></div><div></div><span></span>";
        var children = getChildren(el);
        expect(children[0].nodeName.toLowerCase()).toEqual("div");
        expect(children[1].nodeName.toLowerCase()).toEqual("div");
        expect(children[2].nodeName.toLowerCase()).toEqual("span");
      });

    });

    /**
     * setAttributes
     */
    describe("setAttributes", function () {

      it("sets multiple attributes to a single element", function () {
        setAttributes(el, { "class": "added-class", "id": "added-id" });
        expect(el.className).toEqual("added-class");
        expect(el.id).toEqual("added-id");
      });

    });

    /**
     * addClass
     */
    describe("addClass", function () {

      it("checks if a class exists and adds it if it doesn't", function () {
        addClass(el, "added-class-2");
        expect(el.className).toEqual("added-class-2");
      });

    });

    /**
     * removeClass
     */
    describe("removeClass", function () {

      it("removes removes a class from an element", function () {
        el.className = "not-removed-class removed-class";
        removeClass(el, "removed-class");
        expect(el.className).not.toEqual("removed-class");
        expect(el.className).toEqual("not-removed-class");
      });

    });

  });


});
