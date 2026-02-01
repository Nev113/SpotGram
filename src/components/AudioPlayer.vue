<template>
  <div
    class="flex flex-row items-center justify-center gap-2 pt-5 w-[56vw] h-[100px] max-w-[1280px]"
  >
    <div
      class="w-[40%] bg-[#282828] border-4 border-[#323232] h-full rounded-[12px] p-1 flex flex-row gap-2 relative"
    >
      <img :src="currentMusicCover" alt="" class="h-full rounded-[8px]" />
      <div class="flex flex-col pt-2 gap-">
        <p class="text-white font-alexandria text-[14px]">
          {{ currentMusic?.title }}
        </p>
        <p class="text-gray-400 font-alexandria text-[12px]">
          {{ currentMusic?.artist }}
        </p>
        <p
          class="text-gray-400 font-alexandria text-[12px] absolute bottom-2 right-2"
        >
          {{ formatTime(duration) }}
        </p>
      </div>
    </div>
    <div
      class="w-[60%] p-3 bg-[#282828] h-full rounded-[12px] border-4 border-[#323232] flex flex-col items-center justify-center"
    >
      <div
        class="w-full max-h-[80%] rounded-[12px] flex justify-center items-center"
      >
        <button
          @click="togglePlay"
          class="bg-[#474747] cursor-pointer rounded-[12px] p-2 w-[20%] h-full flex justify-center items-center"
        >
          <img class="w-4" :src="isPlaying ? pause : play" alt="" />
        </button>
      </div>
      <div
        class="w-[80%] w-full h-full rounded-[12px] flex flex-row items-center gap-2 relative"
      >
        <p class="text-white text-[14px] font-alexandria">
          {{ formatTime(currentTime) }}
        </p>
        <div class="relative w-full h-[5px] flex items-center">
          <div
            class="w-full h-full bg-[#424242] rounded-[12px] overflow-hidden absolute top-0 left-0 pointer-events-none"
          >
            <div
              :style="{ width: progress + '%' }"
              class="h-full bg-white rounded-[12px]"
            ></div>
          </div>
          <input
            type="range"
            min="0"
            :max="duration"
            v-model="seekTime"
            @input="seekAudio"
            @change="finishSeek"
            class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
            step="0.1"
          />
        </div>
        <p class="text-white text-[14px] font-alexandria">
          {{ formatTime(duration) }}
        </p>
      </div>

      <audio
        ref="audio"
        :src="src"
        @timeupdate="updateProgress"
        @loadedmetadata="onLoadedMetadata"
      ></audio>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import play from "../assets/play.svg";
import pause from "../assets/pause.svg";

const audio = ref(null);
const isPlaying = ref(false);

const lastMusic = ref(null);

const progress = ref(0);
const currentTime = ref(0);
const seekTime = ref(0);
const isSeeking = ref(false);
const duration = ref(0);
const currentMusicCover = ref("");
const currentMusic = ref({
  title: "",
  artist: "",
});

const formatTime = (time) => {
  if (!time) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const updateProgress = () => {
  if (audio.value) {
    currentTime.value = audio.value.currentTime;
    if (!isSeeking.value) {
      seekTime.value = audio.value.currentTime;
      progress.value = (audio.value.currentTime / audio.value.duration) * 100;
    }
  }
};

const seekAudio = () => {
  isSeeking.value = true;
  if (duration.value > 0) {
    progress.value = (seekTime.value / duration.value) * 100;
    currentTime.value = seekTime.value;
  }
};

const finishSeek = () => {
  isSeeking.value = false;
  if (audio.value) {
    audio.value.currentTime = seekTime.value;
  }
};

const onLoadedMetadata = () => {
  if (audio.value) {
    duration.value = audio.value.duration;
  }
};

setInterval(() => {
  const storedMusic = JSON.parse(localStorage.getItem("currentMusic"));
  const storedPlaying = localStorage.getItem("isPlaying");

  if (storedMusic) {
    if (storedMusic.url !== lastMusic.value) {
      lastMusic.value = storedMusic.url;
      currentMusicCover.value = storedMusic.cover;
      currentMusic.value = storedMusic;
      progress.value = 0;
      if (audio.value) {
        audio.value.src = storedMusic.url;
      }
    }

    if (storedPlaying === "true" && audio.value && audio.value.paused) {
      audio.value
        .play()
        .then(() => {
          isPlaying.value = true;
        })
        .catch((e) => {
          isPlaying.value = false;
          localStorage.setItem("isPlaying", "false");
        });
    } else if (
      storedPlaying === "false" &&
      audio.value &&
      !audio.value.paused
    ) {
      audio.value.pause();
      isPlaying.value = false;
    }
  }
}, 1000);

const togglePlay = () => {
  if (!audio.value) return;

  if (isPlaying.value) {
    audio.value.pause();
    localStorage.setItem("isPlaying", "false");
  } else {
    audio.value.play();
    localStorage.setItem("isPlaying", "true");
  }

  isPlaying.value = !isPlaying.value;
};
</script>
