/**
 * Description: Draw audioNodes of Synthesizer.
 *
 * @package     midi-Synth
 * @category    module js
 * @author      Oleg Klenitsky
 * @copyright   2024 Oleg Klenitsky
 * @license     GPL-2.0-or-later
 */

"use strict";

var GridNodes = [
  ["x0/y0", "x0/y1", "x0/y2", "x0/y3"],
  ["x1/y0", "x1/y1", "x1/y2", "x1/y3"],
  ["x2/y0", "x2/y1", "x2/y2", "x2/y3"],
  ["x3/y0", "x3/y1", "x3/y2", "x3/y3"],
  ["x4/y0", "x4/y1", "x4/y2", "x4/y3"],
  ["x5/y0", "x5/y1", "x5/y2", "x5/y3"]
];

var Nodes_pins = {"GainNode": {"in": "0,25", "gain": "0,40", "out": "70,25"},
									"OscillatorNode": {"f": "0,25", "d": "0,40", "out": "90,25"},
									"AudioBufferSourceNode": {"b": "0,25", "d": "0,40", "out": "90,25"},
									"StereoPannerNode": {"in": "0,25", "pan": "0,42", "out": "110,25"},
									"ConvolverNode": {"in": "0,25", "out": "90,25"},
									"AnalyserNode": {"in": "0,25", "out": "90,25"},
									"AudioDestinationNode": {"in": "0,12"},
									"DynamicsCompressorNode": {"in": "0,20", "th": "0,32", "kn": "0,42", "ra": "0,52", "at": "0,62", "re": "0,72", "out": "150,40"}};

var Nodes_size = {"GainNode": {"x": "70", "y": "50"},
									"OscillatorNode": {"x": "90", "y": "50"},
									"AudioBufferSourceNode": {"x": "90", "y": "50"},
									"StereoPannerNode": {"x": "110", "y": "50"},
									"ConvolverNode": {"x": "90", "y": "50"},
									"AnalyserNode": {"x": "90", "y": "50"},
									"AudioDestinationNode": {"x": "190", "y": "25"},
									"DynamicsCompressorNode": {"x": "150", "y": "80"}};


var Nodes_pos    = [];
var NodesCtx_pos = [];

