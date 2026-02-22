<script setup>
import logo from "@/assets/logo.svg";
import search from "@/assets/search.svg";
import { useRouter } from "vue-router";

const router = useRouter();

function handleSearch(event) {
  router.push(`/search/${event.target.value}`);
}
</script>

<template>
  <header class="flex justify-between">
    <img
      @click="$router.push('/')"
      :src="logo"
      width="45px"
      class="cursor-pointer"
    />
    <div class="flex flex-row gap-1">
      <div
        class="flex flex-row gap-1 rounded-[9px] bg-neutral-800 border-4 border-neutral-700 px-3"
      >
        <img :src="search" width="18px" />
        <input
          type="text"
          @keydown.enter="handleSearch"
          class="h-full w-[160px] md:w-[200px] p-[1px] px-1 text-[18px] text-neutral-400 placeholder:text-neutral-500 focus:outline-none placeholder:text-[18px] placeholder:margin-auto font-['Akshar']"
          placeholder="Cari Musik"
        />
      </div>
    </div>
  </header>
</template>
