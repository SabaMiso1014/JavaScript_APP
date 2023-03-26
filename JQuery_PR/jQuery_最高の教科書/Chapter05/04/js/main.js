$(function () {

    /*
     * Sticky header
     */
    $('.page-header').each(function () {

        var $window = $(window), // Window オブジェクト
            $header = $(this),   // ヘッダー

            // ヘッダーのクローン
            $headerClone = $header.contents().clone(),

            // ヘッダーのクローンのコンテナー
            $headerCloneContainer = $('<div class="page-header-clone"></div>'),

            // HTML の上辺からヘッダーの底辺までの距離 = ヘッダーのトップ位置 + ヘッダーの高さ
            threshold = $header.offset().top + $header.outerHeight();

        // コンテナーにヘッダーのクローンを挿入
        $headerCloneContainer.append($headerClone);

        // コンテナーを body の最後に挿入
        $headerCloneContainer.appendTo('body');

        // スクロール時に処理を実行するが、回数を 1 秒間あたり 15 までに制限
        $window.on('scroll', $.throttle(1000 / 15, function () {
            if ($window.scrollTop() > threshold) {
                $headerCloneContainer.addClass('visible');
            } else {
                $headerCloneContainer.removeClass('visible');
            }
        }));

        // スクロールイベントを発生させ、初期位置を決定
        $window.trigger('scroll');
    });

});
