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
			if (!chRe){
				setLocation('/404');
			}
		}
	});
}
