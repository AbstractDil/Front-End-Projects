const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model';

const questions = [
  {
    q: "Which data structure uses LIFO (Last In, First Out) ordering?",
    opts: ["Queue", "Stack", "Linked List", "Tree"],
    ans: 1
  },
  {
    q: "What is the time complexity of binary search on a sorted array of n elements?",
    opts: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
    ans: 2
  },
  {
    q: "Which of the following is NOT a JavaScript primitive type?",
    opts: ["string", "boolean", "object", "undefined"],
    ans: 2
  }
];

let currentQ = 0, selectedAnswers = {}, violations = 0, violationLog = [];
let candidateDescriptor = null, isLocked = false, isExamStarted = false;
let videoStream = null, detectionInterval = null, timerInterval = null, timeLeft = 29*60+59;
let noFaceFrames = 0, mismatchFrames = 0;
const NO_FACE_THRESHOLD = 40, MISMATCH_THRESHOLD = 60;

async function loadModels() {
  document.getElementById('model-status').textContent = 'Loading tiny face detector…';
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  document.getElementById('model-status').textContent = 'Loading face landmark model…';
  await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
  document.getElementById('model-status').textContent = 'Loading face recognition model…';
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  document.getElementById('loader').style.display = 'none';
  document.getElementById('upload-section').style.display = 'block';
}

const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const img = await faceapi.fetchImage(url);
  document.getElementById('face-check-msg').innerHTML = '<span style="color:#f59e0b;">Analyzing face in photo…</span>';
  const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks(true).withFaceDescriptor();
  if (!detection) {
    document.getElementById('face-check-msg').innerHTML = '<span style="color:#ef4444;">❌ No face detected in photo. Please upload a clear face photo.</span>';
    document.getElementById('btn-start').disabled = true;
    return;
  }
  candidateDescriptor = detection.descriptor;
  const preview = document.getElementById('preview-img');
  preview.src = url;
  document.getElementById('preview-name').textContent = '✓ Face detected & enrolled';
  document.getElementById('upload-placeholder').style.display = 'none';
  document.getElementById('upload-preview').style.display = 'block';
  document.getElementById('upload-box').classList.add('has-file');
  document.getElementById('face-check-msg').innerHTML = '<span style="color:#22c55e;">✓ Face successfully enrolled. Ready to start.</span>';
  document.getElementById('btn-start').disabled = false;
  document.getElementById('candidate-thumb').src = url;
});

async function startExam() {
  document.getElementById('setup-panel').style.display = 'none';
  document.getElementById('exam-panel').style.display = 'block';
  renderQuestion();
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({ video: { width:280, height:210 } });
    const video = document.getElementById('video');
    video.srcObject = videoStream;
    await new Promise(r => video.onloadedmetadata = r);
    video.play();
    isExamStarted = true;
    startDetectionLoop();
    startTimer();
  } catch(err) {
    lockScreen(['Camera access denied — exam cannot proceed.']);
  }
}

