const bpmInput = document.getElementById("bpm");
const bpmValue = document.getElementById("bpmValue");
const timeSignatureSelect = document.getElementById("timeSignature");
const startStopBtn = document.getElementById("startStopBtn");

const beatDisplay = document.getElementById("beatDisplay");
const beatText = document.getElementById("beatText");
const beatCircles = document.getElementById("beatCircles");

const lessonTitle = document.getElementById("lessonTitle");
const lessonDescription = document.getElementById("lessonDescription");
const countingText = document.getElementById("countingText");
const exerciseText = document.getElementById("exerciseText");
const levelText = document.getElementById("levelText");

const groupingSelect = document.getElementById("groupingSelect");
const groupingContainer = document.getElementById("groupingContainer");

const subdivisionSelect = document.getElementById("subdivisionSelect");
const subdivisionText = document.getElementById("subdivisionText");

const soundModeSelect = document.getElementById("soundModeSelect");
const difficultySelect = document.getElementById("difficultySelect");

const figureSelect = document.getElementById("figureSelect");
const figureDescription = document.getElementById("figureDescription");
const figurePattern = document.getElementById("figurePattern");
const figureCounting = document.getElementById("figureCounting");
const figureExercise = document.getElementById("figureExercise");

const practiceStep = document.getElementById("practiceStep");
const nextPracticeBtn = document.getElementById("nextPracticeBtn");
const prevPracticeBtn = document.getElementById("prevPracticeBtn");
const completeExerciseBtn = document.getElementById("completeExerciseBtn");

const levelTitle = document.getElementById("levelTitle");
const levelDescription = document.getElementById("levelDescription");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const completeLevelBtn = document.getElementById("completeLevelBtn");

const practiceTime = document.getElementById("practiceTime");
const exerciseCount = document.getElementById("exerciseCount");
const dailyGoalText = document.getElementById("dailyGoalText");
const achievedCount = document.getElementById("achievedCount");
const goalMessage = document.getElementById("goalMessage");
const resetProgressBtn = document.getElementById("resetProgressBtn");

let bpm = 80;
let isPlaying = false;
let currentBeat = 1;
let intervalId = null;
let audioContext = null;
let practiceTimerId = null;
let currentPracticeIndex = 0;

let currentLevelIndex = Number(localStorage.getItem("muselearnLevel")) || 0;
let totalPracticeSeconds = Number(localStorage.getItem("muselearnPracticeSeconds")) || 0;
let reviewedExercises = Number(localStorage.getItem("muselearnReviewedExercises")) || 0;
let achievedExercises = Number(localStorage.getItem("muselearnAchievedExercises")) || 0;

const DAILY_PRACTICE_GOAL_SECONDS = 300;
const DAILY_EXERCISE_GOAL = 5;

const levels = [
  {
    name: "Nivel 1 — Pulso básico",
    description: "Aprende el pulso y los compases simples.",
    signatures: ["2/2", "2/4", "3/4", "4/4"]
  },
  {
    name: "Nivel 2 — Compases compuestos",
    description: "Aprende agrupaciones ternarias.",
    signatures: ["3/8", "6/8", "9/8", "12/8"]
  },
  {
    name: "Nivel 3 — Compases irregulares",
    description: "Aprende métricas asimétricas.",
    signatures: ["5/8", "7/8", "13/8"]
  },
  {
    name: "Nivel 4 — Compases amalgama",
    description: "Aprende compases avanzados.",
    signatures: ["5/4", "7/4", "8/8", "10/8", "11/8"]
  }
];