function draw_info_box() {
	let audiograph = document.getElementById("audiograph");
	let ctx = audiograph.getContext("2d");

	//imgs
  document.getElementById("canvas_imgs").setAttribute("style", "position: relative;left: 720px;top: -305px;z-index:-1;");

	let AudioNodesPrm    = synth.getAudioNodesPrm();
	let AudioNodesCtxPrm = synth.getAudioNodesCtxPrm();
	let AllaudioNodesPrm = AudioNodesPrm.concat(AudioNodesCtxPrm);

	ctx.fillStyle = "#C3C3C3";
	ctx.beginPath();
	ctx.fillRect(720, 2, 258, 304);
	ctx.fill();

	ctx.font = "16px sans-serif";

	if ("" == audiograph_node) {
		ctx.font = "16px sans-serif";
		//No Name audioNode.
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("AudioParam of Node", 850, 155);
	}else{
		ctx.font = "bold 16px sans-serif";
		//Name audioNode.
		ctx.fillStyle = "#37474F";
		ctx.textAlign = "left";

		for(let i = 0; i < AllaudioNodesPrm.length; i++){
			if (audiograph_node == AllaudioNodesPrm[i].nodeName) {
				ctx.fillText(AllaudioNodesPrm[i].nodeName, 725, 15);

				let nodeName = AllaudioNodesPrm[i].nodeName.split(" ");

				switch(nodeName[0]) {
					case "OscillatorNode":
						ctx.font = "normal 13px sans-serif";

						ctx.fillText("channelCount", 725, 35);
						ctx.fillText(AllaudioNodesPrm[i].osc.channelCount, 860, 35);

						ctx.fillText("channelCountMode", 725, 50);
						ctx.fillText(AllaudioNodesPrm[i].osc.channelCountMode, 860, 50);

						ctx.fillText("channelInterpretation", 725, 65);
						ctx.fillText(AllaudioNodesPrm[i].osc.channelInterpretation, 860, 65);

						ctx.fillText("numberOfInputs", 725, 80);
						ctx.fillText(AllaudioNodesPrm[i].osc.numberOfInputs, 860, 80);

						ctx.fillText("numberOfOutputs", 725, 95);
						ctx.fillText(AllaudioNodesPrm[i].osc.numberOfOutputs, 860, 95);

						ctx.fillText("type", 725, 110);
						ctx.fillText(AllaudioNodesPrm[i].osc.type, 860, 110);

						ctx.font = "bold 14px sans-serif";
						ctx.fillText("detune: AudioParam", 725, 135);

						ctx.font = "normal 14px sans-serif";

						ctx.fillText("automationRate", 725, 150);
						ctx.fillText(AllaudioNodesPrm[i].osc.detune.automationRate, 860, 150);

						ctx.fillText("defaultValue", 725, 165);
						ctx.fillText(AllaudioNodesPrm[i].osc.detune.defaultValue, 860, 165);

						ctx.fillText("maxValue", 725, 180);
						ctx.fillText(AllaudioNodesPrm[i].osc.detune.maxValue, 860, 180);

						ctx.fillText("minValue", 725, 195);
						ctx.fillText(AllaudioNodesPrm[i].osc.detune.minValue, 860, 195);

						ctx.fillText("value", 725, 210);
						ctx.fillText(AllaudioNodesPrm[i].osc.detune.value.toFixed(3), 860, 210);

						ctx.font = "bold 14px sans-serif";
						ctx.fillText("frequency: AudioParam", 725, 230);

						ctx.font = "normal 14px sans-serif";

						ctx.fillText("automationRate", 725, 245);
						ctx.fillText(AllaudioNodesPrm[i].osc.frequency.automationRate, 860, 245);

						ctx.fillText("defaultValue", 725, 260);
						ctx.fillText(AllaudioNodesPrm[i].osc.frequency.defaultValue, 860, 260);

						ctx.fillText("maxValue", 725, 275);
						ctx.fillText(AllaudioNodesPrm[i].osc.frequency.maxValue, 860, 275);

						ctx.fillText("minValue", 725, 290);
						ctx.fillText(AllaudioNodesPrm[i].osc.frequency.minValue, 860, 290);

						ctx.fillText("value", 725, 305);
						ctx.fillText(AllaudioNodesPrm[i].osc.frequency.value.toFixed(3), 860, 305);

				    break;
				  case "AudioBufferSourceNode":
				  	ctx.font = "bold 14px sans-serif";

				  	ctx.fillText("buffer: AudioBuffer", 725, 40);

				  	ctx.font = "normal 14px sans-serif";

				  	ctx.fillText("duration", 725, 60);
						ctx.fillText(AllaudioNodesPrm[i].buf.buffer.duration, 860, 60);

						ctx.fillText("length", 725, 75);
						ctx.fillText(AllaudioNodesPrm[i].buf.buffer.length, 860, 75);

						ctx.fillText("numberOfChannels", 725, 90);
						ctx.fillText(AllaudioNodesPrm[i].buf.buffer.numberOfChannels, 860, 90);

						ctx.fillText("sampleRate", 725, 105);
						ctx.fillText(AllaudioNodesPrm[i].buf.buffer.sampleRate, 860, 105);

						ctx.font = "bold 14px sans-serif";
						ctx.fillText("detune: AudioParam", 725, 130);

						ctx.font = "normal 14px sans-serif";

						ctx.fillText("automationRate", 725, 150);
						ctx.fillText(AllaudioNodesPrm[i].buf.detune.automationRate, 860, 150);

						ctx.fillText("defaultValue", 725, 165);
						ctx.fillText(AllaudioNodesPrm[i].buf.detune.defaultValue, 860, 165);

						ctx.fillText("maxValue", 725, 180);
						ctx.fillText(AllaudioNodesPrm[i].buf.detune.maxValue, 800, 180);

						ctx.fillText("minValue", 725, 195);
						ctx.fillText(AllaudioNodesPrm[i].buf.detune.minValue, 800, 195);

						ctx.font = "bold 14px sans-serif";
						ctx.fillText("playbackRate: AudioParam", 725, 220);

						ctx.font = "normal 14px sans-serif";

						ctx.fillText("automationRate", 725, 240);
						ctx.fillText(AllaudioNodesPrm[i].buf.playbackRate.automationRate, 860, 240);

						ctx.fillText("defaultValue", 725, 255);
						ctx.fillText(AllaudioNodesPrm[i].buf.playbackRate.defaultValue, 860, 255);

						ctx.fillText("maxValue", 725, 270);
						ctx.fillText(AllaudioNodesPrm[i].buf.playbackRate.maxValue, 800, 270);

						ctx.fillText("minValue", 725, 285);
						ctx.fillText(AllaudioNodesPrm[i].buf.playbackRate.minValue, 800, 285);

						ctx.fillText("value", 725, 300);
						ctx.fillText(AllaudioNodesPrm[i].buf.playbackRate.value.toFixed(3), 800, 300);
				  	break;
				  case "StereoPannerNode":
				  	ctx.font = "normal 13px sans-serif";

						ctx.fillText("channelCount", 725, 40);
						ctx.fillText(AllaudioNodesPrm[i].pan.channelCount, 860, 40);

						ctx.fillText("channelCountMode", 725, 55);
						ctx.fillText(AllaudioNodesPrm[i].pan.channelCountMode, 860, 55);

						ctx.fillText("channelInterpretation", 725, 70);
						ctx.fillText(AllaudioNodesPrm[i].pan.channelInterpretation, 860, 70);

						ctx.fillText("numberOfInputs", 725, 85);
						ctx.fillText(AllaudioNodesPrm[i].pan.numberOfInputs, 860, 85);

						ctx.fillText("numberOfOutputs", 725, 100);
						ctx.fillText(AllaudioNodesPrm[i].pan.numberOfOutputs, 860, 100);

						ctx.font = "bold 14px sans-serif";
						ctx.fillText("pan: AudioParam", 725, 125);

						ctx.font = "normal 14px sans-serif";

				  	ctx.fillText("automationRate", 725, 145);
						ctx.fillText(AllaudioNodesPrm[i].pan.pan.automationRate, 860, 145);

						ctx.fillText("defaultValue", 725, 160);
						ctx.fillText(AllaudioNodesPrm[i].pan.pan.defaultValue, 860, 160);

						ctx.fillText("pan: maxValue", 725, 175);
						ctx.fillText(AllaudioNodesPrm[i].pan.pan.maxValue, 860, 175);

						ctx.fillText("pan: minValue", 725, 190);
						ctx.fillText(AllaudioNodesPrm[i].pan.pan.minValue, 860, 190);

						ctx.fillText("pan: value", 725, 205);
						ctx.fillText(AllaudioNodesPrm[i].pan.pan.value, 860, 205);

						ctx.font = "bold 14px sans-serif";
						ctx.fillText("context: AudioContext", 725, 230);

						ctx.font = "normal 13px sans-serif";

						ctx.fillText("baseLatency", 725, 250);
						ctx.fillText(AllaudioNodesPrm[i].pan.context.baseLatency, 860, 250);

						ctx.fillText("outputLatency", 725, 265);
						ctx.fillText(AllaudioNodesPrm[i].pan.context.outputLatency.toFixed(3), 860, 265);

						ctx.fillText("sampleRate", 725, 280);
						ctx.fillText(AllaudioNodesPrm[i].pan.context.sampleRate, 860, 280);
				    break;
				  case "GainNode":
				  	ctx.font = "normal 13px sans-serif";
				  	ctx.fillText("channelCount", 725, 40);
						ctx.fillText(AllaudioNodesPrm[i].gain.channelCount, 860, 40);

						ctx.fillText("channelCountMode", 725, 55);
						ctx.fillText(AllaudioNodesPrm[i].gain.channelCountMode, 860, 55);

						ctx.fillText("channelInterpretation", 725, 70);
						ctx.fillText(AllaudioNodesPrm[i].gain.channelInterpretation, 860, 70);

						ctx.fillText("numberOfInputs", 725, 85);
						ctx.fillText(AllaudioNodesPrm[i].gain.numberOfInputs, 860, 85);

						ctx.fillText("numberOfOutputs", 725, 100);
						ctx.fillText(AllaudioNodesPrm[i].gain.numberOfOutputs, 860, 100);

						ctx.font = "bold 14px sans-serif";
						ctx.fillText("gain: AudioParam", 725, 125);

						ctx.font = "normal 13px sans-serif";

						ctx.fillText("automationRate", 725, 145);
						ctx.fillText(AllaudioNodesPrm[i].gain.gain.automationRate, 860, 145);

						ctx.fillText("defaultValue", 725, 160);
						ctx.fillText(AllaudioNodesPrm[i].gain.gain.defaultValue, 860, 160);

						ctx.fillText("maxValue", 725, 175);
						ctx.fillText(AllaudioNodesPrm[i].gain.gain.maxValue, 800, 175);

						ctx.fillText("minValue", 725, 190);
						ctx.fillText(AllaudioNodesPrm[i].gain.gain.minValue, 800, 190);

						ctx.fillText("value", 725, 205);
						ctx.fillText(AllaudioNodesPrm[i].gain.gain.value, 800, 205);

						ctx.font = "bold 14px sans-serif";
						ctx.fillText("context: AudioContext", 725, 230);

						ctx.font = "normal 13px sans-serif";

						ctx.fillText("baseLatency", 725, 250);
						ctx.fillText(AllaudioNodesPrm[i].gain.context.baseLatency, 860, 250);

						ctx.fillText("outputLatency", 725, 265);
						ctx.fillText(AllaudioNodesPrm[i].gain.context.outputLatency.toFixed(3), 860, 265);

						ctx.fillText("sampleRate", 725, 280);
						ctx.fillText(AllaudioNodesPrm[i].gain.context.sampleRate, 860, 280);

				    break;
				  case "ConvolverNode":
				  	ctx.font = "normal 14px sans-serif";

				  	ctx.fillText("channelCount", 725, 40);
						ctx.fillText(AllaudioNodesPrm[i].conv.channelCount, 860, 40);

						ctx.fillText("channelCountMode", 725, 55);
						ctx.fillText(AllaudioNodesPrm[i].conv.channelCountMode, 860, 55);

						ctx.fillText("channelInterpretation", 725, 70);
						ctx.fillText(AllaudioNodesPrm[i].conv.channelInterpretation, 860, 70);

						ctx.fillText("numberOfInputs", 725, 85);
						ctx.fillText(AllaudioNodesPrm[i].conv.numberOfInputs, 860, 85);

						ctx.fillText("numberOfOutputs", 725, 100);
						ctx.fillText(AllaudioNodesPrm[i].conv.numberOfOutputs, 860, 100);

						ctx.fillText("normalize", 725, 115);
						ctx.fillText(AllaudioNodesPrm[i].conv.normalize, 860, 115);

						ctx.font = "bold 14px sans-serif";
						ctx.fillText("buffer: AudioBuffer", 725, 145);

						ctx.font = "normal 14px sans-serif";

						ctx.fillText("duration", 725, 165);
						ctx.fillText(AllaudioNodesPrm[i].conv.buffer.duration, 860, 165);

						ctx.fillText("length", 725, 180);
						ctx.fillText(AllaudioNodesPrm[i].conv.buffer.length, 860, 180);

						ctx.fillText("numberOfChannels", 725, 195);
						ctx.fillText(AllaudioNodesPrm[i].conv.buffer.numberOfChannels, 860, 195);

						ctx.fillText("sampleRate", 725, 210);
						ctx.fillText(AllaudioNodesPrm[i].conv.buffer.sampleRate, 860, 210);
				    break;
				  case "DynamicsCompressorNode":
						document.getElementById("canvas_imgs").setAttribute("style", "position: relative;left: 720px;top: -305px;z-index:1;");
				  	ctx.font = "bold 14px sans-serif";
				  	ctx.fillText("threshold: AudioParam", 725, 35);

				  	ctx.font = "normal 14px sans-serif";

						ctx.fillText("maxValue", 725, 49);
						ctx.fillText(AllaudioNodesPrm[i].comp.threshold.maxValue, 860, 49);

						ctx.fillText("minValue", 725, 63);
						ctx.fillText(AllaudioNodesPrm[i].comp.threshold.minValue, 860, 63);

						ctx.fillText("value", 725, 77);
						ctx.fillText(AllaudioNodesPrm[i].comp.threshold.value, 860, 77);

						ctx.font = "bold 14px sans-serif";
				  	ctx.fillText("knee: AudioParam", 725, 91);

				  	ctx.font = "normal 14px sans-serif";

						ctx.fillText("maxValue", 725, 105);
						ctx.fillText(AllaudioNodesPrm[i].comp.knee.maxValue, 860, 105);

						ctx.fillText("minValue", 725, 119);
						ctx.fillText(AllaudioNodesPrm[i].comp.knee.minValue, 860, 119);

						ctx.fillText("value", 725, 134);
						ctx.fillText(AllaudioNodesPrm[i].comp.knee.value, 860, 134);

						ctx.font = "bold 14px sans-serif";
				  	ctx.fillText("ratio: AudioParam", 725, 148);

				  	ctx.font = "normal 14px sans-serif";

						ctx.fillText("maxValue", 725, 162);
						ctx.fillText(AllaudioNodesPrm[i].comp.ratio.maxValue, 860, 162);

						ctx.fillText("minValue", 725, 176);
						ctx.fillText(AllaudioNodesPrm[i].comp.ratio.minValue, 860, 176);

						ctx.fillText("value", 725, 190);
						ctx.fillText(AllaudioNodesPrm[i].comp.ratio.value, 860, 190);

						ctx.font = "bold 14px sans-serif";
				  	ctx.fillText("attack: AudioParam", 725, 204);

				  	ctx.font = "normal 14px sans-serif";

						ctx.fillText("maxValue", 725, 218);
						ctx.fillText(AllaudioNodesPrm[i].comp.attack.maxValue, 860, 218);

						ctx.fillText("minValue", 725, 232);
						ctx.fillText(AllaudioNodesPrm[i].comp.attack.minValue, 860, 232);

						ctx.fillText("value", 725, 246);
						ctx.fillText(AllaudioNodesPrm[i].comp.attack.value.toFixed(3), 860, 246);

						ctx.font = "bold 14px sans-serif";
				  	ctx.fillText("release: AudioParam", 725, 260);

				  	ctx.font = "normal 14px sans-serif";

						ctx.fillText("maxValue", 725, 274);
						ctx.fillText(AllaudioNodesPrm[i].comp.release.maxValue, 860, 274);

						ctx.fillText("minValue", 725, 288);
						ctx.fillText(AllaudioNodesPrm[i].comp.release.minValue, 860, 288);

						ctx.fillText("value", 725, 302);
						ctx.fillText(AllaudioNodesPrm[i].comp.release.value.toFixed(3), 860, 302);

				    break;
				  case "AnalyserNode":
				  	ctx.font = "normal 14px sans-serif";

				  	ctx.fillText("channelCount", 725, 40);
						ctx.fillText(AllaudioNodesPrm[i].analys.channelCount, 890, 40);

						ctx.fillText("channelCountMode", 725, 55);
						ctx.fillText(AllaudioNodesPrm[i].analys.channelCountMode, 890, 55);

						ctx.fillText("channelInterpretation", 725, 70);
						ctx.fillText(AllaudioNodesPrm[i].analys.channelInterpretation, 890, 70);

						ctx.fillText("numberOfInputs", 725, 85);
						ctx.fillText(AllaudioNodesPrm[i].analys.numberOfInputs, 890, 85);

						ctx.fillText("numberOfOutputs", 725, 100);
						ctx.fillText(AllaudioNodesPrm[i].analys.numberOfOutputs, 890, 100);

						ctx.fillText("fftSize", 725, 115);
						ctx.fillText(AllaudioNodesPrm[i].analys.fftSize, 890, 115);

						ctx.fillText("frequencyBinCount", 725, 130);
						ctx.fillText(AllaudioNodesPrm[i].analys.frequencyBinCount, 890, 130);

						ctx.fillText("maxDecibels", 725, 145);
						ctx.fillText(AllaudioNodesPrm[i].analys.maxDecibels, 890, 145);

						ctx.fillText("minDecibels", 725, 160);
						ctx.fillText(AllaudioNodesPrm[i].analys.minDecibels, 890, 160);

						ctx.fillText("numberOfInputs", 725, 175);
						ctx.fillText(AllaudioNodesPrm[i].analys.numberOfInputs, 890, 175);

						ctx.fillText("numberOfOutputs", 725, 190);
						ctx.fillText(AllaudioNodesPrm[i].analys.numberOfOutputs, 890, 190);

						ctx.fillText("smoothingTimeConstant", 725, 205);
						ctx.fillText(AllaudioNodesPrm[i].analys.smoothingTimeConstant, 890, 205);
				    break;
				  case "AudioDestinationNode":
				  	ctx.font = "normal 14px sans-serif";

				  	ctx.fillText("channelCount", 725, 40);
						ctx.fillText(AllaudioNodesPrm[i].dest.channelCount, 890, 40);

						ctx.fillText("channelCountMode", 725, 55);
						ctx.fillText(AllaudioNodesPrm[i].dest.channelCountMode, 890, 55);

						ctx.fillText("channelInterpretation", 725, 70);
						ctx.fillText(AllaudioNodesPrm[i].dest.channelInterpretation, 890, 70);

						ctx.fillText("maxChannelCount", 725, 85);
						ctx.fillText(AllaudioNodesPrm[i].dest.maxChannelCount, 890, 85);

						ctx.fillText("numberOfInputs", 725, 100);
						ctx.fillText(AllaudioNodesPrm[i].dest.numberOfInputs, 890, 100);

						ctx.fillText("numberOfOutputs", 725, 115);
						ctx.fillText(AllaudioNodesPrm[i].dest.numberOfOutputs, 890, 115);

						ctx.font = "bold 14px sans-serif";
						ctx.fillText("context: AudioContext", 725, 135);

						ctx.font = "normal 13px sans-serif";

						ctx.fillText("baseLatency", 725, 150);
						ctx.fillText(AllaudioNodesPrm[i].dest.context.baseLatency, 890, 150);

						ctx.fillText("outputLatency", 725, 165);
						ctx.fillText(AllaudioNodesPrm[i].dest.context.outputLatency.toFixed(3), 890, 165);

						ctx.fillText("sampleRate", 725, 180);
						ctx.fillText(AllaudioNodesPrm[i].dest.context.sampleRate, 890, 180);

				    break;
				}
			}
		}
	}
	// console.log("Nodes_pos", Nodes_pos);
}
/**
 * Create Grid of Nodes.
 */
