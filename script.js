/* =========================================
   JARVIS 2.0
   NO API
   ========================================= */

const app = document.querySelector(".app");
const chat = document.getElementById("chat");
const statusText = document.getElementById("status");

const orb = document.getElementById("orb");
const micBtn = document.getElementById("micBtn");
const cancelBtn = document.getElementById("cancelBtn");

const keyboardBtn = document.getElementById("keyboardBtn");
const manualBox = document.getElementById("manualBox");
const commandInput = document.getElementById("commandInput");
const sendBtn = document.getElementById("sendBtn");

const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettings = document.getElementById("closeSettings");

const historyBtn = document.getElementById("historyBtn");
const brainBtn = document.getElementById("brainBtn");

const timerCard = document.getElementById("timerCard");
const timerValue = document.getElementById("timerValue");

const stopwatchCard =
  document.getElementById("stopwatchCard");

const stopwatchValue =
  document.getElementById("stopwatchValue");


/* =========================================
   START MESSAGE
   ========================================= */

addMessage(
  "Hello. I'm Jarvis. Say “Jarvis” to wake me.",
  "jarvis"
);


/* =========================================
   SPEECH OUTPUT
   ========================================= */

let selectedVoice = null;

function loadVoices() {

  if (!window.speechSynthesis) return;

  const voices =
    speechSynthesis.getVoices();

  selectedVoice =
    voices.find(v => v.lang === "en-IN") ||
    voices.find(v => v.lang === "en-US") ||
    voices.find(v => v.lang.startsWith("en")) ||
    voices[0];
}

loadVoices();

if ("speechSynthesis" in window) {
  speechSynthesis.onvoiceschanged = loadVoices;
}


function speak(text) {

  if (!("speechSynthesis" in window)) {
    statusText.textContent = "Ready";
    return;
  }

  speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  loadVoices();

  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
  } else {
    utterance.lang = "en-IN";
  }

  utterance.rate = .92;
  utterance.pitch = .82;
  utterance.volume = 1;

  app.classList.remove(
    "listening",
    "thinking"
  );

  app.classList.add("speaking");

  statusText.textContent =
    "Jarvis is speaking";

  utterance.onend = () => {

    app.classList.remove("speaking");

    if (!sleepMode) {
      statusText.textContent = "Standby";
    }

  };

  speechSynthesis.speak(utterance);
}


/* =========================================
   CHAT
   ========================================= */

function addMessage(text, type) {

  const div =
    document.createElement("div");

  div.className =
    "message " + type;

  div.textContent = text;

  chat.appendChild(div);

  chat.scrollTop =
    chat.scrollHeight;

  saveHistory(text, type);
}


function reply(text) {

  addMessage(text, "jarvis");

  speak(text);
}


/* =========================================
   LOCAL HISTORY
   ========================================= */

function saveHistory(text, type) {

  let history =
    JSON.parse(
      localStorage.getItem("jarvisHistory") ||
      "[]"
    );

  history.push({
    text,
    type,
    time: Date.now()
  });

  history =
    history.slice(-100);

  localStorage.setItem(
    "jarvisHistory",
    JSON.stringify(history)
  );
}


function clearChat() {

  chat.innerHTML = "";

  addMessage(
    "Conversation cleared.",
    "jarvis"
  );

  speak("Conversation cleared.");
}


/* =========================================
   WEBSITES
   ========================================= */

const sites = {

  google:
    "https://www.google.com",

  youtube:
    "https://www.youtube.com",

  chatgpt:
    "https://chatgpt.com",

  github:
    "https://github.com",

  wikipedia:
    "https://www.wikipedia.org",

  instagram:
    "https://www.instagram.com",

  facebook:
    "https://www.facebook.com",

  gmail:
    "https://mail.google.com",

  reddit:
    "https://www.reddit.com",

  nasa:
    "https://www.nasa.gov",

  amazon:
    "https://www.amazon.in",

  pw:
    "https://www.pw.live",

  "physics wallah":
    "https://www.pw.live"

};


