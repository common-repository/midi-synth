/**
 * Description: WebAudio Sequencer of Synthesizer.
 *
 * Functions for GUI:
 *   drawTimeScale(scale)
 *   drawTimeScaleBeats(offset, lengthMeasure, lengthBeat)
 *   drawRangeNotes()
 *   drawNotesStrip()
 *   drawVexflow(clef)
 *   drawHeaderInfo()
 *   drawTrackInfo()
 *   drawNotesSong(scale)
 *   drawNote(ch, note, offset, delta)
 *   viewHelp()

 * Function of services:
 *   startTimer()
 *   checkMeasuresPlus(arr)
 *   ptrTimeDragDrope(e)
 *   selPart1Item(id)
 *   speaker_on_off(id)
 *   btnScale(id)
 *
 * Functions checking, formatting, retrieving data:
 *   durationNote(lengthNote,sub_item)
 *   formatMusicalPart()
 *   childNote(numMeasure, parentNoteName, parentLengthNote, parentNoteDuration, childLengthNote)
 *   dataCheck()
 *
 * @package     midi-Synth
 * @category    module js
 * @author      Oleg Klenitsky
 * @copyright   2024 Oleg Klenitsky
 * @license     GPL-2.0-or-later
 */

"use strict";

var scale = 1;

var afterChecking = false;

var cnvScale;
var cnvRange;
var cnvBody;

var ctxScale;
var ctxRange;
var ctxBody;

/**
 * Purpose: revers of arrNotes (name of notes).
 * Used: drawRangeNotes(), drawNotesStrip(), testNotesStrip().
 * Source: synth.arrNotes
 * @type {Array}
 */
var arrRevers = [];

/**
 * Purpose: draw rects of notes on cnvBody by drawNote(ch, note, offset, delta).
 * Used: drawNotesStrip(), testNotesStrip().
 * Source: arrRevers.
 * @type {array}
 */
var arrNotesTrack = [];

/**
 * Purpose: channels for sounding in a synthesizer.
 * Used: speaker_on_off(id).
 * Source: drawTrackInfo().
 * @type {Array}
 */
var arrChannelsSound = [];

/**
 * Purpose: draw notes on musical staff by drawVexflow(clef).
 * Source: arrMusicalPart, arrMeasures.
 * @type {array}
 */
var arrVexFlow = [];

/**
 * Purpose: create arrVexFlow by drawNotesSong(scale).
 * Source: arrTracksEvents[numTrack].
 * @type {array}
 */
var arrMusicalPart = [];

/**
 * Purpose: draw rects of notes on cnvBody by drawNotesSong(scale).
 * Used: dataCheck().
 * Source: midiFile.getTrackEvents(numTrack);
 * @type {array}
 */
var arrTracksEvents = [];

/**
 * Purpose: draw nunMeasures on musical staff by drawVexflow(clef).
 * Used: formatMusicalPart(), dataCheck().
 * Source: arrTimeSignatureNoBPM.
 * @type {array}
 */
var arrMeasures = [];

/**
 * Purpose: draw nunMeasures, lines, flags on cnvScale by drawTimeScale(scale).
 * Used: dataCheck().
 * Source: arrTimeSignature.
 * @type {Array}
 */
var arrTimeSignatureNoBPM = [];

/**
 * Purpose: move the time pointer by startTimer().
 * Source: synth.getTimeSignature();
 * @type {array}
 */
var arrTimeSignature = [];

var sumLength  = 0;

var selPart1ItemNum = "";

var click_speaker = false;
var click_staves  = false;

var clef = "";

var btnOn = "";

/**
 * [drawTimeScale description]
 *
 * EVENT_META_SET_TEMPO = 0x51;      //81
 * tempoBPM: 120  - 120 1/4notes per 1 minute (or 120 beats per minute)
 * tempo: 500 000 - 1/4note - 500 000 microseconds
 *
 * EVENT_META_TIME_SIGNATURE = 0x58; //88
 * param1 - time signature numerator
 * param2 - power of 2 - time signature denominator
 * param3 - tiks (24 of 1/4note, 48 of 1/2note)  PPQN
 * param4 - number of 1/32 notes per measure
 *
 * @param  {[type]} scale [description]
 */
function drawTimeScale(scale){
  var ticksPerBeat  = synth.getTicksPerBeat();
  var maxTick = synth.getSongDurationTicks();
  var measure = 0;
  var lengthBeat = 0;

  arrMeasures = [];

  arrTimeSignature = synth.getTimeSignature();

  if(0 == arrTimeSignature.length) return;

  arrTimeSignatureNoBPM = arrTimeSignature.filter(function(item) {
    if (81 == item.subtype) {
      return false;
    }
    if (88 == item.subtype) {
      return true;
    }
  });

  arrTimeSignatureNoBPM.forEach(function(item, idx) {
    let lengthMeasure = 0;
    let countSubBeats = 0;

    if(arrTimeSignatureNoBPM[idx+1]){
      lengthMeasure = arrTimeSignatureNoBPM[idx+1].tick - item.tick;
    }else{
      lengthMeasure = maxTick - item.tick;
      let chunk = lengthMeasure%(ticksPerBeat*4);
      lengthMeasure = lengthMeasure - chunk + ticksPerBeat*8;
    }
    //Draw timeScale measures.
    ctxScale.fillStyle = "black";
    ctxScale.beginPath();
    ctxScale.moveTo(Math.round(item.tick/12)*scale, 20);
    ctxScale.lineTo(Math.round(item.tick/12)*scale, 10);
    ctxScale.stroke();
    ctxScale.font = "bold 12px system";
    ctxScale.fillText(measure+1, Math.round(item.tick/12)*scale, 9);
    item.measure = measure;

    // build array measures.
    let txt = item.timeSignature[0] +"/"+ Math.pow(2, item.timeSignature[1]);
    arrMeasures.push({tick:item.tick, measure:measure ,duration: txt});

    if(190 < ticksPerBeat || scale > 1){
      let txtBPM = synth.getCurrBPM(measure);
      ctxScale.font = "normal 11px arial";
      ctxScale.fillText(" bpm:"+txtBPM, Math.round(item.tick/12)*scale + ctxScale.measureText(measure+1).width , 8);
    }

    if (2 == item.timeSignature[1]) lengthBeat = ticksPerBeat;
    if (3 == item.timeSignature[1]) lengthBeat = ticksPerBeat/2;
    if (4 == item.timeSignature[1]) lengthBeat = ticksPerBeat/4;
    if (5 == item.timeSignature[1]) lengthBeat = ticksPerBeat/8;

    countSubBeats = Math.floor(lengthMeasure/lengthBeat);

    let countSubMeasures = Math.floor(countSubBeats/item.timeSignature[0]);
    let offset = item.tick;

    drawTimeScaleBeats(offset, lengthMeasure, lengthBeat);
    
    for(let i=1; i<countSubMeasures; i++){
      offset = offset + lengthMeasure/countSubMeasures;
      ctxScale.font = "bold 12px system";
      ctxScale.beginPath();
      ctxScale.moveTo(Math.round(offset/12)*scale, 20);
      ctxScale.lineTo(Math.round(offset/12)*scale, 10);
      ctxScale.stroke();
      ctxScale.fillText(item.measure+1+i, Math.round(offset/12)*scale, 9);

      arrMeasures.push({tick:offset, measure:measure+i});
    }
    measure = measure + countSubMeasures;
  });

  //Draw flags for measures.
  arrTimeSignatureNoBPM.forEach(function(item, idx) {
    let txt = item.timeSignature[0] +"/"+ Math.pow(2, item.timeSignature[1]);
    let txtWidth = ctxScale.measureText(txt).width;

    ctxScale.fillStyle = "white";
    ctxScale.beginPath();
    ctxScale.moveTo((Math.round(item.tick/12)*scale)+2,10);
    ctxScale.lineTo((Math.round(item.tick/12)*scale)+txtWidth+5,10);
    ctxScale.lineTo((Math.round(item.tick/12)*scale)+txtWidth,19);
    ctxScale.lineTo((Math.round(item.tick/12)*scale)+2,19);
    ctxScale.lineTo((Math.round(item.tick/12)*scale)+2,10);
    ctxScale.fill();

    ctxScale.fillStyle = "black";
    ctxScale.font = "normal 11px arial";
    ctxScale.fillText(txt, ((Math.round(item.tick/12)*scale))+2, 19);
  });
  //Draw timeScale beats.
  function drawTimeScaleBeats(offset, lengthMeasure, lengthBeat){
    ctxScale.lineWidth = 0.5;
    ctxBody.lineWidth  = 0.5;
    for(let i=0; i<lengthMeasure; i+= lengthBeat) {
      ctxScale.fillStyle = "black";
      ctxScale.beginPath();
      ctxScale.moveTo(Math.round((offset+i)/12)*scale, 20);
      ctxScale.lineTo(Math.round((offset+i)/12)*scale, 15);
      ctxScale.stroke();

      ctxBody.fillStyle = "#C3C3C3";
      ctxBody.beginPath();
      ctxBody.moveTo(Math.round((offset+i)/12)*scale, 0);
      ctxBody.lineTo(Math.round((offset+i)/12)*scale, cnvBody.height);
      ctxBody.stroke();
    }
  }
}
/**
 * [drawRangeNotes description]
 * @return {[type]} [description]
 */
