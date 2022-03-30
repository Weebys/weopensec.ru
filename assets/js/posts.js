document.getElementsByClassName('comments')[0].innerHTML = '<iframe class="ciframe" src="https://comments.weopensec.ru/comment.php?p='+encodeURIComponent(document.location.pathname.replaceAll('/','-'))+'"></iframe>';
            document.getElementsByTagName('iframe')[0].onload=function(){
                sendMessage();
                amplitude.getInstance().logEvent('openarticle');
            }

sendMessage = function(e) {
    document.getElementsByTagName('iframe')[0].contentWindow.postMessage('secret command', 'https://comments.weopensec.ru');
}
function receiveMessage(e) {
					if (e.data.includes(":"))
						document.getElementsByTagName('iframe')[0].height = e.data.split(':')[1];
					else
						return;
}
window.addEventListener('message', receiveMessage);