function startDetectionLoop() {
  const video = document.getElementById('video');
  const canvas = document.getElementById('overlay-canvas');
  const ctx = canvas.getContext('2d');
  const matcher = new faceapi.FaceMatcher([new faceapi.LabeledFaceDescriptors('candidate', [candidateDescriptor])], 0.55);

  detectionInterval = setInterval(async () => {
    if (isLocked || !isExamStarted) return;
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize:224, scoreThreshold:0.4 }))
      .withFaceLandmarks(true).withFaceDescriptors();

    ctx.clearRect(0,0, canvas.width, canvas.height);
    const resized = faceapi.resizeResults(detections, { width:280, height:210 });
    const faceCountEl = document.getElementById('face-count').querySelector('span');
    faceCountEl.textContent = detections.length;

    if (detections.length === 0) {
      noFaceFrames++;
      mismatchFrames = 0;
      updateStatus('warning', 'No Face Detected');
      setMatchScore('—');
      if (noFaceFrames >= NO_FACE_THRESHOLD) {
        noFaceFrames = 0;
        addViolation('No face detected in frame');
        lockScreen(['No face visible in camera frame.', 'You may have looked away or left the camera area.']);
      }
      return;
    }
    noFaceFrames = 0;

    if (detections.length > 1) {
      addViolation('Multiple faces detected');
      lockScreen([`${detections.length} faces detected in frame.`, 'Only the registered candidate may be present.']);
      return;
    }

    const match = matcher.findBestMatch(detections[0].descriptor);
    const score = Math.max(0, Math.round((1 - match.distance) * 100));
    setMatchScore(score + '%');

    resized.forEach(det => {
      const box = det.detection.box;
      const isMatch = match.label === 'candidate';
      ctx.strokeStyle = isMatch ? '#22c55e' : '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(box.x, box.y, box.width, box.height);
      ctx.stroke();
      ctx.fillStyle = isMatch ? '#22c55e' : '#ef4444';
      ctx.font = '11px monospace';
      ctx.fillText(isMatch ? `✓ ${score}%` : `✗ Unknown`, box.x+4, box.y-5);
    });

    if (match.label !== 'candidate' || score < 40) {
      mismatchFrames++;
      updateStatus('warning', 'Verifying…');
      if (mismatchFrames >= MISMATCH_THRESHOLD) {
        mismatchFrames = 0;
        addViolation('Face mismatch — unrecognized person');
        lockScreen(['The detected face does not match the registered candidate.', 'Possible identity substitution detected.']);
      }
    } else {
      mismatchFrames = 0;
      updateStatus('verified', 'Verified ✓');
    }
  }, 300);
}

function updateStatus(type, label) {
  const badge = document.getElementById('status-badge');
  badge.className = 'status-badge ' + type;
  const dotClass = type === 'verified' ? 'green' : type === 'warning' ? 'yellow' : 'red';
  badge.innerHTML = `<span class="dot ${dotClass}"></span> ${label}`;
}
function setMatchScore(val) {
  document.getElementById('match-score').querySelector('span').textContent = val;
}
function addViolation(reason) {
  violations++;
  violationLog.push(reason);
  document.getElementById('violation-count').textContent = violations;
}

function lockScreen(reasons) {
  isLocked = true;
  updateStatus('locked', 'LOCKED');
  const ul = document.getElementById('violation-reasons');
  ul.innerHTML = '';
  reasons.forEach(r => { const li = document.createElement('li'); li.textContent = r; ul.appendChild(li); });
  document.getElementById('modal-vcount').textContent = violations;
  document.getElementById('lock-overlay').classList.add('active');
}

function unlockExam() {
  isLocked = false;
  document.getElementById('lock-overlay').classList.remove('active');
  updateStatus('verified', 'Verifying…');
}

function startTimer() {
  timerInterval = setInterval(() => {
    if (isLocked) return;
    timeLeft--;
    const m = Math.floor(timeLeft/60), s = timeLeft%60;
    document.getElementById('timer').textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    if (timeLeft <= 0) { clearInterval(timerInterval); lockScreen(['Exam time has expired.']); }
  }, 1000);
}

function renderQuestion() {
  const q = questions[currentQ];
  document.getElementById('q-progress').textContent = `Q ${currentQ+1} / ${questions.length}`;
  let html = `<div class="question-number">Question ${currentQ+1}</div>
    <div class="question-text">${q.q}</div>`;
  q.opts.forEach((opt, i) => {
    const sel = selectedAnswers[currentQ] === i ? ' selected' : '';
    html += `<button class="option-btn${sel}" onclick="selectAnswer(${i})">${String.fromCharCode(65+i)}. ${opt}</button>`;
  });
  document.getElementById('question-area').innerHTML = html;
}
function selectAnswer(i) {
  selectedAnswers[currentQ] = i;
  renderQuestion();
}
function nextQ() { if (currentQ < questions.length-1) { currentQ++; renderQuestion(); } }
function prevQ() { if (currentQ > 0) { currentQ--; renderQuestion(); } }

loadModels();