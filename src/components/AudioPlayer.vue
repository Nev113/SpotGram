<template>
  <div
    class="flex flex-row items-center justify-center gap-2 pt-5 absolute bottom-10 left-[50%] translate-x-[-50%] w-[50%] h-[100px]"
  >
    <div
      class="w-[20%] bg-[#282828] border-5 border-[#323232] h-full rounded-[12px]"
    >
      <img :src="currentMusicCover" alt="" class="w-10" />
    </div>
    <div
      class="w-[80%] p-3 bg-[#282828] h-full rounded-[12px] border-5 border-[#323232] flex flex-col items-center justify-center"
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
  const currentMusic = JSON.parse(localStorage.getItem("currentMusic"));
  const storedPlaying = localStorage.getItem("isPlaying");

  if (currentMusic) {
    if (currentMusic.url !== lastMusic.value) {
      lastMusic.value = currentMusic.url;
      currentMusicCover.value = currentMusic.cover;
      progress.value = 0;
      if (audio.value) {
        audio.value.src = currentMusic.url;
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