function openWebsite(name) {

  name =
    name.trim();

  const key =
    name.toLowerCase();

  if (sites[key]) {

    reply(
      "Opening " + name + "."
    );

    setTimeout(() => {

      window.location.href =
        sites[key];

    }, 600);

    return;
  }


  /* URL */

  if (
    name.includes(".") ||
    name.startsWith("http")
  ) {

    let url = name;

    if (
      !url.startsWith("http://") &&
      !url.startsWith("https://")
    ) {

      url =
        "https://" + url;
    }

    reply(
      "Opening " + name + "."
    );

    setTimeout(() => {

      window.location.href = url;

    }, 600);

    return;
  }


  /* UNKNOWN WEBSITE */

  reply(
    "I couldn't identify the website. Searching for it."
  );

  setTimeout(() => {

    googleSearch(
      name + " official website"
    );

  }, 700);
}


/* =========================================
   GOOGLE
   ========================================= */

function googleSearch(query) {

  query =
    query.trim();

  if (!query) return;

  addMessage(
    "Searching: " + query,
    "jarvis"
  );

  speak(
    "Searching Google for " +
    query
  );

  setTimeout(() => {

    window.location.href =
      "https://www.google.com/search?q=" +
      encodeURIComponent(query);

  }, 700);
}


/* =========================================
   CALCULATOR
   ========================================= */

function calculate(expression) {

  let exp =
    expression
      .toLowerCase()
      .replace(/multiplied by/g, "*")
      .replace(/times/g, "*")
      .replace(/divided by/g, "/")
      .replace(/plus/g, "+")
      .replace(/minus/g, "-")
      .replace(/to the power of/g, "**");


  const percent =
    exp.match(
      /([0-9.]+)\s*%\s*of\s*([0-9.]+)/
    );

  if (percent) {

    const a =
      Number(percent[1]);

    const b =
      Number(percent[2]);

    const result =
      a / 100 * b;

    reply(
      `${a} percent of ${b} is ${result}.`
    );

    return;
  }


  const root =
    exp.match(
      /square root of\s*([0-9.]+)/
    );

  if (root) {

    const n =
      Number(root[1]);

    reply(
      `The square root of ${n} is ${Math.sqrt(n)}.`
    );

    return;
  }


  if (
    !/^[0-9+\-*/().%\s]+$/.test(exp)
  ) {

    googleSearch(expression);

    return;
  }


  try {

    const result =
      Function(
        '"use strict";return (' +
        exp +
        ")"
      )();

    reply(
      `${expression} equals ${result}.`
    );

  } catch {

    googleSearch(expression);
  }
}


/* =========================================
   UNIT CONVERSION
   ========================================= */

function convertUnits(text) {

  const match =
    text.toLowerCase().match(
      /([\d.]+)\s*(km|kilometers?|m|meters?|cm|centimeters?|kg|kilograms?|g|grams?|c|celsius|f|fahrenheit)\s+(?:to|in)\s+(km|kilometers?|m|meters?|cm|centimeters?|kg|kilograms?|g|grams?|c|celsius|f|fahrenheit)/
    );

  if (!match)
    return false;

  const value =
    Number(match[1]);

  const from =
    match[2];

  const to =
    match[3];

  let result = null;


  /* DISTANCE */

  const distance = {

    km: 1000,
    kilometer: 1000,
    kilometers: 1000,

    m: 1,
    meter: 1,
    meters: 1,

    cm: .01,
    centimeter: .01,
    centimeters: .01
  };


  if (
    distance[from] &&
    distance[to]
  ) {

    result =
      value *
      distance[from] /
      distance[to];
  }


  /* WEIGHT */

  const weight = {

    kg: 1000,
    kilogram: 1000,
    kilograms: 1000,

    g: 1,
    gram: 1,
    grams: 1
  };


  if (
    weight[from] &&
    weight[to]
  ) {

    result =
      value *
      weight[from] /
      weight[to];
  }


  /* TEMPERATURE */

  if (
    ["c","celsius"].includes(from) &&
    ["f","fahrenheit"].includes(to)
  ) {

    result =
      value * 9 / 5 + 32;
  }


  if (
    ["f","fahrenheit"].includes(from) &&
    ["c","celsius"].includes(to)
  ) {

    result =
      (value - 32) * 5 / 9;
  }


  if (result !== null) {

    reply(
      `${value} ${from} is approximately ${Number(result.toFixed(4))} ${to}.`
    );

    return true;
  }


  return false;
}


