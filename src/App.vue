<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
  import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
  import Footer from './components/Footer.vue'
  import './assets/css/App.css';

  const showInput = ref(false);
  const keyword = ref('');
  const userEmail = ref('');
  const route = useRoute();

  const toggleSearch = () => {
    showInput.value = !showInput.value;
  };

  // 檢查登入狀態
  const checkLoginStatus = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const email = localStorage.getItem('userEmail')
    if (isLoggedIn === 'true' && email) {
      userEmail.value = email
    } else {
      userEmail.value = ''
    }
  };

  // 登出功能
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    userEmail.value = ''
  };

  // 監聽路由變化，確保從登入頁跳轉後能更新狀態
  watch(() => route.path, () => {
    checkLoginStatus();
  });

  // 導入導航欄滾動功能
  onMounted(() => {
    import('./assets/js/navbar-scroll.js');
    checkLoginStatus();
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
          <router-link to="/Shopping4">線上茶店</router-link>
          <router-link to="/address">Q&A/聯絡我們</router-link>
        </div>
        <div class="nav-icons">
          <a href="#" role="button" class="icon-btn search" @click="toggleSearch" title="搜尋"></a>
          <!-- 搜尋輸入框 -->
          <!-- <input v-if="showInput" v-model="keyword" type="text" placeholder="輸入搜尋內容..." class="search-input" /> -->
          <a href="/store" class="icon-btn cart" title="購物"></a>
          <!-- 如果已登入，顯示帳號和登出按鈕；否則顯示登入連結 -->
          <template v-if="userEmail">
            <span class="user-email">{{ userEmail }}</span>
            <button @click="handleLogout" class="logout-btn" title="登出">登出</button>
          </template>
          <router-link v-else to="/login" class="icon-btn user" title="登入"></router-link>
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
