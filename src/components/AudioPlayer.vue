<script setup>
import { ref } from "vue";
import play from "../assets/play.svg";
import pause from "../assets/pause.svg";
import next from "../assets/next.svg";

const isRepeat = ref(0);
const isShuffle = ref(false);
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

const currentMusicIndex = ref(0);
const musicList = ref([]);

const shuffleMusicList = () => {
  musicList.value = [...musicList.value].sort(() => Math.random() - 0.5);
};

const toggleRepeat = () => {
  isRepeat.value = (isRepeat.value + 1) % 3;
};

const toggleShuffle = () => {
  isShuffle.value = !isShuffle.value;
};

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
  const { music, currentIndex } = JSON.parse(localStorage.getItem("Music"));
  const storedPlaying = localStorage.getItem("isPlaying");

  if (music) {
    if (music[currentIndex].play_url !== lastMusic.value) {
      lastMusic.value = music[currentIndex].play_url;
      currentMusicCover.value = music[currentIndex].cover;
      currentMusic.value = music[currentIndex];
      progress.value = 0;
      if (audio.value) {
        audio.value.src = music[currentIndex].play_url;
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

const nextSong = () => {
  const { music, currentIndex } = JSON.parse(localStorage.getItem("Music"));
  if (isShuffle.value) {
    shuffleMusicList();
    currentMusicIndex.value = currentIndex;
  } else {
    currentMusicIndex.value = currentIndex + 1;
  }

  if (currentMusicIndex.value >= music.length) {
    currentMusicIndex.value = 0;
  }

  playMusic(music, currentMusicIndex.value);
};

const formatTitle = (title) => {
  if (title.length > 20) {
    return title.slice(0, 20) + "...";
  }
  return title;
};

const musicUndo = () => {
  const { music, currentIndex } = JSON.parse(localStorage.getItem("Music"));
  if (isShuffle.value) {
    shuffleMusicList();
    currentMusicIndex.value = currentIndex;
  } else {
    currentMusicIndex.value = currentIndex - 1;
  }

  if (currentMusicIndex.value < 0) {
    currentMusicIndex.value = music.length - 1;
  }

  playMusic(music, currentMusicIndex.value);
};

const playMusic = (music, index) => {
  const musicList = { music, currentIndex: index };
  localStorage.setItem("Music", JSON.stringify(musicList));
  localStorage.setItem("isPlaying", "true");
};

const musicEnded = () => {
  const { music, currentIndex } = JSON.parse(localStorage.getItem("Music"));
  if (isShuffle.value) {
    shuffleMusicList();
    currentMusicIndex.value = currentIndex;
  } else if (isRepeat.value == 2) {
    return;
  } else {
    currentMusicIndex.value = currentIndex + 1;
  }

  if (currentMusicIndex.value >= music.length) {
    currentMusicIndex.value = 0;
  }

  playMusic(music, currentMusicIndex.value);
};

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

<template>
  <div
    class="flex flex-col md:flex-row items-center justify-center gap-2 pt-5 w-full md:h-[100px] max-w-[1280px]"
  >
    <div
      class="w-full md:w-[40%] bg-[#282828] border-4 border-[#323232] md:h-full h-[60px] rounded-[12px] p-1 flex flex-row gap-2 relative"
    >
      <img :src="currentMusicCover" alt="" class="h-full rounded-[8px]" />
      <div class="flex flex-col pt-2 md:gap-2 gap-0">
        <p class="text-white font-alexandria text-[12px] md:text-[14px]">
          {{ formatTitle(currentMusic?.title) }}
        </p>
        <p class="text-gray-400 font-alexandria text-[10px] md:text-[12px]">
          {{ formatTitle(currentMusic?.artist) }}
        </p>
        <p
          class="text-gray-400 font-alexandria text-[10px] md:text-[12px] absolute bottom-2 right-2 md:block hidden"
        >
          Now Playing
        </p>
      </div>
    </div>
    <div
      class="w-full h-full md:w-[60%] p-3 bg-[#282828] h-full rounded-[12px] border-4 border-[#323232] flex gap-1 flex-col items-center justify-center"
    >
      <div
        class="w-full max-h-[80%] rounded-[12px] flex gap-1 justify-center items-center"
      >
        <button
          @click="toggleShuffle"
          :class="
            isShuffle
              ? 'bg-[#d9d9d9] cursor-pointer rounded-[12px] p-2 w-[16%] h-full flex justify-center items-center'
              : 'bg-[#474747] cursor-pointer rounded-[12px] p-2 w-[16%] h-full flex justify-center items-center'
          "
        >
          <svg
            class="w-7"
            :class="isShuffle ? 'text-[#282828]' : 'text-[#d9d9d9]'"
            data-testid="geist-icon"
            height="16"
            stroke-linejoin="round"
            viewBox="0 0 16 16"
            width="16"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10.7499 1H9.99987V2.5H10.7499H12.4392L1.46954 13.4697L0.939209 14L1.99987 15.0607L2.5302 14.5303L13.4987 3.56182V5.25V6H14.9987V5.25V2C14.9987 1.44772 14.551 1 13.9987 1H10.7499Z"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.0002 7.06067L5.46983 6.53038L1.4691 2.53034L0.938721 2.00005L1.99929 0.939301L2.52967 1.46959L6.5304 5.46963L7.06077 5.99992L6.0002 7.06067ZM12.4377 13.4994H10.7499H9.99994V14.9994H10.7499H13.9994C14.5517 14.9994 14.9994 14.5517 14.9994 13.9994V10.75V9.99999H13.4994V10.75V12.4398L10.5305 9.46978L10.0003 8.93934L8.93944 9.99979L9.46966 10.5302L12.4377 13.4994Z"
            ></path>
          </svg>
        </button>
        <button
          @click="musicUndo"
          class="bg-[#474747] cursor-pointer rounded-[12px] p-2 w-[20%] h-full flex justify-center items-center"
        >
          <img class="w-7 rotate-180" :src="next" alt="" />
        </button>
        <button
          @click="togglePlay"
          class="bg-[#474747] cursor-pointer rounded-[12px] p-2 w-[20%] h-full flex justify-center items-center"
        >
          <img class="w-6 md:w-4" :src="isPlaying ? pause : play" alt="" />
        </button>
        <button
          @click="nextSong"
          class="bg-[#474747] cursor-pointer rounded-[12px] p-2 w-[20%] h-full flex justify-center items-center"
        >
          <img class="w-7" :src="next" alt="" />
        </button>
        <button
          @click="toggleRepeat"
          :class="
            isRepeat
              ? 'bg-[#d9d9d9] cursor-pointer rounded-[12px] p-2 w-[15%] h-full flex justify-center items-center'
              : 'bg-[#474747] cursor-pointer rounded-[12px] p-2 w-[15%] h-full flex justify-center items-center'
          "
        >
          <svg
            class="w-7"
            :class="isRepeat ? 'text-[#282828]' : 'text-[#d9d9d9]'"
            width="22"
            height="21"
            viewBox="0 0 22 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.3296 4.31254C12.4416 4.31254 13.5434 4.35279 14.6342 4.43067C15.3487 4.48052 16.0206 4.774 16.5272 5.25754C17.0337 5.74108 17.3412 6.38241 17.3934 7.06442C17.4337 7.57454 17.464 8.08817 17.4851 8.60354L15.9405 7.13004C15.8775 7.06557 15.8016 7.01385 15.7173 6.97799C15.633 6.94212 15.5419 6.92283 15.4496 6.92128C15.3573 6.91972 15.2656 6.93593 15.18 6.96894C15.0944 7.00194 15.0166 7.05107 14.9514 7.11339C14.8861 7.1757 14.8346 7.24993 14.8 7.33165C14.7655 7.41336 14.7485 7.50089 14.7501 7.589C14.7517 7.67712 14.7719 7.76402 14.8095 7.84451C14.8471 7.92501 14.9013 7.99746 14.9688 8.05754L17.7188 10.6825C17.8477 10.8054 18.0225 10.8745 18.2047 10.8745C18.3868 10.8745 18.5616 10.8054 18.6905 10.6825L21.4405 8.05754C21.5619 7.93314 21.628 7.7686 21.6249 7.59859C21.6218 7.42857 21.5496 7.26636 21.4236 7.14612C21.2977 7.02589 21.1277 6.95702 20.9496 6.95402C20.7715 6.95102 20.5991 7.01412 20.4688 7.13004L18.8628 8.66217C18.8417 8.09342 18.8078 7.52817 18.7638 6.96554C18.6867 5.97072 18.2378 5.03544 17.4988 4.33007C16.7598 3.6247 15.78 3.19617 14.7378 3.12254C12.4689 2.95915 10.1904 2.95915 7.92148 3.12254C6.87929 3.19617 5.89947 3.6247 5.16051 4.33007C4.42155 5.03544 3.97262 5.97072 3.89548 6.96554C3.8799 7.16154 3.86523 7.35667 3.85332 7.55354C3.84633 7.64031 3.8575 7.72754 3.88616 7.81015C3.91483 7.89277 3.96042 7.96911 4.02029 8.03474C4.08015 8.10038 4.1531 8.15399 4.23487 8.19246C4.31665 8.23093 4.40563 8.25349 4.49662 8.25883C4.58762 8.26417 4.67882 8.25218 4.76492 8.22356C4.85102 8.19493 4.93029 8.15025 4.99812 8.09211C5.06596 8.03396 5.121 7.96352 5.16005 7.88488C5.1991 7.80624 5.22137 7.72098 5.22557 7.63404C5.23748 7.44417 5.25123 7.25429 5.2659 7.06442C5.31812 6.38241 5.62558 5.74108 6.13215 5.25754C6.63871 4.774 7.31058 4.48052 8.02507 4.43067C9.1159 4.35192 10.2177 4.31254 11.3296 4.31254ZM4.94048 9.75504C4.81158 9.63215 4.63684 9.56312 4.45465 9.56312C4.27246 9.56312 4.09772 9.63215 3.96882 9.75504L1.21882 12.38C1.15127 12.4401 1.09709 12.5126 1.05952 12.5931C1.02194 12.6736 1.00174 12.7605 1.00011 12.8486C0.998478 12.9367 1.01546 13.0242 1.05004 13.1059C1.08461 13.1877 1.13608 13.2619 1.20136 13.3242C1.26665 13.3865 1.34441 13.4356 1.43002 13.4687C1.51562 13.5017 1.60732 13.5179 1.69963 13.5163C1.79194 13.5148 1.88298 13.4955 1.96731 13.4596C2.05164 13.4237 2.12754 13.372 2.19048 13.3075L3.79648 11.7754C3.81757 12.3442 3.85148 12.9094 3.89548 13.472C3.97262 14.4669 4.42155 15.4021 5.16051 16.1075C5.89947 16.8129 6.87929 17.2414 7.92148 17.315C10.1904 17.4785 12.4689 17.4785 14.7378 17.315C15.78 17.2414 16.7598 16.8129 17.4988 16.1075C18.2378 15.4021 18.6867 14.4669 18.7638 13.472C18.7794 13.2769 18.7931 13.0809 18.806 12.884C18.8143 12.7119 18.7514 12.5436 18.6308 12.4154C18.5101 12.2872 18.3416 12.2094 18.1614 12.1988C17.9812 12.1882 17.8039 12.2457 17.6678 12.3589C17.5316 12.472 17.4476 12.6317 17.4337 12.8035C17.4218 12.9934 17.4081 13.1833 17.3934 13.3732C17.3412 14.0552 17.0337 14.6965 16.5272 15.18C16.0206 15.6636 15.3487 15.9571 14.6342 16.0069C12.4343 16.1652 10.225 16.1652 8.02507 16.0069C7.31058 15.9571 6.63871 15.6636 6.13215 15.18C5.62558 14.6965 5.31812 14.0552 5.2659 13.3732C5.22543 12.8607 5.19487 12.3476 5.17423 11.834L6.71882 13.3075C6.84914 13.4235 7.02152 13.4866 7.19963 13.4836C7.37774 13.4806 7.54767 13.4117 7.67364 13.2915C7.7996 13.1712 7.87175 13.009 7.87489 12.839C7.87804 12.669 7.81192 12.5044 7.69048 12.38L4.94048 9.75504Z"
              fill="currentColor"
            ></path>
            <path
              v-if="isRepeat === 2"
              d="M10.1198 10.022L9.31883 9.176L10.8308 7.52V9.239L10.1198 10.022ZM10.8308 14V7.52H12.3248V14H10.8308Z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
      </div>
      <div
        class="w-[80%] w-full h-full rounded-[12px] flex flex-row items-center gap-2 relative"
      >
        <p class="text-white text-[12px] md:text-[14px] font-alexandria">
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
        <p class="text-white text-[12px] md:text-[14px] font-alexandria">
          {{ formatTime(duration) }}
        </p>
      </div>

      <audio
        ref="audio"
        @timeupdate="updateProgress"
        @loadedmetadata="onLoadedMetadata"
        @ended="musicEnded"
      ></audio>
    </div>
  </div>
</template>
