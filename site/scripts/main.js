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
 * Handle clicking on thumbnail.
 * 
 * @param object event
 */
Site.handle_thumbnail_click = function(event) {
	var image = event.target;
	var index = image.dataset.index;
	var gallery = document.querySelectorAll('div.gallery')[image.dataset.gallery];
	var big_image_list = gallery.querySelectorAll('img.big_image');
	
	for (var i=0, count=big_image_list.length; i<count; i++)
		if (index == i)
			big_image_list[i].classList.add('visible'); else
			big_image_list[i].classList.remove('visible');
}

/**
 * Handle clicking on button show products
 * @params object event
 */
Site.handle_show_products = function() {
	var galleries = document.querySelectorAll('div.gallery');
	for(var i=0; i < galleries.length; i++)
		galleries[i].classList.toggle('show');
}

/**
 * Function called when document and images have been completely loaded.
 */
Site.on_load = function() {
	// create video dialog
	Site.video_dialog = new Dialog();
	Site.video_dialog
		.setSize(800, 483)
		.setClearOnClose(true);

	if (Site.is_mobile()) {
		Site.mobile_menu = new Caracal.MobileMenu();
		Site.video_dialog.setSize(300, 182);

		// create function for handling show products section
		var button_show = document.querySelector('a.show');
		button_show.addEventListener('click', Site.handle_show_products);

		// create pagecontrol for rotating youtube videos
		Site.video_gallery = new PageControl('section.video', 'a.youtube');
		Site.video_gallery
			.setWrapAround(true)
			.attachPreviousControl($('a.previous_video'))
			.attachNextControl($('a.next_video'));
	}

		// assign handler for feature videos
		var video_links = document.querySelectorAll('section.features a');
		for(var i=0, count=video_links.length; i < count; i++) {
			var link = video_links[i];
			link.addEventListener('click', Site.handle_video_click);
		}

		// create sliders for thumbnails
		Site.sliders = new Array();
		var galleries = document.querySelectorAll('div.gallery');

		for(var i=0, count=galleries.length; i < count; i++) {
			var gallery = galleries[i];
			var slider = new Caracal.Gallery.Slider(2, !Site.is_mobile());
			var control = gallery.querySelector('div.control');
			var image_container = gallery.querySelector('div.image');
			var images = control.querySelectorAll('img');
			var next = control.querySelector('a.next');
			var previous = control.querySelector('a.previous');

			// show first image
			image_container.querySelector('img').classList.add('visible');

			// configure slider
			slider
				.images.set_container($(control))
				.images.add($(images))
				.images.set_step_size(1)
				.images.set_center(true)
				.controls.attach_next($(next))
				.controls.attach_previous($(previous));
			slider.images.update();
			// attach click handler to thumbnails
			for (var j=0, image_count=images.length; j<image_count; j++) {
				var image = images[j];

				image.addEventListener('click', Site.handle_thumbnail_click);
				image.dataset.index = j;
				image.dataset.gallery = i;
			}

			Site.sliders.push(slider);
		}
		// connect to every form and handle submission
		if (dataLayer && Caracal.ContactForm.list.length > 0)
			for (var index in Caracal.ContactForm.list) {
				var form = Caracal.ContactForm.list[index];
				form.events.connect('submit-success', function() {
					dataLayer.push({'event': 'whatever'});
					return true;
				});
			}
};


// connect document `load` event with handler function
$(Site.on_load);