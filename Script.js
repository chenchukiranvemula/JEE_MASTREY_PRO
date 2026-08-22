// ================================
// HAPPY BIRTHDAY WEBSITE SCRIPT
// (No Password Version)
// ================================

// Elements
const welcome = document.getElementById("welcome");
const website = document.getElementById("website");
const startBtn = document.getElementById("startBtn");

const chapters = document.querySelectorAll(".chapter");
const nextBtns = document.querySelectorAll(".nextBtn");

const bgMusic = document.getElementById("bgMusic");
const chapterSong = document.getElementById("chapter9Song");

const musicBtn = document.getElementById("musicBtn");
const cakeBtn = document.getElementById("cakeBtn");
const restartBtn = document.getElementById("restart");

// Show Welcome Screen
window.onload = () => {
    welcome.style.display = "flex";
    website.style.display = "none";
};

// ================================
// START JOURNEY
// ================================

let currentChapter = 0;

startBtn.addEventListener("click", () => {

    welcome.style.display = "none";
    website.style.display = "block";

    chapters.forEach(c => c.classList.remove("active"));

    currentChapter = 0;
    chapters[currentChapter].classList.add("active");

    bgMusic.play().catch(() => {});

    startHearts();

});

// ================================
// NEXT BUTTONS
// ================================

nextBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        if(currentChapter === 8){
            chapterSong.pause();
            chapterSong.currentTime = 0;
            bgMusic.play().catch(() => {});
            musicBtn.innerHTML = "▶ Play The Song";
        }

        chapters[currentChapter].classList.remove("active");

        currentChapter++;

        if(currentChapter >= chapters.length){
            currentChapter = chapters.length - 1;
        }

        chapters[currentChapter].classList.add("active");

        // Chapter 10 Celebration
        if(currentChapter === 9){
            startCelebration();
        }else{
            stopCelebration();
        }

    });

});
// ===============================
// PREMIUM GIFT OPENING
// ===============================

const gifts = document.querySelectorAll(".gift");
const giftMessage = document.getElementById("giftMessage");

gifts.forEach(gift => {

    gift.addEventListener("click", () => {

        // Open Gift
        gift.classList.add("open");

        // Typewriter Message
        const message = gift.dataset.message;

        giftMessage.innerHTML = "";

        let i = 0;

        function typeGift() {

            if (i < message.length) {

                giftMessage.innerHTML += message.charAt(i);

                i++;

                setTimeout(typeGift, 40);

            }

        }

        typeGift();

        // Floating Hearts
        for (let j = 0; j < 20; j++) {

            setTimeout(() => {

                const heart = document.createElement("div");

                heart.innerHTML = Math.random() > 0.5 ? "❤️" : "✨";

                heart.style.position = "fixed";

                const rect = gift.getBoundingClientRect();

                heart.style.left = (rect.left + rect.width / 2) + "px";
                heart.style.top = (rect.top + rect.height / 2) + "px";

                heart.style.fontSize = (20 + Math.random() * 15) + "px";

                heart.style.pointerEvents = "none";

                heart.style.zIndex = "9999";

                document.body.appendChild(heart);

                heart.animate([
                    {
                        transform: "translate(0,0) scale(.5)",
                        opacity: 1
                    },
                    {
                        transform: `translate(${Math.random()*200-100}px,-250px) scale(1.8)`,
                        opacity: 0
                    }
                ], {
                    duration: 1800,
                    easing: "ease-out"
                });

                setTimeout(() => {
                    heart.remove();
                }, 1800);

            }, j * 80);

        }

    });

});
// ================================
// CAKE
// ================================

if(cakeBtn){

cakeBtn.addEventListener("click",()=>{

    alert("🎂 Happy Birthday Ammadu ❤️");

    createFireworks();

});

}

// ================================
// MUSIC
// ================================

const vinyl = document.getElementById("vinyl");

if (musicBtn) {

    musicBtn.addEventListener("click", () => {

        if (chapterSong.paused) {

            // Pause background music
            bgMusic.pause();

            // Play Chapter 9 song
            chapterSong.currentTime = 0;
            chapterSong.play();

            // Start vinyl animation
            if(vinyl) vinyl.classList.add("spin");

            musicBtn.innerHTML = "⏸ Pause Song";

            startMusicEffects();   // ❤️ Start hearts & music notes

        } else {

            // Stop Chapter 9 song
            chapterSong.pause();
            chapterSong.currentTime = 0;

            // Resume background music
            bgMusic.play().catch(() => {});

            // Stop vinyl animation
            if(vinyl) vinyl.classList.remove("spin");

            musicBtn.innerHTML = "▶ Play The Song";

        }

    });

}

