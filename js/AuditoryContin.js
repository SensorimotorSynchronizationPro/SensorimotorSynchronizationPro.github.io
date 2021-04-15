// ************* ************************ WEB seting *********************************************

// ************* ************************ <EXP parameters> *********************************************
var ntrial; // for recording the repeatting time within each trial
var startTime; // for recoding the time info in drwing & data
var lastTime; // for recoding the time info in drwing
var dy;  // moving distance per frame in pixel
var onsetTime
var PracStimuli = 10; //Practice stimuli number in each sequence
var ExpStimuli =20; //EXP stimuli number in each sequence
var RestTime=5000; // resting time between sequences (in ms)
var invalidTrial =0
var SYCSequence=20; // syc trials
var InvlaidLimit =4; // the max invalid number of trial

var RTSOA = [1.1, 1.4, 1.7, 2.0, 2.3, 2.6, 2.9, 3.2, 3.5, 3.8];
var RTvalid = 800; //the max RT (in s) for valid trials in RT task
var RTtrial=0; // finishesd RT trial
var RTPractime=0; // RT pracice time
var Stimuli_RTprac =[0,2.6,4.3,7.2,10.4,12.7,13.8,15.2,17.2,20.7]
var RT1=[0,	1.10,3.40,6.90,8.90,11.5,14.4,17.9,21.1,23.4,25.1,26.5,29.1,32.0,35.2,39.0,41.0,42.4,44.1,45.2];
var RT2=[0,	1.10,2.20,6,9.20,11.2,12.9,14.6,18.4,21,23.9,25.3,28.8,31.1,32.5,34.5,38,41.2,44.1,46.7];
var RT3= [0,2,3.70,4.80,6.80,9.40,13.2,15.8,16.9,18.3,22.1,24.4,27.9,30.2,31.6,34.8,38.3,41.5,44.4,46.1];
var RT4=[0,	2.30,5.80,9.60,10.7,12.1,14.7,17.9,20.8,23.4,24.8,27.7,31.5,33.5,37,38.1,40.4,42.4,45.6,47.3];
// the randomized ISI sequence for RT test practice
var RT_list = shuffle(Array.from(new Array(4).keys())); // the randomized ISI sequence for RT test

var SYCtrial=0; // finishesd SYC trial
var SYCPractime=0; // finishesd SYC trial
var SYCSOA=[0.7,1.3,1.9,2.5,3.1];
var SYC_list = shuffle(Array.from(new Array(SYCSequence).keys())); // the randomized ISI trials for SYC test // for SYC prac: ISI=1s

//record subj behaviror when subj enter or exit fullscreen mode & during exp
var ScreenY=[];
var ScreenX=[];


var soundList = [ '../sound/ISI1t.wav', '../sound/ISI2t.wav','../sound/ISI3t.wav',
  '../sound/ISI4t.wav', '../sound/ISI5t.wav', '../sound/ISIPrac.wav',
  '../sound/ISIRT1.wav', '../sound/ISIRT2.wav', '../sound/ISIRT3.wav',
  '../sound/ISIRT4.wav',
  '../sound/ISIRTPrac.wav',];
