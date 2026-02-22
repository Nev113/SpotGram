<script setup>
import logo from "../assets/logo.svg";
</script>

<template>
  <div class="flex flex-col gap-4 items-center pt-5">
    <img :src="logo" width="50px" />
    <div class="flex flex-row gap-1 *:size-2 *:bg-[#d9d9d9]">
      <div class="animate-pulse delay-0"></div>
      <div class="animate-pulse delay-100"></div>
      <div class="animate-pulse delay-200"></div>
    </div>
  </div>
</template>