/* When the song ends */
chapterSong.addEventListener("ended", () => {

    if(vinyl) vinyl.classList.remove("spin");

    bgMusic.play().catch(() => {});

    musicBtn.innerHTML = "▶ Play The Song ❤️";

});
function startMusicEffects(){

    for(let i=0;i<50;i++){

        setTimeout(()=>{

            const note=document.createElement("div");

            note.innerHTML=Math.random()>0.5?"🎵":"🎶";

            note.style.position="fixed";

            note.style.left=Math.random()*100+"vw";

            note.style.top="100vh";

            note.style.fontSize=(20+Math.random()*20)+"px";

            note.style.pointerEvents="none";

            note.style.zIndex="9999";

            document.body.appendChild(note);

            note.animate([

                {
                    transform:"translateY(0)",
                    opacity:1
                },

                {
                    transform:"translateY(-100vh)",
                    opacity:0
                }

            ],{

                duration:4000

            });

            setTimeout(()=>{

                note.remove();

            },4000);

        },i*150);

    }

}
// ======================================
// PREMIUM LOVE LETTER
// ======================================

const envelope = document.getElementById("openLetter");
const letterBox = document.getElementById("letterBox");
const letterText = document.getElementById("letterText");

const fullLetter = letterText.innerText;

letterText.innerHTML = "";

function typeLetter(){

    let i = 0;

    function type(){

        if(i < fullLetter.length){

            letterText.innerHTML =
                fullLetter.substring(0,i+1) +
                '<span class="cursor">|</span>';

            i++;

            createHeart();

            setTimeout(type,35);

        }else{

            letterText.innerHTML =
                fullLetter +
                '<span class="cursor">|</span>';

        }

    }

    type();

}

if(envelope){

    envelope.addEventListener("click",()=>{

        envelope.style.transform="scale(0)";
        envelope.style.opacity="0";

        setTimeout(()=>{

            envelope.parentElement.style.display="none";

            letterBox.style.display="block";

            setTimeout(()=>{

                letterBox.classList.add("show");

                typeLetter();

            },200);

        },500);

    });

}


// Floating hearts while typing

function createHeart(){

    const heart=document.createElement("div");

    heart.innerHTML="❤️";

    heart.className="typingHeart";

    heart.style.left=(40+Math.random()*20)+"vw";

    document.body.appendChild(heart);

    setTimeout(()=>{

        heart.remove();

    },2500);

}
// ================================
// FLOATING HEARTS
// ================================

let heartInterval;

function startHearts(){

    clearInterval(heartInterval);

    heartInterval = setInterval(()=>{

        const heart = document.createElement("div");

        heart.className = "heart";
        heart.innerHTML = "❤️";

        heart.style.left = Math.random() * 100 + "vw";
        heart.style.fontSize = (18 + Math.random() * 25) + "px";

        document.body.appendChild(heart);

        setTimeout(()=>{
            heart.remove();
        },6000);

    },500);

}
// ================================
// FIREWORKS
// ================================

function createFireworks(){

const area=document.getElementById("fireworks");
    if(!area)return;

for(let i=0;i<70;i++){

const spark=document.createElement("div");

spark.className="sparkle";

spark.style.left=Math.random()*100+"%";

spark.style.top=Math.random()*100+"%";

area.appendChild(spark);

setTimeout(()=>{

spark.remove();

},2000);

}

}

// ================================
// RESTART
// ================================

if(restartBtn){

restartBtn.addEventListener("click",()=>{

location.reload();

});

           }
// ================================
// TOUCH EFFECTS (Bubbles + Hearts)
// ================================

document.addEventListener("click", createTouchEffect);
document.addEventListener("touchstart", (e) => {
    createTouchEffect(e.touches[0]);
});

function createTouchEffect(e){

    const x = e.clientX;
    const y = e.clientY;

    for(let i=0;i<10;i++){

        const bubble=document.createElement("div");
        bubble.className="bubble";
        bubble.style.left=x+"px";
        bubble.style.top=y+"px";

        bubble.style.setProperty("--x",(Math.random()*200-100)+"px");
        bubble.style.setProperty("--y",(Math.random()*200-100)+"px");

        bubble.innerHTML=Math.random()>0.5?"❤️":"✨";

        document.body.appendChild(bubble);

        setTimeout(()=>{
            bubble.remove();
        },1500);

    }

}
// ================================
// CHAPTER 10 CELEBRATION
// ================================

let celebrationInterval;