function draw_grid(){
	let audiograph = document.getElementById("audiograph");
	let ctx = audiograph.getContext("2d");

	// Box width
	let bw = audiograph.width;
	// Box height
	let bh = 240;
	// Padding
	let p = 1;

	// Draw the grid

  // for (let y = 0; y <= bw; y += 120) {
  //   ctx.moveTo(0.5 + y + p, p);
  //   ctx.lineTo(0.5 + y + p, bh - 20*p);
  // }
  // for (let x = 0; x <= bh; x += 55) {
  //   ctx.moveTo(p, 0.5 + x + p);
  //   ctx.lineTo(bw + p, 0.5 + x + p);
  // }
  // ctx.strokeStyle = "black";
  // ctx.stroke();

  //Create nodes of grid.
  let nodeX = p;
  let nodeY = p;
  for (let x = 0; x <= 5; x++) {
  	for (let y = 0; y <= 3; y++) {
  		GridNodes[x][y] = nodeX + "," + nodeY;
  		nodeY = nodeY + 55;
  	}
  	nodeY = p;
  	nodeX = nodeX + 120;
  }
}
/**
 * Create Diagram of nodes.
 */
function refresh_diagram() {
	draw_grid();

	draw_audioNodes();
	audioNode_links();

	draw_audioNodesCtx();
	audioNodeCtx_links();

	draw_info_box();
}
/**
 * Drawing connections between audio nodes.
 */
