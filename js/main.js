(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

/*-----------------------------------------
 TABLE OF CONTENT
 1. backToTop
 2. fullWidthCarousel
 3. dataAttrSettingCarousel
 4. groupItemCarousel
 5. lazyloadProduct
 6. countDown
 7. initDropdown for mobile version
 8. smoothScroll
------------------------------------------*/
/*-----------------------------------------
 PLUGIN
 1. jQuery v2.2.5-pre
 2. Bootstrap v4.0.0-beta.2 (https://getbootstrap.com)
 3. Countdown for jQuery v2.1.0 (http://keith-wood.name/countdown.html)
 4. Owl Carousel v2.2.1
 5. popper.js - dependency for Bootstrap v4
	
------------------------------------------*/

!function ($) {
    "use strict";

    var myTheme = {};

    /*-----------------------------------------
    1. backToTop
    ------------------------------------------*/
    myTheme.backToTop = function () {
        var offset = 800,
            $back_to_top = $('#back-top > a');

        $(window).scroll(function () {
            if ($(this).scrollTop() > offset) {
                $back_to_top.fadeIn();
            } else {
                $back_to_top.fadeOut();
            }
        });

        $back_to_top.on('click', function (event) {
            console.log("d");
            event.preventDefault();
            $("html, body").animate({ scrollTop: 0 }, 1000, "swing");
        });
    };

    /*-----------------------------------------
    2. fullWidthCarousel
    ------------------------------------------*/
    myTheme.fullWidthCarousel = function (el) {
        var $captionEl = $('li .caption-wrapper', el),
            $progressbarEl = $(".slider-progressbar");
        $(el)
        // Notice that initialize.owl.carousel and initialized.owl.carousel events must be attached before Owl Carousel initialization
        .on('initialized.owl.carousel', function () {
            $progressbarEl.css("width", "100%");
            makeAnimation();
        }).owlCarousel({
            items: 1,
            nav: true,
            navText: ['<i class="fa fa-long-arrow-left"></i>', '<i class="fa fa-long-arrow-right"></i>'],
            navSpeed: 1000
            // dots: false,
        }).on('translate.owl.carousel', function (event) {
            $progressbarEl.removeClass("animated").css("width", "0%");
            $('.caption-wrapper [data-animation]').each(function () {
                var $this = $(this);
                $this.removeClass(" animated " + $this.data('animation')).removeAttr('style');
            });
        }).on('translated.owl.carousel', function (event) {
            $progressbarEl.addClass("animated").css("width", "100%");
            makeAnimation();
        });

        function makeAnimation() {
            var elems = $(".owl-item.active").find('.caption-wrapper [data-animation]');
            elems.each(function () {
                var $this = $(this),
                    $animationType = $this.data('animation'),
                    $animationDelay = $this.data('delay');
                $this.addClass(" animated " + $animationType).css({ "animation-delay": $animationDelay });
            });
        }
        function setNumberedPagination(event) {
            var html = '<div class="slider-info">';
            html += '<span class="current-slider"> 0' + (event.item.index + 1) + '</span>';
            html += '<span class="total-slider"> /0' + event.item.count + '</span> </div>';

            $(".hero-section .owl-carousel").append(html);
        }
    };

    /*-----------------------------------------
    3. dataAttrSettingCarousel
    ------------------------------------------*/
    function criteriaEnableSlider($this, totalItem, itemLg) {
        if (totalItem <= itemLg) {
            $this.addClass("carousel-disabled");
            $this.children().each(function () {
                var owlLazy = $(".owl-lazy", self);
                owlLazy.attr("src", owlLazy.data("src"));
            });
            return false;
        };
    }
    myTheme.dataAttrSettingCarousel = function () {
        $('.owl-carousel.has-dataAttr-setting').each(function () {
            var self = this,
                $this = $(self),
                proItem = $(".product-item", self),
                totalItem = proItem.length,
                $nav = $this.data('nav') || false,
                itemXs = parseInt($this.data('items')[0]) || 2,
                itemMd = parseInt($this.data('items')[1]) || 3,
                itemLg = parseInt($this.data('items')[2]) || 4;

            criteriaEnableSlider($this, totalItem, itemLg);

            $this.owlCarousel({
                responsiveClass: true,
                responsive: {
                    0: { items: itemXs, margin: 15 },
                    // 576: { items: itemXs , margin: 15},
                    767: { items: itemMd },
                    992: { items: itemLg }
                },
                nav: $nav,
                navText: ['<i class="fa fa-long-arrow-left"></i>', '<i class="fa fa-long-arrow-right"></i>'],
                margin: 30,
                loop: false,
                rewind: false,
                lazyLoad: true
            });
        });
    };

    /*-----------------------------------------
    4. groupItemCarousel
    ------------------------------------------*/
    myTheme.groupItemCarousel = function (el) {
        $(el).each(function () {
            var self = this,
                $this = $(self),
                proItem = $(self).children(),
                totalItem = proItem.length,
                wrapperClass = $this.data('class'),
                isFullWith = $this.data('fullwith'),
                $nav = $this.data('nav') || false,
                count = parseInt($this.data('group')) || 1,
                itemXs = parseInt($this.data('items')[0]) || 2,
                itemMd = (parseInt($this.data('items')[1]) || 3) * count,
                itemLg = (parseInt($this.data('items')[2]) || 4) * count;

            criteriaEnableSlider($this, totalItem, itemLg);

            $this.owlCarousel({
                items: 1,
                nav: $nav,
                navText: ['<i class="fa fa-long-arrow-left"></i>', '<i class="fa fa-long-arrow-right"></i>'],
                loop: false,
                rewind: false,
                lazyLoad: true,
                onInitialize: function onInitialize() {
                    if (isFullWith) {
                        proItem.wrap("<div class='" + wrapperClass + "'/>");
                        for (var i = 0; i < totalItem; i += itemLg) {
                            $("." + wrapperClass.replace(' ', '.'), self).slice(i, i + itemLg).wrapAll("<div class='product-row row'/>");
                        }
                        $(".product-row", self).wrap("<div class='container'/>");
                    } else {
                        for (var _i = 0; _i < totalItem; _i += itemLg) {
                            proItem.slice(_i, _i + itemLg).wrapAll("<div class='product-row'/>");
                        }
                    }
                }
            });
        });
    };

    /*-----------------------------------------
    5. lazyloadProduct
    ------------------------------------------*/
    myTheme.lazyloadProduct = function (el) {
        $(el).each(function () {
            $('.owl-lazy', this).each(function (index, el) {
                if (index < 6) {
                    $(this).attr('src', $(this).data('src')).parents('.product-item').addClass('col-6');
                } else {
                    $(this).parents('.product-item').hide();
                }
            });
            $(this).addClass('lazyload-pro').wrapInner('<div class="row"/>');
        });
    };

    /*-----------------------------------------
    6. countDown
    ------------------------------------------*/
    myTheme.countDown = function (el) {
        var self = $(el),
            t = self.data("year"),
            a = self.data("month"),
            d = self.data("day"),
            o = self.data("hour"),
            n = self.data("minute"),
            i = self.data("timezone"),
            s = self.data("month-label") || "MONTHS",
            r = self.data("day-label") || "DAYS",
            l = self.data("hour-label") || "HOURS",
            f = self.data("minute-label") || "MINS",
            g = self.data("second-label") || "SECS",
            u = self.data("digit-size"),
            p = self.data("label-size");
        new Date().getMonth() !== a && (a -= 1);
        self.countdown({
            until: new Date(t, a, d, o, n, 44),
            labels: ["Years", s, "Weeks", r, l, f, g],
            format: "ODHMS",
            timezone: i,
            padZeroes: !0,
            onTick: function onTick() {
                self.find(".countdown-amount").css({
                    "font-size": u + "px",
                    "line-height": u + "px"
                }), self.find(".countdown-period").css({
                    "font-size": p + "px"
                });
            }
        });
    };

    /*-----------------------------------------
    7. initDropdown for mobile version
    ------------------------------------------*/
    myTheme.initDropdown = function (el) {
        $(el).each(function () {
            var $self = $(this),
                linkEl = $self.find('a'),
                html = '<option value="0">- Please chose a category -</option>';

            $self.append('<select class="filter-dropdown"/>');
            linkEl.text(function (index, content) {
                html += '<option value="' + (index + 1) + '"> ' + content + '</option>';
            });
            $(".filter-dropdown", this).append(html);
            linkEl.hide();
        });
    };

    /*-----------------------------------------
    8. smoothScroll
    ------------------------------------------*/
    myTheme.smoothScroll = function (el) {
        $(el).on('click', function (e) {
            e.preventDefault();
            $(document).off("scroll");
            var target = this.hash;
            var marginTarget = parseInt($(target).css("margin-top"), 10);;
            var posTop = $(target).offset().top;
            $('html, body').stop().animate({
                'scrollTop': posTop - 90 - marginTarget
            }, 500, 'swing');
        });
    };

    /*-----------------------------------------
    9. navAnimation for desktop & ipad
    ------------------------------------------*/
    myTheme.navAnimation = function (el) {
        var $el = $(el),
            trigger = $el.find('.side-menu-btn'),
            menuItems = $el.find('.nav-mainHeader').find('li');

        if ($el.length) {
            menuItems.each(function () {
                var $this = $(this);
                $this.css({
                    '-webkit-transition-delay': $this.index() / 15 + 's',
                    '-moz-transition-delay': $this.index() / 15 + 's',
                    'transition-delay': $this.index() / 15 + 's'
                });
            });
            trigger.on('click', function (event) {
                event.preventDefault();
                $('body').toggleClass('menu-activated');
            });
        };
    };
    $(document).ready(function () {
        "use strict";

        var windowWidth = $(window).width(),
            windowHeight = $(window).height();
        $('body').scrollspy({
            target: '#navbarToggler', // direct parent element of the ul and not the ul
            offset: 100
        });

        if (windowWidth < 576) {
            myTheme.initDropdown(".filter-wrapper");
            myTheme.lazyloadProduct('.product-section .owl-carousel[data-group]');
            myTheme.groupItemCarousel($('.owl-carousel[data-group]:not(.product-carousel)'));
        } else {
            myTheme.groupItemCarousel('.owl-carousel[data-group]');
            myTheme.navAnimation(".menu-wrapper");
        }
        // if(windowWidth > 991){
        //     let urlImg = $(".hero-section .thumnail-slider img").attr('src');
        //     $(".hero-section .thumnail-slider").css({"background-image": `url(${urlImg})`});
        // }
        myTheme.fullWidthCarousel(".hero-section .owl-carousel");
        myTheme.dataAttrSettingCarousel();
        myTheme.countDown("#count-down");
        myTheme.smoothScroll('a[data-smooth-scroll], .nav-mainHeader a');
        myTheme.backToTop();
    });

    $(window).on('resize', function () {}).on('load', function () {
        $("#loading-wrapper").fadeOut(500);
    }).on('scroll', function () {
        var windowWidth = $(window).width(),
            header = $(".header-section"),
            pos = $(".overview-section").offset().top;

        if (windowWidth > 767) {
            $(window).scrollTop() >= pos ? header.addClass("sticky") : header.removeClass("sticky");
        }
    });
}(jQuery);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzb3VyY2UvanMvbWFpbi5lczYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7Ozs7OztBQVdBOzs7Ozs7Ozs7O0FBVUEsQ0FBQyxVQUFTLENBQVQsRUFBWTtBQUNUOztBQUNBLFFBQUksVUFBVSxFQUFkOztBQUVBOzs7QUFHQSxZQUFRLFNBQVIsR0FBb0IsWUFBSztBQUNyQixZQUFJLFNBQVMsR0FBYjtBQUFBLFlBQ0ksZUFBZSxFQUFFLGVBQUYsQ0FEbkI7O0FBR0EsVUFBRSxNQUFGLEVBQVUsTUFBVixDQUFpQixZQUFVO0FBQ3ZCLGdCQUFJLEVBQUUsSUFBRixFQUFRLFNBQVIsS0FBc0IsTUFBMUIsRUFBbUM7QUFDL0IsNkJBQWEsTUFBYjtBQUNILGFBRkQsTUFFSztBQUNELDZCQUFhLE9BQWI7QUFDSDtBQUNKLFNBTkQ7O0FBUUEscUJBQWEsRUFBYixDQUFnQixPQUFoQixFQUF5QixVQUFDLEtBQUQsRUFBUztBQUM5QixvQkFBUSxHQUFSLENBQVksR0FBWjtBQUNBLGtCQUFNLGNBQU47QUFDQSxjQUFFLFlBQUYsRUFBZ0IsT0FBaEIsQ0FBd0IsRUFBQyxXQUFZLENBQWIsRUFBeEIsRUFBeUMsSUFBekMsRUFBZ0QsT0FBaEQ7QUFFSCxTQUxEO0FBTUgsS0FsQkQ7O0FBb0JBOzs7QUFHQSxZQUFRLGlCQUFSLEdBQTRCLFVBQUMsRUFBRCxFQUFPO0FBQy9CLFlBQUksYUFBYSxFQUFFLHFCQUFGLEVBQXlCLEVBQXpCLENBQWpCO0FBQUEsWUFDSSxpQkFBaUIsRUFBRSxxQkFBRixDQURyQjtBQUVGLFVBQUUsRUFBRjtBQUNFO0FBREYsU0FFRyxFQUZILENBRU0sMEJBRk4sRUFFa0MsWUFBWTtBQUN4QywyQkFBZSxHQUFmLENBQW1CLE9BQW5CLEVBQTRCLE1BQTVCO0FBQ0E7QUFDSCxTQUxILEVBTUcsV0FOSCxDQU1lO0FBQ1QsbUJBQU0sQ0FERztBQUVU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LENBQThCLEdBQTlCO0FBQ0gsS0FKTCxFQUtLLEVBTEwsQ0FLUyxRQUxULEVBS21CLFlBQUk7QUFDZixZQUFJLGNBQWMsRUFBRSxNQUFGLEVBQVUsS0FBVixFQUFsQjtBQUFBLFlBQ0ksU0FBUyxFQUFFLGlCQUFGLENBRGI7QUFBQSxZQUVJLE1BQU0sRUFBRSxtQkFBRixFQUF1QixNQUF2QixHQUFnQyxHQUYxQzs7QUFJQSxZQUFJLGNBQWMsR0FBbEIsRUFBc0I7QUFDbEIsY0FBRSxNQUFGLEVBQVUsU0FBVixNQUF5QixHQUF6QixHQUErQixPQUFPLFFBQVAsQ0FBZ0IsUUFBaEIsQ0FBL0IsR0FBMkQsT0FBTyxXQUFQLENBQW1CLFFBQW5CLENBQTNEO0FBRUg7QUFDSixLQWRMO0FBZUgsQ0E3VEEsQ0E2VEMsTUE3VEQsQ0FBRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuIFRBQkxFIE9GIENPTlRFTlRcclxuIDEuIGJhY2tUb1RvcFxyXG4gMi4gZnVsbFdpZHRoQ2Fyb3VzZWxcclxuIDMuIGRhdGFBdHRyU2V0dGluZ0Nhcm91c2VsXHJcbiA0LiBncm91cEl0ZW1DYXJvdXNlbFxyXG4gNS4gbGF6eWxvYWRQcm9kdWN0XHJcbiA2LiBjb3VudERvd25cclxuIDcuIGluaXREcm9wZG93biBmb3IgbW9iaWxlIHZlcnNpb25cclxuIDguIHNtb290aFNjcm9sbFxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiBQTFVHSU5cclxuIDEuIGpRdWVyeSB2Mi4yLjUtcHJlXHJcbiAyLiBCb290c3RyYXAgdjQuMC4wLWJldGEuMiAoaHR0cHM6Ly9nZXRib290c3RyYXAuY29tKVxyXG4gMy4gQ291bnRkb3duIGZvciBqUXVlcnkgdjIuMS4wIChodHRwOi8va2VpdGgtd29vZC5uYW1lL2NvdW50ZG93bi5odG1sKVxyXG4gNC4gT3dsIENhcm91c2VsIHYyLjIuMVxyXG4gNS4gcG9wcGVyLmpzIC0gZGVwZW5kZW5jeSBmb3IgQm9vdHN0cmFwIHY0XHJcblx0XHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG4hZnVuY3Rpb24oJCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBsZXQgbXlUaGVtZSA9IHt9O1xyXG5cclxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIDEuIGJhY2tUb1RvcFxyXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuICAgIG15VGhlbWUuYmFja1RvVG9wID0gKCk9PiB7XHJcbiAgICAgICAgbGV0IG9mZnNldCA9IDgwMCxcclxuICAgICAgICAgICAgJGJhY2tfdG9fdG9wID0gJCgnI2JhY2stdG9wID4gYScpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgaWYoICQodGhpcykuc2Nyb2xsVG9wKCkgPiBvZmZzZXQgKSB7IFxyXG4gICAgICAgICAgICAgICAgJGJhY2tfdG9fdG9wLmZhZGVJbigpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICRiYWNrX3RvX3RvcC5mYWRlT3V0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICAkYmFja190b190b3Aub24oJ2NsaWNrJywgKGV2ZW50KT0+e1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImRcIik7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoXCJodG1sLCBib2R5XCIpLmFuaW1hdGUoe3Njcm9sbFRvcCA6IDB9LCAxMDAwICwgXCJzd2luZ1wiKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgMi4gZnVsbFdpZHRoQ2Fyb3VzZWxcclxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbiAgICBteVRoZW1lLmZ1bGxXaWR0aENhcm91c2VsID0gKGVsKT0+IHtcclxuICAgICAgICBsZXQgJGNhcHRpb25FbCA9ICQoJ2xpIC5jYXB0aW9uLXdyYXBwZXInLCBlbCksXHJcbiAgICAgICAgICAgICRwcm9ncmVzc2JhckVsID0gJChcIi5zbGlkZXItcHJvZ3Jlc3NiYXJcIik7XHJcbiAgICAgICQoZWwpXHJcbiAgICAgICAgLy8gTm90aWNlIHRoYXQgaW5pdGlhbGl6ZS5vd2wuY2Fyb3VzZWwgYW5kIGluaXRpYWxpemVkLm93bC5jYXJvdXNlbCBldmVudHMgbXVzdCBiZSBhdHRhY2hlZCBiZWZvcmUgT3dsIENhcm91c2VsIGluaXRpYWxpemF0aW9uXHJcbiAgICAgICAgLm9uKCdpbml0aWFsaXplZC5vd2wuY2Fyb3VzZWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRwcm9ncmVzc2JhckVsLmNzcyhcIndpZHRoXCIsIFwiMTAwJVwiKTtcclxuICAgICAgICAgICAgbWFrZUFuaW1hdGlvbigpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgaXRlbXM6MSxcclxuICAgICAgICAgICAgbmF2OiB0cnVlLFxyXG4gICAgICAgICAgICBuYXZUZXh0OiBbJzxpIGNsYXNzPVwiZmEgZmEtbG9uZy1hcnJvdy1sZWZ0XCI+PC9pPicsICc8aSBjbGFzcz1cImZhIGZhLWxvbmctYXJyb3ctcmlnaHRcIj48L2k+J10sXHJcbiAgICAgICAgICAgIG5hdlNwZWVkOiAxMDAwLFxyXG4gICAgICAgICAgICAvLyBkb3RzOiBmYWxzZSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5vbigndHJhbnNsYXRlLm93bC5jYXJvdXNlbCcsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAkcHJvZ3Jlc3NiYXJFbC5yZW1vdmVDbGFzcyhcImFuaW1hdGVkXCIpLmNzcyhcIndpZHRoXCIsIFwiMCVcIik7XHJcbiAgICAgICAgICAgICQoJy5jYXB0aW9uLXdyYXBwZXIgW2RhdGEtYW5pbWF0aW9uXScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICR0aGlzLnJlbW92ZUNsYXNzKFwiIGFuaW1hdGVkIFwiKyAkdGhpcy5kYXRhKCdhbmltYXRpb24nKSkucmVtb3ZlQXR0cignc3R5bGUnKSA7ICAgXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm9uKCd0cmFuc2xhdGVkLm93bC5jYXJvdXNlbCcsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAkcHJvZ3Jlc3NiYXJFbC5hZGRDbGFzcyhcImFuaW1hdGVkXCIpLmNzcyhcIndpZHRoXCIsIFwiMTAwJVwiKTtcclxuICAgICAgICAgICAgbWFrZUFuaW1hdGlvbigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBtYWtlQW5pbWF0aW9uKCl7XHJcbiAgICAgICAgICAgIHZhciBlbGVtcz0gJChcIi5vd2wtaXRlbS5hY3RpdmVcIikuZmluZCgnLmNhcHRpb24td3JhcHBlciBbZGF0YS1hbmltYXRpb25dJyk7XHJcbiAgICAgICAgICAgIGVsZW1zLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgICAgICAkYW5pbWF0aW9uVHlwZSA9ICR0aGlzLmRhdGEoJ2FuaW1hdGlvbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICRhbmltYXRpb25EZWxheT0gJHRoaXMuZGF0YSgnZGVsYXknKTtcclxuICAgICAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKFwiIGFuaW1hdGVkIFwiKyAkYW5pbWF0aW9uVHlwZSkuY3NzKHtcImFuaW1hdGlvbi1kZWxheVwiOiRhbmltYXRpb25EZWxheX0pIDsgICBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHNldE51bWJlcmVkUGFnaW5hdGlvbihldmVudCl7XHJcbiAgICAgICAgICAgIGxldCBodG1sID0gJzxkaXYgY2xhc3M9XCJzbGlkZXItaW5mb1wiPic7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gJzxzcGFuIGNsYXNzPVwiY3VycmVudC1zbGlkZXJcIj4gMCcgKyAoZXZlbnQuaXRlbS5pbmRleCArIDEpICArICc8L3NwYW4+JztcclxuICAgICAgICAgICAgaHRtbCArPSAnPHNwYW4gY2xhc3M9XCJ0b3RhbC1zbGlkZXJcIj4gLzAnICsgZXZlbnQuaXRlbS5jb3VudCArICc8L3NwYW4+IDwvZGl2Pic7XHJcblxyXG4gICAgICAgICAgICAkKFwiLmhlcm8tc2VjdGlvbiAub3dsLWNhcm91c2VsXCIpLmFwcGVuZChodG1sKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgMy4gZGF0YUF0dHJTZXR0aW5nQ2Fyb3VzZWxcclxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbiAgICBmdW5jdGlvbiBjcml0ZXJpYUVuYWJsZVNsaWRlcigkdGhpcywgdG90YWxJdGVtLCBpdGVtTGcpe1xyXG4gICAgICAgIGlmKHRvdGFsSXRlbSA8PSBpdGVtTGcpIHtcclxuICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoXCJjYXJvdXNlbC1kaXNhYmxlZFwiKTtcclxuICAgICAgICAgICAgJHRoaXMuY2hpbGRyZW4oKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGxldCBvd2xMYXp5ID0gJChcIi5vd2wtbGF6eVwiLCBzZWxmKTtcclxuICAgICAgICAgICAgb3dsTGF6eS5hdHRyKFwic3JjXCIsIG93bExhenkuZGF0YShcInNyY1wiKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIG15VGhlbWUuZGF0YUF0dHJTZXR0aW5nQ2Fyb3VzZWwgPSAoKT0+IHtcclxuICAgICAgICAkKCcub3dsLWNhcm91c2VsLmhhcy1kYXRhQXR0ci1zZXR0aW5nJykuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICAkdGhpcyA9ICQoc2VsZiksXHJcbiAgICAgICAgICAgICAgICBwcm9JdGVtID0gJChcIi5wcm9kdWN0LWl0ZW1cIiwgc2VsZiksXHJcbiAgICAgICAgICAgICAgICB0b3RhbEl0ZW0gPSBwcm9JdGVtLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICRuYXYgPSAkdGhpcy5kYXRhKCduYXYnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGl0ZW1YcyA9IHBhcnNlSW50KCR0aGlzLmRhdGEoJ2l0ZW1zJylbMF0pIHx8IDIsXHJcbiAgICAgICAgICAgICAgICBpdGVtTWQgPSBwYXJzZUludCgkdGhpcy5kYXRhKCdpdGVtcycpWzFdKSB8fCAzLFxyXG4gICAgICAgICAgICAgICAgaXRlbUxnID0gcGFyc2VJbnQoJHRoaXMuZGF0YSgnaXRlbXMnKVsyXSkgfHwgNDtcclxuXHJcbiAgICAgICAgICAgIGNyaXRlcmlhRW5hYmxlU2xpZGVyKCR0aGlzLCB0b3RhbEl0ZW0sIGl0ZW1MZyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAkdGhpcy5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlQ2xhc3M6dHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmUgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgMDogeyBpdGVtczogaXRlbVhzICwgbWFyZ2luOiAxNX0sXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gNTc2OiB7IGl0ZW1zOiBpdGVtWHMgLCBtYXJnaW46IDE1fSxcclxuICAgICAgICAgICAgICAgICAgICA3Njc6IHsgaXRlbXM6IGl0ZW1NZCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIDk5MjogeyBpdGVtczogaXRlbUxnIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBuYXY6ICRuYXYsXHJcbiAgICAgICAgICAgICAgICBuYXZUZXh0OiBbJzxpIGNsYXNzPVwiZmEgZmEtbG9uZy1hcnJvdy1sZWZ0XCI+PC9pPicsICc8aSBjbGFzcz1cImZhIGZhLWxvbmctYXJyb3ctcmlnaHRcIj48L2k+J10sXHJcbiAgICAgICAgICAgICAgICBtYXJnaW46IDMwLFxyXG4gICAgICAgICAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICByZXdpbmQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbGF6eUxvYWQ6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgNC4gZ3JvdXBJdGVtQ2Fyb3VzZWxcclxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbiAgICBteVRoZW1lLmdyb3VwSXRlbUNhcm91c2VsID0gKGVsKT0+IHtcclxuICAgICAgICAkKGVsKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcyxcclxuICAgICAgICAgICAgICAgICR0aGlzID0gJChzZWxmKSxcclxuICAgICAgICAgICAgICAgIHByb0l0ZW0gPSAkKHNlbGYpLmNoaWxkcmVuKCksXHJcbiAgICAgICAgICAgICAgICB0b3RhbEl0ZW0gPSBwcm9JdGVtLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgIHdyYXBwZXJDbGFzcyA9ICR0aGlzLmRhdGEoJ2NsYXNzJyksXHJcbiAgICAgICAgICAgICAgICBpc0Z1bGxXaXRoID0gJHRoaXMuZGF0YSgnZnVsbHdpdGgnKSxcclxuICAgICAgICAgICAgICAgICRuYXYgPSAkdGhpcy5kYXRhKCduYXYnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvdW50ID0gcGFyc2VJbnQoJHRoaXMuZGF0YSgnZ3JvdXAnKSkgfHwgMSxcclxuICAgICAgICAgICAgICAgIGl0ZW1YcyA9IHBhcnNlSW50KCR0aGlzLmRhdGEoJ2l0ZW1zJylbMF0pIHx8IDIsXHJcbiAgICAgICAgICAgICAgICBpdGVtTWQgPShwYXJzZUludCgkdGhpcy5kYXRhKCdpdGVtcycpWzFdKSB8fCAzKSAqIGNvdW50LFxyXG4gICAgICAgICAgICAgICAgaXRlbUxnID0gKHBhcnNlSW50KCR0aGlzLmRhdGEoJ2l0ZW1zJylbMl0pIHx8IDQpICogY291bnQ7XHJcblxyXG4gICAgICAgICAgICBjcml0ZXJpYUVuYWJsZVNsaWRlcigkdGhpcywgdG90YWxJdGVtLCBpdGVtTGcpO1xyXG5cclxuICAgICAgICAgICAgJHRoaXMub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICAgICAgaXRlbXM6IDEsXHJcbiAgICAgICAgICAgICAgICBuYXY6ICRuYXYsXHJcbiAgICAgICAgICAgICAgICBuYXZUZXh0OiBbJzxpIGNsYXNzPVwiZmEgZmEtbG9uZy1hcnJvdy1sZWZ0XCI+PC9pPicsICc8aSBjbGFzcz1cImZhIGZhLWxvbmctYXJyb3ctcmlnaHRcIj48L2k+J10sXHJcbiAgICAgICAgICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHJld2luZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBsYXp5TG9hZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG9uSW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzRnVsbFdpdGgpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9JdGVtLndyYXAoXCI8ZGl2IGNsYXNzPSdcIisgd3JhcHBlckNsYXNzICtcIicvPlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRvdGFsSXRlbTsgaSs9aXRlbUxnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFwiLlwiICsgd3JhcHBlckNsYXNzLnJlcGxhY2UoJyAnLCcuJyksIHNlbGYpLnNsaWNlKGksIGkraXRlbUxnKS53cmFwQWxsKFwiPGRpdiBjbGFzcz0ncHJvZHVjdC1yb3cgcm93Jy8+XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5wcm9kdWN0LXJvd1wiLCBzZWxmKS53cmFwKFwiPGRpdiBjbGFzcz0nY29udGFpbmVyJy8+XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdG90YWxJdGVtOyBpKz1pdGVtTGcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb0l0ZW0uc2xpY2UoaSwgaStpdGVtTGcpLndyYXBBbGwoXCI8ZGl2IGNsYXNzPSdwcm9kdWN0LXJvdycvPlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgNS4gbGF6eWxvYWRQcm9kdWN0XHJcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4gICAgbXlUaGVtZS5sYXp5bG9hZFByb2R1Y3QgPSAoZWwpPT4ge1xyXG4gICAgICAgICQoZWwpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgJCgnLm93bC1sYXp5JywgdGhpcykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpe1xyXG4gICAgICAgICAgICAgICAgaWYoaW5kZXggPCA2KXtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ3NyYycsICQodGhpcykuZGF0YSgnc3JjJykpLnBhcmVudHMoJy5wcm9kdWN0LWl0ZW0nKS5hZGRDbGFzcygnY29sLTYnKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygnLnByb2R1Y3QtaXRlbScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2xhenlsb2FkLXBybycpLndyYXBJbm5lcignPGRpdiBjbGFzcz1cInJvd1wiLz4nKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICA2LiBjb3VudERvd25cclxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbiAgICBteVRoZW1lLmNvdW50RG93biA9IChlbCk9PntcclxuICAgICAgICB2YXIgc2VsZiA9ICQoZWwpLFxyXG4gICAgICAgIHQgPSBzZWxmLmRhdGEoXCJ5ZWFyXCIpLFxyXG4gICAgICAgIGEgPSBzZWxmLmRhdGEoXCJtb250aFwiKSxcclxuICAgICAgICBkID0gc2VsZi5kYXRhKFwiZGF5XCIpLFxyXG4gICAgICAgIG8gPSBzZWxmLmRhdGEoXCJob3VyXCIpLFxyXG4gICAgICAgIG4gPSBzZWxmLmRhdGEoXCJtaW51dGVcIiksXHJcbiAgICAgICAgaSA9IHNlbGYuZGF0YShcInRpbWV6b25lXCIpLFxyXG4gICAgICAgIHMgPSBzZWxmLmRhdGEoXCJtb250aC1sYWJlbFwiKSB8fCBcIk1PTlRIU1wiLFxyXG4gICAgICAgIHIgPSBzZWxmLmRhdGEoXCJkYXktbGFiZWxcIikgfHwgXCJEQVlTXCIsXHJcbiAgICAgICAgbCA9IHNlbGYuZGF0YShcImhvdXItbGFiZWxcIikgfHwgXCJIT1VSU1wiLFxyXG4gICAgICAgIGYgPSBzZWxmLmRhdGEoXCJtaW51dGUtbGFiZWxcIikgfHwgXCJNSU5TXCIsXHJcbiAgICAgICAgZyA9IHNlbGYuZGF0YShcInNlY29uZC1sYWJlbFwiKSB8fCBcIlNFQ1NcIixcclxuICAgICAgICB1ID0gc2VsZi5kYXRhKFwiZGlnaXQtc2l6ZVwiKSxcclxuICAgICAgICBwID0gc2VsZi5kYXRhKFwibGFiZWwtc2l6ZVwiKTtcclxuICAgICAgICBuZXcgRGF0ZSgpLmdldE1vbnRoKCkgIT09IGEgJiYgKGEgLT0gMSk7XHJcbiAgICAgICAgc2VsZi5jb3VudGRvd24oe1xyXG4gICAgICAgICAgICB1bnRpbDogbmV3IERhdGUodCxhLGQsbyxuLDQ0KSxcclxuICAgICAgICAgICAgbGFiZWxzOiBbXCJZZWFyc1wiLCBzLCBcIldlZWtzXCIsIHIsIGwsIGYsIGddLFxyXG4gICAgICAgICAgICBmb3JtYXQ6IFwiT0RITVNcIixcclxuICAgICAgICAgICAgdGltZXpvbmU6IGksXHJcbiAgICAgICAgICAgIHBhZFplcm9lczogITAsXHJcbiAgICAgICAgICAgIG9uVGljazogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHNlbGYuZmluZChcIi5jb3VudGRvd24tYW1vdW50XCIpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJmb250LXNpemVcIjogdSArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICBcImxpbmUtaGVpZ2h0XCI6IHUgKyBcInB4XCJcclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgc2VsZi5maW5kKFwiLmNvdW50ZG93bi1wZXJpb2RcIikuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBwICsgXCJweFwiXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIDcuIGluaXREcm9wZG93biBmb3IgbW9iaWxlIHZlcnNpb25cclxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbiAgICBteVRoZW1lLmluaXREcm9wZG93biA9IChlbCk9PntcclxuICAgICAgICAkKGVsKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGxldCAkc2VsZiA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICBsaW5rRWwgPSAkc2VsZi5maW5kKCdhJyksXHJcbiAgICAgICAgICAgICAgICBodG1sID0gJzxvcHRpb24gdmFsdWU9XCIwXCI+LSBQbGVhc2UgY2hvc2UgYSBjYXRlZ29yeSAtPC9vcHRpb24+JztcclxuXHJcbiAgICAgICAgICAgICRzZWxmLmFwcGVuZCgnPHNlbGVjdCBjbGFzcz1cImZpbHRlci1kcm9wZG93blwiLz4nKTtcclxuICAgICAgICAgICAgbGlua0VsLnRleHQoZnVuY3Rpb24oaW5kZXgsIGNvbnRlbnQpe1xyXG4gICAgICAgICAgICAgICAgaHRtbCArPSBgPG9wdGlvbiB2YWx1ZT1cIiR7aW5kZXggKyAxfVwiPiAke2NvbnRlbnR9PC9vcHRpb24+YDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoXCIuZmlsdGVyLWRyb3Bkb3duXCIsIHRoaXMpLmFwcGVuZChodG1sKTtcclxuICAgICAgICAgICAgbGlua0VsLmhpZGUoKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIDguIHNtb290aFNjcm9sbFxyXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuICAgIG15VGhlbWUuc21vb3RoU2Nyb2xsID0gKGVsKT0+e1xyXG4gICAgICAgICQoZWwpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJChkb2N1bWVudCkub2ZmKFwic2Nyb2xsXCIpO1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcy5oYXNoO1xyXG4gICAgICAgICAgICB2YXIgbWFyZ2luVGFyZ2V0ID0gcGFyc2VJbnQoJCh0YXJnZXQpLmNzcyhcIm1hcmdpbi10b3BcIiksIDEwKTs7XHJcbiAgICAgICAgICAgIHZhciBwb3NUb3AgPSAkKHRhcmdldCkub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgICAgICAkKCdodG1sLCBib2R5Jykuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgJ3Njcm9sbFRvcCc6ICggcG9zVG9wIC0gOTAgLSBtYXJnaW5UYXJnZXQpXHJcbiAgICAgICAgICAgIH0sIDUwMCwgJ3N3aW5nJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIDkuIG5hdkFuaW1hdGlvbiBmb3IgZGVza3RvcCAmIGlwYWRcclxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbiAgICBteVRoZW1lLm5hdkFuaW1hdGlvbiA9IChlbCk9PntcclxuICAgICAgICBsZXQgJGVsID0gJChlbCksXHJcbiAgICAgICAgICAgIHRyaWdnZXIgPSAkZWwuZmluZCgnLnNpZGUtbWVudS1idG4nKSxcclxuXHRcdFx0bWVudUl0ZW1zID0gJGVsLmZpbmQoJy5uYXYtbWFpbkhlYWRlcicpLmZpbmQoJ2xpJyk7XHJcblxyXG5cdFx0aWYgKCRlbC5sZW5ndGgpIHtcclxuXHRcdFx0bWVudUl0ZW1zLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHRcdFx0XHQkdGhpcy5jc3Moe1xyXG5cdFx0XHRcdFx0Jy13ZWJraXQtdHJhbnNpdGlvbi1kZWxheSc6ICR0aGlzLmluZGV4KCkgLyAxNSArICdzJyxcclxuXHRcdFx0XHRcdCctbW96LXRyYW5zaXRpb24tZGVsYXknOiAkdGhpcy5pbmRleCgpIC8gMTUgKyAncycsXHJcblx0XHRcdFx0XHQndHJhbnNpdGlvbi1kZWxheSc6ICR0aGlzLmluZGV4KCkgLyAxNSArICdzJ1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0dHJpZ2dlci5vbignY2xpY2snLCAoZXZlbnQpPT4ge1xyXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0JCgnYm9keScpLnRvZ2dsZUNsYXNzKCdtZW51LWFjdGl2YXRlZCcpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH07XHJcbiAgICB9XHJcbiAgICAkKGRvY3VtZW50KS5yZWFkeSggKCk9PntcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBsZXQgd2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKSxcclxuICAgICAgICAgICAgd2luZG93SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG4gICAgICAgICQoJ2JvZHknKS5zY3JvbGxzcHkoeyBcclxuICAgICAgICAgICAgdGFyZ2V0OiAnI25hdmJhclRvZ2dsZXInLCAvLyBkaXJlY3QgcGFyZW50IGVsZW1lbnQgb2YgdGhlIHVsIGFuZCBub3QgdGhlIHVsXHJcbiAgICAgICAgICAgIG9mZnNldDogMTAwIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZih3aW5kb3dXaWR0aCA8IDU3Nil7XHJcbiAgICAgICAgICAgIG15VGhlbWUuaW5pdERyb3Bkb3duKFwiLmZpbHRlci13cmFwcGVyXCIpO1xyXG4gICAgICAgICAgICBteVRoZW1lLmxhenlsb2FkUHJvZHVjdCgnLnByb2R1Y3Qtc2VjdGlvbiAub3dsLWNhcm91c2VsW2RhdGEtZ3JvdXBdJyk7XHJcbiAgICAgICAgICAgIG15VGhlbWUuZ3JvdXBJdGVtQ2Fyb3VzZWwoJCgnLm93bC1jYXJvdXNlbFtkYXRhLWdyb3VwXTpub3QoLnByb2R1Y3QtY2Fyb3VzZWwpJykpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBteVRoZW1lLmdyb3VwSXRlbUNhcm91c2VsKCcub3dsLWNhcm91c2VsW2RhdGEtZ3JvdXBdJyk7XHJcbiAgICAgICAgICAgIG15VGhlbWUubmF2QW5pbWF0aW9uKFwiLm1lbnUtd3JhcHBlclwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYod2luZG93V2lkdGggPiA5OTEpe1xyXG4gICAgICAgIC8vICAgICBsZXQgdXJsSW1nID0gJChcIi5oZXJvLXNlY3Rpb24gLnRodW1uYWlsLXNsaWRlciBpbWdcIikuYXR0cignc3JjJyk7XHJcbiAgICAgICAgLy8gICAgICQoXCIuaGVyby1zZWN0aW9uIC50aHVtbmFpbC1zbGlkZXJcIikuY3NzKHtcImJhY2tncm91bmQtaW1hZ2VcIjogYHVybCgke3VybEltZ30pYH0pO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBteVRoZW1lLmZ1bGxXaWR0aENhcm91c2VsKFwiLmhlcm8tc2VjdGlvbiAub3dsLWNhcm91c2VsXCIpO1xyXG4gICAgICAgIG15VGhlbWUuZGF0YUF0dHJTZXR0aW5nQ2Fyb3VzZWwoKTtcclxuICAgICAgICBteVRoZW1lLmNvdW50RG93bihcIiNjb3VudC1kb3duXCIpO1xyXG4gICAgICAgIG15VGhlbWUuc21vb3RoU2Nyb2xsKCdhW2RhdGEtc21vb3RoLXNjcm9sbF0sIC5uYXYtbWFpbkhlYWRlciBhJyk7XHJcbiAgICAgICAgbXlUaGVtZS5iYWNrVG9Ub3AoKTtcclxuICAgICAgIFxyXG4gICAgfSk7XHJcblxyXG4gICAgJCh3aW5kb3cpXHJcbiAgICAgICAgLm9uKCAncmVzaXplJywgKCk9Pnt9KVxyXG4gICAgICAgIC5vbiggJ2xvYWQnLCAoKT0+e1xyXG4gICAgICAgICAgICAkKFwiI2xvYWRpbmctd3JhcHBlclwiKS5mYWRlT3V0KDUwMCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAub24oICdzY3JvbGwnLCAoKT0+e1xyXG4gICAgICAgICAgICBsZXQgd2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgIGhlYWRlciA9ICQoXCIuaGVhZGVyLXNlY3Rpb25cIiksXHJcbiAgICAgICAgICAgICAgICBwb3MgPSAkKFwiLm92ZXJ2aWV3LXNlY3Rpb25cIikub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHdpbmRvd1dpZHRoID4gNzY3KXtcclxuICAgICAgICAgICAgICAgICQod2luZG93KS5zY3JvbGxUb3AoKSA+PSBwb3MgPyBoZWFkZXIuYWRkQ2xhc3MoXCJzdGlja3lcIikgOiBoZWFkZXIucmVtb3ZlQ2xhc3MoXCJzdGlja3lcIik7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pOyBcclxufShqUXVlcnkpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiJdfQ==
