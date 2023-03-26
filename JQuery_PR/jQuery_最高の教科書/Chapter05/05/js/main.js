$(function () {

    /*
     * Tabs
     */
    $('#work').each(function () {

        // タブの各要素を jQuery オブジェクト化
        var $tabList    = $(this).find('.tabs-nav'),   // タブのリスト
            $tabAnchors = $tabList.find('a'),          // タブ (リンク)
            $tabPanels  = $(this).find('.tabs-panel'); // パネル

        // タブがクリックされたときの処理
        // 引数としてイベントオブジェクトを受け取る
        $tabList.on('click', 'a', function (event) {

            // リンクのクリックに対するデフォルトの動作をキャンセル
            event.preventDefault();

            // クリックされたタブを jQuery オブジェクト化
            var $this = $(this);

            // もしすでに選択されたタブならなにもせず処理を中止
            if ($this.hasClass('active')) {
                return;
            }

            // すべてのタブの選択状態をいったん解除し、
            // クリックされたタブを選択状態に
            $tabAnchors.removeClass('active');
            $this.addClass('active');

            // すべてのパネルをいったん非表示にし、
            // クリックされたタブに対応するパネルを表示
            $tabPanels.hide();
            $($this.attr('href')).show();

        });

        // 最初のタブを選択状態に
        $tabAnchors.eq(0).trigger('click');

    });

});