function audioNodeCtx_links(){
	var audioNodesCtx = synth.getAudioNodesCtx();
	var audiograph = document.getElementById("audiograph");
	var ctx = audiograph.getContext("2d");

	var node1_X1;
	var node1_Y1;
	var node2_X2;
	var node2_Y2;

	//Удаляю эту связи и рисую ее вручную внизу этой функции
	//т.к. связь проходит поверх двух узлов.
	if (7 == audioNodesCtx.length) {
		audioNodesCtx.splice(3, 1);
	}

	audioNodesCtx.forEach((nodes)=> {
		// Node1---------------------------------------------
		let node1 = NodesCtx_pos.filter((el1) => {
			let search1 = JSON.stringify(el1).indexOf(nodes.node1);
			if (-1 != search1) {
				return search1;
			}
		});
		let node1_posXY = node1[0].posXY.split(",");
		let pos1_X = node1_posXY[0];
		let pos1_Y = node1_posXY[1];

		let el1 = nodes.node1.split(" ");
		let el1_x_y;

		switch(el1[0]) {
		  case "GainNode":
		  	el1_x_y = Nodes_pins.GainNode.out.split(",");
		    break;
		  case "ConvolverNode":
		  	el1_x_y = Nodes_pins.ConvolverNode.out.split(",");
		    break;
		  case "DynamicsCompressorNode":
		  	el1_x_y = Nodes_pins.DynamicsCompressorNode.out.split(",");
		    break;
		  case "AnalyserNode":
		  	el1_x_y = Nodes_pins.AnalyserNode.out.split(",");
		    break;
		  case "AudioDestinationNode":
		  	el1_x_y = Nodes_pins.AudioDestinationNode.out.split(",");
		    break;
		}
		node1_X1 = parseInt(pos1_X) + parseInt(el1_x_y[0]);
		node1_Y1 = parseInt(pos1_Y) + parseInt(el1_x_y[1]);
		// Node2---------------------------------------------
		let node2 = NodesCtx_pos.filter((el2) => {
			let search2 = JSON.stringify(el2).indexOf(nodes.node2);
			if (-1 != search2) {
				return search2;
			}
		});
		let node2_posXY = node2[0].posXY.split(",");
		let pos2_X = node2_posXY[0];
		let pos2_Y = node2_posXY[1];

		let el2 = nodes.node2.split(" ");
		let el2_x_y;

		switch(el2[0]) {
		  case "GainNode":
		  	el2_x_y = Nodes_pins.GainNode.in.split(",");
		    break;
		  case "ConvolverNode":
		  	el2_x_y = Nodes_pins.ConvolverNode.in.split(",");
		    break;
		  case "DynamicsCompressorNode":
		  	el2_x_y = Nodes_pins.DynamicsCompressorNode.in.split(",");
		    break;
		  case "AnalyserNode":
		  	el2_x_y = Nodes_pins.AnalyserNode.in.split(",");
		    break;
		  case "AudioDestinationNode":
		  	el2_x_y = Nodes_pins.AudioDestinationNode.in.split(",");
		    break;
		}
		node2_X2 = parseInt(pos2_X) + parseInt(el2_x_y[0]);
		node2_Y2 = parseInt(pos2_Y) + parseInt(el2_x_y[1]);

		//Draw lines...
		ctx.beginPath();
		ctx.moveTo(node1_X1, node1_Y1);
		ctx.lineTo(node2_X2, node2_Y2);
		ctx.stroke();
	});
	// Another connection.
	ctx.beginPath();
	ctx.moveTo(80, 250);
	ctx.lineTo(110, 290);
	ctx.lineTo(300, 290);
	ctx.lineTo(330, 245);
	ctx.stroke();
}
/**
 * Drawing nodesName of audio nodes.
 */