function startCelebration() {

    const icons = ["🎈","🎊","🎉","✨","❤️","🌸"];

    celebrationInterval = setInterval(() => {

        const item = document.createElement("div");

        item.className = "partyItem";

        item.innerHTML = icons[Math.floor(Math.random() * icons.length)];

        item.style.left = Math.random() * 100 + "vw";
        item.style.fontSize = (20 + Math.random() * 30) + "px";

        document.body.appendChild(item);

        setTimeout(() => {
            item.remove();
        }, 4000);

    }, 120);

    createFireworks();
}

function stopCelebration() {
    clearInterval(celebrationInterval);

    document.querySelectorAll(".partyItem").forEach(e => e.remove());
}
// ================================
// PREMIUM BACKGROUND EFFECTS
// ================================

createStars();
createPetals();

function createStars(){

setInterval(()=>{

const star=document.createElement("div");

star.className="star";

star.style.left=Math.random()*100+"vw";
star.style.top=Math.random()*100+"vh";

document.body.appendChild(star);

setTimeout(()=>{
star.remove();
},3000);

},200);

}

function createPetals(){

setInterval(()=>{

const petal=document.createElement("div");

petal.className="petal";

petal.innerHTML="🌸";

petal.style.left=Math.random()*100+"vw";
petal.style.fontSize=(18+Math.random()*18)+"px";

document.body.appendChild(petal);

setTimeout(()=>{
petal.remove();
},10000);

},800);

}

// Floating "I Love You"
setInterval(()=>{

const love=document.createElement("div");

love.innerHTML="❤️ I Love You ❤️ KODIGUDDU";

love.style.position="fixed";
love.style.left=Math.random()*80+"vw";
love.style.bottom="-40px";
love.style.color="#ffd6ec";
love.style.fontWeight="bold";
love.style.pointerEvents="none";
love.style.zIndex="999";

love.animate([
{transform:"translateY(0)",opacity:1},
{transform:"translateY(-120vh)",opacity:0}
],{
duration:6000
});

document.body.appendChild(love);

setTimeout(()=>{
love.remove();
},6000);

},7000);
// ==============================
// CARD HEART EFFECT
// ==============================

document.querySelectorAll(".card,.timeBox,.gift,.photo").forEach(box=>{

box.addEventListener("click",()=>{

for(let i=0;i<8;i++){

const heart=document.createElement("div");

heart.innerHTML=Math.random()>0.5?"❤️":"✨";

heart.style.position="fixed";

const rect=box.getBoundingClientRect();

heart.style.left=(rect.left+rect.width/2)+"px";
heart.style.top=(rect.top+rect.height/2)+"px";

heart.style.pointerEvents="none";
heart.style.fontSize="22px";
heart.style.zIndex="9999";

heart.animate([
{
transform:"translate(0,0) scale(.5)",
opacity:1
},
{
transform:`translate(${Math.random()*160-80}px,${Math.random()*160-80}px) scale(1.8)`,
opacity:0
}
],{
duration:900
});

document.body.appendChild(heart);

setTimeout(()=>{
heart.remove();
},900);

}

});

});
/*====================================
      LOVE LOCK - PART 3
====================================*/

const dayPicker = document.getElementById("dayPicker");
const monthPicker = document.getElementById("monthPicker");
const yearPicker = document.getElementById("yearPicker");

const unlockBtn = document.getElementById("unlockBtn");
const chanceCount = document.getElementById("chanceCount");
const roseArea = document.getElementById("roseArea");
const timerArea = document.getElementById("timerArea");
const lockScreen = document.getElementById("lockScreen");

const PASSWORD = {
    day:16,
    month:9,
    year:2024
};

const months = [
"January","February","March","April","May","June",
"July","August","September","October","November","December"
];

/* Fill Days */

for(let i=1;i<=31;i++){

    let option=document.createElement("option");

    option.value=i;

    option.text=i;

    dayPicker.appendChild(option);

}

/* Fill Months */

months.forEach((m,index)=>{

    let option=document.createElement("option");

    option.value=index+1;

    option.text=m;

    monthPicker.appendChild(option);

});

/* Fill Years */

for(let y=1900;y<=2100;y++){

    let option=document.createElement("option");

    option.value=y;

    option.text=y;

    yearPicker.appendChild(option);

}

let attempts=5;

let locked=false;

unlockBtn.onclick=function(){

if(locked) return;

const day=Number(dayPicker.value);

const month=Number(monthPicker.value);

const year=Number(yearPicker.value);

if(
day===PASSWORD.day &&
month===PASSWORD.month &&
year===PASSWORD.year
){

unlockLove();

}else{

wrongDate();

}

};

