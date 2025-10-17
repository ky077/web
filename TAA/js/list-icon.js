$(function(){
	$('a.list-icon').css('background-image', 'url(../images/icons8-copy-link-32.png)');
	
	$('a.list-icon[href$=".pdf"]').css('background-image', 'url(../images/icons8-pdf-32.png)');
	$('a.list-icon[href$=".doc"], a.list-icon[href$=".docx"]').css('background-image', 'url(../images/icons8-word-32.png)');
	$('a.list-icon[href$=".zip"]').css('background-image', 'url(../images/icons8-zip-32.png)');
	$('a.list-icon[href$=".rar"]').css('background-image', 'url(../images/icons8-rar-32.png)');
});