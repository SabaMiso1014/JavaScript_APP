$(function () {

    initScene3();

    // Scene 3: マスクのアニメーション
    function initScene3 () {

        var $container = $('#scene-3'),            // コンテナー
            $masks     = $container.find('.mask'), // マスク
            $lines     = $masks.find('.line'),     // 境界線
            maskLength = $masks.length,            // マスクの総数

            // 各マスクの切り抜き領域のデータを保存しておくための配列
            maskData   = [];

        // マスクごとに切り抜き領域の左辺座標を保存
        $masks.each(function (i) {
            maskData[i] = { left: 0 };
        });

        // マスクにマウスが乗ったときと外れたときに処理を実行
        $container.on({
            mouseenter: function () {
                resizeMask($(this).index());
            },
            mouseleave: function () {
                resizeMask(-1);
            }
        }, '.mask');

        // 各マスクの初期切り抜き領域と境界線の位置を指定
        resizeMask(-1);

        // 各マスクの切り抜き領域と境界線の位置をアニメーションさせる関数
        function resizeMask (active) {

            // コンテナーの幅と高さを取得し、
            // それぞれ切り抜き領域の右辺と下辺の座標とする
            var w = $container.width(),
                h = $container.height();

            // マスクごとに処理
            $masks.each(function (i) {

                var $this = $(this), // このマスク
                    l;               // 切り抜き領域の左辺の座標

                // active = マウスが乗ったマスクのインデックス
                //          -1 ならマウスが外れた状態
                // i      = このマスクのインデックス

                // マウスイベントによってマスクの切り抜き領域の左辺の座標を算出
                if (active === -1) {
                    // マウスが外れたときは均等に割り付け
                    l = w / maskLength * i;
                } else if (active < i) {
                    // マウスが乗ったマスクより右側のマスクは
                    // 切り抜き領域の左辺が右方向に修正される
                    l = w * (1 - 0.1 * (maskLength - i));
                } else {
                    // それ以外は左辺が左方向へ
                    l = w * 0.05 * i;
                }

                // maskData[i] に保存されている左辺の座標を
                // l の数値までアニメーションさせる
                $(maskData[i]).stop(true).animate({ left: l }, {
                    duration: 1000,
                    easing: 'easeOutQuart',
                    // マスクと境界線の CSS を書き換える
                    progress: function () {
                        var now = this.left;
                        $this.css({
                            // 各数値を rect() 形式に組み立てる
                            clip: 'rect(0px ' + w + 'px ' +
                                    h + 'px ' + now + 'px)'
                        });
                        $this.find($lines).css({
                            left: now
                        });
                    }
                });
            });
        }
    }

});