const lessons = {
  "2/2": {
    title: "Compás 2/2",
    description: "Compás amplio y pesado.",
    counting: "UNO dos",
    exercise: "Acentúa el tiempo 1.",
    level: "Principiante"
  },
  "2/4": {
    title: "Compás 2/4",
    description: "Compás de marcha.",
    counting: "UNO dos",
    exercise: "Camina con el pulso.",
    level: "Principiante"
  },
  "3/4": {
    title: "Compás 3/4",
    description: "Compás tipo vals.",
    counting: "UNO dos tres",
    exercise: "Acentúa el primer tiempo.",
    level: "Principiante"
  },
  "4/4": {
    title: "Compás 4/4",
    description: "Compás más usado en música moderna.",
    counting: "UNO dos tres cuatro",
    exercise: "Aplaude en 2 y 4.",
    level: "Principiante"
  },
  "3/8": {
    title: "Compás 3/8",
    description: "Compás corto y rápido.",
    counting: "UNO dos tres",
    exercise: "Acentúa el tiempo 1.",
    level: "Básico"
  },
  "6/8": {
    title: "Compás 6/8",
    description: "Dos grupos de tres.",
    counting: "UNO dos tres | CUATRO cinco seis",
    exercise: "Acentúa 1 y 4.",
    level: "Intermedio"
  },
  "9/8": {
    title: "Compás 9/8",
    description: "Tres grupos de tres.",
    counting: "UNO dos tres | CUATRO cinco seis | SIETE ocho nueve",
    exercise: "Acentúa 1, 4 y 7.",
    level: "Intermedio"
  },
  "12/8": {
    title: "Compás 12/8",
    description: "Cuatro grupos de tres.",
    counting: "UNO dos tres | CUATRO cinco seis | SIETE ocho nueve | DIEZ once doce",
    exercise: "Acentúa 1, 4, 7 y 10.",
    level: "Intermedio"
  },
  "5/8": {
    title: "Compás 5/8",
    description: "Compás irregular que puede organizarse en bloques de 2 y 3 pulsos.",
    counting: "UNO dos tres | CUATRO cinco",
    exercise: "Practica diferentes agrupaciones.",
    level: "Avanzado"
  },
  "7/8": {
    title: "Compás 7/8",
    description: "Compás irregular usado en rock progresivo, metal progresivo y música experimental.",
    counting: "UNO dos | TRES cuatro | CINCO seis siete",
    exercise: "Acentúa cada grupo.",
    level: "Avanzado"
  },
  "13/8": {
    title: "Compás 13/8",
    description: "Compás irregular avanzado.",
    counting: "UNO dos tres | CUATRO cinco seis | SIETE ocho nueve | DIEZ once doce trece",
    exercise: "Divide el compás en bloques.",
    level: "Profesional"
  },
  "5/4": {
    title: "Compás 5/4",
    description: "Compás amalgama que mezcla bloques de 2 y 3.",
    counting: "UNO dos tres | CUATRO cinco",
    exercise: "Practica 3 + 2 y 2 + 3.",
    level: "Amalgama"
  },
  "7/4": {
    title: "Compás 7/4",
    description: "Compás amalgama que puede sentirse como 4 + 3 o 3 + 4.",
    counting: "UNO dos tres cuatro | CINCO seis siete",
    exercise: "Practica ambas agrupaciones.",
    level: "Amalgama"
  },
  "8/8": {
    title: "Compás 8/8",
    description: "Compás que puede sentirse como 3 + 3 + 2 u otras combinaciones.",
    counting: "UNO dos tres | CUATRO cinco seis | SIETE ocho",
    exercise: "Acentúa el inicio de cada bloque.",
    level: "Amalgama"
  },
  "10/8": {
    title: "Compás 10/8",
    description: "Compás amalgama con bloques desiguales.",
    counting: "UNO dos tres | CUATRO cinco seis | SIETE ocho | NUEVE diez",
    exercise: "Acentúa cada bloque.",
    level: "Amalgama"
  },
  "11/8": {
    title: "Compás 11/8",
    description: "Compás avanzado con agrupaciones irregulares.",
    counting: "UNO dos tres | CUATRO cinco seis | SIETE ocho | NUEVE diez once",
    exercise: "Trabaja lentamente.",
    level: "Amalgama avanzado"
  }
};

const accents = {
  "2/2": [1],
  "2/4": [1],
  "3/4": [1],
  "4/4": [1],
  "3/8": [1],
  "6/8": [1, 4],
  "9/8": [1, 4, 7],
  "12/8": [1, 4, 7, 10],
  "5/8": [1, 4],
  "7/8": [1, 3, 5],
  "13/8": [1, 4, 7, 10],
  "5/4": [1, 4],
  "7/4": [1, 5],
  "8/8": [1, 4, 7],
  "10/8": [1, 4, 7, 9],
  "11/8": [1, 4, 7, 9]
};

