var button = document.getElementById("testButton");
var button2 = document.getElementById("button2");
var langButton = document.getElementById("lang");
var changeSpeaker = document.getElementById("appSpeaker");
var changeTempo = document.getElementById("appSpeed");
var tooltip = document.getElementById("tooltip-text");
const target = document.getElementById("help");
var audio = document.getElementById("audio");
window.localStorage.setItem("preferDark", "EST");

async function getSelectionText() {
  document.body.style.cursor = 'wait';
  chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
}, function(selection) {
    testText2 = document.getElementById('testelement2').innerHTML;
    document.getElementById("testelement2").innerHTML = selection[0];
    console.log("test1")
    //testida kas funktsioonide nestides alumine probleem paraneks
});
}

async function abcFunction(){
  await getSelectionText();

  appSpeed = document.getElementById('appSpeed').value;
  console.log(appSpeed);

  appSpeaker = document.getElementById('appSpeaker').value;
  console.log(appSpeaker)

  console.log(testText2)

  const res = await fetch('https://api.tartunlp.ai/text-to-speech/v2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: testText2,
      speaker: appSpeaker,
      speed: appSpeed})
  })
  const res2 = await fetch('https://api.tartunlp.ai/text-to-speech/v2/verbose', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: testText2,
      speaker: appSpeaker,
      speed: appSpeed})
  }).then (res2 => res2.json());
  
  console.log(res);
  console.log(res2.duration_frames);
  const frames = res2.duration_frames.slice(1, -1)
  console.log(frames);
  //const sum = framesClean.reduce((a,b)=>a+b);
  //console.log(sum);
  let out = frames
  .join('#')                     // merge into a string
  .split(/(?:^|#)(0)(?:#|$)/)    // split on X (but retain them)
  .filter(Boolean)               // remove empty values
  .map(v => v.split('#'));       // split on #

console.log(out);

//konverteerib subarrayd numbriteks
function conv(out) {
  // iterate over the array
  return out.map(function(v) {
    // if the element is an array call the function recursively
    // or parse the number and treat NaN as 0
    return Array.isArray(v) ? conv(v) : Number(v) || 0;
  })
}
outNumbers = conv(out);

/* var numberArray = [];
var arrayLength = out.length;
for (var i = 0; i < arrayLength; i++)
numberArray.push(parseInt(out[i]));
console.log(numberArray);  */

// liidab subarrayd
 var newOut = [];
outNumbers.forEach(function(item) {
  item = item.reduce(function(a, b) {
    return a + b;
  });
  newOut.push([item]);
});

function removeSubArray(source, sub) {
  let i = source.length;
  while(i--) {
    if (source[i].length === sub.length && sub.every((n, j) => n === source[i][j])) {
      source.splice(i, 1);
    }
  }
}

const arr2 = [0];

removeSubArray(newOut, arr2);
console.log(newOut);

var words = $("#testelement2").text().split(" ");
$("#testelement2").empty();
$.each(words, function(i, v) {
    $("#testelement2").append($("<span class='testhighlight'>").text(v).append(" "));
    
});

  if (!res.ok) {
    throw new Error('Fetch failed!');
  }

  const wavFile = await res.blob();
  document.querySelector('audio').src = URL.createObjectURL(wavFile);
  audio.onplay = function biModal(){
    var i=0;
    var changeText = function(){
      $(".testhighlight:not(.blu):first")
          .addClass("blu");
          i++;
      setTimeout(changeText, newOut[i]/appSpeed*12);
      console.log(newOut[i]);
     }
     setTimeout(changeText, newOut[i]/appSpeed*12);
  }
  
  console.log(localStorage.toggled)
  document.body.style.cursor = 'default'
}

button2.addEventListener("click", function(){
  getSelectionText();
  //pole just parim lahendus, ei tea miks esimene func varem lõpetab
  setTimeout(function (){
    abcFunction();
  }, 10);
  abcFunction();
})
var x = document.getElementById("lang");
var spanText = document.getElementById("spanText");
var button = document.getElementById("button2");
var speaker = document.getElementById("speaker");

function changeLanguageENG() {
    x.innerHTML = "🇬🇧";
    spanText.innerHTML = "Selected text:";
    button.innerHTML = "Paste selection";
    button.style.color = "#FFFFFF";
    speaker.innerHTML = "Speaker:"
  }
function changeLanguageEST() {
    x.innerHTML = "🇪🇪";
    spanText.innerHTML = "Valitud tekst:";
    button.innerHTML = "Kleebi valik";
    button.style.color = "#FFFFFF";
    speaker.innerHTML = "Kõneleja:"
  }

  $(langButton).on('click',function(){

    //localstorage values are always strings (no booleans)  

    if (localStorage.toggled != "EST" ) {
       localStorage.toggled = "EST";
    } else {
       localStorage.toggled = "ENG";
    }
    console.log(localStorage.toggled)
 });
 window.addEventListener("load", (event) => {
  if (localStorage.toggled == "ENG"){
    changeLanguageENG();
  }
});

// et ei peaks Main nuppu vajutama peale sätete muutmist
// ENABLE THIS
//langButton.addEventListener("click", changeLanguage);
changeSpeaker.addEventListener("change", abcFunction);
changeTempo.addEventListener("change", abcFunction);

//tooltip
target.addEventListener('mouseover', () => {
  tooltip.style.display = 'block';
}, false);

target.addEventListener('mouseleave', () => {
  tooltip.style.display = 'none';
}, false);