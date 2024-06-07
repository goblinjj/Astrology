<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <RouterLink class="routelink" to="/">星耀</RouterLink>
  <RouterLink class="routelink" to="/pan">组盘</RouterLink>
  <hr style="margin-bottom: 1em;">
  <RouterView />
</template>

<style scoped>
.routelink {
  color: black;
  font-size:x-large;
  padding: 0.3em;
  display: inline-block;
}
.router-link-active {
  color:cornflowerblue;
}
</style>
