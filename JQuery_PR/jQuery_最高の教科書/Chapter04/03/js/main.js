$(function(){
    // 
    var duration = 300;

    // buttons2 ----------------------------------------
    $('#buttons2 button').each(function(index){
        //var pos = Math.random() * 80 - 40;
        var pos = index * 40 - 40;
        $(this).css('top', pos);
    })
    .on('mouseover', function(){
        var $btn = $(this).stop(true).animate({
            backgroundColor: '#faee00',
            color: '#000'
        }, duration);
        $btn.find('img:first-child').stop(true).animate({opacity: 0}, duration);
        $btn.find('img:nth-child(2)').stop(true).animate({opacity: 1}, duration);
    })
    .on('mouseout', function(){
        var $btn = $(this).stop(true).animate({
            backgroundColor: '#fff',
            color: '#01b169',
        }, duration);
        $btn.find('img:first-child').stop(true).animate({opacity: 1}, duration);
        $btn.find('img:nth-child(2)').stop(true).animate({opacity: 0}, duration);
    });


});
