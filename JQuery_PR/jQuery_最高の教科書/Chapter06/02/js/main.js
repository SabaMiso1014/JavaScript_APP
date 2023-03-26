$(function () {

    /*
     * ギャラリー
     */
    $('#gallery').each(function () {

        // #gallery 要素がギャラリーのコンテナーになる
        var $container = $(this);

        // オプションを設定し Masonry を準備
        $container.masonry({
            columnWidth: 230,
            gutter: 10,
            itemSelector: '.gallery-item'
        });

        // JSON ファイルをリクエストし、成功したら処理を実行
        $.getJSON('./data/content.json', function (data) {

            // ループで生成した DOM 要素を一時的に保存する配列
            var elements = [];

            // JSON の配列 (data) の要素 (item) ごとにループ処理
            $.each(data, function (i, item) {

                // 配列の要素から HTML 文字列を生成
                var itemHTML =
                        '<li class="gallery-item is-loading">' +
                            '<a href="' + item.images.large + '">' +
                                '<img src="' + item.images.thumb +
                                    '" alt="' + item.title + '">' +
                            '</a>' +
                        '</li>';

                // HTML 文字列を DOM 要素化し、配列に追加
                elements.push($(itemHTML).get(0));

            });

            // DOM を挿入
            $container.append(elements);

            // 画像の読み込みが完了したら Masonry レイアウト
            $container.imagesLoaded(function () {
                $(elements).removeClass('is-loading');
                $container.masonry('appended', elements);
            });
        });
    });
});
