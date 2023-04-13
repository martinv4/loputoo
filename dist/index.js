var button = document.getElementById("testButton");
var button2 = document.getElementById("button2");
var langButton = document.getElementById("lang");
var changeSpeaker = document.getElementById("appSpeaker");
var changeTempo = document.getElementById("appSpeed");
var tooltip = document.getElementById("tooltip-text");
const target = document.getElementById("help");

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
  
  if (!res.ok) {
    throw new Error('Fetch failed!');
  }

  const wavFile = await res.blob();
  document.querySelector('audio').src = URL.createObjectURL(wavFile);
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

function changeLanguage() {
  localStorage.language = "EST";
  //hetkel ei tööta kuni localstorage korras pole
  var x = document.getElementById("lang");
  var spanText = document.getElementById("spanText");
  var button = document.getElementById("button2");
  var speaker = document.getElementById("speaker");
  if (localStorage.language = "EST") {
    localStorage.language = "ENG"
    x.innerHTML = "🇬🇧";
    spanText.innerHTML = "Selected text:";
    button.innerHTML = "Paste selection";
    button.style.color = "#FFFFFF";
    speaker.innerHTML = "Speaker:"
  } if (localStorage.language = "ENG") {
    localStorage.language = "EST"
    x.innerHTML = "🇪🇪";
    spanText.innerHTML = "Valitud tekst:";
    button.innerHTML = "Kleebi valik";
    button.style.color = "#FFFFFF";
    speaker.innerHTML = "Kõneleja:"
  }
}

// et ei peaks Main nuppu vajutama peale sätete muutmist
langButton.addEventListener("click", changeLanguage);
changeSpeaker.addEventListener("change", abcFunction);
changeTempo.addEventListener("change", abcFunction);

//tooltip
target.addEventListener('mouseover', () => {
  tooltip.style.display = 'block';
}, false);

target.addEventListener('mouseleave', () => {
  tooltip.style.display = 'none';
}, false);