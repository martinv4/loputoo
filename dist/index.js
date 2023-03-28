var button = document.getElementById("testButton");
var button2 = document.getElementById("button2");
var langButton = document.getElementById("lang");

async function getSelectionText() {
  chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
}, function(selection) {
    testText2 = document.getElementById('testelement2').innerHTML;
    document.getElementById("testelement2").innerHTML = selection[0];
    console.log("test1")
});
}

async function abcFunction(){
  await getSelectionText();

/*   testText = document.getElementById('testelement').innerHTML;
  console.log(testText) */

  testSpeed = document.getElementById('testSpeed').value;
  console.log(testSpeed);

  testSpeaker = document.getElementById('testSpeaker').value;
  console.log(testSpeaker)

  console.log(testText2)

  const res = await fetch('https://api.tartunlp.ai/text-to-speech/v2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: testText2,
      speaker: testSpeaker,
      speed: testSpeed})
  });
  
  if (!res.ok) {
    throw new Error('Fetch failed!');
  }
  
  const wavFile = await res.blob();
  document.querySelector('audio').src = URL.createObjectURL(wavFile);
}

button2.addEventListener("click", function(){
  getSelectionText();
  //pole just parim lahendus, ei tea miks esimene func varem lõpetab
  setTimeout(function (){
    abcFunction();
  }, 1);
  abcFunction();
})

function myFunction2() {
  var x = document.getElementById("lang");
  var spanText = document.getElementById("spanText");
  var button = document.getElementById("button2");
  var speaker = document.getElementById("speaker");
  if (x.innerHTML === "🇪🇪") {
    x.innerHTML = "🇬🇧";
    spanText.innerHTML = "Selected text:";
    button.innerHTML = "BUTTON";
    button.style.color = "#FFFFFF";
    speaker.innerHTML = "Speaker:"
  } else {
    x.innerHTML = "🇪🇪";
    spanText.innerHTML = "Selekteeritud tekst:";
    button.innerHTML = "NUPP";
    button.style.color = "#FFFFFF";
    speaker.innerHTML = "Kõneleja:"
  }
}

langButton.addEventListener("click", myFunction2);