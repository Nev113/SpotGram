<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import MusicList from "../components/MusicList.vue";
import Loading from "../components/Loading.vue";

const searchResults = ref([]);
const route = useRoute();

const searchMusic = async (query) => {
  if (!query) return;
  try {
    const response = await fetch(
      `http://localhost:8000/search-music?query=${query}`,
      {
        headers: { "Access-Control-Allow-Origin": "*" },
      },
    );
    const data = await response.json();
    searchResults.value = data;
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
    class="pt-10 min-h-[calc(100vh-250px)] max-h-[calc(100vh-250px)] overflow-y-scroll scrollbar"
  >
    <MusicList v-if="searchResults.length > 0" :musicLists="searchResults" />
    <div v-else class="flex justify-center items-center h-full">
      <Loading />
    </div>
  </div>
</template>
