const downloadButton = document.getElementById("downloadButton");

downloadButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ recipient: "background", url: "https://moodle.polymtl.ca/mod/resource/view.php?id=88978", courseName: "test", extension: "" });

    console.log("marcus");
})

chrome.runtime.onMessage.addListener(msg => {
    if (msg.recipient == "popup") {
        console.log(msg.extension);
    }
});
