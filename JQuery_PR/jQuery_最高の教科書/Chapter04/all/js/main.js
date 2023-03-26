$(function(){
    // 
    var duration = 300;

    // typo ----------------------------------------
    $('#typo').typoShadow();

    // buttons1 ----------------------------------------
    // buttons1  1行目
    $('#buttons1 button:nth-child(-n+4)')
        .on('mouseover', function() {
            $(this).stop(true).animate({
                backgroundColor: '#ae5e9b',
                color: '#fff'
            }, duration);
        })
        .on('mouseout', function(){
            $(this).stop(true).animate({
                backgroundColor: '#fff',
                color: '#ebc000'
            }, duration);
        });

    // buttons1  2行目
    $('#buttons1 button:nth-child(n+5):nth-child(-n+8)')
        .on('mouseover', function(){
            $(this).stop(true).animate({
                borderWidth: '12px',
                color: '#ae5e9b'
            }, duration, 'easeOutSine');
        })
        .on('mouseout', function(){
            $(this).stop(true).animate({
                borderWidth: '0px',
                color: '#ebc000'
            }, duration, 'easeOutSine');
        });

    // buttons1  3行目
    $('#buttons1 button:nth-child(n+9)')
        .on('mouseover', function(){
            $(this).find('> span')
                .stop(true).animate({width: '100%'}, duration, 'easeOutQuad');
        })
        .on('mouseout', function(){
            $(this).find('> span')
                .stop(true).animate({width: '0%'}, duration, 'easeOutQuad');
        });

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


    // images ----------------------------------------
    var $images = $('#images p');

    // images 1つ目の画像
    $images.filter(':nth-child(1)')
        .on('mouseover', function(){
            $(this).find('strong, span').stop(true).animate({opacity: 1}, duration);
        })
        .on('mouseout', function(){
            $(this).find('strong, span').stop(true).animate({opacity: 0}, duration);
        });

    // images 2つ目の画像
    $images.filter(':nth-child(2)')
        .on('mouseover', function(){
            $(this).find('strong').stop(true).animate({opacity: 1, left: '0%'}, duration);
            $(this).find('span').stop(true).animate({opacity: 1}, duration);
        })
        .on('mouseout', function(){
            $(this).find('strong').stop(true).animate({opacity: 0, left: '-200%'}, duration);
            $(this).find('span').stop(true).animate({opacity: 0}, duration);
        });

    // images 3つ目の画像
    $images.filter(':nth-child(3)')
        .on('mouseover', function(){
            $(this).find('strong').stop(true).animate({bottom: '0px'}, duration);
            $(this).find('span').stop(true).animate({opacity: 1}, duration);
            $(this).find('img').stop(true).animate({top: '-20px'}, duration * 1.3);
        })
        .on('mouseout', function(){
            $(this).find('strong').stop(true).animate({bottom: '-80px'}, duration);
            $(this).find('span').stop(true).animate({opacity: 0}, duration);
            $(this).find('img').stop(true).animate({top: '0px'}, duration);
        });


    // aside ----------------------------------------
    var $aside = $('.page-main > aside');
    var $asidButton = $aside.find('button')
        .on('click', function(){
            $aside.toggleClass('open');
            if($aside.hasClass('open')){
                $aside.stop(true).animate({left: '-70px'}, duration, 'easeOutBack');
                $asidButton.find('img').attr('src', 'img/btn_close.png');
            }else{
                $aside.stop(true).animate({left: '-350px'}, duration, 'easeInBack');
                $asidButton.find('img').attr('src', 'img/btn_open.png');
            };
        });


});