function audioNodesProg_name(){
	var audioNodesProg = synth.getAudioNodesProg();
	var td_osc_num = document.getElementsByClassName("osc_num");

	if(undefined == audioNodesProg) return;

	for (let i = 0; i < 4; i++) {
	  td_osc_num[i].innerHTML = "";
	}
	for (let i = 0; i < audioNodesProg.length; i++) {
		let arr = audioNodesProg[i].node1.split(" ");
		if ("OscillatorNode" == arr[0]) {
			td_osc_num[i].innerHTML = "osc" + arr[1];
		}
	  if ("AudioBufferSourceNode" == arr[0]) {
			td_osc_num[i].innerHTML = "buf" + arr[1];
		}
	}

	// console.log("audioNodesProg", audioNodesProg);
}
/**
 * Drawing connections between audio nodes.
 */
function audioNode_links(){
	var audioNodes = synth.getAudioNodes();
	var audiograph = document.getElementById("audiograph");
	var ctx = audiograph.getContext("2d");

	var node1_X1;
	var node1_Y1;
	var node2_X2;
	var node2_Y2;

	// console.log("audioNodes", audioNodes);
	// console.log("Nodes_pos", Nodes_pos);

	audioNodes.forEach((nodes)=> {
		// Node1---------------------------------------------
		let node1 = Nodes_pos.filter((el1) => {
			let search1 = JSON.stringify(el1).indexOf(nodes.node1);
			if (-1 != search1) {
				return search1;
			}
		});
		let node1_posXY = node1[0].posXY.split(",");
		let pos1_X = node1_posXY[0];
		let pos1_Y = node1_posXY[1];

		let el1 = nodes.node1.split(" ");
		let el1_x_y;

		switch(el1[0]) {
		  case "GainNode":
		  	el1_x_y = Nodes_pins.GainNode.out.split(",");
		    break;
		  case "OscillatorNode":
		  	el1_x_y = Nodes_pins.OscillatorNode.out.split(",");
		    break;
		  case "AudioBufferSourceNode":
		  	el1_x_y = Nodes_pins.AudioBufferSourceNode.out.split(",");
		    break;
		  case "StereoPannerNode":
		  	el1_x_y = Nodes_pins.StereoPannerNode.out.split(",");
		    break;
		}
		node1_X1 = parseInt(pos1_X) + parseInt(el1_x_y[0]);
		node1_Y1 = parseInt(pos1_Y) + parseInt(el1_x_y[1]);
		// Node2---------------------------------------------
		let node2 = Nodes_pos.filter((el2) => {
		let nodeName = nodes.node2.replace("/f", "");
			let search2 = JSON.stringify(el2).indexOf(nodeName);
			if (-1 != search2) {
				return search2;
			}
		});
		let node2_posXY = node2[0].posXY.split(",");
		let pos2_X = node2_posXY[0];
		let pos2_Y = node2_posXY[1];

		let el2 = nodes.node1.split(" ");
		let el2_x_y;

		switch(el2[0]) {
		  case "GainNode":
		  	el2_x_y = Nodes_pins.GainNode.in.split(",");
		    break;
		  case "OscillatorNode":
		  	el2_x_y = Nodes_pins.OscillatorNode.f.split(",");
		    break;
		  case "AudioBufferSourceNode":
		  	el2_x_y = Nodes_pins.AudioBufferSourceNode.b.split(",");
		    break;
		  case "StereoPannerNode":
		  	el2_x_y = Nodes_pins.StereoPannerNode.in.split(",");
		    break;
		}
		node2_X2 = parseInt(pos2_X) + parseInt(el2_x_y[0]);
		node2_Y2 = parseInt(pos2_Y) + parseInt(el2_x_y[1]);

		//Draw lines...
		ctx.beginPath();
		ctx.moveTo(node1_X1, node1_Y1);
		ctx.lineTo(node2_X2, node2_Y2);
		ctx.stroke();
	});
	// Another connection.
	ctx.beginPath();
	ctx.moveTo(716, 134);
	ctx.lineTo(716, 220);
	ctx.lineTo(5, 220);
	ctx.lineTo(5, 250);
	ctx.stroke();
}
/**
 * [osc_or_buf description]
 * @param  {object} node      [description]
 * @param  {string} grid_node [description]
 */
function osc_or_buf(node, grid_node){
	var nameNode = node.split(" ");

	switch(nameNode[0]) {
	  case "OscillatorNode":
	  	OscillatorNode(node, grid_node);
	    break;
	  case "AudioBufferSourceNode":
	  	AudioBufferSourceNode(node, grid_node);
	    break;
	}
}
/**
 * Optimal placement of elements on the canvas
 */
