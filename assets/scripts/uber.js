// uber.js

$(function() {
  
  // Setup variables
  var $menu           = $(".main-navigation");
  var $menuLis        = $menu.find("li");
  var $popovers       = $(".uber");

  $menuLis.each(function() {

    var $self = $(this);
    var targetPopoutString = $self.attr("class");
    var $targetPopout = $(".uber." + targetPopoutString);
    
    $self
      .mouseenter(function() {
        $(".uber").hide();
        $targetPopout.show();
        $self.addClass("active");
      })
      .mouseleave(function() {
        $self.removeClass("active");
        $targetPopout.hide();
      });;

    $targetPopout
      .mouseenter(function() {
        $(this).show();
        $self.addClass("active");
      })
      .mouseleave(function() {
        $(".uber").hide();
        $menuLis.removeClass("active");
      });

  });

});
