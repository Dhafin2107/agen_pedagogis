var selectedCharacter = "";
let intervalId, videoChangeIntervalId, captionChangeIntervalId;
let latestResult = null;
let video, canvas, context;
let currentEmotion = "Netral"; // Inisialisasi variabel emosi saat ini
let currentEmotionPerc = 0; // Inisialisasi variabel persentase emosi saat ini
let currentFaceBox = null; // Inisialisasi variabel face box saat ini

function changeImage(element, newImage) {
  element.src = newImage;
}

function selectCharacter(character) {
  var popup = document.getElementById("popup");
  popup.style.display = "none";
  selectedCharacter = character;

  var folder = selectedCharacter + "/"; //mengarahkan ke direktori yang dipilih
  var images = [
    "NewNetral.gif",
    "NewAngry2Relax.gif",
    "NewDisgust2Happy.gif",
    "NewDisgust2Surprise.gif",
    "NewFear2Relax.gif",
    "NewHappy.gif",
    "NewSad2Happy.gif",
    "NewSad2Surprise.gif",
    "NewSayHi.gif",
    "NewSurprise.gif",
    // Daftar gambar lainnya
  ];

  for (var i = 0; i < images.length; i++) {
    var imageSrc = folder + images[i];
    var link = document.createElement("link");
    link.rel = "preload";
    link.href = imageSrc;
    link.as = "image";
    link.type = "image/gif";
    document.head.appendChild(link);
  }

  // Inisialisasi variabel video dan canvas setelah popup ditutup
  video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  // Mengatur aliran media ke elemen video setelah elemen tersedia
  setMediaStream();

  startCapturing();
}

// Mengatur konfigurasi media yang akan digunakan oleh getUserMedia
const constraints = {
  video: true,
};

function setMediaStream() {
  // Access the device camera and stream to video element
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      video.srcObject = stream;
      video.play(); // Pastikan video dimulai
      console.log("Camera stream set");
    })
    .catch((err) => {
      console.error("Error accessing the camera: ", err);
    });

  // Menyesuaikan ukuran dan posisi kanvas saat video dimuat
  video.addEventListener("loadeddata", () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  });
}

// Inisialisasi variabel untuk menyimpan emosi sebelumnya
let prevEmotion = "Netral";
let hasPlayedSayHi = false;

// Capture image from video stream
function captureImage() {
  const captureCanvas = document.createElement("canvas");
  captureCanvas.width = video.videoWidth;
  captureCanvas.height = video.videoHeight;
  const captureContext = captureCanvas.getContext("2d");
  captureContext.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
  return captureCanvas.toDataURL("image/jpeg").split(",")[1];
}

// Send image to API for analysis
async function analyzeImage(base64Image) {
  const url = "https://emovalaro7-service-7qkc4rj5aa-et.a.run.app/predict";
  const payload = { image: base64Image };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      latestResult = data;
      currentFaceBox = data.face_box;
      drawFaceBox(currentFaceBox, currentEmotion, currentEmotionPerc); // Menampilkan emosi saat ini
      logResult();
    } else {
      console.error("Error:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("Error details:", errorText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Draw face box and emotion label on canvas
function drawFaceBox(faceBox, emotion, emotionPerc) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (faceBox) {
    let color = "blue";
    if (emotion === "Neutral" || emotion === "Happiness" || emotion === "Surprise") {
      color = "blue";
    }
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.strokeRect(faceBox.x, faceBox.y, faceBox.width, faceBox.height);

    context.font = "18px Arial";
    context.fillStyle = color;
    context.fillText(`${emotion} (${(emotionPerc * 100).toFixed(2)}%)`, faceBox.x, faceBox.y - 10);
  }
}

// Log the latest result
function logResult() {
  console.log("Latest result:", latestResult);
}

// Capture and analyze image periodically
function captureAndAnalyzePeriodically() {
  const base64Image = captureImage();
  analyzeImage(base64Image);
}

function startCapturing() {
  captureAndAnalyzePeriodically(); // Call once immediately
  intervalId = setInterval(captureAndAnalyzePeriodically, 1000);
  videoChangeIntervalId = setInterval(updateAgentVideo, 10000); // Update agent video every 10 seconds
  captionChangeIntervalId = setInterval(updateCaption, 5000); // Update caption every 5 seconds
}

// Add agent video based on emotion detected
function addAgentVideo(emotion) {
  let agenVideo = document.getElementById("agenVideo");

  let videoName = "";

  if (!hasPlayedSayHi) {
    videoName = "NewSayHi";
    hasPlayedSayHi = true;
    setTimeout(() => {
      updateAgentVideo(); // Lanjutkan ke video berdasarkan emosi setelah 6 detik
    }, 6000); // 6000 ms = 6 detik
  } else {
    if (emotion === "Neutral") {
      videoName = "NewNetral";
    } else if (emotion === "Disgust") {
      videoName = "NewDisgust2Happy";
    } else if (emotion === "Fear") {
      videoName = "NewFear2Relax";
    } else if (emotion === "Happiness") {
      videoName = "NewHappy";
    } else if (emotion === "Sadness") {
      videoName = "NewSad2Happy";
    } else if (emotion === "Anger") {
      videoName = "NewAngry2Relax";
    } else if (emotion === "Surprise") {
      videoName = "NewSurprise";
    } else {
      videoName = "NewNetral";
    }
  }

  let folder = selectedCharacter + "/"; //mengarahkan ke direktori yang dipilih
  let imageSrc = folder + videoName + ".gif";
  agenVideo.src = imageSrc;
}

function updateAgentVideo() {
  if (latestResult) {
    currentEmotion = latestResult.emotion; // Perbarui emosi saat ini
    currentEmotionPerc = latestResult.emotion_perc; // Perbarui persentase emosi saat ini
    addAgentVideo(currentEmotion);
    drawFaceBox(currentFaceBox, currentEmotion, currentEmotionPerc); // Perbarui face box dengan emosi saat ini
  }
}

function updateCaption() {
  if (latestResult) {
    currentEmotion = latestResult.emotion; // Perbarui emosi saat ini
    currentEmotionPerc = latestResult.emotion_perc; // Perbarui persentase emosi saat ini
    drawFaceBox(currentFaceBox, currentEmotion, currentEmotionPerc); // Perbarui face box dengan emosi saat ini
  }
}