function draw_audioNodes(){
	var audioNodes = synth.getAudioNodes();

	Nodes_pos = [];

	var nodes = audioNodes.filter((el) => {
		let search = JSON.stringify(el).indexOf("StereoPannerNode");
		if (-1 != search) {
			return search;
		}
	});
	//Place pair of nodes: GainNode/StereoPannerNode.
	if (undefined != nodes && 0 != nodes.length) {
		//Cell[5,2]
		StereoPannerNode(nodes[0].node2, GridNodes[5][2]);
		Nodes_pos.push({"node": nodes[0].node2, "posXY": GridNodes[5][2]});
		//Cell[4,2]
		GainNode(nodes[0].node1, GridNodes[4][2]);
		Nodes_pos.push({"node": nodes[0].node1, "posXY":GridNodes[4][2]});
	}
	//Next nodes...
	nodes = audioNodes.filter((el) => {
		if (el.node2 == nodes[0].node1) {
			return el;
		}
	});

	if(1 == nodes.length) {
		// place to cell [3][2]
		GainNode(nodes[0].node1, GridNodes[3][2]);
		Nodes_pos.push({"node": nodes[0].node1, "posXY": GridNodes[3][2]});
	}else if(2 == nodes.length) {
		// place to cell [3][1] and [3][3]
		GainNode(nodes[0].node1, GridNodes[3][1]);
		Nodes_pos.push({"node": nodes[0].node1, "posXY": GridNodes[3][1]});
		GainNode(nodes[1].node1, GridNodes[3][3]);
		Nodes_pos.push({"node": nodes[1].node1, "posXY": GridNodes[3][3]});
	}else if (3 == nodes.length) {
		// place to cell [3][1] and [3][2] and [3][3]
		GainNode(nodes[0].node1, GridNodes[3][1]);
		Nodes_pos.push({"node": nodes[0].node1, "posXY": GridNodes[3][1]});
		GainNode(nodes[1].node1, GridNodes[3][2]);
		Nodes_pos.push({"node": nodes[1].node1, "posXY": GridNodes[3][2]});
		GainNode(nodes[2].node1, GridNodes[3][3]);
		Nodes_pos.push({"node": nodes[2].node1, "posXY": GridNodes[3][3]});
	}else if (4 == nodes.length) {
		// place to cell [3][0] and [3][1] and [3][2] and [3][3]
		GainNode(nodes[0].node1, GridNodes[3][0]);
		Nodes_pos.push({"node": nodes[0].node1, "posXY": GridNodes[3][0]});
		GainNode(nodes[1].node1, GridNodes[3][1]);
		Nodes_pos.push({"node": nodes[1].node1, "posXY": GridNodes[3][1]});
		GainNode(nodes[2].node1, GridNodes[3][2]);
		Nodes_pos.push({"node": nodes[2].node1, "posXY": GridNodes[3][2]});
		GainNode(nodes[3].node1, GridNodes[3][3]);
		Nodes_pos.push({"node": nodes[3].node1, "posXY": GridNodes[3][3]});
	}
	//Next nodes...
	var nodesNext = [];
	nodes.forEach((node)=> {
		audioNodes.filter((el) => {
			if(el.node2 && el.node2 == node.node1) {
				nodesNext.push(el);
			}
		});
	});

	if(1 == nodesNext.length) {
		// place to cell [2][2]
		osc_or_buf(nodesNext[0].node1, GridNodes[2][2]);
		Nodes_pos.push({"node": nodesNext[0].node1, "posXY": GridNodes[2][2]});
	}else if(2 == nodesNext.length) {
		// place to cell [2][1] and [2][3]
		osc_or_buf(nodesNext[0].node1, GridNodes[2][1]);
		Nodes_pos.push({"node": nodesNext[0].node1, "posXY": GridNodes[2][1]});
		osc_or_buf(nodesNext[1].node1, GridNodes[2][3]);
		Nodes_pos.push({"node": nodesNext[1].node1, "posXY": GridNodes[2][3]});
	}else if (3 == nodesNext.length) {
		// place to cell [2][1] and [2][2] and [2][3]
		osc_or_buf(nodesNext[0].node1, GridNodes[2][1]);
		Nodes_pos.push({"node": nodesNext[0].node1, "posXY": GridNodes[2][1]});
		osc_or_buf(nodesNext[1].node1, GridNodes[2][2]);
		Nodes_pos.push({"node": nodesNext[1].node1, "posXY": GridNodes[2][2]});
		osc_or_buf(nodesNext[2].node1, GridNodes[2][3]);
		Nodes_pos.push({"node": nodesNext[2].node1, "posXY": GridNodes[2][3]});
	}else if (4 == nodesNext.length) {
		// place to cell [2][0] and [2][1] and [2][2] and [2][3]
		osc_or_buf(nodesNext[0].node1, GridNodes[2][0]);
		Nodes_pos.push({"node": nodesNext[0].node1, "posXY": GridNodes[2][0]});
		osc_or_buf(nodesNext[1].node1, GridNodes[2][1]);
		Nodes_pos.push({"node": nodesNext[1].node1, "posXY": GridNodes[2][1]});
		osc_or_buf(nodesNext[2].node1, GridNodes[2][2]);
		Nodes_pos.push({"node": nodesNext[2].node1, "posXY": GridNodes[2][2]});
		osc_or_buf(nodesNext[3].node1, GridNodes[2][3]);
		Nodes_pos.push({"node": nodesNext[3].node1, "posXY": GridNodes[2][3]});
	}

	//Next nodes...
	nodesNext = audioNodes.filter((el) => {
		let search = JSON.stringify(el).indexOf("/");
		if (-1 != search) {
			return search;
		}
	});

	if(1 == nodesNext.length) {
		// place to cell [1][1]
		GainNode(nodesNext[0].node1, GridNodes[1][1]);
		Nodes_pos.push({"node": nodesNext[0].node1, "posXY": GridNodes[1][1]});
	}else if(2 == nodesNext.length) {
		// place to cell [1][0] and [1][2]
		GainNode(nodesNext[0].node1, GridNodes[1][0]);
		Nodes_pos.push({"node": nodesNext[0].node1, "posXY": GridNodes[1][0]});
		GainNode(nodesNext[1].node1, GridNodes[1][2]);
		Nodes_pos.push({"node": nodesNext[1].node1, "posXY": GridNodes[1][2]});
	}else if(3 == nodesNext.length) {
		// place to cell [1][1] and [1][2] and [1][3]
		GainNode(nodesNext[0].node1, GridNodes[1][1]);
		Nodes_pos.push({"node": nodesNext[0].node1, "posXY": GridNodes[1][1]});
		GainNode(nodesNext[1].node1, GridNodes[1][2]);
		Nodes_pos.push({"node": nodesNext[1].node1, "posXY": GridNodes[1][2]});
		GainNode(nodesNext[2].node1, GridNodes[1][3]);
		Nodes_pos.push({"node": nodesNext[2].node1, "posXY": GridNodes[1][3]});
	}

	//Next nodes...
	var nodes = nodesNext;
	nodesNext = [];
	nodes.forEach((node)=> {
		audioNodes.filter((el) => {
			if(el.node2 && el.node2 == node.node1) {
				nodesNext.push(el);
			}
		});
	});

	if(1 == nodesNext.length) {
		// place to cell [0][1]
		osc_or_buf(nodesNext[0].node1, GridNodes[0][1]);
		Nodes_pos.push({"node": nodesNext[0].node1, "posXY": GridNodes[0][1]});
	}else if(2 == nodesNext.length) {
		// place to cell [0][0] and [0][2]
		osc_or_buf(nodesNext[0].node1, GridNodes[0][0]);
		Nodes_pos.push({"node": nodesNext[0].node1, "posXY": GridNodes[0][0]});
		osc_or_buf(nodesNext[1].node1, GridNodes[0][2]);
		Nodes_pos.push({"node": nodesNext[1].node1, "posXY": GridNodes[0][2]});
	}else if(3 == nodesNext.length) {
		// place to cell [0][1] and [0][2] and [0][3]
		osc_or_buf(nodesNext[0].node1, GridNodes[0][1]);
		Nodes_pos.push({"node": nodesNext[0].node1, "posXY": GridNodes[0][1]});
		osc_or_buf(nodesNext[1].node1, GridNodes[0][2]);
		Nodes_pos.push({"node": nodesNext[1].node1, "posXY": GridNodes[0][2]});
		osc_or_buf(nodesNext[2].node1, GridNodes[0][3]);
		Nodes_pos.push({"node": nodesNext[2].node1, "posXY": GridNodes[0][3]});
	}

	// console.log("audioNodes", audioNodes);
	// console.log("Nodes_pos", Nodes_pos);
}
/**
 * Draw audioNodesCtx of Synthesizer.
 */
