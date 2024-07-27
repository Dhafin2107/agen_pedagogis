var selectedCharacter = "";
function changeImage(element, newImage) {
  element.src = newImage;
}

function selectCharacter(character) {
  var popup = document.getElementById("popup");
  popup.style.display = "none";

  selectedCharacter = character;

  var folder = selectedCharacter + "/"; //mengarahkan de direktori yang dipilih

  var images = [
    "NewNetral.gif",
    "NewAngry2Relax",
    "Newdisgust2Happy",
    "NewDisgust2Surprise",
    "NewFear2Relax",
    "NewHappy",
    "NewSad2Happy",
    "NewSad2Surprise",
    "NewSayHi",
    "NewSurprise",
    "Neutral.gif",
    "Happy.gif",
    "Sadness.gif",
    "Anger.gif",
    "Surprised.gif",
    "Confused.gif",
    "Neutral2Happy.gif",
    "Neutral2Sadness.gif",
    "Neutral2Anger.gif",
    "Neutral2Surprised.gif",
    "Neutral2Confused.gif",
    "Happy2Neutral.gif",
    "Happy2Sadness.gif",
    "Happy2Anger.gif",
    "Happy2Surprised.gif",
    "Happy2Confused.gif",
    "Sadness2Neutral.gif",
    "Sadness2Happy.gif",
    "Sadness2Anger.gif",
    "Sadness2Surprised.gif",
    "Sadness2Confused.gif",
    "Anger2Neutral.gif",
    "Anger2Happy.gif",
    "Anger2Sadness.gif",
    "Anger2Surprised.gif",
    "Anger2Confused.gif",
    "Surprised2Neutral.gif",
    "Surprised2Happy.gif",
    "Surprised2Sadness.gif",
    "Surprised2Anger.gif",
    "Surprised2Confused.gif",
    "Confused2Neutral.gif",
    "Confused2Happy.gif",
    "Confused2Sadness.gif",
    "Confused2Anger.gif",
    "Confused2Surprised.gif",
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

  // Membuat instance dari AWS Rekognition SDK dengan menggunakan access key dan secret key yang valid
  const rekognition = new AWS.Rekognition({
    region: "ap-southeast-2",
    accessKeyId: "AKIA5WGSLCIKGLDGFXPB",
    secretAccessKey: "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",
  });

  // Mengambil elemen video dan canvas dari dokumen HTML
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Mengatur konfigurasi media yang akan digunakan oleh getUserMedia
  const constraints = {
    video: true,
  };

  // Mengambil akses dari webcam melalui getUserMedia
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (mediaStream) {
      video.srcObject = mediaStream;
      // Ketika metadata dari video sudah di-load, memutar video
      video.onloadedmetadata = function (e) {
        video.play();
      };
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    });

  // Inisialisasi variabel untuk menyimpan emosi sebelumnya
  let prevEmotion = "CALM";

  // Membuat fungsi interval untuk capture gambar setiap 10 detik
  setInterval(function () {
    // Menggambar hasil capture video ke dalam elemen canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Mengonversi gambar menjadi blob dan membacanya sebagai array buffer
    canvas.toBlob(function (blob) {
      const fileReader = new FileReader();
      fileReader.onload = function () {
        const arrayBuffer = this.result;
        const byteArray = new Uint8Array(arrayBuffer);
        // Mengirim gambar sebagai byte array ke AWS Rekognition untuk proses face detection
        rekognition.detectFaces(
          {
            Image: {
              Bytes: byteArray,
            },
            Attributes: ["ALL"],
          },
          function (err, data) {
            if (err) {
              console.log(err, err.stack);
            } else if (data.FaceDetails && data.FaceDetails.length > 0) {
              const emotions = data.FaceDetails[0].Emotions;
              const maxEmotion = emotions.reduce(function (prev, current) {
                return prev.Confidence > current.Confidence ? prev : current;
              });
              // Menampilkan jenis emosi terbesar pada konsol
              console.log(maxEmotion.Type);
              respondToEmotion(maxEmotion.Type);
            } else {
              console.log("No faces detected");
              playVideo(selectedCharacter + "NewNetral.gif");
            }
          }
        );

        const agenVideo = document.getElementById("agenVideo");
        const expressionBtns = document.querySelectorAll(".expressionBtn");

        function playVideo(videoName) {
          agenVideo.style.backgroundImage = `url(${videoName})`;
        }
        // Fungsi untuk memberikan respon terhadap ekspresi wajah yang dideteksi
        function respondToEmotion(emotion) {
          // Menampilkan pesan respons terkait ekspresi wajah yang dideteksi
          switch (emotion) {
            case "HAPPY":
              if (prevEmotion == "CALM") {
                console.log("dari CALM jadi HAPPY");
                playVideo(selectedCharacter + "/NewHappy.gif");
              } else if (prevEmotion == "SAD") {
                console.log("dari SAD jadi HAPPY");
                playVideo(selectedCharacter + "/NewHappy.gif");
              } else if (prevEmotion == "ANGRY") {
                console.log("dari ANGRY jadi HAPPY");
                playVideo(selectedCharacter + "/NewHappy.gif");
              } else if (prevEmotion == "CONFUSED") {
                console.log("dari CONFUSED jadi HAPPY");
                playVideo(selectedCharacter + "/NewHappy.gif");
              } else if (prevEmotion == "DISGUSTED") {
                console.log("dari DISGUSTED jadi HAPPY");
                playVideo(selectedCharacter + "/NewHappy.gif");
              } else if (prevEmotion == "SURPRISED") {
                console.log("dari SURPRISED jadi HAPPY");
                playVideo(selectedCharacter + "/NewHappy.gif");
              } else if (prevEmotion == "FEAR") {
                console.log("dari FEAR jadi HAPPY");
                playVideo(selectedCharacter + "/NewHappy.gif");
              } else if (prevEmotion == "UNKNOWN") {
                console.log("dari UNKNOWN jadi HAPPY");
                playVideo(selectedCharacter + "/NewHappy.gif");
              } else {
                console.log("masih HAPPY");
                playVideo(selectedCharacter + "/NewHappy.gif");
              }
              break;
            case "SAD":
              if (prevEmotion == "CALM") {
                console.log("dari CALM jadi SAD");
                playVideo(Math.random() < 0.5 ? selectedCharacter + "/NewSad2Happy.gif" : selectedCharacter + "/NewSad2Surprise.gif");
              } else if (prevEmotion == "HAPPY") {
                console.log("dari HAPPY jadi SAD");
                playVideo(Math.random() < 0.5 ? selectedCharacter + "/NewSad2Happy.gif" : selectedCharacter + "/NewSad2Surprise.gif");
              } else if (prevEmotion == "ANGRY") {
                console.log("dari ANGRY jadi SAD");
                playVideo(Math.random() < 0.5 ? selectedCharacter + "/NewSad2Happy.gif" : selectedCharacter + "/NewSad2Surprise.gif");
              } else if (prevEmotion == "CONFUSED") {
                console.log("dari CONFUSED jadi SAD");
                playVideo(Math.random() < 0.5 ? selectedCharacter + "/NewSad2Happy.gif" : selectedCharacter + "/NewSad2Surprise.gif");
              } else if (prevEmotion == "DISGUSTED") {
                console.log("dari DISGUSTED jadi SAD");
                playVideo(Math.random() < 0.5 ? selectedCharacter + "/NewSad2Happy.gif" : selectedCharacter + "/NewSad2Surprise.gif");
              } else if (prevEmotion == "SURPRISED") {
                console.log("dari SURPRISED jadi SAD");
                playVideo(Math.random() < 0.5 ? selectedCharacter + "/NewSad2Happy.gif" : selectedCharacter + "/NewSad2Surprise.gif");
              } else if (prevEmotion == "FEAR") {
                console.log("dari FEAR jadi SAD");
                playVideo(Math.random() < 0.5 ? selectedCharacter + "/NewSad2Happy.gif" : selectedCharacter + "/NewSad2Surprise.gif");
              } else if (prevEmotion == "UNKNOWN") {
                console.log("dari UNKNOWN jadi SAD");
                playVideo(Math.random() < 0.5 ? selectedCharacter + "/NewSad2Happy.gif" : selectedCharacter + "/NewSad2Surprise.gif");
              } else {
                console.log("masih SAD");
                playVideo(Math.random() < 0.5 ? selectedCharacter + "/NewSad2Happy.gif" : selectedCharacter + "/NewSad2Surprise.gif");
              }
              break;
            case "ANGRY":
              if (prevEmotion == "CALM") {
                console.log("dari CALM jadi ANGRY");
                playVideo(selectedCharacter + "/NewAngry2Relax.gif");
              } else if (prevEmotion == "SAD") {
                console.log("dari SAD jadi ANGRY");
                playVideo(selectedCharacter + "/NewAngry2Relax.gif");
              } else if (prevEmotion == "HAPPY") {
                console.log("dari HAPPY jadi ANGRY");
                playVideo(selectedCharacter + "/NewAngry2Relax.gif");
              } else if (prevEmotion == "CONFUSED") {
                console.log("dari CONFUSED jadi ANGRY");
                playVideo(selectedCharacter + "/NewAngry2Relax.gif");
              } else if (prevEmotion == "DISGUSTED") {
                console.log("dari DISGUSTED jadi ANGRY");
                playVideo(selectedCharacter + "/NewAngry2Relax.gif");
              } else if (prevEmotion == "SURPRISED") {
                console.log("dari SURPRISED jadi ANGRY");
                playVideo(selectedCharacter + "/NewAngry2Relax.gif");
              } else if (prevEmotion == "FEAR") {
                console.log("dari FEAR jadi ANGRY");
                playVideo(selectedCharacter + "/NewAngry2Relax.gif");
              } else if (prevEmotion == "UNKNOWN") {
                console.log("dari UNKNOWN jadi ANGRY");
                playVideo(selectedCharacter + "/NewAngry2Relax.gif");
              } else {
                console.log("masih ANGRY");
                playVideo(selectedCharacter + "/NewAngry2Relax.gif");
              }
              break;
            case "CONFUSED":
              if (prevEmotion == "CALM") {
                console.log("dari CALM jadi CONFUSED");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "SAD") {
                console.log("dari SAD jadi CONFUSED");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "ANGRY") {
                console.log("dari ANGRY jadi CONFUSED");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "HAPPY") {
                console.log("dari HAPPY jadi CONFUSED");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "DISGUSTED") {
                console.log("dari DISGUSTED jadi CONFUSED");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "SURPRISED") {
                console.log("dari SURPRISED jadi CONFUSED");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "FEAR") {
                console.log("dari FEAR jadi CONFUSED");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "UNKNOWN") {
                console.log("dari UNKNOWN jadi CONFUSED");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else {
                console.log("masih CONFUSED");
                playVideo(selectedCharacter + "/NewNetral.gif");
              }
              break;
            case "SURPRISED":
              if (prevEmotion == "CALM") {
                console.log("dari CALM jadi SURPRISED");
                playVideo(selectedCharacter + "/NewSurprise.gif");
              } else if (prevEmotion == "SAD") {
                console.log("dari SAD jadi SURPRISED");
                playVideo(selectedCharacter + "/NewSurprise.gif");
              } else if (prevEmotion == "ANGRY") {
                console.log("dari ANGRY jadi SURPRISED");
                playVideo(selectedCharacter + "/NewSurprise.gif");
              } else if (prevEmotion == "CONFUSED") {
                console.log("dari CONFUSED jadi SUPRISED");
                playVideo(selectedCharacter + "/NewSurprise.gif");
              } else if (prevEmotion == "DISGUSTED") {
                console.log("dari DISGUSTED jadi SURPRISED");
                playVideo(selectedCharacter + "/NewSurprise.gif");
              } else if (prevEmotion == "HAPPY") {
                console.log("dari HAPPY jadi SURPRISED");
                playVideo(selectedCharacter + "/NewSurprise.gif");
              } else if (prevEmotion == "FEAR") {
                console.log("dari FEAR jadi SURPRISED");
                playVideo(selectedCharacter + "/NewSurprise.gif");
              } else if (prevEmotion == "UNKNOWN") {
                console.log("dari UNKNOWN jadi SURPRISED");
                playVideo(selectedCharacter + "/NewSurprise.gif");
              } else {
                console.log("masih SURPRISED");
                playVideo(selectedCharacter + "/NewSurprise.gif");
              }
              break;
            case "CALM":
              if (prevEmotion == "HAPPY") {
                console.log("dari HAPPY jadi CALM");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "SAD") {
                console.log("dari SAD jadi CALM");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "ANGRY") {
                console.log("dari ANGRY jadi CALM");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "CONFUSED") {
                console.log("dari CONFUSED jadi CALM");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "DISGUSTED") {
                console.log("dari DISGUSTED jadi CALM");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "SURPRISED") {
                console.log("dari SURPRISED jadi CALM");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "FEAR") {
                console.log("dari FEAR jadi CALM");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "UNKNOWN") {
                console.log("dari UNKNOWN jadi CALM");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else {
                console.log("masih CALM");
                playVideo(selectedCharacter + "/NewNetral.gif");
              }
              break;
            case "DISGUSTED":
              if (prevEmotion == "CALM") {
                console.log("dari CALM jadi DISGUSTED");
                playVideo(Math.random() < 0.5 ? selectedCharacter + "/NewDisgust2Surprise.gif" : selectedCharacter + "/NewDisgust2Happy.gif");
              } else if (prevEmotion == "SAD") {
                console.log("dari SAD jadi DISGUSTED");
                playVideo(Math.random() < 0.5 ? selectedCharacter + "/NewDisgust2Happy.gif" : selectedCharacter + "/NewDisgust2Surprise.gif");
              } else if (prevEmotion == "ANGRY") {
                console.log("dari ANGRY jadi DISGUSTED");
                playVideo(Math.random() < 0.5 ? selectedCharacter + "/NewDisgust2Happy.gif" : selectedCharacter + "/NewDisgust2Surprise.gif");
              } else if (prevEmotion == "CONFUSED") {
                console.log("dari CONFUSED jadi DISGUSTED");
                playVideo(Math.random() < 0.5 ? selectedCharacter + "/NewDisgust2Happy.gif" : selectedCharacter + "/NewDisgust2Surprise.gif");
              } else if (prevEmotion == "HAPPY") {
                console.log("dari HAPPY jadi DISGUSTED");
                playVideo(Math.random() < 0.5 ? selectedCharacter + "/NewDisgust2Happy.gif" : selectedCharacter + "/NewDisgust2Surprise.gif");
              } else if (prevEmotion == "SURPRISED") {
                console.log("dari SURPRISED jadi DISGUSTED");
                playVideo(Math.random() < 0.5 ? selectedCharacter + "/NewDisgust2Happy.gif" : selectedCharacter + "/NewDisgust2Surprise.gif");
              } else if (prevEmotion == "FEAR") {
                console.log("dari FEAR jadi DISGUSTED");
                playVideo(Math.random() < 0.5 ? selectedCharacter + "/NewDisgust2Happy.gif" : selectedCharacter + "/NewDisgust2Surprise.gif");
              } else if (prevEmotion == "UNKNOWN") {
                console.log("dari UNKNOWN jadi DISGUSTED");
                playVideo(Math.random() < 0.5 ? selectedCharacter + "/NewDisgust2Happy.gif" : selectedCharacter + "/NewDisgust2Surprise.gif");
              } else {
                console.log("masih DISGUSTED");
                playVideo(Math.random() < 0.5 ? selectedCharacter + "/NewDisgust2Happy.gif" : selectedCharacter + "/NewDisgust2Surprise.gif");
              }
              break;
            case "FEAR":
              if (prevEmotion == "CALM") {
                console.log("dari CALM jadi FEAR");
                playVideo(selectedCharacter + "/NewFear2Relax.gif");
              } else if (prevEmotion == "SAD") {
                console.log("dari SAD jadi FEAR");
                playVideo(selectedCharacter + "/NewFear2Relax.gif");
              } else if (prevEmotion == "ANGRY") {
                console.log("dari ANGRY jadi FEAR");
                playVideo(selectedCharacter + "/NewFear2Relax.gif");
              } else if (prevEmotion == "CONFUSED") {
                console.log("dari CONFUSED jadi FEAR");
                playVideo(selectedCharacter + "/NewFear2Relax.gif");
              } else if (prevEmotion == "DISGUSTED") {
                console.log("dari DISGUSTED jadi FEAR");
                playVideo(selectedCharacter + "/NewFear2Relax.gif");
              } else if (prevEmotion == "SURPRISED") {
                console.log("dari SURPRISED jadi FEAR");
                playVideo(selectedCharacter + "/NewFear2Relax.gif");
              } else if (prevEmotion == "HAPPY") {
                console.log("dari HAPPY jadi FEAR");
                playVideo(selectedCharacter + "/NewFear2Relax.gif");
              } else if (prevEmotion == "UNKNOWN") {
                console.log("dari UNKNOWN jadi FEAR");
                playVideo(selectedCharacter + "/NewFear2Relax.gif");
              } else {
                console.log("masih FEAR");
                playVideo(selectedCharacter + "/NewFear2Relax.gif");
              }
              break;
            case "UNKNOWN":
              if (prevEmotion == "CALM") {
                console.log("dari CALM jadi UNKNOWN");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "SAD") {
                console.log("dari SAD jadi UNKNOWN");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "ANGRY") {
                console.log("dari ANGRY jadi UNKNOWN");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "CONFUSED") {
                console.log("dari CONFUSED jadi UNKNOWN");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "DISGUSTED") {
                console.log("dari DISGUSTED jadi UNKNOWN");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "SURPRISED") {
                console.log("dari SURPRISED jadi UNKNOWN");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "FEAR") {
                console.log("dari FEAR jadi UNKNOWN");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else if (prevEmotion == "HAPPY") {
                console.log("dari HAPPY jadi UNKNOWN");
                playVideo(selectedCharacter + "/NewNetral.gif");
              } else {
                console.log("masih UNKNOWN");
                playVideo(selectedCharacter + "/NewNetral.gif");
              }
              break;
            default:
              console.log("I'm not sure how you're feeling.");
              playVideo(selectedCharacter + "/NewNetral.gif");
          }
          // Menyimpan emosi saat ini sebagai emosi sebelumnya
          prevEmotion = emotion;
        }
      };

      fileReader.readAsArrayBuffer(blob);
    }, "image/jpeg");
  }, 10000); // Setiap 5 detik
}
