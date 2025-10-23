<script setup>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '../assets/css/HomeTea_tourism.css'
</script>

<template>
  <div class="home-page">
    <div id="carouselExampleCaptions" class="carousel slide" data-bs-next="600" data-bs-ride="carousel"
      data-bs-interval="2000" data-bs-touch="true" data-bs-wrap="true">
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
          <img src="../assets/images/index_img/carousel01.jpg" class="d-block w-100" alt="...">
          <!-- <div class="carousel-caption d-none d-md-block">
            <h5>First slide label</h5>
            <p>Some representative placeholder content for the first slide.</p>
          </div> -->
        </div>
        <div class="carousel-item">
          <img src="../assets/images/index_img/carousel02.jpg" class="d-block w-100" alt="...">
          <!-- <div class="carousel-caption d-none d-md-block">
            <h5>Second slide label</h5>
            <p>Some representative placeholder content for the second slide.</p>
          </div> -->
        </div>
        <div class="carousel-item">
          <img src="../assets/images/index_img/carousel03.jpg" class="d-block w-100" alt="...">
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
            <img src="../assets/images/index_img/idea01.jpg" class="img-fluid " alt="...">
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
        <img src="../assets/images/index_img/daxitea.jpg" class="card-img-top" alt="...">
        <div class="card-img-overlay">
          <h5 class="card-title">大溪茶廠</h5>
        </div>
        <div class="card-body">
          <p class="card-text">大溪茶廠創建於1926年，是台灣現存最古老的茶廠之一。
            這座歷史悠久的建築見證了台灣茶業的興衰，至今仍保持著傳統的製茶工藝。
            茶廠座落在桃園大溪的山間，四周綠意盎然，空氣清新怡人。
            在這裡，您可以深度體驗從採茶、製茶到品茶的完整過程，
            感受茶葉在時光中沉澱的醇厚韻味。走進大溪茶廠，
            彷彿走進了一座茶文化的博物館，每一個角落都訴說著台灣茶的故事。</p>
          <p class="card-text"><small class="text-muted">地址: 335桃園市大溪區復興路二段732巷80號
              營業時間: 週一至週五 9:30-17:30 (國定假日依官方公告)
              電話: 03-382-5089
              網址: <a href="https://travel.tycg.gov.tw/">https://travel.tycg.gov.tw/</a></small></p>
        </div>
      </div>
      <!-- Bootstrap_CAR*3 -->
      <div class="card-group">
        <div class="card me-3">
          <a href="#">
            <img src="../assets/images/index_img/Knowledge01.jpg" class="card-img-top" alt="...">
          </a>
          <div class="card-body ">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional
              content. This content is a little bit longer.</p>
            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
          </div>
        </div>
        <div class="card me-3">
          <a href="#">
            <img src="../assets/images/index_img/Knowledge02.jpg" class="card-img-top" alt="...">
          </a>
          <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
          </div>
        </div>
        <div class="card me-3">
          <a href="#">
            <img src="../assets/images/index_img/Knowledge03.jpg" class="card-img-top" alt="...">
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
      <div class="card-group d-flex justify-content-between align-items-stretch px-0 flex-wrap">
        <div class="card bg-dark text-white">
          <img src="../assets/images/index_img/joint01.jpg" class="card-img" alt="...">
          <div class="card-img-overlay">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">$800</p>
          </div>
        </div>
        <div class="card bg-dark text-white">
          <img src="../assets/images/index_img/joint02.jpg" class="card-img" alt="...">
          <div class="card-img-overlay">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">$800</p>
          </div>
        </div>
        <div class="card bg-dark text-white">
          <img src="../assets/images/index_img/joint03.jpg" class="card-img" alt="...">
          <div class="card-img-overlay">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">$800</p>
          </div>
        </div>
        <div class="card bg-dark text-white">
          <img src="../assets/images/index_img/joint04.jpg" class="card-img" alt="...">
          <div class="card-img-overlay">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">$800</p>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>