function drawRangeNotes(){
  cnvBody  = document.getElementById("canvas_body_part2");
	cnvRange = document.getElementById("canvas_rangeNotes_part2");
	ctxRange = cnvRange.getContext("2d");

  //Calculate heght cnvRange
  let cnvRange_height = 0;
  synth.arrNotes.forEach(function(element, index) {
    if(-1 == element.indexOf("#")){
      cnvRange_height = cnvRange_height + 17;
    }
  });
  cnvRange_height = cnvRange_height + 11;

  cnvRange.height = cnvRange_height;
  cnvRange.style.height = cnvRange_height + "px";

  ctxRange.font = "normal 10px arial";

  cnvBody.height = cnvRange_height;
  cnvBody.style.height = cnvRange_height + "px";

  arrRevers = [...synth.arrNotes].reverse();

  let y1 = 0;
  arrRevers.forEach(function(element, index) {
    if(-1 == element.indexOf("#")){
      ctxRange.strokeStyle = "black";
      ctxRange.fillStyle   = "white";

      if(-1 != element.indexOf("D") || -1 != element.indexOf("G") || -1 != element.indexOf("A")){
        ctxRange.strokeRect(2, y1, 40, 20);
        ctxRange.fillRect(2, y1, 40, 20);

        y1 = y1 + 20;
      }else{
        ctxRange.strokeRect(2, y1, 40, 15);
        ctxRange.fillRect(2, y1, 40, 15);

        y1 = y1 + 15;
      }
    }
    if (-1 != element.indexOf("C") && -1 == element.indexOf("#")) {
      ctxRange.strokeStyle = "white";
      ctxRange.fillStyle   = "black";
      ctxRange.fillText(element, 25, y1-1);
    }
  });

  y1 = 0;
  arrRevers.forEach(function(element, index) {
    if(-1 == element.indexOf("#")){
      y1 = y1 + 15;
    }else{
      ctxRange.strokeStyle = "white";
      ctxRange.fillStyle   = "black";

      if(-1 != element.indexOf("F") || -1 != element.indexOf("C#") || -1 != element.indexOf("G#")){
        y1 = y1;
      }else{
        y1 = y1 - 5;
      }

      ctxRange.strokeRect(3, y1, 25, 10);
      ctxRange.fillRect(3, y1, 25, 10);

      y1 = y1 + 5;
    }
  });
}
/**
 * Draw notes Strip.
 */
function drawNotesStrip(){
  var ticksPerBeat  = synth.getTicksPerBeat();
  var maxTick = synth.getSongDurationTicks();

  cnvScale = document.getElementById("canvas_scale_part2");
  cnvScale.width = (Math.round((maxTick+ticksPerBeat)/12))*scale; //длинна в тиках / 12тиков на 1px
  cnvScale.style.width = cnvScale.width + "px";
  ctxScale = cnvScale.getContext("2d");
  ctxScale.clearRect(0, 0, cnvScale.width, cnvScale.height);

  cnvBody.width = cnvScale.width;
  cnvBody.style.width = cnvBody.width + "px";
  ctxBody = cnvBody.getContext("2d");
  ctxBody.clearRect(0, 0, cnvBody.width, cnvBody.height);

  let y1 = 0;
  arrRevers.forEach(function(element, index) {
    if(-1 == element.indexOf("#")){
      ctxBody.strokeStyle = "black";
      ctxBody.fillStyle   = "#F1F1F1";

      if(-1 != element.indexOf("D") || -1 != element.indexOf("G") || -1 != element.indexOf("A")){
        ctxBody.strokeRect(2, y1, cnvBody.width-5, 15);
        ctxBody.fillRect(2, y1, cnvBody.width-5, 15);

        if(-1 != element.indexOf("D")){
        	arrNotesTrack[index] = y1 + 5;
      	}
      	if(-1 != element.indexOf("G")){
        	arrNotesTrack[index] = y1 + 5;
      	}
      	if(-1 != element.indexOf("A")){
        	arrNotesTrack[index] = y1 + 5;
      	}

        y1 = y1 + 20;
      }else{
        ctxBody.strokeRect(2, y1, cnvBody.width-5, 15);
        ctxBody.fillRect(2, y1, cnvBody.width-5, 15);

        if(-1 != element.indexOf("C")){
        	arrNotesTrack[index] = y1 + 5;
      	}
        if(-1 != element.indexOf("E")){
        	arrNotesTrack[index] = y1;
        }
        if(-1 != element.indexOf("F")){
        	arrNotesTrack[index] = y1 + 5;
        }
        if(-1 != element.indexOf("B")){
        	arrNotesTrack[index] = y1;
        }

        y1 = y1 + 15;
      }
    }
  });
  //бемоли - диезы
  y1 = 0;
  arrRevers.forEach(function(element, index) {
    if(-1 == element.indexOf("#")){
      y1 = y1 + 15;
    }else{
      if(-1 != element.indexOf("F") || -1 != element.indexOf("C#") || -1 != element.indexOf("G#")){
        y1 = y1;
      }else{
        y1 = y1 - 5;
      }
      ctxBody.strokeStyle = "black";
      ctxBody.fillStyle   = "#E3E3E3";

      ctxBody.strokeRect(2, y1, cnvBody.width-5, 8);
      ctxBody.fillRect(2, y1, cnvBody.width-5, 8);

      if(-1 != element.indexOf("C")){
      	arrNotesTrack[index] = y1;
      }
      if(-1 != element.indexOf("D")){
      	arrNotesTrack[index] = y1;
      }
      if(-1 != element.indexOf("F")){
      	arrNotesTrack[index] = y1;
      }
      if(-1 != element.indexOf("G")){
      	arrNotesTrack[index] = y1;
      }
      if(-1 != element.indexOf("A")){
      	arrNotesTrack[index] = y1;
      }

      y1 = y1 + 5;
    }
  });
  // testNotesStrip();
}