// ************************************* <Initiate + basic func> *********************************************
// change screen content
function changediv(id1,id2){
  id2.style.display='block';
  id1.style.display='none';
  return false;
}
// start each trial
function intro2exp(e){
     //checks whether the pressed key is "Enter"
     if (e.keyCode == 13 &&  invalidTrial<=InvlaidLimit){
       //RT practice
       if (SYCtrial> SYCSequence && RTtrial==0){
         changediv(RTintro_prac,speaker)
         playRT(buffer[10]);
          RTPractime++;
       }
       // RT formal exp
       if (RTtrial>0 && SYCtrial> SYCSequence) {
          changediv(RTintro,speaker)
          bufferRT=buffer[(RT_list[RTtrial-1])+6];
          playRT(bufferRT);
        }
      // SYC pracice
      if (SYCtrial==0){
          bufferSYCpra = buffer[5] //for pracice, the ISI is 1s.
          Stumulitime=buffer[5].duration;
          changediv(SYCintro_prac,speaker);
          playSYC(bufferSYCpra,Stumulitime);
           SYCPractime++;
        }
      //SYC formal exp
      if (SYCtrial<= SYCSequence && SYCtrial>0){
          bufferSYC = buffer[SYC_list[SYCtrial-1]%5]
          Stumulitime = buffer[SYC_list[SYCtrial-1]%5].duration;
          changediv(SYCintro,speaker)
          playSYC(bufferSYC,Stumulitime);
        }
      }
}
// shuffle
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
// process bar
function ShowProcess() {
    var elem1 = document.getElementById("myBar");
    var width = (RTtrial+SYCtrial)/(SYCSequence+4);
        elem1.style.width = width*100 + "%";
    var elem2 = document.getElementById("myProgress");
        elem2.style.display='block';
  }
function HideProcess() {
      var elem = document.getElementById("myProgress");
          elem.style.display='none';
    }
// enter & exit full screen mode
var elem = document.documentElement;
function openFullscreen() {
       if (elem.requestFullscreen) {
        elem.requestFullscreen();
       } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
       } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
       } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen()}
    }
function closeFullscreen() {
        if (elem.exitFullscreen) {
          elem.exitFullscreen();
        } else if (elem.mozCancelFullScreen) {
          elem.mozCancelFullScreen();
        } else if (elem.webkitExitFullscreen) {
          elem.webkitExitFullscreen();
        } else if (elem.msExitFullscreen) {
          elem.msExitFullscreen();
        }
  }