function draw_audioNodesCtx(){
	var audioNodesCtx = synth.getAudioNodesCtx();

	NodesCtx_pos = [];
	var uniqNodes  = [];
	var node1;
	var node2;
	var posX = 10;
	var step = 30;

	//console.log("audioNodesCtx", audioNodesCtx);

	audioNodesCtx.forEach((nodes)=> {
		node1 = nodes.node1;
		node2 = nodes.node2;

		let node1Name = (undefined != node1) ?node1.split(" ") :undefined;
		let node2Name = (undefined != node2) ?node2.split(" ") :undefined;

		if (undefined != node1Name && false == uniqNodes.includes(node1)) {
			switch(node1Name[0]) {
			  case "GainNode":
			    GainNode(nodes.node1, posX + ", 225");
			    NodesCtx_pos.push({"node": nodes.node1, "posXY": posX + ", 225"});
			    posX = posX + 70 + step;
			    break;
			  case "ConvolverNode":
			  	ConvolverNode(nodes.node1, posX + ", 225");
			    NodesCtx_pos.push({"node": nodes.node1, "posXY": posX + ", 225"});
			    posX = posX + 90 + step;
			    break;
			  case "DynamicsCompressorNode":
			  	DynamicsCompressorNode(nodes.node1, posX + ", 225");
			    NodesCtx_pos.push({"node": nodes.node1, "posXY": posX + ", 225"});
			    break;
			}
			uniqNodes.push(node1);
		}
		if (undefined != node2Name && false == uniqNodes.includes(node2)) {
			switch(node2Name[0]) {
			  case "GainNode":
			    GainNode(nodes.node2, posX + ", 225");
			    	NodesCtx_pos.push({"node": nodes.node2, "posXY": posX + ", 225"});
			    	posX = posX + 70 + step;
			    break;
			  case "ConvolverNode":
			  	ConvolverNode(nodes.node2, posX + ", 225");
			    NodesCtx_pos.push({"node": nodes.node2, "posXY": posX + ", 225"});
			    posX = posX + 90 + step;
			    break;
			  case "DynamicsCompressorNode":
			  	DynamicsCompressorNode(nodes.node2, posX + ", 225");
			    NodesCtx_pos.push({"node": nodes.node2, "posXY": posX + ", 225"});
			    posX = posX + 150 + step;
			    break;
			  case "AudioDestinationNode":
			  	AudioDestinationNode(nodes.node2, posX + ", 280");
			  	NodesCtx_pos.push({"node": nodes.node2, "posXY": posX + ", 280"});
			    break;
			  case "AnalyserNode":
			  	AnalyserNode(nodes.node2, posX + ", 225");
			  	NodesCtx_pos.push({"node": nodes.node2, "posXY": posX + ", 225"});
			    break;
			}
			uniqNodes.push(node2);
		}
	});
	//console.log("NodesCtx_pos", NodesCtx_pos);
}
/**
 * [OscillatorNode description]
 * @param string name      Name of audioNode
 * @param string GridNodes Position X,Y
 */
