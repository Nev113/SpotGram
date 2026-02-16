<script setup>
import unfav from "../assets/unfav.svg";
import play from "../assets/play.svg";
import fav from "../assets/love.svg";
import { ref } from "vue";

const { musicLists, isFav } = defineProps({
  musicLists: {
    type: Array,
    required: true,
  },
  isFav: {
    type: Boolean,
    default: false,
  },
});

const formatTitle = (title) => {
  if (title.length > 20) {
    return title.slice(0, 26) + "...";
  }
  return title;
};

const formatDuration = (ms) => {
  if (!ms) return "00:00";
  return new Date(ms).toISOString().slice(14, 19);
};

const playMusic = (music, index) => {
  const musicList = { music, currentIndex: index };
  localStorage.setItem("Music", JSON.stringify(musicList));
  localStorage.setItem("isPlaying", "true");
};

const emit = defineEmits(["updateFav"]);

const favMusic = (music, unFav) => {
  console.log("Tap!");
  const favMusicList = JSON.parse(localStorage.getItem("FavMusic")) || [];

  const index = favMusicList.findIndex((item) => item.id === music.id);

  if (unFav) {
    if (index !== -1) {
      favMusicList.splice(index, 1);
    }
  } else {
    if (index !== -1) {
      favMusicList.splice(index, 1);
    } else {
      favMusicList.push(music);
    }
  }

  localStorage.setItem("FavMusic", JSON.stringify(favMusicList));
  emit("updateFav");
};
</script>

<template>
  <div class="flex flex-col gap-[2px]">
    <div
      v-for="music in musicLists"
      :key="music.id"
      @click="playMusic(musicLists, musicLists.indexOf(music))"
      class="flex flex-row items-center cursor-pointer hover:bg-[#212121] p-[7px] rounded-[12px] transition-all duration-100 group"
    >
      <div class="flex flex-row gap-2 items-center">
        <div class="max-w-[40px] max-h-[40px]">
          <img
            :src="music.cover"
            width="40px"
            class="rounded-[6px] min-w-[40px] min-h-[40px]"
          />
        </div>
        <div class="flex-none">
          <h2 class="alexandria-header text-[14px] text-[#d9d9d9] pb-[1px]">
            {{ formatTitle(music.title) }}
          </h2>
          <p
            class="font-alexandria text-[12px] text-[#717171] flex items-center gap-1"
          >
            {{ formatTitle(music.artist) }}
            <span
              class="inline-block min-w-[4px] min-h-[4px] bg-[#717171] rounded-[2px]"
            ></span>
            {{ formatDuration(music.duration) }}
          </p>
        </div>
      </div>
      <div class="grow flex flex-row justify-end">
        <div class="flex flex-row gap-4 items-center pr-5">
          <img
            v-if="!isFav"
            :src="fav"
            class="opacity-0 group-hover:opacity-100 transition-opacity brightness-40"
            width="16px"
            @click="favMusic(music, false)"
          />
          <img
            v-if="isFav"
            :src="unfav"
            class="opacity-0 group-hover:opacity-100 transition-opacity brightness-40"
            width="16px"
            @click="favMusic(music, true)"
          />
          <img
            @click.stop="playMusic(musicLists, musicLists.indexOf(music))"
            :src="play"
            class="opacity-0 group-hover:opacity-100 transition-opacity brightness-80"
            width="13px"
          />
        </div>
      </div>
    </div>
  </div>
</template>
