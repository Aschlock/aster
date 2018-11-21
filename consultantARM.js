'use strict';

$(window).on('load', function createElements() {
	$('#reports .fw2-tabs .labels').append("<div title='Скрыть консультантов в паузе' class='eye'>") //must be onload
	$('#reports .fw2-tabs .labels').append("<div class='on_call'></div>"); //must be onload
	$('#reports .fw2-tabs .labels').append("<div class='on_lane'></div>"); //must be onload



var hidden = false;

$('.eye').on('click', function() {
	$('.eye').toggleClass('eye-line');
	if ( hidden == false ) {
		$('#reports .tab:first-of-type .row .paused').parent().hide()
		$('#reports').on('ajaxComplete', function pausessd() {
			$('#reports .tab:first-of-type .row .ready').parent().show()
			$('#reports .tab:first-of-type .row .busy').parent().show()
			$('#reports .tab:first-of-type .row .paused').parent().hide()

		})
    return hidden = true;
	} else {
		$('#reports').off('ajaxComplete');
        $('#reports .tab:first-of-type .row').show();
		return hidden = false;
	}
})
})

$(window).ajaxComplete(function() { 
	$('.fw2-tabs .row').each( function() {
		this.onclick = function() {
		if ( $(this)[0].cells[1].getAttribute('style') === 'opacity: .5;' ) {
			$(this)[0].cells[1].removeAttribute('style');
		} else {
			$(this)[0].cells[1].setAttribute('style', 'opacity: .5;');
		}
	}
	})
})

    
$(window).ajaxComplete(
	function countInCall() { 
		$('.on_call').html('В звонке: ' + ($('.busy').length + $('.dialout').length + $('.calling').length + $('.direct').length + $('.ringing').length)) 
	}
)

$(window).ajaxComplete(
	function countConsultantsWithoutCall() {
		$('.on_lane').html('Свободно: ' + $('.ready').length) 
	}
)

$('.width_50x50 input').each(
	function() {
		this.onfocus = function() {
			let label = $("label[for='" + $(this).attr('id') + "']");
			label.addClass('labelUp');
			$(this).addClass('filledInput');
		}

		this.onblur = function() {
			let label = $("label[for='" + $(this).attr('id') + "']");
			if ( this.value === '' || this.value === undefined ) {
				label.removeClass('labelUp');
				$(this).removeClass('filledInput');
			}
		}
	}
)



$('[agent-action = hangup]').ajaxComplete( 
	function toggleHold() {
	
		let hangup = $('[agent-action = hangup]'),
		hold = $('[agent-action = hold]'),
		unhold = $('[agent-action = unhold]'),
		stopProcessing = $('[agent-action = stopProcessing]');

		if ( !hangup.hasClass('disabled') ) {
			hold.removeClass('disabled');
			unhold.removeClass('disabled');
			stopProcessing.removeClass('disabled');
		} else {
			hold.addClass('disabled');
			unhold.addClass('disabled');
			stopProcessing.addClass('disabled');
		}
	}
)





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
	return ( status == 'Альт. работа' || status == 'Сложный инцидент' || status == 'Почта' && $('[state="paused"').attr('style') === '' )
}

//Есть ли очередь.
function checkQueue() {
	return ( document.getElementsByClassName('ringing').length < +document.getElementsByClassName('in_queue')[0].innerHTML && +document.getElementsByClassName('in_queue')[0].innerHTML !== 0 )
}


document.getElementsByClassName('icon_unpause')[0].addEventListener('click', function() { document.getElementsByClassName('info')[0].innerHTML = 'Ожидание звонка';})

var sentCount = 0;
$('#state_str').ajaxComplete( 
	function hardIncident () {
		if ( $('.info').html() == 'Сложный инцидент' && $('.timer').html() > '0:10:00' && sentCount < 1 && $('[state="paused"').attr('style') === '' ) {
			var notification = new Notification("Сложный инцидент", {body: "Ты в сложном уже более 10 минут.", icon: "https://cdn1.savepice.ru/uploads/2018/8/23/e591704995f02414c9f875eac0148150-full.png"});
			sentCount++
		} else { 
			if ( $('.info').html() != 'Сложный инцидент' || $('.paused').attr('style') == 'display: none;' ) { 
			sentCount = 0;
			}
		}
	}
)