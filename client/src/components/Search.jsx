document.getElementById("input-search").addEventListener("input", onInputChange);

function onInputChange(){
    let inputText = document.getElementById("input-search").value;
    console.log(inputText)
}