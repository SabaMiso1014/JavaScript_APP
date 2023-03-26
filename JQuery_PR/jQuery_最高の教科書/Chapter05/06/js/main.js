$(function () {

    /*
     * Tabs
     */
    $('.work-section').each(function () {

        var $container = $(this),                            // a
            $navItems = $container.find('.tabs-nav li'),     // b
            $highlight = $container.find('.tabs-highlight'); // c
        // タブの各要素を jQuery オブジェクト化
        // a タブとパネルを含む全体のコンテナー
        // b タブのリスト
        // c 選択中タブのハイライト

        // jQuery UI Tabs を実行
        $container.tabs({

            // 非表示にする際のアニメーション
            hide: { duration: 250 },

            // 表示する際のアニメーション
            show: { duration: 125 },

            // 読み込み時とタブ選択時にハイライトの位置を調整
            create: moveHighlight,
            activate: moveHighlight
        });

        // ハイライトの位置を調整する関数
        function moveHighlight (event, ui) {
            var $newTab = ui.newTab || ui.tab,  // 新しく選択されたタブの jQuery オブジェクト
                left = $newTab.position().left; // 新しく選択されたタブの左位置

            // ハイライトの位置をアニメーション
            $highlight.animate({ left: left }, 500, 'easeOutExpo');
        }
    });

});
