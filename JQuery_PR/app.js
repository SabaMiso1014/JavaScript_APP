// jQueryの基本書式
$(function(){
    // jQueryの命令
    $('.gNav > li').each(function(index, element){
      // 各li要素の文字列をコンソールに出力する
        console.log(index + ': ' + $(element).text());
    });
});