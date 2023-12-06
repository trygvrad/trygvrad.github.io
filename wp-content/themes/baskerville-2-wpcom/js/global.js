/**
 * Theme functions file
 *
 *
 */

(function($) {

	// posts block for Masonry
	var $blocks = $('#posts');

	$( document ).ready( function( $ ) {
		/**
		 * Initial Masonry setup
		 */

		// Determine text direction
		var ltr = true;
		if ( $('html' ).attr( 'dir' ) == 'rtl') {
			ltr = false;
		}

		// fire up Masonry!
		$blocks.imagesLoaded( function() {
			$blocks.masonry({
				columnWidth: 1,
				itemSelector: '.post-container',
				transitionDuration: 0,
				isOriginLeft: ltr,
			} ).masonry( 'layout' );

			var masonryChild = $blocks.find( '.post-container' );

			// Animating JS based off Huntt theme
			masonryChild.each( function( i ) {
				// Show content
				setTimeout( function() {
					masonryChild.eq( i ).addClass( 'post-loaded fade-in' );
				}, 100 * ( i + 1 ) );
			} );

			$( '#spinner' ).fadeOut( 250, function() {
				$( this ).remove();
			} );
		} );

		// Flexslider for Gallery posts
		$( ".flexslider" ).flexslider( {
			animation: "slide",
			controlNav: false,
			prevText: "Previous",
			nextText: "Next",
			smoothHeight: false,
			startAt : 1, // make sure order reflects order in gallery format
		} );

		/**
		 * Masonry update after Infinte Scroll
		 * JS based off Huntt theme
		 */

		$( document.body ).on( 'post-load', function() {

			// make sure we're only grabbing new posts
			var newEl = $blocks.children().not( '.post-loaded, span.infinite-loader' ).addClass( 'post-loaded' );

			// create function for refreshing Masonry
			function refreshMasonry() {
				$blocks.masonry('reloadItems').masonry( 'layout' );
			}

			// check if images loaded in these new posts
			newEl.imagesLoaded( function () {

				console.log( newEl );

				// if images loaded, add new posts and update masonry layout
				$blocks.masonry( 'appended', newEl, true ).masonry('reloadItems').masonry( 'layout' );

				// reinitialize flexslider for new posts, and re-run masonry when complete
				$( ".flexslider" ).flexslider( {
					animation: "slide",
					controlNav: false,
					prevText: "Previous",
					nextText: "Next",
					smoothHeight: false,
					startAt : 1,
					start: refreshMasonry, // reload masonry layout on finish, just in case flexslider was slow
				} );


				newEl.delay( 500 ).each( function( i ) {
					// then have a small delay between displaying each post
					setTimeout( function() {
						newEl.eq( i ).addClass( 'fade-in' );
					}, 200 * ( i + 1 ) );
				} );

			} );

			// reloading masonry layout again, after delay
			// fixes edge case issue with Facebook embed reloading and messing up layout
			setTimeout( refreshMasonry, 3000 );
		} );


		/**
		 * Enables menu toggle for small screens
		 */

		( function() {
			var nav = $( '.navigation' ), button, menu;
			if ( ! nav ) {
				return;
			}

			button = nav.find( '.nav-toggle' );
			if ( ! button ) {
				return;
			}

			// Hide button if menu is missing or empty.
			menu = nav.find( '.main-navigation' );
			if ( ! menu || ! menu.children().length ) {
				button.hide();
				return;
			}

			button.on( 'click.baskerville', function() {
				nav.toggleClass( 'toggled-on' );
				$( this ).toggleClass( "active" );
				$( ".main-navigation" ).slideToggle();
			} );

			// Fix sub-menus for touch devices.
			if ( 'ontouchstart' in window ) {
				menu.find( '.has-children > a, .page_item_has_children a' ).on( 'touchstart.baskerville', function( e ) {
					var el = $( this ).parent( 'li' );

					if ( ! el.hasClass( 'focus' ) ) {
						e.preventDefault();
						el.toggleClass( 'focus' );
						el.siblings( '.focus' ).removeClass( 'focus' );
					}
				} );
			}

			// Better focus for hidden submenu items for accessibility.
			menu.find( 'a' ).on( 'focus.baskerville blur.baskerville', function() {
				$( this ).parents( '.menu-item, .page_item' ).toggleClass( 'focus' );
			} );

		} )();


		// Makes "skip to content" link work correctly in IE9 and Chrome for better
		// accessibility.

		// @link http://www.nczonline.net/blog/2013/01/15/fixing-skip-to-content-links/

		$( window ).on( 'hashchange.baskerville', function() {
			var hash = location.hash.substring( 1 ), element;
			if ( ! hash ) {
				return;
			}
			element = document.getElementById( hash );
			if ( element ) {
				if ( ! /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) ) {
					element.tabIndex = -1;
				}
				element.focus();
				// Repositions the window on jump-to-anchor to account for header height.
				window.scrollBy( 0, -80 );
			}
		} );


		// Toggle search form

		var toggleSwitch = $( ".search-toggle" ),
			slideContainer = $( '.header-search-block' ),
			slideContainerOpen = false,
			lastFocus = document.activeElement,
			escapeKey = 27;

		toggleSwitch.on( "click", function() {
			$( this ).toggleClass( "active" );
			$( ".header-search-block" ).slideToggle();
			$( ".header-search-block .search-field" ).focus();
			return false;
		} );

		// Smooth scroll to header
		$( '.tothetop' ).click( function() {
			$( 'html, body' ).animate( {
				scrollTop: 0
			}, 500 );
			$( this ).unbind( "mouseenter mouseleave" );
			return false;
		} );


		// Add 'focus' style to search bar and comment inputs
		$('.wrapper .search-form input, .footer .search-form input').focus( function() {
		  	$( this ).closest( 'form' ).addClass( 'focus' );
		} ).blur( function() {
			$( this ).closest( 'form' ).removeClass( 'focus' );
		} );

		$('.comment-form-author input, .comment-form-email input, .comment-form-url input').focus( function() {
		  	$( this ).parent().addClass( 'focus' );
		} ).blur( function() {
			$( this ).parent().removeClass( 'focus' );
		} );


		// Detect CSS3 Transform support in browsers
		var supports = ( function() {
			var div = document.createElement( 'div' ),
			    vendors = 'Khtml Ms O Moz Webkit'.split( ' ' ),
			    len = vendors.length;

			return function( prop ) {
				if ( prop in div.style ) {
					return true;
				}

				prop = prop.replace( /^[a-z]/, function( val ) {
					return val.toUpperCase();
				} );

				while ( len-- ) {
					if ( vendors[len] + prop in div.style ) {
						return true;
					}
				}
				return false;
			};
		} ) ();

		if ( supports( 'transform' ) ) {
			// Add a css-transform class to the html element
			document.documentElement.className += ' css-transform';
		}


		// To add placeholder text to header search in IE9
		// based on https://gist.github.com/samgro/823300
		if ( navigator.appVersion.indexOf( "MSIE 9." ) !=-1 ) {
			$( '[placeholder]' ).focus( function() {
				var input = $( this );
				if ( input.hasClass( 'placeholder' ) ) {
					input.val( '' );
					input.removeClass( 'placeholder' );
				}
			} ).blur( function() {
				var input = $( this );
				if ( input.val() === '' ) {
					input.addClass( 'placeholder' );
					input.val( input.attr( 'placeholder' ) );
				}
			} ).blur().parents( 'form' ).submit( function() {
				$( this ).find( '[placeholder]' ).each( function() {
					var input = $( this );
					if ( input.hasClass( 'placeholder' ) ) {
						input.val( '' );
					}
				} );
			} );

			// Clear input on refresh so that the placeholder class gets added back
			$( window ).unload( function() {
				$( '[placeholder]' ).val( '' );
			} );
		}
	} );
} )( jQuery );
