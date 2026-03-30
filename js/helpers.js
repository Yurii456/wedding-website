(function (win, doc) {
  "use strict";

  var qsa = function (selector, scope) {
    return Array.prototype.slice.call(
      (scope || doc).querySelectorAll(selector),
    );
  };

  var qs = function (selector, scope) {
    return (scope || doc).querySelector(selector);
  };

  var prefersReducedMotion = function () {
    return (
      win.matchMedia &&
      win.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  };

  var easeInOutCubic = function (t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  var smoothScrollTo = function (targetY, duration) {
    if (prefersReducedMotion()) {
      win.scrollTo(0, targetY);
      return;
    }

    var startY = win.pageYOffset || doc.documentElement.scrollTop || 0;
    var diff = targetY - startY;
    var startTime = win.performance ? performance.now() : Date.now();
    var runDuration = typeof duration === "number" ? duration : 1200;

    var step = function (now) {
      var time = now - startTime;
      var t = Math.min(1, time / runDuration);
      var eased = easeInOutCubic(t);
      win.scrollTo(0, Math.round(startY + diff * eased));
      if (t < 1) {
        win.requestAnimationFrame(step);
      }
    };

    win.requestAnimationFrame(step);
  };

  var getDefaultInviteText = function (names) {
    var inviteNames = (typeof names === "string" ? names : "").trim();
    if (!inviteNames) {
      inviteNames = "друзі";
    }

    return (
      `Дорогі ${inviteNames}! 
      
      Запрошуємо вас розділити один із найважливіших днів у нашому житті. Для нас велика радість провести його поруч із людьми, яких ми любимо та цінуємо. Будемо щасливі бачити вас на нашому весіллі.
      
      Чекаємо на вас! З любов’ю Юра та Юля♥️
      `
    );
  };

  win.WeddingHelpers = {
    qsa: qsa,
    qs: qs,
    prefersReducedMotion: prefersReducedMotion,
    easeInOutCubic: easeInOutCubic,
    smoothScrollTo: smoothScrollTo,
    getDefaultInviteText: getDefaultInviteText,
  };
})(window, document);
