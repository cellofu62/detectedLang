var detectedLang = (function() {
    this.priority = ['url', 'cookie', 'browser'];
    this.priorityIndex = 0;
    this.supportLangs = ['zh-cn', 'zh-tw', 'en', 'es', 'ja', 'th', 'ko', 'vi', 'id'];
    this.defaultLang = 'en';
    this.langx = {
        "big5": "zh-tw",
        "gb": "zh-cn",
        "en-us": "en",
        "es": "es",
        "jp": "ja",
        "th": "th",
        "ko": "ko",
        "vi": "vi",
        "id": "id"
    };
    
    function init() {
        var getModeLang = getPriority();
        return getModeLang;
    }
    
    /* 
     * 照取得語系方法的優先權來得到語系
     * priority : 依序偵測語系
     */
    function getPriority() {
        var index = this.priorityIndex;
        var returnValue = '';
        switch(this.priority[index]) {
            case 'url':
                returnValue = getUrlParams();
                break;
            case 'cookie':
                returnValue = getCookieLang();
                break;
            case 'browser':
                returnValue = getBrowserLang();
                break;
            default:
                returnValue = this.defaultLang;
                break;
        }
        
        returnValue = (isSupportLang(returnValue) == null) ? '' :returnValue;
        
        // 下一種取值方式
        if(returnValue == '') {
            this.priorityIndex++;
            returnValue = getPriority();
        }
        return returnValue;
    }
    
    // 比對取得的語系是否支援
    function isSupportLang(lang) {
        if(lang != '') {
            for (var i in this.supportLangs) {
                if (lang == this.supportLangs[i]) {
                    return this.supportLangs[i];
                    break;
                }
            }
        }
        return null;
    }
    
    // 取得網址參數, 優先權 priority 1
    function getUrlParams() {
        var url = new URL(location.href);
        var urlParam = url.searchParams.get("lang") || url.searchParams.get("langx");
        urlParam = (urlParam != null) ? urlParam.toLowerCase() : '';
        return urlParam;
    };
    
    /* 
     * cookies 設定 (目前已知客端有兩種參數, lang 跟 langx)
     * 先取得 lang 的為準，若沒有才再次取 langx 來對應
     */
    function getCookieLang() {
        var regexLang = /(?:(?:^|.*;\s*)lang\s*\=\s*([^;]*).*$)|^.*$/;
        var lang = document.cookie.replace(regexLang, "$1");
        
        if (lang == '') {
            // 取編碼的值
            lang = correspondLangx();
        }
        
        lang = (lang != '') ? lang.toLowerCase() : '' ;
        return lang;
    };
    
    // 對應客端的字元編碼, 只有客端部份頁面會有此情況
    function correspondLangx() {
        // 客端有時候只有 langx 的值
        var regexLangx = /(?:(?:^|.*;\s*)langx\s*\=\s*([^;]*).*$)|^.*$/;
        var langx = document.cookie.replace(regexLangx, "$1");
        var value = this.langx[langx] || '';
        return value;
    }
    
    // 瀏覽器語言
    function getBrowserLang() {
        var browserLang = navigator.languages ?
            navigator.languages[0]
            : (navigator.language || navigator.userLanguage);
        browserLang = (browserLang != '') ? browserLang.toLowerCase() : '';
        return browserLang;
    }
    
    return init();
})();
