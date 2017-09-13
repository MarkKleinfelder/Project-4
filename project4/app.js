
(function () {
  console.log('app.js is running!');
 



  var sounds = [
    'hihat-analog.wav',
    'kick-floppy.wav',
    'kick-heavy.wav',
    'openhat-tight.wav',
    'snare-analog.wav',
    'snare-block.wav'
  ];
  var soundsUrl = '/sounds/';

  var BPM = 120;
  var STEPS = 8;




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
      $newButton.classList.add('soundName');  //adds class name relating to instrument 
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
    if(!$playBeats.length)  //if there are no $playBeats (NO beats are engaged), do nothing.
      return;
    for(var i = 0; i<sounds.length; i++){  //ELSE, iterate over rows and over all columns
      for(var j = 0; j<STEPS; j++){
        var cell = $playBeats[j + (i * STEPS)];  //
        if (cell) {
          cell.classList.remove('on');
        }
      }
    }
  };
  document.querySelector("#clear").addEventListener('click', clearBeat);
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

