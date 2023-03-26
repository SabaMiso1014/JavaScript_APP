/* typo要素の色の変更
$(function() {
    $('#typo').css('color', '#ebc000');
})
*/

/* typo要素の文字の角度の変更
$(function() {
    $('#typo .inner').css('transform', 'rotate(10deg)');
})
*/

/* typo要素の文字の透明度の変更
$(function() {
    $('.page-main > div:nth-child(1) .inner').css('opacity', 0.5);
})
*/

/* 復習のプロパティの変更
$(function() {
    $('#typo').css({
        fontsize: '50px',
        backgroundColor: '#ae5e9b',
        color: '"ebc000'
    })
});
*/

/* onメソッド
$(function() {
    $('#typo').on('mouseover', function() {
        $('#typo').css('color', '#ebc000');
    });
});
*/

/* onメソッド
$(function() {
    $('#typo').on('click', function() {
        $('#typo').css('background-color', '#ae5e9b');
        $('header').css('color', '#ae5e9b')
    });
});
*/

/* メソッドチェーン
$(function() {
    $('#typo')
    .on('mouseover', function() {
        $('#typo').css({
            color: '#ebc000',
            backgroundColor: '#ae5e9b'
        });
    })
    .on('mouseout', function() {
        $('#typo').css({
            color: '',
            backgroundColor: ''
        });
    });
});
*/

/* アニメーション
$(function() {
    $('#typo').on('click', function() {
        $('#typo .inner').animate({
                opacity: 0,
                fontsize: '0px'
            },
        1500
        );
    });
});
*/

/* オブジェクト
$(function() {
    $('#typo').css({
        'font-size': '50px',
        'background-color': '#ae5e9b',
        'color': '#ebc000'
    })
})
*/

// this
$(function() {
    $('#typo').on('mouseover', function() {
        $(this).css('color', '#ebc000');
    });
});