/* =========================================
   MEMORY
   ========================================= */

function remember(info) {

  let memory =
    JSON.parse(
      localStorage.getItem(
        "jarvisMemory"
      ) || "[]"
    );

  memory.push(info);

  localStorage.setItem(
    "jarvisMemory",
    JSON.stringify(memory)
  );

  reply(
    "I'll remember that."
  );
}


function showMemory() {

  const memory =
    JSON.parse(
      localStorage.getItem(
        "jarvisMemory"
      ) || "[]"
    );

  if (!memory.length) {

    reply(
      "My local memory is empty."
    );

    return;
  }

  reply(
    "I remember: " +
    memory.slice(-5).join(". ")
  );
}


function clearMemory() {

  localStorage.removeItem(
    "jarvisMemory"
  );

  reply(
    "My local memory has been cleared."
  );
}


/* =========================================
   NOTES
   ========================================= */

function saveNote(note) {

  let notes =
    JSON.parse(
      localStorage.getItem(
        "jarvisNotes"
      ) || "[]"
    );

  notes.push(note);

  localStorage.setItem(
    "jarvisNotes",
    JSON.stringify(notes)
  );

  reply("Note saved.");
}


function showNotes() {

  const notes =
    JSON.parse(
      localStorage.getItem(
        "jarvisNotes"
      ) || "[]"
    );

  if (!notes.length) {

    reply(
      "You don't have any notes."
    );

    return;
  }

  reply(
    "Your notes are: " +
    notes.slice(-5).join(". ")
  );
}


function clearNotes() {

  localStorage.removeItem(
    "jarvisNotes"
  );

  reply(
    "All notes have been deleted."
  );
}


/* =========================================
   TIMER
   ========================================= */

let timerInterval = null;
let timerSeconds = 0;


function startTimer(seconds) {

  clearInterval(timerInterval);

  timerSeconds = seconds;

  timerCard.classList.remove(
    "hidden"
  );

  updateTimer();

  timerInterval =
    setInterval(() => {

      timerSeconds--;

      updateTimer();

      if (timerSeconds <= 0) {

        clearInterval(timerInterval);

        timerCard.classList.add(
          "hidden"
        );

        reply(
          "Your timer is complete."
        );
      }

    }, 1000);
}


function updateTimer() {

  const min =
    Math.floor(timerSeconds / 60);

  const sec =
    timerSeconds % 60;

  timerValue.textContent =
    String(min).padStart(2,"0") +
    ":" +
    String(sec).padStart(2,"0");
}


/* =========================================
   STOPWATCH
   ========================================= */

let stopwatchSeconds = 0;
let stopwatchInterval = null;


function startStopwatch() {

  if (stopwatchInterval)
    return;

  stopwatchCard.classList.remove(
    "hidden"
  );

  stopwatchInterval =
    setInterval(() => {

      stopwatchSeconds++;

      const h =
        Math.floor(
          stopwatchSeconds / 3600
        );

      const m =
        Math.floor(
          (stopwatchSeconds % 3600) / 60
        );

      const s =
        stopwatchSeconds % 60;

      stopwatchValue.textContent =
        String(h).padStart(2,"0") +
        ":" +
        String(m).padStart(2,"0") +
        ":" +
        String(s).padStart(2,"0");

    }, 1000);
}


function stopStopwatch() {

  clearInterval(
    stopwatchInterval
  );

  stopwatchInterval = null;
}


function resetStopwatch() {

  stopStopwatch();

  stopwatchSeconds = 0;

  stopwatchValue.textContent =
    "00:00:00";

  stopwatchCard.classList.add(
    "hidden"
  );
}


/* =========================================
   TIME / DATE
   ========================================= */

function tellTime() {

  const time =
    new Date().toLocaleTimeString(
      [],
      {
        hour: "numeric",
        minute: "2-digit"
      }
    );

  reply(
    "The current time is " +
    time + "."
  );
}


function tellDate() {

  const date =
    new Date().toLocaleDateString(
      [],
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      }
    );

  reply(
    "Today is " +
    date + "."
  );
}


/* =========================================
   CONVERSATION
   ========================================= */