/**
 * For debug arrNotesTrack.
 * @return {[type]} [description]
 */
function testNotesStrip(){
  ctxBody.font = "normal 10px arial";
  ctxBody.strokeStyle = "white";

  arrNotesTrack.forEach(function(element, index) {
  	if (element) {
  		ctxBody.fillStyle   = "#374CB6";
  		ctxBody.strokeRect(1, element, 30, 9);
	    ctxBody.fillRect(1, element, 30, 9);

	    ctxBody.fillStyle   = "white";
	    ctxBody.fillText(arrRevers[index], 3, element + 9);
  	}
  });
}
/**
 * [drawVexflow description]
 * @param  {[type]} clef treble or bass.
 * @return {[type]}      [description]
 */
function drawVexflow(clef){
  document.getElementById("stave").innerHTML = "";

  var vf = new Vex.Flow.Factory({renderer: {elementId: 'stave', width: arrMeasures.length*200, height: 90}});
  var score = vf.EasyScore();

  vf.context.scale(.6,.6);
  vf.context.font = "bold 16px arial";

  // score.set({ time: "4/4" });

  var x = 0;
  var y = 20;
  function makeSystem(width){
    var system = vf.System({ x: x, y: y, width: width, spaceBetweenStaves: 10 });
    x += width;
    return system;
  }
  function searchMeasure(numMeasure){
    let search = false;
    arrVexFlow.forEach(function(item, idx){
      if(item[0] == numMeasure){
        search = true;
      }
    });
    return search;
  }
  let mDuration = "";
  let prevDuration = "";
  let widthClef = 100;

  let system = makeSystem(widthClef);
  system.addStave({
    voices: []
  }).addClef(clef).addTimeSignature(arrMeasures[0].duration);
  prevDuration = arrMeasures[0].duration;

  for(let i=0; i < arrMeasures.length; i++){
    mDuration = (arrMeasures[i].duration && mDuration !== arrMeasures[i].duration) ?arrMeasures[i].duration :"";
    if(true == searchMeasure(arrMeasures[i].measure+1) && "" !== mDuration && prevDuration !== mDuration){
      let system = makeSystem(widthClef);
      system.addStave({
        voices: []
      }).addClef(clef).addTimeSignature(mDuration);
      prevDuration = mDuration;
    }
    for(let j=0; j < arrVexFlow.length; j++){
      if(i==arrVexFlow[j][0]){
        let notes = arrVexFlow[j][1].split(",");
        let system = makeSystem(notes.length * 60);
        system.addStave({
          voices: [score.voice(score.notes(arrVexFlow[j][1], {clef: clef})).setStrict(false)]
        });
        let posNumMeasure = system.factory.stave.x;
        vf.context.fillText(arrMeasures[i].measure+1, posNumMeasure, 50);
      }
    }
  }
  vf.draw();
}
/**
 * [startTimer description]
 *
 * @return [type]   [description]
 */
function startTimer(){
  let subwin_part2 = document.getElementById("subwin_part2");
  let ptrTime = document.getElementById("ptrTime");

  let ticksPerBeat = synth.getTicksPerBeat();
  let maxTick = synth.getSongDurationTicks();

  let lengthBeat = ticksPerBeat;
  let secPerBeat = 0;
  let tempoBPM = synth.getTempoBPM();
  let measure = 0;

  let shift_to_right = -4;
  let current_tick = 0;

  let arr = [];

  for(let i=0; i < arrTimeSignature.length-1; i++){
    let tick = arrTimeSignature[i].tick;
    let tickNext = (undefined !== arrTimeSignature[i+1]) ?arrTimeSignature[i+1].tick :undefined;
    let tickPrev = (undefined !== arrTimeSignature[i-1]) ?arrTimeSignature[i-1].tick :undefined;

    if(81 == arrTimeSignature[i].subtype){
      tempoBPM = arrTimeSignature[i].tempoBPM;
      secPerBeat = Math.round((lengthBeat*60/ticksPerBeat/tempoBPM)*1000);
    }
    if (undefined !== tickPrev && undefined !== tickNext){
      if(81 == arrTimeSignature[i].subtype && 81 == arrTimeSignature[i+1].subtype && tick !== tickPrev){
        arr.push({tick:tick, secPerBeat:secPerBeat,lengthBeat:lengthBeat,measure:measure+"+",tempoBPM:tempoBPM});
        continue;
      }
      if(81 == arrTimeSignature[i].subtype && 88 == arrTimeSignature[i+1].subtype && tick < tickNext && tick !== tickPrev){
        arr.push({tick:tick, secPerBeat:secPerBeat,lengthBeat:lengthBeat,measure:measure+"+",tempoBPM:tempoBPM});
        continue;
      }
    }
    if(88 == arrTimeSignature[i].subtype){
      if (2 == arrTimeSignature[i].timeSignature[1]) lengthBeat = ticksPerBeat;
      if (3 == arrTimeSignature[i].timeSignature[1]) lengthBeat = ticksPerBeat/2;
      if (4 == arrTimeSignature[i].timeSignature[1]) lengthBeat = ticksPerBeat/4;
      if (5 == arrTimeSignature[i].timeSignature[1]) lengthBeat = ticksPerBeat/8;

      if(81 == arrTimeSignature[i+1].subtype && tick == tickNext){
        measure = arrTimeSignature[i].measure;
        tempoBPM = arrTimeSignature[i+1].tempoBPM;
        secPerBeat = Math.round((lengthBeat*60/ticksPerBeat/tempoBPM)*1000);
        arr.push({tick:tick, secPerBeat:secPerBeat,lengthBeat:lengthBeat,measure:measure,tempoBPM:tempoBPM});
        continue;
      }else{
        secPerBeat = Math.round((lengthBeat*60/ticksPerBeat/tempoBPM)*1000);
        measure = arrTimeSignature[i].measure;
        arr.push({tick:tick, secPerBeat:secPerBeat,lengthBeat:lengthBeat,measure:measure,tempoBPM:tempoBPM});
      }
    }
  }

  let arrNew = checkMeasuresPlus(arr);

  let i=0;
  let j=0;
  let timer1Id;
  let timer2Id;

  clearTimeout(timer1Id);
  timer1Id = setTimeout(function request() {
    if(false == synth.playing){
      clearTimeout(timer1Id);
      clearInterval(timer2Id);
      document.getElementById("scale").setAttribute("style","pointer-events:auto;opacity:1;background-color:transparent;color:black;cursor:pointer;position:absolute;display:flex;justify-content: space-evenly;align-items: center;height:13px;width:40px;overflow: hidden;font-weight:bold;font-size:14px;top:-15px;left:210px;background:#C3C3C3;");
      return;
    }
    if(arrNew[i]) {
      let box = ptrTime.getBoundingClientRect();
      if(1140 < box.left) subwin_part2.scrollLeft += 680;

      shift_to_right += (arrNew[i].lengthBeat/12)*scale;
      ptrTime.setAttribute("style","position:absolute;top:0;left:-2px;width:7px;height:1286px;margin-top: 20px;z-index:1;background:transparent;left:"+shift_to_right+"px;");

      current_tick += arrNew[i].lengthBeat;
    }
    if(current_tick > maxTick){
      //Let's go back to the beginning and play.
      i=0;
      j=0;
      current_tick = 0;
      if(true == synth.playing){
        shift_to_right = -2;
        ptrTime.setAttribute("style","position:absolute;top:0;left:-2px;width:7px;height:1286px;margin-top: 20px;z-index:1;background:transparent;left:"+shift_to_right+"px;");
        subwin_part2.scrollLeft = 0;
      }
    }
    //we start a new measure.
    if(0==j){
      clearInterval(timer2Id);
      if(arrNew[i]) timer2Id = setInterval(request, arrNew[i].secPerBeat);
    }
    //next beat of the measure.
    j++;
    //when the beats in a measure end.
    if(arrNew[i] && j==arrNew[i].countBeats){
      j=0;
      i++;
    }
  });
}
/**
 * [checkMeasuresPlus description]
 * Смена темпа должна происходить в долях такта. (part1)
 *
 * @param  {[type]} arr [description]
 */
