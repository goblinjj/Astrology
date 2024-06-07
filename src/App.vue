<script setup>
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/vue"
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <RouterLink class="routelink" to="/">星耀</RouterLink>
  <RouterLink class="routelink" to="/pan">组盘</RouterLink>
  <hr style="margin-bottom: 1em;">
  <RouterView />
  <Analytics />
  <SpeedInsights />
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
a{
  outline: none;
  text-decoration: none;

  &:hover,&:active {
    -webkit-tap-highlight-color: transparent;
  }

}
a,
a:hover,
a:active,
a:visited,
a:link,
a:focus {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: transparent;
    outline: none;
    background: none;
    text-decoration: none;
}
</style>
