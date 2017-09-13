
(function () {
  console.log('app.js is running!');
 

  var AudioContext = window.AudioContext;


  var sounds = [
    'hihat-analog.wav',
    'kick-floppy.wav',
    'kick-heavy.wav',
    'openhat-tight.wav',
    'snare-analog.wav',
    'snare-block.wav'
  ];
  var soundsUrl = '/sounds/';
  //var soundPath = soundsUrl + sounds[i]

  var BPM = 90;
  var STEPS = 8;


  ///////////////////  AUDIOCONTEXT API  /////////////////////////////
  var buffers = {};
  
  if (AudioContext){
  var context =  new AudioContext(); // if we can use AudioContext 
  }

  var playSound = function (index) {
    var soundPath = soundsUrl + sounds[index];

    if (!AudioContext){
      new Audio(soundPath).play();
      return;
    }

    if (typeof(buffers[soundPath]) == 'undefined'){
      buffers[soundPath] = null;
      var req = new XMLHttpRequest(); //generate a request to load sounds.
      req.open('GET', soundPath, true); //initializes the request
      req.responseType='arrayBuffer'; //make response an 'arrayBuffer'. This is returned as binary, so its more compact, faster to load.

      //decodes asynchronously
      req.onload = function(){    //when page loads, use AudioContext to decode the binary audio data
        context.decodeAudioData(req.response, function(buffer){  //call back that provides decoded audio
         buffers[soundPath] = buffer; 
         playBuffer(buffer);
       },
       function(err){
        console.log(err);
       });
       };
    req.send();
  }

  function playBuffer(buffer){
    var source = context.createBufferSource();  //create source for AudioContext. Needed for playback source
    source.buffer = buffer;   //sets source and buffer
    source.connect = (context.destination);  //connects the source to the AudioContext destination (where the audio plays(computer speakers!))
    source.start(); //play this source now!
  };
    if(buffers[soundPath]){
      playBuffer(buffers[soundPath]);
    }
  
    console.log(buffers)




//creating grid
  var soundsLength = sounds.length;

  var $machineGrid = document.querySelectorAll('.machineGrid')[0]; //define $maachineGrid - visual grid for DM
  var $button = document.createElement('button');//define clickable buttons on DM grid
  $button.classList.add('beat') //adds class to each button generated

  for(var i = 0; i<sounds.length; i++){ //generate rows per number of instruments
    for (var j = 0; j<STEPS; j++){      //generate columns per number of STEPS
      var $newButton = $button.cloneNode(true);  //clones $button as defined above
      if (j === 0) {
        $newButton.classList.add('first') //adds 'first' class to all buttons in first column
      }
      var soundName = sounds[i].split('.')[0]; //takes the file name of each sound file, splits at the '.' then assigns the first part of the split (cuts off the '.wav')
      $newButton.classList.add(soundName);  //adds class name relating to instrument 
      $newButton.dataset.instrument = soundName; //generates data field 'instrument' that equals the soundName

      $newButton.addEventListener('click', function(){  //adds event listener to all n$ewButtons
        this.classList.toggle('on');  // all $newButtons toggle position set to false (off)
      }, false);
      $machineGrid.appendChild($newButton); //appends all new buttons to machineGrid div
    }
  }
  var $beats = document.querySelectorAll('.beat'); //gets all buttons with class '.beats'
  
  var clearBeat = function(){
    $playBeats = document.querySelectorAll('.beat.on'); // $playBeats are all engaged 'beat'
    console.log($playBeats) //logs objects for each .on button.
    if(!$playBeats.length)  //if there are no $playBeats (NO beats are engaged), do nothing.
      return;
    for(var i = 0; i<sounds.length; i++){  //ELSE, iterate over all rows and all columns
      for(var j = 0; j<STEPS; j++){
        var cell = $playBeats[j + (i * STEPS)];  // TRY *refactor* if(playBeats) remove on. **************
        if (cell) {
          cell.classList.remove('on');
        }
      }
    }
  };
  document.querySelector("#clear").addEventListener('click', clearBeat);


////////////////////////////////////
////////////////////////////////////
/////    LOOP THROUGH MACHINE  /////
////////////////////////////////////
////////////////////////////////////


  // This animation/loop is based on time, NOT per frame refresh. That is why we use the 'new Date().getTime()' to measure time between animations.
  //sets all variables on page load
  var currentStep = 0;
  var lastStep = STEPS - 1;
  var stepTime = 1/(4*BPM/(60*1000))  //60*1000 (since we need mili-sec), 4*BPM (since we have 4 beats per measure), 4*BPM/(60*1000) (length of time allowed per-measure), 1/ (length of time per each beat)

  //sets start time on animation to current time of day. Uses time of day (not timers run by the CPU) to keep sync. 
  function requestInterval(fn, delay){ //requestInterval replaces 'setInterval'. Works with requestAnimationFrame
    var start = new Date().getTime(); // TRY *refactor* change to +new Date. Updated syntax. Changes date/time to integer.
    var handle ={};

    //this handles the loop timing/sync. and makes loop run ∞ 
    function loop(){
      var current = new Date().getTime(); //time at animation complete.
      var delta = current - start; //calculates time passed since last animation frame (delta).
      if(delta>=delay){ //if the time between animations (delta) >= delay time, re-run loop(), re-set 'start' so 'delta' still works. Keeps time correctly.
        fn.call();
        start = new Date().getTime(); // TRY *refactor* change to +new Date. Updated syntax. Changes date/time to integer.
      }
      handle.value = requestAnimationFrame(loop) //when screen is ready, run loop().
    }
      handle.value = requestAnimationFrame(loop)
     
      return handle;
  }


    //adds and removes classes to $beats currently being played (simulate moving playhead). 
    requestInterval(function() {    //iterate through sounds array (all sounds in machineGrid)
      for (var i = 0; i < soundsLength; i++) {  
        var lastBeat = $beats[i * STEPS + lastStep];  //identify $beats playHead just passed
        var currentBeat = $beats[i * STEPS + currentStep];  //identify $beats at playhead
        lastBeat.classList.remove('playHead');  //remove the 'playHead' class from $beat
        currentBeat.classList.add('playHead');  //add class 'playHead' to $beat
        if (currentBeat.classList.contains('on')) { 
          playSound(i); //plays sound if $beat has class 'on'
      }
    }
    lastStep = currentStep;
    currentStep = (currentStep + 1) % STEPS;
  }, stepTime); //uses stepTime from above to stay sync'd to sound and visuals



})()//this runs the function!








// var tick = new Audio('/sounds/hihat-analog.wav');




// $().button('toggle')




// $( "#tick" ).mousedown(function boom(){
//   var counter = 0;
//   var i = setInterval(function(){
//     tick.play()
//     console.log('sounds!');
//     counter++;
//     if(counter === 10) {
//         clearInterval(i);
//     }
// }, 500);
// })



// $( "#boom" ).mousedown(function boom(){
//   var boom = new Audio('/sounds/kick-floppy.wav');
//   var counter = 0;
//   var i = setInterval(function(){
//     boom.play()
    
//     console.log('sounds!');
//     counter++;
//     if(counter === 10) {
//         clearInterval(i);
//     }
// }, 500);

//   })


// $( "#booms" ).click(function boom(){

//   var boom = new Audio('/sounds/snare-analog.wav');
//   var counter = 0;
//   var i = setInterval(function(){
//     boom.play()
//     console.log('sounds!');
//     counter++;
//     if(counter === 10) {
//         clearInterval(i);
//     }
// }, 500);

//   })

