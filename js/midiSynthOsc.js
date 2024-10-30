/**
 * Description: WebAudio oscillograph.
 *
 * @package     midi-Synth
 * @category    module js
 * @author      Oleg Klenitsky
 * @copyright   2024 Oleg Klenitsky
 * @license     GPL-2.0-or-later
 */

"use strict";

/**
 * [Diagram_grid description]
 * @param boolean mode       On / Off
 */
function Diagram_grid(mode){
  var canvasCtx  = canvas_midi.getContext("2d");
  const gradient = canvasCtx.createRadialGradient(90, 90, 40, 90, 90, 120);

  if (true == mode) {
    gradient.addColorStop("0","#3E9495");
    gradient.addColorStop(".9","#17494A");
    gradient.addColorStop("1","#5D5D55");

    document.getElementById("canvas_midi").getContext("2d").canvas.setAttribute("style","animation:fadein 1s linear 1 normal forwards;position: absolute;top:42px;left:27px;");

  } else {
    gradient.addColorStop(".9","#393935");
    gradient.addColorStop("1","#5D5D55");

    document.getElementById("canvas_midi").getContext("2d").canvas.setAttribute("style","position: absolute;top:42px;left:27px;");
  }

  canvasCtx.fillStyle = gradient;
  canvasCtx.fillRect(0, 0, canvas_midi.width, canvas_midi.height);

  canvasCtx.lineWidth = 1;
  canvasCtx.strokeStyle = "#5D5D55";
  canvasCtx.beginPath();

  canvasCtx.moveTo(0, canvas_midi.height / 2);
  canvasCtx.lineTo(canvas_midi.width, canvas_midi.height / 2);
  // X lines
  for (let i = canvas_midi.height / 2; i < canvas_midi.height; i=i+15) {
    canvasCtx.moveTo(0, i);
    canvasCtx.lineTo(canvas_midi.width, i);
  }
  for (let i = canvas_midi.height / 2; i > 0; i=i-15) {
    canvasCtx.moveTo(0, i);
    canvasCtx.lineTo(canvas_midi.width, i);
  }
  // Y lines
  for (let i = canvas_midi.width / 2; i < canvas_midi.width; i=i+15) {
    canvasCtx.moveTo(i, 0);
    canvasCtx.lineTo(i, canvas_midi.height);
  }
  for (let i = canvas_midi.width / 2; i > 0; i=i-15) {
    canvasCtx.moveTo(i, 0);
    canvasCtx.lineTo(i, canvas_midi.height);
  }

  canvasCtx.stroke();
}
function Diagram(scaleX){
  var canvasCtx    = canvas_midi.getContext("2d");
  var analyzerMain = synth.getAnalyzerMain();

  switch(scaleX){
  case 1:
    analyzerMain.fftSize = 4096;
    break;
  case 2:
    analyzerMain.fftSize = 2048;
    break;
  case 3:
    analyzerMain.fftSize = 1024;
    break;
  case 4:
    analyzerMain.fftSize = 512;
    break;
  case 5:
    analyzerMain.fftSize = 256;
    break;
  case 6:
    analyzerMain.fftSize = 128;
    break;
  case 7:
    analyzerMain.fftSize = 64;
    break;
  case 8:
    analyzerMain.fftSize = 32;
  }

  var bufferLengthMain  = analyzerMain.frequencyBinCount;
  var dataArrayMain     = new Uint8Array(bufferLengthMain);

  var bufferLengthSlave = [];
  var dataArraySlave    = [];
  var bufferLength   = 0;
  var dataArray      = [];

  Diagram_draw();

  function Diagram_draw(){
    var sw0   = document.getElementById("sw0");
    var sw1   = document.getElementById("sw1");
    var sw2   = document.getElementById("sw2");
    var sw3   = document.getElementById("sw3");
    var sw4   = document.getElementById("sw4");

    // draw an canvas_midi of the current audio source.
    if(true == diagram_view) {
        window.requestAnimationFrame(Diagram_draw);
        if ("1" == sw0.value) {
          Diagram_draw_sw0();
        }
        if ("1" == sw1.value) {
          Diagram_draw_sw1();
        }
        if ("1" == sw2.value) {
          Diagram_draw_sw2();
        }
        if ("1" == sw3.value) {
          Diagram_draw_sw3();
        }
        if ("1" == sw4.value) {
          Diagram_draw_sw4();
        }
    } else {
      window.cancelAnimationFrame(Diagram_draw);
      return;
    }
  }
  function Diagram_draw_sw0(){
    var canvasCtx = canvas_midi.getContext("2d");

    analyzerMain.getByteTimeDomainData(dataArrayMain);

    Diagram_grid(true);

    canvasCtx.strokeStyle = "white";
    let sliceWidth = canvas_midi.width / bufferLengthMain;
    let x = 0;

    canvasCtx.beginPath();
    for (let i = 0; i < bufferLengthMain; i++) {
      let v = dataArrayMain[i] / 128.0;
      let y = v * canvas_midi.height / 2;
      if (i == 0) {
        canvasCtx.moveTo(x, y);
      } else {
        if (y != canvas_midi.height / 2 ) {
          canvasCtx.lineTo(x, y);
        }
      }
      x += sliceWidth;
    }
    canvasCtx.stroke();
  }
  function Diagram_draw_sw1(){
    var canvasCtx  = canvas_midi.getContext("2d");
    var prog       = synth.program[curProg];

    Diagram_grid(true);

    if (0 != prog["p"][0].length) {
      Diagram_AHDSR(prog["p"][0], "red");
    }
  }
  function Diagram_draw_sw2(){
    var canvasCtx  = canvas_midi.getContext("2d");
    var prog       = synth.program[curProg];

    Diagram_grid(true);

    if (0 != prog["p"][1].length) {
      Diagram_AHDSR(prog["p"][1], "blue");
    }
  }
  function Diagram_draw_sw3(){
    var canvasCtx  = canvas_midi.getContext("2d");
    var prog       = synth.program[curProg];

    Diagram_grid(true);

    if (0 != prog["p"][2].length) {
      Diagram_AHDSR(prog["p"][2], "green");
    }
  }
  function Diagram_draw_sw4(){
    var canvasCtx  = canvas_midi.getContext("2d");
    var prog       = synth.program[curProg];

    Diagram_grid(true);

    if (0 != prog["p"][3].length) {
      Diagram_AHDSR(prog["p"][3], "brown");
    }
  }
  /**
   * [Diagram_AHDSR description]
   * @param object  canvasCtx  getContext
   * @param string  color      wave color
   */
  function Diagram_AHDSR(prog, color){
    var canvasCtx  = canvas_midi.getContext("2d");
    var width  = canvasCtx.canvas.width;
    var height = canvasCtx.canvas.height;

    canvasCtx.beginPath();
    canvasCtx.lineWidth = 1;
    canvasCtx.strokeStyle = "white";

    //axis X
    canvasCtx.moveTo(15, 90);
    canvasCtx.lineTo(180, 90);

    canvasCtx.lineTo(170, 88);
    canvasCtx.lineTo(170, 92);
    canvasCtx.lineTo(180, 90);

    canvasCtx.strokeStyle = "#C3C3C3";
    canvasCtx.font = "normal 10px sans-serif";
    canvasCtx.strokeText("sec",160,100);

    //axis Y
    canvasCtx.moveTo(15, 90);
    canvasCtx.lineTo(15, 15);

    canvasCtx.lineTo(15, 5);
    canvasCtx.lineTo(13, 15);
    canvasCtx.lineTo(17, 15);
    canvasCtx.lineTo(15, 5);

    canvasCtx.strokeStyle = "#C3C3C3";
    canvasCtx.font = "normal 10px sans-serif";
    canvasCtx.strokeText("dB",1,10);

    canvasCtx.stroke();

    //draw AHDSR
    canvasCtx.beginPath();
    canvasCtx.strokeStyle = color;

    canvasCtx.lineTo(15, 90);
    canvasCtx.lineTo(45, 30);
    canvasCtx.lineTo(75, 30);
    canvasCtx.lineTo(105, 60);
    canvasCtx.lineTo(135, 60);
    canvasCtx.lineTo(165, 90);

    canvasCtx.stroke();

    //draw parameters
    canvasCtx.strokeStyle = "#C3C3C3";
    canvasCtx.font = "normal 12px sans-serif";

    canvasCtx.strokeText("Attack :",15,118);
    canvasCtx.strokeText(prog.a, 75,118);

    canvasCtx.strokeText("Hold :",15,131);
    canvasCtx.strokeText(prog.h, 75,131);

    canvasCtx.strokeText("Decay :",15,143);
    canvasCtx.strokeText(prog.d, 75,143);

    canvasCtx.strokeText("Sustain :",15,156);
    canvasCtx.strokeText(prog.s, 75,156);

    canvasCtx.strokeText("Release :",15,169);
    canvasCtx.strokeText(prog.r, 75,169);
  }
}
/**
 * Distributes a click event to the associated swX element.
 * @param  string id ID sw0 - sw4
 */