function checkMeasuresPlus(arr){
  //Mark unnecessary measures. remove the repeat tempoBPM.
  for(let i=0; i < arr.length-1; i++){
    if("string" === typeof arr[i].measure  && -1 !== arr[i].measure.indexOf("+")){
      if(arr[i-1] && arr[i-1].tempoBPM == arr[i].tempoBPM){
        arr[i].measure = arr[i].measure.substring(0, arr[i].measure.length-1) + "-";
      }
    }
  }
  //Remove measures("-").
  let spool = arr.filter(function(item) {
    if ("string" === typeof item.measure && "-" == item.measure.at(-1)) {
      return false;
    }else{
      return true;
    }
  });
  //adjusting the position items measures+
  for(let i=0; i < spool.length-1; i++){
    if("string" === typeof spool[i].measure && -1 !== spool[i].measure.indexOf("+")){
      let val = spool[i].tick%12;
      spool[i].tick = spool[i].tick - val;
    }
  }
  //part1...
  for(let i=0; i < spool.length-1; i++){
    if("string" === typeof spool[i].measure && -1 !== spool[i].measure.indexOf("+")){
      let delta = (spool[i].tick-spool[i-1].tick)%spool[i].lengthBeat;
      if(0 !== delta){//if they do not fall into the grid nodes.
        let pointL = spool[i].tick -delta;
        let pointR = pointL + spool[i].lengthBeat;
        if((spool[i].tick-pointL) <= (pointR-spool[i].tick)){
          spool[i].tick = pointL;
        }else{
          spool[i].tick = pointR;
        }
      }
    }
  }
  //Mark unnecessary measures. remove previous tempo BPM with repeat tick.
  let mainMeasure = {};
  for(let i=0; i < spool.length-1; i++){
    if("number" === typeof spool[i].measure) mainMeasure = spool[i];

    if("string" === typeof spool[i].measure  && -1 !== spool[i].measure.indexOf("+")){
      if(spool[i+1] && spool[i+1].tick == spool[i].tick){
        spool[i].measure = spool[i].measure.substring(0, spool[i].measure.length-1) + "-";
      }
      if(mainMeasure.tick == spool[i].tick){
        spool[i].measure = spool[i].measure.substring(0, spool[i].measure.length-1) + "-";
        mainMeasure.tempoBPM = spool[i].tempoBPM;
      }
    }
  }
  //Remove measures("-") previous measure+ with repeat tick.
  let spoolNew = spool.filter(function(item) {
    if ("string" === typeof item.measure && "-" == item.measure.at(-1)) {
      return false;
    }else{
      return true;
    }
  });
  //recalculate countBeats.
  let maxTick = synth.getSongDurationTicks();
  for(let i=0; i < spoolNew.length-1; i++){
    let deltaTicks = (spoolNew[i+1]) ?spoolNew[i+1].tick-spoolNew[i].tick :maxTick-spoolNew[i].tick;
    let countBeats = deltaTicks/spoolNew[i].lengthBeat;
    spoolNew[i].countBeats = countBeats;
  }
  //Draw subMeasures.
  ctxScale.textAlign = "center";
  ctxScale.fillStyle = "red";
  for(let i=0; i < spoolNew.length-1; i++){
    if("string" === typeof spoolNew[i].measure  && -1 !== spoolNew[i].measure.indexOf("+")){
      ctxScale.fillText("o", (spoolNew[i].tick/12)*scale, 17);
    }
  }

  return spoolNew;
}
/**
 * [ptrTime description]
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
function ptrTimeDragDrope(e){
  var ptrTime  = document.getElementById("ptrTime");
  ptrTime.style.cursor = "grab";

  var coords_ptrTime  = getCoords(ptrTime);
  var coords_cnvScale = getCoords(cnvScale);
  var shiftX = e.pageX - coords_ptrTime.left;

  var cnvScaleMin = coords_cnvScale.left + shiftX;
  var cnvScaleMax = coords_cnvScale.left + cnvScale.offsetWidth - shiftX;

  function moveAt(e) {
    var left = e.pageX - coords_cnvScale.left - shiftX ;
    if(e.pageX < cnvScaleMin) left = 0;
    if(e.pageX > cnvScaleMax) left = cnvScale.offsetWidth - ptrTime.offsetWidth;
    ptrTime.style.left = left + "px";
  }
  document.onmousemove = function(e) {
    moveAt(e);
  }
  document.onmouseup = function(e) {
    document.onmousemove = null;
    ptrTime.style.cursor = "pointer";
  }
}
/**
 * [getCoords description]
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
function getCoords(element) {
  var box = element.getBoundingClientRect();
  return {
    left: box.left,
    top: box.top
  }
}
function drawHeaderInfo(){
  document.getElementById("tempoBPM").value = synth.getTempoBPM();
	document.getElementById("song_midi").value = synth.getCopyright();
	document.getElementById("tracks_count").value = synth.getTracksCount();
	document.getElementById("midi_format").value = synth.getFormatMidi();
	document.getElementById("ticks_per_beat").value = synth.getTicksPerBeat();
}
function drawTrackInfo(){
  var trackCount = synth.getTracksCount();
  var arrTracksInfo = synth.getTracksInfo();
  var foundCh9 = false;
  var candtCh9 = null;

  arrTracksInfo.forEach(function(track, index){
    if (0 == track.numtrk){
      document.getElementById("song_midi").value = track.nametrk;
    }else{
      //Track name.
      let trackName = document.getElementById("part1_" + track.numtrk + "rec");
      if(undefined !== track.nametrk) trackName.value = track.nametrk;
      //Channel.
      let ch = document.getElementById("part1_ch_numtrk_"+track.numtrk);
      if(undefined !== track.ch && undefined !== ch) {
        ch.innerHTML = "Channel: "+Number(track.ch+1);
      }
      //Instrument (prog).
      let instrument = document.getElementById("part1_" + track.numtrk + "instrument");
      if(9==track.ch){
        foundCh9 = true;
        if(undefined !== track.prog){
          instrument.innerHTML = "Drums: "+synth.getTimbreName(1, track.prog)+" (prog:" + track.prog + ")";
        }else{
          instrument.innerHTML = "Drums: (Standard Drum Kit)";
        }
      }else{
        if(undefined == track.prog && undefined == track.ch) candtCh9 = track.numtrk;
        if(undefined !== track.prog) instrument.innerHTML = synth.getTimbreName(0, track.prog) + " (prog:" + track.prog + ")";
      }
    }
  });
  //костыль
  if(false == foundCh9 && candtCh9){
    let instrument = document.getElementById("part1_" + candtCh9 + "instrument");
    instrument.innerHTML = "Drums: (Standard Drum Kit)";
    let ch = document.getElementById("part1_ch_numtrk_"+candtCh9);
    ch.innerHTML = "Channel: 10";
  }

  //setChannelsPlay
  arrChannelsSound = [];
  selPart1ItemNum = "";
  let channels = document.getElementsByClassName("lbl_ch");
  Array.from(channels).forEach(function(item, index){
    let textCh = item.textContent.split(": ");
    if (textCh[1]){
      let ch = Number(textCh[1]-1);
      arrChannelsSound.push(ch);
    }
  });
  synth.setChannelsPlay(arrChannelsSound);
}
/**
 * Select Part1 Item
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function selPart1Item(id){
  var stave    = document.getElementById("stave");
  var items    = document.getElementById("win_part1").childNodes;
  var items_id = id.split("_");
  var instrument = document.getElementById("part1_" + items_id[1] + "instrument");

  if (click_speaker || click_staves){
    click_speaker = false;
    click_staves  = false;
    return;
  }
  items.forEach(function(item, index){
    if (id == item.id) {
      if ("rgb(128, 128, 128)" == item.style.background){
        item.style.background = "#C1C1C1";
        selPart1ItemNum = "";
      }else{
        item.style.background = "#808080";
        selPart1ItemNum = items_id[1];
      }
    }else{
      item.style.background = "#C1C1C1";
    }
  });
  instrument = instrument.innerHTML.toLowerCase();
  if(-1 !== instrument.indexOf("bass") || -1 !== instrument.indexOf("orchestral harp")){
    clef = "bass";
  }else{
    clef = "treble";
  }
  drawNotesSong(scale);
  if("block" == stave.style.display){
    drawVexflow(clef);
  }
}
/**
 * [speaker_on_off description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function speaker_on_off(id){
  let items1  = id.split("_");
  let lbl_txt = document.getElementById("part1_ch_numtrk_"+items1[1]).innerHTML;   //items1[1]-1;
  let items2 = lbl_txt.split(": ");
  let ch = items2[1]-1;

  if ("speakerOn" == items1[0] || "speaker" == items1[0]){
    document.getElementById("speaker_" + items1[1]).style.display = "none";
    document.getElementById("speakerOn_" + items1[1]).style.display = "none";
    document.getElementById("speakerOff_" + items1[1]).style.display = "block";
    //delete element from array
    let chIndex = arrChannelsSound.indexOf(ch);
    if (chIndex !== -1) {
      arrChannelsSound.splice(chIndex, 1);
    }
  }else{
    document.getElementById("speakerOff_" + items1[1]).style.display = "none";
    document.getElementById("speaker_" + items1[1]).style.display = "block";
    //insert element to array
    if (-1 != ch) {
      arrChannelsSound.push(ch);
    }
  }

  if(true == synth.playing){
    synth.stopMIDI();
    synth.setChannelsPlay(arrChannelsSound);
    synth.playMIDI();
  }else{
    synth.setChannelsPlay(arrChannelsSound);
  }

  click_speaker = true;
  console.log("arrChannelsSound", arrChannelsSound);
}
/**
 * [drawNotesSong description]
 *
 * @param  {[type]} scale [description]
 */
