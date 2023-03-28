var button = document.getElementById("testButton");
var button2 = document.getElementById("button2");

async function getSelectionText() {
  chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
}, function(selection) {
    document.getElementById("testelement2").innerHTML = selection[0];
    testText2 = document.getElementById('testelement2').innerHTML;
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
  abcFunction();
})