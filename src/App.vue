<script setup>
import { ref } from 'vue';
import HelloTea_tourism from './components/HelloTea_tourism.vue'
import './assets/css/App.css';
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/" class="logo-link">
        <img src="./assets/img/tea_LOGO.jpg" alt="logo" class="main-logo" />
        <a href="">
          <h1 class="brand">茶旅</h1>
        </a>
      </router-link>
      <div>
        <router-link to="/news">台灣茶知識庫</router-link>
        <router-link to="/teachers">茶旅專區</router-link>
        <router-link to="/services">線上茶店</router-link>
        <router-link to="/services">關於我們</router-link>
      </div>
      <div class="nav-icons">
        <a href="#" class="icon-btn search" title="搜尋"></a>
        <a href="/store" class="icon-btn cart" title="購物"></a>
        <a href="/login" class="icon-btn user" title="登入"></a>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>

</template>
