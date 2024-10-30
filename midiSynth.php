<?php
/**
 * Description: MIDI-Synth - synthesizer with a GM tone map.
 *
 * @package     midi-Synth
 * @category    module php
 * @author      Oleg Klenitsky
 * @copyright   2024 Oleg Klenitsky
 * @license     GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name:       midi-Synth
 * Plugin URI:        https://wordpress.org/plugins/midi-synth/
 * Description:       Synthesizer for midi keyboard.
 * Version:           1.0.0
 * Requires at least: 6.5 or higher
 * Requires PHP:      8.0
 * Author:            Oleg Klenitsky <klenitskiy.oleg@mail.ru>
 * Author URI:        https://adminkov.bcr.by/midi/
 * Text Domain:       midi-synth
 * License:           GPL v2 or later
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Initiation:        Dedicated to brother Klenitsky Igor.
 */

if ( ! defined( "ABSPATH" ) ) {
	exit();
}

if ( ! class_exists( "midiSynth_Shortcode" ) ) {
	/**
	 * Used to creates a short code [midiSynth].
	 */
	require_once __DIR__ . "/class-midiSynth-shortcode.php";

	$midiSynth_shortcode = new midiSynth_Shortcode();
}

/**
 * Localization of plugin.
 */
function midiSynth_textdomain() {
	load_plugin_textdomain( "midiSynth", false, dirname( plugin_basename( __FILE__ ) ) . "/languages/" );
}
add_action( "init", "midiSynth_textdomain" );

/**
 * Register javascripts, css for frontend.
 */
function midiSynth_scripts_css() {
	global $post;

	if ( !empty($post) && has_shortcode( $post->post_content, "midiSynth" ) ) {
		wp_enqueue_style( "midiSynth", plugins_url( "/css/midiSynth.css", __FILE__ ), "v1.0", "all" );
		wp_enqueue_script( "midiSynthCore", plugins_url( "/js/midiSynthCore.js", __FILE__ ), array(), "v1.0", false );
		wp_enqueue_script( "midiSynthCtrl", plugins_url( "/js/midiSynthCtrl.js", __FILE__ ), array(), "v1.0", false  );
		wp_enqueue_script( "midiSynthInterface", plugins_url( "/js/midiSynthInterface.js", __FILE__ ), array(), "v1.0", false  );
		wp_enqueue_script( "midiSynthOsc", plugins_url( "/js/midiSynthOsc.js", __FILE__ ), array(), "v1.0", false  );
		wp_enqueue_script( "midiSynthNodes", plugins_url( "/js/midiSynthNodes.js", __FILE__ ), array(), "v1.0", false  );
		wp_enqueue_script( "midiSynthSequencer", plugins_url( "/js/midiSynthSequencer.js", __FILE__ ), array(), "v1.0", false  );

		wp_enqueue_script( "midiFile", plugins_url( "/js/midiFile/class-midiFile.js", __FILE__ ), array(), "v1.0", false  );
		wp_enqueue_script( "midiHeader", plugins_url( "/js/midiFile/class-midiFileHeader.js", __FILE__ ), array(), "v1.0", false  );
		wp_enqueue_script( "midiTracks", plugins_url( "/js/midiFile/class-midiFileTrack.js", __FILE__ ), array(), "v1.0", false  );
		wp_enqueue_script( "midiEvents", plugins_url( "/js/midiFile/class-midiEvents.js", __FILE__ ), array(), "v1.0", false  );

		wp_enqueue_script( "VexFlow", plugins_url( "/js/midiFile/VexFlow.js", __FILE__ ), array(), "v4.2.2", false  );
	}
}
add_action( "wp_enqueue_scripts", "midiSynth_scripts_css" );

// Activation hook.
register_activation_hook( __FILE__, "midiSynth_activation" );
/**
 * Performed when the plugin is activation.
 */
function midiSynth_activation() {
	// Create custom tables for plugin.

}

// Deactivation hook.
register_deactivation_hook( __FILE__, "midiSynth_deactivation" );
/**
 * Performed when the plugin is deactivation.
 */
function midiSynth_deactivation() {
	// clean up old cron jobs that no longer exist.

}
