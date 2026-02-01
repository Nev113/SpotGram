<script setup>
import axios from "axios";
import play from "../assets/play.svg";
import fav from "../assets/love.svg";
import { ref } from "vue";

const musicList = ref([]);

axios
  .get("http://localhost:8000/get-music", {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
  .then((response) => {
    musicList.value = response.data;
  });

const formatTitle = (title) => {
  if (title.length > 20) {
    return title.slice(0, 20) + "...";
  }
  return title;
};

const formatDuration = (ms) => {
  if (!ms) return "00:00";
  return new Date(ms).toISOString().slice(14, 19);
};

const playMusic = (url, cover, title, artist, duration) => {
  const currentMusic = {
    url,
    cover,
    title,
    artist,
    duration,
  };
  localStorage.setItem("currentMusic", JSON.stringify(currentMusic));
  localStorage.setItem("isPlaying", "true");
};

const isPlaying = ref(false);

const togglePlay = () => {
  isPlaying.value = !isPlaying.value;
};
</script>

<template>
  <div class="flex flex-col gap-[2px]">
    <div
      v-for="music in musicList"
      :key="music.id"
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
            :src="fav"
            class="opacity-0 group-hover:opacity-100 transition-opacity brightness-40"
            width="16px"
          />
          <img
            @click="
              playMusic(
                music.play_url,
                music.cover,
                music.title,
                music.artist,
                music.duration,
              )
            "
            :src="play"
            class="opacity-0 group-hover:opacity-100 transition-opacity brightness-80"
            width="13px"
          />
        </div>
      </div>
    </div>
  </div>
</template>
