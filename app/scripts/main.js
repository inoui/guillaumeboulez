;(function($, window){
    'use strict';
    var GuillaumeBoulez = function () {
        this._curr = 0;
        return this;
    }

    var gb = GuillaumeBoulez;

    gb.prototype.init = function() {
        $.getJSON( "data.json", $.proxy(this.setHome, this));
        $('#home').on('click', $.proxy(this.initList, this));
        $('body').on('click', '.nav-next', $.proxy(this.swipeNext, this));
        $('body').on('click', '.nav-prev', $.proxy(this.swipePrev, this));
        $('body').on('click', '.nav-close', $.proxy(this.closeProject, this));
        return this;
    }

    gb.prototype.setHome = function(data) {

        this._images = data;

        $('.tlt').textillate({
            // initialDelay: 2000,
            in: {
                effect: 'fadeIn',
                delay: 50,
                delayScale: 1.5
            }
        });

        this.animateHome();
        this._stopLoading();
    }

    gb.prototype.animateHome = function() {

        $(".home-slider li:eq("+this._curr+")").animate({opacity: 1}, 2000);
        $(".home-slider li:eq("+(this._curr-1)+")").animate({opacity: 0}, 2000);
        this._curr++;
        if (this._curr == $(".home-slider li").size()) this._curr = 0;
        this.hometm = setTimeout($.proxy(this.animateHome, this), 6000);

    }

    gb.prototype.initList = function() {
        clearTimeout(this.hometm);
        $(".home").fadeOut(1000, $.proxy(this.setList, this))
    }

    gb.prototype.setList = function() {
        var html = $("#workListTpl").html();
        $('#listing').append(_.template(html, {projects:this._randomize(this._images.projects)}));

        $('#listing>ul>li').each(function(index, el) {
           // $(this).css('width', Math.floor(Math.random() * 200)+300);
           if (!$(this).hasClass('content-box')) {
                $(this).css('height', Math.floor(Math.random() * 400)+300);
           } else {
                // $(this).css('height', $(this).width());
           }
           // $(this).css('margin', Math.floor(Math.random() * 50) - 25);
           $(this).css('margin', '2%');
        });

        var $container = $('#listing>ul');
        $container.packery({
          itemSelector: 'li.pack',
          gutter:2
          // isHorizontal:true
        });

        $('#listing>ul').imagesLoaded( function() {
            var i = 0;
            $('#listing>ul>li').each(function(index, el) {
                $(this).delay(200*i++).animate({opacity: 1}, 1000);
            });
        });

        $('#listing>ul>li').on('click', $.proxy(this.openProject, this));

        return this;
    }
    gb.prototype.openProject = function(evt) {
        var $this = $(evt.currentTarget);
    
        this._startLoading();
        
        $('<div/>', {'id':'work'}).appendTo('body');
        var w = $this.index();
        var html = $("#workTpl").html();

        this._tn = 0;
        $('#work').append(
            _.template(html, {project:this._images.projects[w]} )
        );


        $('.swiper-container').height($(window).height()-150);
        $('.swiper-container img')
            .imagesLoaded($.proxy(this.stopLoading, this))
            .progress($.proxy(this._loading, this))

    }
    
    gb.prototype.showPart = function(elt) {
        if (elt.data("part")) {
            $("#"+elt.data("part")).addClass("active");
            $('.close').one('click', function() {
                $('.active').removeClass('active');
            });
        }
    }

    gb.prototype.stopLoading = function() {
        var that = this;
        $('.swiper-container img').css({'opacity':0});
        setTimeout(function() {
            that.onWorkLoaded();
        }, 1000);
    }


    gb.prototype.onWorkLoaded = function() {

        this._stopLoading();
        $('body').addClass('active');

        this._swiper = $('.swiper-container').swiper({
            slidesPerView: 'auto',
            updateOnImagesReady:true
            // mode:'horizontal',
            // slidesPerSlide: 'auto'
        });
        var i = 2;
        var that = this;
        $('.swiper-container img').each(function(index, el) {
           $(this).delay(i*500).animate({'opacity':1});
           i++;
            that._swiper.reInit();
        });

    }

    gb.prototype.closeProject = function(evt) {
        $('.active').removeClass('active');
        setTimeout(function() {
            $('#work').remove();
            this._swiper = null;
        }, 1000);
    }

    gb.prototype.swipeNext = function(evt) {
        this._swiper.swipeNext();
    }

    gb.prototype.swipePrev = function(evt) {
        this._swiper.swipePrev();
    }


    gb.prototype._randomize = function(array) {
        var currentIndex = array.length;
        while (0 !== currentIndex) {
            var randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            var temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }


    gb.prototype._startLoading = function() {
        $("#loading")
            .css("height", "100%");

    }

    gb.prototype._stopLoading = function() {
        $("#loading")
            .css("height", 0)
            .find(".loading_bar")
            .css("width", 0);
    }


    gb.prototype._loading = function(evt, image) {
        this._tn++;
        var n = this._tn / evt.images.length * 100;
        var $img = $(image.img);
        $img.height($('.swiper-container').height());
        var w = $(image.img).height()*image.img.width/image.img.height;
        $img.width(w);
        $img.closest('.swiper-slide').css({'width':w+'px'});

        $("#loading")
            .find(".loading_bar")
            .css("width", n+'%');
    }

    $(window).on('load', function () {
        var app = new GuillaumeBoulez().init();
    });





})(jQuery, window);



// $(function () {
//     $('.home').hide().fadeIn(2000).removeClass('hidden');
//     $('.tlt').textillate({
//         initialDelay: 2000,
//         in: {
//             effect: 'fadeIn',
//             delay: 50,
//             delayScale: 1.5
//         }
//     });
//
//     // $('.home-slider li').each(function() {
//     //     $(this).find('span').css("background-image", $(this).data('src'));
//     //     console.log($(this).data('src'))
//     //     alert('asd')
//     // });

// });