function conversation(text) {

  const t =
    text.toLowerCase().trim();


  if (
    /^(hi|hello|hey|good morning|good evening)$/.test(t)
  ) {

    reply(
      "Hello. How can I help you?"
    );

    return true;
  }


  if (
    t.includes("how are you")
  ) {

    reply(
      "All systems are operating normally."
    );

    return true;
  }


  if (
    t.includes("your name")
  ) {

    reply(
      "I am Jarvis, your local browser assistant."
    );

    return true;
  }


  if (
    t.includes("who made you")
  ) {

    reply(
      "I am a browser-based Jarvis system built with HTML, CSS and JavaScript."
    );

    return true;
  }


  if (
    t.includes("what can you do")
  ) {

    reply(
      "I can search the web, open websites, calculate, convert units, manage notes and memory, run timers and talk with you."
    );

    return true;
  }


  if (
    t === "thank you" ||
    t === "thanks"
  ) {

    reply(
      "You're welcome."
    );

    return true;
  }


  return false;
}


/* =========================================
   SLEEP MODE
   ========================================= */

let sleepMode = false;


function goToSleep() {

  sleepMode = true;

  if (recognition) {
    try {
      recognition.stop();
    } catch {}
  }

  if (speechSynthesis)
    speechSynthesis.cancel();

  app.classList.remove(
    "listening",
    "speaking",
    "thinking"
  );

  statusText.textContent =
    "Sleeping";
}


function wakeUp() {

  sleepMode = false;

  statusText.textContent =
    "Standby";

  reply(
    "I'm awake."
  );

  startWakeListening();
}


/* =========================================
   COMMAND PROCESSOR
   ========================================= */

