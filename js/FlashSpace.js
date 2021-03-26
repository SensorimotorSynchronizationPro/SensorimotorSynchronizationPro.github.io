// add white noise to flash to avoid & decrease the sound feedback
// for attentional check, for sex sequences, a word is added at the end of audio
// test parts
var link =[
 'FlashSpa.html','FlashBas.html','FlashRea.html','FlashTim.html',
]

// avoiding spa and tim link together
var sequence = [
  [0,1,2,3],
  [0,2,1,3],
  [3,1,2,0],
  [3,2,1,0],
  [0,2,3,1],
  [3,2,0,1],
  [1,0,2,3],
  [1,3,2,0],
];


var TotalParts=4;

// ************* ************************ <EXP parameters> *********************************************
var ntrial // for recording the repeatting time within each trial
var startTime // for recoding the time info in drwing & data
var lastTime // for recoding the time info in drwing
var onsetTime
var PracStimuli = 15 //Practice stimuli number in each sequence
var ExpStimuli =45 //EXP stimuli number in each sequence
var RestTime=5000 // resting time between sequences (in ms)
var invalidTrial =0
var SYCSequence=4;// syc trials
var InvlaidLimit =2 // the max invalid number of trial

var SYCtrial=0; // finishesd SYC trial
var SYCPractime=0; // finishesd SYC trial
var SYCSOA = 2400;
var PracSOA = 1400;
var SYC_list = shuffle(Array.from(new Array(SYCSequence).keys())); // the randomized ISI trials for SYC test // for SYC prac: ISI=1s

// Stimuli
var fixSize=15; //fixation size in pixel

//record subj behaviror when subj enter or exit fullscreen mode & during exp
var ScreenY=[];
var ScreenX=[];
// ************* ************************ <Sound > *********************************************
var soundList = [
    '../sound/apple.mp3', '../sound/bottle.mp3','../sound/cat.mp3',
  '../sound/dog.mp3', '../sound/lake.mp3', '../sound/offer.mp3',
  '../sound/WhiteNoise.mp3'];
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

// ************* ************************ <Initiate> *********************************************
// setting up auditory environment
var context;
var bufferLoader;
window.AudioContext = window.AudioContext || window.webkitAudioContext; // Fix up prefixing
context = new AudioContext();
var buffer=loadsound(); // buffer for all the sound
function finishedLoading(bufferList) {
    buffer = this.bufferList
  }
function loadsound() {
  bufferLoader = new BufferLoader(context,soundList,finishedLoading);
  bufferLoader.load();
  return this.bufferList
}
// **********************************************************************************************

