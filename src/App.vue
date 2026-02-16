<script setup>
import AudioPlayer from "./components/AudioPlayer.vue";
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <main
    class="text-3xl font-normal font-sans min-w-[56vw] max-h-screen overflow-hidden"
  >
    <Navbar />
    <div class="max-h-screen overflow-y-scroll scrollbar">
      <router-view />
    </div>
    <AudioPlayer />
  </main>
</template>