function executeCommand(raw) {

  if (!raw)
    return;

  addMessage(
    raw,
    "user"
  );


  let text =
    raw.trim();


  /*
     REMOVE WAKE WORD
  */

  text =
    text.replace(
      /^\s*(hey\s+)?jarvis[\s,]*/i,
      ""
    );


  const lower =
    text.toLowerCase().trim();


  if (!lower) {

    reply(
      "Yes. I'm listening."
    );

    return;
  }


  /* SLEEP */

  if (
    lower === "sleep" ||
    lower === "go to sleep"
  ) {

    goToSleep();

    return;
  }


  /* WAKE */

  if (
    lower === "wake up"
  ) {

    wakeUp();

    return;
  }


  /* OPEN */

  if (
    /^(open|launch|visit|go to|take me to)\s+/i.test(text)
  ) {

    const site =
      text.replace(
        /^(open|launch|visit|go to|take me to)\s+/i,
        ""
      );

    openWebsite(site);

    return;
  }


  /* GOOGLE SEARCH */

  if (
    lower.startsWith("search google ")
  ) {

    googleSearch(
      text.substring(14)
    );

    return;
  }


  if (
    lower.startsWith("search ")
  ) {

    googleSearch(
      text.substring(7)
    );

    return;
  }


  /* CALCULATE */

  if (
    lower.startsWith("calculate ")
  ) {

    calculate(
      text.substring(10)
    );

    return;
  }


  /* UNIT CONVERSION */

  if (
    convertUnits(text)
  ) {

    return;
  }


  /* MEMORY */

  if (
    lower.startsWith(
      "remember that "
    )
  ) {

    remember(
      text.substring(14)
    );

    return;
  }


  if (
    lower.startsWith("remember ")
  ) {

    remember(
      text.substring(9)
    );

    return;
  }


  if (
    lower.includes(
      "what do you remember"
    ) ||
    lower === "show memory"
  ) {

    showMemory();

    return;
  }


  if (
    lower === "clear memory"
  ) {

    clearMemory();

    return;
  }


  /* NOTES */

  if (
    lower.startsWith("take a note ")
  ) {

    saveNote(
      text.substring(12)
    );

    return;
  }


  if (
    lower.startsWith("note ")
  ) {

    saveNote(
      text.substring(5)
    );

    return;
  }


  if (
    lower === "show notes"
  ) {

    showNotes();

    return;
  }


  if (
    lower === "clear notes" ||
    lower === "delete notes"
  ) {

    clearNotes();

    return;
  }


  /* TIMER */

  const timerMatch =
    lower.match(
      /(?:set )?timer (?:for )?(\d+)\s*(second|seconds|minute|minutes|hour|hours)/
    );


  if (timerMatch) {

    const number =
      Number(timerMatch[1]);

    const unit =
      timerMatch[2];

    let seconds =
      number;

    if (
      unit.startsWith("minute")
    )
      seconds =
        number * 60;

    if (
      unit.startsWith("hour")
    )
      seconds =
        number * 3600;

    startTimer(seconds);

    reply(
      `Timer set for ${number} ${unit}.`
    );

    return;
  }


  if (
    lower === "stop timer"
  ) {

    clearInterval(
      timerInterval
    );

    timerCard.classList.add(
      "hidden"
    );

    reply(
      "Timer stopped."
    );

    return;
  }


  /* STOPWATCH */

  if (
    lower === "start stopwatch"
  ) {

    startStopwatch();

    reply(
      "Stopwatch started."
    );

    return;
  }


  if (
    lower === "stop stopwatch"
  ) {

    stopStopwatch();

    reply(
      "Stopwatch stopped."
    );

    return;
  }


  if (
    lower === "reset stopwatch"
  ) {

    resetStopwatch();

    reply(
      "Stopwatch reset."
    );

    return;
  }


  /* TIME */

  if (
    lower === "time" ||
    lower.includes("what time is it")
  ) {

    tellTime();

    return;
  }


  /* DATE */

  if (
    lower === "date" ||
    lower.includes("what is today's date")
  ) {

    tellDate();

    return;
  }


  /* BACK */

  if (
    lower === "go back" ||
    lower === "back"
  ) {

    reply(
      "Going back."
    );

    setTimeout(
      () => history.back(),
      600
    );

    return;
  }


  /* REFRESH */

  if (
    lower === "refresh" ||
    lower === "reload"
  ) {

    reply(
      "Refreshing."
    );

    setTimeout(
      () => location.reload(),
      600
    );

    return;
  }


  /* HOME */

  if (
    lower === "go home" ||
    lower === "home"
  ) {

    reply(
      "Returning home."
    );

    setTimeout(
      () => {
        window.location.href =
          location.href.split("#")[0];
      },
      600
    );

    return;
  }


  /* STOP SPEAKING */

  if (
    lower === "stop speaking" ||
    lower === "be quiet"
  ) {

    speechSynthesis.cancel();

    app.classList.remove(
      "speaking"
    );

    statusText.textContent =
      sleepMode ? "Sleeping" : "Standby";

    return;
  }


  /* FULLSCREEN */

  if (
    lower === "fullscreen" ||
    lower === "go fullscreen"
  ) {

    if (!document.fullscreenElement) {

      document.documentElement
        .requestFullscreen()
        .catch(() => {});

      reply(
        "Entering fullscreen."
      );

    }

    return;
  }


  /* CLEAR CHAT */

  if (
    lower === "clear conversation" ||
    lower === "clear chat"
  ) {

    clearChat();

    return;
  }


  /* CONVERSATION */

  if (
    conversation(text)
  ) {

    return;
  }


  /*
     UNKNOWN QUESTION

     NO API:
     Send it to Google.
  */

  googleSearch(text);
}


/* =========================================
   SPEECH RECOGNITION
   ========================================= */

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

let recognition = null;

let listening = false;

let wakeListening = true;


if (SpeechRecognition) {

  recognition =
    new SpeechRecognition();

  recognition.lang =
    "en-IN";

  recognition.continuous =
    true;

  recognition.interimResults =
    true;


  recognition.onstart =
    () => {

      listening = true;

      if (!sleepMode) {

        app.classList.remove(
          "speaking"
        );

        app.classList.add(
          "listening"
        );

        statusText.textContent =
          "Listening...";
      }
    };


  recognition.onresult =
    event => {

      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {

        transcript +=
          event.results[i][0].transcript;
      }


      transcript =
        transcript.trim();


      /*
         SHOW LIVE SPEECH
      */

      commandInput.value =
        transcript;


      /*
         WAKE WORD DETECTION
      */

      const wakeMatch =
        transcript.match(
          /\b(?:hey\s+)?jarvis\b/i
        );


      if (
        wakeMatch &&
        sleepMode
      ) {

        sleepMode = false;

        statusText.textContent =
          "Listening...";

        app.classList.add(
          "listening"
        );
      }


      /*
         IF JARVIS IS ALREADY ACTIVE,
         EXECUTE FINAL SPEECH
      */

      const last =
        event.results[
          event.results.length - 1
        ];


      if (
        last.isFinal &&
        transcript
      ) {

        if (
          !sleepMode
        ) {

          executeCommand(
            transcript
          );

        }

        commandInput.value = "";
      }

    };


  recognition.onerror =
    event => {

      console.log(
        "Voice:",
        event.error
      );

      listening = false;

      app.classList.remove(
        "listening"
      );

      /*
         Don't permanently die
         when browser stops recognition.
      */

      if (
        !sleepMode &&
        wakeListening
      ) {

        setTimeout(
          startWakeListening,
          700
        );
      }
    };


  recognition.onend =
    () => {

      listening = false;

      app.classList.remove(
        "listening"
      );

      if (
        !sleepMode &&
        wakeListening
      ) {

        setTimeout(
          startWakeListening,
          500
        );
      }

    };
}


