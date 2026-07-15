(function (window, document, $, undefined) {
  "use strict";

  function onDomReady(callback) {
    if (
      document.readyState === "interactive" ||
      document.readyState === "complete"
    ) {
      callback();
      return;
    }

    document.addEventListener("DOMContentLoaded", callback);
  }

  var rbt = {
    i: function (e) {
      rbt.d();
      rbt.methods();
    },

    d: function (e) {
      ((this._window = $(window)),
        (this._document = $(document)),
        (this._body = $("body")),
        (this._html = $("html")));
      // this.sideNav = $('.rbt-search-dropdown')
    },
    methods: function (e) {
      // function call here
      rbt.headerSticy();
      rbt.popupMobileMenu();
      rbt.menuCurrentLink();
      rbt.offCanvas();
      rbt.swiperActive();
      rbt.moveAnimation();
      rbt.counterUp();
      rbt.tabActive();
      rbt.pricingPlan();
      rbt.cursorAnimate();
      rbt.gsapAnimation();
      rbt.tiltAnim();
      rbt.elasticNavActive();
      rbt.closeTestimonialOverlay();
      rbt.rbtPriceRangeBar();
      rbt.hoverTab();
      rbt.selectPickerActivation();
      rbt.tooltipActive();
      rbt.tooltipActiveDefault();
      rbt.fancyboxActive();
      rbt.borderHover();
      rbt.clockVibrate();
      rbt.onePageNav();
      rbt.onePageProgress();
      rbt.dropdown();
      rbt.hoverImg();
      rbt.innerPageIndicatorFollow();
      rbt.splashDemoMagneticButton();
      rbt.splashFaqAvatarShuffle();
      rbt.circleBrand();
      rbt.countdownTimer();
      rbt.dynamicYear();
    },

    splashFaqAvatarShuffle: function () {
      if (
        typeof gsap === "undefined" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const defaultAvatarImages = [
        "assets/images/splash/faq-cta-avatar-01.png",
        "assets/images/splash/faq-cta-avatar-02.webp",
        "assets/images/splash/faq-cta-avatar-03.webp",
        "assets/images/splash/faq-cta-avatar-04.png",
        "assets/images/splash/faq-cta-avatar-05.png",
      ];

      const getAvatarPool = (mediaBox) => {
        const fromData = mediaBox.dataset.avatarImages;

        if (fromData) {
          try {
            const parsed = JSON.parse(fromData);
            if (Array.isArray(parsed) && parsed.length) {
              return parsed.filter(Boolean);
            }
          } catch (error) {
            const splitSources = fromData
              .split(",")
              .map((src) => src.trim())
              .filter(Boolean);

            if (splitSources.length) {
              return splitSources;
            }
          }
        }

        return defaultAvatarImages;
      };

      const pickRandomImage = (pool, slot, slots) => {
        const takenSources = new Set();

        slots.forEach((currentSlot) => {
          if (currentSlot === slot) return;

          const visibleSrc = currentSlot.getSrc();
          if (visibleSrc) {
            takenSources.add(visibleSrc);
          }

          if (currentSlot.pendingSrc) {
            takenSources.add(currentSlot.pendingSrc);
          }
        });

        const currentSrc = slot.getSrc();
        const candidates = pool.filter(
          (src) => src !== currentSrc && !takenSources.has(src),
        );

        if (!candidates.length) {
          const fallback = pool.filter((src) => src !== currentSrc);
          if (!fallback.length) return null;
          return fallback[Math.floor(Math.random() * fallback.length)];
        }

        return candidates[Math.floor(Math.random() * candidates.length)];
      };

      const getRandomDelay = (min, max) => min + Math.random() * (max - min);

      document
        .querySelectorAll(".rbt-splash-faq-support .rbt-media-box")
        .forEach((mediaBox) => {
          if (mediaBox.dataset.avatarShuffleInit === "true") return;

          const wrappers = Array.from(
            mediaBox.querySelectorAll(".rbt-splash-faq-support-image"),
          );
          const imagePool = getAvatarPool(mediaBox);

          if (wrappers.length < 1 || imagePool.length < 2) return;

          const slots = wrappers.map((wrapper) => {
            const visible = wrapper.querySelector("img");
            const hidden = visible.cloneNode(true);

            hidden.setAttribute("aria-hidden", "true");
            wrapper.appendChild(hidden);

            gsap.set(visible, { autoAlpha: 1, zIndex: 2 });
            gsap.set(hidden, { autoAlpha: 0, zIndex: 1 });

            return {
              visible,
              hidden,
              timer: null,
              pendingSrc: null,
              getSrc() {
                return this.visible.getAttribute("src");
              },
            };
          });

          imagePool.forEach((src) => {
            const image = new Image();
            image.src = src;
          });

          mediaBox.dataset.avatarShuffleInit = "true";

          const swapAvatar = (slot, nextSrc) => {
            if (!nextSrc || slot.getSrc() === nextSrc) return;

            const { visible, hidden } = slot;
            const incomingImage = new Image();

            slot.pendingSrc = nextSrc;

            incomingImage.onload = () => {
              gsap.killTweensOf([visible, hidden]);
              hidden.setAttribute("src", nextSrc);
              gsap.set(hidden, { autoAlpha: 0, zIndex: 1 });

              gsap
                .timeline({
                  defaults: {
                    ease: "sine.inOut",
                  },
                })
                .to(visible, {
                  autoAlpha: 0,
                  duration: 1,
                })
                .to(
                  hidden,
                  {
                    autoAlpha: 1,
                    duration: 1,
                  },
                  "-=0.45",
                )
                .call(() => {
                  slot.visible = hidden;
                  slot.hidden = visible;
                  slot.pendingSrc = null;
                  gsap.set(slot.visible, { zIndex: 2 });
                  gsap.set(slot.hidden, { autoAlpha: 0, zIndex: 1 });
                });
            };

            incomingImage.onerror = () => {
              slot.pendingSrc = null;
            };

            incomingImage.src = nextSrc;
          };

          const scheduleSlotSwap = (slot) => {
            slot.timer = setTimeout(() => {
              const nextSrc = pickRandomImage(imagePool, slot, slots);

              if (nextSrc) {
                swapAvatar(slot, nextSrc);
              }

              scheduleSlotSwap(slot);
            }, getRandomDelay(5200, 9800));
          };

          slots.forEach((slot) => {
            slot.timer = setTimeout(() => {
              const nextSrc = pickRandomImage(imagePool, slot, slots);

              if (nextSrc) {
                swapAvatar(slot, nextSrc);
              }

              scheduleSlotSwap(slot);
            }, getRandomDelay(1400, 3600));
          });
        });
    },

    splashDemoMagneticButton: function () {
      if (typeof gsap === "undefined") {
        return;
      }

      const desktopHoverQuery = window.matchMedia(
        "(min-width: 992px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      );
      const activeCards = [];

      const resetButton = (button) => {
        gsap.killTweensOf(button);
        gsap.set(button, {
          clearProps: "transform,opacity,visibility",
        });
      };

      const enableMagneticButton = () => {
        if (!desktopHoverQuery.matches || activeCards.length) return;

        document.querySelectorAll(".rbt-splash-demo-card").forEach((card) => {
          const button = card.querySelector(".rbt-view-demo-button");

          if (!button) return;

          gsap.set(button, {
            xPercent: -50,
            yPercent: -50,
            x: 0,
            y: 0,
            scale: 0.94,
            autoAlpha: 0,
          });

          const moveButton = (event) => {
            const cardRect = card.getBoundingClientRect();
            const buttonRect = button.getBoundingClientRect();
            const edgeGap = 12;
            const maxX = Math.max(
              cardRect.width / 2 - buttonRect.width / 2 - edgeGap,
              0,
            );
            const maxY = Math.max(
              cardRect.height / 2 - buttonRect.height / 2 - edgeGap,
              0,
            );
            const cursorX = event.clientX - cardRect.left - cardRect.width / 2;
            const cursorY = event.clientY - cardRect.top - cardRect.height / 2;
            const x = gsap.utils.clamp(-maxX, maxX, cursorX);
            const y = gsap.utils.clamp(-maxY, maxY, cursorY);

            gsap.to(button, {
              x,
              y,
              scale: 1,
              autoAlpha: 1,
              duration: 0.38,
              ease: "power3.out",
              overwrite: "auto",
            });
          };

          const hideButton = () => {
            gsap.to(button, {
              x: 0,
              y: 0,
              scale: 0.94,
              autoAlpha: 0,
              duration: 0.45,
              ease: "power3.out",
              overwrite: "auto",
            });
          };

          card.addEventListener("mouseenter", moveButton);
          card.addEventListener("mousemove", moveButton);
          card.addEventListener("mouseleave", hideButton);
          activeCards.push({ card, button, moveButton, hideButton });
        });
      };

      const disableMagneticButton = () => {
        while (activeCards.length) {
          const { card, button, moveButton, hideButton } = activeCards.pop();

          card.removeEventListener("mouseenter", moveButton);
          card.removeEventListener("mousemove", moveButton);
          card.removeEventListener("mouseleave", hideButton);
          resetButton(button);
        }
      };

      const toggleMagneticButton = () => {
        if (desktopHoverQuery.matches) {
          enableMagneticButton();
          return;
        }

        disableMagneticButton();
      };

      toggleMagneticButton();
      if (desktopHoverQuery.addEventListener) {
        desktopHoverQuery.addEventListener("change", toggleMagneticButton);
      } else {
        desktopHoverQuery.addListener(toggleMagneticButton);
      }
    },

    innerPageIndicatorFollow: function () {
      if (
        !window.matchMedia(
          "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        ).matches
      ) {
        return;
      }

      document
        .querySelectorAll(".rbt-splash-magnet-area")
        .forEach((section) => {
          const cursorArea = section.querySelector(".container-fluid");
          const indicator = section.querySelector(
            ".rbt-inner-page-panel-indicator",
          );

          if (!cursorArea || !indicator) return;

          let currentX = 0;
          let currentY = 0;
          let targetX = 0;
          let targetY = 0;
          let animationFrame = null;
          let previousTime = 0;

          const animateIndicator = (time) => {
            const delta = previousTime
              ? Math.min((time - previousTime) / 16.67, 3)
              : 1;
            const smoothing = 1 - Math.pow(0.82, delta);

            previousTime = time;
            currentX += (targetX - currentX) * smoothing;
            currentY += (targetY - currentY) * smoothing;

            indicator.style.setProperty("--indicator-x", `${currentX}px`);
            indicator.style.setProperty("--indicator-y", `${currentY}px`);

            const isSettled =
              Math.abs(targetX - currentX) < 0.1 &&
              Math.abs(targetY - currentY) < 0.1;

            if (isSettled) {
              currentX = targetX;
              currentY = targetY;
              indicator.style.setProperty("--indicator-x", `${currentX}px`);
              indicator.style.setProperty("--indicator-y", `${currentY}px`);
              animationFrame = null;
              previousTime = 0;
              return;
            }

            animationFrame = window.requestAnimationFrame(animateIndicator);
          };

          const startIndicatorAnimation = () => {
            if (animationFrame !== null) return;
            animationFrame = window.requestAnimationFrame(animateIndicator);
          };

          section.addEventListener("pointermove", (event) => {
            const areaRect = cursorArea.getBoundingClientRect();
            const cursorGap = 35;

            targetX =
              event.clientX - areaRect.left - areaRect.width / 2;
            targetY =
              event.clientY -
              areaRect.top -
              areaRect.height / 2 +
              indicator.offsetHeight / 2 +
              cursorGap;

            startIndicatorAnimation();
          });

          section.addEventListener("pointerleave", () => {
            targetX = 0;
            targetY = 0;
            startIndicatorAnimation();
          });
        });
    },

    // Hover Image
    hoverImg: () => {
      $(".rbt-hover-img-animtaion").each(function () {
        const $rbtImg = $(this);
        const $img = $rbtImg.find(".rbt-img-animtaion");

        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;

        function moveImage(e) {
          const rect = $rbtImg[0].getBoundingClientRect();
          targetX = e.clientX - rect.left;
          targetY = e.clientY - rect.top;
        }

        function animateImage() {
          currentX += (targetX - currentX) * 0.1;
          currentY += (targetY - currentY) * 0.1;

          gsap.set($img, {
            left: currentX + "px",
            top: currentY + "px",
          });

          requestAnimationFrame(animateImage);
        }

        animateImage();

        $rbtImg.on("mouseenter", function () {
          gsap.to($img, { duration: 0.3, autoAlpha: 1 });
          $rbtImg.on("mousemove", moveImage);
        });

        $rbtImg.on("mouseleave", function () {
          gsap.to($img, { duration: 0.3, autoAlpha: 0 });
          $rbtImg.off("mousemove", moveImage);

          targetX = $rbtImg.width() / 2;
          targetY = $rbtImg.height() / 2;
        });
      });

      const buttons = document.querySelectorAll(
        ".rbt-tab-nav-content .nav-link",
      );

      let isAnimating = false;

      buttons.forEach((btn) => {
        btn.addEventListener("mouseenter", () => {
          if (isAnimating) return;

          isAnimating = true;

          buttons.forEach((b) => b.classList.remove("active"));

          const target = document.querySelector(btn.dataset.bsTarget);

          if (target.classList.contains("active")) {
            isAnimating = false;
            return;
          }

          const activePane = document.querySelector(".tab-pane.show.active");

          if (activePane) {
            activePane.style.opacity = "0";

            setTimeout(() => {
              activePane.classList.remove("show", "active");

              btn.classList.add("active");
              target.classList.add("show", "active");

              setTimeout(() => {
                target.style.opacity = "1";
                isAnimating = false;
              }, 50);
            }, 300);
          } else {
            btn.classList.add("active");
            target.classList.add("show", "active");
            target.style.opacity = "1";
            isAnimating = false;
          }
        });
      });
    },

    // header sticky
    headerSticy: () => {
      let lastScrollTop = 0;

      $(window).on("scroll", function () {
        let currentScroll =
          window.scrollY || document.documentElement.scrollTop;

        if (currentScroll < lastScrollTop) {
          const isSticky = $(this).scrollTop() > 500;
          $(".rbt-header-sticky").toggleClass("sticky", isSticky);

          if (isSticky) {
            $(".side-menu.sticky-top").css("top", "100px");
          } else {
            $(".side-menu.sticky-top").css("top", "");
          }
        } else {
          $(".rbt-header-sticky").removeClass("sticky");
          $(".side-menu.sticky-top").css("top", "");
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
      });
    },
    // mobile menu
    popupMobileMenu: function (e) {
      $(".rbt-hamberger-btn").on("click", function (e) {
        $(".popup-mobile-menu").addClass("active");
      });

      $(".close-button").on("click", function (e) {
        $(".popup-mobile-menu").removeClass("active");
        $(
          ".popup-mobile-menu .mainmenu .has-dropdown > a, .popup-mobile-menu .mainmenu .with-megamenu > a",
        )
          .siblings(".submenu, .rbt-mobile-megamenu")
          .removeClass("active")
          .slideUp("400");
        $(
          ".popup-mobile-menu .mainmenu .has-dropdown > a, .popup-mobile-menu .mainmenu .with-megamenu > a",
        ).removeClass("open");
      });

      $(
        ".popup-mobile-menu .mainmenu .has-dropdown > a, .popup-mobile-menu .mainmenu .with-megamenu > a",
      ).on("click", function (e) {
        e.preventDefault();
        $(this)
          .siblings(".submenu, .rbt-mobile-megamenu")
          .toggleClass("active")
          .slideToggle("400");
        $(this).toggleClass("open");
      });

      $(".popup-mobile-menu, .popup-mobile-menu .mainmenu.onepagenav li a").on(
        "click",
        function (e) {
          e.target === this &&
            $(".popup-mobile-menu").removeClass("active") &&
            $(
              ".popup-mobile-menu .mainmenu .has-dropdown > a, .popup-mobile-menu .mainmenu .with-megamenu > a",
            )
              .siblings(".submenu, .rbt-mobile-megamenu")
              .removeClass("active")
              .slideUp("400") &&
            $(
              ".popup-mobile-menu .mainmenu .has-dropdown > a, .popup-mobile-menu .mainmenu .with-megamenu > a",
            ).removeClass("open");
        },
      );
    },

    dropdown: function () {
      $(".rbt-filter-select").on(
        "changed.bs.select",
        function (e, clickedIndex, isSelected, previousValue) {
          var plainText = $(this).find("option").eq(clickedIndex).text();

          $(this)
            .siblings(".dropdown-toggle")
            .find(".filter-option-inner-inner")
            .text(plainText);
        },
      );
    },

    onePageNav: function () {
      $(".onepagenav").onePageNav({
        currentClass: "current",
        changeHash: false,
        scrollSpeed: 500,
        scrollThreshold: 0.2,
        filter: "",
        easing: "swing",
      });
    },

    onePageProgress: function () {
      gsap.registerPlugin(ScrollTrigger);

      const stickyEl = document.querySelector(".rbt-side-menu");
      const section = document.querySelector(".rbt-blog-details-area");

      // if either is missing, bail out gracefully
      if (!stickyEl || !section) return;

      // use inner content as the end trigger so bottom margin doesn't “escape”
      const endTarget =
        document.querySelector(
          ".rbt-blog-details-area .blog-content-wrapper",
        ) || section;

      let stickyTop = parseInt(getComputedStyle(stickyEl).top, 10) || 0;

      gsap.to(".progress .progress-bar", {
        width: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: () => `top top+=${stickyTop}`,
          endTrigger: endTarget,
          end: () => `bottom bottom-=${stickyTop}`,
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: () => {
            stickyTop = parseInt(getComputedStyle(stickyEl).top, 10) || 0;
          },
        },
      });

      window.addEventListener("load", () => ScrollTrigger.refresh());
    },

    // active current path
    menuCurrentLink: function () {
      var currentPage = location.pathname.split("/"),
        current = currentPage[currentPage.length - 1];
      $(".rbt-active-current-path li a").each(function () {
        var $this = $(this);
        if ($this.attr("href") === current) {
          $this.addClass("active");
          // $this.parents(".has-menu-child-item").addClass("menu-item-open");
        }
      });
    },

    offCanvas: function () {
      if ($(".rbt-search-panel-activation").length) {
        $(".rbt-search-panel-activation").on("click", function () {
          $("body").addClass("rbt-search-panel-active");
        });
      }
      if ($(".rbt-menu-panel-activation").length) {
        $(".rbt-menu-panel-activation").on("click", function () {
          $("body").addClass("rbt-menu-panel-active");
        });
      }
      if ($(".rbt-cart-panel-activation").length) {
        $(".rbt-cart-panel-activation").on("click", function () {
          $("body").addClass("rbt-cart-panel-active");
        });
      }

      if ($(".rbt-offcanvas-panel-common").length) {
        $(".close_side_menu").on("click", function () {
          $("body").removeClass("rbt-search-panel-active");
          $("body").removeClass("rbt-menu-panel-active");
          $("body").removeClass("rbt-cart-panel-active");
        });

        $(".rbt-offcanvas-close-btn").on("click", function () {
          $("body").removeClass("rbt-search-panel-active");
          $("body").removeClass("rbt-menu-panel-active");
          $("body").removeClass("rbt-cart-panel-active");
        });
      }
    },

    // swiper
    swiperActive: () => {
      let swiper = new Swiper(".rbt-swiper-activation-1", {
        autoplay: false,
        slidesPerView: "auto",
        spaceBetween: 30,
        centeredSlides: true,
        // loop: true,
        speed: 1000,
        initialSlide: 1,
        navigation: {
          nextEl: ".rbt-navigate-next",
          prevEl: ".rbt-navigate-prev",
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 1,
          },
          1200: {
            slidesPerView: "auto",
          },
        },
      });

      let swiperAlt = new Swiper(".rbt-swiper-activation-1-alt", {
        slidesPerView: "1",
        spaceBetween: 0,
        centeredSlides: true,
        loop: true,
        speed: 1000,
        initialSlide: 1,
        navigation: {
          nextEl: ".rbt-navigate-next",
          prevEl: ".rbt-navigate-prev",
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 1,
          },
          1200: {
            slidesPerView: "1",
          },
        },
      });

      let swiper2 = new Swiper(".rbt-swiper-activation-2", {
        slidesPerView: 5,
        spaceBetween: 20,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        speed: 3000,
        breakpoints: {
          320: {
            loop: true,
            slidesPerView: 2,
          },
          430: {
            loop: true,
            slidesPerView: 2.5,
          },
          768: {
            loop: true,
            slidesPerView: 4,
          },
          1200: {
            slidesPerView: 5,
          },
        },
      });

      let swiper3 = new Swiper(".rbt-swiper-activation-3", {
        slidesPerView: "auto",
        spaceBetween: 30,
        speed: 1000,
        grabCursor: true,
        // loop: true,
        pagination: {
          el: ".rbt-swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".rbt-navigate-next",
          prevEl: ".rbt-navigate-prev",
        },
        breakpoints: {
          320: {
            spaceBetween: 20,
          },
          992: {
            spaceBetween: 30,
          },
        },
      });

      let swiper4 = new Swiper(".rbt-swiper-activation-4", {
        slidesPerView: 1,
        speed: 2000,
        grabCursor: true,
        autoplay: {
          delay: 3000,
        },
        pagination: {
          el: ".rbt-swiper-pagination",
          clickable: true,
        },
      });

      let swiper5 = new Swiper(".rbt-swiper-activation-5", {
        speed: 600,
        freeMode: true,
        grabCursor: true,
        scrollbar: {
          el: ".swiper-scrollbar",
          draggable: true,
        },
        pagination: {
          el: ".rbt-swiper-pagination",
          type: "fraction",
        },
        navigation: {
          nextEl: ".rbt-navigate-next",
          prevEl: ".rbt-navigate-prev",
        },
        breakpoints: {
          320: {
            slidesPerView: "auto",
            spaceBetween: 16,
          },
          576: {
            slidesPerView: "auto",
            spaceBetween: 20,
            slidesPerView: 2,
          },
          768: {
            slidesPerView: "auto",
            spaceBetween: 20,
            slidesPerView: 2,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        },
      });

      // First Swiper
      let swiperAlt5 = new Swiper(".rbt-swiper-activation-5-alt", {
        loop: true,
        freeMode: true,
        watchSlidesProgress: true,
        spaceBetween: 12,
        breakpoints: {
          1199: {
            pagination: {
              el: ".rbt-swiper-pagination",
            },
          },
        },
      });

      // Second Swiper
      let swiperAlt25 = new Swiper(".rbt-swiper-activation-5-alt-2", {
        effect: "cards",
        freeMode: true,
        slidesPerView: 1,
        loop: true,
        scrollbar: {
          el: ".swiper-scrollbar",
          draggable: true,
        },
        pagination: {
          el: ".rbt-swiper-pagination",
          type: "fraction",
        },
        navigation: {
          nextEl: ".rbt-navigate-next",
          prevEl: ".rbt-navigate-prev",
        },
        breakpoints: {
          1199: {
            pagination: {
              el: ".rbt-swiper-pagination",
            },
          },
        },
      });

      // 🔗 Connect them (two-way)
      swiperAlt5.controller.control = swiperAlt25;
      swiperAlt25.controller.control = swiperAlt5;

      let swiper6 = new Swiper(".rbt-swiper-activation-6", {
        speed: 800,
        grabCursor: true,
        slidesPerView: 3,
        spaceBetween: 30,
        // loop: true,
        navigation: {
          nextEl: ".rbt-navigate-btn-active .rbt-navigate-next",
          prevEl: ".rbt-navigate-btn-active .rbt-navigate-prev",
        },
        breakpoints: {
          320: {
            slidesPerView: 1.2,
            spaceBetween: 20,
            speed: 800,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          992: {
            slidesPerView: 3,
          },
        },
        on: {
          slideChange: function () {
            let activeIndex = this.activeIndex;
            let slidesPerView = this.params.slidesPerView;

            // Remove the 'active-slide' class from all slides
            this.slides.forEach((slide) => {
              slide.classList.remove("active-slide");
            });

            // Loop through the visible slides and add the 'active-slide' class
            for (let i = 0; i < slidesPerView; i++) {
              // Calculate the index of the visible slide (accounting for loop)
              let visibleSlideIndex = (activeIndex + i) % this.slides.length;
              this.slides[visibleSlideIndex].classList.add("active-slide");
            }
          },
        },
      });

      let swiper7 = new Swiper(".active-creative-card", {
        speed: 1000,
        effect: "creative",
        grabCursor: true,
        slidesPerView: 3,
      });

      let swiper8 = new Swiper(".rbt-tooltip-slider-active", {
        slidesPerView: 1,
        loop: true,
        autoplay: {
          delay: 2500,
        },
      });

      let swiper9 = new Swiper(".rbt-blog-card-slide-activation", {
        spaceBetween: 30,
        // freeMode: true,
        speed: 1000,
        pagination: {
          el: ".rbt-swiper-pagination",
          clickable: true,
          type: "bullets",
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
          },
          380: {
            slidesPerView: "auto",
          },
          1400: {
            slidesPerView: 3,
          },
        },
      });

      let swiper10 = new Swiper(".rbt-slider-in-title", {
        slidesPerView: 1,
        loop: true,
        speed: 800,
        autoplay: {
          delay: 3000,
        },
        effect: "creative",
        creativeEffect: {
          prev: {
            shadow: true,
            translate: ["-20%", 0, -1],
          },
          next: {
            translate: ["100%", 0, 0],
          },
        },
      });

      let swiper11 = new Swiper(".rbt-tooltip-slider-active-2", {
        slidesPerView: 3,
        spaceBetween: 0,
        // spaceBetween: 20,
        grabCursor: true,
        mousewheel: true,
        direction: "vertical",
        loop: true,
        speed: 1000,
        autoplay: {
          delay: 2000,
        },
      });

      let swiper12 = new Swiper(".rbt-testimonial-slide-activation", {
        slidesPerView: 1,
        spaceBetween: 20,
        grabCursor: true,
        loop: true,
        speed: 1200,
        freeMode: true,
        parallax: true,
        pagination: {
          el: ".rbt-swiper-pagination",
          clickable: true,
        },
      });

      let swiper13 = new Swiper(".rbt-testimonial-slide-activation-2", {
        speed: 1200,
        parallax: true,
        // loop: true,
        navigation: {
          nextEl: ".rbt-navigate-next-2",
          prevEl: ".rbt-navigate-prev-2",
        },
      });

      let swiper14 = new Swiper(".rbt-testimonial-slide-activation-3", {
        slidesPerView: 3,
        centeredSlides: true,
        initialSlide: 2,
        freeMode: true,
        grabCursor: true,
        spaceBetween: 30,
        speed: 800,
        // loop: true,
        initialSlide: 1,
        pagination: {
          el: ".rbt-swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 1.7,
          },
          992: {
            slidesPerView: 2.2,
          },
          1200: {
            slidesPerView: 3,
          },
        },
      });

      let swiper15 = new Swiper(".rbt-swiper-center-slide-activation", {
        // slidesPerView: "auto",
        slidesPerView: 3,
        initialSlide: 1,
        // spaceBetween: 0,
        spaceBetween: 150,
        // loop: true,
        centeredSlides: true,
        speed: 1000,
        pagination: {
          el: ".rbt-swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".rbt-navigate-next",
          prevEl: ".rbt-navigate-prev",
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 1.7,
          },
          992: {
            slidesPerView: 2.2,
          },
          1200: {
            slidesPerView: 3,
          },
        },
      });

      let swiper16 = new Swiper(".rbt-swiper-activation-16", {
        autoplay: false,
        slidesPerView: "auto",
        spaceBetween: 30,
        loop: true,
        speed: 1000,
        initialSlide: 1,
        navigation: {
          nextEl: ".rbt-navigate-next",
          prevEl: ".rbt-navigate-prev",
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 1,
          },
          1200: {
            slidesPerView: "auto",
          },
        },
      });

      let swiperMarquee = new Swiper(".marquee-swiper", {
        slidesPerView: "auto",
        spaceBetween: 15,
        loop: true,
        grabCursor: true,
        freeMode: {
          enabled: true,
          momentum: false,
        },
        speed: 8000,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
        },
      });

      let swiperMarqueeReverse = new Swiper(".marquee-swiper-reverse", {
        slidesPerView: "auto",
        spaceBetween: 15,
        loop: true,
        freeMode: {
          enabled: true,
          momentum: false,
        },
        speed: 8000,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
          reverseDirection: true,
        },
      });

      let swiper17 = new Swiper(".rbt-swiper-activation-7", {
        speed: 1000,
        freeMode: true,
        slidesPerView: 3,
        pagination: {
          el: ".rbt-swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".rbt-navigate-next",
          prevEl: ".rbt-navigate-prev",
        },
        breakpoints: {
          320: {
            slidesPerView: "auto",
            spaceBetween: 16,
          },
          576: {
            slidesPerView: "auto",
            spaceBetween: 20,
          },
          768: {
            slidesPerView: "auto",
            spaceBetween: 20,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1200: {
            spaceBetween: 30,
          },
        },
      });

      // swiper for splash page
      const applyCurvedVerticalSlides = (swiper, direction = 1) => {
        if (!swiper || !swiper.slides) return;

        const maxOffset = -220;
        const maxRotate = 0;
        const minScale = 1;

        swiper.slides.forEach((slide) => {
          const progress = Math.max(-13, Math.min(13, slide.progress || 0));
          const t = 1 - Math.min(1, Math.abs(progress) / 13);
          const ease = Math.pow(t, 2.5); // higher value = more curved

          const x = direction * maxOffset * ease;
          const rotate = direction * maxRotate * (progress / 13);
          const scale = minScale + (1 - minScale) * ease;
          const opacity = 0.35 + 0.65 * ease;

          slide.style.transform = `translate3d(${x}px, 0, 0) rotate(${rotate}deg) scale(${scale})`;
          slide.style.opacity = opacity;
        });
      };

      let swiperSplashElementsLeft = new Swiper(
        ".rbt-splash-elements-slider-left",
        {
          direction: "vertical",
          loop: true,
          allowTouchMove: false,
          grabCursor: false,
          centeredSlides: true,
          watchSlidesProgress: true,
          curveDirection: -1,
          slidesPerView: 9,
          spaceBetween: 30,
          speed: 2000,
          autoplay: {
            delay: 0,
            disableOnInteraction: false,
          },
          on: {
            init: function () {
              applyCurvedVerticalSlides(this, 1);
            },
            setTranslate: function () {
              applyCurvedVerticalSlides(this, 1);
            },
            setTransition: function (speed) {
              this.slides.forEach((slide) => {
                slide.style.transitionDuration = `${speed}ms`;
              });
            },
          },
          breakpoints: {
            320: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
            992: {
              slidesPerView: 5,
            },
            1200: {
              slidesPerView: 9,
            },
          },
        },
      );

      let swiperSplashElementsRight = new Swiper(
        ".rbt-splash-elements-slider-right",
        {
          direction: "vertical",
          loop: true,
          allowTouchMove: false,
          grabCursor: false,
          centeredSlides: true,
          watchSlidesProgress: true,
          slidesPerView: 9,
          spaceBetween: 30,
          speed: 2000,
          autoplay: {
            delay: 0,
            disableOnInteraction: false,
            reverseDirection: true,
          },
          on: {
            init: function () {
              applyCurvedVerticalSlides(this, this.params.curveDirection);
            },
            setTranslate: function () {
              applyCurvedVerticalSlides(this, this.params.curveDirection);
            },
            setTransition: function (speed) {
              this.slides.forEach((slide) => {
                slide.style.transitionDuration = `${speed}ms`;
              });
            },
          },
          breakpoints: {
            320: {
              slidesPerView: 4,
              spaceBetween: 10,
              curveDirection: 1,
            },
            992: {
              slidesPerView: 5,
              curveDirection: -1,
            },
            1200: {
              slidesPerView: 9,
              curveDirection: -1,
            },
          },
        },
      );

      let swiperSplashInnerpage = new Swiper(".rbt-splash-innerpage-slider", {
        speed: 10000,
        loop: true,
        grabCursor: false,
        allowTouchMove: false,
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 25,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
        },
        breakpoints: {
          320: {
            spaceBetween: 20,
          },
          768: {
            spaceBetween: 25,
          },
        },
      });

      let swiperSplashInnerpageReverse = new Swiper(
        ".rbt-splash-innerpage-slider-reverse",
        {
          speed: 10000,
          loop: true,
          grabCursor: false,
          allowTouchMove: false,
          slidesPerView: "auto",
          centeredSlides: true,
          spaceBetween: 25,
          autoplay: {
            delay: 0,
            disableOnInteraction: false,
            reverseDirection: true,
          },
          breakpoints: {
            320: {
              spaceBetween: 20,
            },
            768: {
              spaceBetween: 25,
            },
          },
        },
      );
    },

    // move animation
    moveAnimation: function () {
      $(".rbt-shape-image").each(function () {
        new Parallax($(this)[0]);
      });
    },
    circleBrand: function () {
      const arch = document.getElementById("arch");
      if (!arch) return;

      const setCircle = () => {
        const icons = arch.querySelectorAll(".arch-icon");
        const total = icons.length;

        let width = 900;
        let height = 900; // make it a square for a full circle

        // Breakpoints
        if (window.innerWidth < 576) {
          width = 320;
          height = 320;
        } else if (window.innerWidth < 768) {
          width = 500;
          height = 500;
        } else if (window.innerWidth < 992) {
          width = 700;
          height = 700;
        } else if (window.innerWidth < 1200) {
          width = 800;
          height = 800;
        }

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = width / 2 - 50; // leave space so icons don’t spill outside

        icons.forEach((icon, i) => {
          const angle = (2 * Math.PI * i) / total; // full 360° spread
          const x = centerX + radius * Math.cos(angle) - icon.offsetWidth / 2;
          const y = centerY + radius * Math.sin(angle) - icon.offsetHeight / 2;

          icon.style.left = `${x}px`;
          icon.style.top = `${y}px`;
        });
      };

      // Initialize
      setCircle();

      // Update on resize
      window.addEventListener("resize", setCircle);
    },

    // counter
    counterUp: function () {
      onDomReady(function () {
        var odo = $(".odometer");
        odo.each(function () {
          $(".odometer").appear(function (e) {
            var countNumber = $(this).attr("data-count");
            $(this).html(countNumber);
          });
        });
      });
    },

    // tab activate
    tabActive: function () {
      (function () {
        $("#myTab a").on("click", function (e) {
          e.preventDefault();
          $(this).tab("show");
          var targetId = $(this).attr("href");
          var targetId2 = targetId + "2";
          $("#rbt-tab-content-3 .tab-pane").removeClass("show active");
          $(targetId2).addClass("show active");
        });

        // $('#myTab a').on('mouseenter', function (e) {
        //     e.preventDefault();
        //     $(this).tab('show');
        //     var targetId = $(this).attr('href');
        //     var targetId2 = targetId + "2";
        //     $('#rbt-tab-content-3 .tab-pane').removeClass('show active');
        //     $(targetId2).addClass('show active');
        // });
      })();
    },

    // subscription pricing
    pricingPlan: function () {
      var mainPlan = $(".rbt-pricing-area");
      mainPlan.each(function () {
        var yearlySelectBtn = $(".yearly-plan-btn"),
          monthlySelectBtn = $(".monthly-plan-btn"),
          monthlyPrice = $(".monthly-pricing"),
          yearlyPrice = $(".yearly-pricing"),
          buttonSlide = $(".pricing-checkbox");

        $(monthlySelectBtn).on("click", function () {
          buttonSlide.prop("checked", true);
          $(this)
            .addClass("active")
            .parent(".nav-item")
            .siblings()
            .children()
            .removeClass("active");
          monthlyPrice.css("display", "block");
          yearlyPrice.css("display", "none");
        });

        $(yearlySelectBtn).on("click", function () {
          buttonSlide.prop("checked", false);
          $(this)
            .addClass("active")
            .parent(".nav-item")
            .siblings()
            .children()
            .removeClass("active");
          monthlyPrice.css("display", "none");
          yearlyPrice.css("display", "block");
        });

        $(buttonSlide).on("change", function () {
          if ($('input[class="pricing-checkbox"]:checked').length > 0) {
            monthlySelectBtn.addClass("active");
            yearlySelectBtn.removeClass("active");
            monthlyPrice.css("display", "block");
            yearlyPrice.css("display", "none");
          } else {
            yearlySelectBtn.addClass("active");
            monthlySelectBtn.removeClass("active");
            monthlyPrice.css("display", "none");
            yearlyPrice.css("display", "block");
          }
        });
      });
    },

    // cursor animation
    cursorAnimate: function () {
      var myCursor = jQuery(".mouse-cursor");
      if (myCursor.length) {
        if ($("body")) {
          const e = document.querySelector(".cursor-inner"),
            t = document.querySelector(".cursor-outer");
          let n,
            i = 0,
            o = !1;
          ((window.onmousemove = function (s) {
            (o ||
              (t.style.transform =
                "translate(" + s.clientX + "px, " + s.clientY + "px)"),
              (e.style.transform =
                "translate(" + s.clientX + "px, " + s.clientY + "px)"),
              (n = s.clientY),
              (i = s.clientX));
          }),
            $("body").on(
              "mouseenter",
              "a, button, .cursor-pointer",
              function () {
                (e.classList.add("cursor-hover"),
                  t.classList.add("cursor-hover"));
              },
            ),
            $("body").on(
              "mouseleave",
              "a, button, .cursor-pointer",
              function () {
                ($(this).is("a") &&
                  $(this).closest(".cursor-pointer").length) ||
                  (e.classList.remove("cursor-hover"),
                  t.classList.remove("cursor-hover"));
              },
            ),
            (e.style.visibility = "visible"),
            (t.style.visibility = "visible"));
        }
      }
    },

    // gsap animation
    gsapAnimation: function () {
      // splash hero content animation
      (function () {
        const heroContent = document.querySelector(
          "[data-splash-hero-animate]",
        );

        if (!heroContent) return;

        const contentElements = Array.from(heroContent.children);
        const underlinePath = heroContent.querySelector(
          ".underline-svg path",
        );
        const poweredItems = Array.from(
          heroContent.querySelectorAll(".powered-list li"),
        );
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (prefersReducedMotion) {
          gsap.set(
            [
              ...contentElements,
              ...poweredItems,
              ...(underlinePath ? [underlinePath] : []),
            ],
            {
              clearProps: "all",
            },
          );
          return;
        }

        const underlineLength = underlinePath
          ? underlinePath.getTotalLength()
          : 0;

        if (underlinePath) {
          gsap.set(underlinePath, {
            strokeDasharray: underlineLength,
            strokeDashoffset: underlineLength,
          });
        }

        const tl = gsap.timeline({
          defaults: {
            duration: 0.65,
            ease: "power3.out",
          },
        });

        tl.from(contentElements, {
          y: 24,
          autoAlpha: 0,
          stagger: 0.1,
        });

        if (underlinePath) {
          tl.to(
            underlinePath,
            {
              strokeDashoffset: 0,
              duration: 0.8,
              ease: "power2.out",
              clearProps: "strokeDasharray,strokeDashoffset",
            },
            0.35,
          );
        }

        tl.fromTo(
          poweredItems,
          {
            y: 10,
            autoAlpha: 0,
            scale: 0.92,
          },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.35,
            stagger: 0.05,
            clearProps: "opacity,visibility,transform",
          },
          "-=0.35",
        );
      })();

      // splash hero images animation
      (function () {
        const heroImages = document.querySelector(".rbt-splash-hero-images");

        if (!heroImages) return;

        const imageItems = Array.from(
          heroImages.querySelectorAll(".rbt-splash-hero-single-image"),
        );
        const lineImage = heroImages.querySelector(".rbt-splash-hero-image-7");
        const floatingImages = imageItems.filter((item) => item !== lineImage);
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (prefersReducedMotion) {
          gsap.set(imageItems, {
            clearProps: "all",
          });
          return;
        }

        const heroImageTl = gsap.timeline({
          delay: 0.15,
          defaults: {
            ease: "power3.out",
          },
        });

        gsap.set(imageItems, {
          willChange: "transform,opacity,filter",
        });

        if (lineImage) {
          heroImageTl.fromTo(
            lineImage,
            {
              autoAlpha: 0,
              scale: 0.96,
              filter: "blur(10px)",
            },
            {
              autoAlpha: 1,
              scale: 1,
              filter: "blur(0px)",
              duration: 1.15,
              ease: "power2.out",
              clearProps: "opacity,visibility,transform,filter,willChange",
            },
            0,
          );
        }

        heroImageTl.fromTo(
          floatingImages,
          {
            x: (index, target) => {
              if (target.classList.contains("rbt-splash-hero-image-2"))
                return 70;
              if (target.classList.contains("rbt-splash-hero-image-3"))
                return -70;
              if (
                target.classList.contains("rbt-splash-hero-image-4") ||
                target.classList.contains("rbt-splash-hero-image-5")
              )
                return 90;
              if (target.classList.contains("rbt-splash-hero-image-6"))
                return -90;
              return 0;
            },
            y: (index, target) => {
              if (target.classList.contains("rbt-splash-hero-image-1"))
                return 34;
              if (
                target.classList.contains("rbt-splash-hero-image-2") ||
                target.classList.contains("rbt-splash-hero-image-3")
              )
                return 46;
              if (target.classList.contains("rbt-splash-hero-image-4"))
                return -36;
              if (target.classList.contains("rbt-splash-hero-image-5"))
                return -70;
              if (target.classList.contains("rbt-splash-hero-image-6"))
                return 40;
              return 0;
            },
            scale: 0.88,
            autoAlpha: 0,
            filter: "blur(8px)",
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: {
              each: 0.08,
              from: "center",
            },
            clearProps: "opacity,visibility,transform,filter,willChange",
          },
          0.18,
        );
      })();

      // splash features section animation
      (function () {
        const featuresSection = document.querySelector(
          "[data-splash-features-animate]",
        );

        if (!featuresSection) return;

        const headerElements = Array.from(
          featuresSection.querySelectorAll(
            ".rbt-splash-features-header > *",
          ),
        );
        const featurePanels = Array.from(
          featuresSection.querySelectorAll(
            ".rbt-splash-feature-card, .rbt-splash-feature-stats-panel",
          ),
        );
        const speedBar = featuresSection.querySelector(
          ".rbt-splash-feature-speed-bar.is-primary",
        );
        const supportCapsules = Array.from(
          featuresSection.querySelectorAll(
            ".rbt-capsules .rbt-capsule-item",
          ),
        );
        const animatedElements = [
          ...headerElements,
          ...featurePanels,
          ...supportCapsules,
          ...(speedBar ? [speedBar] : []),
        ];
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (prefersReducedMotion) {
          gsap.set(animatedElements, {
            clearProps: "all",
          });
          return;
        }

        gsap.fromTo(
          headerElements,
          {
            y: 20,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: {
              trigger: featuresSection.querySelector(
                ".rbt-splash-features-header",
              ),
              start: "top 85%",
              once: true,
            },
          },
        );

        featurePanels.forEach((panel) => {
          gsap.fromTo(
            panel,
            {
              y: 30,
              autoAlpha: 0,
            },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.6,
              ease: "power3.out",
              clearProps: "opacity,visibility,transform",
              scrollTrigger: {
                trigger: panel,
                start: "top 85%",
                once: true,
              },
            },
          );
        });

        if (speedBar) {
          gsap.fromTo(
            speedBar,
            {
              scaleX: 0,
              transformOrigin: "left center",
            },
            {
              scaleX: 1,
              duration: 1,
              ease: "power2.out",
              clearProps: "transform,transformOrigin",
              scrollTrigger: {
                trigger: speedBar,
                start: "top 90%",
                once: true,
              },
            },
          );
        }

        if (supportCapsules.length) {
          gsap.fromTo(
            supportCapsules,
            {
              y: -80,
              autoAlpha: 0,
            },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.9,
              stagger: 0.12,
              ease: "back.out(1.3)",
              clearProps: "opacity,visibility,transform",
              scrollTrigger: {
                trigger: featuresSection.querySelector(
                  ".rbt-splash-feature-support-badges",
                ),
                start: "top 80%",
                once: true,
              },
            },
          );
        }
      })();

      // splash demos section animation
      (function () {
        const demosSection = document.querySelector(
          "[data-splash-demos-animate]",
        );

        if (!demosSection) return;

        const demosHeader = demosSection.querySelector(
          ".rbt-splash-demos-header",
        );
        const headerElements = Array.from(demosHeader.children);
        const demoCards = Array.from(
          demosSection.querySelectorAll(".rbt-splash-demo-card"),
        );
        const animatedElements = [...headerElements, ...demoCards];
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (prefersReducedMotion) {
          gsap.set(animatedElements, {
            clearProps: "all",
          });
          return;
        }

        gsap.fromTo(
          headerElements,
          {
            y: 20,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: {
              trigger: demosHeader,
              start: "top 85%",
              once: true,
            },
          },
        );

        demoCards.forEach((card, index) => {
          gsap.set(card, {
            transition: "none",
            willChange: "transform,opacity",
          });

          gsap.fromTo(
            card,
            {
              y: 24,
              autoAlpha: 0,
            },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.85,
              delay: (index % 2) * 0.08,
              ease: "power2.out",
              force3D: true,
              clearProps:
                "opacity,visibility,transform,transition,willChange",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                once: true,
              },
            },
          );
        });
      })();

      // splash countdown section animation
      (function () {
        const countdownSection = document.querySelector(
          "[data-splash-countdown-animate]",
        );

        if (!countdownSection) return;

        const panel = countdownSection.querySelector(
          ".rbt-splash-countdown-panel",
        );
        const contentElements = Array.from(
          countdownSection.querySelector(
            ".rbt-splash-countdown-content",
          ).children,
        );
        const countdownCard = countdownSection.querySelector(
          ".rbt-splash-countdown-card",
        );
        const countdownUnits = Array.from(
          countdownSection.querySelectorAll(".rbt-splash-countdown-unit"),
        );
        const decorations = Array.from(
          countdownSection.querySelectorAll(
            ".rbt-splash-countdown-bg, .rbt-splash-countdown-card-leaf-shape",
          ),
        );
        const animatedElements = [
          panel,
          ...contentElements,
          countdownCard,
          ...countdownUnits,
          ...decorations,
        ];
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (prefersReducedMotion) {
          gsap.set(animatedElements, {
            clearProps: "all",
          });
          return;
        }

        gsap.set(contentElements, {
          transition: "none",
          willChange: "transform,opacity",
        });
        gsap.set(countdownCard, {
          willChange: "transform,opacity",
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top 85%",
            once: true,
          },
          defaults: {
            ease: "power2.out",
          },
        });

        tl.fromTo(
          panel,
          {
            y: 20,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.5,
            clearProps: "opacity,visibility,transform",
          },
        )
          .fromTo(
            decorations,
            {
              autoAlpha: 0,
            },
            {
              autoAlpha: 1,
              duration: 0.5,
              stagger: 0.08,
              clearProps: "opacity,visibility",
            },
            "-=0.5",
          )
          .fromTo(
            contentElements,
            {
              y: 22,
              autoAlpha: 0,
            },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.6,
              stagger: 0.09,
              clearProps:
                "opacity,visibility,transform,transition,willChange",
            },
            "-=0.55",
          )
          .fromTo(
            countdownCard,
            {
              x: 28,
              autoAlpha: 0,
            },
            {
              x: 0,
              autoAlpha: 1,
              duration: 0.8,
              clearProps: "opacity,visibility,transform,willChange",
            },
            "-=0.6",
          )
          .fromTo(
            countdownUnits,
            {
              y: 14,
              autoAlpha: 0,
            },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.5,
              stagger: 0.07,
              clearProps: "opacity,visibility,transform",
            },
            "-=0.42",
          );
      })();

      // splash inner page section animation
      (function () {
        const innerPageSection = document.querySelector(
          "[data-splash-innerpage-animate]",
        );

        if (!innerPageSection) return;

        const innerPageHeader = innerPageSection.querySelector(
          ".rbt-splash-innerpage-header",
        );
        const headerElements = Array.from(innerPageHeader.children);
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (prefersReducedMotion) {
          gsap.set(headerElements, {
            clearProps: "opacity,visibility,transform",
          });
          return;
        }

        gsap.fromTo(
          headerElements,
          {
            y: 30,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: "power2.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: {
              trigger: innerPageHeader,
              start: "top 85%",
              once: true,
            },
          },
        );
      })();

      // splash elements center content animation
      (function () {
        const elementsSection = document.querySelector(
          "#splash-elements-section",
        );

        if (!elementsSection) return;

        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const media = gsap.matchMedia();

        const animateCenter = (selector) => {
          const center = elementsSection.querySelector(selector);
          const elements = Array.from(center.children);

          if (prefersReducedMotion) {
            gsap.set(elements, {
              clearProps: "opacity,visibility,transform",
            });
            return;
          }

          gsap.fromTo(
            elements,
            {
              y: 24,
              autoAlpha: 0,
            },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.75,
              stagger: 0.08,
              ease: "power2.out",
              clearProps: "opacity,visibility,transform",
              scrollTrigger: {
                trigger: center,
                start: "top 85%",
                once: true,
              },
            },
          );
        };

        media.add(
          "(min-width: 768px) and (max-width: 1199px)",
          () => animateCenter('[data-elements-center="md-lg"]'),
        );

        media.add(
          "(max-width: 767px), (min-width: 1200px)",
          () => animateCenter('[data-elements-center="default"]'),
        );
      })();

      // splash responsive layout section animation
      (function () {
        const responsiveSection = document.querySelector(
          "[data-splash-responsive-animate]",
        );

        if (!responsiveSection) return;

        const headerElements = Array.from(
          responsiveSection.querySelector(
            ".rbt-splash-responsive-header",
          ).children,
        );
        const mobile = responsiveSection.querySelector(
          ".rbt-splash-responsive-mobile",
        );
        const cards = Array.from(
          responsiveSection.querySelectorAll(
            ".rbt-splash-responsive-card",
          ),
        );
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (prefersReducedMotion) {
          gsap.set([...headerElements, mobile, ...cards], {
            clearProps: "opacity,visibility,transform,transition",
          });
          return;
        }

        gsap.fromTo(
          headerElements,
          {
            y: 30,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: {
              trigger: responsiveSection.querySelector(
                ".rbt-splash-responsive-header",
              ),
              start: "top 80%",
              once: true,
            },
          },
        );

        gsap.fromTo(
          mobile,
          {
            scale: 0.8,
            autoAlpha: 0,
          },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 0.9,
            ease: "power2.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: {
              trigger: mobile,
              start: "top 80%",
              once: true,
            },
          },
        );

        cards.forEach((card) => {
          const isLeftCard =
            card.classList.contains("rbt-splash-responsive-card--tl") ||
            card.classList.contains("rbt-splash-responsive-card--bl");

          gsap.set(card, {
            transition: "none",
          });

          gsap.fromTo(
            card,
            {
              x: isLeftCard ? -40 : 40,
              autoAlpha: 0,
            },
            {
              x: 0,
              autoAlpha: 1,
              duration: 0.75,
              ease: "power2.out",
              clearProps: "opacity,visibility,transform,transition",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                once: true,
              },
            },
          );
        });
      })();

      // scrolling text animation
      const anim = $(".animation-container");
      anim.each(function () {
        gsap.to(".animation-container .scrolling-content", {
          transform: "translateX(-20%)",
          scrollTrigger: {
            trigger: ".animation-container",
            scroller: "body",
            start: "top 80%",
            end: "top -100%",
            scrub: 2,
          },
        });
      });

      // image zooming with scrolling up and down
      const animImage = $(".animation-container-2 .rbt-anim-img");
      animImage.each(function () {
        gsap.to(".animation-container-2 .rbt-anim-img", {
          transform: "scale(1.2)",
          scrollTrigger: {
            trigger: ".animation-container-2",
            scroller: "body",
            start: "top 80%",
            end: "top -100%",
            scrub: 2,
            ease: Power3.out,
          },
        });
      });

      // banner content animation
      (function () {
        let tl = gsap.timeline();
        const slideContent = $(".rbt-banner-content .rbt-slide-element");
        if (slideContent.length) {
          tl.from(".rbt-slide-element", {
            y: 30,
            autoAlpha: 0,
            duration: 0.5,
            ease: "none",
            stagger: 0.3,
          });
        }
      })();

      // slide up animation
      (function () {
        const cardContainer = $(".rbt-slide-anim-container");
        cardContainer.length &&
          cardContainer.each(function () {
            const container = $(this);
            gsap.from(container.find(".rbt-slide-up"), {
              y: 150,
              autoAlpha: 0,
              stagger: {
                amount: 0.5,
              },
              duration: 0.6,
              ease: "expoScale(0.5,7,none)",
              scrollTrigger: {
                scroller: "body",
                trigger: container,
                start: "top 80%",
                end: "top 20%",
              },
            });
          });
      })();

      // section title animation
      (function () {
        const sectionTitleWrapper = $(".rbt-section-title");
        if (sectionTitleWrapper.length) {
          sectionTitleWrapper.each(function () {
            const wrapper = $(this);
            gsap.from(wrapper.find(".section-ele-slide-up"), {
              y: 70,
              opacity: 0,
              stagger: 0.3,
              scrollTrigger: {
                scroller: "body",
                trigger: wrapper,
                start: "top 85%",
                end: "top 20%",
              },
            });
          });
        }
      })();

      // common text split animation
      (function () {
        const textAnim = document.querySelectorAll(".rbt-text-anim");
        function setupSplit_1() {
          textAnim.forEach((text) => {
            if (text.anim) {
              text.anim.progress(1).kill();
              text.split.revert();
            }

            text.split = new SplitText(text, {
              type: "lines,words,chars",
              linesClass: "split-line",
            });

            text.anim = gsap.from(text.split.lines, {
              scrollTrigger: {
                trigger: text,
                // toggleActions: "restart none none reset",
                start: "top 95%",
              },
              duration: 0.7,
              y: 50,
              opacity: 0,
              ease: "expoScale(0.5,7,none)",
              stagger: 0.2,
              delay: 0,
            });
          });
        }
        ScrollTrigger.addEventListener("refresh", setupSplit_1);
        setupSplit_1();
      })();

      // magnetic area
      (function () {
        const magnetArea = document.querySelectorAll(".magnetic-area-overlay");
        const magnetBtn = document.querySelectorAll(".rbt-magnetic-btn");
        const container = document.querySelector(".container");

        let initialXValue = 0;
        let initialYValue = 120;

        if (magnetArea.length && magnetBtn.length) {
          let xAxis = 0;
          let yAxis = 0;

          magnetArea.forEach((area) => {
            initialXValue = (area.offsetWidth - container.offsetWidth) / 2;
            magnetBtn.forEach((btn) => {
              btn.style.transform = `translateX(${initialXValue}px) translateY(120px)`;
            });
            area.addEventListener("mousemove", (e) => {
              xAxis = e.offsetX;
              yAxis = e.offsetY;

              magnetBtn.forEach((btn) => {
                gsap.to(btn, {
                  x: xAxis - btn.offsetWidth / 2,
                  y: yAxis - btn.offsetWidth / 2,
                  duration: 1.5,
                  ease: "elastic.out(0.3,0.3)",
                });
              });
            });
            area.addEventListener("mouseleave", () => {
              magnetBtn.forEach((btn) => {
                gsap.to(btn, {
                  x: initialXValue,
                  y: initialYValue,
                  duration: 1.5,
                  ease: "elastic.out(0.3,0.3)",
                });
              });
            });
          });
        }
      })();

      // magnetic area - 2 (Bottom)
      (function () {
        const magnetArea = document.querySelectorAll(
          ".magnetic-area-overlay-2",
        );
        const magnetBtn = document.querySelectorAll(".rbt-magnetic-btn-2");
        const container = document.querySelector(".container");

        let initialXValue = 0;
        let initialYValue = 0;

        function getInitialPositions(area) {
          let y;

          if (window.innerWidth > 1400) {
            y = 475;
            initialXValue = Math.max(
              50,
              (area.offsetWidth - container.offsetWidth) / 2,
            );
          } else if (window.innerWidth > 1200) {
            y = 375;
            initialXValue = Math.max(
              50,
              (area.offsetWidth - container.offsetWidth) / 2,
            );
          } else if (window.innerWidth > 992) {
            y = 275;
            initialXValue = Math.max(
              50,
              (area.offsetWidth - container.offsetWidth) / 2,
            );
          } else if (window.innerWidth > 768) {
            y = 175;
            initialXValue = 50;
          } else {
            y = 288;
            initialXValue = Math.max(
              50,
              (area.offsetWidth - container.offsetWidth) / 2,
            );
          }

          return y;
        }

        function applyInitialPositions() {
          magnetArea.forEach((area) => {
            initialYValue = getInitialPositions(area);

            magnetBtn.forEach((btn) => {
              gsap.set(btn, {
                x: initialXValue,
                y: initialYValue,
              });
            });
          });
        }

        if (magnetArea.length && magnetBtn.length) {
          applyInitialPositions();

          magnetArea.forEach((area) => {
            area.addEventListener("mousemove", (e) => {
              const xAxis = e.offsetX;
              const yAxis = e.offsetY;

              magnetBtn.forEach((btn) => {
                gsap.to(btn, {
                  x: xAxis - btn.offsetWidth / 2,
                  y: yAxis - btn.offsetHeight / 2,
                  duration: 1.5,
                  ease: "elastic.out(0.3,0.3)",
                });
              });
            });

            area.addEventListener("mouseleave", () => {
              magnetBtn.forEach((btn) => {
                gsap.to(btn, {
                  x: initialXValue,
                  y: initialYValue,
                  duration: 1.5,
                  ease: "elastic.out(0.3,0.3)",
                });
              });
            });
          });

          // Recalculate on resize without reload
          window.addEventListener("resize", applyInitialPositions);
        }
      })();

      // magnetic area - 3 (Center)
      (function () {
        const magnetArea = document.querySelectorAll(
          ".magnetic-area-overlay-3",
        );
        const magnetBtn = document.querySelectorAll(".rbt-magnetic-btn");

        if (magnetArea.length && magnetBtn.length) {
          magnetArea.forEach((area) => {
            area.addEventListener("mousemove", (e) => {
              magnetBtn.forEach((btn) => {
                gsap.to(btn, {
                  x: e.offsetX - btn.offsetWidth / 2,
                  y: e.offsetY - btn.offsetHeight / 2,
                  duration: 1.5,
                  ease: "elastic.out(0.3,0.3)",
                });
              });
            });

            area.addEventListener("mouseleave", () => {
              magnetBtn.forEach((btn) => {
                const centerX = area.offsetWidth / 2 - btn.offsetWidth / 2;
                const centerY = area.offsetHeight / 2 - btn.offsetHeight / 2;

                gsap.to(btn, {
                  x: centerX,
                  y: centerY,
                  duration: 1.5,
                  ease: "elastic.out(0.3,0.3)",
                });
              });
            });

            magnetBtn.forEach((btn) => {
              const centerX = area.offsetWidth / 2 - btn.offsetWidth / 2;
              const centerY = area.offsetHeight / 2 - btn.offsetHeight / 2;
              btn.style.transform = `translate(${centerX}px, ${centerY}px)`;
            });
          });
        }
      })();

      // zoom out with scroll
      (function () {
        const zoomOutArea = document.querySelectorAll(
          ".rbt-zoom-out-with-scroll",
        );
        if (zoomOutArea.length) {
          zoomOutArea.forEach((area) => {
            gsap.from(zoomOutArea, {
              transform: "scale(1.3)",
              duration: 2,
              scrollTrigger: {
                trigger: ".rbt-zoom-out-with-scroll",
                scroller: "body",
                start: "top 100%",
                end: "top -50%",
                scrub: 1,
              },
            });
          });
        }
      })();

      // brand group position animation
      (function () {
        const boxGroup = document.querySelectorAll(".rbt-brand-box-group");
        gsap.from(boxGroup, {
          transform: "scale(0.8)",
          duration: 1,
          scrollTrigger: {
            trigger: boxGroup,
            scroller: "body",
            start: "top 80%",
            end: "top 10%",
          },
        });

        gsap.from(".rbt-brand-box-group .rbt-brand-box", {
          transform: "rotate3d(1, 1, 1, 45deg) translateY(45px)",
          duration: 0.6,
          opacity: 0,
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".rbt-brand-box-group .rbt-brand-box",
            scroller: "body",
            start: "top 80%",
            end: "top 10%",
            // markers: true,
          },
        });
      })();

      (function () {
        const portions = Array.from(
          document.querySelectorAll(".rbt-lookbook-portion"),
        );
        let activeEl = null;

        const setActive = (el) => {
          if (activeEl === el) return;
          portions.forEach((p) => p.classList.remove("active"));
          el?.classList.add("active");
          activeEl = el || null;
        };

        portions.forEach((el) => {
          el.addEventListener("mouseenter", () => setActive(el));

          el.addEventListener("click", (e) => {
            if (e.target.closest(".rbt-lookbook-close-btn")) return;
            setActive(el);
          });

          el.querySelector(".rbt-lookbook-close-btn")?.addEventListener(
            "click",
            (e) => {
              e.stopPropagation();
              setActive(null);
            },
          );

          el.addEventListener("focusin", () => setActive(el));
        });

        // Optional: ESC clears active
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") setActive(null);
        });

        // Default on load: none active (do nothing)
        // If you want a default active on load, uncomment:
        // setActive(portions[0]);
      })();
      (function () {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          document
            .querySelectorAll(".rbt-progress-wrapper .progress")
            .forEach((progress) => {
              const value =
                parseFloat(progress.getAttribute("aria-valuenow")) || 0;
              const bar = progress.querySelector(".progress-bar");
              const label = progress
                .closest(".rbt-progress-default")
                ?.querySelector("h5");
              if (bar) bar.style.width = value + "%";
              if (label) label.textContent = value + "%";
            });
        } else {
          gsap.registerPlugin(ScrollTrigger);

          document
            .querySelectorAll(".rbt-progress-wrapper")
            .forEach((wrapper) => {
              const tl = gsap.timeline({
                scrollTrigger: {
                  trigger: wrapper,
                  start: "top 70%",
                  toggleActions: "play none none none", // play once
                },
              });

              wrapper.querySelectorAll(".progress").forEach((progress) => {
                const bar = progress.querySelector(".progress-bar");
                const value =
                  parseFloat(progress.getAttribute("aria-valuenow")) || 0;

                // % label is the <h5> in the same ".rbt-progress-default"
                const label = progress
                  .closest(".rbt-progress-default")
                  ?.querySelector("h5");

                // Start from 0
                if (bar) {
                  gsap.set(bar, { width: "0%" });
                  tl.to(
                    bar,
                    { width: value + "%", duration: 1.2, ease: "power2.out" },
                    0,
                  );
                }

                if (label) {
                  const counter = { val: 0 };
                  tl.to(
                    counter,
                    {
                      val: value,
                      duration: 1.2,
                      ease: "power2.out",
                      onUpdate: () => {
                        label.textContent = Math.round(counter.val) + "%";
                      },
                    },
                    0,
                  );
                }
              });
            });
        }
      })();

      // sticky seciton scroll animation
      (function () {
        // gsap.utils.toArray(".rbt-sticky-ele-blur").forEach((element) => {
        //     gsap.to(element, {
        //         transform: "scale(0.8)",
        //         filter: "blur(3px)",
        //         scrollTrigger: {
        //             trigger: element,
        //             start: "top top",
        //             end: "bottom top",
        //             // start: "top 0%",
        //             // end: "top -100%",
        //             scrub: 1,
        //             invalidateOnRefresh: true,
        //         }
        //     });
        // });

        if (
          typeof gsap !== "undefined" &&
          typeof ScrollTrigger !== "undefined"
        ) {
          gsap.utils.toArray(".rbt-sticky-ele-blur").forEach((element) => {
            // Set initial state for the element
            gsap.set(element, { scale: 1, filter: "blur(0px)" });

            // Define the animation to be triggered on scroll
            gsap.to(element, {
              scale: 0.8,
              filter: "blur(3px)",
              scrollTrigger: {
                trigger: element,
                start: "top top",
                end: "bottom top",
                scrub: 1,
                invalidateOnRefresh: true,
                onEnter: () =>
                  gsap.set(element, { clearProps: "scale,filter" }),
                onLeaveBack: () =>
                  gsap.set(element, { clearProps: "scale,filter" }),
              },
            });
          });

          // Refresh ScrollTrigger on window resize
          window.addEventListener("resize", () => {
            ScrollTrigger.refresh();
          });
        }
      })();

      // watermark animation
      (function () {
        const watermark = document.querySelectorAll(
          ".rbt-section-title  .rbt-watermark",
        );
        if (watermark.length) {
          watermark.forEach((mark) => {
            gsap.from(mark, {
              y: 200,
              scale: 0.8,
              opacity: 0,
              duration: 1,
              scrollTrigger: {
                trigger: ".rbt-section-title",
                scroller: "body",
              },
            });
          });
        }
      })();

      // timeline active item progress with scroll
      (function () {
        if (
          typeof gsap !== "undefined" &&
          typeof ScrollTrigger !== "undefined"
        ) {
          const progressLine = $(".rbt-timeline-has-progress");
          if (progressLine.length) {
            // Set initial height via CSS (or inline style)
            progressLine.find(".rbt-timeline-line").css("height", "auto"); // Start with auto height or whatever initial value you prefer.

            ScrollTrigger.matchMedia({
              // For screens between 320px and 767px
              "(min-width: 320px) and (max-width: 767px)": function () {
                gsap.to(progressLine.find(".rbt-timeline-line"), {
                  height: "calc(100% - 100px)",
                  scrollTrigger: {
                    trigger: progressLine.find(".rbt-timeline-line"),
                    scroller: "body",
                    start: "top 50%",
                    end: "top 0%",
                    scrub: 1,
                  },
                });
              },

              // For screens between 768px and 991px
              "(min-width: 768px) and (max-width: 991px)": function () {
                gsap.to(progressLine.find(".rbt-timeline-line"), {
                  height: "calc(100% - 70px)",
                  scrollTrigger: {
                    trigger: progressLine.find(".rbt-timeline-line"),
                    scroller: "body",
                    start: "top 50%",
                    end: "top 0%",
                    scrub: 1,
                  },
                });
              },

              // For screens between 992px and 1199px
              "(min-width: 992px) and (max-width: 1199px)": function () {
                gsap.to(progressLine.find(".rbt-timeline-line"), {
                  height: "calc(100% - 100px)",
                  scrollTrigger: {
                    trigger: progressLine.find(".rbt-timeline-line"),
                    scroller: "body",
                    start: "top 50%",
                    end: "top 0%",
                    scrub: 1,
                  },
                });
              },

              // For screens >= 1200px
              "(min-width: 1200px)": function () {
                gsap.to(progressLine.find(".rbt-timeline-line"), {
                  height: "calc(100% - 70px)",
                  scrollTrigger: {
                    trigger: progressLine.find(".rbt-timeline-line"),
                    scroller: "body",
                    start: "top 50%",
                    end: "top 0%",
                    scrub: 1,
                  },
                });
              },
            });

            // Scroll-triggered class addition for `.rbt-timeline-item`
            gsap.utils.toArray(".rbt-timeline-item").forEach((item) => {
              ScrollTrigger.create({
                trigger: item,
                start: "top 45%",
                end: "top 0%",
                onEnter: () => item.classList.add("active-item"),
                onLeaveBack: () => item.classList.remove("active-item"),
              });
            });

            // Listen for window resize and refresh ScrollTrigger
            window.addEventListener("resize", () => {
              ScrollTrigger.refresh(); // Recalculate positions of scroll triggers
            });
            window.addEventListener("load", () => {
              ScrollTrigger.refresh(); // Recalculate positions of scroll triggers
            });

            // Trigger ScrollTrigger refresh after page load
            ScrollTrigger.refresh();
          }
        }
      })();

      // offcanvas content load animation
      (function () {
        function loadOffcanvasContent() {
          const contentWrapper = $(".rbt-offcanvas-content-load-anim");
          if (contentWrapper.length) {
            contentWrapper.each(function () {
              const wrapper = $(this);
              gsap.to(wrapper.find(".rbt-slide-up"), {
                y: 0,
                opacity: 1,
                stagger: 0.2,
              });
            });

            gsap.to(".rbt-offcanvas-overlay-text", {
              transform: "translateX(-50%) translateY(0%)",
              opacity: 1,
            });

            gsap.to(".rbt-close-btn", {
              scale: 1,
              opacity: 1,
            });
          }
        }

        const offcanvasOpenBtn = $(".rbt-open-offcanvas");
        offcanvasOpenBtn.on("click", function () {
          setTimeout(loadOffcanvasContent, 300);
        });

        $(".close_side_menu, .rbt-offcanvas-close-btn").on(
          "click",
          function () {
            const contentWrapper = $(".rbt-offcanvas-content-load-anim");
            if (contentWrapper.length) {
              contentWrapper.each(function () {
                const wrapper = $(this);
                gsap.to(wrapper.find(".rbt-slide-up"), {
                  y: 30,
                  opacity: 0,
                  duration: 0.3,
                });
              });

              gsap.to(".rbt-offcanvas-overlay-text", {
                transform: "translateX(-50%) translateY(50%)",
                opacity: 0,
                duration: 0.5,
              });

              gsap.to(".rbt-close-btn", {
                scale: 0,
                opacity: 0,
              });
            }
          },
        );
      })();

      // magnetic offcanvas close button
      (function () {
        const closeBtn = $(".rbt-magnetic-close-btn");
        $(".close_side_menu").on("mousemove", (e) => {
          gsap.to(closeBtn[0], {
            opacity: 1,
            x: e.clientX - closeBtn[0].clientWidth / 2,
            y: e.clientY - closeBtn[0].clientHeight / 2,
            duration: 2.5,
            ease: "elastic.out(1,0.3)",
          });
        });
        $(".close_side_menu").on("mouseleave", (e) => {
          gsap.to(closeBtn[0], {
            opacity: 0,
          });
        });
      })();
    },

    // tilt animation
    tiltAnim: function () {
      VanillaTilt.init(document.querySelectorAll(".rbt-tilt-anim"), {
        max: 12,
        speed: 2000,
      });
    },

    // tab elastic hover
    elasticNavActive: function () {
      onDomReady(function () {
        function updateBackground($activeItem, $backgroundHighlight) {
          if (!$activeItem || !$activeItem.length) return; // Exit if the element doesn't exist

          const itemOffset = $activeItem.offset();
          const menuOffset = $activeItem
            .closest(".rbt-nav-effect-activation")
            .offset();

          $backgroundHighlight.css({
            width: $activeItem.outerWidth(),
            height: $activeItem.outerHeight(),
            left: itemOffset.left - menuOffset.left,
            top: itemOffset.top - menuOffset.top,
          });
        }

        function initializeNavEffectActivation(container) {
          const $menuItems = $(container).find(
            "ul li a, .rbt-elastic-btn-list button",
          );
          const $backgroundHighlight = $(container).find(".rbt-bg-highlight");
          updateBackground(
            $(container).find("a.active, button.active"),
            $backgroundHighlight,
          );

          // Add event listeners to each menu item
          $menuItems.each(function () {
            // $(this).on('mouseenter', function () {
            //     updateBackground($(this), $backgroundHighlight);

            //     // Add hover effect and keep track of the active item
            //     $menuItems.removeClass('hovered');
            //     $(this).addClass('hovered');
            // });

            // $(this).on('mouseleave', function () {
            //     $(this).removeClass('hovered');
            //     updateBackground($(container).find('a.active, button.active'), $backgroundHighlight);
            // });

            $(this).on("click", function (e) {
              e.preventDefault();
              $menuItems.removeClass("active");
              $(this).addClass("active");
              updateBackground($(this), $backgroundHighlight);
            });
          });

          $(container).on("mouseleave", function () {
            $menuItems.removeClass("hovered");
            updateBackground(
              $(container).find("a.active, button.active"),
              $backgroundHighlight,
            );
          });
        }

        $(".rbt-nav-effect-activation").each(function () {
          initializeNavEffectActivation(this);
        });
      });
    },

    // testimonial lookbook toggle in small device
    closeTestimonialOverlay: function () {
      $(".rbt-lookbook-close-btn").on("mouseenter", function () {
        $(".rbt-lookbook-content-box-wrapper").fadeIn();
      });

      $(".rbt-lookbook-close-btn").on("click", function () {
        $(".rbt-lookbook-content-box-wrapper").fadeOut();
      });
    },

    // range slider
    rbtPriceRangeBar: function () {
      $(".rbt-slider-range").slider({
        range: true,
        min: 0,
        max: 10000,
        values: [0, 10000],
        slide: function (event, ui) {
          $(".amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
        },
      });
      $(".amount").val(
        "$" +
          $(".rbt-slider-range").slider("values", 0) +
          " - $" +
          $(".rbt-slider-range").slider("values", 1),
      );
    },

    // tab activation on hover
    hoverTab: function () {
      let card = $(".rbt-custom-tab");
      if (card.length > 0) {
        $(".rbt-custom-tab").on("click", function () {
          $(".rbt-custom-tab").removeClass("active");
          $(this).addClass("active");
        });
      }
    },

    selectPickerActivation: function () {
      $(".rbt-select-activation").selectpicker();
    },

    tooltipActive: function () {
      const activators = document.querySelectorAll(".rbt-tooltip-activator");
      activators.forEach((ele) => {
        ele.addEventListener("mouseenter", (event) => {
          activators.forEach((item) => item.classList.remove("tooltip-active"));
          ele.classList.add("tooltip-active");
          event.stopPropagation();
        });
        ele.addEventListener("mouseleave", (event) => {
          activators.forEach((item) => item.classList.remove("tooltip-active"));
        });
      });
      document.addEventListener("mouseenter", () => {
        activators.forEach((item) => item.classList.remove("tooltip-active"));
      });
    },

    tooltipActiveDefault: function () {
      const activators = document.querySelectorAll(".rbt-tooltip-activator-2");

      if (activators.length > 0) {
        activators[0].classList.add("tooltip-active");
      }

      activators.forEach((ele) => {
        ele.addEventListener("mouseenter", (event) => {
          activators.forEach((item) => item.classList.remove("tooltip-active"));
          ele.classList.add("tooltip-active");
          event.stopPropagation();
        });
      });
    },

    fancyboxActive: function () {
      Fancybox.bind("[data-fancybox]", {
        Thumbs: {
          type: "classic",
        },
      });
    },

    borderHover: function () {
      let cards = document.querySelectorAll(".rbt-bg-flashlight");
      cards.forEach((bgflashlight) => {
        bgflashlight.onmousemove = function (e) {
          let x = e.pageX - bgflashlight.offsetLeft;
          let y = e.pageY - bgflashlight.offsetTop;
          bgflashlight.style.setProperty("--x", x + "px");
          bgflashlight.style.setProperty("--y", y + "px");
        };
      });
    },

    clockVibrate: function () {
      onDomReady(function () {
        function vibrateEffect() {
          setTimeout(function () {
            $(".rbt-clock-vibrate").addClass("active");

            setTimeout(function () {
              $(".rbt-clock-vibrate").removeClass("active");
            }, 1000);
          }, 2000);
        }

        // Run vibrateEffect continuously with an interval
        setInterval(vibrateEffect, 3000);
      });
    },

    countdownTimer: function () {
      const countdowns = document.querySelectorAll("[data-countdown]");

      if (!countdowns.length) return;

      const parseValue = (value) => {
        const parsed = Number.parseInt(value, 10);
        return Number.isNaN(parsed) ? 0 : Math.max(parsed, 0);
      };

      const padValue = (value) => String(Math.max(value, 0)).padStart(2, "0");

      const renderCountdown = (countdown, values) => {
        const days = countdown.querySelector('[data-countdown-value="days"]');
        const hours = countdown.querySelector('[data-countdown-value="hours"]');
        const minutes = countdown.querySelector(
          '[data-countdown-value="minutes"]',
        );
        const seconds = countdown.querySelector(
          '[data-countdown-value="seconds"]',
        );

        if (!days || !hours || !minutes || !seconds) return;

        days.textContent = padValue(values.days);
        hours.textContent = padValue(values.hours);
        minutes.textContent = padValue(values.minutes);
        seconds.textContent = padValue(values.seconds);
      };

      const getSecondsFromValues = (values) =>
        values.days * 86400 +
        values.hours * 3600 +
        values.minutes * 60 +
        values.seconds;

      const getValuesFromSeconds = (totalSeconds) => ({
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      });

      const hasDurationValue = (countdown) =>
        [
          countdown.dataset.countdownDays,
          countdown.dataset.countdownHours,
          countdown.dataset.countdownMinutes,
          countdown.dataset.countdownSeconds,
        ].some((value) => value && value.trim() !== "");

      const getSecondsFromTarget = (targetDate) => {
        const targetTime = Date.parse(targetDate);

        if (Number.isNaN(targetTime)) return 0;

        const remainingTime = Math.max(targetTime - Date.now(), 0);
        return Math.floor(remainingTime / 1000);
      };

      countdowns.forEach((countdown) => {
        if (countdown.dataset.countdownStarted === "true") return;
        countdown.dataset.countdownStarted = "true";

        const targetDate = countdown.dataset.countdownTarget;
        let values = {
          days: parseValue(countdown.dataset.countdownDays),
          hours: parseValue(countdown.dataset.countdownHours),
          minutes: parseValue(countdown.dataset.countdownMinutes),
          seconds: parseValue(countdown.dataset.countdownSeconds),
        };

        const durationSeconds = getSecondsFromValues(values);
        const initialSeconds =
          hasDurationValue(countdown) || !targetDate
            ? durationSeconds
            : getSecondsFromTarget(targetDate);
        let currentSeconds = initialSeconds;

        renderCountdown(countdown, getValuesFromSeconds(currentSeconds));

        if (initialSeconds <= 0) return;

        window.setInterval(() => {
          currentSeconds -= 1;
          renderCountdown(countdown, getValuesFromSeconds(currentSeconds));

          if (currentSeconds <= 0) {
            currentSeconds = initialSeconds;
          }
        }, 1000);
      });
    },

    dynamicYear: function () {
      const currentYear = new Date().getFullYear();
      const yearRegex = /20\d{2}/;
      const elements = document.querySelectorAll(".rbt-dynamic-year");

      elements.forEach((element) => {
        element.childNodes.forEach((node) => {
          if (node.nodeType === 3 && yearRegex.test(node.textContent)) {
            node.textContent = node.textContent.replace(yearRegex, currentYear);
          }
        });
      });
    },
  };
  rbt.i();
})(window, document, jQuery);
