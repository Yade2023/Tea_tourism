<script setup>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '../assets/css/HomeTea_tourism.css'
</script>

<template>
  <div class="home-page">
    <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active"
          aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1"
          aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2"
          aria-label="Slide 3"></button>
      </div>

      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="../assets/img/cats4.jpg" class="d-block w-100" alt="...">
          <!-- <div class="carousel-caption d-none d-md-block">
            <h5>First slide label</h5>
            <p>Some representative placeholder content for the first slide.</p>
          </div> -->
        </div>
        <div class="carousel-item">
          <img src="../assets/img/cats5.jpg" class="d-block w-100" alt="...">
          <!-- <div class="carousel-caption d-none d-md-block">
            <h5>Second slide label</h5>
            <p>Some representative placeholder content for the second slide.</p>
          </div> -->
        </div>
        <div class="carousel-item">
          <img src="../assets/img/cats3.jpg" class="d-block w-100" alt="...">
          <!-- <div class="carousel-caption d-none d-md-block">
            <h5>Third slide label</h5>
            <p>Some representative placeholder content for the third slide.</p>
          </div> -->
        </div>
      </div>

      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
    <div class="carBoby">
      <!-- Bootstrap_Horizontal -->
      <div class="card mb-3">
        <div class="row g-0">
          <div class="col-md-5">
            <img src="../assets/img/view1.jpg" class="img-fluid rounded-start" alt="...">
          </div>
          <div class="col-md-6">
            <div class="card-body">
              <h5 class="card-title">Card title</h5>
              <p class="card-text">茶,不只是飲品,
                更是一段文化的旅程。
                我們以旅為名,走訪茶山,
                記錄台灣茶的靜與深。</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Bootstrap_img -->
      <div class="card mb-3">
        <img src="../assets/img/view2.jpg" class="card-img-top" alt="...">
        <div class="card-img-overlay">
          <h5 class="card-title">大溪茶廠</h5>
        </div>
        <div class="card-body">
          <p class="card-text">青山依舊在,幾度夕陽紅。慣看秋月春風。一壺濁酒喜相逢,
            浪花淘盡英雄。是非成敗轉頭空,滾滾長江東逝水,白髮漁樵
            江渚上,古今多少事,都付笑談中。
            滾滾長江東逝水,浪花淘盡英雄。是非成敗轉頭空,青山依舊
            在,幾度夕陽紅。白髮漁樵江渚上,慣看秋月春風。一壺濁酒
            喜相逢,古今多少事,都付笑談中。
            青山依舊在,幾度夕陽紅。慣看秋月春風。一壺濁酒喜相逢,</p>
          <p class="card-text"><small class="text-muted">地址: 335桃園市大溪區復興路二段732巷80號
              營業時間:週一到週五,9:30-17:30(國定假日依官方為主)
              電話: 335桃園市大溪區復興路二段732巷80號
              網址:https://travel.tycg.gov.tw/</small></p>
        </div>
      </div>
      <!-- Bootstrap_CAR*3 -->
      <div class="card-group">
        <div class="card">
          <a href="#">
            <img src="../assets/img/view3.jpg" class="card-img-top" alt="...">
          </a>
          <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional
              content. This content is a little bit longer.</p>
            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
          </div>
        </div>
        <div class="card">
          <a href="#">
            <img src="../assets/img/05.jpg" class="card-img-top" alt="...">
          </a>
          <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
          </div>
        </div>
        <div class="card">
          <a href="#">
            <img src="../assets/img/06.jpg" class="card-img-top" alt="...">
          </a>
          <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional
              content. This card has even longer content than the first to show that equal height action.</p>
            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
          </div>
        </div>
      </div>
      <!-- Bootstrap_Image overlays -->
      <div class="card-group">
        <div class="card bg-dark text-white">
          <img src="../assets/img/09.jpg" class="card-img" alt="...">
          <div class="card-img-overlay">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">$800</p>
          </div>
        </div>
        <div class="card bg-dark text-white">
          <img src="../assets/img/10.jpg" class="card-img" alt="...">
          <div class="card-img-overlay">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">$800</p>
          </div>
        </div>
        <div class="card bg-dark text-white">
          <img src="../assets/img/11.jpg" class="card-img" alt="...">
          <div class="card-img-overlay">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">$800</p>
          </div>
        </div>
        <div class="card bg-dark text-white">
          <img src="../assets/img/12.jpg" class="card-img" alt="...">
          <div class="card-img-overlay">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">$800</p>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>
