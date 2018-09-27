document.getElementsByClassName('icon_unpause')[0].addEventListener('click', function() { document.getElementsByClassName('info')[0].innerHTML = 'Ожидание звонка';})

var sentCount = 0;
$('#state_str').ajaxComplete( 
	function hardIncident () {
		if ( $('.info').html() == 'Сложный инцидент' && $('.timer').html() > '0:10:00' && sentCount < 1 && $('.paused').attr('style') != 'display: none;' ) {
			var notification = new Notification("Сложный инцидент", {body: "Ты в сложном уже более 10 минут.", icon: "https://cdn1.savepice.ru/uploads/2018/8/23/e591704995f02414c9f875eac0148150-full.png"});
			sentCount++
		} else { 
			if ( $('.info').html() != 'Сложный инцидент' || $('.paused').attr('style') == 'display: none;' ) { 
			sentCount = 0;
			}
		}
	}
)