function p_swX_click(id){
  switch(id){
  case "sw0":
    if (0 == document.getElementById("sw0").value) {
      document.getElementById("sw0").value = 1;

      document.getElementById("sw1").value = 0;
      document.getElementById("sw2").value = 0;
      document.getElementById("sw3").value = 0;
      document.getElementById("sw4").value = 0;
    }
    break;
  case "sw1":
    if (0 == document.getElementById("sw1").value) {
      document.getElementById("sw1").value = 1;

      document.getElementById("sw0").value = 0;
      document.getElementById("sw2").value = 0;
      document.getElementById("sw3").value = 0;
      document.getElementById("sw4").value = 0;
    }
    break;
  case "sw2":
    if (0 == document.getElementById("sw2").value) {
      document.getElementById("sw2").value = 1;

      document.getElementById("sw0").value = 0;
      document.getElementById("sw1").value = 0;
      document.getElementById("sw3").value = 0;
      document.getElementById("sw4").value = 0;
    }
    break;
  case "sw3":
    if (0 == document.getElementById("sw3").value) {
      document.getElementById("sw3").value = 1;

      document.getElementById("sw0").value = 0;
      document.getElementById("sw1").value = 0;
      document.getElementById("sw2").value = 0;
      document.getElementById("sw4").value = 0;
    }
    break;
  case "sw4":
    if (0 == document.getElementById("sw4").value) {
      document.getElementById("sw4").value = 1;

      document.getElementById("sw0").value = 0;
      document.getElementById("sw1").value = 0;
      document.getElementById("sw2").value = 0;
      document.getElementById("sw3").value = 0;
    }
    break;
  }
}