// ************* ************************ <Initiate + basic func> *********************************************
// change screen content
function changediv(id1,id2){
  id2.style.display='block';
  id1.style.display='none';
  return false;
}
//draw stimuli
function drawCircle(circle) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = circle.color;
    ctx.fill();
    ctx.globalAlpha = 1.00;
}
function drawLine(x,y){
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, canvas.height/2+y);
  ctx.lineTo(canvas.width/2, canvas.height/2-y);
  ctx.moveTo(canvas.width/2+x, canvas.height/2);
  ctx.lineTo(canvas.width/2-x, canvas.height/2);
  ctx.lineWidth=3;
  ctx.stroke();
}
// start each trial
function intro2exp(e){
     //checks whether the pressed key is "Enter"
     if (e.keyCode == 13){
      // SYC pracice
      if (SYCtrial==0){
          changediv(SYCintro_prac,myCanvas);
          playSYC();
        }
      //SYC formal exp
      if (SYCtrial>0 && SYCtrial<=  SYCSequence){
          changediv(SYCintro,myCanvas)
          playSYC();
        }
      }
}
// record data
function datarecorded (e) {
     //checks whether the pressed key is "m"
    if (e.keyCode == 77 ){
      RTtime.push(window.performance.now()-onsetTime)
      RTRecord.push(window.performance.now());
      ScreenY.push(window.innerHeight);
      ScreenX.push(window.innerWidth);
          };
}
function datarecordedSYC (e) {
     //checks whether the pressed key is "m"
    if (e.keyCode == 77 ){
      RTtime.push(window.performance.now()-onsetTime)

      ScreenY.push(window.innerHeight);
      ScreenX.push(window.innerWidth);
          };
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
    var width = (SYCtrial)/(SYCSequence+1);
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
  var actualCode = "sus";
  var wirteCode=document.getElementById("Code").value;
  if (actualCode.localeCompare(wirteCode) != 0) {
    alert("Make sure to find the code from the instruction before proceeding!")
    return;
  } else {
    db.collection('New-Flash-Space').doc(subjectid).set({
    SYC_list:SYC_list,
    })
    .then(function() {
      console.log("Document successfully written!");
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
function saveFeedback1(){
   closeFullscreen()
  if (subjectid.charAt(subjectid.length-1)<TotalParts){
    db.collection('New-Flash-Space').doc(subjectid).update({
      feedback:document.getElementById("SpaceQ").value,
    })
    subjtimes=+subjectid.charAt(subjectid.length-1)+1;
    window.location.href = link[sequence[subjectid.charCodeAt(2)%2][subjtimes-1]] + '?'+subjectid+ subjtimes;
    }else if (subjectid.charAt(subjectid.length-1)==TotalParts){
      db.collection('New-Flash-Space').doc(subjectid).update({
        feedback:document.getElementById("SpaceQ").value,
      })
      changediv(FinalPage1,FinalPage2)
      }
    }
// end exp
function saveFeedback2(){
    var comment=document.getElementById("feedback2").value;
    db.collection('New-Flash').doc(subjectid).set({
      comment:comment,
    })
    changediv(FinalPage2,ThanksPage)
  }
// **********************************************************************************************


// ************************************* <Sychronization task> *********************************************
// start each sequence
function playSYC() {
  document.removeEventListener('keydown',intro2exp,true);
  document.addEventListener('keydown',datarecordedSYC,true);
  RTtime=[];
  Onset=[];
  RTRecord=[];
  ScreenY=[];
  ScreenX=[];
  ntrial=0;
  circle.visibleCountdown = circle.visibleDuration
  drawLine(fixSize,fixSize);
  if (SYCtrial ==0){ playWhitenoise (1.4*PracStimuli-0.1+1.5); setTimeout(function(){startTime= lastTime = onsetTime=performance.now(); animateSYCPra();},1500)}
  if (SYCtrial>0){  playWhitenoise (SYCSOA *ExpStimuli/1000-0.1+1.5);
    setTimeout(function(){startTime= lastTime = onsetTime=performance.now();animateSYC();},1500)
  }
};
// plot stimuli
function animateSYCPra() {
    canvas.style.display='none';
     if (SYCPractime==0) {
       changediv(SYCintro_prac,SYCISIPrac1);
       setTimeout(function(){ changediv(SYCISIPrac1,QuestionPra);},PracSOA*PracStimuli-20)
     } else if (SYCPractime==1) {
       changediv(SYCintro_prac,SYCISIPrac2);
       setTimeout(function(){ changediv(SYCISIPrac2,QuestionPra);},PracSOA*PracStimuli-20)
     } else if (SYCPractime==2) {
       changediv(SYCintro_prac,SYCISIPrac3);
       setTimeout(function(){ changediv(SYCISIPrac3,QuestionPra);},PracSOA*PracStimuli-20)
     }
}
function animateSYC() {
   canvas.style.display='none';
   if ([SYC_list[SYCtrial-1]]==0) {changediv(SYCintro,SYCISI01);
      setTimeout(function(){ changediv(SYCISI01,Question);}, SYCSOA *ExpStimuli-20)
    } else if ([SYC_list[SYCtrial-1]]==1){changediv(SYCintro,SYCISI02);
      setTimeout(function(){ changediv(SYCISI02,Question);}, SYCSOA *ExpStimuli-20)
    } else if ([SYC_list[SYCtrial-1]]==2){changediv(SYCintro,SYCISI11);
      setTimeout(function(){ changediv(SYCISI11,Question);}, SYCSOA *ExpStimuli-20)
    } else if ([SYC_list[SYCtrial-1]]==3){changediv(SYCintro,SYCISI12);
      setTimeout(function(){ changediv(SYCISI12,Question);}, SYCSOA *ExpStimuli-20)
    }
}
// feedback after each sequence
function datareportSYCPra() {
   // caculate the RT for pracice
   Response_RT=[];
   changediv(QuestionPra,rest);
   document.removeEventListener('keydown',datarecordedSYC,true);
   if (document.getElementById("auditestpra").value==1){
     document.getElementById('Correct').style.display='block';
     document.getElementById('Wrong').style.display='none';
     wrong=0;
   } else {
     document.getElementById('Correct').style.display='none';
     document.getElementById('Wrong').style.display='block';
      wrong=1;
   }
   //update data
   db.collection("New-Flash-Space").doc(subjectid).update({
   ['prac_SYC'+ SYCPractime]:RTtime,
   ['prac_SYCscreenX'+ SYCPractime]:ScreenX,
   ['prac_SYCscreenY'+ SYCPractime]:ScreenY,
  })
   SYCPractime=SYCPractime+1;
  // generate the stimuli time list
  Stimuli_SYCprac = [];
  Stimuli_SYCprac[0] = 0;
  for (i = 1; i <= PracStimuli; i++) {
    Stimuli_SYCprac.push(i*PracSOA);
  }
  // report and rest
  //check participante press m or not
  if (typeof RTtime !== 'undefined' && RTtime.length > 0) {
    // find the valid trial (RT<1)
    for (i=0; i<Stimuli_SYCprac.length; i++){
    var closest = RTtime.reduce(function(prev, curr) {
      return (Math.abs(curr - Stimuli_SYCprac[i]) < Math.abs(prev - Stimuli_SYCprac[i]) ? curr : prev);
    });
    if (Math.abs(closest-Stimuli_SYCprac[i])<450){ Response_RT.push(closest-Stimuli_SYCprac[i]);}
    }
    // when valid trials are more than 80%; then start the formal exp
    if ((Response_RT.length/PracStimuli)>=0.8 && RTtime.length>PracStimuli && RTtime.length<PracStimuli+3){
    document.getElementById('restreport').innerText = ' \n \n \n You pressed m bar '+ RTtime.length +' times. Please only tap in Synchronization with black dots. ';
    ShowProcess();
    if (wrong==0){
      SYCtrial++;
      setTimeout(function(){   document.addEventListener('keydown',intro2exp,true);changediv(rest,SYCintro); HideProcess();},RestTime);
    } else if (wrong==1){setTimeout(function(){   document.addEventListener('keydown',intro2exp,true);changediv(rest,SYCintro_prac); HideProcess();},RestTime);}
   }
    if ((Response_RT.length/PracStimuli)>=0.8 && RTtime.length<=PracStimuli){
      document.getElementById('restreport').innerText = ' \n \n \n You made ' + 100*(Response_RT.length/ PracStimuli) +'% valid responses.';
      ShowProcess();
      if (wrong==0){
        SYCtrial++;
        setTimeout(function(){   document.addEventListener('keydown',intro2exp,true);changediv(rest,SYCintro); HideProcess();},RestTime);
      } else if (wrong==1){setTimeout(function(){   document.addEventListener('keydown',intro2exp,true);changediv(rest,SYCintro_prac); HideProcess();},RestTime);}
  }
    // when valid trials are less than 8 or subj presses more keys, start practice again.
    if ((Response_RT.length/PracStimuli)<0.8 && RTtime.length<PracStimuli+3){
      if (SYCPractime< 3 ){ document.getElementById('restreport').innerText = 'You made ' + 100*(Response_RT.length/ PracStimuli) +'% valid responses; \n \n \n Please press m bar quickly only after you see the balck dot.';
      setTimeout(function(){   document.addEventListener('keydown',intro2exp,true);changediv(rest,SYCintro_prac); HideProcess();},RestTime);}
      if (SYCPractime>=3 ){ changediv(rest,QuitPage1);}
     }
    if (RTtime.length>=PracStimuli+3){
       if (SYCPractime< 3 ){ document.getElementById('restreport').innerText = 'You pressed m bar '+ RTtime.length +' times, while there were only 15 dots. Please tap in synchrony with the dots by pressing the M bar and do not make additional responses.';
       ShowProcess();
       setTimeout(function(){  document.addEventListener('keydown',intro2exp,true);changediv(rest,SYCintro_prac); HideProcess();},RestTime);
       }
       if (SYCPractime>=3 ){ changediv(rest,QuitPage1);}
      }
     }else {
     if (SYCPractime< 3 ){ document.getElementById('restreport').innerText = 'You made 0 valid response. Please tap in synchrony with the dots by pressing the M bar.';
     ShowProcess();
     setTimeout(function(){  document.addEventListener('keydown',intro2exp,true);changediv(rest,SYCintro_prac); HideProcess();},RestTime);
     }
     if (SYCPractime>=3 ){ changediv(rest,QuitPage1);}
   }

  }
function datareportSYC() {
  Response_RT=[];
  changediv(Question,rest);
  document.removeEventListener('keydown',datarecordedSYC,true);
  if (SYC_list[SYCtrial-1]<=2 && document.getElementById("auditest").value==1+SYC_list[SYCtrial-1]){
    document.getElementById('Correct').style.display='block';
    document.getElementById('Wrong').style.display='none';
  } else if (SYC_list[SYCtrial-1]>2 && document.getElementById("auditest").value==0){
    document.getElementById('Correct').style.display='block';
    document.getElementById('Wrong').style.display='none';
  }
  else{
    document.getElementById('Correct').style.display='none';
    document.getElementById('Wrong').style.display='block';
     invalidTrial=invalidTrial+1;;
  }
  //update data
  db.collection("New-Flash-Space").doc(subjectid).update({
    ['SYC'+SYCtrial]:RTtime,
    ['SYCscreenX'+ SYCtrial]:ScreenX,
    ['SYCscreenY'+ SYCtrial]:ScreenY,
  })
  // generate the stimuli time list
  Stimuli_SYC = [];
  Stimuli_SYC[0] = 0;
  for (i = 1; i <= ExpStimuli; i++) {
    Stimuli_SYC.push(i*SYCSOA);
  }
  // report and rest
  if (typeof RTtime !== 'undefined' && RTtime.length > 0) {
    // find the valid trial (RT<1)
    for (i=0; i<Stimuli_SYC.length; i++){
    var closest = RTtime.reduce(function(prev, curr) {
      return (Math.abs(curr - Stimuli_SYC[i]) < Math.abs(prev - Stimuli_SYC[i]) ? curr : prev);
    });
    if (Math.abs(closest-Stimuli_SYC[i])<500){ Response_RT.push(closest-Stimuli_SYC[i]);}
    }
  // report and rest  changediv(myCanvas,rest);
  if (Response_RT.length< ExpStimuli){
    document.getElementById('restreport').innerText = 'You made ' + 100*(Response_RT.length/ExpStimuli)+'% valid responses; \n \n \n  Now take a short rest.';
    } else if (Response_RT.length<ExpStimuli+5 && Response_RT.length>=ExpStimuli) {
    document.getElementById('restreport').innerText = 'You made ' + 100 + '% valid responses; \n \n \n  Now take a short rest.';
  } else {document.getElementById('restreport').innerText = 'Please tap in synchrony with the dots by pressing the M bar and do not make additional responses!\n \n \n  Now take a short rest.';
   }

   if (Response_RT.length/ExpStimuli<0.75){
     document.getElementById('restreport').innerText = 'You made '+ 100*(Response_RT.length/ExpStimuli)+'%  valid response. Please tap in synchrony with the dots by pressing the M bar.';
     invalidTrial=invalidTrial+1;;
     if (invalidTrial>InvlaidLimit){
       changediv(myCanvas,QuitPage1)
       changediv(rest,QuitPage1)
     }
   }
 }else {
   document.getElementById('restreport').innerText = 'You made 0 valid response. Please tap in synchrony with the dots by pressing the M bar.';
   invalidTrial=invalidTrial+1;;
 if (invalidTrial>InvlaidLimit){
   changediv(myCanvas,QuitPage1)
   changediv(rest,QuitPage1)
 }}

  SYCtrial=SYCtrial+1;
  ShowProcess();
  if (SYCtrial<=  SYCSequence){
    setTimeout(function(){ changediv(rest,SYCintro); HideProcess();document.addEventListener('keydown',intro2exp,true);},RestTime);
  } else{
         changediv(rest,FinalPage1); HideProcess();
          }
}
function playWhitenoise (stopt){;
  var source = context.createBufferSource();
  source.buffer = buffer[6];
  source.connect(context.destination);
  source.start(context.currentTime);
  source.stop(context.currentTime+stopt);
  source.onended = function(){
    if (SYCtrial==0){PlayWord(0)}
    else if (SYC_list[SYCtrial-1]<=2){
      PlayWord(SYC_list[SYCtrial-1])
     }
   }
}
function PlayWord(b){;
  var source2 = context.createBufferSource();
  source2.buffer = buffer[b];
  source2.connect(context.destination);
  source2.start(context.currentTime);
}
// *****************************************************************************************************
