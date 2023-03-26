$(function () {

    /*
     * Slideshow
     */
    // slideshow クラスを持った要素ごとに処理を実行
    $('.slideshow').each(function () {

        var $slides = $(this).find('img'), // すべてのスライド
            slideCount = $slides.length,   // スライドの点数
            currentIndex = 0;              // 現在のスライドを示すインデックス

        // 1 番目のスライドをフェードインで表示
        $slides.eq(currentIndex).fadeIn();

        // 7500 ミリ秒ごとに showNextSlide 関数を実行
        setInterval(showNextSlide, 7500);

        // 次のスライドを表示する関数
        function showNextSlide () {

            // 次に表示するスライドのインデックス
            // (もし最後のスライドなら最初に戻る)
            var nextIndex = (currentIndex + 1) % slideCount;

            // 現在のスライドをフェードアウト
            $slides.eq(currentIndex).fadeOut();

            // 次のスライドをフェードイン
            $slides.eq(nextIndex).fadeIn();

            // 現在のスライドのインデックスを更新
            currentIndex = nextIndex;
        }

    });

    /*
     * Sticky header
     */
    $('.page-header').each(function () {

        var $window = $(window), // ウィンドウを jQuery オブジェクト化
            $header = $(this),   // ヘッダーを jQuery オブジェクト化
            // ヘッダーのデフォルト位置を取得
            headerOffsetTop = $header.offset().top;

        // ウィンドウのスクロールイベントを監視
        // (ウィンドウがスクロールするごとに処理を実行する)
        $window.on('scroll', function () {
            // ウィンドウのスクロール量をチェックし、
            // ヘッダーのデフォルト位置を過ぎていればクラスを付与、
            // そうでなければ削除
            if ($window.scrollTop() > headerOffsetTop) {
                $header.addClass('sticky');
            } else {
                $header.removeClass('sticky');
            }
        });

        // ウィンドウのスクロールイベントを発生させる
        // (ヘッダーの初期位置を調整するため)
        $window.trigger('scroll');

    });

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

    /*
     * Back-toTop button (Smooth scroll)
     */
    $('.back-to-top').each(function () {

        // html か body のいずれがスクロール可能な要素かを検出
        var $el = $(scrollableElement('html', 'body'));

        // ボタンにクリックイベントを設定
        $(this).on('click', function (event) {
            event.preventDefault();
            $el.animate({ scrollTop: 0 }, 250);
        });
    });

    // scrollTop が利用できる要素を検出する関数
    // http://www.learningjquery.com/2007/10/improved-animated-scrolling-script-for-same-page-links#update4
    function scrollableElement (elements) {
        var i, len, el, $el, scrollable;
        for (i = 0, len = arguments.length; i < len; i++) {
            el = arguments[i],
            $el = $(el);
            if ($el.scrollTop() > 0) {
                return el;
            } else {
                $el.scrollTop(1);
                scrollable = $el.scrollTop() > 0;
                $el.scrollTop(0);
                if (scrollable) {
                    return el;
                }
            }
        }
        return [];
    }

    /*
     * Google Maps
     */
    function initMap () {
        var mapContainer = document.getElementById('map-container'),
            mapImageSrc = mapContainer.getElementsByTagName('img')[0].getAttribute('src'),
            mapParams = decodeURIComponent(mapImageSrc.split('?')[1]).split('&'),
            mapData = {},
            mapStyleName = 'Mono',
            mapStyles = [
                {
                    featureType: 'all',
                    elementType: 'all',
                    stylers: [
                        { visibility: 'on' },
                        { hue: '#105ea7' },
                        { saturation: -100 },
                        { invert_lightness: true }
                    ]
                },
                {
                    elementType: 'labels.icon',
                    stylers: [
                        { visibility: 'off' }
                    ]
                }
            ],
            latLng,
            mapOptions,
            map,
            marker,
            markerLatLng,
            i,
            len,
            pair;
        for (i = 0, len = mapParams.length; i < len; i++) {
            pair = mapParams[i].split('=');
            mapData[pair[0]] = pair[1];
        }
        markerLatLng = mapData.markers? mapData.markers.split(','): null;
        latLng = mapData.center? mapData.center.split(','): markerLatLng;
        mapOptions = {
            center: new google.maps.LatLng(latLng[0], latLng[1]),
            disableDefaultUI: true,
            panControl: true,
            zoom: +mapData.zoom || 16,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL
            }
        };
        map = new google.maps.Map(mapContainer, mapOptions);
        map.mapTypes.set(mapStyleName, new google.maps.StyledMapType(mapStyles, { name: mapStyleName }));
        map.setMapTypeId(mapStyleName);
        if (mapData.markers) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(markerLatLng[0], markerLatLng[1]),
                map: map
            });
        }        
    }

    initMap();

});
