describe("responsive-nav", function () {

  var nav;
  var idSelector = "nav";
  var classSelector = "nav-collapse";
  var el;

  var cssLink = document.createElement("link");
  cssLink.setAttribute("rel", "stylesheet");
  cssLink.setAttribute("type", "text/css");
  cssLink.setAttribute("href", "base/client/src/styles/responsive-nav.css");
  document.getElementsByTagName("head")[0].appendChild(cssLink);

  beforeEach(function () {
    el = document.createElement("nav");
    el.id = idSelector;
    el.classList.add(classSelector);
    el.innerHTML = "<ul>" +
     "<li><a href='#'>Home</a></li>" +
     "<li><a href='#'>About</a></li>" +
     "<li><a href='#'>Projects</a><ul><li><a href='#'>Project 1</li></ul></li>" +
     "<li><a href='#'>Blog</a></li>" +
     "</ul>";

   document.getElementsByTagName("body")[0].prepend(el);
  });

  function clean(){
    // remove class names from html element
    document.documentElement.className = "";

    // remove Element of navigation <div id="navigation">..</div>
    el.parentNode.removeChild(el);

    // remove toggle tags
    var toggles = document.querySelectorAll(".nav-toggle");
    if (toggles.length > 0){
      toggles.forEach(function(toggle){
        toggle.parentNode.removeChild(toggle);
      });
    }

    // remove style tags
    var styles = document.querySelectorAll("style");
    if (styles.length > 0){
      styles.forEach(function(style){
        if (style.parentNode.length > 0){
          style.parentNode.removeChild(styles);
        }
      });
    }
  }

  afterEach(function () {
    clean();
  });

  function insertNav() {
    nav = responsiveNav(idSelector);
  }

  function eventFire(el, etype) {
    if (el.dispatchEvent) {
      var evObj = document.createEvent("Events");
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    } else if (el.fireEvent) {
      el.fireEvent("on" + etype);
    }
  }

  describe("auto-create", function () {

    beforeEach(function () {
      insertNav();
    });

    afterEach(function () {
      // Destroy the nav function after test
      nav.destroy();
    });

    /**
     * init
     */
    describe("init", function() {

      it("adds a 'js' class as default", function (){
        expect(document.documentElement.className).toBe("js");
      });

      it("creates a toggle", function () {
        expect(document.querySelector(".nav-toggle").nodeName.toLowerCase()).toBe("a");
        expect(el.className).toBe("nav-collapse closed");
      });

      it("initializes transitions", function () {
        spyOn(nav, "_transitions").and.callThrough();
        nav._transitions();
        expect(nav._transitions).toHaveBeenCalled();
      });

      it("initializes calculations", function () {
        spyOn(nav, "resize").and.callThrough();
        nav.resize();
        expect(nav.resize).toHaveBeenCalled();
      });

      it("adds classes", function () {
        expect(el.className).toBe("nav-collapse closed");
      });

    });

    /**
     * toggle
     */
    describe("toggle", function () {

      it("toggles the navigation open and close", function () {
        spyOn(nav, "toggle").and.callThrough();
        nav.toggle();
        expect(nav.toggle).toHaveBeenCalled();
        expect(el.className).toBe("nav-collapse opened");
        expect(el.getAttribute("aria-hidden")).toBe("false");
        expect(el.style.position).toBe("relative");
        var navToggle = document.querySelector(".nav-toggle");
        expect(navToggle.className).toBe("nav-toggle active");
      });

    });

    /**
     * open
     */
    describe("open", function () {

      it("opens the navigation", function () {
        spyOn(nav, "open").and.callThrough();
        nav.open();
        expect(nav.open).toHaveBeenCalled();
        expect(el.className).toBe("nav-collapse opened");
        expect(el.getAttribute("aria-hidden")).toBe("false");
        expect(el.style.position).toBe("relative");
      });

    });

    /**
     * close
     */
    describe("close", function () {

      it("closes the navigation", function () {
        spyOn(nav, "close").and.callThrough();
        nav.open();
        nav.close();
        expect(nav.close).toHaveBeenCalled();
        expect(el.className).toBe("nav-collapse closed");
        expect(el.getAttribute("aria-hidden")).toBe("true");
      });
    });

    /**
     * handleEvent
     */
    describe("handleEvent", function () {

      it("toggles the navigation on touchend", function () {

        setTimeout(function(){
          var toggle = document.querySelector(".nav-toggle");
          eventFire(toggle, "touchend");
          expect(el.className).toBe("nav-collapse opened");
        }, 300);

      });

      it("toggles the navigation on mouseup", function () {

        setTimeout(function(){
          var toggle = document.querySelector(".nav-toggle");
          eventFire(toggle, "mouseup");
          expect(el.className).toBe("nav-collapse opened");
        }, 300);

      });

    });


  });

  describe("manual-create", function () {
    // These test build the nav in the test themeselves
    // This is due ot having to spy on a method or having to
    // test a destroy functionality

    /**
     * init
     */
    describe("init", function() {

      it("selects the element", function() {
        spyOn(document, "getElementById").and.callThrough();
        insertNav();
        expect(document.getElementById).toHaveBeenCalledWith(idSelector);
        expect(nav.wrapper.id).toBe(idSelector);
        nav.destroy();
      });

      it("should work with multiple lists", function () {
        el.innerHTML = "<ul>" +
          "<li><a href='#'>Home</a></li>" +
          "<li><a href='#'>About</a></li>" +
          "</ul>" +
          "<ul>" +
          "<li><a href='#'>Programs</a></li>" +
          "<li><a href='#'>Store</a></li>" +
          "<li><a href='#'>Contact</a></li>" +
          "</ul>";
        insertNav();
        // set timeout as the style tag takes a second to be inserted
        setTimeout(function(){
          var styleContents = document.getElementsByTagName("style")[0].innerHTML;
          expect(styleContents).toBe(".js .nav-collapse.opened{max-height:90px !important} .js .nav-collapse.opened.dropdown-active {max-height:9999px !important}");
        }, 300);
        nav.destroy();
      });

      it("should work with multiple nav instances", function () {
        insertNav();

        // Insert Nav 2
        var el2 = document.createElement("nav");
        el2.id = "navigation2";
        el2.classList.add(classSelector);
        el2.innerHTML = "<ul>" +
          "<li><a href='#'>Home 2</a></li>" +
          "<li><a href='#'>About 2</a></li>" +
          "<li><a href='#'>Projects 2</a></li>" +
          "<li><a href='#'>Blog 2</a></li>" +
          "</ul>";
        document.getElementsByTagName("body")[0].appendChild(el2);

        var nav2 = responsiveNav("navigation2");
        expect(el.className).toBe("nav-collapse closed");
        expect(el2.className).toBe("nav-collapse closed");
        nav.destroy();
        nav2.destroy();
        el2.parentNode.removeChild(el2);
      });

    });

    /**
     * destroy
     */
    describe("destroy", function() {
      it("destroys Responsive Nav", function () {
        insertNav();
        nav.destroy();
        expect(el.className).not.toBe("nav-collapse closed");
        expect(el.className).not.toBe("nav-collapse opened");
        expect(el.className).not.toBe("nav-collapse");
        expect(document.querySelector(".nav-toggle")).toBe(null);
        expect(el.style.position).toBe("");
        expect(el.style.maxHeight).toBe("");
        expect(el.getAttribute("aria-hidden")).not.toBe("true");
        expect(el.getAttribute("aria-hidden")).not.toBe("false");
      });
    });

    /**
     * options
     */
    describe("options", function () {

      it("turns off animation if needed", function () {
        nav = responsiveNav(idSelector, { animate: false });
        expect(el.style.transition).not.toBe("max-height 250ms");
        nav.destroy();
      });

      it("controls the transition speed", function () {
        nav = responsiveNav(idSelector, { transition: 666 });
        if (el.style.transition) {
          expect(el.style.transition).toBe("max-height 666ms ease 0s");
        } else if (el.style.webkitTransition) {
          expect(el.style.webkitTransition).toBe("max-height 666ms ease 0s");
        }
        nav.destroy();
      });

      it("changes the toggle's text", function () {
        nav = responsiveNav(idSelector, { label: "foobar" });
        expect(document.querySelector(".nav-toggle").innerHTML).toBe("foobar");
        nav.destroy();
      });

      it("'changes the location where toggle is inserted", function () {
        nav = responsiveNav(idSelector, { insert: "before" });
        expect(document.querySelector(".nav-toggle").nextSibling).toBe(el);
        nav.destroy();
      });

      it("allows users to specify their own toggle", function () {
        var button = document.createElement("button");
        button.id = "button";
        document.getElementsByTagName("body")[0].appendChild(button);
        nav = responsiveNav(idSelector, { customToggle: "button" });
        expect(document.getElementById("button").getAttribute("aria-hidden")).toBeDefined();
        nav.destroy();
        button.parentNode.removeChild(button);
      });

      it("allows users to specify custom open position", function () {
        nav = responsiveNav(idSelector, { openPos: "static" });
        nav.toggle();
        expect(el.style.position).toBe("static");
        nav.destroy();
      });

      it("allows users to change the default container class", function () {
        el.classList.remove(classSelector);
        nav = responsiveNav(idSelector, { navClass: "random-class" });
        expect(el.className).toBe("random-class closed");
        nav.destroy();
      });

      it("allows users to specify custom JS class", function () {
        nav = responsiveNav(idSelector, { jsClass: "foobar" });
        expect(document.documentElement.className).toBe("foobar");
        nav.destroy();
      });

      it("allows users to have init callback", function () {
        var foo = "bar";
        nav = responsiveNav(idSelector, {
          init: function () { foo = "biz"; }
        });
        expect(foo).toBe("biz");
        nav.destroy();
      });

      it("allows users to have open callback", function () {
        var foo = "bar";
        nav = responsiveNav(idSelector, {
          open: function () { foo = "biz"; }
        });
        nav.toggle();
        expect(foo).toBe("biz");
        nav.destroy();
      });

      it("allows users to have close callback", function () {
        var foo = "bar";
        nav = responsiveNav(idSelector, {
          close: function () { foo = "biz"; }
        });
        nav.toggle();
        nav.toggle();
        expect(foo).toBe("biz");
        nav.destroy();
      });

    });

  });

});
