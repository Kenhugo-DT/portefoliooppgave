// INFO PER VIDEO

const videoData = {
    "E1ckbjugllU": {
        title: "Dungeon Vibes",
        text: "Ken got tasked with creating the soundtracks, sounds and noises for a Game Dev Project with a Dungeon crawler theme. This is the most #sharefriendly draft."
    },
    "8ta-z1RjDlc": {
        title: "NOISE",
        text: "While trying to dial the right sound for the Dungeon project, Ken found this sound and started improvising. Luckily it got recorded."
    },
};

let player;

// Liste over videoer som er lov å spille
const allowedVideos = [
  "E1ckbjugllU",
  "8ta-z1RjDlc",
];

// YouTube API callback – oppretter spilleren
function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "390",
    width: "640",
    videoId: allowedVideos[0] // standard video ved innlasting
  });
}

// Funksjon for å bytte video
function loadVideo(videoId) {

    // Spill videoen
    if (player && player.loadVideoById) {
        player.loadVideoById(videoId);
    }

    // Oppdater tekst hvis videoen finnes i databasen
    if (videoData[videoId]) {
        document.getElementById("info-title").textContent = videoData[videoId].title;
        document.getElementById("info-text").textContent  = videoData[videoId].text;
        document.getElementById("video-heading").textContent = videoData[videoId].title;
    }
}