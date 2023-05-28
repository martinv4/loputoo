var pasteTextButton = document.getElementById("pasteTextButton");
var langButton = document.getElementById("lang");
var changeSpeaker = document.getElementById("appSpeaker");
var changeTempo = document.getElementById("appSpeed");
var tooltip = document.getElementById("tooltip-text");
const target = document.getElementById("help");
var audio = document.getElementById("audio");
var currentLang = document.getElementById("lang");
var spanText = document.getElementById("spanText");
var speaker = document.getElementById("speakerSpan");

/*async function getSelectionText() {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  let currentText;
  document.body.style.cursor = 'wait';
  [{currentText}] = await chrome.scripting.executeScript( {
    target: {tabId: tab.id},
    function: () => getSelection().toString()
}, function(selection) {
    currentText = document.getElementById('placeholderText').innerHTML;
    document.getElementById("placeholderText").innerHTML = selection[0];
    //testida kas funktsioonide nestides alumine probleem paraneks
});
}*/
async function getSelectionText(){
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  let result;
  try {
    [{result}] = await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      function: () => getSelection().toString(),
    });
  } catch (e) {
    return; // ignoring an unsupported page like chrome://extensions
  }
  currentText=result;
  document.getElementById("placeholderText").innerHTML = currentText;
};

async function abcFunction(){
  await getSelectionText();

  appSpeed = document.getElementById('appSpeed').value;
  appSpeaker = document.getElementById('appSpeaker').value;

  const res = await fetch('https://api.tartunlp.ai/text-to-speech/v2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: currentText,
      speaker: appSpeaker,
      speed: appSpeed})
  })
  const res2 = await fetch('https://api.tartunlp.ai/text-to-speech/v2/verbose', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: currentText,
      speaker: appSpeaker,
      speed: appSpeed})
  }).then (res2 => res2.json());
  
  //lõikab algusest ja lõpust neurokõne api poolt tekitatud kasutud numbrid
  const frames = res2.duration_frames.slice(1, -1)

  let durationAsString = frames
   .join('#')                     // merge into a string
   .split(/(?:^|#)(0)(?:#|$)/)    // split on X (but retain them)
   .filter(Boolean)               // remove empty values
   .map(v => v.split('#'));       // split on #

//konverteerib subarrayd numbriteks
function conv(durationAsString) {
  // iterate over the array
  return durationAsString.map(function(v) {
    // if the element is an array call the function recursively
    // or parse the number and treat NaN as 0
    return Array.isArray(v) ? conv(v) : Number(v) || 0;
  })
}
durationAsNumbers = conv(durationAsString);

// liidab subarrayd
 var durationFrames = [];
durationAsNumbers.forEach(function(item) {
  item = item.reduce(function(a, b) {
    return a + b;
  });
  durationFrames.push([item]);
});

//eemaldab 0 arrayd aka tühikud
function removeSubArray(source, sub) {
  let i = source.length;
  while(i--) {
    if (source[i].length === sub.length && sub.every((n, j) => n === source[i][j])) {
      source.splice(i, 1);
    }
  }
}

const arr2 = [0];
removeSubArray(durationFrames, arr2);

var words = $("#placeholderText").text().split(" ");
$("#placeholderText").empty();
$.each(words, function(i, v) {
    $("#placeholderText").append($("<span class='highlighted'>").text(v).append(" "));
    
});

  if (!res.ok) {
    throw new Error('Fetch failed!');
  }

  const wavFile = await res.blob();
  document.querySelector('audio').src = URL.createObjectURL(wavFile);

  //bimodal / karaoke
  audio.onplay = function biModal(){
    var i=0;
    var changeText = function(){
      $(".highlighted:not(.blu):first")
          .addClass("blu");
          i++;
      setTimeout(changeText, durationFrames[i]/appSpeed*12);
      //console.log(durationFrames[i]);
     }
     setTimeout(changeText, durationFrames[i]/appSpeed*12);
  }
  
  //console.log(localStorage.toggled)
  document.body.style.cursor = 'default'
}

pasteTextButton.addEventListener("click", function(){
  getSelectionText();
  //pole just parim lahendus, ei tea miks esimene func varem lõpetab
  setTimeout(function (){
    abcFunction();
  }, 10);
  abcFunction();
})


//UI language
function changeLanguageENG() {
    currentLang.innerHTML = "🇬🇧";
    spanText.innerHTML = "Selected text:";
    pasteTextButton.innerHTML = "Paste selection";
    pasteTextButton.style.color = "#FFFFFF";
    speaker.innerHTML = "Speaker:"
  }
function changeLanguageEST() {
    currentLang.innerHTML = "🇪🇪";
    spanText.innerHTML = "Valitud tekst:";
    pasteTextButton.innerHTML = "Kleebi valik";
    pasteTextButton.style.color = "#FFFFFF";
    speaker.innerHTML = "Kõneleja:"
  }

  $(langButton).on('click',function(){

    //localstorage values are always strings (no booleans)  

    if (localStorage.toggled != "EST" ) {
       localStorage.toggled = "EST";
       changeLanguageEST();
    } else {
       localStorage.toggled = "ENG";
       changeLanguageENG();
    }
 });
 window.addEventListener("load", (event) => {
  if (localStorage.toggled == "ENG"){
    changeLanguageENG();
  }
});

// et ei peaks Main nuppu vajutama peale sätete muutmist
changeSpeaker.addEventListener("change", abcFunction);
changeTempo.addEventListener("change", abcFunction);

//tooltip
target.addEventListener('mouseover', () => {
  tooltip.style.display = 'block';
}, false);

target.addEventListener('mouseleave', () => {
  tooltip.style.display = 'none';
}, false);