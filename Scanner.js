function playSound() {
    document.getElementById("scanSound").play();
}

/* URL DETECTION */
function checkURL() {
    playSound();

    let url = urlInput.value;
    let result = document.getElementById("result");
    let progress = document.getElementById("progress");

    progress.style.width = "0%";

    fakeAIScan(() => {

        let score = 0;

        if (url.length > 30) score++;
        if (!url.startsWith("https")) score++;
        if (url.includes("@") || url.includes("-")) score++;

        let dots = (url.match(/\./g) || []).length;
        if (dots > 3) score++;

        let scamWords = ["free","win","money","offer"];
        if (scamWords.some(w => url.toLowerCase().includes(w))) score++;

        let confidence = score * 20;

        progress.style.width = confidence + "%";

        result.innerHTML = `
        ${score>=3 ? "🚨 MALICIOUS URL" : "✅ SAFE URL"} <br>
        Confidence: ${confidence}% <br>
        AI Analysis: ${score} suspicious features detected
        `;

        result.classList.add("show");
        if(score >= 3){
  let threats = parseInt(localStorage.getItem("threats")) || 0;
  threats++;
  localStorage.setItem("threats", threats);
}

        let scans = parseInt(localStorage.getItem("scans")) || 0;
        scans++;
        localStorage.setItem("scans", scans);
        let history = JSON.parse(localStorage.getItem("history")) || [];

        history.push("Scanned at " + new Date().toLocaleTimeString());

        localStorage.setItem("history", JSON.stringify(history));
    });
}

/* MESSAGE DETECTION */
function checkMessage() {
    let msg = messageInput.value.toLowerCase();
    let result = document.getElementById("msgResult");

    let score = 0;
    let type = "General Scam";

    if (msg.includes("lottery")) type="Lottery Scam";
    if (msg.includes("bank")) type="Bank Fraud";

    if (msg === msg.toUpperCase()) score++;
    if ((msg.match(/!/g)||[]).length>3) score++;

    let words=["urgent","free","money","otp","verify"];
    words.forEach(w=>{if(msg.includes(w)) score++;});

    if (msg.includes("http")) score++;

    let confidence=score*15;

    result.innerHTML=`
    ${score>=3?"🚨 Scam Message":"✅ Safe Message"}<br>
    Type: ${type}<br>
    Confidence: ${confidence}%<br>
    Reason: Suspicious keywords & patterns
    `;

    result.classList.add("show");

    if(score >= 3){
  let threats = parseInt(localStorage.getItem("threats")) || 0;
  threats++;
  localStorage.setItem("threats", threats);
}
    let scans = parseInt(localStorage.getItem("scans")) || 0;
    scans++;
    localStorage.setItem("scans", scans);

    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.push("Scanned at " + new Date().toLocaleTimeString());

    localStorage.setItem("history", JSON.stringify(history));
}

/* PDF DETECTION */
async function checkPDF() {
    let file = pdfInput.files[0];
    let result = document.getElementById("pdfResult");

    let reader = new FileReader();

    reader.onload = async function() {
        let pdf = await pdfjsLib.getDocument(new Uint8Array(this.result)).promise;
        let text="";

        for(let i=1;i<=pdf.numPages;i++){
            let page=await pdf.getPage(i);
            let content=await page.getTextContent();
            text+=content.items.map(i=>i.str).join(" ");
        }

        let score=0;
        let type="Unknown";

        if(text.includes("otp")) type="Bank Fraud";
        if(text.includes("winner")) type="Lottery Scam";

        ["free","money","urgent","verify"].forEach(w=>{
            if(text.toLowerCase().includes(w)) score++;
        });

        if(text.includes("http")) score++;

        let confidence=score*10;

        result.innerHTML=`
        ${score>=3?"🚨 Scam PDF":"✅ Safe PDF"}<br>
        Type: ${type}<br>
        Confidence: ${confidence}%<br>
        Reason: Keywords + links detected
        `;

        result.classList.add("show");

        if(score >= 3){
  let threats = parseInt(localStorage.getItem("threats")) || 0;
  threats++;
  localStorage.setItem("threats", threats);
}
        let scans = parseInt(localStorage.getItem("scans")) || 0;
        scans++;
        localStorage.setItem("scans", scans);

        let history = JSON.parse(localStorage.getItem("history")) || [];

        history.push("Scanned at " + new Date().toLocaleTimeString());

        localStorage.setItem("history", JSON.stringify(history));
    };

    reader.readAsArrayBuffer(file);
}
/* qr code detector */

let historyList = document.getElementById("history");

