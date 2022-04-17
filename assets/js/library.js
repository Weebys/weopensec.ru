var oldHref = document.location.href;

/**
 * @param {String} url - Current url
*/
const renderUrl = function(url){
    return url.split('/ru/')[1] || url.split('/en/')[1];
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

document.querySelector('.search_btn').onclick = function(){
    let searchtext = document.querySelector('.search_input').value;
    let articles = document.location.pathname+"/articles";
    $.ajax({
        url: langitems["lang_pathname"] + articles+'/index.json',
        method: 'get',
        dataType: 'json',
        success: function(data){
            let posts = $('.posts')[0];
            posts.innerHTML = '';
            let date = new Date();
            for (let post_i in data){
                let post = data[post_i];
                if (post["title"].toLowerCase().includes(searchtext.toLowerCase())){
                    let tags = post["tags"].split(",");
                    let tag_s = '';
                    for (let tag in tags){ tag_s += '<div class="tag">'+tags[tag]+'</div>'; }
                    let p = document.createElement('div');
                    p.className = 'post';
                    p.innerHTML = `
    <div class="post-image-preview" style="background-image: url('/assets/previews/`+post["img"]+`?v=`+date+`');"></div>
    <div class="post-tags">`+tag_s+`</div>
    <div class="post-title">`+post["title"]+`</div>
    <div class="author-and-date">
        <div class="post-author">
            `+post["author"]+`
        </div>
        <div class="post-date">
            `+post["date"]+`
        </div>
    </div>`;
                    posts.appendChild(p);
                }else{
                     posts.innerHTML = '<center>'+langitems["search"].replace('%query%',searchtext)+'</center>';   
                }
            }
        }
    });
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
