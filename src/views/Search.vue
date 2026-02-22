<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import MusicList from "../components/MusicList.vue";
import Loading from "../components/Loading.vue";
import { getData } from "../functions/routing";

const searchResults = ref([]);
const route = useRoute();

const searchMusic = async (query) => {
  if (!query) return;
  try {
    const response = await getData("/search-music?query=" + query);
    searchResults.value = response;
  } catch (error) {
    console.error("Search error:", error);
  }
};

watch(
  () => route.params.q,
  (newQ) => {
    searchMusic(newQ);
  },
  { immediate: true },
);
</script>

<template>
  <div
    class="min-h-[calc(100vh-250px)] max-h-[calc(100vh-250px)] overflow-y-scroll scrollbar"
  >
    <div v-if="searchResults.length > 0">
      <MusicList :musicLists="searchResults" />
    </div>
    <div v-else class="flex justify-center items-center h-full">
      <Loading />
    </div>
  </div>
</template>
