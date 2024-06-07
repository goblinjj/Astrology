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
/* 移除链接的颜色 */
a:link {
    color: inherit;
    text-decoration: none;
}

/* 移除访问过的链接的颜色 */
a:visited {
    color: inherit;
    text-decoration: none;
}

/* 移除鼠标悬停在链接上的颜色 */
a:hover {
    color: inherit;
    text-decoration: none;
}

/* 移除选定链接的颜色 */
a:active {
    color: inherit;
    text-decoration: none;
}
</style>
