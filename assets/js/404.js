var langitems = {};

if (document.location.pathname.includes('ru')){
    langitems["search"] = 'Ничего не найдено по запросу: %query%';
	langitems["lang_pathname"] = '/ru/';
}else{
	if (document.location.pathname.includes('en')){
    	langitems["search"] = 'Nothing found for query: %query%';
		langitems["lang_pathname"] = '/en/';
	}else{
		setLocation('/not-found');
	}
}

/**
 * @param {String} curLoc - Url to get to without reloading the page
*/
const setLocation = function (curLoc){
    try {
      history.pushState(null, null, curLoc);
      return;
    } catch(e) {}
    location.hash = '#' + curLoc;
}

const checkRegExp = function(url, data){
	for (let k in data){
		let it = data[k];
		if (url.match(it["preg"])){
			return true;
		}
	}
	return false;
}

const matchRegexp = function (){
	$.ajax({
        url: '/config/routes.json',
        method: 'get',
        dataType: 'json',
        success: function(data){
			let chRE = checkRegExp(document.location.pathname, data);
			if (!chRE){
				setLocation('/not-found');
			}
		}
	});
}

/**
 * @param {String} url - Url to open an article
*/
let openArticle = function(url){
     $.ajax({
        url: langitems["lang_pathname"]+'articles/'+url,
        method: 'get',
        dataType: 'html',
        success: function(data){
            let barticle = document.createElement('div');
            barticle.className = 'barticle opening';
            barticle.innerHTML = '<div class="tools"><span class="close-article material-icons"> arrow_back </span></div>'+data;
            document.body.append(barticle);
            closeArticle();
            document.getElementsByClassName('comments')[0].innerHTML = '<iframe class="ciframe" src="https://comments.weopensec.ru/comment.php?p='+encodeURIComponent(document.location.href.split("viewPost")[1].replaceAll('//', '/').replaceAll('/','-'))+'"></iframe>';
            document.getElementsByTagName('iframe')[0].onload=function(){
                sendMessage();
                amplitude.getInstance().logEvent('openarticle');
            }
        }
    });
}

let closeArticle = function(){
    document.querySelector('.close-article').onclick = function(){
        let barticles = document.querySelector('.barticle');
        barticles.classList.add('closing');
        setTimeout(() => barticles.remove() ,1000);
        checkUrl();
        document.location.href=langitems["lang_pathname"];
    }
}

let checkUrl = function(){
    let articles = document.location.pathname+"/articles";
    $.ajax({
        url: articles+'/index.json',
        method: 'get',
        dataType: 'json',
        success: function(data){
            let posts = $('.posts')[0];
            posts.innerHTML = '';
            let date = new Date();
            for (let post_i in data){
                let post = data[post_i];
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
                p.onclick = function(){
					setLocation(langitems["lang_pathname"]+'viewPost'+'/'+post["link"]);
                }
                posts.appendChild(p);
            }
        }
    });
}

matchRegexp();

