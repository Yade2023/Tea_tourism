<script setup>
import { onMounted ,ref } from 'vue';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import Footer from './components/Footer.vue'
import './assets/css/App.css';

const showInput = ref(false);
const keyword = ref('');

const toggleSearch = () => {
  showInput.value = !showInput.value;
};

// 導入導航欄滾動功能
onMounted(() => {
  import('./assets/js/navbar-scroll.js');
});
</script>

<template>
  <div id="app">
    <div class="wrap">
      <!-- 🔥 這塊是透明的滑鼠感應區 -->
      <div class="nav-hover-zone"></div>
      <nav class="navbar hidden">
        <router-link to="/" class="logo-link">
          <img src="./assets/img/tea_LOGO1.jpg" alt="logo" class="main-logo" />
          <a href="">
            <h1 class="brand">茶旅</h1>
          </a>
        </router-link>
        <div>
          <router-link to="/knowledge">台灣茶知識庫</router-link>
          <router-link to="/teaTourismArea">茶旅專區</router-link>
          <router-link to="/services">線上茶店</router-link>
          <router-link to="/address">關於我們</router-link>
        </div>
        <div class="nav-icons">
          <a href="#" role="button" class="icon-btn search" @click="toggleSearch" title="搜尋"></a>
          <!-- 搜尋輸入框 -->
          <!-- <input v-if="showInput" v-model="keyword" type="text" placeholder="輸入搜尋內容..." class="search-input" /> -->
          <a href="/store" class="icon-btn cart" title="購物"></a>
          <router-link to="/login" class="icon-btn user" title="登入"></router-link>
          <!-- <a href="/login" class="icon-btn user" title="登入"></a> -->
        </div>
        <svg class="navbar-wave" viewBox="0 0 1440 70" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,55 
             C1080,100 720,20 360,60 
             C180,80 100,60 0,55 Z" fill="#d2f3cd" />
        </svg>
      </nav>
      <main class="main-content">
        <router-view />
      </main>
      <!-- 🔽 回到頂部按鈕 -->
      <div class="back-to-top" id="backToTop">TOP</div>

      <footer>
        <Footer />
      </footer>
    </div>
  </div>
</template>
