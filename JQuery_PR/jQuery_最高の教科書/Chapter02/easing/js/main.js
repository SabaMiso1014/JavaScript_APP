(function($){
    $(function(){
        $('#easing').
            on('mouseover', 'li', animation).
            on('mouseout', 'li', animation);
        $('#sec, #prop').
            on('change', onchange);
    });

    var settings = {
        scale: {
            func: function(img, anim){ return function(){img.css({transform: 'scale('+anim.val+','+anim.val+')'});}},
            val: [1, 1.2]
        },
        rotateZ: {
            func: function(img, anim){ return function(){img.css({transform: 'rotateZ('+(anim.val >> 0)+'deg)'});}},
            val: [0, 360]
        },
        rotateY: {
            func: function(img, anim){ return function(){img.css({transform: 'rotateY('+(anim.val >> 0)+'deg)'});}},
            val: [0, 180]
        },
        opacity: {
            func: function(img, anim){ return function(){img.css({opacity: anim.val});}},
            val: [1, 0]
        }
    };

    function animation(e){
        var img = $(this).find('img'),
            anim = img.data('anim'),
            type = e.type == 'mouseover' ? 1 : 0,
            prop = settings[$('#prop').val()];

        if(!anim) img.data('anim', anim = {val: prop.val[0]});
        img.css('zIndex', type);
        $(anim).stop(true).animate(
            {
                val: prop.val[type]
            },
            {
                duration: parseFloat($('#sec').val()) * 1000, 
                easing: img.parent().text(),
                progress: prop.func(img, anim)
            }
        );
    }

    function onchange(){
        var img = $('#easing li img').stop(true),
            prop = settings[$('#prop').val()];

        img.each(function(){
            var anim = $(this).data('anim');
            if(anim) anim.val = prop.val[0];
        });

        for (key in settings) {
            prop = settings[key];
            prop.func(img, {val: prop.val[0]})();
        }
    }
})(jQuery);
