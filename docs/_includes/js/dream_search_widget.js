window.dreamCache = [];
window.cachedVal = false;
window.urlPrefix = '{{ site.url }}/dict/';
jQuery(document).ready(function($) {
	$('#dream_search_widget').submit(function(event) {
		let val = $('#symbol').val();
		$(this).attr('action', '#'+val)
		window.tryGetFromCache(val);
		return false;
	});
	$('#symbol').keyup(function(event) {
		let val = $(this).val();
		if (val.length > 0) {
			window.tryGetFromCache(val);
			
		}
	});
});
window.tryGetFromCache = function(val) {
	let ch = val.substr(0, 1).toLowerCase();
	if (ch.match(/^[a-z]$/)) {
		val = val.toLowerCase();
		console.log('keydown triggered, val is: '+val);
		if (!window.dreamCache[ch]) {
			window.dreamCache[ch] = true; // set up placeholder
			let url = window.urlPrefix+ch+'.json';
			console.log('cache miss, downloading '+url);
			$.get(url, function(res) {
				console.log('downloaded '+url);
				window.dreamCache[ch] = res; // save to cache
				if (val.length > 1)
					window.updateAutoComplete(val);
			}, 'json');
		} else {
			console.log('cache hit, using '+ch);
			if (val.length > 1)
				window.updateAutoComplete(val);
		}
	}
}
window.hashChange = function(e) {
	if (location.hash && location.hash.length > 1) {
		let val = decodeURI(location.hash.substr(1));
		$('#symbol').val(val);
		window.tryGetFromCache(val);
	}
}
$(window).bind('hashchange', window.hashChange);
window.hashChange();
window.updateAutoCompleteWithVal = function() {
	if (window.cachedVal) {
		let ch = window.cachedVal.substr(0, 1);
		if (window.dreamCache[ch]
			&& window.dreamCache[ch] !== true) {
			window.updateAutoComplete(window.cachedVal);
			window.cachedVal = false;
		}
	}
}
window.updateAutoComplete = function(val) {
	let ch = val.substr(0, 1), output = '',
		items = window.dreamCache[ch];
	if (items === true) {
		console.log('Scheduled search');
		output = 'Waiting for symbol cache';
		window.cachedVal = val;
		setTimeout(window.updateAutoCompleteWithVal, 200);
	} else {
		console.log('searching for: '+val);
		for (i in items) {
			if (items[i].title.toLowerCase().startsWith(val)) {
				output += '<details>' +
					'<summary>'+items[i].title+'</summary>' +
					items[i].desc +
				'</details>';
			}
		}
		if (output.length == 0) output = "No symbol found";
	}
	$('#autocomplete').html(output);
}