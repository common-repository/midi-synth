/**
 * Description: WebAudio interface of Synthesizer.
 *
 * @package     midi-Synth
 * @category    module js
 * @author      Oleg Klenitsky
 * @copyright   2024 Oleg Klenitsky
 * @license     GPL-2.0-or-later
 */

"use strict";

var audiograph_node = "";
var diagram_view = false;
var curProg      = 0;
var curOct       = 0;
var curNote      = "--";
var curMidi      = 0;
var midiPort     = [];
var currentPort  = -1;
var canvas_midi;
var synth;
var kbd;

var audiograph_click  = false;
var audiograph_move   = false;
var canvas_audiograph = false;
var canvas_midi_click = false;
var sh_mousedown      = false;
var sh_mouseup        = false;
var vol_change        = false;
var rev_change        = false;

var compThreshold_change  = false;
var compKnee_change       = false;
var compRatio_change      = false;
var compAttack_change     = false;
var compRelease_change    = false;

var conv_duration_change = false;
var conv_decay_change  = false;

var prog_change       = false;
var oct_change        = false;
var ch_change         = false;
var qlt_change        = false;
var sus_change        = false;
var loop_change       = false;
var scaleX_change     = false;
var scaleY_change     = false;
var prog_num_input    = false;

window.onload = () => {
  //The AudioContext was not allowed to start.
  //It must be resumed (or created) after a user gesture on the page.
  var constraints = { audio: true };
  navigator.mediaDevices.getUserMedia(constraints)
  .then((stream) => {
    InitApp();
  });
}
/**
 * Main function.
 */