function drawNotesSong(scale){
  var tracksCount = synth.getTracksCount();
  var srcMidi     = synth.getMidiSrc();
  var midiFile    = new MIDIFile(srcMidi);

  //Build arrTracksEvents.
  if(false == afterChecking){
    for(let i=0; i <= tracksCount; i++){
      arrTracksEvents[i] = midiFile.getTrackEvents(i);
    }
  }

  for(let i=0; i <= tracksCount; i++){
    let offset = 0;
    let itemsPrev = [];
    let itemPrev  = {};

    ctxBody.fillStyle = "#444444";

    arrTracksEvents[i].forEach(function(item, index){

      offset += item.delta;

      if (9 != item.channel && 8 == item.type && 9 == item.subtype) {
        itemsPrev[item.param1] = item;
        itemsPrev[item.param1].offset = (itemsPrev[item.param1].offset) ?itemsPrev[item.param1].offset :offset;
      }
      if (9 != item.channel && 8 == item.type && 8 == item.subtype) {
        let prevOffset  = itemsPrev[item.param1].offset;
        let deltaOffset = offset - prevOffset;

        drawNote(item.channel, item.param1, Math.round(prevOffset/12)*scale, Math.round(deltaOffset/12)*scale);
      }
      if (9 == item.channel && 8 == item.type && 9 == item.subtype) {
        drawNote(item.channel, item.param1, Math.round(offset/12)*scale, Math.round(item.delta/12)*scale);
      }
    });
  }
  if ("" !== selPart1ItemNum) {
    let offset = 0;
    let itemsPrev = [];
    let itemPrev  = {};
    let acordOffset = 0;

    arrMusicalPart = [];
    let keys   = [];

    ctxBody.fillStyle = "#0073AA";

    arrTracksEvents[selPart1ItemNum].forEach(function(item, index){

      offset += item.delta;

      if (9 != item.channel && 8 == item.type && 9 == item.subtype) {
        itemsPrev[item.param1] = item;
        itemsPrev[item.param1].offset = (itemsPrev[item.param1].offset) ?itemsPrev[item.param1].offset :offset;
      }
      if (9 != item.channel && 8 == item.type && 8 == item.subtype) {
        let prevOffset  = itemsPrev[item.param1].offset;
        let deltaOffset = offset - prevOffset;

        if(acordOffset !== prevOffset){
          if(0 !== keys.length) arrMusicalPart.push({ keys: keys });
          keys = [];
        }
        keys.push(synth.arrNotes[item.param1]+":"+deltaOffset+":"+prevOffset);
        acordOffset = prevOffset;

        drawNote(item.channel, item.param1, Math.round(prevOffset/12)*scale, Math.round(deltaOffset/12)*scale);
      }
      if (9 == item.channel && 8 == item.type && 9 == item.subtype) {
        drawNote(item.channel, item.param1, Math.round(offset/12)*scale, Math.round(item.delta/12)*scale);
      }
    });
    if(0 !== keys.length) {
      arrMusicalPart.push({ keys: keys });
      keys = [];
    }
    //Преобразование массива arrMusicalPart под формат VexFlow.
    arrMusicalPart.forEach(function(item, idx){
      let prm1 = [];
      let prm2 = "";
      let prm3 = 0;
      let prm4 = 0;
      Array.from(item.keys).forEach(function(sub_item, sub_idx){
        let arr = sub_item.split(":");
        let result = durationNote(arr[1],sub_item);

        prm1.push(arr[0]);
        prm2 = result[0];
        prm3 = Number(arr[2]);
        prm4 = Number(arr[1]);
        if("" !== result[1]){
          if("w" === result[0]) prm4 = 4*synth.getTicksPerBeat();

          arrMusicalPart[idx].keys[sub_idx] = result[1];
          if(arrMusicalPart[idx+1]){
            let chunk = result[1];
            chunk = chunk.split(":");
            let nextNote = arrMusicalPart[idx+1].keys[0];
            nextNote = nextNote.split(":");

            chunk[2] = nextNote[2];
            chunk = chunk.join(':');
            arrMusicalPart[idx+1].keys.push(chunk);
          }
        }
      });
      arrMusicalPart[idx] = {keys:prm1, duration:prm2, tick:prm3, delta:prm4};
    });
    formatMusicalPart();
  }
}
/**
 * Draw Note rect.
 *
 * @param  {[type]} ch     [description]
 * @param  {[type]} note   [description]
 * @param  {[type]} offset [description]
 * @param  {[type]} delta  [description]
 */