//start exp
function Initiate(){
      var video1 =document.querySelector('#video1');
      var video2 =document.querySelector('#video2');
      var actualCode = "jeans";
      var wirteCode=document.getElementById("Code").value;
      if (actualCode.localeCompare(wirteCode) != 0) {
        alert("Make sure to find the code from the instruction before proceeding!")
        return;
      } else {
        db.collection('Auditory-SMS').doc(subjectid).set({
        SYC_list:SYC_list,
        RT_list:RT_list,
        })
        .then(function() {
          console.log("Document successfully written!");
          video1.pause();
          video1.currentTime=0;
          video2.pause();
          video2.currentTime=0;
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
        changediv(introEXP,SYCintro_prac);
        openFullscreen();
        document.addEventListener('keydown',intro2exp,true);
      }
    }
// end exp
function saveFeedback() {
    var comment=document.getElementById("feedback2").value;
    var pitch=document.getElementById("pitch").value;
    var tempo=document.getElementById("tempo").value;
    if (!pitch || !tempo ) {
      alert("Please answer these questions!");}
      else {
        db.collection('Auditory-SMS').doc(subjectid).update({
            comment:comment,
            pitch:pitch,
            tempo:tempo,
        })
        changediv(FinalPage2,ThanksPage);
      }
}
// record data
function datarecorded (e) {
       //checks whether the pressed key is "m"
      if (e.keyCode == 77 ){
        RTtime.push(context.currentTime-startime)
        ScreenY.push(window.innerHeight);
        ScreenX.push(window.innerWidth);
            };
  }
// sound processing
function appendBuffer(buffer1, buffer2) {
    var numberOfChannels = Math.min( buffer1.numberOfChannels, buffer2.numberOfChannels );
    var tmp = context.createBuffer( numberOfChannels, (buffer1.length + buffer2.length), buffer1.sampleRate );
    for (var i=0; i<numberOfChannels; i++) {
      var channel = tmp.getChannelData(i);
      channel.set( buffer1.getChannelData(i), 0);
      channel.set( buffer2.getChannelData(i), buffer1.length);
    }
    return tmp;
  }
// **********************************************************************************************


// *************************************<RT Test>*************************************
// <play the sound for RT test>
function playRT(b){
  RTtime=[];
  ScreenY=[];
  ScreenX=[];
  var source = context.createBufferSource();
  source.buffer = b;
  source.connect(context.destination);
  source.start(context.currentTime+1.5); // start from 1.5 s after subjct press enter
  startime= context.currentTime+1.5;
  document.removeEventListener('keydown',intro2exp,true);
  document.addEventListener('keydown',datarecorded,true);
  source.onended = function(){
    if (RTtrial==0){
      datareportRTPra()
    }else if (RTtrial<=4 && RTtrial>0) {
      datareportRT()
    }
  }
}
// <report brief result>
function datareportRTPra() {
  // caculate the RT for pracice
  Response_RT=[];
  // find the valid trial (RT<1)
    RTtimeup= RTtime;
    //update data
    db.collection("Auditory-SMS").doc(subjectid).update({
    ['prac_RT'+ RTPractime]:RTtimeup,
     ['prac_RTscreenX'+ RTPractime]:ScreenX,
     ['prac_RTscreenY'+ RTPractime]:ScreenY,
    })
    // report and rest
    changediv(speaker,rest);
    document.removeEventListener('keydown',datarecorded,true);
    if (typeof RTtime !== 'undefined' && RTtime.length > 0) {
    for (i=0; i<Stimuli_RTprac.length; i++){
    var closest=RTtime.find(element => element > Stimuli_RTprac[i]);
    if ((closest-Stimuli_RTprac[i])<=0.6)
    {Response_RT[i]=closest-Stimuli_RTprac[i]; RTtime.splice(RTtime.indexOf(closest), 1);}
    }
    // when valid trials are more than 80%; then start the formal exp
    if ((Response_RT.length/ PracStimuli)>=0.8 && RTtime.length<PracStimuli+3){
    if( RTtime.length>PracStimuli){ document.getElementById('rest').innerText = ' Your average response time is ' + Response_RT.reduce((a, b) => a + b, 0)/ Response_RT.length*1000 +' ms. \n You pressed m bar '+ RTtime.length +' times. Please only press when hearing each tone. \n \n \n After short rest, the formal experiment will start.';
  } else if(RTtime.length<=PracStimuli){    document.getElementById('rest').innerText = 'You made ' + 100*(Response_RT.length/ PracStimuli) +'% valid responses; \n your average response time is ' + Response_RT.reduce((a, b) => a + b, 0)/Response_RT.length*1000+ ' ms. \n \n \n After short rest, the formal experiment will start.';
    }
    RTtrial++;
    ShowProcess();
    setTimeout(function(){ changediv(rest,RTintro); HideProcess();document.addEventListener('keydown',intro2exp,true);},RestTime);
  }
    // when valid trials are less than 8 or subj presses more keys, start practice again.
    if ((Response_RT.length/ PracStimuli)<0.8 && RTtime.length<=PracStimuli+3){
      if (RTPractime< 3 ){ document.getElementById('rest').innerText = 'You pressed m bar '+ RTtime.length +' times.  \n You made ' + 100*(Response_RT.length/ PracStimuli) +'% valid responses;  \n Please press m bar quickly after hearing each tone.';
      ShowProcess();
      setTimeout(function(){ changediv(rest,RTintro_prac); HideProcess();    document.addEventListener('keydown',intro2exp,true);},RestTime);
      }
      if (RTPractime>=3 ){ changediv(rest,QuitPage1);}
     }

    if (RTtime.length>PracStimuli+3){
       if (RTPractime< 3 ){ document.getElementById('rest').innerText = 'You pressed m bar '+ RTtime.length +' times, while there were only 10 tones.\n Please only press m bar quickly only after hearing each tone';
       ShowProcess();
       setTimeout(function(){ changediv(rest,RTintro_prac); HideProcess(); document.addEventListener('keydown',intro2exp,true);},RestTime);
      }
       if (RTPractime>=3 ){ changediv(rest,QuitPage1);}
      }
     } else {
    if (RTPractime< 3 ){ document.getElementById('rest').innerText = ' Your made 0 valid response. \n \n \n  When you hear each tone, press the M bar as quickly as you can.';
    ShowProcess();
    setTimeout(function(){ changediv(rest,RTintro_prac); HideProcess(); document.addEventListener('keydown',intro2exp,true);},RestTime);
   }
    if (RTPractime>=3 ){ changediv(rest,QuitPage1);}
  }
    }
function datareportRT() {
  document.removeEventListener('keydown',datarecorded,true);
     Response_RT=[];
     RTtimeup= RTtime;
    //update data
    db.collection("Auditory-SMS").doc(subjectid).update({
      ['RT'+RTtrial]:RTtimeup,
      ['RTscreenX'+ RTtrial]:ScreenX,
      ['RTscreenY'+ RTtrial]:ScreenY,
    })
    // report and rest
    changediv(speaker,rest);
if (typeof RTtime !== 'undefined' && RTtime.length > 0) {
  if (RT_list[RTtrial-1]==0){Stimuli_RT=RT1}
     else if (RT_list[RTtrial-1]==1) {Stimuli_RT=RT2 }
     else if (RT_list[RTtrial-1]==2) {Stimuli_RT=RT3 }
     else if (RT_list[RTtrial-1]==3) {Stimuli_RT=RT4 }

    for (i=0; i<ExpStimuli; i++){
    var closest=RTtime.find(element => element > Stimuli_RT[i]);
    if ((closest-Stimuli_RT[i])<0.6)
    {Response_RT[i]=closest-Stimuli_RT[i]; RTtime.splice(RTtime.indexOf(closest), 1);}
    }
    if (Response_RT.length< ExpStimuli){
      document.getElementById('rest').innerHTML = 'Your average response time is ' + Response_RT.reduce((a, b) => a + b, 0)/ Response_RT.length*1000 +' ms. You made ' + 100*(Response_RT.length/ExpStimuli)+'% valid responses; \n \n \n  Now take a short rest.';
    } else if (Response_RT.length<ExpStimuli+5 && Response_RT.length>=ExpStimuli) {
      document.getElementById('rest').innerHTML = 'Your average response time is ' + Response_RT.reduce((a, b) => a + b, 0)/ Response_RT.length*1000 + 'ms. You made ' + 100 + '% valid responses; \n \n \n  Now take a short rest.';
   } else {document.getElementById('rest').innerHTML = 'Please only press after hearing each tone! \n \n \n  Now take a short rest.';}
    if (Response_RT.length/ExpStimuli<0.75){
      invalidTrial=invalidTrial+1;
      if (invalidTrial>InvlaidLimit){
        changediv(speaker,QuitPage1);
        changediv(rest,QuitPage1)
      }
    }
  }else {
    document.getElementById('rest').innerText = ' Your made 0 valid response. \n \n \n  When you hear each tone, press the M bar as quickly as you can.';
    invalidTrial=invalidTrial+1; if (invalidTrial>InvlaidLimit){ changediv(speaker,QuitPage1); changediv(rest,QuitPage1)}
  }
    // enter neaxt trial
    RTtrial=RTtrial+1;
    ShowProcess();
    if (RTtrial<=4){
      setTimeout(function(){ changediv(rest,RTintro); HideProcess();document.addEventListener('keydown',intro2exp,true);},RestTime);
    }
    if (RTtrial>4){
      closeFullscreen(); HideProcess();
        changediv(rest,FinalPage2)}
    }


// **********************************************************************************************

// *************************************<SYC Test>*************************************
// <play the sound for SYC test>
function playSYC(b,stopt){
  RTtime=[];
  ScreenY=[];
  ScreenX=[];
  var source = context.createBufferSource();
  source.buffer = b;
  source.connect(context.destination);
  source.start(context.currentTime+1.5); // start from 1.5 s after subjct press enter
  startime= context.currentTime+1.5;
  document.removeEventListener('keydown',intro2exp,true);
  document.addEventListener('keydown',datarecorded,true);
  source.onended = function(){
    if (SYCtrial==0){
      datareportSYCPra()
    }else if (SYCtrial<= SYCSequence && SYCtrial>0) {
      datareportSYC()
    }
  }
}
// <report brief result>
function datareportSYCPra() {
    // caculate the RT for pracice
    Response_RT=[];
    //update data
    db.collection("Auditory-SMS").doc(subjectid).update({
      ['prac_SYC'+ SYCPractime]:RTtime,
      [ 'prac_SYCscreenX'+ SYCPractime]:ScreenX,
      [' prac_SYCscreenY'+ SYCPractime]:ScreenY,
    })
    // generate the stimuli time list
    Stimuli_SYCprac = [];
    Stimuli_SYCprac[0] = 0;
    // report and rest
    changediv(speaker,rest);
    document.removeEventListener('keydown',datarecorded,true);
    if (typeof RTtime !== 'undefined' && RTtime.length > 0) {
    for (i = 1; i <= PracStimuli; i++) {
      Stimuli_SYCprac.push(i*1.1);
    }
    // find the valid trial (RT<1)
    for (i=0; i<Stimuli_SYCprac.length; i++){
    var closest = RTtime.reduce(function(prev, curr) {
      return (Math.abs(curr - Stimuli_SYCprac[i]) < Math.abs(prev - Stimuli_SYCprac[i]) ? curr : prev);
    });
    if (Math.abs(closest-Stimuli_SYCprac[i])<0.4){ Response_RT.push(closest-Stimuli_SYCprac[i]);}
    }
    // when valid trials are more than 80%; then start the formal exp
    if ((Response_RT.length/ PracStimuli)>=0.8 && RTtime.length<PracStimuli+3){
      if (RTtime.length>PracStimuli) {
      document.getElementById('rest').innerText = 'You pressed m bar '+ RTtime.length +' times. Please do not make additional responses. \n \n \n After short rest, the formal experiment will start.';
      } else if (RTtime.length<=PracStimuli){
        document.getElementById('rest').innerText = 'You made ' + 100*(Response_RT.length/ PracStimuli) +'% valid responses; \n \n \n After short rest, the formal experiment will start.';
      }
      SYCtrial++;
      ShowProcess();
      setTimeout(function(){ changediv(rest,SYCintro); HideProcess();document.addEventListener('keydown',intro2exp,true);},RestTime);
     }
    // when valid trials are less than 8 or subj presses more keys, start practice again.
    if ((Response_RT.length/ PracStimuli)<0.8 && RTtime.length<=PracStimuli+3){
      if (SYCPractime< 3 ){ document.getElementById('rest').innerText = 'You made ' + 100*(Response_RT.length/ PracStimuli) +'% valid responses;  \n Please tap along the tones by pressing the M bar.';
      ShowProcess();
      setTimeout(function(){ changediv(rest,SYCintro_prac); HideProcess();document.addEventListener('keydown',intro2exp,true);},RestTime);
    } else if (SYCPractime>=3 ){ changediv(rest,QuitPage1);}
     }
    if (RTtime.length>PracStimuli+3){
       if (SYCPractime<3){ document.getElementById('rest').innerText = 'You pressed m bar '+ RTtime.length +' times, while there were only 10 tones.\n Please tap along the tones by pressing the M bar and do not make additional repsonses!';
       ShowProcess();
       setTimeout(function(){ changediv(rest,SYCintro_prac); HideProcess();document.addEventListener('keydown',intro2exp,true);},RestTime);
     } else if (SYCPractime>=3 ){ changediv(rest,QuitPage1);}
      }
   }else {
     if (SYCPractime<3){ document.getElementById('rest').innerText = 'You made 0 valid repsonse \n Please tap along the tones by pressing the M bar.';
     ShowProcess();
     setTimeout(function(){ changediv(rest,SYCintro_prac); HideProcess();document.addEventListener('keydown',intro2exp,true);},RestTime);
   } else if (SYCPractime>=3 ){ changediv(rest,QuitPage1);}
    }
   }
function datareportSYC() {
     //update data
     db.collection("Auditory-SMS").doc(subjectid).update({
      ['SYC'+SYCtrial]:RTtime,
      ['SYCscreenX'+ SYCtrial]:ScreenX,
      ['SYCscreenY'+ SYCtrial]:ScreenY,
     })
     Response_RT=[];
     // generate the stimuli time list
     Stimuli_SYC = [];
     Stimuli_SYC[0] = 0;
     // report and rest
     changediv(speaker,rest);
     if (typeof RTtime !== 'undefined' && RTtime.length > 0) {
     for (i = 1; i <= ExpStimuli; i++) {
       Stimuli_SYC.push(i*SYCSOA[SYC_list[SYCtrial-1]%5]);
     }
     // find the valid trial (RT<1)
     for (i=0; i<Stimuli_SYC.length; i++){
       var closest = RTtime.reduce(function(prev, curr) {
       return (Math.abs(curr - Stimuli_SYC[i]) < Math.abs(prev - Stimuli_SYC[i]) ? curr : prev);
     });
     if (Math.abs(closest-Stimuli_SYC[i])<0.4){ Response_RT.push(closest-Stimuli_SYC[i])}
     }
     if (Response_RT.length< ExpStimuli){
       document.getElementById('rest').innerHTML = 'You made ' + 100*(Response_RT.length/ExpStimuli)+'% valid responses; \n \n \n  Now take a short rest.';
     } else if (Response_RT.length<ExpStimuli+5 && Response_RT.length>=ExpStimuli) {
       document.getElementById('rest').innerHTML = 'You made ' + 100 + '% valid responses; \n \n \n  Now take a short rest.';
    } else {document.getElementById('rest').innerHTML = 'Please tap along the tones by pressing the M bar.\n Do not make additional responses \n \n \n  Now take a short rest.';}
     if (Response_RT.length/ExpStimuli<0.75){
       invalidTrial=invalidTrial+1;
       if (invalidTrial>InvlaidLimit){
         changediv(speaker,QuitPage1)
         changediv(rest,QuitPage1)
       }
     }
   }else{
     invalidTrial=invalidTrial+1;
     document.getElementById('rest').innerText = 'You made 0 valid repsonse \n Please tap along the tones by pressing the M bar.';
     if (invalidTrial>InvlaidLimit){
       changediv(speaker,QuitPage1)
       changediv(rest,QuitPage1)
     }
   }
    SYCtrial++;
    ShowProcess();
     if (SYCtrial<= SYCSequence  && invalidTrial<=InvlaidLimit){
       setTimeout(function(){ changediv(rest,SYCintro); HideProcess();document.addEventListener('keydown',intro2exp,true);},RestTime);
     } else if (SYCtrial> SYCSequence && invalidTrial<=InvlaidLimit){
        setTimeout(function(){ changediv(rest,RTintro_prac); HideProcess();document.addEventListener('keydown',intro2exp,true);},RestTime);
     }
     document.removeEventListener('keydown',datarecorded,true);
   }

// **********************************************************************************************

// ************* ************************ <Initiate> *********************************************
// setting up auditory environment
var context;
var bufferLoader;
var buffer; // buffer for all the sound
window.AudioContext = window.AudioContext || window.webkitAudioContext; // Fix up prefixing
context = new AudioContext();
// load sound into buffer and generate the trial for RT test
window.onload = loadsound;
function finishedLoading(bufferList) {
    buffer = this.bufferList
  }
function loadsound() {
  bufferLoader = new BufferLoader(context,soundList,finishedLoading);
  bufferLoader.load();
}
// **********************************************************************************************
