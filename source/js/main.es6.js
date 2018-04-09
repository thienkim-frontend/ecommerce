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

!function($) {
    "use strict";
    let myTheme = {};

    /*-----------------------------------------
    1. backToTop
    ------------------------------------------*/
    myTheme.backToTop = ()=> {
        let offset = 800,
            $back_to_top = $('#back-top > a');
        
        $(window).scroll(function(){
            if( $(this).scrollTop() > offset ) { 
                $back_to_top.fadeIn();
            }else{
                $back_to_top.fadeOut();
            }
        });
        
        $back_to_top.on('click', (event)=>{
            console.log("d");
            event.preventDefault();
            $("html, body").animate({scrollTop : 0}, 1000 , "swing");
            
        });
    }

    /*-----------------------------------------
    2. fullWidthCarousel
    ------------------------------------------*/
    myTheme.fullWidthCarousel = (el)=> {
        let $captionEl = $('li .caption-wrapper', el),
            $progressbarEl = $(".slider-progressbar");
      $(el)
        // Notice that initialize.owl.carousel and initialized.owl.carousel events must be attached before Owl Carousel initialization
        .on('initialized.owl.carousel', function () {
            $progressbarEl.css("width", "100%");
            makeAnimation();
        })
        .owlCarousel({
            items:1,
            nav: true,
            navText: ['<i class="fa fa-long-arrow-left"></i>', '<i class="fa fa-long-arrow-right"></i>'],
            navSpeed: 1000,
            // dots: false,
        })
        .on('translate.owl.carousel', function (event) {
            $progressbarEl.removeClass("animated").css("width", "0%");
            $('.caption-wrapper [data-animation]').each(function () {
                var $this = $(this);
                $this.removeClass(" animated "+ $this.data('animation')).removeAttr('style') ;   
            });
        })
        .on('translated.owl.carousel', function (event) {
            $progressbarEl.addClass("animated").css("width", "100%");
            makeAnimation();
        });

        function makeAnimation(){
            var elems= $(".owl-item.active").find('.caption-wrapper [data-animation]');
            elems.each(function () {
                var $this = $(this),
                    $animationType = $this.data('animation'),
                    $animationDelay= $this.data('delay');
                $this.addClass(" animated "+ $animationType).css({"animation-delay":$animationDelay}) ;   
            });
        }
        function setNumberedPagination(event){
            let html = '<div class="slider-info">';
            html += '<span class="current-slider"> 0' + (event.item.index + 1)  + '</span>';
            html += '<span class="total-slider"> /0' + event.item.count + '</span> </div>';

            $(".hero-section .owl-carousel").append(html);
        }
    }

    /*-----------------------------------------
    3. dataAttrSettingCarousel
    ------------------------------------------*/
    function criteriaEnableSlider($this, totalItem, itemLg){
        if(totalItem <= itemLg) {
            $this.addClass("carousel-disabled");
            $this.children().each(function(){
            let owlLazy = $(".owl-lazy", self);
            owlLazy.attr("src", owlLazy.data("src"));
            });
            return false;
        };
    }
    myTheme.dataAttrSettingCarousel = ()=> {
        $('.owl-carousel.has-dataAttr-setting').each(function(){
            let self = this,
                $this = $(self),
                proItem = $(".product-item", self),
                totalItem = proItem.length,
                $nav = $this.data('nav') || false,
                itemXs = parseInt($this.data('items')[0]) || 2,
                itemMd = parseInt($this.data('items')[1]) || 3,
                itemLg = parseInt($this.data('items')[2]) || 4;

            criteriaEnableSlider($this, totalItem, itemLg);
            
            $this.owlCarousel({
                responsiveClass:true,
                responsive : {
                    0: { items: itemXs , margin: 15},
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
    }

    /*-----------------------------------------
    4. groupItemCarousel
    ------------------------------------------*/
    myTheme.groupItemCarousel = (el)=> {
        $(el).each(function(){
            let self = this,
                $this = $(self),
                proItem = $(self).children(),
                totalItem = proItem.length,
                wrapperClass = $this.data('class'),
                isFullWith = $this.data('fullwith'),
                $nav = $this.data('nav') || false,
                count = parseInt($this.data('group')) || 1,
                itemXs = parseInt($this.data('items')[0]) || 2,
                itemMd =(parseInt($this.data('items')[1]) || 3) * count,
                itemLg = (parseInt($this.data('items')[2]) || 4) * count;

            criteriaEnableSlider($this, totalItem, itemLg);

            $this.owlCarousel({
                items: 1,
                nav: $nav,
                navText: ['<i class="fa fa-long-arrow-left"></i>', '<i class="fa fa-long-arrow-right"></i>'],
                loop: false,
                rewind: false,
                lazyLoad: true,
                onInitialize: function() {
                    if (isFullWith){
                        proItem.wrap("<div class='"+ wrapperClass +"'/>");
                        for(let i = 0; i < totalItem; i+=itemLg) {
                            $("." + wrapperClass.replace(' ','.'), self).slice(i, i+itemLg).wrapAll("<div class='product-row row'/>")
                        }
                        $(".product-row", self).wrap("<div class='container'/>");
                    }else{
                        for(let i = 0; i < totalItem; i+=itemLg) {
                            proItem.slice(i, i+itemLg).wrapAll("<div class='product-row'/>");
                        }
                    }
                }
            });
        });
    }

    /*-----------------------------------------
    5. lazyloadProduct
    ------------------------------------------*/
    myTheme.lazyloadProduct = (el)=> {
        $(el).each(function(){
            $('.owl-lazy', this).each(function(index, el){
                if(index < 6){
                    $(this).attr('src', $(this).data('src')).parents('.product-item').addClass('col-6');
                }else{
                    $(this).parents('.product-item').hide();
                }
            });
            $(this).addClass('lazyload-pro').wrapInner('<div class="row"/>');
        });
    }

    /*-----------------------------------------
    6. countDown
    ------------------------------------------*/
    myTheme.countDown = (el)=>{
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
            until: new Date(t,a,d,o,n,44),
            labels: ["Years", s, "Weeks", r, l, f, g],
            format: "ODHMS",
            timezone: i,
            padZeroes: !0,
            onTick: function(){
                self.find(".countdown-amount").css({
                    "font-size": u + "px",
                    "line-height": u + "px"
                }),
                self.find(".countdown-period").css({
                    "font-size": p + "px"
                });
            }
        });
    }

    /*-----------------------------------------
    7. initDropdown for mobile version
    ------------------------------------------*/
    myTheme.initDropdown = (el)=>{
        $(el).each(function(){
            let $self = $(this),
                linkEl = $self.find('a'),
                html = '<option value="0">- Please chose a category -</option>';

            $self.append('<select class="filter-dropdown"/>');
            linkEl.text(function(index, content){
                html += `<option value="${index + 1}"> ${content}</option>`;
            });
            $(".filter-dropdown", this).append(html);
            linkEl.hide();
        })
    }

    /*-----------------------------------------
    8. smoothScroll
    ------------------------------------------*/
    myTheme.smoothScroll = (el)=>{
        $(el).on('click', function (e) {
            e.preventDefault();
            $(document).off("scroll");
            var target = this.hash;
            var marginTarget = parseInt($(target).css("margin-top"), 10);;
            var posTop = $(target).offset().top;
            $('html, body').stop().animate({
                'scrollTop': ( posTop - 90 - marginTarget)
            }, 500, 'swing');
        });
    }
    
    /*-----------------------------------------
    9. navAnimation for desktop & ipad
    ------------------------------------------*/
    myTheme.navAnimation = (el)=>{
        let $el = $(el),
            trigger = $el.find('.side-menu-btn'),
			menuItems = $el.find('.nav-mainHeader').find('li');

		if ($el.length) {
			menuItems.each(function() {
				var $this = $(this);
				$this.css({
					'-webkit-transition-delay': $this.index() / 15 + 's',
					'-moz-transition-delay': $this.index() / 15 + 's',
					'transition-delay': $this.index() / 15 + 's'
				});
			});
			trigger.on('click', (event)=> {
				event.preventDefault();
				$('body').toggleClass('menu-activated');
			});
		};
    }
    $(document).ready( ()=>{
        "use strict";
        let windowWidth = $(window).width(),
            windowHeight = $(window).height();
        $('body').scrollspy({ 
            target: '#navbarToggler', // direct parent element of the ul and not the ul
            offset: 100 
        });

        if(windowWidth < 576){
            myTheme.initDropdown(".filter-wrapper");
            myTheme.lazyloadProduct('.product-section .owl-carousel[data-group]');
            myTheme.groupItemCarousel($('.owl-carousel[data-group]:not(.product-carousel)'));
        }else{
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

    $(window)
        .on( 'resize', ()=>{})
        .on( 'load', ()=>{
            $("#loading-wrapper").fadeOut(500);
        })
        .on( 'scroll', ()=>{
            let windowWidth = $(window).width(),
                header = $(".header-section"),
                pos = $(".overview-section").offset().top;
            
            if (windowWidth > 767){
                $(window).scrollTop() >= pos ? header.addClass("sticky") : header.removeClass("sticky");
                
            }
        }); 
}(jQuery);





