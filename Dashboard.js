// 🔐 LOGIN CHECK
if(localStorage.getItem("isLoggedIn") !== "true"){
  window.location="index.html";
}

// USER
let user = localStorage.getItem("currentUser");
let lastLogin = localStorage.getItem("lastLogin");

userName.innerText = "👤 " + user;
document.getElementById("lastLogin").innerText = "🕒 " + (lastLogin || "First Login");

// DATA
let scans = parseInt(localStorage.getItem("scans")) || 0;
let threats = parseInt(localStorage.getItem("threats")) || 0;

// COUNTER
function animate(id,val){
  let i=0;
  let t=setInterval(()=>{
    document.getElementById(id).innerText=i;
    i++;
    if(i>val) clearInterval(t);
  },20);
}
animate("scanCount",scans);
animate("threatCount",threats);

// HISTORY
let history = JSON.parse(localStorage.getItem("history")) || [];
history.slice(-10).reverse().forEach(x=>{
  let li=document.createElement("li");
  li.innerText=x;
  historyList.appendChild(li);
});

// ALERT
if(threats>0){
  alertBox.classList.remove("hidden");
  alertSound.play();
  setTimeout(()=>alertBox.classList.add("hidden"),3000);
}

// CLOCK
setInterval(()=>{
  clock.innerText="🕒 "+new Date().toLocaleString();
},1000);

// PROGRESS
let level = (threats/(scans||1))*100;
progressBar.style.width = level+"%";

// SUCCESS RATE
let safe = scans - threats;
let rate = scans ? ((safe/scans)*100).toFixed(1):0;
successRate.innerText = "🎯 Safe Rate: "+rate+"%";

// AI TIPS
let tips = ["Never share OTP","Avoid unknown links","Check HTTPS","Scan QR before payment"];
setInterval(()=>{
  document.querySelector(".ai-box").innerText =
  "🤖 "+tips[Math.floor(Math.random()*tips.length)];
},3000);

// CHART
new Chart(chart,{
  type:"pie",
  data:{
    labels:["Safe","Threats"],
    datasets:[{
      data:[scans-threats,threats],
      backgroundColor:["#00ffcc","red"]
    }]
  }
});

// 🔥 DYNAMIC SECTION
function showSection(type){
  let box = document.getElementById("dynamicContent");

  if(type==="dashboard"){
    box.innerHTML="🚀 Welcome to Cyber Dashboard";
  }

  if(type==="scan"){
    box.innerHTML=`<h3>Recent Scans</h3>
    <ul>
      <li>google.com - Safe</li>
      <li>malware.xyz - Threat</li>
      <li>youtube.com - Safe</li>
    </ul>`;
  }

  if(type==="threats"){
    box.innerHTML=`<h3>Threat Details</h3>
    <ul>
      <li>Phishing Attack</li>
      <li>Trojan Script</li>
    </ul>`;
  }

  if(type==="logs"){
    box.innerHTML=`<h3>System Logs</h3>
    <p>Scan started...</p>
    <p>Threat detected!</p>`;
  }
}

// NAV
function goScanner(){
  window.location="scanner.html";
}

// LOGOUT
function logout(){
  localStorage.removeItem("isLoggedIn");
  window.location="index.html";
}

// MATRIX EFFECT
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

    if(y*fontSize>canvas.height && Math.random()>0.975) drops[i]=0;
    drops[i]++;
  });
}
setInterval(draw,33);