function drawNote(ch, note, offset, delta){
  let noteNum = Math.abs(note-127);
  let posY    = arrNotesTrack[noteNum];

  ctxBody.lineWidth = .5;

  if (9 == ch){
    ctxBody.beginPath();
    ctxBody.arc(offset, posY+ 4, 3.5, 0, 2 * Math.PI);
    ctxBody.fill();
  }else{
    if(delta < 2)delta = 2;
    ctxBody.fillRect(offset+.5, posY+.5, delta, 7);
  }
}
/**
 * [durationNote description]
 * @param  {integer} lengthNote [description]
 * @return {array}   duration   [description]
 */
function durationNote(lengthNote,sub_item){
  let ticksPerBeat = synth.getTicksPerBeat();
  let durationNote;
  let deltaL = 0;
  let deltaR = 0;
  let chunk  = "";

  //подгонка lengthNote к длине бита.
  if(ticksPerBeat*4 < lengthNote){
    durationNote = "w";
    let arr = sub_item.split(":");
    arr[1] = arr[1]/2;
    chunk = arr.join(':');
  }else if(ticksPerBeat*4 == lengthNote){
    durationNote = "w";
  }else if(ticksPerBeat*2 <= lengthNote && ticksPerBeat*4 > lengthNote){
    // 1/2 -h
    deltaL = lengthNote - ticksPerBeat*2;
    deltaR = ticksPerBeat*4 - lengthNote;
    if(0 == deltaL){
      durationNote = "h";
    }else if(ticksPerBeat == deltaL){
      durationNote = "h.";
    }else if(deltaL < deltaR){
      durationNote = "h";
    }else{
      durationNote = "w";
    }
  }else if(ticksPerBeat <= lengthNote && ticksPerBeat*2 > lengthNote){
    // 1/4 -q
    deltaL = lengthNote - ticksPerBeat;
    deltaR = ticksPerBeat*2 - lengthNote;
    if(0 == deltaL){
      durationNote = "q";
    }else if(ticksPerBeat/2 == deltaL){
      durationNote = "q.";
    }else if(deltaL < deltaR){
      durationNote = "q";
    }else{
      durationNote = "h";
    }
  } else if(ticksPerBeat/2 <= lengthNote && ticksPerBeat > lengthNote){
    // 1/8 -8
    deltaL = lengthNote - ticksPerBeat/2;
    deltaR = ticksPerBeat - lengthNote;
    if(0 == deltaL){
      durationNote = "8";
    }else if(ticksPerBeat/4 == deltaL){
      durationNote = "8.";
    }else if(deltaL < deltaR){
      durationNote = "8";
    }else{
      durationNote = "q";
    }
  }else if(ticksPerBeat/4 <= lengthNote && ticksPerBeat/2 > lengthNote){
    // 1/16 -16
    deltaL = lengthNote - ticksPerBeat/4;
    deltaR = ticksPerBeat/2 - lengthNote;
    if(0 == deltaL){
      durationNote = "16";
    }else if(ticksPerBeat/8 == deltaL){
      durationNote = "16.";
    }else if(deltaL < deltaR){
      durationNote = "16";
    }else{
      durationNote = "8";
    }
  }else if(ticksPerBeat/8 <= lengthNote && ticksPerBeat/4 > lengthNote){
    // 1/32 -32
    deltaL = lengthNote - ticksPerBeat/8;
    deltaR = ticksPerBeat/4 - lengthNote;
    if(0 == deltaL){
      durationNote = "32";
    }else if(ticksPerBeat/16 == deltaL){
      durationNote = "32.";
    }else if(deltaL < deltaR){
      durationNote = "32";
    }else{
      durationNote = "16";
    }
  }else if(ticksPerBeat/8 > lengthNote) durationNote = "32";

  if(undefined == durationNote) console.log("Invalid length Note:",lengthNote," note:",sub_item);

  return [durationNote,chunk];
}
/**
 * Собираем ноты текущего такта.
 * Вставляем при небходимости rests, Multi Measure Rests
 * При наложении нот - формируем аккорд.
 *
 * @return {array} [description]
 */
