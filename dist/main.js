var button = document.getElementById("testButton");
button.addEventListener("click", function(e){
    e.preventDefault();
    const req = new XMLHttpRequest();
    const baseUrl = "https://api.tartunlp.ai/text-to-speech/v2"

    req.open("POST", baseUrl, true);
    req.setRequestHeader("Content-type", "application/json")
    req.send({ "text": "testing", "speaker": "mari", "speed": 1});

    req.onreadystatechange = function(){
        if(this.readyState === XMLHttpRequest.DONE && this.status === 200){
            console.log("got response 200!")
        } else {
            console.log("??")
        }
    }
})