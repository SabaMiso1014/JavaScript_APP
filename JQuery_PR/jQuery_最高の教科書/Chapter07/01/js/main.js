$(function () {

    // プログレス表示の関数を呼び出す
    imagesProgress();

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

});
