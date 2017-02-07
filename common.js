/**
 * Created by bixin on 2017/2/6.
 */
 //构造当前页面请求参数表
var _PARAMS = {};// url参数map
var pageName = '';// 页面
var fullPageName = '';// 页面
(function() {
    var i = location.href.indexOf('?', 0);
    var url;
    if (i > 0) {
        var str1 = location.href.substring(i + 1, location.href.length
            - location.hash.length);
        if (str1.length > 0)
            _PARAMS = obj('{"' + str1.replace(/&/g, '","').replace(/=/g, '":"')
                + '"}');
        url = location.href.substring(0, i + 1);
    } else {
        url = location.href;
    }
    var d = url.split('/');
    pageName = d[d.length - 1].replace(/.html[\?,#,&]*$/, '');
    fullPageName = (d[d.length - 2] || "top") + "-" + pageName;
})();

// JSON字符串转对象
function obj(str) {
    return JSON.parse(str);
}
//对象转JSON字符串
function json(ob) {
    return JSON.stringify(ob);
}
// 获取当前页面请求参数值
function param(name) {
    return _PARAMS[name];
}
// 设置当前页面的请求参数值
function setParam(name, value) {
    _PARAMS[name] = value;
}

function reqa(url, callback, errcallback) {
    url += url.indexOf('?') != -1 ? ('&tt=' + ttag()) : ('?tt=' + ttag());
    $.ajax({
        type: 'GET',
        url: url,
        timeout: 3000,
        success: function (data) {
            callback(data);
        },
        error: function (xhr, type) {
            // errcallback(xhr);
            console.log(xhr, type);
            if (!nl(errcallback)) {
                callback(errcallback);
            }
        }
    })
}

function reqaObj(url, callback, callbackSections, faildCallback, forceReload) {

    // 默认不强制刷新数据
    if (!forceReload) {
        forceReload = 0;
    }
    // 加载默认loading提示
    reqa(url, function (txt) {
        doPrintSection(txt, faildCallback, callbackSections, callback, 'false');
    }, "{\"code\":-100}");

}
function dodefaultLoading  (callbackSections) {
    //统一做loading的样式处理
    if (callbackSections && callbackSections.length && callbackSections.length > 0) {
        for (var section in callbackSections) {
            ih(callbackSections[section], '<div class="loading_div"><span></span>加载中</div>');
        }
    }
}

function doPrintSection(txt, faildCallback, callbackSections, callback, donotParse) {
    if (nl(txt) && faildCallback) {
        defaultCallBackFailed(callbackSections, faildCallback);
    } else if (!nl(txt)) {
        var tmp;
        if (donotParse == 'true') {
            // 如果走客户端直接获取到的就是json对象
            tmp = txt;
        } else {
            // 如果走的是pc，还需要对json进行format
            try {
                tmp = obj(txt);
            } catch (e) {
                try {
                    mclient.saveErrInfo(txt);
                } catch (e) {
                }
            }
        }
        //检查返回码和失败回调函数，有问题的话就进行失败渲染处理
        if (tmp && nl(tmp.httpcode)) {
            callback(tmp);
//            ZBook.afterLoad(callbackSections);
        } else if (tmp) {
            if (tmp.httpcode != "200") {
                defaultCallBackFailed(callbackSections, faildCallback, tmp.httpcode);
            } else {
                try {
                    callback(tmp);
//                    ZBook.afterLoad(callbackSections);
                } catch (e) {
                    defaultCallBackFailed(callbackSections, faildCallback);
                }
            }
        } else {
            defaultCallBackFailed(callbackSections, faildCallback);
        }
    }
}

function defaultCallBackFailed (callbackSections, faildCallback, code) {
    if (callbackSections && callbackSections.length && callbackSections.length > 0) {
        for (var section in callbackSections) {
            if (!nl(code)) {
                if (code == '1001') {
                    ih(callbackSections[section], '<div class="load_fail">网络不畅<a href="javascript: window.location.reload();">重试</a></div>');
                } else if (code == '1002') {
                    ih(callbackSections[section], '<div class="load_fail">访问超时<a href="javascript: window.location.reload();">重试</a></div>');
                } else {
                    ih(callbackSections[section], '<div class="load_fail">服务器不给力呀<a href="javascript: window.location.reload();">重试</a></div>');
                }
            } else {
                ih(callbackSections[section], '<div class="load_fail">服务器不给力呀<a href="javascript: window.location.reload();">重试</a></div>');
            }
        }
    }
    if (faildCallback) {
        faildCallback();
    }

}

// 对象为空判断
function nl(obj) {
    return $.trim(obj) == false;
}
//设置内部文档
function ih(eid, html) {
    $("#" + eid).html(html);
}

// 当前毫秒时间末四位字符串
function ttag() {
    return (new Date().getTime()) % 10000;
}