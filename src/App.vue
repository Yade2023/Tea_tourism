<script setup>
// 如果需要import圖片
import taiwanImg from './assets/img/taiwan.png'
</script>

<template>
  <div class="app">
    <img :src="taiwanImg" alt="台灣茶葉" />
    <p>桃園</p>
    <p>是非成敗轉眼空，青山依舊在，幾度夕陽紅。</p>
    <p>白雲深處有人家，笑看紅塵多變化。</p>
    <p>遠上寒山石徑斜，白雲生處有人家。</p>
  </div>
</template>

<style scoped>
.app {
  text-align: center;
  padding: 20px;
}
</style>