
(function () {
  console.log('app.js is running!');
 

  var AudioContext = window.AudioContext; //AudioApi
  if (AudioContext){
  var context =  new AudioContext(); // if we can use AudioContext 
  }
 

  var sounds = [
    'hihatAnalog.wav',
    'openhatTight.wav',
    'kickFloppy.wav',
    'kickHeavy.wav',
    'snareAnalog.wav',
    'snareBlock.wav'
  ];
  var soundsUrl = './sounds/';  //var soundPath = soundsUrl + sounds[i]

  var BPM=120;
  var STEPS = 8;
  



  ////////////////////////////////////////////////////////
  ////////////////////                   /////////////////
  ////////////////////  AUDIOCONTEXT API /////////////////
  ////////////////////                   /////////////////
  ////////////////////////////////////////////////////////

  var buffers = {};
  
 

  var playSound = function (index) {
  var soundPath = soundsUrl + sounds[index];

    if (typeof(buffers[soundPath]) == 'undefined'){
      buffers[soundPath] = null;
      var req = new XMLHttpRequest(); //generate a request to load sounds.
      req.open('GET', soundPath, true); //initializes the request
      req.responseType='arraybuffer'; //make response an 'arrayBuffer'. This is returned as binary, so its more compact, faster to load.

      //decodes asynchronously
      req.onload = function(){    //when page loads, use AudioContext to decode the binary audio data
        context.decodeAudioData(req.response, function(buffer){  //call back that provides decoded audio
          buffers[soundPath] = buffer; //'buffer' holds all sound paths
          playBuffer(buffer);
          //console.log(buffer)
        },
        function(err){
          console.log(err);
        });
      };
      req.send();
    }

    function playBuffer(buffer){
      let source = context.createBufferSource();  //create source for AudioContext. Needed for playback source
      source.buffer = buffer;   //sets source and buffer
      
///////////////////////////
///////  AUDIO NODES! /////
///////////////////////////
    var distortion = context.createWaveShaper();  
    var gain = context.createGain();
  
    source.connect(distortion);
    distortion.connect(gain);
    gain.connect(context.destination)

///////////////////////////
///////  GAIN SLIDER  /////
///////////////////////////

      let currentValue;
      let currentGain = document.getElementById('currentValue').innerHTML;
      
      $(function(){
        currentValue = $('#currentValue');
        $('#defaultSlider').change(function(){
          currentValue.html(this.value);
         });
        $('#defaultSlider').change();
      });

    gain.gain.value = currentGain*.1;


///////////////////////////////////
/////// DISTORTION FUNCTION   /////
///////////////////////////////////
     
      var dist = document.getElementById('currentDist').innerHTML;
      var currentDist;
      var distAmount = parseInt(dist, 10);
      
     $(function(){          // distortion slider
        currentDist = $('#currentDist');
        $('#distSlider').change(function(){
          currentDist.html(this.value);
         });
        $('#distSlider').change();
      });


      function makeDistortionCurve(amount) {
        var k = typeof amount === 'number' ? amount : 0,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
          for ( ; i < n_samples; ++i ) {
           x = i * 2 / n_samples - 1;
            curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
          }
      return curve;

      };

      distortion.curve = makeDistortionCurve(distAmount);
      distortion.oversample = '4x';


    
   
 


////////////////////////



    //***source.connect(context.destination);  //connects the source to the AudioContext destination (where the audio plays(computer speakers!))
    
      source.start(); //play this source now!
    };
      if(buffers[soundPath]){
        playBuffer(buffers[soundPath]);
      }
  };
  
  

/////////////////////////////////////
///////                 /////////////
///////  CREATING GRID  /////////////
///////                 /////////////
/////////////////////////////////////

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




///////////////////////////////////
///////////////////////////////////
///////  SAVE PROGRAM       ///////
///////////////////////////////////
///////////////////////////////////

var saveProgram = function(){
  console.log('saveProgram button press')
  
  var programData={}; //this holds all the data in an object to be saved to the DB 
                      // soundName is the key, the array is the value.

  sounds.forEach(function (sound){
    var soundName = sound.split('.')[0];  //grabs sound name for later use in object as key.

    var hitsArr = (new Array(STEPS)).fill(0);  //creates array, defaults values per number of STEPS to 0 (off)

    var hits = document.querySelectorAll(`.beat.${soundName}`)//uses template literal to grab each 'beat' that has a unique 'soundName'. 

    for(var i=0; i<hits.length; i++){ 
      if (hits[i].classList.contains('on')){ //if button has class 'on'
        hitsArr[i] = 1; //push '1' to hitsArr corresponding [i]
      }   
    }
    programData[soundName]=hitsArr; 
    
  });
  console.log(programData)

  


////////////////////////////////////
/////   SAVE TO DATABASE       /////
////////////////////////////////////

  var hiHat1 = Object.values(programData.hihatAnalog); //these pull the data (pattern) out of each instrument
  var hiHat2 = Object.values(programData.openhatTight);
  var kick1 = Object.values(programData.kickFloppy);
  var kick2 = Object.values(programData.kickHeavy);
  var snare1 = Object.values(programData.snareAnalog);
  var snare2 = Object.values(programData.snareBlock);
  var timeStamp = new Date().toLocaleString().split(', ');
  var title = $("#title").val();
  var programsUrl = "/api/programs";

  console.log(timeStamp)
  
  $.ajax({
    method: "POST",
    url: programsUrl,
    data: {
      inst1: hiHat1,
      inst2: hiHat2,
      inst3: kick1,
      inst4: kick2,
      inst5: snare1,
      inst6: snare2,
      title: title,
      timeStamp: timeStamp 
    },
    success: function(){
      console.log('ajax POST success')
    }
  })
};
document.querySelector('#save').addEventListener('click', saveProgram);




////////////////////////////////////
////////////////////////////////////
/////    Get List of BEATZ     /////
////////////////////////////////////
////////////////////////////////////

  var getUrl= "/api/programs";
  var allBeatz;

  function seeBeatz(data){
    $.get("/api/programs")
      .done(function (data){
        let allBeatz= data;
        console.log("seeBeatz hit")
        console.log(allBeatz);
        renderBeatz();
      })
  }

////////////////////////////////////
/////   Put beatz list ON PAGE /////
////////////////////////////////////

  function renderBeatz (){
    console.log('renderBeatz func hit')
    $('#allBeatzList').html('');
    $.get('/api/programs')
      .done(function(data){
        let allBeatz  = data;
        allBeatz.forEach(function(beatz){
          allBeatzHTML = 
            "<a href='#' class='item oneBeatz' data-beatz-id='" + beatz._id + "'>" 
             +beatz.title+  " " + "<button type='button' id='titleButton' class='btn-primary btnAdd btnList'>Change Title</button> <button type='button' id='deleteBeatzButton' class='btn-danger btnRemove btnList'>Remove This Beat</button> <button class='bt-default btnReLoad btnList' id='reLoadButton'>Re-Load</button></a>"
          $('#allBeatzList').append(allBeatzHTML)
        })
      })
  }
  document.querySelector('#seeBeatz').addEventListener('click', seeBeatz);



////////////////////////////////////
/////    DELETE this BEATZ     /////
////////////////////////////////////

$("#allBeatzList").on('click', '#deleteBeatzButton', function(event){  //#allBeatzList div needs to render before button/function can be used. Else, error.
    console.log('deleteBeatz hit')
    var thisBeatzId = $(this).parents('.oneBeatz').data('beatz-id');
    console.log('deleting this beatz ' + thisBeatzId);
    var byThisURL = "/api/programs/" + thisBeatzId + "";
    $.ajax({
      method: "DELETE",
      url: byThisURL,
      success: function(){
        console.log("ajax delete success!");
        renderBeatz(allBeatz)
      }
    })
  })

////////////////////////////////////
////  Change Title of BEATZ    /////
////////////////////////////////////
let beatzId;
let byThisUrl;

$("#allBeatzList").on('click', '#titleButton', function(event){  
  console.log("change title button hit");
  beatzId = $(this).parents('.oneBeatz').data('beatz-id');  //get get id of clicked item
  console.log('changing title ' + beatzId);
    byThisURL = "/api/programs/" + beatzId + ""; //use id to locate item in db
    $('#titleModal').data(beatzId);  //populate modal with data related to id
    $('#titleModal').modal()
    $.get("/api/programs/"+beatzId+"")  
      .done(function(data){
        console.log(data.title);
        $("#beatzTitle").val(data.title)    //beatzTitle is populated with title from object
      })
})

$("#titleModal").on('click', '#saveTitle', function(event){ //change title
  console.log("save title button hit " + beatzId);
  var titleBox = $("#beatzTitle").val();  
  $(".titleInput").val(titleBox);  //populate input box 'titleInput' with db title from modal
  $.ajax({
    method: "PUT",
    url: byThisURL,
    data: {
      title: titleBox,    //replace title in db object with new title
    },
    success: function(allBeatz){
      console.log("ajax update title success");  
      $("#titleModal").modal('hide');  //hide modal on success
      $("#beatzTitle").val('');     //clear values from input area 
      renderBeatz();  // rerender list
    }
  })
})


////////////////////////////////////
/////    RELOAD Beatz          /////
////////////////////////////////////

  $("#allBeatzList").on('click', '#reLoadButton', function(){
  
    var beatzId = $(this).parents('.oneBeatz').data('beatz-id')
    $.get("/api/programs/"+ beatzId + "")
      .done(function(data){
        $('.titleInput').val(data.title)
      
        str1 = data.inst1.split(',');    // converts all pattern STRINGS to pattern ARRAYs
        arr1=[];
        for(i=0; i<str1.length; i++){
        arr1.push(parseInt(str1[i]));
        }
          console.log('arr1 ' +arr1)
        str2 = data.inst2.split(',');
        arr2=[];
        for(i=0; i<str2.length; i++){
          arr2.push(parseInt(str2[i]));
        }
        
        str3 = data.inst3.split(',');
        arr3=[];
        for(i=0; i<str3.length; i++){
          arr3.push(parseInt(str3[i]));
        }
        
        str4 = data.inst4.split(',');
        arr4=[];
        for(i=0; i<str4.length; i++){
          arr4.push(parseInt(str4[i]));
        }
        
        str5 = data.inst5.split(',');
        arr5=[];
        for(i=0; i<str5.length; i++){
          arr5.push(parseInt(str5[i]));
        }
        
        str6 = data.inst6.split(',');
        arr6=[];
        for(i=0; i<str6.length; i++){
          arr6.push(parseInt(str6[i]));
        }
    
        var hihatAnalog= document.querySelectorAll('.hihatAnalog')  //re-initialize variables
        var openhatTight= document.querySelectorAll('.openhatTight')
        var kickFloppy= document.querySelectorAll('.kickFloppy')
        var kickHeavy= document.querySelectorAll('.kickHeavy')
        var snareAnalog= document.querySelectorAll('.snareAnalog')
        var snareBlock= document.querySelectorAll('.snareBlock')

        for(var i=0; i<arr1.length;i++){          //loop through each button(beat) per instrument. Assign 'on' to calss if database array has a 1 in the current index 
          if(arr1[i]===1){
            hihatAnalog[i].className += ' on';
          }
        }
        for(var j=0; j<arr2.length;j++){
          if(arr2[j]===1){
            openhatTight[j].className += ' on';
          }
        }
        for(var k=0; k<arr3.length;k++){
          if(arr3[k]===1){
            kickFloppy[k].className += ' on';
          }
        }
        for(var l=0; l<arr4.length;l++){
          if(arr4[l]===1){
            kickHeavy[l].className += ' on';
          }
        }
        for(var m=0; m<arr5.length;m++){
          if(arr5[m]===1){
            snareAnalog[m].className += ' on';
          }
        }
        for(var n=0; n<arr6.length;n++){
          if(arr6[n]===1){
            snareBlock[n].className += ' on';
          }
        }
      })
  })





////////////////////////////////////
////////////////////////////////////
/////    LOOP THROUGH MACHINE  /////
////////////////////////////////////
////////////////////////////////////


  // This animation/loop is based on time, NOT per frame refresh. That is why we use the 'new Date().getTime()' to measure time between animations.
  //sets all variables on page load
  var currentStep = 0;
  var lastStep = STEPS - 1;
  var stepTime = 1/(4*BPM/(60*1000)) //60*1000 (since we need mili-sec), 4*BPM (since we have 4 beats per measure), 4*BPM/(60*1000) (length of time allowed per-measure), 1/ (length of time per each beat)

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
     
      //return handle;
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



  ////////////////////////////////////////////////////////
  ////////////////////                   /////////////////
  ////////////////////  AUDIO EFFECTS    /////////////////
  ////////////////////                   /////////////////
  ////////////////////////////////////////////////////////

  




})()//this runs the function!