function formatMusicalPart(){
  let ticksPerBeat = synth.getTicksPerBeat();
  let mRestBefore = 0; //MultiMeasureRest
  let mRestAfter  = -1; //MultiMeasureRest
  let minMusicalPartTick = Number(arrMusicalPart[0].tick);
  let maxMusicalPartTick = Number(arrMusicalPart.at(-1).tick) + Number(arrMusicalPart.at(-1).delta);

  arrVexFlow = [];

  let str = "";
  arrMusicalPart.forEach(function(item, index){
    if(1 < item.keys.length){
      str = "(" + item.keys.toString().replaceAll(",", " ") + ")";
    }else{
      str = item.keys.toString();
    }
    item.keys = str;
  });

  for(let i=0; i < arrMeasures.length; i++){
    let chunk = "";
    let notes = [];
    let durationMeasure = (arrMeasures[i].duration) ? arrMeasures[i].duration : "";
    let numMeasure = arrMeasures[i].measure;

    if(arrMeasures[i+1] && arrMeasures[i+1].tick <= minMusicalPartTick) mRestBefore++;
    if(arrMeasures[i].tick > maxMusicalPartTick) mRestAfter++;

    for(let j=0; j < arrMusicalPart.length; j++){
      let noteTick = Number(arrMusicalPart[j].tick);
      let noteDelta = Number(arrMusicalPart[j].delta);

      if(noteTick >= Number(arrMeasures[i].tick) && arrMeasures[i+1].tick && noteTick + noteDelta <= Number(arrMeasures[i+1].tick)){
        notes.push(arrMusicalPart[j].keys + "/" + arrMusicalPart[j].duration);
      }
      if(noteTick > Number(arrMeasures[i].tick) &&
        arrMeasures[i+1].tick && noteTick < Number(arrMeasures[i+1].tick) &&
        noteTick + noteDelta > Number(arrMeasures[i+1].tick)){
        //режем на два куска ноту.
        let leftChunk  = arrMeasures[i+1].tick - noteTick;
        let rightChunk = noteDelta - leftChunk;
        let leftChildNote = childNote(arrMeasures[i].measure, arrMusicalPart[j].keys, arrMusicalPart[j].duration, noteDelta,leftChunk);
        let rightChildNote = childNote(arrMeasures[i].measure, arrMusicalPart[j].keys, arrMusicalPart[j].duration, noteDelta,rightChunk);
        //вставляем оба куска ноты в музыкальную партию.
        if(0 !== Object.keys(leftChildNote).length){
          leftChildNote.tick = arrMusicalPart[j].tick;
          arrMusicalPart[j] = leftChildNote;
          notes.push(arrMusicalPart[j].keys + "/" + arrMusicalPart[j].duration);
          if(arrMusicalPart[j+1] && Number(arrMusicalPart[j].tick)+Number(leftChildNote.delta) == Number(arrMusicalPart[j+1].tick)){
            //формируем акорд (note1 note2)/duration
            arrMusicalPart[j+1].keys = "("+ arrMusicalPart[j+1].keys + " " +  arrMusicalPart[j].keys + ")";
            if(arrMeasures[i+1].tick+rightChildNote.delta == arrMusicalPart[j+1].tick){
              //вставляем ноту в музыкальную партию.
              //arrMusicalPart.length = arrMusicalPart.length + 1; ???
              rightChildNote.tick = arrMeasures[i+1].tick;
              arrMusicalPart.splice(i, 0, rightChildNote);
            }
          }
        }
      }
    }
    if(0 !== notes.length) arrVexFlow.push([numMeasure, notes.toString()]);
  }
  console.log("mRestBefore",mRestBefore,"mRestAfter",mRestAfter);

  console.log("Format: arrMeasures",arrMeasures);
  console.log("Format: arrMusicalPart",arrMusicalPart);
  console.log("Format: arrVexFlow",arrVexFlow);
}
/**
 * [childNote description]
 * @param  {[type]} parentNoteName     [description]
 * @param  {[type]} parentLengthNote   [description]
 * @param  {[type]} parentNoteDuration [description]
 * @param  {[type]} childLengthNote    [description]
 * @return {[type]}                    [description]
 */
function childNote(numMeasure, parentNoteName, parentNoteDuration, parentLengthNote, childLengthNote){
  let ticksPerBeat = synth.getTicksPerBeat();
  let childNote = {};

  if(2 === Math.round(parentLengthNote/childLengthNote)){
    let lengthNote = Math.round(parentLengthNote/2);
    if("w" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"h","tick":0,"delta":lengthNote};
    if("h" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"q","tick":0,"delta":lengthNote};
    if("q" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"8","tick":0,"delta":lengthNote};
    if("8" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"16","tick":0,"delta":lengthNote};
    if("16" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"32","tick":0,"delta":lengthNote};
  }else if(3 === Math.round(parentLengthNote/childLengthNote)){
    let lengthNote = Math.round(parentLengthNote/2);
    if("w" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"h.","tick":0,"delta":lengthNote};
    if("h" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"q.","tick":0,"delta":lengthNote};
    if("q" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"8.","tick":0,"delta":lengthNote};
    if("8" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"16.","tick":0,"delta":lengthNote};
    if("16" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"32.","tick":0,"delta":lengthNote};
  }else if(4 === Math.round(parentLengthNote/childLengthNote)){
    let lengthNote = Math.round(parentLengthNote/4);
    if("w" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"q","tick":0,"delta":lengthNote};
    if("h" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"8","tick":0,"delta":lengthNote};
    if("q" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"16","tick":0,"delta":lengthNote};
    if("8" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"32","tick":0,"delta":lengthNote};
    if("16" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"64","tick":0,"delta":lengthNote};
  }else if(5 === Math.round(parentLengthNote/childLengthNote)){
    let lengthNote = Math.round(parentLengthNote/4);
    if("w" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"q.","tick":0,"delta":lengthNote};
    if("h" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"8.","tick":0,"delta":lengthNote};
    if("q" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"16.","tick":0,"delta":lengthNote};
    if("8" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"32.","tick":0,"delta":lengthNote};
    if("16" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"64.","tick":0,"delta":lengthNote};
  }else if(8 === Math.round(parentLengthNote/childLengthNote)){
    let lengthNote = Math.round(parentLengthNote/8);
    if("w" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"8","tick":0,"delta":lengthNote};
    if("h" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"16","tick":0,"delta":lengthNote};
    if("q" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"32","tick":0,"delta":lengthNote};
    if("8" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"64","tick":0,"delta":lengthNote};
    if("16" === parentNoteDuration) childNote = {"keys":parentNoteName,"duration":"128","tick":0,"delta":lengthNote};
  }else{
    console.log("childNote error: "," numMeasure:",numMeasure," parentNoteName:",parentNoteName," parentNoteDuration:",parentNoteDuration,"parentLengthNote:",parentLengthNote," childLengthNote:", childLengthNote);
  }
  return childNote;
}
/**
 * [btnScale description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function btnScale(id){
  let div_scale = document.getElementById(id);

  if("scale1+" == id){scale=scale*2;if(scale > 4) scale = 4;}
  if("scale10" == id){scale=1;}
  if("scale1-" == id){scale=scale/2;if(scale < .25) scale = .25;}

  console.log("scale:",scale);

  div_scale.style.background="white";
  setTimeout( () => {
    div_scale.style.background="#C3C3C3";
  }, 250);
  div_scale.style.background="white";

  drawNotesStrip();
  drawTimeScale(scale);
  drawNotesSong(scale);
}
/**
 * [dataCheck description]
 */