const groupings = {
  "5/8": [
    {
      label: "3 + 2",
      accents: [1, 4],
      counting: "UNO dos tres | CUATRO cinco",
      exercise: "Acentúa 1 y 4."
    },
    {
      label: "2 + 3",
      accents: [1, 3],
      counting: "UNO dos | TRES cuatro cinco",
      exercise: "Acentúa 1 y 3."
    }
  ],
  "7/8": [
    {
      label: "2 + 2 + 3",
      accents: [1, 3, 5],
      counting: "UNO dos | TRES cuatro | CINCO seis siete",
      exercise: "Acentúa 1, 3 y 5."
    },
    {
      label: "3 + 2 + 2",
      accents: [1, 4, 6],
      counting: "UNO dos tres | CUATRO cinco | SEIS siete",
      exercise: "Acentúa 1, 4 y 6."
    },
    {
      label: "2 + 3 + 2",
      accents: [1, 3, 6],
      counting: "UNO dos | TRES cuatro cinco | SEIS siete",
      exercise: "Acentúa 1, 3 y 6."
    }
  ],
  "13/8": [
    {
      label: "3 + 3 + 3 + 4",
      accents: [1, 4, 7, 10],
      counting: "UNO dos tres | CUATRO cinco seis | SIETE ocho nueve | DIEZ once doce trece",
      exercise: "Acentúa 1, 4, 7 y 10."
    },
    {
      label: "4 + 3 + 3 + 3",
      accents: [1, 5, 8, 11],
      counting: "UNO dos tres cuatro | CINCO seis siete | OCHO nueve diez | ONCE doce trece",
      exercise: "Acentúa 1, 5, 8 y 11."
    }
  ],
  "5/4": [
    {
      label: "3 + 2",
      accents: [1, 4],
      counting: "UNO dos tres | CUATRO cinco",
      exercise: "Practica 3 + 2."
    },
    {
      label: "2 + 3",
      accents: [1, 3],
      counting: "UNO dos | TRES cuatro cinco",
      exercise: "Practica 2 + 3."
    }
  ],
  "7/4": [
    {
      label: "4 + 3",
      accents: [1, 5],
      counting: "UNO dos tres cuatro | CINCO seis siete",
      exercise: "Practica 4 + 3."
    },
    {
      label: "3 + 4",
      accents: [1, 4],
      counting: "UNO dos tres | CUATRO cinco seis siete",
      exercise: "Practica 3 + 4."
    }
  ],
  "8/8": [
    {
      label: "3 + 3 + 2",
      accents: [1, 4, 7],
      counting: "UNO dos tres | CUATRO cinco seis | SIETE ocho",
      exercise: "Acentúa 1, 4 y 7."
    },
    {
      label: "2 + 3 + 3",
      accents: [1, 3, 6],
      counting: "UNO dos | TRES cuatro cinco | SEIS siete ocho",
      exercise: "Acentúa 1, 3 y 6."
    },
    {
      label: "3 + 2 + 3",
      accents: [1, 4, 6],
      counting: "UNO dos tres | CUATRO cinco | SEIS siete ocho",
      exercise: "Acentúa 1, 4 y 6."
    }
  ],
  "10/8": [
    {
      label: "3 + 3 + 2 + 2",
      accents: [1, 4, 7, 9],
      counting: "UNO dos tres | CUATRO cinco seis | SIETE ocho | NUEVE diez",
      exercise: "Acentúa 1, 4, 7 y 9."
    },
    {
      label: "2 + 3 + 2 + 3",
      accents: [1, 3, 6, 8],
      counting: "UNO dos | TRES cuatro cinco | SEIS siete | OCHO nueve diez",
      exercise: "Acentúa 1, 3, 6 y 8."
    }
  ],
  "11/8": [
    {
      label: "3 + 3 + 2 + 3",
      accents: [1, 4, 7, 9],
      counting: "UNO dos tres | CUATRO cinco seis | SIETE ocho | NUEVE diez once",
      exercise: "Acentúa 1, 4, 7 y 9."
    },
    {
      label: "2 + 3 + 3 + 3",
      accents: [1, 3, 6, 9],
      counting: "UNO dos | TRES cuatro cinco | SEIS siete ocho | NUEVE diez once",
      exercise: "Acentúa 1, 3, 6 y 9."
    }
  ]
};

const subdivisions = {
  1: { syllables: ["TA"] },
  2: { syllables: ["TA", "ka"] },
  3: { syllables: ["TA", "ki", "ta"] },
  4: { syllables: ["TA", "ka", "di", "mi"] }
};