/* =========================================
   START WAKE LISTENER
   ========================================= */

function startWakeListening() {

  if (!recognition)
    return;

  if (sleepMode)
    return;

  if (listening)
    return;

  try {

    recognition.start();

  } catch(error) {

    console.log(error);

  }
}


/* =========================================
   MICROPHONE BUTTON
   ========================================= */

micBtn.addEventListener(
  "click",
  () => {

    if (!recognition) {

      reply(
        "Voice recognition isn't supported here. You can use the keyboard."
      );

      return;
    }


    if (listening) {

      recognition.stop();

      return;
    }


    sleepMode = false;

    startWakeListening();

  }
);


/* =========================================
   ORB
   ========================================= */

orb.addEventListener(
  "click",
  () => {

    sleepMode = false;

    startWakeListening();

  }
);


/* =========================================
   KEYBOARD
   ========================================= */

keyboardBtn.addEventListener(
  "click",
  () => {

    manualBox.classList.toggle(
      "hidden"
    );

    if (
      !manualBox.classList.contains(
        "hidden"
      )
    ) {

      commandInput.focus();
    }

  }
);


sendBtn.addEventListener(
  "click",
  () => {

    const text =
      commandInput.value.trim();

    if (!text)
      return;

    executeCommand(text);

    commandInput.value = "";

  }
);


commandInput.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter"
    ) {

      sendBtn.click();

    }

  }
);


/* =========================================
   CANCEL
   ========================================= */

cancelBtn.addEventListener(
  "click",
  () => {

    if (recognition) {

      try {
        recognition.stop();
      } catch {}

    }

    if (speechSynthesis)
      speechSynthesis.cancel();

    app.classList.remove(
      "listening",
      "speaking",
      "thinking"
    );

    statusText.textContent =
      sleepMode ? "Sleeping" : "Standby";

  }
);


/* =========================================
   SETTINGS
   ========================================= */

settingsBtn.addEventListener(
  "click",
  () => {

    settingsPanel.classList.remove(
      "hidden"
    );

  }
);


closeSettings.addEventListener(
  "click",
  () => {

    settingsPanel.classList.add(
      "hidden"
    );

  }
);


/* =========================================
   BRAIN
   ========================================= */

brainBtn.addEventListener(
  "click",
  () => {

    reply(
      "Local systems operational. Voice, wake word, web navigation, search, calculator, conversion, notes, memory, timer and stopwatch are available."
    );

  }
);


/* =========================================
   HISTORY BUTTON
   ========================================= */

historyBtn.addEventListener(
  "click",
  () => {

    const history =
      JSON.parse(
        localStorage.getItem(
          "jarvisHistory"
        ) || "[]"
      );

    if (!history.length) {

      reply(
        "There is no saved conversation history."
      );

      return;
    }

    reply(
      `I have ${history.length} saved conversation entries locally.`
    );

  }
);


/* =========================================
   START
   ========================================= */

statusText.textContent =
  "Standby";


/*
 IMPORTANT:

 Browsers normally require the user
 to interact with the page before
 microphone permission can begin.

 So click the microphone ONCE when
 you first open the page.

 After permission is granted,
 the recognition system attempts
 to remain active and listen for
 "Jarvis".
*/

console.log(
  "JARVIS 2.0 ONLINE"
);
