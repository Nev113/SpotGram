<script setup>
import AudioPlayer from "./components/AudioPlayer.vue";
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <div class="flex justify-center gap-5 md:p-0 p-5">
    <main
      class="text-[28px] md:text-3xl font-normal font-sans w-full md:max-w-[56vw] max-h-screen"
    >
      <Navbar />
      <div class="max-h-screen overflow-y-scroll scrollbar pt-2">
        <router-view />
      </div>
      <AudioPlayer />
    </main>
  </div>
</template>
