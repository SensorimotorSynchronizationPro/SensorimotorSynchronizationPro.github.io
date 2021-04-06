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

var RTSOA = [1, 1.3, 1.6, 1.9, 2.2, 2.5, 2.8, 3.1, 3.4, 3.7]; // Real ISI
var RTvalid = 800; //the max RT (in s) for valid trials in RT task
var RTtrial=0; // finishesd RT trial
var RTPractime=0; // RT pracice time
var RTPra_list = shuffle(Array.from(new Array(PracStimuli).keys())); // the randomized ISI sequence for RT test practice
var RT_list = shuffle(Array.from(new Array(ExpStimuli *2).keys())); // the randomized ISI sequence for RT test
var RTtime;
var InvlaidLimit=2
// Stimuli
var fixSize=15; //fixation size in pixel

//record subj behaviror when subj enter or exit fullscreen mode & during exp
var ScreenY=[];
var ScreenX=[];

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
       //RT practice
       if (RTtrial==0){
        changediv(RTintro_prac,myCanvas)
        playRT();
       }
       // RT formal exp
       if ( RTtrial>0 ) {
          changediv(RTintro,myCanvas)
          playRT();
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
    var width = (RTtrial)/3;
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
  var actualCode = "rte";
  var wirteCode=document.getElementById("Code").value;
  if (actualCode.localeCompare(wirteCode) != 0) {
    alert("Make sure to find the code from the instruction before proceeding!")
    return;
  } else {
    db.collection('New-Flash-Reac').doc(subjectid).set({
    RT_list:RT_list,
    RTPra_list:RTPra_list,
    })
    .then(function() {
      console.log("Document successfully written!");
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
    changediv(introEXP,RTintro_prac);
    openFullscreen();
    document.addEventListener('keydown',intro2exp,true);
  }
}
// end exp
function saveFeedback1(){
   closeFullscreen()
  if (subjectid.charAt(subjectid.length-1)<TotalParts){
    db.collection('New-Flash-Reac').doc(subjectid).update({
      feedback:document.getElementById("ReactQ").value,
    })
    subjtimes=+subjectid.charAt(subjectid.length-1)+1;
    window.location.href = link[sequence[subjectid.charCodeAt(2)%TotalParts][subjtimes-1]] + '?'+subjectid+ subjtimes;
    }else if (subjectid.charAt(subjectid.length-1)==TotalParts){
      db.collection('New-Flash-Reac').doc(subjectid).update({
        feedback:document.getElementById("ReactQ").value,
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

// ************* ************************ <Reaction time task> *********************************************
// start each sequence
function playRT() {
  document.removeEventListener('keydown',intro2exp,true);
  document.addEventListener('keydown',datarecorded,true);
  RTtime=[];
  RTRecord=[];
  Onset=[];
  ScreenY=[];
  ScreenX=[];
  ntrial=0;
  // draw fixation point
  drawLine(fixSize,fixSize);
  circle.visibleCountdown = circle.visibleDuration;
  if (RTtrial ==0){setTimeout(function(){startTime= lastTime = onsetTime=performance.now();window.requestAnimationFrame(animateRTPra);},1500)}
  if (RTtrial>0){setTimeout(function(){startTime= lastTime = onsetTime=performance.now();window.requestAnimationFrame(animateRT);},1500)}
};
// plot stimuli
function animateRTPra() {
    AnimeID=window.requestAnimationFrame(animateRTPra);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var elapsed = window.performance.now() - lastTime;
    lastTime = window.performance.now();
        circle.visibleCountdown -= elapsed;
        if (circle.visibleCountdown >= 0) {
            drawCircle(circle);
        }
        if (circle.visibleCountdown <= - RTSOA[RTPra_list[ntrial]%10]*1000+2) {
          ntrial=ntrial+1;
          lastonset=onsetTime;
          onsetTime=window.performance.now();
          Onset.push(onsetTime);
          if (ntrial>=PracStimuli){
          RTPractime=RTPractime+1;
          datareportRTPra()
          }
          circle.visibleCountdown = circle.visibleDuration;
        }
}
function animateRT() {
    AnimeID=window.requestAnimationFrame(animateRT);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var elapsed =  window.performance.now()- lastTime;
    lastTime = window.performance.now();
        circle.visibleCountdown -= elapsed;
        if (circle.visibleCountdown > 0) {
            drawCircle(circle);
        }

        if (circle.visibleCountdown <= - RTSOA[RT_list[(RTtrial-1)*ExpStimuli+ntrial]%10]*1000) {
            circle.visibleCountdown = circle.visibleDuration;
            onsetTime=window.performance.now();
            Onset.push(onsetTime);
             ntrial=ntrial+1;
             if (ntrial>=ExpStimuli){
             datareportRT()
             }
        }
}
// feedback after each sequence
function datareportRTPra() {
  window.cancelAnimationFrame(AnimeID)
  // caculate the RT for pracice
  Response_RT=[];
    // report and rest
    changediv(myCanvas,rest);
    document.removeEventListener('keydown',datarecorded,true);
    if (typeof RTtime !== 'undefined' && RTtime.length > 0) {
    // find the valid trial (RT<1)
    Response_RT=RTtime.filter(x => {return x <= RTvalid});
    // when valid trials are more than 80%; then start the formal exp
    if ((Response_RT.length/ PracStimuli)>=0.8 && RTtime.length>PracStimuli && RTtime.length<PracStimuli+3){
      document.getElementById('restreport').innerText = ' Your average response time is ' + Response_RT.reduce((a, b) => a + b, 0)/ Response_RT.length +' ms. \n You pressed m bar'+ RTtime.length +' times. Please only press when you see the balck dot. \n \n \n After short rest, the formal experiment will start.';
    RTtrial= RTtrial+1;
    ShowProcess();
    setTimeout(function(){   document.addEventListener('keydown',intro2exp,true);changediv(rest,RTintro); HideProcess();},RestTime);
    }
    if ((Response_RT.length/ PracStimuli)>=0.8 && RTtime.length<=PracStimuli){
      document.getElementById('restreport').innerText = 'You made ' + 100*(Response_RT.length/ PracStimuli) +'% valid responses; \n your average response time is ' + Response_RT.reduce((a, b) => a + b, 0)/Response_RT.length+ ' ms. \n \n \n After short rest, the formal experiment will start.';
    RTtrial= RTtrial+1;
    ShowProcess();
    setTimeout(function(){ document.addEventListener('keydown',intro2exp,true);changediv(rest,RTintro); HideProcess();},RestTime);
    }
    // when valid trials are less than 8 or subj presses more keys, start practice again.
    if ((Response_RT.length/ PracStimuli)<0.8 && RTtime.length<=PracStimuli+3){
      if (RTPractime< 3 ){ document.getElementById('restreport').innerText = 'You pressed m bar '+ RTtime.length +' times.  \n You made ' + 100*(Response_RT.length/ PracStimuli) +'% valid responses;  \n Please press m bar quickly after you see the balck dot.';
      ShowProcess();
      setTimeout(function(){   document.addEventListener('keydown',intro2exp,true);changediv(rest,RTintro_prac); HideProcess();},RestTime);
    }
      if (RTPractime>=3 ){ changediv(rest,QuitPage1);}
     }
    if (RTtime.length>PracStimuli+3){
       if (RTPractime< 3 ){ document.getElementById('restreport').innerText = 'You pressed m bar'+ RTtime.length +' times, while there were only 15 dots.\n Please only press m bar quickly only after you see the balck dot.';
       ShowProcess();
       setTimeout(function(){   document.addEventListener('keydown',intro2exp,true);changediv(rest,RTintro_prac); HideProcess();},RestTime);
      }
       if (RTPractime>=3 ){ changediv(rest,QuitPage1);}
      }
    }else {
      if (RTPractime< 3 ){ document.getElementById('restreport').innerText = 'You made 0 valid response.\n  When the dot appears, press the M bar as quickly as you can.';
      ShowProcess();
      setTimeout(function(){   document.addEventListener('keydown',intro2exp,true);changediv(rest,RTintro_prac); HideProcess();},RestTime);
     }
      if (RTPractime>=3 ){ changediv(rest,QuitPage1);}
    }
      //update data
      db.collection("New-Flash-Reac").doc(subjectid).update({
        ['prac_RT'+ RTPractime]:RTtime,
        ['prac_RTtimeline'+ RTPractime]:RTRecord,
       ['prac_RTscreenX'+ RTPractime]:ScreenX,
       ['prac_RTscreenY'+ RTPractime]:ScreenY,
       ['prac_RTOnset'+ RTPractime]:Onset,
      })
}
function datareportRT() {
    window.cancelAnimationFrame(AnimeID)
    document.getElementById('Correct').style.display='none';
    document.getElementById('Wrong').style.display='none';
    // report and rest
    changediv(myCanvas,rest);
    if (typeof RTtime !== 'undefined' && RTtime.length > 0) {
    Response_RT=RTtime.filter(x => {return x <= RTvalid});
    if (Response_RT.length< ExpStimuli){
      document.getElementById('restreport').innerText = 'Your average response time is ' + Response_RT.reduce((a, b) => a + b, 0)/ Response_RT.length +' ms. You made ' + 100*(Response_RT.length/ExpStimuli)+'% valid responses; \n \n \n  Now take a short rest.';
    } else if (Response_RT.length<ExpStimuli+5 && Response_RT.length>=ExpStimuli) {
      document.getElementById('restreport').innerText = 'Your average response time is ' + Response_RT.reduce((a, b) => a + b, 0)/ Response_RT.length + 'ms. You made ' + 100 + '% valid responses; \n \n \n  Now take a short rest.';
   } else {document.getElementById('restreport').innerText = ' Please do not make additional responses! \n \n \n  Now take a short rest.';}

    if (Response_RT.length/ExpStimuli<0.75){
      invalidTrial=invalidTrial+1;
      if (invalidTrial>InvlaidLimit){
        changediv(myCanvas,QuitPage1)
        changediv(rest,QuitPage1)
      }
    }
  }else {
    document.getElementById('restreport').innerText = 'You made 0 valid response.\n  When the dot appears, press the M bar as quickly as you can.';
      invalidTrial=invalidTrial+1;
      if (invalidTrial>InvlaidLimit){
        changediv(myCanvas,QuitPage1)
        changediv(rest,QuitPage1)
      }
    }
    //update data
    db.collection("New-Flash-Reac").doc(subjectid).update({
      ['RT'+RTtrial]:RTtime,
      ['RTtimeline'+ RTtrial]:RTRecord,
      ['RTscreenX'+ RTtrial]:ScreenX,
      ['RTscreenY'+ RTtrial]:ScreenY,
      ['RTOnset'+ RTtrial]:Onset,
    })
    RTtrial=RTtrial+1;
    ShowProcess();
    if (RTtrial<3){
      setTimeout(function(){ changediv(rest,RTintro); HideProcess();document.addEventListener('keydown',intro2exp,true);},RestTime);
    }
    if (RTtrial==3){

           changediv(rest,FinalPage1); HideProcess();


    }
  document.removeEventListener('keydown',datarecorded,true);
}
// **********************************************************************************************