function wrongDate(){
    
    vibratePhone();

attempts--;

chanceCount.innerHTML=attempts;

const msgs=[

"🌹 Not this memory...  ",

"🌸 Close your eyes... Remember any special date 💖",

"❤️ Love always remembers... Try again.",

"🌷 One last chance...Think about our proposal",

"🥀 Too many wrong memories..."

];

roseArea.innerHTML=msgs[5-attempts-1];

document.querySelector(".lockContainer").animate([

{transform:"translateX(-12px)"},

{transform:"translateX(12px)"},

{transform:"translateX(-8px)"},

{transform:"translateX(8px)"},

{transform:"translateX(0)"}

],{

duration:450

});

if (attempts <= 0) {
    startTimer();
}
    
}
function startTimer() {

    unlockBtn.disabled = true;

    let timeLeft = 60;

    timerArea.innerHTML = "Try again in " + timeLeft + " seconds";

    const timer = setInterval(() => {

        timeLeft--;

        timerArea.innerHTML = "Try again in " + timeLeft + " seconds";

        if (timeLeft <= 0) {

            clearInterval(timer);

            attempts = 5;
            chanceCount.innerHTML = attempts;

            unlockBtn.disabled = false;

            timerArea.innerHTML = "";

            roseArea.innerHTML = "";

        }

    }, 1000);

}
function unlockLove(){
    
    playHeartUnlock();

unlockBtn.disabled=true;

const rose=document.createElement("div");

rose.className="unlockRose";

rose.innerHTML="🌹";

document.body.appendChild(rose);

const text=document.createElement("div");

text.className="unlockText";

text.innerHTML=`
🌹<br>
16 September 2024 ❤️<br>
Our Proposal day
`;

document.body.appendChild(text);

for(let i=0;i<120;i++){

setTimeout(()=>{

const petal=document.createElement("div");

petal.className="petal";

petal.innerHTML=Math.random()>0.5?"🌸":"❤️";

petal.style.left=Math.random()*100+"vw";

petal.style.animationDuration=
(4+Math.random()*4)+"s";

document.body.appendChild(petal);

setTimeout(()=>petal.remove(),8000);

},i*40);

}

for(let i=0;i<80;i++){

setTimeout(()=>{

const star=document.createElement("div");

star.className="sparkle";

star.innerHTML="✨";

star.style.left=Math.random()*100+"vw";

star.style.top=Math.random()*100+"vh";

document.body.appendChild(star);

setTimeout(()=>star.remove(),1500);

},i*25);

}

setTimeout(()=>{

lockScreen.style.transition="2s";

lockScreen.style.opacity="0";

setTimeout(()=>{

    lockScreen.style.display = "none";

    welcome.style.display = "flex";
    website.style.display = "none";

    rose.remove();
    text.remove();

},2000);
},5500);

           }
//=====================================
// HEART LOCK ANIMATION
//=====================================

function playHeartUnlock(){

const lock=document.createElement("div");

lock.className="heartLock";

lock.innerHTML="💖";

document.body.appendChild(lock);

setTimeout(()=>{

const key=document.createElement("div");

key.className="magicKey";

key.innerHTML="🗝️";

document.body.appendChild(key);

setTimeout(()=>{

const flash=document.createElement("div");

flash.className="unlockFlash";

document.body.appendChild(flash);

setTimeout(()=>{

flash.remove();
key.remove();
lock.remove();

},900);

},2800);

},800);

}
/*==================================
      LIVE BACKGROUND
==================================*/

setInterval(()=>{

if(document.getElementById("lockScreen").style.display==="none") return;

const heart=document.createElement("div");

heart.className="floatingHeart";

heart.innerHTML=Math.random()>0.5?"❤️":"💖";

heart.style.left=Math.random()*100+"vw";

heart.style.fontSize=(15+Math.random()*18)+"px";

heart.style.animationDuration=(6+Math.random()*5)+"s";

document.body.appendChild(heart);

setTimeout(()=>heart.remove(),11000);

},500);


setInterval(()=>{

if(document.getElementById("lockScreen").style.display==="none") return;

const petal=document.createElement("div");

petal.className="floatingPetal";

petal.innerHTML="🌸";

petal.style.left=Math.random()*100+"vw";

petal.style.fontSize=(18+Math.random()*12)+"px";

petal.style.animationDuration=(7+Math.random()*5)+"s";

document.body.appendChild(petal);

setTimeout(()=>petal.remove(),12000);

},700);


/* Glow selected picker */

const selects=document.querySelectorAll("#dayPicker,#monthPicker,#yearPicker");

selects.forEach(s=>{

s.addEventListener("change",()=>{

s.classList.add("selectedGlow");

setTimeout(()=>{

s.classList.remove("selectedGlow");

},500);

});

});


/* Small vibration on wrong password */

function vibratePhone(){

if(navigator.vibrate){

navigator.vibrate([100,80,100]);

}

   }
