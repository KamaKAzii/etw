// Carousel
//
// This plugin assumes we're working with a UL with LIs which are all the same dimension.
// It also assumes the LIs are displayed normally and are sitting in normal flow within
// the parent UL (i.e. nothing is absolutely positioned yet).

;(function ($) {
  $.fn.extend({
    carousel: function (opt) {
      var settings = $.extend({
        'navClass' : 'carouselNav',
        'animationDuration' : 1500,
        'autoScrollOnLoad' : true,
        'autoScrollInterval' : 4000,
      }, opt);

      var utils = { 
      };

      return this.each(function () {
        
        var $this = $(this);
        
        $this
          .data('$panels', $this.children('li'))
          .data('panelWidth', $this.data('$panels').eq(0).width())
          .data('panelHeight', $this.data('$panels').eq(0).height())
          .data('currentIndex', 0)
          .data('totalPanels', $this.data('$panels').length)
          .data('animationInProgress', false)
          .data('navHasBeenClicked', false)
          .on('init', function (e) {
            $this
              .css('position', 'relative')
              .css('overflow', 'hidden')
              .css('width', $this.data('panelWidth') + 'px')
              .css('height', $this.data('panelHeight') + 'px');
            $this.data('$panels')
              .css('display', 'none')
              .css('position', 'absolute')
              .css('top', '0');

            var $initialPanel = $this.data('$panels').eq($this.data('currentIndex'));
            $initialPanel
              .css('display', 'block')
              .css('left', $this.data('currentIndex') * $this.data('panelWidth'));

            var $nav = $('<ul>')
              .addClass(settings.navClass)
              .css('z-index', 30);

            $this.data('$nav', $nav);

            for (i = 0; i < $this.data('totalPanels'); i++) {
              var $currentNavLi = $('<li>')
                .html('.')
                .data('navElementIndex', i)
                .on('click', function() {
                  $this.trigger('navElementClicked', [$(this)]);
                });
              $this.data('$nav').append($currentNavLi);
            }

            $this.after($nav);

            $this.data('$nav')
              .find('li')
              .removeClass('active')
              .eq($this.data('currentIndex'))
              .addClass('active');

            if (settings.autoScrollOnLoad) {
              setInterval(function() {
                if (!$this.data('navHasBeenClicked')) {
                  $this.trigger("goRight");
                }
              }, settings.autoScrollInterval);
            }
          })
          .on('goLeft', function (e, targetPanelIndex) {

            if ($this.data('animationInProgress') == true) { return; }

            var $panelToHide = $this
              .data('$panels')
              .eq($this.data('currentIndex'))
              .css('z-index', 10);
            
            if (!targetPanelIndex) {
              $this.data('currentIndex', $this.data('currentIndex') - 1);
              if ($this.data('currentIndex') < 0) {
                $this.data('currentIndex', $this.data('totalPanels') - 1);
              }
            } else {
              $this.data('currentIndex', targetPanelIndex);
            }

            $this.data('$nav')
              .find('li')
              .removeClass('active')
              .eq($this.data('currentIndex'))
              .addClass('active');

            var $panelToShow = $this
              .data('$panels')
              .eq($this.data('currentIndex'))
              .css('z-index', 20);

            $this.data('animationInProgress', true);

            $panelToShow
              .css('display', 'block')
              .css('left', -$this.data('panelWidth') + 'px')
              .animate(
                { 'left': '0' },
                { 'duration': settings.animationDuration }
              );
            $panelToHide
              .animate(
                { 'left': $this.data('panelWidth') + 'px' },
                {
                  'duration': settings.animationDuration,
                  'complete': function() {
                    $(this).css('display', 'none');
                    $this.data('animationInProgress', false);
                  }
                }
              );
          })
          .on('goRight', function(e, targetPanelIndex) {

            if ($this.data('animationInProgress') == true) { return; }

            var $panelToHide = $this
              .data('$panels')
              .eq($this.data('currentIndex'))
              .css('z-index', 10);

            if (!targetPanelIndex) {
              $this.data('currentIndex', $this.data('currentIndex') + 1);
              if ($this.data('currentIndex') > $this.data('totalPanels') - 1) {
                $this.data('currentIndex', 0);
              }
            } else {
              $this.data('currentIndex', targetPanelIndex);
            }

            $this.data('$nav')
              .find('li')
              .removeClass('active')
              .eq($this.data('currentIndex'))
              .addClass('active');

            var $panelToShow = $this
              .data('$panels')
              .eq( $this.data('currentIndex'))
              .css('z-index', 20);

            $this.data('animationInProgress', true);

            $panelToShow
              .css('display', 'block')
              .css('left', $this.data('panelWidth') + 'px')
              .animate(
                { 'left': '0' },
                { 'duration': settings.animationDuration }
              );
            $panelToHide
              .animate(
                { 'left': -$this.data('panelWidth') + 'px' },
                {
                  'duration': settings.animationDuration,
                  'complete': function() {
                    $(this).css('display', 'none');
                    $this.data('animationInProgress', false);
                  }
                }
              );

          })
          .on('navElementClicked', function(e, $targetNavElement) {
            $this.data('navHasBeenClicked', true);
            var currentIndex = $this.data('currentIndex');
            var targetIndex = $targetNavElement.data('navElementIndex');
            if (currentIndex == targetIndex) { return; }

            // directionBool: true is right, false is left.
            var directionBool = targetIndex > currentIndex;

            if (directionBool) {
              $this.trigger('goRight', [targetIndex]);
            } else {
              $this.trigger('goLeft', targetIndex);
            }

          })
          .trigger('init');

      });
    }
  });
})(jQuery);
