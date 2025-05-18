//window scroll
$(window).on("scroll", function(){
    var scrollTop = $(window).scrollTop();
    if(scrollTop >= 80){
        $('body').addClass('fixed-header')
    }
    else{
        $('body').removeClass('fixed-header')
    }
});

//document ready
$(document).ready(function(){
    new Typed("#type-it", {
        strings: ['Designer', 'Developer'],
        typeSpeed: 100,
        backSpeed: 25,
        loop: true
    });

    //one page scroll
    $.scrollIt(
        {
        
            easing: 'linear',      // the easing function for animation
            
            topOffset: -70  
        }
    );
});