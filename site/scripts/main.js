/**
 * Main JavaScript
 * Site Name
 *
 * Copyright (c) 2015. by Way2CU, http://way2cu.com
 * Authors:
 */

// create or use existing site scope
var Site = Site || {};

// make sure variable cache exists
Site.variable_cache = Site.variable_cache || {};


/**
 * Check if site is being displayed on mobile.
 * @return boolean
 */
Site.is_mobile = function() {
	var result = false;

	// check for cached value
	if ('mobile_version' in Site.variable_cache) {
		result = Site.variable_cache['mobile_version'];

	} else {
		// detect if site is mobile
		var elements = document.getElementsByName('viewport');

		// check all tags and find `meta`
		for (var i=0, count=elements.length; i<count; i++) {
			var tag = elements[i];

			if (tag.tagName == 'META') {
				result = true;
				break;
			}
		}

		// cache value so next time we are faster
		Site.variable_cache['mobile_version'] = result;
	}

	return result;
};

/**
 * Handle clicking on feature video.
 * @param object event
 */
Site.handle_video_click = function(event) {
	event.preventDefault();
	Site.video_dialog.setContentFromURL(this.getAttribute('href'));
	Site.video_dialog.show();
};

/**
 * Function called when document and images have been completely loaded.
 */
Site.on_load = function() {
	if (Site.is_mobile()) {
		Site.mobile_menu = new Caracal.MobileMenu();

	} else {
		// create video dialog
		Site.video_dialog = new Dialog();
		Site.video_dialog.setSize(800, 483);

		// assign handler for feature videos
		var video_links = document.querySelectorAll('section.features a');
		for(var i=0, count=video_links.length; i < count; i++) {
			var link = video_links[i];
			link.addEventListener('click', Site.handle_video_click);
		}
	}
};


// connect document `load` event with handler function
$(Site.on_load);