function InitApp(){
  InitMidi();

  canvas_midi = document.getElementById("canvas_midi");
  synth       = document.getElementById("tinysynth");
  kbd         = document.getElementById("kbd");

  kbd.addEventListener("change", KeyIn);

  var inform_panel = document.getElementById("inform_panel");
  var audiograph   = document.getElementById("audiograph");
  var prog_num     = document.getElementById("prog_num");
  var scaleX       = document.getElementById("scaleX");
  var scaleY       = document.getElementById("scaleY");
  var prog         = document.getElementById("prog");
  var vol          = document.getElementById("vol");
  var rev          = document.getElementById("rev");

  var comp_threshold = document.getElementById("comp_threshold");
  var comp_knee      = document.getElementById("comp_knee");
  var comp_ratio     = document.getElementById("comp_ratio");
  var comp_attack    = document.getElementById("comp_attack");
  var comp_release   = document.getElementById("comp_release");

  var conv_duration = document.getElementById("conv_duration");
  var conv_decay  = document.getElementById("conv_decay");
  var oct         = document.getElementById("oct");
  var ch          = document.getElementById("ch");
  var qlt         = document.getElementById("qlt");
  var sus         = document.getElementById("sus");
  var loop        = document.getElementById("loop");
  var sh          = document.getElementById("shot");

  synth.ready().then(()=>{
    if (false == canvas_midi_click) {
      canvas_midi.addEventListener("click", function(e) {
        if (false == diagram_view) {
          diagram_view = true;
        }else{
          diagram_view = false;
          Diagram_grid(false);
        }
        Diagram(scaleX.value);
      });
      canvas_midi_click = true;
    }
    if (false == sh_mousedown) {
      sh.addEventListener("mousedown",function(e) {
        if ("--" !== curNote) {
          synth.send([0x90+curMidi,curNote,100],0);
        }
      });
      sh_mousedown = true;
    }
    if (false == sh_mouseup) {
      sh.addEventListener("mouseup",function(e) {
        if ("--" !== curNote) {
          synth.send([0x80+curMidi,curNote,100],0);
        }
      });
      sh_mouseup = true;
    }
    if (false == vol_change) {
      vol.addEventListener("change",function(e) {
        if(typeof(synth)!="undefined"){
          synth.masterVol=e.target.value;
        }
      });
      vol_change = true;
    }
    if (false == rev_change) {
      rev.addEventListener("change",function(e) {
        if(typeof(synth)!="undefined"){
          synth.reverbLev=e.target.value;
        }
      });
      rev_change = true;
    }
    if (false == compThreshold_change) {
      comp_threshold.addEventListener("change",function(e) {
        if(typeof(synth)!="undefined"){
          synth.compThreshold=e.target.value;
        }
      });
      compThreshold_change = true;
    }
    if (false == compKnee_change) {
      comp_knee.addEventListener("change",function(e) {
        if(typeof(synth)!="undefined"){
          synth.compKnee=e.target.value;
        }
      });
      compKnee_change = true;
    }
    if (false == compRatio_change) {
      comp_ratio.addEventListener("change",function(e) {
        if(typeof(synth)!="undefined"){
          synth.compRatio=e.target.value;
        }
      });
      compRatio_change = true;
    }
    if (false == compAttack_change) {
      comp_attack.addEventListener("change",function(e) {
        if(typeof(synth)!="undefined"){
          synth.compAttack=e.target.value;
        }
      });
      compAttack_change = true;
    }
    if (false == compRelease_change) {
      comp_release.addEventListener("change",function(e) {
        if(typeof(synth)!="undefined"){
          synth.compRelease=e.target.value;
        }
      });
      compRelease_change = true;
    }

    if (false == conv_duration_change) {
      conv_duration.addEventListener("change",function(e) {
        if(typeof(synth)!="undefined"){
          synth.convDuration=e.target.value.toFixed(2);
        }
      });
      conv_duration_change = true;
    }
    if (false == conv_decay_change) {
      conv_decay.addEventListener("change",function(e) {
        if(typeof(synth)!="undefined"){
          synth.convDecay=e.target.value.toFixed(2);
        }
      });
      conv_decay_change = true;
    }

    if (false == prog_change) {
      prog.addEventListener("change",function(e) {

        if(curMidi!=9){
          document.getElementById("prog_name").innerHTML = synth.getTimbreName(0, e.target.value);
          prog.max = 100;
        }else{
          document.getElementById("prog_name").innerHTML = synth.getTimbreName(1, e.target.value);
          prog.max = 46;
        }

        ProgChange(e.target.value);
        EnableRow();

        //btns
        document.getElementById("editor").style.display = "none";
        document.getElementById("graph").style.display = "none";
        //wins
        document.getElementById("audiograph").style.display = "none";
        document.getElementById("win_edit").style.display = "none";
        //inform_panel
        inform_panel.innerHTML = "Press the music key";
        //reset sw0-sw4
        p_swX_click("sw0");
        //imgs
        document.getElementById("canvas_imgs").style.display = "none";

        Nodes_pos    = [];
        NodesCtx_pos = [];
      });
      prog_change = true;
    }
    if (false == oct_change) {
      oct.addEventListener("change",function(e) {
        OctChange(e.target.value);
      });
      oct_change = true;
    }
    if (false == ch_change) {
      ch.addEventListener("change",function(e) {
        curMidi = e.target.value - 1;
      });
      ch_change = true;
    }
    if (false == qlt_change) {
      qlt.addEventListener("change",function(e) {
        SetQuality(e.target.value);
      });
      qlt_change = true;
    }
    if (false == sus_change) {
      sus.addEventListener("change",function(e) {
        if (0 == e.target.value) {
            Sustain(false);
          }else{
            Sustain(true);
        }
      });
      sus_change = true;
    }
    if (false == loop_change) {
      loop.addEventListener("change",function(e) {
        if(typeof(synth)!="undefined"){
          synth.loop=e.target.checked;
        }
      });
      loop_change = true;
    }
    if (false == scaleX_change) {
      var analyzerMain = synth.getAnalyzerMain();

      scaleX.addEventListener("change",function(e) {
        Diagram(e.target.value);
      });
      scaleX_change = true;
    }
    if (false == scaleY_change) {
      scaleY.addEventListener("change",function(e) {
        if(typeof(synth)!="undefined"){
          synth.analysVol=e.target.value;
        }
      });
      scaleY_change = true;
    }
    if (false == prog_num_input) {
      prog_num.addEventListener("input",function(e) {
        document.getElementById("prog_name").innerHTML = synth.getTimbreName(0, e.target.value);
        ProgChange(e.target.value);
      });
      prog_num_input = true;
    }
    if (false == audiograph_move) {
      audiograph.addEventListener("mousemove",function(e) {
        audiograph_check_pos(e);
      });
    }
    if (false == audiograph_click) {
      audiograph.addEventListener("click",function(e) {
        draw_info_box();
      });
    }

    synth.analysVol = 4;
    document.getElementById("prog").value = "0";
    document.getElementById("prog_num").value = "0";
    document.getElementById("prog_name").innerHTML = synth.getTimbreName(0, 0);
    ProgChange(0);
    Edit();
    if (false == diagram_view) {
      Diagram_grid(false);
    }
  });
}
function MidiIn(e){
  if(synth){
    switch(e.data[0]&0xf0){
      case 0x90:
        kbd.setNote(e.data[2] ?1 :0, e.data[1]);
        break;
      case 0x80:
        kbd.setNote(0, e.data[1]);
    }
    e.data[1] = e.data[1] + curOct * 12;
    synth.send(e.data, 0);

    if (true == synth.playing) {
      //btns
      document.getElementById("editor").style.display = "none";
      document.getElementById("graph").style.display = "none";
      document.getElementById("sequencer").style.display = "none";
    }else{
      //btns
      document.getElementById("editor").style.display = "block";
      document.getElementById("graph").style.display = "block";
      document.getElementById("sequencer").style.display = "block";
      //inform_panel
      inform_panel.innerHTML = "Data for Editor and Graph is ready";
    }
    //wins
    document.getElementById("audiograph").style.display = "none";
    document.getElementById("win_edit").style.display = "none";

    curNote=e.data[1];
    document.getElementById("shot").innerHTML=curNote;
  }
}
function SelectMidi(n){
  document.getElementById("sel_kbd").selectedIndex = n+1;
  if(currentPort >= 0)
    midiPort[currentPort].removeEventListener("midimessage", MidiIn);
  currentPort = n;
  if(currentPort >= 0){
    midiPort[currentPort].addEventListener("midimessage", MidiIn);
  }
}
function InitMidi(){
  if(navigator.requestMIDIAccess){
    navigator.requestMIDIAccess().then(
      function(access){
        console.log("MIDI ready.");
        setTimeout(function(){
          var it = access.inputs.values();
          for(var i = it.next(); !i.done; i = it.next()){
            var e = document.createElement("option");
            e.innerHTML = i.value.name;
            document.getElementById("sel_kbd").appendChild(e);
            midiPort.push(i.value);
          }
          if(midiPort.length > 0)
            SelectMidi(0);
        },10);
      },
      function(){
        console.log("MIDI is not available.");
      }
    );
  }
}
function loadMidi(files){
  var reader = new FileReader();

  reader.onload=function(e){
    if (synth) {
      synth.loadMIDI(reader.result);
      document.getElementById("sequencer").style.display = "block";
      document.getElementById("ptrTime").style.left = "-2px";
      document.getElementById("subwin_part2").scrollLeft = 0;

      scale = 1;
      arrMeasures = [];
      arrVexFlow  = [];
      afterChecking = false;

      if ("flex" == document.getElementById("win_sequencer").style.display) {
        Sequencer();
      }
      if ("block" == document.getElementById("stave").style.display) {
        document.getElementById("stave").innerHTML = "";
      }
    }
  }
  if(0 !== files.length) {
    reader.readAsArrayBuffer(files[0]);
    document.getElementById("file_name_midi").value = files[0].name;
    document.getElementById("file_size_midi").value = files[0].size + " bytes";
  }else{
    if (synth) {
      synth.src = null;
    }
  }
}
function KeyIn(e){
  if (true == synth.playing) {
    //btns
    document.getElementById("editor").style.display = "none";
    document.getElementById("graph").style.display = "none";
  }else{
    //btns
    document.getElementById("editor").style.display = "block";
    document.getElementById("graph").style.display = "block";
    //inform_panel
    inform_panel.innerHTML = "Data for Editor and Graph is ready";
  }
  //wins
  document.getElementById("audiograph").style.display = "none";
  document.getElementById("win_edit").style.display = "none";

  //imgs
  document.getElementById("canvas_imgs").style.display = "none";

  curNote=e.note[1]+curOct*12;
  document.getElementById("shot").innerHTML=synth.arrNotes[curNote];
  if(e.note[0])
    synth.send([0x90+curMidi,curNote,100]);
  else
    synth.send([0x80+curMidi,curNote,0]);
  if(curMidi==9){
    var w=synth.drummap[curNote-35];
    ViewParam(w);
  }
}
function ChChange(e){
  curMidi=e.selectedIndex;
}
function ViewDef(pg){
  var s=JSON.stringify(pg.p);
  s=s.replace(/}/g,",}").replace(/\"([a-z])\"/g,"$1");
  var ss=["g:0,","t:1,","f:0,","v:0.5,","a:0,","h:0.01,","d:0.01,","s:0,","r:0.05,","p:1,","q:1","k:0"];
  for(var p=0;p<ss.length;++p){
    s=s.replace(ss[p],",");
    s=s.replace(ss[p],",");
    s=s.replace(ss[p],",");
  }
  s=s.replace(/{,/g,"{");
  s=s.replace(/,+/g,",");
  document.getElementById("patch").value=s;
}

function EnableRow(){
  var oscs=document.getElementById("oscs").selectedIndex+1;
  var ids=["g","w","v","t","f","a","h","d","s","r","p","q","k"];

  for(var i=1;;++i){
    var o=document.getElementById("p"+i)
    if(!o)
      break;
    for(var id=0;id<ids.length;++id){
      document.getElementById(ids[id]+i).disabled = (oscs>=i) ?false :true;
      if (oscs>=i) {
        document.getElementById(ids[id]+i).setAttribute("style","font-weight:bold;text-align: center;");
        document.getElementById("sw"+i).style.visibility="visible";
        document.getElementById("p_sw"+i).style.visibility="visible";
      }else{
        document.getElementById(ids[id]+i).setAttribute("style","font-weight:bold;background:#cccf;text-align: center;");
        document.getElementById("sw"+i).style.visibility="hidden";
        document.getElementById("p_sw"+i).style.visibility="hidden";
      }
      switch(i){
        case 1:
          document.getElementById(ids[id]+i).style.color="red";
          break;
        case 2:
          document.getElementById(ids[id]+i).style.color="blue";
          break;
        case 3:
          document.getElementById(ids[id]+i).style.color="green";
          break;
        case 4:
          document.getElementById(ids[id]+i).style.color="brown";
          break;
      }
    }
  }
}
function Edit(){
  var td_osc_num = document.getElementsByClassName("osc_num");
  var prog;

  if(window.synth == undefined) return;

  for (let i = 0; i < 4; i++) {
    td_osc_num[i].innerHTML = "";
  }

  if(curMidi==9)
    prog=synth.drummap[curNote-35];
  else
    prog=synth.program[curProg];
  var oscs=document.getElementById("oscs").selectedIndex+1;

  EnableRow();

  prog.p = [];
  for(var i=0;i<oscs;++i) {
    prog.p.push({g:0,w:"sine",v:0,t:0,f:0,a:0,h:0,d:0,s:0,r:0,b:0,c:0,p:0,q:0,k:0});
  }
  for(var i=0;i<oscs;++i){
    prog.p[i].g=GetVal("g"+(i+1));
    prog.p[i].w=document.getElementById("w"+(i+1)).value;
    prog.p[i].v=GetVal("v"+(i+1));
    prog.p[i].t=GetVal("t"+(i+1));
    prog.p[i].f=GetVal("f"+(i+1));
    prog.p[i].a=GetVal("a"+(i+1));
    prog.p[i].h=GetVal("h"+(i+1));
    prog.p[i].d=GetVal("d"+(i+1));
    prog.p[i].s=GetVal("s"+(i+1));
    prog.p[i].r=GetVal("r"+(i+1));
    prog.p[i].p=GetVal("p"+(i+1));
    prog.p[i].q=GetVal("q"+(i+1));
    prog.p[i].k=GetVal("k"+(i+1));
  }
  ViewDef(prog);

  //btns
  document.getElementById("editor").style.display = "none";
  document.getElementById("graph").style.display = "none";

  //inform_panel
  inform_panel.innerHTML = "Press the music key";
}
function ViewParam(pg){
  if(!pg)
    return;

  let prog_num  = document.getElementById("prog_num").value;
  let prog_name = document.getElementById("prog_name").innerHTML;
  document.getElementById("head_soundeditor").innerHTML = "Timbre Editor of program[" + prog_num + "] " + prog_name;

  var oscs=pg.p.length;
  document.getElementById("oscs").selectedIndex=oscs-1;
  var o=document.getElementById("prog2").firstChild;
  while(o=o.nextSibling){
    if(o.firstChild)
      o.firstChild.disabled=(oscs>=2)?false:true;
  }
  o=document.getElementById("prog3").firstChild;
  while(o=o.nextSibling){
    if(o.firstChild)
      o.firstChild.disabled=(oscs>=3)?false:true;
  }
  o=document.getElementById("prog4").firstChild;
  while(o=o.nextSibling){
    if(o.firstChild)
      o.firstChild.disabled=(oscs>=4)?false:true;
  }
  for(var i=0;i<oscs;++i){
    document.getElementById("g"+(i+1)).value=pg.p[i].g;
    document.getElementById("w"+(i+1)).value=pg.p[i].w;
    document.getElementById("v"+(i+1)).value=pg.p[i].v;
    document.getElementById("t"+(i+1)).value=pg.p[i].t;
    document.getElementById("f"+(i+1)).value=pg.p[i].f;
    document.getElementById("a"+(i+1)).value=pg.p[i].a;
    document.getElementById("h"+(i+1)).value=pg.p[i].h;
    document.getElementById("d"+(i+1)).value=pg.p[i].d;
    document.getElementById("s"+(i+1)).value=pg.p[i].s;
    document.getElementById("r"+(i+1)).value=pg.p[i].r;
    document.getElementById("p"+(i+1)).value=pg.p[i].p;
    document.getElementById("q"+(i+1)).value=pg.p[i].q;
    document.getElementById("k"+(i+1)).value=pg.p[i].k;
  }
  ViewDef(pg);
}
function OctChange(o){
  curOct=o;
}
function ProgChange(p){
  if(synth){
    synth.send([0xc0,p]);
    if(curMidi!=9){
      curProg=p;
      var pg=synth.program[curProg];
      ViewParam(pg);
    }
  }
}
function SetQuality(n){
  var pg;
  synth.quality=n;
  if(curMidi==9)
    pg=synth.drummap[curNote];
  else
    pg=synth.program[curProg];
  ViewParam(pg);
}
function GetVal(id){
  var s=+document.getElementById(id).value;
  if(isNaN(s))
    s=0;
  return s;
}
function OpenKbd(){
  var kbd = document.getElementById("kbd");

  if(kbd.style.display == "block") {
    kbd.style.display = "none";
  }else{
    kbd.style.display = "block";
  }
}
function openStave(id){
  var stave = document.getElementById("stave");

  if(id == btnOn) {
    stave.style.display = "none";
    btnOn = "";
  }else{
    stave.style.display = "block";
    btnOn = id;
    drawVexflow(clef);
  }
}
function openCheck(id){
  var stave = document.getElementById("stave");

  if(id == btnOn) {
    stave.style.display = "none";
    btnOn = "";
  }else{
    stave.style.display = "block";
    btnOn = id;
    dataCheck();
  }
}
function openHelp(id){
  var stave = document.getElementById("stave");

  if(id == btnOn) {
    stave.style.display = "none";
    btnOn = "";
  }else{
    stave.style.display = "block";
    btnOn = id;
    viewHelp();
  }
}
function OpenEditor(){
  var win_edit = document.getElementById("win_edit");

  if(win_edit.style.display == "flex") {
    win_edit.style.display = "none";
  }else{
    win_edit.style.display = "flex";
    audioNodesProg_name();
  }
}
function AudioGraph(){
  var audiograph = document.getElementById("audiograph");

  //Clear canvas
  var ctx = audiograph.getContext("2d");
  ctx.clearRect(0, 0, audiograph.width, audiograph.height);

  let prog_num  = document.getElementById("prog_num").value;
  let prog_name = document.getElementById("prog_name").innerHTML;
  let head_audiograph_prog_num  = "Graph of program[" + prog_num + "]";
  let head_audiograph_prog_name = prog_name;

  ctx.font = "bold 16px sans-serif";
  ctx.fillStyle = "#C3C3C3";
  ctx.textAlign = "left";
  ctx.fillText(head_audiograph_prog_num, 520, 30);
  ctx.fillText(head_audiograph_prog_name, 520, 50);

  if(audiograph.style.display == "block") {
    audiograph.style.display = "none";
    //imgs
    document.getElementById("canvas_imgs").style.display = "none";
  }else{
    refresh_diagram();
    audiograph.style.display = "block";
  }
}
function winSequencer(){
  var win_sequencer = document.getElementById("win_sequencer");

  if ("flex" == win_sequencer.style.display) {
    win_sequencer.style.display = "none";
    selPart1ItemNum = "";
  }else{
    win_sequencer.style.display = "flex";
    Sequencer();
  }
}
function Sequencer(){
  var win_part1 = document.getElementById("win_part1");
  var trackCount = synth.getTracksCount();

  win_part1.innerHTML = "";

  for(let i=1; i <= trackCount; ++i ) {
    let div_rec = document.createElement("div");
    let sub_div = document.createElement("div");

    div_rec.id  = "part1_" + i;
    div_rec.setAttribute("onclick", "selPart1Item(id);");
    div_rec.style.width  = win_part1.style.width - 10;
    div_rec.setAttribute("style", "display:flex;flex-direction: column;align-items: flex-start;margin: 2px;padding:2px;font-size:12px;color:black;height:60px;border: 1px solid black;background:#C1C1C1");

    let element = document.createElement("input");
    element.value = "Track: " + Number(i);
    element.id = "part1_" + i + "rec";
    element.type = "text";
    element.placeholder  ="Name track";
    element.setAttribute("style", "font-size:12px;color:black;width:100%;height:20px;padding:5px 5px 5px 0;cursor:pointer;");
    div_rec.appendChild(element);

    element = document.createElement("label");
    element.id = "part1_" + i + "instrument";
    element.innerHTML = "Instrument: ";
    element.setAttribute("style", "font-size:12px;color:black;width:100%;height:20px;cursor:pointer;white-space: nowrap;");
    div_rec.appendChild(element);

    sub_div.setAttribute("class", "sub_div_part1");
    sub_div.id  = "sub_div_" + i;
    sub_div.setAttribute("style", "display:flex;flex-direction: row;justify-content: space-between;width:100%;");

    element = document.createElement("label");
    element.id = "part1_ch_numtrk_" + i;
    element.className = "lbl_ch";
    element.innerHTML = "Channel: ";
    element.setAttribute("style", "font-size:12px;color:black;width:80%;height:20px;cursor:pointer;");
    sub_div.appendChild(element);

    let img0 = new Image(32, 32);
    img0.src = speaker.src;
    img0.setAttribute("id","speaker_" + i);
    img0.setAttribute("onclick","speaker_on_off(id);");
    img0.setAttribute("width",32);
    img0.setAttribute("height",32);
    img0.setAttribute("class","speakers");
    img0.setAttribute("style","display:block;width:16px;height:16px;cursor:pointer;");
    sub_div.appendChild(img0);

    let img1 = new Image(32, 32);
    img1.src = speaker_on.src;
    img1.setAttribute("id","speakerOn_" + i);
    img1.setAttribute("onclick","speaker_on_off(id);");
    img1.setAttribute("width",32);
    img1.setAttribute("height",32);
    img1.setAttribute("class","speakers");
    img1.setAttribute("style","display:none;width:16px;height:16px;cursor:pointer;");
    sub_div.appendChild(img1);

    let img2 = new Image(32, 32);
    img2.src = speaker_off.src;
    img2.setAttribute("id","speakerOff_" + i);
    img2.setAttribute("onclick","speaker_on_off(id);");
    img2.setAttribute("width",32);
    img2.setAttribute("height",32);
    img2.setAttribute("class","speakers");
    img2.setAttribute("style","display:none;width:16px;height:16px;cursor:pointer;");
    sub_div.appendChild(img2);

    div_rec.appendChild(sub_div);

    win_part1.appendChild(div_rec);
  }
  drawRangeNotes();
  drawHeaderInfo();
  drawTrackInfo();
  drawNotesStrip();
  drawTimeScale(1);
  drawNotesSong(1);

  let div_rangeNotes_part2 = document.getElementById("div_rangeNotes_part2");
  let subwin_part2 = document.getElementById("subwin_part2");
  subwin_part2.addEventListener("scroll", () => {
    div_rangeNotes_part2.scrollTop = subwin_part2.scrollTop;
  });
  subwin_part2.scrollTop = 655;
}
function midi_player(){
  //btns
  document.getElementById("editor").style.display = "none";
  document.getElementById("graph").style.display = "none";
  //wins
  document.getElementById("win_edit").style.display = "none";
  document.getElementById("audiograph").style.display = "none";
  //imgs for Graph
  document.getElementById("canvas_imgs").style.display = "none";

  if (synth) {
    if (true == synth.playing) {
      prog.value = 0;
      prog_num.value = prog.value;
      document.getElementById("prog_name").innerHTML = synth.getTimbreName(0, prog.value);
      document.getElementById("scale").setAttribute("style","pointer-events:none;opacity:0.9;background-color: #f2f2f2;color: #999;cursor:not-allowed;position:absolute;display:flex;justify-content: space-evenly;align-items: center;height:13px;width:40px;overflow: hidden;font-weight:bold;font-size:14px;top:-15px;left:210px;background:#C3C3C3;");
      ProgChange(0);
      inform_panel.innerHTML = "midi-Synth playing midi file";
      startTimer();
    }else{
      ProgChange(document.getElementById("prog").value);
      document.getElementById("scale").setAttribute("style","pointer-events:auto;opacity:1;background-color:transparent;color:black;cursor:pointer;position:absolute;display:flex;justify-content: space-evenly;align-items: center;height:13px;width:40px;overflow: hidden;font-weight:bold;font-size:14px;top:-15px;left:210px;background:#C3C3C3;");
      inform_panel.innerHTML = "midi-Synth stoping playing midi file";
    }
  }
}
function Sustain(b){
  synth.send([0xb0+curMidi,64,b?127:0],0);
}
/**
 * Check position mouse on audiograph canvas.
 * @return {[type]} [description]
 */
function audiograph_check_pos(e){
  let audiograph = document.getElementById("audiograph");
  let ctx = audiograph.getContext("2d");

  audiograph.style.cursor = "default";
  audiograph_node = "";

  let mouseX = e.offsetX;
  let mouseY = e.offsetY;

  let nodeName = Nodes_pos.node;
  let nodeXY;
  let nodeX;
  let nodeY;

  for (let i = 0; i < Nodes_pos.length; i++) {
    nodeName = Nodes_pos[i].node.split(" ");
    nodeXY   = Nodes_pos[i].posXY.split(",");
    nodeX    = parseInt(nodeXY[0]);
    nodeY    = parseInt(nodeXY[1]);

    switch(nodeName[0]) {
      case "GainNode":
        if (nodeX < mouseX && mouseX < nodeX + parseInt(Nodes_size.GainNode.x) &&
          nodeY < mouseY && mouseY < nodeY + parseInt(Nodes_size.GainNode.y)) {
          audiograph.style.cursor = "pointer";
          audiograph_node = Nodes_pos[i].node;
        }
        break;
      case "OscillatorNode":
        if (nodeX < mouseX && mouseX < nodeX + parseInt(Nodes_size.OscillatorNode.x) &&
          nodeY < mouseY && mouseY < nodeY + parseInt(Nodes_size.OscillatorNode.y)) {
          audiograph.style.cursor = "pointer";
          audiograph_node = Nodes_pos[i].node;
        }
        break;
      case "AudioBufferSourceNode":
        if (nodeX < mouseX && mouseX < nodeX + parseInt(Nodes_size.AudioBufferSourceNode.x) &&
          nodeY < mouseY && mouseY < nodeY + parseInt(Nodes_size.AudioBufferSourceNode.y)) {
          audiograph.style.cursor = "pointer";
          audiograph_node = Nodes_pos[i].node;
        }
        break;
      case "StereoPannerNode":
        if (nodeX < mouseX && mouseX < nodeX + parseInt(Nodes_size.StereoPannerNode.x) &&
          nodeY < mouseY && mouseY < nodeY + parseInt(Nodes_size.StereoPannerNode.y)) {
          audiograph.style.cursor = "pointer";
          audiograph_node = Nodes_pos[i].node;
        }
        break;
    }
  }

  for (let i = 0; i < NodesCtx_pos.length; i++) {
    nodeName = NodesCtx_pos[i].node.split(" ");
    nodeXY   = NodesCtx_pos[i].posXY.split(",");
    nodeX    = parseInt(nodeXY[0]);
    nodeY    = parseInt(nodeXY[1]);

    switch(nodeName[0]) {
      case "GainNode":
        if (nodeX < mouseX && mouseX < nodeX + parseInt(Nodes_size.GainNode.x) &&
          nodeY < mouseY && mouseY < nodeY + parseInt(Nodes_size.GainNode.y)) {
          audiograph.style.cursor = "pointer";
          audiograph_node = NodesCtx_pos[i].node;
        }
        break;
      case "ConvolverNode":
        if (nodeX < mouseX && mouseX < nodeX + parseInt(Nodes_size.ConvolverNode.x) &&
          nodeY < mouseY && mouseY < nodeY + parseInt(Nodes_size.ConvolverNode.y)) {
          audiograph.style.cursor = "pointer";
          audiograph_node = NodesCtx_pos[i].node;
        }
        break;
      case "DynamicsCompressorNode":
        if (nodeX < mouseX && mouseX < nodeX + parseInt(Nodes_size.DynamicsCompressorNode.x) &&
          nodeY < mouseY && mouseY < nodeY + parseInt(Nodes_size.DynamicsCompressorNode.y)) {
          audiograph.style.cursor = "pointer";
          audiograph_node = NodesCtx_pos[i].node;
        }
        break;
      case "AnalyserNode":
        if (nodeX < mouseX && mouseX < nodeX + parseInt(Nodes_size.AnalyserNode.x) &&
          nodeY < mouseY && mouseY < nodeY + parseInt(Nodes_size.AnalyserNode.y)) {
          audiograph.style.cursor = "pointer";
          audiograph_node = NodesCtx_pos[i].node;
        }
        break;
      case "AudioDestinationNode":
        if (nodeX < mouseX && mouseX < nodeX + parseInt(Nodes_size.AudioDestinationNode.x) &&
          nodeY < mouseY && mouseY < nodeY + parseInt(Nodes_size.AudioDestinationNode.y)) {
          audiograph.style.cursor = "pointer";
          audiograph_node = NodesCtx_pos[i].node;
        }
        break;
    }
  }
}
/**
 * [soundeditor_info description]
 * @param  {[type]} id [description]
 */
function soundeditor_info(id){
  let descr_ul = document.getElementById("descr_ul");
  let img_ahdsr   = document.getElementById("img_ahdsr");

  img_ahdsr.style.display = "none";
  descr_ul.style.display = "block";
  descr_ul.setAttribute("style", "margin: 0px;padding:0;font-size:14px;color:black;");

  switch(id){
    case "soundeditor_th1":
      let li1_1 = document.createElement("li");
      let li1_2 = document.createElement("li");

      li1_1.setAttribute("style", "margin-left: 20px;line-height:1.4;cursor:default;z-index: 1");
      li1_2.setAttribute("style", "margin-left: 20px;line-height:1.4;cursor:default;z-index: 1");

      li1_1.innerHTML = "<b>G0</b>: output destination - final output";
      li1_2.innerHTML = "<b>Gn</b>: output destination - to specified osc";

      descr_ul.innerHTML = "";
      descr_ul.appendChild(li1_1);
      descr_ul.appendChild(li1_2);
      break;
    case "soundeditor_th2":
      let li2_1 = document.createElement("li");
      let li2_2 = document.createElement("li");
      let li2_3 = document.createElement("li");
      let li2_4 = document.createElement("li");

      li2_1.setAttribute("style", "margin-left: 20px;line-height:1.4;cursor:default;z-index: 1");
      li2_2.setAttribute("style", "margin-left: 20px;line-height:1.4;cursor:default;z-index: 1");
      li2_3.setAttribute("style", "margin-left: 20px;line-height:1.4;cursor:default;z-index: 1");
      li2_4.setAttribute("style", "margin-left: 20px;line-height:1.4;cursor:default;z-index: 1");

      li2_1.innerHTML = "w: waveform - (basic waveforms): sine/sawtooth/square/triangle";
      li2_2.innerHTML = "w: waveform - (summing 1-4 harmonics): w9999";
      li2_3.innerHTML = "w: waveform - (white noise): n0";
      li2_4.innerHTML = "w: waveform - (metalic noise): n1";

      descr_ul.innerHTML = "";
      descr_ul.appendChild(li2_1);
      descr_ul.appendChild(li2_2);
      descr_ul.appendChild(li2_3);
      descr_ul.appendChild(li2_4);
      break;
    case "soundeditor_th3":
      let li3_1 = document.createElement("li");

      li3_1.setAttribute("style", "margin-left: 20px;line-height:1.4;cursor:default;");

      li3_1.innerHTML = "volume";

      descr_ul.innerHTML= "";
      descr_ul.appendChild(li3_1);
      break;
    case "soundeditor_th4":
      let li4_1 = document.createElement("li");

      li4_1.setAttribute("style", "margin-left: 20px;line-height:1.4;cursor:default;");

      li4_1.innerHTML = "tune factor according to note#";

      descr_ul.innerHTML= "";
      descr_ul.appendChild(li4_1);
      break;
    case "soundeditor_th5":
      let li5_1 = document.createElement("li");

      li5_1.setAttribute("style", "margin-left: 20px;line-height:1.4;cursor:default;");

      li5_1.innerHTML = "fixed frequency in Hz";

      descr_ul.innerHTML= "";
      descr_ul.appendChild(li5_1);
      break;
    case "soundeditor_th6":
      let li6 = document.createElement("li");

      li6.setAttribute("style", "margin-left: 20px;line-height:1.4;cursor:pointer;");
      li6.classList.add("AHDSR");

      li6.innerHTML = "<b>Attack</b>: This is the first stage, during which the control voltage rises from its initial value (usually zero) to its peak value. The attack time determines how quickly this rise occurs, with shorter attack times producing a faster, more immediate onset of the sound, and longer attack times creating a slower, more gradual increase in amplitude or other parameter.";

      descr_ul.innerHTML = "";
      descr_ul.appendChild(li6);
      break;
    case "soundeditor_th7":
      let li7 = document.createElement("li");

      li7.setAttribute("style", "margin-left: 20px;line-height:1.4;cursor:pointer;");
      li7.classList.add("AHDSR");

      li7.innerHTML = "<b>Hold</b>: This is the second stage, during which the control voltage remains at its peak value for a specified period. The hold time determines the duration of this constant level, allowing for a sustained peak before the envelope proceeds to the decay stage.";

      descr_ul.innerHTML = "";
      descr_ul.appendChild(li7);
      break;
    case "soundeditor_th8":
      let li8 = document.createElement("li");

      li8.setAttribute("style", "margin-left: 20px;line-height:1.4;cursor:pointer;");
      li8.classList.add("AHDSR");

      li8.innerHTML = "<b>Decay</b>: This is the third stage, during which the control voltage falls from its peak value to the sustain level. The decay time determines how quickly this decrease occurs, with shorter decay times producing a faster transition, and longer decay times resulting in a slower, more gradual change.";

      descr_ul.innerHTML = "";
      descr_ul.appendChild(li8);
      break;
    case "soundeditor_th9":
      let li9 = document.createElement("li");

      li9.setAttribute("style", "margin-left: 20px;line-height:1.4;cursor:pointer;");
      li9.classList.add("AHDSR");

      li9.innerHTML = "<b>Sustain</b>: This is the fourth stage, during which the control voltage remains at a constant level while a note is held or a gate signal is active. The sustain level determines the amplitude or intensity of the sound during this stage, with higher sustain levels resulting in louder or more pronounced sounds, and lower sustain levels producing quieter or more subdued sounds.";

      descr_ul.innerHTML = "";
      descr_ul.appendChild(li9);
      break;
    case "soundeditor_th10":
      let li10 = document.createElement("li");

      li10.setAttribute("style", "margin-left: 20px;line-height:1.4;cursor:pointer;");
      li10.classList.add("AHDSR");

      li10.innerHTML = "<b>Release</b>: This is the final stage, during which the control voltage falls from the sustain level back to its initial value after a note is released or the gate signal is deactivated. The release time determines how quickly this decrease occurs, with shorter release times producing a faster, more abrupt fade-out of the sound, and longer release times resulting in a slower, more gradual decay.";

      descr_ul.innerHTML = "";
      descr_ul.appendChild(li10);
      break;
    case "soundeditor_th11":
      let li11_1 = document.createElement("li");
      let li11_2 = document.createElement("li");

      li11_1.setAttribute("style", "margin-left: 20px;line-height:1.2;cursor:default;");
      li11_2.setAttribute("style", "margin-left: 20px;line-height:1.2;cursor:default;");

      li11_1.innerHTML= "<b>setBend(ch, val, t)</b>: Set pitch bend state. Notes in this channel are all affected to this pitch modification. val range is 0 to 16384 and the center with no bend is 8192. sensitivity is depends on setBendRange() setting. Default state is 8192.";
      descr_ul.appendChild(li11_1);

      li11_2.innerHTML= "<b>setBendRange(ch, val)</b>: Set bend sensitivity for that channel. val unit is 100/127 cent. That means +-1 octave if 0x600, +-1 semitone if 0x80. Default value is 0x100 that means +-200 cent (2 semitone) range.";

      descr_ul.innerHTML = "";
      descr_ul.appendChild(li11_1);
      descr_ul.appendChild(li11_2);

      break;
    case "soundeditor_th12":
      let li12_1 = document.createElement("li");

      li12_1.setAttribute("style", "margin-left: 20px;line-height:1.4;cursor:default;");

      li12_1.innerHTML = "pitch bend speed factor";

      descr_ul.innerHTML= "";
      descr_ul.appendChild(li12_1);
      break;
    case "soundeditor_th13":
      let li13_1 = document.createElement("li");

      li13_1.setAttribute("style", "margin-left: 20px;line-height:1.4;cursor:default;");

      li13_1.innerHTML = "volume key tracking factor";

      descr_ul.innerHTML= "";
      descr_ul.appendChild(li13_1);
      break;
  }
}
function view_ahdsr_img() {
  let descr_ul  = document.getElementById("descr_ul");
  let descr_li  = document.getElementById("descr_ul").querySelector(".AHDSR");
  let img_ahdsr = document.getElementById("img_ahdsr");

  if (descr_li){
    if("none" == img_ahdsr.style.display) {
      descr_ul.style.display = "none";
      img_ahdsr.style.display = "block";
    }else{
      descr_ul.style.display = "block";
      img_ahdsr.style.display = "none";
    }
  }else{
    descr_ul.style.display = "block";
    img_ahdsr.style.display = "none";
  }
}
/**
 * [img_resize description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function img_resize(id) {
 let img = document.getElementById(id);

 switch(id){
    case "webaudiothreshold":
      if ("70px" == img.style.width) {
        img.setAttribute("style", "position:absolute;z-index: 1;left:5px;top:-5px;width:255px;height:305px;margin:0 5px;border: 1px solid black;cursor:pointer;");
      }else{
        img.setAttribute("style", "position:absolute;z-index: auto;left:180px;top:20px;width:70px;height:50px;margin:0 5px;border: 1px solid black;cursor:pointer;");
      }
      break;
    case "webaudioknee":
      if ("70px" == img.style.width) {
        img.setAttribute("style", "position:absolute;z-index: 1;left:5px;top:-5px;width:255px;height:305px;margin:0 5px;border: 1px solid black;cursor:pointer;");
      }else{
        img.setAttribute("style", "position:absolute;z-index: auto;left:180px;top:77px;width:70px;height:50px;margin:0 5px;border: 1px solid black;cursor:pointer;");
      }
      break;
    case "webaudioratio":
      if ("70px" == img.style.width) {
        img.setAttribute("style", "position:absolute;z-index: 1;left:5px;top:-5px;width:255px;height:305px;margin:0 5px;border: 1px solid black;cursor:pointer;");
      }else{
        img.setAttribute("style", "position:absolute;z-index: auto;left:180px;top:134px;width:70px;height:50px;margin:0 5px;border: 1px solid black;cursor:pointer;");
      }
      break;
  }
}
