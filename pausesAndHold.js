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

$('#state_str').ajaxComplete(
	function blockPause() { 
		
		let ready = $('[state=ready'),
		pauses = $('.dropdown.menu a');
		
		if ( ready.attr('style') === 'display: none;' ) {
			pauses.addClass('disabled');
			pauses.attr('style', 'pointer-events: none');
		} else {
			pauses.removeClass('disabled');
			pauses.removeAttr('style');
		}
	}
)

