$(function () {

    imagesProgress();
    initNav();
    initScene1();
    initScene2();
    initScene3();

    // 画像の読み込み状況をプログレス表示
    function imagesProgress () {

        var $container    = $('#progress'),                    // 1
            $progressBar  = $container.find('.progress-bar'),  // 2
            $progressText = $container.find('.progress-text'), // 3
            // 1. プログレス表示全体のコンテナー
            // 2. プログレス表示のバー部分
            // 3. プログレス表示のテキスト部分

            // imagesLoaded ライブラリで body 要素内の画像の読み込み状況を監視
            // 同時に body 全体の画像の総数を保存
            imgLoad       = imagesLoaded('body'),
            imgTotal      = imgLoad.images.length,

            // 読み込みの完了した画像の数のカウンターと、
            // プログレス表示の現在地にあたる数値 (ともに最初は 0)
            imgLoaded     = 0,
            current       = 0,

            // 1 秒間に 60 回のペースで読み込み状況をチェック
            progressTimer = setInterval(updateProgress, 1000 / 60);

        // imagesLoaded を利用し、画像が読み込まれるごとにカウンターを加算
        imgLoad.on('progress', function () {
            imgLoaded++;
        });

        // 画像の読み込み状況をもとにプログレス表示を更新
        // この関数は setInterval() メソッドにより 1 秒間に 60 回呼び出される
        function updateProgress () {

            // 読み込みの完了した画像のパーセンテージ
            var target = (imgLoaded / imgTotal) * 100;

            // current (現在地) と target (目的地) の距離をもとにイージングをかける
            current += (target - current) * 0.1;

            // 表示のバーの幅とテキストに current の値を反映
            // テキストは小数点以下を切り捨てて整数に
            $progressBar.css({ width: current + '%' });
            $progressText.text(Math.floor(current) + '%');

            // 終了処理
            if(current >= 100){
                // プログレス表示の更新をストップ
                clearInterval(progressTimer);
                // CSS でスタイルを変えるためクラスを追加
                $container.addClass('progress-complete');
                // プログレスバーとテキストを同時にアニメーションさせるため、
                // グループ化して 1 つの jQuery オブジェクトに
                $progressBar.add($progressText)
                    // 0.5 秒待つ
                    .delay(500)
                    // 0.25 秒かけてプログレスバーとテキストを透明にする
                    .animate({ opacity: 0 }, 250, function () {
                        // 1 秒かけてオーバーレイを上方向へスライドアウト
                        $container.animate({ top: '-100%' }, 1000, 'easeInOutQuint');
                    });
            }

            // current が 99.9 より大きければ 100 と見なして終了処理へ
            if (current > 99.9) {
                current = 100;
            }
        }
    }

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

    // Scene 2 を表示
    function initScene2 () {
        $('#scene-2-content').css({ right: '-50%' });
    }

    // Scene 2 (2): チャートを描画
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

    // ナビゲーション初期化
    function initNav () {

        var $pageMain = $("#page-main"),
            $nav = $('#nav'),
            $navItem = $nav.find('li'),
            currentScene = 0;

        updateNav();

        $nav.on('click', 'a', function (event) {
            event.preventDefault();
            var i = $(this).closest($navItem).index();
            if (i === currentScene) {
                return;
            }
            if (i === 1) {
                initScene2();
            }
            currentScene = i;
            $pageMain.
                stop(true).
                animate({ top: - 100 * i + '%' }, 1200, 'easeInOutQuint', function () {
                    if (i === 1) {
                        activateScene2(); // Scene 2 描画
                    } else {
                        initScene2();
                    }
                });
            updateNav();
        });

        function updateNav () {
            $navItem.
                removeClass('active').
                eq(currentScene).addClass('active');
        }

    }

});