const practiceSteps = [
  "Escucha el compás completo sin tocar nada.",
  "Marca el pulso con el pie.",
  "Aplaude solamente los acentos.",
  "Cuenta en voz alta mientras sigues el metrónomo.",
  "Sube 10 BPM y repite el ejercicio."
];

const rhythmFigures = {
  redonda: {
    description: "La redonda dura cuatro tiempos.",
    counting: "TA — — —",
    pattern: ["TA", "-", "-", "-"],
    exercise: "Toca solo en el primer tiempo y mantén el pulso internamente."
  },
  blanca: {
    description: "La blanca dura dos tiempos.",
    counting: "TA — TA —",
    pattern: ["TA", "-", "TA", "-"],
    exercise: "Toca en 1 y 3."
  },
  negra: {
    description: "La negra dura un tiempo.",
    counting: "TA TA TA TA",
    pattern: ["TA", "TA", "TA", "TA"],
    exercise: "Toca una vez por cada pulso."
  },
  corcheas: {
    description: "Las corcheas dividen cada pulso en dos partes.",
    counting: "TA-ka",
    pattern: ["TA", "ka"],
    exercise: "Toca dos golpes por cada pulso."
  },
  tresillos: {
    description: "Los tresillos dividen cada pulso en tres partes.",
    counting: "TA-ki-ta",
    pattern: ["TA", "ki", "ta"],
    exercise: "Toca tres golpes iguales por cada pulso."
  },
  semicorcheas: {
    description: "Las semicorcheas dividen cada pulso en cuatro partes.",
    counting: "TA-ka-di-mi",
    pattern: ["TA", "ka", "di", "mi"],
    exercise: "Toca cuatro golpes por cada pulso."
  },
  fusa: {
    description: "La fusa divide el pulso en ocho partes rápidas.",
    counting: "1-2-3-4-5-6-7-8",
    pattern: ["1", "2", "3", "4", "5", "6", "7", "8"],
    exercise: "Practica muy lento, entre 40 y 60 BPM."
  },
  semifusa: {
    description: "La semifusa divide el pulso en dieciséis partes. Es una figura muy rápida.",
    counting: "1-2-3-4-5-6-7-8-9-10-11-12-13-14-15-16",
    pattern: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"],
    exercise: "Empieza extremadamente lento. No subas BPM hasta sonar limpio."
  },
  negraPuntillo: {
    description: "La negra con puntillo dura un tiempo y medio.",
    counting: "TA — ka",
    pattern: ["TA", "-", "ka"],
    exercise: "Siente una duración larga antes del siguiente golpe."
  },
  corcheaPuntillo: {
    description: "La corchea con puntillo dura tres cuartos de tiempo.",
    counting: "TA —",
    pattern: ["TA", "-"],
    exercise: "Practica lentamente para sentir el arrastre rítmico."
  },
  ligadura: {
    description: "La ligadura une dos notas sin volver a atacar la segunda.",
    counting: "TA____",
    pattern: ["TA", "___"],
    exercise: "Toca el primer sonido y no repitas el golpe en la nota ligada."
  },
  contratiempo: {
    description: "El contratiempo toca en la parte débil del pulso.",
    counting: "— TA — TA",
    pattern: ["-", "TA", "-", "TA"],
    exercise: "No toques en el clic. Toca entre los clics."
  },
  quintillo: {
    description: "El quintillo divide el pulso en cinco partes iguales.",
    counting: "1-2-3-4-5",
    pattern: ["1", "2", "3", "4", "5"],
    exercise: "Divide cada pulso en cinco golpes iguales."
  },
  seisillo: {
    description: "El seisillo divide el pulso en seis partes iguales.",
    counting: "1-2-3-4-5-6",
    pattern: ["1", "2", "3", "4", "5", "6"],
    exercise: "Practica como dos grupos de tres dentro del pulso."
  },
  septillo: {
    description: "El septillo divide el pulso en siete partes iguales.",
    counting: "1-2-3-4-5-6-7",
    pattern: ["1", "2", "3", "4", "5", "6", "7"],
    exercise: "Mantén todos los golpes iguales, sin acelerar al final."
  },
  polirritmia32: {
    description: "La polirritmia 3 contra 2 superpone tres golpes sobre dos pulsos.",
    counting: "1 — 2 — 3",
    pattern: ["1", "-", "2", "-", "3"],
    exercise: "Siente tres golpes distribuidos sobre dos tiempos del metrónomo."
  },
  sincopa: {
    description: "La síncopa desplaza el acento hacia una parte débil.",
    counting: "TA — ka TA",
    pattern: ["TA", "-", "ka", "TA"],
    exercise: "Evita caer siempre en el tiempo fuerte."
  },
  silencioNegra: {
    description: "El silencio de negra ocupa un tiempo completo sin sonido.",
    counting: "silencio TA",
    pattern: ["silencio", "TA"],
    exercise: "No toques en el silencio, pero mantén el pulso mentalmente."
  },
  silencioCorchea: {
    description: "El silencio de corchea ocupa media parte del pulso.",
    counting: "silencio-ka",
    pattern: ["silencio", "ka"],
    exercise: "Calla en la primera mitad del pulso y toca en la segunda."
  },
  combinado: {
    description: "Combina negras, corcheas, silencios y síncopas.",
    counting: "TA TA-ka silencio TA",
    pattern: ["TA", "TA", "ka", "silencio", "TA"],
    exercise: "Lee el patrón lentamente y después actívalo con el metrónomo."
  }
};

