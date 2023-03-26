$(function () {

    /*
     * ギャラリー
     */
    $('#gallery').each(function () {

        var $container = $(this),
            $loadMoreButton = $('#load-more'), // 追加ボタン
            $filter = $('#gallery-filter'),    // フィルタリングのフォーム
            addItemCount = 16,                 // 一度に表示するアイテム数
            addedd = 0,                        // 表示済みのアイテム数
            allData = [],                      // すべての JSON データ
            filteredData = [];                 // フィルタリングされた JSON データ

        $container.masonry({
            columnWidth: 230,
            gutter: 10,
            itemSelector: '.gallery-item'
        });

        // JSON を取得し、initGallery 関数を実行
        $.getJSON('./data/content.json', initGallery);

        // ギャラリーを初期化する
        function initGallery (data) {

            // 取得した JSON データを格納
            allData = data;

            // 最初の状態ではフィルタリングせず、そのまま全データを渡す
            filteredData = allData;

            // 最初のアイテムを表示
            addItems();

            // 追加ボタンがクリックされたら追加で表示
            $loadMoreButton.on('click', addItems);

            // フィルターのラジオボタンが変更されたらフィルタリングを実行
            $filter.on('change', 'input[type="radio"]', filterItems);
        }

        // アイテムを生成しドキュメントに挿入する
        function addItems (filter) {

            var elements = [],
                // 追加するデータの配列
                slicedData = filteredData.slice(addedd, addedd + addItemCount);

            // slicedData の要素ごとに DOM 要素を生成
            $.each(slicedData, function (i, item) {
                var itemHTML =
                        '<li class="gallery-item is-loading">' +
                            '<a href="' + item.images.large + '">' +
                                '<img src="' + item.images.thumb + '" alt="">' +
                                '<span class="caption">' +
                                    '<span class="inner">' +
                                        '<b class="title">' + item.title + '</b>' +
                                        '<time class="date" datatime="' + item.date + '">' +
                                            item.date.replace(/-0?/g, '/') +
                                        '</time>' +
                                    '</span>' +
                                '</span>' +
                            '</a>' +
                        '</li>';
                elements.push($(itemHTML).get(0));
            });

            // DOM 要素の配列をコンテナーに挿入し、Masonry レイアウトを実行
            $container
                .append(elements)
                .imagesLoaded(function () {
                    $(elements).removeClass('is-loading');
                    $container.masonry('appended', elements);

                    // フィルタリング時は再配置
                    if (filter) {
                        $container.masonry();
                    }
                });

// 06-03 に追加
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            // リンクに Colorbox を設定
            $container.find('a').colorbox({
                maxWidth: '970px',
                maxHeight: '95%',
                title: function () {
                    return $(this).find('.inner').html();
                }
            });
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

            // 追加済みアイテム数の更新
            addedd += slicedData.length;

            // JSON データがすべて追加し終わっていたら追加ボタンを消す
            if (addedd < filteredData.length) {
                $loadMoreButton.show();
            } else {
                $loadMoreButton.hide();
            }
        }

        // アイテムをフィルタリングする
        function filterItems () {
            var key = $(this).val(), // チェックされたラジオボタンの value

                // 追加済みの Masonry アイテム
                masonryItems = $container.masonry('getItemElements');

            // Masonry アイテムを削除
            $container.masonry('remove', masonryItems);

            // フィルタリング済みアイテムのデータをリセットと
            // 追加済みアイテム数をリセット
            filteredData = [];
            addedd = 0;

            if (key === 'all') {
                // all がクリックされた場合、すべての JSON データを格納
                filteredData = allData;
            } else {
                // all 以外の場合、キーと一致するデータを抽出
                filteredData = $.grep(allData, function (item) {
                    return item.category === key;
                });
            }

            // アイテムを追加
            addItems(true);
        }
    });

    // jQuery UI Button
    $('.filter-form input[type="radio"]').button({
        icons: {
            primary: 'icon-radio'
        }
    });

    // Resize page header
    $('.page-header').each(function () {
        var $header = $(this),
            headerHeight = $header.outerHeight(),
            headerPaddingTop = parseInt($header.css('paddingTop'), 10),
            headerPaddingBottom = parseInt($header.css('paddingBottom'), 10);
        $(window).on('scroll', $.throttle(1000 / 60, function () {
            var scroll = $(this).scrollTop(),
                styles = {};
            if (scroll > 0) {
                if (scroll < headerHeight) {
                    styles = {
                        paddingTop: headerPaddingTop - scroll / 2,
                        paddingBottom: headerPaddingBottom - scroll / 2
                    };
                } else {
                    styles = {
                        paddingTop: 0,
                        paddingBottom: 0
                    };
                }
            } else {
                styles = {
                    paddingTop: '',
                    paddingBottom: ''
                }
            }
            $header.css(styles);
        }));
    });

});