// 🔥 SCAN UPLOAD QR (AI powered)
function scanQRImage() {
    const fileInput = document.getElementById("qrImageInput");

    if (!fileInput.files.length) {
        alert("Upload image first");
        return;
    }

    const file = fileInput.files[0];

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
            console.log("QR FOUND:", code.data);

            // 🔥 DIRECT RESULT SHOW (NO FUNCTION DEPENDENCY)
            const resultBox = document.getElementById("qrResult");

            let status = "✅ SAFE";
            let color = "lime";

            if (code.data.includes("upi://")) {
                status = "💰 UPI Payment QR";
                color = "cyan";
            }

            if (code.data.startsWith("http")) {
                status = "⚠️ Suspicious Link";
                color = "orange";
                if(score >= 3){
  let threats = parseInt(localStorage.getItem("threats")) || 0;
  threats++;
  localStorage.setItem("threats", threats);
}
            }

            resultBox.innerHTML = `
                <div style="
                    padding:15px;
                    border-radius:10px;
                    background:#020617;
                    box-shadow:0 0 10px ${color};
                    margin-top:10px;
                ">
                    <h3 style="color:${color};">🔍 Scan Result</h3>
                    <p style="word-break:break-all;">${code.data}</p>
                    <b style="color:${color};">${status}</b>
                </div>
            `;

        } else {
            document.getElementById("qrResult").innerHTML =
                "<span style='color:red'>❌ QR not detected</span>";
        }
    };
}
// 🔥 AI ANALYSIS
function analyzeQR(text) {
    let status = "✅ SAFE";
    let color = "lime";
    let reason = "No threat detected";

    // URL detection
    if (text.startsWith("http")) {
        status = "⚠️ Suspicious Link";
        color = "orange";
        reason = "External URL detected";

        // 🔥 phishing keywords
        const dangerWords = ["login", "verify", "bank", "update", "secure"];
        dangerWords.forEach(word => {
            if (text.toLowerCase().includes(word)) {
                status = "🚨 Phishing Risk";
                color = "red";
                reason = "Contains phishing keyword: " + word;
            }
        });

        // 🔥 short link detection
        if (text.includes("bit.ly") || text.includes("tinyurl")) {
            status = "🚨 Shortened URL (High Risk)";
            color = "red";
            reason = "Short links can hide malicious sites";
        }
    }

    // UPI detection
    if (text.includes("upi://")) {
        status = "💰 UPI Payment QR";
        color = "cyan";
        reason = "Payment request detected";
    }

    showResult(text, status, color, reason);
    addToHistory(text, status);
}

// 🔥 RESULT UI
function showResult(text) {
    const resultBox = document.getElementById("qrResult");

    let status = "✅ SAFE";
    let color = "lime";

    if (text.includes("upi://")) {
        status = "💰 UPI Payment QR";
        color = "cyan";
    }

    if (text.startsWith("http")) {
        status = "⚠️ Suspicious Link";
        color = "orange";
    }

    resultBox.innerHTML = `
        <div style="
            padding:15px;
            border-radius:10px;
            background:#020617;
            box-shadow:0 0 10px ${color};
        ">
            <h3 style="color:${color};">Scan Result</h3>
            <p>${text}</p>
            <b style="color:${color};">${status}</b>
        </div>
    `;
    let scans = parseInt(localStorage.getItem("scans")) || 0;
    scans++;
    localStorage.setItem("scans", scans);

    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.push("Scanned at " + new Date().toLocaleTimeString());

    localStorage.setItem("history", JSON.stringify(history));
}

// 🔥 ERROR
function showError(msg) {
    document.getElementById("qrResult").innerHTML =
        `<span style="color:red">${msg}</span>`;
}

/* AI ANIMATION */
function typeText(el,text,speed,cb){
    el.innerText="";
    let i=0;
    let t=setInterval(()=>{
        el.innerText+=text[i++];
        if(i>=text.length){
            clearInterval(t);
            setTimeout(cb,300);
        }
    },speed);
}

function fakeAIScan(cb){
    let scan=document.getElementById("aiScan");
    let text=document.getElementById("scanText");

    scan.classList.remove("hidden");

    let steps=[
        "Initializing AI...",
        "Scanning data...",
        "Analyzing patterns...",
        "Detecting threats...",
        "Finalizing..."
    ];

    let i=0;

    function next(){
        if(i<steps.length){
            typeText(text,steps[i++],30,next);
        }else{
            setTimeout(()=>{
                scan.classList.add("hidden");
                cb();
            },500);
        }
    }

    next();
}

/* MATRIX */
const canvas=document.getElementById("matrix");
const ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let letters="01";
let fontSize=14;
let columns=canvas.width/fontSize;
let drops=Array(Math.floor(columns)).fill(1);

function draw(){
    ctx.fillStyle="rgba(0,0,0,0.05)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="#00ffcc";
    ctx.font=fontSize+"px monospace";

    drops.forEach((y,i)=>{
        let text=letters[Math.floor(Math.random()*letters.length)];
        ctx.fillText(text,i*fontSize,y*fontSize);

        if(y*fontSize>canvas.height&&Math.random()>0.975) drops[i]=0;
        drops[i]++;
    });
}

setInterval(draw,33);