const difficultyFigures = {
  basic: ["redonda", "blanca", "negra", "corcheas"],
  intermediate: ["tresillos", "semicorcheas", "sincopa", "silencioNegra", "silencioCorchea"],
  advanced: ["fusa", "negraPuntillo", "corcheaPuntillo", "ligadura", "contratiempo", "combinado"],
  professional: ["semifusa", "quintillo", "seisillo", "septillo", "polirritmia32"]
};

function getFigureName(key) {
  const names = {
    redonda: "Redonda",
    blanca: "Blanca",
    negra: "Negra",
    corcheas: "Corcheas",
    tresillos: "Tresillos",
    semicorcheas: "Semicorcheas",
    sincopa: "Síncopa básica",
    silencioNegra: "Silencio de negra",
    silencioCorchea: "Silencio de corchea",
    fusa: "Fusa",
    semifusa: "Semifusa",
    negraPuntillo: "Negra con puntillo",
    corcheaPuntillo: "Corchea con puntillo",
    ligadura: "Ligadura",
    contratiempo: "Contratiempo",
    quintillo: "Quintillo",
    seisillo: "Seisillo",
    septillo: "Septillo",
    polirritmia32: "Polirritmia 3 contra 2",
    combinado: "Patrón combinado"
  };

  return names[key] || key;
}

function getUnlockedSignatures() {
  let signatures = [];

  for (let i = 0; i <= currentLevelIndex; i++) {
    signatures = signatures.concat(levels[i].signatures);
  }

  return signatures;
}

function updateTimeSignatureOptions() {
  const unlocked = getUnlockedSignatures();
  const previousValue = timeSignatureSelect.value;

  timeSignatureSelect.innerHTML = "";

  unlocked.forEach((signature) => {
    const option = document.createElement("option");
    option.value = signature;
    option.textContent = signature;
    timeSignatureSelect.appendChild(option);
  });

  if (unlocked.includes(previousValue)) {
    timeSignatureSelect.value = previousValue;
  }
}

function getSelectedSignature() {
  return timeSignatureSelect.value;
}

function getBeatsFromSignature(signature) {
  return parseInt(signature.split("/")[0]);
}

function getSelectedGrouping() {
  const signature = getSelectedSignature();

  if (!groupings[signature]) {
    return null;
  }

  const selectedIndex =
    groupingSelect.selectedIndex >= 0 ? groupingSelect.selectedIndex : 0;

  return groupings[signature][selectedIndex];
}

function getCurrentAccents() {
  const grouping = getSelectedGrouping();

  if (grouping) {
    return grouping.accents;
  }

  return accents[getSelectedSignature()] || [1];
}

function updateGroupingOptions() {
  const signature = getSelectedSignature();

  groupingSelect.innerHTML = "";

  if (!groupings[signature]) {
    groupingContainer.style.display = "none";
    return;
  }

  groupingContainer.style.display = "block";

  groupings[signature].forEach((group) => {
    const option = document.createElement("option");
    option.value = group.label;
    option.textContent = group.label;
    groupingSelect.appendChild(option);
  });

  groupingSelect.selectedIndex = 0;
}