function OscillatorNode(name, GridNodes){
	let ch         = document.getElementById("ch");
	let audiograph = document.getElementById("audiograph");
	let ctx = audiograph.getContext("2d");

	GridNodes = GridNodes.split(",");

	let posX = parseInt(GridNodes[0]);
	let posY = parseInt(GridNodes[1]);

	ctx.fillStyle = "#009688";

	ctx.beginPath();
	ctx.roundRect(posX, posY,90,50,[5]);
	ctx.fill();

	ctx.font = "12px sans-serif";

	//Name audioNode.
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText(name.replace("Node", ""), 45+posX, 15+posY);

	ctx.font = "11px sans-serif";

	//Inputs: frequency, detune.
	ctx.fillStyle = "#CFD8DC";
	ctx.textAlign = "left";
	ctx.fillText("frequency", 7+posX, 30+posY);
	ctx.fillText("detune", 7+posX, 45+posY);
	ctx.fillText("Ch" + ch.value, 45+posX, 45+posY);

	ctx.fillStyle = "#CDDC39";
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000000";

	ctx.beginPath();
	ctx.arc(posX, 25+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(posX, 40+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();

	ctx.fillStyle = "#E91E63";

	ctx.beginPath();
	ctx.arc(90+posX, 25+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();
}

/**
 * [AudioBufferSourceNode description]
 * @param string name      Name of audioNode
 * @param string GridNodes Position X,Y
 */
function AudioBufferSourceNode(name, GridNodes){
	let ch         = document.getElementById("ch");
	let audiograph = document.getElementById("audiograph");
	let ctx = audiograph.getContext("2d");

	GridNodes = GridNodes.split(",");

	let posX = parseInt(GridNodes[0]);
	let posY = parseInt(GridNodes[1]);

	ctx.fillStyle = "#905096";

	ctx.beginPath();
	ctx.roundRect(posX, posY,90,50,[5]);
	ctx.fill();

	ctx.font = "12px sans-serif";

	//Name audioNode.
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText(name.replace("AudioBufferSourceNode", "AudioBufSrc"), 45+posX, 15+posY);

	ctx.font = "11px sans-serif";

	//Inputs: playbackRate, detune.
	ctx.fillStyle = "#CFD8DC";
	ctx.textAlign = "left";
	ctx.fillText("playbackRate", 7+posX, 30+posY);
	ctx.fillText("detune", 7+posX, 45+posY);
	ctx.fillText("Ch" + ch.value, 45+posX, 45+posY);

	ctx.fillStyle = "#CDDC39";
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000000";

	ctx.beginPath();
	ctx.arc(posX, 25+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(posX, 40+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();

	ctx.fillStyle = "#E91E63";

	ctx.beginPath();
	ctx.arc(90+posX, 25+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();
}


/**
 * [GainNode description]
 * @param string name      Name of audioNode
 * @param string GridNodes Position X,Y
 */
function GainNode(name, GridNodes) {
	let audiograph = document.getElementById("audiograph");
	let ctx = audiograph.getContext("2d");

	GridNodes = GridNodes.split(",");

	let posX = parseInt(GridNodes[0]);
	let posY = parseInt(GridNodes[1]);

	ctx.fillStyle = "#3F51B5";

	ctx.beginPath();
	ctx.roundRect(posX, posY,70,50,[5]);
	ctx.fill();

	ctx.font = "12px sans-serif";

	//Name audioNode.
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText(name.replace("Node", ""), 35+posX, 15+posY);

	ctx.font = "11px sans-serif";

	//Inputs: gain.
	ctx.fillStyle = "#CFD8DC";
	ctx.textAlign = "left";
	ctx.fillText("gain", 7+posX, 45+posY);

	ctx.fillStyle = "#4CAF50";
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000000";

	ctx.beginPath();
	ctx.arc(posX, 25+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();

	ctx.fillStyle = "#CDDC39";

	ctx.beginPath();
	ctx.arc(posX, 40+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();

	ctx.fillStyle = "#E91E63";

	ctx.beginPath();
	ctx.arc(70+posX, 25+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();

}
/**
 * [StereoPannerNode description]
 * @param string name      Name of audioNode
 * @param string GridNodes Position X,Y
 */
function StereoPannerNode(name, GridNodes) {
	let audiograph = document.getElementById("audiograph");
	let ctx = audiograph.getContext("2d");

	GridNodes = GridNodes.split(",");

	let posX = parseInt(GridNodes[0]);
	let posY = parseInt(GridNodes[1]);

	ctx.fillStyle = "#2196F3";

	ctx.beginPath();
	ctx.roundRect(posX, posY,110,50,[5]);
	ctx.fill();

	ctx.font = "12px sans-serif";

	//Name audioNode.
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText(name.replace("Node", ""), 55+posX, 15+posY);

	ctx.font = "11px sans-serif";

	//Inputs: gain.
	ctx.fillStyle = "#CFD8DC";
	ctx.textAlign = "left";
	ctx.fillText("pan", 7+posX, 45+posY);

	ctx.fillStyle = "#4CAF50";
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000000";

	ctx.beginPath();
	ctx.arc(posX, 25+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();

	ctx.fillStyle = "#CDDC39";

	ctx.beginPath();
	ctx.arc(posX, 42+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();

	ctx.fillStyle = "#E91E63";

	ctx.beginPath();
	ctx.arc(110+posX, 25+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();
}
/**
 * [ConvolverNode description]
 * @param string name      Name of audioNode
 * @param string GridNodes Position X,Y
 */
function ConvolverNode(name, GridNodes) {
	let audiograph = document.getElementById("audiograph");
	let ctx = audiograph.getContext("2d");

	GridNodes = GridNodes.split(",");

	let posX = parseInt(GridNodes[0]);
	let posY = parseInt(GridNodes[1]);

	ctx.fillStyle = "#2196F3";

	ctx.beginPath();
	ctx.roundRect(posX, posY,90,50,[5]);
	ctx.fill();

	ctx.font = "12px sans-serif";

	//Name audioNode.
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText(name.replace("Node", ""), 45+posX, 15+posY);

	ctx.fillStyle = "#4CAF50";
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000000";

	ctx.beginPath();
	ctx.arc(posX, 25+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();

	ctx.fillStyle = "#E91E63";

	ctx.beginPath();
	ctx.arc(90+posX, 25+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();
}
/**
 * [DynamicsCompressorNode description]
 * @param string name      Name of audioNode
 * @param string GridNodes Position X,Y
 */
function DynamicsCompressorNode(name, GridNodes) {
	let audiograph = document.getElementById("audiograph");
	let ctx = audiograph.getContext("2d");

	GridNodes = GridNodes.split(",");

	let posX = parseInt(GridNodes[0]);
	let posY = parseInt(GridNodes[1]);

	ctx.fillStyle = "#2196F3";

	ctx.beginPath();
	ctx.roundRect(posX, posY,150,80,[5]);
	ctx.fill();

	ctx.font = "12px sans-serif";

	//Name audioNode.
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText(name.replace("Node", ""), 75+posX, 15+posY);

	ctx.font = "11px sans-serif";

	//Inputs:
	ctx.fillStyle = "#CFD8DC";
	ctx.textAlign = "left";
	ctx.fillText("threshold", 7+posX, 35+posY);

	ctx.fillStyle = "#CFD8DC";
	ctx.textAlign = "left";
	ctx.fillText("knee", 7+posX, 45+posY);

	ctx.fillStyle = "#CFD8DC";
	ctx.textAlign = "left";
	ctx.fillText("ratio", 7+posX, 55+posY);

	ctx.fillStyle = "#CFD8DC";
	ctx.textAlign = "left";
	ctx.fillText("attack", 7+posX, 65+posY);

	ctx.fillStyle = "#CFD8DC";
	ctx.textAlign = "left";
	ctx.fillText("release", 7+posX, 75+posY);

	ctx.fillStyle = "#4CAF50";
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000000";

	ctx.beginPath();
	ctx.arc(posX, 20+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();

	ctx.fillStyle = "#CDDC39";

	ctx.beginPath();
	ctx.arc(posX, 32+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(posX, 42+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(posX, 52+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(posX, 62+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(posX, 72+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();

	ctx.fillStyle = "#E91E63";

	ctx.beginPath();
	ctx.arc(150+posX, 40+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();
}
/**
 * [AudioDestinationNode description]
 * @param string name      Name of audioNode
 * @param string GridNodes Position X,Y
 */
function AudioDestinationNode(name, GridNodes) {
	let audiograph = document.getElementById("audiograph");
	let ctx = audiograph.getContext("2d");

	GridNodes = GridNodes.split(",");

	let posX = parseInt(GridNodes[0]);
	let posY = parseInt(GridNodes[1]);

	ctx.fillStyle = "#37474F";

	ctx.beginPath();
	ctx.roundRect(posX, posY,190,25,[5]);
	ctx.fill();

	ctx.font = "12px sans-serif";

	//Name audioNode.
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText(name.replace("Node", ""), 95+posX, 15+posY);

	ctx.fillStyle = "#4CAF50";
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000000";

	ctx.beginPath();
	ctx.arc(posX, 12+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();
}
/**
 * [AnalyserNode description]
 * @param string name      Name of audioNode
 * @param string GridNodes Position X,Y
 */
function AnalyserNode(name, GridNodes) {
	let audiograph = document.getElementById("audiograph");
	let ctx = audiograph.getContext("2d");

	GridNodes = GridNodes.split(",");

	let posX = parseInt(GridNodes[0]);
	let posY = parseInt(GridNodes[1]);

	ctx.fillStyle = "#00BCD4";

	ctx.beginPath();
	ctx.roundRect(posX, posY,90,50,[5]);
	ctx.fill();

	ctx.font = "12px sans-serif";

	//Name audioNode.
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText(name.replace("Node", ""), 45+posX, 15+posY);

	ctx.fillStyle = "#4CAF50";
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000000";

	ctx.beginPath();
	ctx.arc(posX, 25+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();

	ctx.fillStyle = "#E91E63";

	ctx.beginPath();
	ctx.arc(90+posX, 25+posY, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();
}