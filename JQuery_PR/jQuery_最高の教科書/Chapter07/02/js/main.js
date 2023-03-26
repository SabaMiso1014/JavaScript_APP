$(function () {

    initScene1();

    // Scene 1: 画像シーケンスのアニメーション
    function initScene1 () {

        var
            // 画像のコンテナーと、その中にある全画像の jQuery オブジェクト
            $container       = $('#scene-1 .image-sequence'),
            $images          = $container.find('img'),

            // 画像の総数と、現在表示されている画像のインデックス
            frameLength      = $images.length,
            currentFrame     = 0,

            // アニメーションの処理内で利用する数値
            counter          = 0, // アニメーションの進行状況のカウンター
            velocity         = 0, // アニメーションの速度

            // アニメーションのタイマー (最初は空っぽ)
            timer            = null,

            // 画像のアスペクト比 (width / height)
            imageAspectRatio = 864 / 486;

        // コンテナー上でマウスホイールイベントが発生したら処理を実行
        $container.on('mousewheel', function (event, delta) {
            // マウスホイールの方向に応じて速度に加算または減算
            if (delta < 0) {
                velocity += 1.5;
            } else if (delta > 0) {
                velocity -= 1.5;
            }
            // アニメーションを開始する関数を呼び出す
            startAnimation();
        });

        // アニメーションを開始する関数
        function startAnimation () {
            // すでに実行中のアニメーションがなければアニメーションを実行
            if (!timer) {
                // 1/60 秒ごとに更新
                timer = setInterval(animateSequence, 1000 / 30);
            }
        }

        // アニメーションを終了する関数
        function stopAnimation () {
            clearInterval(timer);
            timer = null;
        }

        // アニメーションの関数
        function animateSequence () {

            // 新しく表示する画像のインデックス
            var nextFrame;

            // 速度に摩擦係数をかけ、呼び出されるたびに少しずつ小さくしていく
            velocity *= 0.9;

            // 速度をチェック。0 ± 0.00001 の範囲なら 0 と見なし停止
            if (-0.00001 < velocity && velocity < 0.00001) {
                stopAnimation();
            } else {
                // それ以外ならカウンターに速度を加算すると同時に、
                // カウンターの数値を画像数の範囲内に制限する
                counter = (counter + velocity) % frameLength;
            }

            // カウンターの数値を整数化し、該当のフレームを表示
            nextFrame = Math.floor(counter);
            if (currentFrame !== nextFrame) {
                $images.eq(nextFrame).show();
                $images.eq(currentFrame).hide();
                currentFrame = nextFrame;
            }
        }

        // コンテナーを、アスペクト比を保ったまま表示領域いっぱいに配置
        // ウィンドウがリサイズされるごとに再調整される
        $(window).on('resize', function () {

            // ウィンドウの幅と高さを取得
            var $window = $(this),
                windowWidth = $window.width(),
                windowHeight = $window.height();

            // 画像とウィンドウのアスペクト比を比較し、
            // コンテナーのサイズとポジションを調整
            if (imageAspectRatio > windowWidth / windowHeight) {
                $container.css({
                    width: windowHeight * imageAspectRatio,
                    height: '100%',
                    top: 0,
                    left: (windowWidth - windowHeight * imageAspectRatio) / 2
                });
            } else {
                $container.css({
                    width: '100%',
                    height: windowWidth / imageAspectRatio,
                    top: (windowHeight - windowWidth / imageAspectRatio) / 2,
                    left: 0
                });
            }
        });

        // ウィンドウのリサイズイベントを発生させ初回の配置を調整
        $(window).trigger('resize');
    }

});