function updateLesson() {
  const lesson = lessons[getSelectedSignature()];
  const grouping = getSelectedGrouping();

  lessonTitle.textContent = lesson.title;
  lessonDescription.textContent = lesson.description;

  countingText.textContent = grouping ? grouping.counting : lesson.counting;
  exerciseText.textContent = grouping ? grouping.exercise : lesson.exercise;

  levelText.textContent = lesson.level;
}

function updateSubdivisionText() {
  subdivisionText.textContent =
    subdivisions[subdivisionSelect.value].syllables.join(" - ");
}

function updatePracticeStep() {
  practiceStep.textContent = practiceSteps[currentPracticeIndex];
}

function updateFigureOptionsByDifficulty() {
  const selectedDifficulty = difficultySelect.value;
  const availableFigures = difficultyFigures[selectedDifficulty];

  figureSelect.innerHTML = "";

  availableFigures.forEach((figureKey) => {
    const figure = rhythmFigures[figureKey];

    if (!figure) return;

    const option = document.createElement("option");
    option.value = figureKey;
    option.textContent = getFigureName(figureKey);

    figureSelect.appendChild(option);
  });

  figureSelect.selectedIndex = 0;
  updateRhythmFigure();
}

function updateRhythmFigure() {
  const figure = rhythmFigures[figureSelect.value];

  if (!figure) return;

  figureDescription.textContent = figure.description;
  figureCounting.textContent = figure.counting;
  figureExercise.textContent = figure.exercise;

  figurePattern.innerHTML = "";

  figure.pattern.forEach((item) => {
    const span = document.createElement("span");
    const isRest = item === "-" || item.toLowerCase().includes("silencio");

    span.classList.add(isRest ? "figure-rest" : "figure-hit");
    span.textContent = item;

    figurePattern.appendChild(span);
  });
}

function updateBeatCircles() {
  const beats = getBeatsFromSignature(getSelectedSignature());
  const accentList = getCurrentAccents();

  beatCircles.innerHTML = "";

  for (let i = 1; i <= beats; i++) {
    const circle = document.createElement("div");
    circle.classList.add("circle");

    if (accentList.includes(i)) {
      circle.classList.add("accent");
    }

    if (i === currentBeat) {
      circle.classList.add("current");
    }

    beatCircles.appendChild(circle);
  }
}

