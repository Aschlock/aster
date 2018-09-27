window.onload = Notification.requestPermission();

//q for queue
var qWas = 0, queueCounter = 0, showedNotifs = 0;
setInterval( function showingNotifs () { 
	var inQueue = +document.getElementsByClassName('in_queue')[0].innerHTML;
	if ( getStatus() && showedNotifs == 1 && inQueue >= qWas + 3 ) {
		var notification = new Notification("Очередь растёт. Звонков в очереди: " + ( inQueue - document.getElementsByClassName('ringing').length ), {body: "Похоже, на линии требуется помощь.", icon: "https://cdn1.savepice.ru/uploads/2018/8/23/e591704995f02414c9f875eac0148150-full.png"});
		showedNotifs++;
	}
	if ( getStatus() && checkQueue() && inQueue < 6 && queueCounter > 15 && showedNotifs < 1 ) {
		showNotification();
		showedNotifs++;
		return qWas = inQueue;
	} else {
		if ( getStatus() && checkQueue() && inQueue < 6 ) {
			return ++queueCounter;
		}
	}
}, 3000 );

//Проверяем наличие очереди. Если нет, скидываем счётчик очереди.
$('#call_stats').ajaxComplete( function dontHaveQueue() {
	if ( +document.getElementsByClassName('in_queue')[0].innerHTML == 0 || !checkQueue() ) {
		return [queueCounter = 0, showedNotifs = 0, qWas = 0]
	}
})


//Показываем уведомление.
function showNotification () {
	var inQueue = +document.getElementsByClassName('in_queue')[0].innerHTML;
	var notification = new Notification("Звонков в очереди: " + ( inQueue - document.getElementsByClassName('ringing').length ), {body: "Похоже, на линии требуется помощь.", icon: "https://cdn1.savepice.ru/uploads/2018/8/23/e591704995f02414c9f875eac0148150-full.png"});
}

//В каком типе перерыва консультант.
function getStatus() { 
	var status = document.getElementsByClassName('info')[0].innerHTML;
	return ( status == 'Альт. работа' || status == 'Сложный инцидент' || status == 'Почта' )
}

//Есть ли очередь.
function checkQueue() {
	return ( document.getElementsByClassName('ringing').length < +document.getElementsByClassName('in_queue')[0].innerHTML && +document.getElementsByClassName('in_queue')[0].innerHTML !== 0 )
}