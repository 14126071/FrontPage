/**
 * Created by bixin on 2017/2/6.
 */
var page=new Vue({
    el:"body",
    data:{
    },
    ready:function (){
        console.log("ready");
        this.init();
    },
    methods:{
        init:function(){
            console.log("init");
            reqaObj("https://ptwapmusic3.reader.qq.com/andmain/pkg161206/init", function(data) {
                console.log(data);
            }, [], function() {
                console.log("网络异常，请稍候重试");
            }, 1);
        }
    }
});