function dataCheck(){;
  var div  = document.getElementById("stave");

  var lbl1 = document.createElement("label");

  var div_lbl1 = document.createElement("div");

  var ticksPerBeat  = synth.getTicksPerBeat();
  var maxTick = synth.getSongDurationTicks();
  var lengthMeasure = 0;
  var tracksCount = synth.getTracksCount();

  div.innerHTML = "";

  lbl1.setAttribute("style", "display:block;font-size:12px;width:100%;height:16px;cursor:pointer;");
  lbl1.id = "check_data_3";
  lbl1.innerHTML = "Checking array data: <b>arrTracksEvents</b>";
  div.appendChild(lbl1);

  div_lbl1.setAttribute("style", "display:flex;flex-direction:column;font-size:12px;width:100%;cursor:pointer;");
  div_lbl1.id = "div_check_data_3";
  div_lbl1.innerHTML = "Result of checking ...";

  //Checking array arrTracksEvents:
  let measure;
  let duration;
  let numerator;
  let denominator;
  let currMeasureTick;
  let nextMeasureTick;
  let leftPart;
  let rightPart;
  let newPosition;
  let eventOffset;
  let note;
  let ch;

  for(let i = 0; i < arrMeasures.length; i++){
    measure = arrMeasures[i].measure;
    if(arrMeasures[i].duration){
      duration = arrMeasures[i].duration.split("/");
      numerator = duration[0];
      denominator = duration[1];
    }
    currMeasureTick = arrMeasures[i].tick;
    nextMeasureTick = arrMeasures[i+1] ?arrMeasures[i+1].tick : maxTick;
    for(let numTrack = 0; numTrack <= tracksCount; numTrack++){
      arrTracksEvents[numTrack].forEach(function(trackEvent, numEvent){
        if (9 != trackEvent.channel && 8 == trackEvent.type && 9 == trackEvent.subtype) {
          note = synth.arrNotes[trackEvent.param1];
          eventOffset = trackEvent.offset;
          ch = trackEvent.channel;
          newPosition = 0;
          if(currMeasureTick < eventOffset && eventOffset < nextMeasureTick){
            if(4 == denominator){
              if(0 !== eventOffset%(ticksPerBeat/2)){
                for(let deltaTick=0; deltaTick < nextMeasureTick-currMeasureTick; deltaTick += ticksPerBeat/2){
                  if(currMeasureTick + deltaTick > eventOffset){
                    leftPart  = currMeasureTick + deltaTick-ticksPerBeat/2;
                    rightPart = leftPart + ticksPerBeat/2;
                    if(eventOffset - leftPart > rightPart - eventOffset){
                      newPosition = rightPart;
                    }else{
                      newPosition = leftPart;
                    }
                    break;
                  }
                }
              }
            }else if(8 == denominator){
              if(0 !== eventOffset%(ticksPerBeat/4)){
                for(let deltaTick=0; deltaTick < nextMeasureTick-currMeasureTick; deltaTick += ticksPerBeat/4){
                  if(currMeasureTick + deltaTick > eventOffset){
                    leftPart  = currMeasureTick + deltaTick-ticksPerBeat/4;
                    rightPart = leftPart + ticksPerBeat/4;
                    if(eventOffset - leftPart > rightPart - eventOffset){
                      newPosition = rightPart;
                    }else{
                      newPosition = leftPart;
                    }
                    break;
                  }
                }
                console.log("note:",note,"measure: ",Number(measure)," left:",leftPart," offset:",eventOffset," rightPart:",rightPart);
              }
            }else if(16 == denominator){
              if(0 !== eventOffset%(ticksPerBeat/8)){
                for(let deltaTick=0; deltaTick < nextMeasureTick-currMeasureTick; deltaTick += ticksPerBeat/8){
                  if(currMeasureTick + deltaTick > eventOffset){
                    leftPart  = currMeasureTick + deltaTick-ticksPerBeat/8;
                    rightPart = leftPart + ticksPerBeat/8;
                    if(eventOffset - leftPart > rightPart - eventOffset){
                      newPosition = rightPart;
                    }else{
                      newPosition = leftPart;
                    }
                    break;
                  }
                }
              }
            }
            if (0 !== newPosition){
              let msg = document.createElement("label");

              msg.setAttribute("style", "display:block;font-size:12px;width:100%;height:16px;cursor:pointer;");
              msg.innerHTML = "Update note: "+note+", measure:"+Number(measure+1)+", duration:"+duration.join("/")+", channel: "+Number(ch+1)+", old position:"+trackEvent.offset+" ticks, new position:"+newPosition+" ticks";
              div_lbl1.appendChild(msg);
              // trackEvent.delta = trackEvent.delta + (trackEvent.offset - newPosition);
              trackEvent.offset = newPosition;
            }
          }
        }
      });
    }
  }
  div.appendChild(div_lbl1);
  console.log("arrTracksEvents",arrTracksEvents);

  //redraw Sequencer.
  afterChecking = true;
  drawNotesStrip();
  drawTimeScale(1);
  drawNotesSong(1);

  /**
   * Returns the length of a measure.
   * @param  {[type]} duration       For example: 4/4 or 5/8 ...
   * @return {string} lengthMeasure  Length in ticks
   */
  function getLengthMeasure(duration){
    let lengthBeat = 0;

    let arr = duration.split("/");

    if (4  == arr[1]) lengthBeat = ticksPerBeat;
    if (8  == arr[1]) lengthBeat = ticksPerBeat/2;
    if (16 == arr[1]) lengthBeat = ticksPerBeat/4;
    if (32 == arr[1]) lengthBeat = ticksPerBeat/8;
    if (64 == arr[1]) lengthBeat = ticksPerBeat/16;

    lengthMeasure = lengthBeat * arr[0];

    return lengthBeat * arr[0];
  }
}
/**
 * [viewHelp description]
 */
function viewHelp(){
  let div  = document.getElementById("stave");
  let lbl1 = document.createElement("label");

  lbl1.setAttribute("style", "font-size:12px;color:black;width:100%;height:20px;cursor:pointer;white-space: nowrap;");
  lbl1.id = "help_1";
  lbl1.innerHTML = "Help description";

  div.innerHTML = "";

  div.appendChild(lbl1);
}
