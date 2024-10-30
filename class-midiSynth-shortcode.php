<?php
/**
 * Description: Use to create shortcode [midiSynth].
 *
 * @package     midi-Synth
 * @category    class php
 * @author      Oleg Klenitsky
 * @copyright   2024 Oleg Klenitsky
 * @license     GPL-2.0-or-later
 */

if ( ! defined( "ABSPATH" ) ) {
	exit();
}

class midiSynth_Shortcode {
  /**
	 * Add new shortcode [midiSynth].
	 */
	public function __construct() {
		add_shortcode( "midiSynth", array( $this, "midiSynth_shortcode" ) );
	}
	/**
	 * Creates midiSynth shortcode.
	 */
	public function midiSynth_shortcode() {
		$plugine_info = get_plugin_data( __DIR__ . "/midiSynth.php" );
		print_r($plugine_info["Description"]);
		?>
		<div class="midi_container">
			<select id="sel_kbd" onchange="SelectMidi(this.selectedIndex-1)">
				<option value="none" >midi keyboard: none</option>
			</select>

			<?php
			// Set variables for control knobs.
			$LittlePhatty  = plugin_dir_url( __FILE__ ) . "img-ctrl/LittlePhatty.png";
			$vernier       = plugin_dir_url( __FILE__ ) . "img-ctrl/vernier.png";
			$switch_toggle = plugin_dir_url( __FILE__ ) . "img-ctrl/switch_toggle.png";
			$vsliderbody   = plugin_dir_url( __FILE__ ) . "img-ctrl/vsliderbody.png";
			$vsliderknob   = plugin_dir_url( __FILE__ ) . "img-ctrl/vsliderknob.png";
			// Load external midi file.
			$path_mid_file = plugin_dir_url( __FILE__ ) . "sound/ws.mid";
			?>

			<div id="appearance">

				<webaudio-knob id="vol" style="position: absolute; left: 249px; top: 30px;" src="<?php echo esc_html($LittlePhatty); ?>" min="0" max="1" step="0.01" value="0.5" tooltip="volume %s factor"></webaudio-knob>

	      <webaudio-knob id="rev" style="position: absolute; left: 330px; top: 30px;" src="<?php echo esc_html($LittlePhatty); ?>" min="0" max="1" step="0.01" value="0.2" tooltip="reverb %s sec"></webaudio-knob>

	      <webaudio-knob id="conv_duration" style="position: absolute; left: 249px; top: 137px;" src="<?php echo esc_html($LittlePhatty); ?>" min="0" max="1" step="0.01" value="0" tooltip="duration %s sec"></webaudio-knob>

	      <webaudio-knob id="conv_decay" style="position: absolute; left: 330px; top: 137px;" src="<?php echo esc_html($LittlePhatty); ?>" min="0" max="1" step="0.01" value="0" tooltip="decay %s sec"></webaudio-knob>


	      <webaudio-knob id="comp_threshold" style="position: absolute; left: 440px; top: 30px;" src="<?php echo esc_html($LittlePhatty); ?>" min="-100" max="0" step="1" value="-24" tooltip="threshold %s dB"></webaudio-knob>

	      <webaudio-knob id="comp_knee" style="position: absolute; left: 520px; top: 30px;" src="<?php echo esc_html($LittlePhatty); ?>" min="0" max="40" step="1" value="30" tooltip="knee %s dB"></webaudio-knob>

	      <webaudio-knob id="comp_ratio" style="position: absolute; left: 600px; top: 30px;" src="<?php echo esc_html($LittlePhatty); ?>" min="1" max="20" step="1" value="12" tooltip="ratio %s dB"></webaudio-knob>

	      <webaudio-knob id="comp_attack" style="position: absolute; left: 480px; top: 137px;" src="<?php echo esc_html($LittlePhatty); ?>" min="0.001" max="1" step="0.001" value="0.003" tooltip="attack %s sec"></webaudio-knob>

	      <webaudio-knob id="comp_release" style="position: absolute; left: 560px; top: 137px;" src="<?php echo esc_html($LittlePhatty); ?>" min="0" max="1" step="0.01" value="0.25" tooltip="release %s sec"></webaudio-knob>


	      <webaudio-knob id="prog"style="position: absolute; left: 680px; top: 30px;" src="<?php echo esc_html($vernier); ?>" min="0" max="100" step="1" value="0" tooltip="fine control(+Shift)"></webaudio-knob>

	      <div style="position:absolute;display:flex;justify-content: left;align-items: center;border:1px solid #A0A378;left:690px;top:197px;height: 24px;width:280px; color:#A0A378;">
	      	<webaudio-param id="prog_num" link="prog"></webaudio-param>
	      	<p id="prog_name" style="font-size: 14px;margin:0 0 0 5px;">program name</p>
	    	</div>

	      <webaudio-slider id="oct" style="position:absolute;left:828px;top:20px;" src="<?php echo esc_html($vsliderbody); ?>" knobsrc="<?php echo esc_html($vsliderknob); ?>" value="0" min="-2" max="+2" step="1" tooltip="Octave shift %s"></webaudio-slider>

	      <webaudio-slider id="ch" style="position:absolute;left:877px;top:20px;" src="<?php echo esc_html($vsliderbody); ?>" knobsrc="<?php echo esc_html($vsliderknob); ?>" value="1" min="1" max="10" step="1" tooltip="Channel Ch%s"></webaudio-slider>

	      <webaudio-switch id="qlt" midilearn="1" style="position:absolute;left:917px;top:35px;" src="<?php echo esc_html($switch_toggle); ?>" value="1" height="56" width="56"></webaudio-switch>

	      <webaudio-switch id="sus" midilearn="1" style="position:absolute;left:917px;top:100px;" src="<?php echo esc_html($switch_toggle); ?>" value="0" height="56" width="56"></webaudio-switch>

	      <div style="position: absolute;display: flex;top: 233px;left: 10px;margin: 0;border: none;height: 30px;align-items: center;">
	      	<webaudio-tinysynth id="tinysynth" src="<?php echo esc_html($path_mid_file); ?>" style="height: 30px;cursor: pointer;" quality="1" loop="0" disabledrop="0" mastervol="0.3" onclick="midi_player();">
					</webaudio-tinysynth>
					<webaudio-switch id="loop" colors="#A0A378;#000;#A0A378" style="margin-left: 10px;" tooltip="loop" value="0"></webaudio-switch>
					<input type="file" id="file_mid" accept=".mid" onchange="loadMidi(this.files)"/>
						<label for="file_mid" style="cursor: pointer;text-align: center;margin-left: 10px;" title="Load .mid file">File midi</label>

					<marquee id="inform_panel" >inform panel</marquee>

					<div style="position: absolute;display: flex;left: 680px;margin: 0;border: none;height: 30px;align-items: center;">
						<p id="shot" style="cursor: pointer;text-align: center;" title="key">--</p>

						<p id="kbdBtn" style="cursor: pointer;text-align: center;display: block;" title="keyboard" onclick="OpenKbd();">Kbd</p>

						<p id="editor" style="cursor: pointer;text-align: center;display: none;" title="Timbre Editor" onclick="OpenEditor();">Editor</p>

						<p id="graph" style="cursor: pointer;text-align: center;display: none;" title="AudioNodes Graph" onclick="AudioGraph();">Graph</p>

						<p id="sequencer" style="display:block;cursor: pointer;text-align: center;" title="Sequencer" onclick="winSequencer();">Sequencer</p>
					</div>
				</div>

				<canvas id="canvas_midi" style="position:absolute;top: 42px;left: 27px;" width="180" height="180" title="Click me"></canvas>

				<webaudio-slider id="scaleX" style="position:absolute;left:12px;top:35px;" src="<?php echo esc_html($vsliderbody); ?>" knobsrc="<?php echo esc_html($vsliderknob); ?>" value="4" min="0" max="7" step="1" tooltip="fftSize %s" conv="['4096','2048','1024','512','256','128','64','32'] [x]" height="191" width="10" knobwidth="10" knobheight="10"></webaudio-slider>
				<webaudio-slider id="scaleY" style="position:absolute;left:212px;top:35px;" src="<?php echo esc_html($vsliderbody); ?>" knobsrc="<?php echo esc_html($vsliderknob); ?>" value="4" min="1" max="10" step="1" tooltip="amplitude %s" height="191" width="10" knobwidth="10" knobheight="10"></webaudio-slider>

				<div id="btns_osc">
					<webaudio-switch id="sw0" type="radio" group="radio1" colors="white;#000;#A0A378" width="15" height="15" value="1"></webaudio-switch>
					<p id="p_sw0" onclick="p_swX_click(id.slice(2));">Σ</p>

					<webaudio-switch id="sw1" type="radio" group="radio1" colors="red;#000;#A0A378" width="15" height="15" value="0"></webaudio-switch>
					<p id="p_sw1" onclick="p_swX_click(id.slice(2));">p1</p>

					<webaudio-switch id="sw2" type="radio" group="radio1" colors="blue;#000;#A0A378" width="15" height="15" value="0"></webaudio-switch>
					<p id="p_sw2" onclick="p_swX_click(id.slice(2));">p2</p>

					<webaudio-switch id="sw3" type="radio" group="radio1" colors="green;#000;#A0A378" width="15" height="15" value="0"></webaudio-switch>
					<p id="p_sw3" onclick="p_swX_click(id.slice(2));">p3</p>

					<webaudio-switch id="sw4" type="radio" group="radio1" colors="brown;#000;#A0A378" width="15" height="15" value="0"></webaudio-switch>
					<p id="p_sw4" onclick="p_swX_click(id.slice(2));">p4</p>
				</div>
			</div>

			<webaudio-keyboard style="display: none;" id="kbd" keys="88" min="21" width="980" height="160"></webaudio-keyboard>
			<div id="win_edit" style="display: none;">
				<table id="soundeditor">
					<thead>
						<tr>
							<td colspan="13">
								Oscillators :<select id="oscs" onchange="Edit()"><option>1</option><option>2</option><option>3</option><option>4</option></select>
								<label id="head_soundeditor">Timbre Editor</label>
							</td>
						</tr>
					</thead>
					<tbody>
						<?php
							$str1  = "output destination";
							$str2  = "waveform";
							$str3  = "volume";
							$str4  = "tune factor according to note#";
							$str5  = "fixed frequency in Hz";
							$str6  = "attack time (1nd parameter of the AHDSR envelope)";
							$str7  = "hold time (2nd parameter of the AHDSR envelope)";
							$str8  = "decay time (3nd parameter of the AHDSR envelope)";
							$str9  = "sustain level (4nd parameter of the AHDSR envelope)";
							$str10 = "release time (5nd parameter of the AHDSR envelope)";
							$str11 = "pitch bend";
							$str12 = "pitch bend speed factor";
							$str13 = "volume key tracking factor";
							$path_img_ahdsr = set_url_scheme( plugins_url("/img/AHDSR.png", __FILE__), "https" );
							$path_img_threshold = set_url_scheme( plugins_url("/img/webaudiothreshold.png", __FILE__), "https" );
							$path_img_knee      = set_url_scheme( plugins_url("/img/webaudioknee.png", __FILE__), "https" );
							$path_img_ratio     = set_url_scheme( plugins_url("/img/webaudioratio.png", __FILE__), "https" );
							// For Sequensor (area win_part1)
							$speaker     = set_url_scheme( plugins_url("img/speaker.png", __FILE__), "https" );
							$speaker_on  = set_url_scheme( plugins_url("img/speaker_on.gif", __FILE__), "https" );
							$speaker_off = set_url_scheme( plugins_url("img/speaker_off.png", __FILE__), "https" );
						?>
						<tr>
							<th id="soundeditor_th1" style="padding:0;width:90px;" title="<?php echo esc_html($str1); ?>" onclick="soundeditor_info(id);">G</th>
							<th id="soundeditor_th2" style="padding:0;width:90px;" title="<?php echo esc_html($str2); ?>" onclick="soundeditor_info(id);">W</th>
							<th id="soundeditor_th3" title="<?php echo esc_html($str3); ?>" onclick="soundeditor_info(id);">V</th>
							<th id="soundeditor_th4" title="<?php echo esc_html($str4); ?>" onclick="soundeditor_info(id);">T</th>
							<th id="soundeditor_th5" title="<?php echo esc_html($str5); ?>" onclick="soundeditor_info(id);">F</th>
							<th id="soundeditor_th6" style="background-color: #BFDCEA;" title="<?php echo esc_html($str6); ?>" onclick="soundeditor_info(id);">A</th>
							<th id="soundeditor_th7" style="background-color: #BFDCEA;" title="<?php echo esc_html($str7); ?>" onclick="soundeditor_info(id);">H</th>
							<th id="soundeditor_th8" style="background-color: #BFDCEA;" title="<?php echo esc_html($str8); ?>" onclick="soundeditor_info(id);">D</th>
							<th id="soundeditor_th9" style="background-color: #BFDCEA;" title="<?php echo esc_html($str9); ?>" onclick="soundeditor_info(id);">S</th>
							<th id="soundeditor_th10" style="background-color: #BFDCEA;" title="<?php echo esc_html($str10); ?>" onclick="soundeditor_info(id);">R</th>
							<th id="soundeditor_th11" title="<?php echo esc_html($str11); ?>" onclick="soundeditor_info(id);">P</th>
							<th id="soundeditor_th12" title="<?php echo esc_html($str12); ?>" onclick="soundeditor_info(id);">Q</th>
							<th id="soundeditor_th13" title="<?php echo esc_html($str13); ?>" onclick="soundeditor_info(id);">K</th>
						</tr>
					  <tr id="prog1">
						  <td style="padding-left:5px;" title="program1">p1<select id="g1" style="width:30px;" onchange="document.getElementById('g1').value=this.value;Edit()"><option value="0">0</option></select><label class="osc_num"></label></td>

						  <td><select id="w1" onchange="document.getElementById('w1').value=this.value;Edit()"><option value="sine">sine</option><option value="sawtooth">sawtooth</option><option value="square">square</option><option value="triangle">triangle</option><option value="w9999">w9999</option><option value="n0">n0</option><option value="n1">n1</option></select></td>
						  <td><input id="v1"  oninput="Edit()" value="0.5" size="4"/></td>
						  <td><input id="t1"  oninput="Edit()" value="1" size="4"/></td>
						  <td><input id="f1"  oninput="Edit()" value="0" size="4"/></td>
						  <td><input id="a1"  oninput="Edit()" value="0" size="4"/></td>
						  <td><input id="h1"  oninput="Edit()" value="0" size="4"/></td>
						  <td><input id="d1"  oninput="Edit()" value="0.1" size="4"/></td>
						  <td><input id="s1"  oninput="Edit()" value="0" size="4"/></td>
						  <td><input id="r1"  oninput="Edit()" value="0.1" size="4"/></td>
						  <td><input id="p1"  oninput="Edit()" value="1" size="4"/></td>
						  <td><input id="q1"  oninput="Edit()" value="1" size="4"/></td>
						  <td><input id="k1"  oninput="Edit()" value="0" size="4"/></td>
					  </tr>
					  <tr id="prog2">
						  <td style="padding-left:5px;" title="program2">p2<select id="g2" style="width:30px;" onchange="document.getElementById('g2').value=this.value;Edit()"><option value="0">0</option><option value="1">1</option></select><label class="osc_num"></label></td>

						  <td><select id="w2" onchange="document.getElementById('w2').value=this.value;Edit()"><option value="sine">sine</option><option value="sawtooth">sawtooth</option><option value="square">square</option><option value="triangle">triangle</option><option value="w9999">w9999</option><option value="n0">n0</option><option value="n1">n1</option></select></td>
						  <td><input id="v2"  oninput="Edit()" value="0.5" size="4"/></td>
						  <td><input id="t2"  oninput="Edit()" value="1" size="4"/></td>
						  <td><input id="f2"  oninput="Edit()" value="0" size="4"/></td>
						  <td><input id="a2"  oninput="Edit()" value="0" size="4"/></td>
						  <td><input id="h2"  oninput="Edit()" value="0" size="4"/></td>
						  <td><input id="d2"  oninput="Edit()" value="0.1" size="4"/></td>
						  <td><input id="s2"  oninput="Edit()" value="0" size="4"/></td>
						  <td><input id="r2"  oninput="Edit()" value="0.1" size="4"/></td>
						  <td><input id="p2"  oninput="Edit()" value="1" size="4"/></td>
						  <td><input id="q2"  oninput="Edit()" value="1" size="4"/></td>
						  <td><input id="k2"  oninput="Edit()" value="0" size="4"/></td>
					  </tr>
					  <tr id="prog3">
						  <td style="padding-left:5px;" title="program3">p3<select id="g3" style="width:30px;" onchange="document.getElementById('g3').value=this.value;Edit()"><option value="0">0</option><option value="1">1</option><option value="2">2</option></select><label class="osc_num"></label></td>

						  <td><select id="w3" onchange="document.getElementById('w3').value=this.value;Edit()"><option value="sine">sine</option><option value="sawtooth">sawtooth</option><option value="square">square</option><option value="triangle">triangle</option><option value="w9999">w9999</option><option value="n0">n0</option><option value="n1">n1</option></select></td>
						  <td><input id="v3"  oninput="Edit()" value="0.5" size="4"/></td>
						  <td><input id="t3"  oninput="Edit()" value="1" size="4"/></td>
						  <td><input id="f3"  oninput="Edit()" value="0" size="4"/></td>
						  <td><input id="a3"  oninput="Edit()" value="0" size="4"/></td>
						  <td><input id="h3"  oninput="Edit()" value="0" size="4"/></td>
						  <td><input id="d3"  oninput="Edit()" value="0.1" size="4"/></td>
						  <td><input id="s3"  oninput="Edit()" value="0" size="4"/></td>
						  <td><input id="r3"  oninput="Edit()" value="0.1" size="4"/></td>
						  <td><input id="p3"  oninput="Edit()" value="1" size="4"/></td>
						  <td><input id="q3"  oninput="Edit()" value="1" size="4"/></td>
						  <td><input id="k3"  oninput="Edit()" value="0" size="4"/></td>
					  </tr>
					  <tr id="prog4">
						  <td style="padding-left:5px;" title="program4">p4<select id="g4" style="width:30px;" onchange="document.getElementById('g4').value=this.value;Edit()"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select><label class="osc_num"></label></td>

						  <td><select id="w4" onchange="document.getElementById('w4').value=this.value;Edit()"><option value="sine">sine</option><option value="sawtooth">sawtooth</option><option value="square">square</option><option value="triangle">triangle</option><option value="w9999">w9999</option><option value="n0">n0</option><option value="n1">n1</option></select></td>
						  <td><input id="v4"  oninput="Edit()" value="0.5" size="4"/></td>
						  <td><input id="t4"  oninput="Edit()" value="1" size="4"/></td>
						  <td><input id="f4"  oninput="Edit()" value="0" size="4"/></td>
						  <td><input id="a4"  oninput="Edit()" value="0" size="4"/></td>
						  <td><input id="h4"  oninput="Edit()" value="0" size="4"/></td>
						  <td><input id="d4"  oninput="Edit()" value="0.1" size="4"/></td>
						  <td><input id="s4"  oninput="Edit()" value="0" size="4"/></td>
						  <td><input id="r4"  oninput="Edit()" value="0.1" size="4"/></td>
						  <td><input id="p4"  oninput="Edit()" value="1" size="4"/></td>
						  <td><input id="q4"  oninput="Edit()" value="1" size="4"/></td>
						  <td><input id="k4"  oninput="Edit()" value="0" size="4"/></td>
						</tr>
					</tbody>
				  <tfoot>
				  	<tr>
				  		<td colspan="13">
				  			Patch : <input disabled id="patch" style="width:100%;"/>
				  		</td>
				  	</tr>
				  </tfoot>
				</table>

				<div id="descr_tbl" style="width:260px; height: 230px;background-color: #C3C3C3;font-size: 14px;">
					<ul id="descr_ul" style="margin:0;padding:0;margin-top:100px;color:white;font-size:18px;" onclick="view_ahdsr_img();">Description of Timbre Editor fields</ul>
					<image id="img_ahdsr" width="250" height="220" style="display: none;border: 1px solid black;margin:5px;cursor:pointer;" src="<?php echo esc_url($path_img_ahdsr); ?>" onclick="view_ahdsr_img();" />
				</div>
			</div>

			<canvas id="audiograph" width="980" height="310"></canvas>
			<div id="canvas_imgs" style="position:relative;display: none;left:725px;top:-310px;width:260px;height:310px;z-index:-1">
				<image id="webaudiothreshold"  width="70" height="50" style="position:absolute;border: 1px solid black;margin:5px;left:180px;top:20px;width:70px;height:50px;cursor:pointer;" src="<?php echo esc_url($path_img_threshold); ?>" onclick="img_resize(id);"/>
				<image id="webaudioknee"  width="70" height="50" style="position:absolute;border: 1px solid black;margin:5px;left:180px;top:77px;width:70px;height:50px;cursor:pointer;" src="<?php echo esc_url($path_img_knee); ?>" onclick="img_resize(id);"/>
				<image id="webaudioratio"  width="70" height="50" style="position:absolute;border: 1px solid black;margin:5px;left:180px;top:134px;width:70px;height:50px;cursor:pointer;" src="<?php echo esc_url($path_img_ratio); ?>" onclick="img_resize(id);"/>
			</div>
			<div id="win_sequencer" style="display: none;flex-direction: column; border:1px solid black;width:980px;height:height:fit-content;margin:5px;background-color:#E3E3E3;">

				<image id="speaker" width="20" height="20" style="display: none;cursor:pointer;width:20px;height:20px;" src="<?php echo esc_url($speaker); ?>" />
				<image id="speaker_on" width="20" height="20" style="display: none;cursor:pointer;width:20px;height:20px;" src="<?php echo esc_url($speaker_on); ?>" />
				<image id="speaker_off" width="20" height="20" style="display: none;cursor:pointer;width:20px;height:20px;" src="<?php echo esc_url($speaker_off); ?>" />

				<div id="sequencer_header" style="display:flex;justify-content: space-between;height:30px;padding: 2px;">
					<div style="display:flex;justify-content: flex-start;">
						<label for="song_midi" style="font-size:14px;height:20px;">Copyright</label>
						<input type="text" id="song_midi" name="input" placeholder="Copyright notice" style="font-size:14px;width:130px;height:25px;padding:5px;"/>
					</div>
					<div style="display:flex;justify-content: flex-start;">
						<label for="tempoBPM" style="font-size:14px;height:20px;">BPM</label>
						<input type="text" id="tempoBPM" name="input" style="font-size:14px;width:40px;height:25px;padding:5px;text-align: center;"/>
					</div>
					<div style="display:flex;justify-content: flex-start;">
						<label for="tracks_count" style="font-size:14px;height:20px;">Tracks</label>
						<input type="text" id="tracks_count" name="input" style="font-size:14px;width:30px;height:25px;padding:5px 0;text-align: center;"/>
					</div>
					<div style="display:flex;justify-content: flex-start;">
						<label for="midi_format" style="font-size:14px;height:20px;">Format midi</label>
						<input type="text" id="midi_format" name="input" style="font-size:14px;width:30px;height:25px;padding:5px 0;text-align: center;"/>
					</div>
					<div style="display:flex;justify-content: flex-start;">
						<label id="lbl_ticks_per_beat" for="ticks_per_beat" style="font-size:14px;height:20px;">Ticks per beat</label>
						<input type="text" id="ticks_per_beat" name="input" style="font-size:14px;width:40px;height:25px;padding:5px 0;text-align: center;"/>
					</div>
					<div style="display:none;justify-content: flex-start;">
						<label id="lbl_smpte_frames" for="smpte_frames" style="font-size:14px;height:20px;">SMPTE frames</label>
						<input type="text" id="smpte_frames" name="input" style="font-size:14px;width:40px;height:25px;padding:5px 0;text-align: center;"/>
					</div>
					<div style="display:none;justify-content: flex-start;">
						<label id="lbl_ticks_per_frame" for="ticks_per_frame" style="font-size:14px;height:20px;">Ticks per frame</label>
						<input type="text" id="ticks_per_frame" name="input" style="font-size:14px;width:40px;height:25px;padding:5px 0;text-align: center;"/>
					</div>
					<div style="display:flex;justify-content: flex-start;">
						<label id="lbl_file_name" for="file_name_midi" style="font-size:14px;height:20px;">File name</label>
						<input type="text" id="file_name_midi" name="input" placeholder="ws.mid" style="font-size:14px;width:120px;height:25px;padding:5px;"/>
					</div>
					<div style="display:flex;justify-content: flex-start;">
						<label id="lbl_file_size" for="file_size_midi" style="font-size:14px;height:20px;">File size</label>
						<input type="text" id="file_size_midi" name="input" placeholder="2614 bytes" style="font-size:14px;width:90px;height:25px;padding:5px;"/>
					</div>
				</div>

				<div id="sequencer_body" style="display: flex;flex-direction: row;justify-content: flex-start;height:fit-content;">
					<div id="win_part1" style="display:flex;flex-direction: column;height:425px;width:210px;overflow-y: auto;background: ##C1C1C1;">
					</div>
					<div id="win_part2" style="top:20px;width:40px;display:flex;flex-direction: row;width:790px;height: 425px;overflow-y: hidden;background: #C3C3C3;">
						<div id="div_rangeNotes_part2" style="overflow-x: hidden;overflow-y: hidden;background:#D5D5D5;height: 390px;margin-top: 20px;">
							<canvas id="canvas_rangeNotes_part2" width="45" height="380"></canvas>
						</div>
						<div id="subwin_part2" style="position:relative;display:flex;flex-direction: column;overflow-x: scroll;overflow-y: scroll;height:425px;width: 100%;">

							<div id="ptrTime" style="position:absolute;top:0;left:-2px;width:7px;height:1286px;margin-top: 20px;z-index:1;background:transparent;cursor:pointer;" onmousedown="ptrTimeDragDrope(event);">
								<hr style="width:1px;height: 100%;margin: 0 auto;background: red;">
							</div>

							<canvas id="canvas_scale_part2" height="20" style="position: sticky;top:0;height: 20px;background: rgb(195, 195, 195);"></canvas>

							<canvas id="canvas_body_part2" height="380" style="background:gray;"></canvas>
						</div>
					</div>
				</div>
				<div id="sequencer_footer" style="position:relative;display:flex;background: #C3C3C3;border-top:1px solid black;height:110px;">
					<div id=scale style="position:absolute;display:flex;justify-content: space-evenly;align-items: center;height:13px;width:40px;overflow: hidden;font-weight:bold;font-size:14px;top:-15px;left:210px;background:#C3C3C3;"title="scale">
						<div id="scale1+" style="width:13px;text-align: center;cursor:pointer;" onclick="btnScale(id);">+</div>
						<div id="scale10" style="width:13px;text-align: center;cursor:pointer;" onclick="btnScale(id);">o</div>
						<div id="scale1-" style="width:13px;text-align: center;cursor:pointer;" onclick="btnScale(id);">-</div>
					</div>
					<div id="sequencer_subfooter1" style="display:flex;flex-direction: column;justify-content: space-around;">
						<div style="display:flex;justify-content: space-around;flex: none;align-items: center;width:208px;">
							<button class="btn_sequencer" id="btn_save_file">Save</button>
							<button class="btn_sequencer" id="btn_track_add">+Track</button>
							<button class="btn_sequencer" id="btn_track_del">-Track</button>
						</div>
						<div style="display:flex;justify-content: space-around;flex: none;align-items: center;width:208px;">
							<button class="btn_sequencer" id="btn_stave" onclick="openStave(id);">Stave</button>
							<button class="btn_sequencer" id="btn_check" onclick="openCheck(id);">Check</button>
							<button class="btn_sequencer" id="btn_help"  onclick="openHelp(id);">Help</button>
						</div>
						<div style="display:flex;justify-content: space-around;flex: none;align-items: center;width:208px;">
							<button class="btn_sequencer" id="buton1">buton1</button>
							<button class="btn_sequencer" id="buton2">buton2</button>
							<button class="btn_sequencer" id="buton3">buton3</button>
						</div>
						<div style="display:flex;justify-content: space-around;flex: none;align-items: center;width:208px;">
							<button class="btn_sequencer" id="buton1">buton4</button>
							<button class="btn_sequencer" id="buton2">buton5</button>
							<button class="btn_sequencer" id="buton3">buton6</button>
						</div>
					</div>
					<div id="sequencer_subfooter2" style="height:110px;width:770px;border-left: 1px solid black;">
						<div id="stave" style="display:none;overflow-x: scroll;height:110px;background: white;"></div>
					</div>
				</div>
			</div>
		<?php
	}
}
