;(function($, window){
    'use strict';
    var GuillaumeBoulez = function () {
        this._curr = 0;
        return this;
    }

    var gb = GuillaumeBoulez;

    gb.prototype.init = function() {
        this.document_title = "Guillaume Boulez, Fashion Stylist & Creative Director";
        
        this._isInit = false;
        this._isIos = /iphone|ipad/i.test(navigator.userAgent);

        $('body').on('click', "a[target!='_blank']", $.proxy(this._history, this));
        // $('body').on('click touchstart', "[data-action]", $.proxy(this._history, this));
        
        $(document).on('submit', "form", $.proxy(this.submitForm, this));        
        
        $.getJSON( "data.json", $.proxy(this.onReady, this));
        $(window).resize(_.debounce($.proxy(this.resizeList, this), 500));
        return this;
    }

    gb.prototype.submitForm = function(evt) {
        evt && evt.preventDefault();
        $("#frmContact").html('<h3>Thank you, you will soon received an answer.</h3>');
    }

    gb.prototype._history = function(evt) {
        alert('click');
        evt && evt.preventDefault();
        var $a = $(evt.currentTarget);
        if ($a.attr('target') == '_blank') {
            return true;
        }
        var href = $(evt.currentTarget).attr("href");
        // _gaq.push(['_trackPageview', href]);
        ga('send', 'event', 'Downloaded Video', 'Yes');

        history.pushState({}, '', $(evt.currentTarget).attr("href"));
        document.title = this.document_title + ' | ' + $(evt.currentTarget).attr("title");
        if ($a.data('action')) this[$a.data('action')](evt);
    }

    gb.prototype.onReady = function(data) {


        var pathname = window.location.pathname;
        this._images = data;
        this.pathname = null;
        if (pathname != '/') {

            this.pathname = pathname;
            this._stopLoading();
            $(".home").hide();
            this.setList();
            if (pathname != '/works' && pathname != '/works/' ) {
                $("#listing").hide();
                $('a[href="'+pathname+'"]').trigger('click');
            }
            return;
        }

        $('.tlt').textillate({
            // initialDelay: 2000,
            in: {
                effect: 'fadeIn',
                delay: 50,
                delayScale: 1.5
            }
        });

        $('.sub-site-title').textillate({
            initialDelay: 2000,
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
        $("#listing").show();
        var html = gb.templates.workListTpl;
        $('#listing').append(_.template(html, {projects:this._randomize(this._images.projects)}));
        this.resizeList();

        var $container = $('#listing>ul');
        $container.packery({
          itemSelector: 'li.pack',
          autoResize:false
          // gutter:2
          // isHorizontal:true
        }).packery('unbindResize');
        this._isInit = true;
        var that = this;
        $('#listing>ul').imagesLoaded( function() {
            var i = 0;
            $('#listing>ul>li').each(function(index, el) {
                $(this).delay(200*i++).animate({opacity: 1}, 1000);
            });
        });
        // $('#listing>ul>li').on('click', function(evt) {
        //     evt && evt.stopPropagation() && evt.preventDefault();
        // });
        return this;
    }

    gb.prototype.resizeList = function(evt) {
        
        var nbCol, gutter, itemWidth;
        var w = $(window).width();

        if (w < 640) {
            nbCol = 1;
            gutter = 20;
            itemWidth = w-40;
        
        } else if (w < 960) {
            nbCol = 2;
            gutter = Math.floor((w*20/100)/3);
            itemWidth = Math.floor(w*40/100);
        } else if (w < 1200) {
            nbCol = 3;
            gutter = Math.floor((w*10/100)/4);
            itemWidth = Math.floor(w*30/100);

        } else {
            nbCol = 4;
            itemWidth = Math.floor(w*20/100);
            gutter = Math.floor(itemWidth / 5);
        }
        $('#listing>ul>li').css({
            width:itemWidth,
            "margin-left":gutter,
            "margin-top":gutter
        })


        $('#listing>ul>li').each(function(index, el) {
           if (!$(this).hasClass('content-box')) {
                var h = Math.floor(Math.random() *itemWidth)+itemWidth;
                $(this).css('height', h);
           } 
        });
        if (this._isInit) $('#listing>ul').packery('resize');



    }

    gb.prototype.openProject = function(evt) {
        var $this = $(evt.currentTarget).closest('li');
        this._startLoading();
        
        $('<div/>', {'class':'work'}).appendTo('body');
        var w = $this.index();
        var html = gb.templates.workTpl;

        this._tn = 0;
        $('.work').append(
            _.template(html, {project:this._images.projects[w]} )
        );
        $('.swiper-container').height($(window).height()-150);
        $('.swiper-container img')
            .imagesLoaded($.proxy(this.stopLoading, this))
            .progress($.proxy(this._loading, this));
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

        var opt = {
            mode:'horizontal',
        }

        if (!this._isMobile()) opt.slidesPerView = 'auto';

        this._swiper = $('.swiper-container').swiper(opt);
        var i = 2;
        var that = this;
        $('.swiper-container img').each(function(index, el) {
           $(this).delay(i*500).animate({'opacity':1});
           i++;
        });

        $('.vimeo-thumb').smartVimeoEmbed({
            autoplay:true,
            width:$(window).width() - 550
        }).trigger('click');

    }

    gb.prototype.closeProject = function(evt) {
        $("#listing").show();
        $('.active').removeClass('active');
        setTimeout(function() {
            $('.work').remove();
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
            .addClass("active")
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
        this.resizeSlideImage(image);
        $("#loading")
            .find(".loading_bar")
            .css("width", n+'%');
    }

    gb.prototype.resizeSlideImage = function(image) {
        var $img = $(image.img);
        $img.height($('.swiper-container').height());
        var w = $(image.img).height() * image.img.width / image.img.height;
        $img.width(w);
        $img.closest('.swiper-slide').css({'width':w+20});
    }

    gb.prototype._isMobile = function() {
        return (screen.width <= 1024);
    }

    gb.prototype._tapped = function(event) {
        var touchable = 'ontouchstart' in document.documentElement;
        if((touchable && event.which === 0) || (!touchable && event.which === 1)){
            return true;
        }
        return false;
    }



    $(window).on('load', function () {
        var app = new GuillaumeBoulez().init();
    });


gb.templates = {
    workListTpl:' \
        <ul> \
            <% _.each(projects, function(project) { %> \
                <% if (project.thumb) { %> \
                    <li  data-bgcoul="<%= project.bgcoul %>"  data-part="<%= project.part %>"  style="background-image:url(/media/<%= project.path %>/<%= project.thumb %>)" class="<%= project.class %> pack"> \
                <% } %> \
                        <div class="<%= project.class %>"> \
                            <h2><a href="<%= project.uri %>" data-action="openProject" title="<%= project.title %> - <%= project.publication %>" class="goto"><%= project.title %></a></h2> \
                            <h3><%= project.publication %></h3> \
                            <%= project.html %> \
                        </div> \
                    </a> \
                </li> \
            <%});%> \
        </ul> \
',workTpl: ' \
        <h1><%= project.publication %></h1> \
        <div class="tools"> \
            <ul> \
                <li><a href="/works" class="nav-close" data-action="closeProject" title="Works">x</a></li> \
                <li><a href="#" class="nav-prev" data-action="swipePrev" title="">&#8592;</a></li> \
                <li><a href="#" class="nav-next" data-action="swipeNext" title="">&#8594;</a></li> \
            </ul> \
        </div> \
        <div class="swiper-container"> \
          <div class="swiper-wrapper"> \
              <div class="swiper-slide credits hidden-mobile hidden-tablet" style="max-width:500px;"> \
                <h2><%= project.title %></h2> \
                <% if (project.video) { %> \
                  <div class="swiper-slide video"> \
                    <div class="sw-content"> \
                        <img src="http://placehold.it/640x360" class="vimeo-thumb" data-vimeo-id="<%= project.video %>" /> \
                    </div> \
                  </div> \
                <% } %> \
                <div class="sw-content"> \
                    <p><%= project.credits %></p> \
                    <p class="shareme"> \
                        <ul class="list-inline social2"><li><a href="https://www.facebook.com/guillaume.boulez" title="Follow me on Facebook" target="_blank"><i class="fa fa-facebook"></i> &nbsp;</a></li><li><a href="https://twitter.com/guillaumeboulez" title="Follow me on Twitter"  target="_blank"><i class="fa fa-twitter"></i> &nbsp;</a></li><li><a href="http://www.pinterest.com/source/guillaumeboulez.com/" target="_blank"><i class="fa fa-pinterest"></i> &nbsp;</a></li><li><a href="http://guillaumeboulez.tumblr.com" target="_blank"><i class="fa fa-tumblr"></i> &nbsp;</a></li><li><a href="http://instagram.com/guillaumeboulez" target="_blank"><i class="fa fa-instagram"></i> &nbsp;</a></li></ul> \
                    </p> \
                </div> \
              </div> \
            <% _.each(project.data, function(slide) { %> \
              <div class="swiper-slide"> \
                <div class="sw-content"> \
                    <img src="/media/<%= project.path %>/<%= slide %>" alt=""> \
                </div> \
              </div> \
            <%});%> \
          </div> \
        </div> \
'
};


})(jQuery, window);

