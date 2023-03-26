$(function () {

    activateScene2();

    // Scene 2 を表示
    function activateScene2 () {

        var $content = $('#scene-2-content'),
            $charts = $content.find('.chart');

        // コンテンツが右から出てくる
        $content.stop(true).animate({
            right: 0
        }, 1200, 'easeInOutQuint');

        // 円チャートごとの処理
        $charts.each(function(){
            var $chart = $(this),
                // 「マスク」を保存し、角度 0 を指定
                $circleLeft = $chart.find('.left .circle-mask-inner')
                    .css({ transform: 'rotate(0)' }),
                $circleRight = $chart.find('.right .circle-mask-inner')
                    .css({ transform: 'rotate(0)' }),
                // パーセンテージ値を取得
                $percentNumber = $chart.find('.percent-number'),
                percentData = $percentNumber.text();

            // パーセンテージの表示をいったん 0 に
            $percentNumber.text(0);

            // 角度のアニメーション
            $({ percent: 0 }).delay(1000).animate({ percent: percentData }, {
                duration: 1500, 
                progress: function () {
                    var now = this.percent,
                        deg = now * 360 / 100,
                        degRight = Math.min(Math.max(deg, 0), 180),
                        degLeft  = Math.min(Math.max(deg - 180, 0), 180);
                    $circleRight.css({ transform: 'rotate(' + degRight + 'deg)' });
                    $circleLeft.css({ transform: 'rotate(' + degLeft + 'deg)' });
                    $percentNumber.text(Math.floor(now));
                }
            });
        });
    }

});
