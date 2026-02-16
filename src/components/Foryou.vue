<script setup>
import MusicList from "./MusicList.vue";
import { onMounted, ref } from "vue";
import { getData, URL_API } from "../functions/routing";

const musicList = ref([]);
const favMusicList = ref([]);

const updateFavList = () => {
  favMusicList.value = JSON.parse(localStorage.getItem("FavMusic")) || [];
};

onMounted(() => {
  updateFavList();
  musicList.value = getData(URL_API + "/get-music");
});
</script>

<template>
  <div class="flex flex-row gap-3 *:rounded-[12px] pt-3 *:w-full *:h-[400px]">
    <div class="p-2 flex gap-3 flex-col bg-[#282828]">
      <div class="w-full p-3 bg-[#212121] rounded-[4px]">
        <h2 class="akshar-header text-[20px] text-[#d9d9d9]">Untuk Kamu</h2>
        <p class="text-[#474747] text-[16px] font-['akshar']">
          Spesial Hanya Untuk Kamu
        </p>
      </div>
      <div
        class="overflow-y-scroll px-1 h-[300px] scrollbar rounded-[12px] scrollbar-track-transparent scrollbar-thumb-[#00000]"
      >
        <MusicList
          v-if="musicList.length > 0"
          :musicLists="musicList"
          @updateFav="updateFavList"
        />
      </div>
    </div>
    <div class="p-2 flex gap-3 flex-col bg-[#450500]">
      <div class="w-full p-3 bg-[#740900] rounded-[4px]">
        <h2 class="akshar-header text-[20px] text-[#ffc7c7]">Lagu Favorit</h2>
        <p class="text-[#ffc7c7] text-[16px] font-['akshar'] opacity-70">
          Lagu Yang Kamu Suka
        </p>
      </div>
      <div
        class="w-full h-full flex flex-row max-h-[300px] scrollbar overflow-y-scroll"
        v-if="favMusicList.length > 0"
      >
        <MusicList
          :musicLists="favMusicList"
          :isFav="true"
          class="w-full"
          @updateFav="updateFavList"
        />
      </div>
      <div
        v-else
        class="w-full h-full flex flex-row justify-center items-center"
      >
        <p class="text-[14px] font-alexandria font-bold text-[#ffc7c7]">
          Belum ada lagu favorit
        </p>
      </div>
    </div>
  </div>
</template>
