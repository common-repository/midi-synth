<?php
/**
 * Description: Deletes the plugin settings from the database of the website.
 *
 * @package     midi-Synth
 * @category    module php
 * @author      Oleg Klenitsky
 * @copyright   2024 Oleg Klenitsky
 * @license     GPL-2.0-or-later
 */

if ( ! defined( "ABSPATH" ) ) {
	exit();
}
if ( ! defined( "WP_UNINSTALL_PLUGIN" ) ) {
	exit();
}

midiSynth_uninstall();

/**
 * Delete all options and tables of plugin midi-Synth.
 */
function midiSynth_uninstall() {
	global $wpdb;

	// Delete options.

}
