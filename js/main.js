(function () {
  "use strict";

  var doc = document;
  var body = doc.body;
  var helpers = window.WeddingHelpers || {};

  var qsa =
    helpers.qsa ||
    function (selector, scope) {
      return Array.prototype.slice.call(
        (scope || doc).querySelectorAll(selector),
      );
    };

  var qs =
    helpers.qs ||
    function (selector, scope) {
      return (scope || doc).querySelector(selector);
    };

  var prefersReducedMotion =
    helpers.prefersReducedMotion ||
    function () {
      return (
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    };

  var easeInOutCubic =
    helpers.easeInOutCubic ||
    function (t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

  var smoothScrollTo =
    helpers.smoothScrollTo ||
    function (targetY, duration) {
      if (prefersReducedMotion()) {
        window.scrollTo(0, targetY);
        return;
      }

      var startY = window.pageYOffset || doc.documentElement.scrollTop || 0;
      var diff = targetY - startY;
      var startTime = window.performance ? performance.now() : Date.now();
      var runDuration = typeof duration === "number" ? duration : 1200;

      var step = function (now) {
        var time = now - startTime;
        var t = Math.min(1, time / runDuration);
        var eased = easeInOutCubic(t);
        window.scrollTo(0, Math.round(startY + diff * eased));
        if (t < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    };

  var mobileMenuOutsideClick = function () {
    doc.addEventListener("click", function (event) {
      var container = qs("#fh5co-offcanvas");
      var toggle = qs(".js-fh5co-nav-toggle");
      var target = event.target;
      var clickedInsideMenu =
        container && (container === target || container.contains(target));
      var clickedToggle =
        toggle && (toggle === target || toggle.contains(target));

      if (
        !clickedInsideMenu &&
        !clickedToggle &&
        body.classList.contains("offcanvas")
      ) {
        body.classList.remove("offcanvas");
        toggle && toggle.classList.remove("active");
      }
    });
  };

  var offcanvasMenu = function () {
    var page = qs("#page");
    if (!page || qs("#fh5co-offcanvas")) {
      return;
    }

    var offcanvas = doc.createElement("div");
    offcanvas.id = "fh5co-offcanvas";
    page.insertBefore(offcanvas, page.firstChild);

    var toggle = doc.createElement("a");
    toggle.href = "#";
    toggle.className = "js-fh5co-nav-toggle fh5co-nav-toggle fh5co-nav-white";
    toggle.innerHTML = "<i></i>";
    page.insertBefore(toggle, page.firstChild);

    var menu1 = qs(".menu-1 > ul");
    var menu2 = qs(".menu-2 > ul");
    if (menu1) {
      offcanvas.appendChild(menu1.cloneNode(true));
    }
    if (menu2) {
      offcanvas.appendChild(menu2.cloneNode(true));
    }

    qsa("#fh5co-offcanvas .has-dropdown", offcanvas).forEach(function (el) {
      el.classList.add("offcanvas-has-dropdown");
    });

    qsa("#fh5co-offcanvas li", offcanvas).forEach(function (el) {
      el.classList.remove("has-dropdown");
    });

    qsa(".offcanvas-has-dropdown", offcanvas).forEach(function (item) {
      item.addEventListener("mouseenter", function () {
        item.classList.add("active");
        var dropdown = item.querySelector("ul");
        if (dropdown) {
          dropdown.style.display = "block";
        }
      });
      item.addEventListener("mouseleave", function () {
        item.classList.remove("active");
        var dropdown = item.querySelector("ul");
        if (dropdown) {
          dropdown.style.display = "none";
        }
      });
    });

    window.addEventListener("resize", function () {
      if (body.classList.contains("offcanvas")) {
        body.classList.remove("offcanvas");
        toggle.classList.remove("active");
      }
    });
  };

  var burgerMenu = function () {
    doc.addEventListener("click", function (event) {
      var toggle = event.target.closest(".js-fh5co-nav-toggle");
      if (!toggle) {
        return;
      }

      event.preventDefault();
      body.classList.toggle("overflow");
      body.classList.toggle("offcanvas");
      toggle.classList.toggle("active");
    });
  };

  var contentWayPoint = function () {
    var items = qsa(".animate-box");
    if (!items.length) {
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          var el = entry.target;
          if (el.classList.contains("animated-fast")) {
            observer.unobserve(el);
            return;
          }

          el.classList.add("item-animate");
          setTimeout(function () {
            qsa(".animate-box.item-animate").forEach(function (item, index) {
              setTimeout(function () {
                var effect = item.getAttribute("data-animate-effect");
                if (effect === "fadeIn") {
                  item.classList.add("fadeIn", "animated-fast");
                } else if (effect === "fadeInLeft") {
                  item.classList.add("fadeInLeft", "animated-fast");
                } else if (effect === "fadeInRight") {
                  item.classList.add("fadeInRight", "animated-fast");
                } else {
                  item.classList.add("fadeInUp", "animated-fast");
                }

                item.classList.remove("item-animate");
              }, index * 200);
            });
          }, 100);

          observer.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -15% 0px" },
    );

    items.forEach(function (item) {
      observer.observe(item);
    });
  };

  var dropdown = function () {
    qsa(".has-dropdown").forEach(function (item) {
      item.addEventListener("mouseenter", function () {
        var dropdownMenu = item.querySelector(".dropdown");
        if (dropdownMenu) {
          dropdownMenu.style.display = "block";
          dropdownMenu.classList.add("animated-fast", "fadeInUpMenu");
        }
      });

      item.addEventListener("mouseleave", function () {
        var dropdownMenu = item.querySelector(".dropdown");
        if (dropdownMenu) {
          dropdownMenu.style.display = "none";
          dropdownMenu.classList.remove("animated-fast", "fadeInUpMenu");
        }
      });
    });
  };

  var goToTop = function () {
    qsa(".js-gotop").forEach(function (el) {
      el.addEventListener("click", function (event) {
        event.preventDefault();
        smoothScrollTo(0, 700);
      });
    });

    window.addEventListener("scroll", function () {
      var toTop = qs(".js-top");
      if (!toTop) {
        return;
      }

      if (window.pageYOffset > 200) {
        toTop.classList.add("active");
      } else {
        toTop.classList.remove("active");
      }
    });
  };

  var lightbox = function () {
    var galleryLinks = qsa("#fh5co-gallery-list a");
    var videoLinks = qsa(".popup-youtube, .popup-vimeo, .popup-gmaps");
    if (!galleryLinks.length && !videoLinks.length) {
      return;
    }

    var overlay = doc.createElement("div");
    overlay.className = "fh5co-lightbox";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML =
      "" +
      '<div class="fh5co-lightbox-backdrop"></div>' +
      '<div class="fh5co-lightbox-inner" role="dialog" aria-modal="true">' +
      '<button type="button" class="fh5co-lightbox-close" aria-label="Close">&times;</button>' +
      '<button type="button" class="fh5co-lightbox-prev" aria-label="Previous">&#10094;</button>' +
      '<div class="fh5co-lightbox-content"></div>' +
      '<button type="button" class="fh5co-lightbox-next" aria-label="Next">&#10095;</button>' +
      "</div>";
    body.appendChild(overlay);

    var content = qs(".fh5co-lightbox-content", overlay);
    var closeBtn = qs(".fh5co-lightbox-close", overlay);
    var prevBtn = qs(".fh5co-lightbox-prev", overlay);
    var nextBtn = qs(".fh5co-lightbox-next", overlay);

    var galleryItems = [];
    var items = galleryItems;
    var currentIndex = 0;

    var setContent = function (item) {
      content.innerHTML = "";
      if (item.type === "iframe") {
        var iframe = doc.createElement("iframe");
        iframe.className = "fh5co-lightbox-iframe";
        iframe.src = item.src;
        iframe.allow = "autoplay; fullscreen";
        iframe.allowFullscreen = true;
        content.appendChild(iframe);
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
        return;
      }

      var img = doc.createElement("img");
      img.className = "fh5co-lightbox-image";
      img.src = item.src;
      img.alt = item.alt || "";
      content.appendChild(img);
      prevBtn.style.display = items.length > 1 ? "block" : "none";
      nextBtn.style.display = items.length > 1 ? "block" : "none";
    };

    var open = function (index) {
      currentIndex = index;
      setContent(items[currentIndex]);
      overlay.classList.add("is-active");
      overlay.setAttribute("aria-hidden", "false");
      body.classList.add("lightbox-open");
    };

    var close = function () {
      overlay.classList.remove("is-active");
      overlay.setAttribute("aria-hidden", "true");
      content.innerHTML = "";
      body.classList.remove("lightbox-open");
    };

    var showNext = function () {
      if (!items.length) {
        return;
      }
      currentIndex = (currentIndex + 1) % items.length;
      setContent(items[currentIndex]);
    };

    var showPrev = function () {
      if (!items.length) {
        return;
      }
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      setContent(items[currentIndex]);
    };

    galleryLinks.forEach(function (link, index) {
      galleryItems.push({
        type: "image",
        src: link.getAttribute("href"),
        alt: link.getAttribute("title") || "",
      });
      link.addEventListener("click", function (event) {
        event.preventDefault();
        items = galleryItems;
        open(index);
      });
    });

    videoLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        var href = link.getAttribute("href");
        if (!href || href === "#") {
          return;
        }
        event.preventDefault();
        items = [{ type: "iframe", src: href }];
        open(0);
      });
    });

    closeBtn.addEventListener("click", close);
    qs(".fh5co-lightbox-backdrop", overlay).addEventListener("click", close);
    prevBtn.addEventListener("click", showPrev);
    nextBtn.addEventListener("click", showNext);

    doc.addEventListener("keydown", function (event) {
      if (!overlay.classList.contains("is-active")) {
        return;
      }
      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowRight") {
        showNext();
      } else if (event.key === "ArrowLeft") {
        showPrev();
      }
    });
  };

  var stickyNav = function () {
    var nav = qs(".fh5co-nav");
    if (!nav) {
      return;
    }

    var isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      nav.classList.remove("is-sticky");
      nav.classList.remove("is-sticky-leave");
      return;
    }

    var header = qs("#fh5co-header");
    var stickyOffset = 80;
    var stickyDuration = 250;
    var trigger = 0;
    var ticking = false;
    var isSticky = false;
    var leaving = false;
    var leaveTimeoutId = null;

    var getTrigger = function () {
      if (header) {
        var headerBottom = header.offsetTop + header.offsetHeight;
        return Math.max(0, headerBottom - stickyOffset);
      }
      return nav.offsetTop + 40;
    };

    var setSticky = function (shouldStick) {
      if (shouldStick) {
        if (leaveTimeoutId) {
          window.clearTimeout(leaveTimeoutId);
          leaveTimeoutId = null;
        }
        leaving = false;
        nav.classList.remove("is-sticky-leave");
        if (!isSticky) {
          nav.classList.add("is-sticky");
        }
        isSticky = true;
        return;
      }

      if (isSticky && !leaving) {
        leaving = true;
        nav.classList.add("is-sticky-leave");
        leaveTimeoutId = window.setTimeout(function () {
          nav.classList.remove("is-sticky");
          nav.classList.remove("is-sticky-leave");
          leaving = false;
          leaveTimeoutId = null;
        }, stickyDuration);
      }
      isSticky = false;
    };

    var update = function () {
      trigger = getTrigger();
      var scrollTop = window.pageYOffset || doc.documentElement.scrollTop || 0;
      var shouldStick = scrollTop > trigger;
      setSticky(shouldStick);
      ticking = false;
    };

    var onScroll = function () {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", function () {
      update();
    });
  };

  var smoothAnchorScroll = function () {
    doc.addEventListener("click", function (event) {
      var anchor = event.target.closest('a[href^="#"]');
      var homeLink = event.target.closest('a[href="index.html"]');
      if (!anchor && !homeLink) {
        return;
      }

      var href = anchor ? anchor.getAttribute("href") : "index.html";
      if (anchor && (!href || href === "#")) {
        return;
      }

      var target;
      if (anchor) {
        try {
          target = qs(href);
        } catch (error) {
          return;
        }

        if (!target) {
          return;
        }
      }

      event.preventDefault();

      if (body.classList.contains("offcanvas")) {
        body.classList.remove("overflow");
        body.classList.remove("offcanvas");
        var toggle = qs(".js-fh5co-nav-toggle");
        toggle && toggle.classList.remove("active");
      }

      if (homeLink) {
        smoothScrollTo(0, 1200);
        if (history.pushState) {
          history.pushState(null, "", "index.html");
        } else {
          window.location.hash = "";
        }
        return;
      }

      smoothScrollTo(target.offsetTop, 1200);
      if (history.pushState) {
        history.pushState(null, "", href);
      } else {
        window.location.hash = href;
      }
    });
  };

  var loaderPage = function () {
    var loader = qs(".fh5co-loader");
    if (!loader) {
      return;
    }

    loader.style.opacity = "1";
    loader.style.transition = "opacity 0.6s ease";
    window.setTimeout(function () {
      loader.style.opacity = "0";
    }, 50);

    window.setTimeout(function () {
      loader.style.display = "none";
    }, 700);
  };

  var parallax = function () {
    var parallaxItems = qsa("[data-stellar-background-ratio]");
    var isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!parallaxItems.length || prefersReducedMotion() || isMobile) {
      return;
    }

    var ticking = false;
    var update = function () {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(function () {
        var scrollTop =
          window.pageYOffset || doc.documentElement.scrollTop || 0;
        parallaxItems.forEach(function (item) {
          var ratio =
            parseFloat(item.getAttribute("data-stellar-background-ratio")) ||
            0.5;
          var intensity = 0.2;
          var maxOffset = Math.round(item.clientHeight * 0.08);
          var rawOffset = Math.round(-(scrollTop * (1 - ratio) * intensity));
          var offset = Math.max(-maxOffset, Math.min(maxOffset, rawOffset));
          if (item.id === "fh5co-header") {
            item.style.setProperty("--parallax-offset", offset + "px");
            return;
          }
          item.style.backgroundPosition = "center calc(50% + " + offset + "px)";
        });
        ticking = false;
      });
    };

    update();
    window.addEventListener("scroll", update);
    window.addEventListener("resize", update);
  };

  var toggleYoungEventBlock = function () {
    var mainEventCol = qs("#main-event-col");
    var youngEventCol = qs("#young-event-col");
    if (!youngEventCol) return;

    var params = new URLSearchParams(window.location.search);

    var youngParam = (params.get("young") || "").toLowerCase();
    var showYoung =
      params.has("young") && !["", "0", "false", "no"].includes(youngParam);

    if (!showYoung) {
      for (var pair of params.entries()) {
        if ((pair[1] || "").toLowerCase() === "young") {
          showYoung = true;
          break;
        }
      }
    }

    youngEventCol.style.display = showYoung ? "" : "none";

    if (!mainEventCol) return;

    if (showYoung) {
      mainEventCol.classList.remove(
        "col-md-8",
        "col-sm-8",
        "col-md-offset-2",
        "col-sm-offset-2",
      );
      mainEventCol.classList.add("col-md-6", "col-sm-6");
    } else {
      mainEventCol.classList.remove("col-md-6", "col-sm-6");
      mainEventCol.classList.add(
        "col-md-8",
        "col-sm-8",
        "col-md-offset-2",
        "col-sm-offset-2",
      );
    }
  };

  var toggleBusBlock = function () {
    var busSection = qs("#fh5co-bus");
    if (!busSection) return;

    var options = qsa(".bus-option", busSection);
    if (!options.length) return;

    var params = new URLSearchParams(window.location.search);
    var rawBus = (params.get("bus") || "").toLowerCase();
    var bus = rawBus;

    if (!bus) {
      for (var pair of params.entries()) {
        var value = (pair[1] || "").toLowerCase();
        if (value) {
          bus = value;
          break;
        }
      }
    }

    var normalizeBus = function (value) {
      if (!value) return "";
      if (["shumsk", "шумськ", "shumskyi", "шумському"].includes(value)) {
        return "shumsk";
      }
      if (["ternopil", "тернопіль", "ternopil"].includes(value)) {
        return "ternopil";
      }
      return "";
    };

    var normalized = normalizeBus(bus);

    if (!normalized) {
      options.forEach(function (option) {
        option.style.display = "";
      });
      return;
    }

    options.forEach(function (option) {
      var type = (option.getAttribute("data-bus") || "").toLowerCase();
      option.style.display = type === normalized ? "" : "none";
    });
  };

  var setInviteText = function () {
    var inviteEl = qs("#invite-text");
    if (!inviteEl) {
      return;
    }

    var invites = window.WeddingInvites || {};

    var params = new URLSearchParams(window.location.search);
    var key = params.get("invite");
    var text = invites[key] || invites.default || "";
    inviteEl.textContent = text;
  };

  doc.addEventListener("DOMContentLoaded", function () {
    mobileMenuOutsideClick();
    parallax();
    offcanvasMenu();
    burgerMenu();
    toggleYoungEventBlock();
    toggleBusBlock();
    contentWayPoint();
    dropdown();
    lightbox();
    stickyNav();
    goToTop();
    smoothAnchorScroll();
    loaderPage();
    setInviteText();
  });
})();
