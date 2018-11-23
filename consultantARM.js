'use strict';

$(window).on('load', function createElements() {
	$('#reports .fw2-tabs .labels').append("<div title='Скрыть консультантов в паузе' class='eye'>");
	$('#reports .fw2-tabs .labels').append("<div class='on_call'></div>");
	$('#reports .fw2-tabs .labels').append("<div class='on_lane'></div>");



let hidden = false;

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
		if ( $(this)[0].cells[1].getAttribute('style') === 'opacity: .3;' ) {
			$(this)[0].cells[1].removeAttribute('style');
		} else {
			$(this)[0].cells[1].setAttribute('style', 'opacity: .3;');
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

$('.width_50x50 input').each( function() {
    if ( this.value !== '' ) {
        let label = $("label[for='" + $(this).attr('id') + "']");
        label.addClass('labelUp');
        $(this).addClass('filledInput');
    }
})


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





$(window).on('load', function() { 
	Notification.requestPermission(); 
})

//q for queue
let qWas = 0, queueCounter = 0, showedNotifs = 0;
setInterval( function showingNotifs () { 
	let inQueue = +$('.in_queue').html();
	if ( getStatus() && showedNotifs === 1 && inQueue >= qWas + 3 ) {
		let notification = new Notification("Очередь растёт. Звонков в очереди: " + ( inQueue - $('.ringing').length ), {body: "Похоже, на линии требуется помощь.", icon: "https://cdn1.savepice.ru/uploads/2018/8/23/e591704995f02414c9f875eac0148150-full.png"});
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
	if ( +$('.in_queue').html() == 0 || !checkQueue() ) {
		return [queueCounter = 0, showedNotifs = 0, qWas = 0]
	}
})


//Показываем уведомление.
function showNotification () {
	let inQueue = +$('.in_queue').html();
	let notification = new Notification("Звонков в очереди: " + ( inQueue - $('.ringing').length ), {body: "Похоже, на линии требуется помощь.", icon: "https://cdn1.savepice.ru/uploads/2018/8/23/e591704995f02414c9f875eac0148150-full.png"});
}

//В каком типе перерыва консультант.
function getStatus() { 
	let status = $('.info').html();
	return ( (status == 'Альт. работа' || status == 'Сложный инцидент' || status == 'Почта') && $('[state="paused"').attr('style') === '' )
}

//Есть ли очередь.
function checkQueue() {
	return ( $('.ringing').length < +$('.in_queue').html() && +$('.in_queue').html() !== 0 )
}

let sentCount = 0;
$('#state_str').ajaxComplete( 
	function hardIncident () {
		if ( $('.info').html() === 'Сложный инцидент' && $('.timer').html() > '0:10:00' && sentCount < 1 && $('[state="paused"').attr('style') === '' ) {
			let notification = new Notification("Сложный инцидент", {body: "Ты в сложном уже более 10 минут.", icon: "https://cdn1.savepice.ru/uploads/2018/8/23/e591704995f02414c9f875eac0148150-full.png"});
			return sentCount++
		} else { 
			if ( $('.info').html() !== 'Сложный инцидент' || $('[state="paused"').attr('style') === 'display: none;' ) { 
			return sentCount = 0;
			}
		}
	}
)