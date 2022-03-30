var oldHref = document.location.href;

const renderUrl = function(url){
    return url.split('#')[1];
}

const onPageLoadedNone = function(){
    let getUrl = renderUrl(document.location.href);
    if (getUrl){
        if (getUrl.includes('viewPost/')){
            getUrl = getUrl.replace('viewPost/','');
            openArticle(getUrl+'.html');
        }
    }
}

const onChangeUrl = function(){
    if (document.location.href != oldHref){
        oldHref = document.location.href;
        onPageLoadedNone();
    }
}

window.onload = function(){
    onPageLoadedNone();
    setInterval(onChangeUrl, 500);
}