function playClick(frequency, volume = 0.25, delay = 0) {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  const startTime = audioContext.currentTime + delay;

  oscillator.frequency.value = frequency;
  gainNode.gain.setValueAtTime(volume, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

  oscillator.start(startTime);
  oscillator.stop(startTime + 0.05);
}

function createEvenSounds(divisions, beatDuration) {
  const sounds = [];

  for (let i = 0; i < divisions; i++) {
    sounds.push({
      delay: (beatDuration / divisions) * i,
      freq: i === 0 ? 950 : 650,
      volume: i === 0 ? 0.22 : 0.12
    });
  }

  return sounds;
}

function playRhythmFigurePattern() {
  const beatDuration = 60000 / bpm / 1000;
  let sounds = [];

  switch (figureSelect.value) {
    case "redonda":
      sounds = currentBeat === 1
        ? [{ delay: 0, freq: 950, volume: 0.25 }]
        : [];
      break;

    case "blanca":
      sounds = currentBeat === 1 || currentBeat === 3
        ? [{ delay: 0, freq: 950, volume: 0.25 }]
        : [];
      break;

    case "negra":
      sounds = [{ delay: 0, freq: 950, volume: 0.22 }];
      break;

    case "corcheas":
      sounds = createEvenSounds(2, beatDuration);
      break;

    case "tresillos":
      sounds = createEvenSounds(3, beatDuration);
      break;

    case "semicorcheas":
      sounds = createEvenSounds(4, beatDuration);
      break;

    case "fusa":
      sounds = createEvenSounds(8, beatDuration);
      break;

    case "semifusa":
      sounds = createEvenSounds(16, beatDuration);
      break;

    case "quintillo":
      sounds = createEvenSounds(5, beatDuration);
      break;

    case "seisillo":
      sounds = createEvenSounds(6, beatDuration);
      break;

    case "septillo":
      sounds = createEvenSounds(7, beatDuration);
      break;

    case "negraPuntillo":
      sounds = currentBeat % 2 !== 0
        ? [{ delay: 0, freq: 950, volume: 0.24 }]
        : [{ delay: beatDuration / 2, freq: 650, volume: 0.14 }];
      break;

    case "corcheaPuntillo":
      sounds = [
        { delay: 0, freq: 950, volume: 0.22 },
        { delay: beatDuration * 0.75, freq: 650, volume: 0.14 }
      ];
      break;

    case "ligadura":
      sounds = currentBeat === 1
        ? [{ delay: 0, freq: 950, volume: 0.25 }]
        : [];
      break;

    case "contratiempo":
    case "silencioCorchea":
      sounds = [{ delay: beatDuration / 2, freq: 950, volume: 0.24 }];
      break;

    case "silencioNegra":
      sounds = currentBeat % 2 === 0
        ? [{ delay: 0, freq: 950, volume: 0.22 }]
        : [];
      break;

    case "sincopa":
      sounds = [
        { delay: 0, freq: 950, volume: 0.2 },
        { delay: beatDuration / 2, freq: 700, volume: 0.18 }
      ];
      break;

    case "polirritmia32":
      sounds = [
        { delay: 0, freq: 1000, volume: 0.24 },
        { delay: (beatDuration * 2) / 3, freq: 700, volume: 0.18 },
        { delay: (beatDuration * 4) / 3, freq: 700, volume: 0.18 }
      ];
      break;

    case "combinado":
      if (currentBeat === 1) {
        sounds = [{ delay: 0, freq: 950, volume: 0.22 }];
      } else if (currentBeat === 2) {
        sounds = createEvenSounds(2, beatDuration);
      } else if (currentBeat === 3) {
        sounds = [];
      } else {
        sounds = [{ delay: 0, freq: 950, volume: 0.22 }];
      }
      break;

    default:
      sounds = [{ delay: 0, freq: 950, volume: 0.22 }];
  }

  sounds.forEach((sound) => {
    playClick(sound.freq, sound.volume, sound.delay);
  });
}

function tick() {
  const signature = getSelectedSignature();
  const beats = getBeatsFromSignature(signature);
  const accentList = getCurrentAccents();
  const isAccent = accentList.includes(currentBeat);
  const soundMode = soundModeSelect.value;

  beatDisplay.textContent = currentBeat;

  beatText.textContent = isAccent
    ? `Acento principal en ${currentBeat}`
    : `Pulso débil en ${currentBeat}`;

  beatDisplay.classList.remove("strong", "weak");
  beatDisplay.classList.add(isAccent ? "strong" : "weak");

  if (soundMode === "both" || soundMode === "metronome") {
    playClick(isAccent ? 1300 : 700, isAccent ? 0.22 : 0.12, 0);
  }

  if (soundMode === "both" || soundMode === "figure") {
    playRhythmFigurePattern();
  }

  updateBeatCircles();

  currentBeat++;

  if (currentBeat > beats) {
    currentBeat = 1;
  }
}

function startPracticeTimer() {
  if (practiceTimerId) return;

  practiceTimerId = setInterval(() => {
    totalPracticeSeconds++;
    localStorage.setItem("muselearnPracticeSeconds", totalPracticeSeconds);
    updateStatsUI();
  }, 1000);
}

function stopPracticeTimer() {
  clearInterval(practiceTimerId);
  practiceTimerId = null;
}

function startMetronome() {
  const interval = 60000 / bpm;

  tick();
  intervalId = setInterval(tick, interval);

  isPlaying = true;
  startStopBtn.textContent = "Detener";
  startPracticeTimer();
}

function stopMetronome() {
  clearInterval(intervalId);

  isPlaying = false;
  currentBeat = 1;

  startStopBtn.textContent = "Iniciar";
  beatDisplay.textContent = "1";
  beatText.textContent = "Tiempo fuerte";
  beatDisplay.classList.remove("strong", "weak");

  updateBeatCircles();
  stopPracticeTimer();
}

function updateStatsUI() {
  practiceTime.textContent = formatTime(totalPracticeSeconds);
  exerciseCount.textContent = reviewedExercises;
  achievedCount.textContent = achievedExercises;

  const progress = Math.min(
    Math.max(
      totalPracticeSeconds / DAILY_PRACTICE_GOAL_SECONDS,
      reviewedExercises / DAILY_EXERCISE_GOAL,
      achievedExercises / DAILY_EXERCISE_GOAL
    ),
    1
  );

  dailyGoalText.textContent = `${Math.round(progress * 100)}%`;

  goalMessage.textContent =
    progress >= 1
      ? "Meta diaria completada."
      : "Practica 5 minutos o completa 5 ejercicios.";
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function updateLevelUI() {
  const currentLevel = levels[currentLevelIndex];
  const progressPercent = ((currentLevelIndex + 1) / levels.length) * 100;

  levelTitle.textContent = currentLevel.name;
  levelDescription.textContent = currentLevel.description;
  progressFill.style.width = `${progressPercent}%`;
  progressText.textContent = `Progreso ${currentLevelIndex + 1}/${levels.length}`;

  completeLevelBtn.textContent =
    currentLevelIndex === levels.length - 1
      ? "Ruta completa"
      : "Completar nivel actual";
}

function refreshApp() {
  updateLevelUI();
  updateTimeSignatureOptions();
  updateGroupingOptions();
  updateLesson();
  updateSubdivisionText();
  updatePracticeStep();
  updateFigureOptionsByDifficulty();
  updateBeatCircles();
  updateStatsUI();
}

bpmInput.addEventListener("input", () => {
  bpm = parseInt(bpmInput.value);
  bpmValue.textContent = `${bpm} BPM`;

  if (isPlaying) {
    stopMetronome();
    startMetronome();
  }
});

timeSignatureSelect.addEventListener("change", () => {
  currentBeat = 1;

  updateGroupingOptions();
  updateLesson();
  updateBeatCircles();

  if (isPlaying) {
    stopMetronome();
    startMetronome();
  }
});

groupingSelect.addEventListener("change", () => {
  currentBeat = 1;

  updateLesson();
  updateBeatCircles();

  if (isPlaying) {
    stopMetronome();
    startMetronome();
  }
});

subdivisionSelect.addEventListener("change", updateSubdivisionText);

difficultySelect.addEventListener("change", () => {
  updateFigureOptionsByDifficulty();

  if (isPlaying) {
    stopMetronome();
    startMetronome();
  }
});

figureSelect.addEventListener("change", () => {
  updateRhythmFigure();

  if (isPlaying) {
    stopMetronome();
    startMetronome();
  }
});

soundModeSelect.addEventListener("change", () => {
  if (isPlaying) {
    stopMetronome();
    startMetronome();
  }
});

prevPracticeBtn.addEventListener("click", () => {
  currentPracticeIndex--;

  if (currentPracticeIndex < 0) {
    currentPracticeIndex = practiceSteps.length - 1;
  }

  reviewedExercises++;
  localStorage.setItem("muselearnReviewedExercises", reviewedExercises);

  updatePracticeStep();
  updateStatsUI();
});

nextPracticeBtn.addEventListener("click", () => {
  currentPracticeIndex++;

  if (currentPracticeIndex >= practiceSteps.length) {
    currentPracticeIndex = 0;
  }

  reviewedExercises++;
  localStorage.setItem("muselearnReviewedExercises", reviewedExercises);

  updatePracticeStep();
  updateStatsUI();
});

completeExerciseBtn.addEventListener("click", () => {
  achievedExercises++;
  reviewedExercises++;

  localStorage.setItem("muselearnAchievedExercises", achievedExercises);
  localStorage.setItem("muselearnReviewedExercises", reviewedExercises);

  updateStatsUI();
  goalMessage.textContent = "Ejercicio logrado.";
});

completeLevelBtn.addEventListener("click", () => {
  if (currentLevelIndex < levels.length - 1) {
    currentLevelIndex++;
    localStorage.setItem("muselearnLevel", currentLevelIndex);

    stopMetronome();
    refreshApp();
  } else {
    progressText.textContent =
      "Ruta completa. Ya tienes todos los compases desbloqueados.";
  }
});

resetProgressBtn.addEventListener("click", () => {
  localStorage.clear();

  currentLevelIndex = 0;
  totalPracticeSeconds = 0;
  reviewedExercises = 0;
  achievedExercises = 0;
  currentPracticeIndex = 0;

  stopMetronome();
  refreshApp();
});

startStopBtn.addEventListener("click", () => {
  if (isPlaying) {
    stopMetronome();
  } else {
    startMetronome();
  }
});

refreshApp();