// 茶葉資料
const teaData = {
    red: {
        name: '紅茶',
        image: 'https://images.unsplash.com/photo-1597318178260-0b8e2c0c4c2b?w=600&h=600&fit=crop',
        description: '紅茶是台灣重要的茶葉品種之一，具有濃郁的香氣和醇厚的口感。紅茶經過完全發酵，茶湯呈現深紅色，口感濃郁甘甜，適合搭配牛奶或檸檬飲用。紅茶含有豐富的茶多酚和咖啡因，具有提神醒腦的功效。'
    },
    'roasted-oolong': {
        name: '焙香烏龍',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&fit=crop',
        description: '焙香烏龍是經過特殊烘焙工藝製作的烏龍茶，具有獨特的焙火香氣。茶湯金黃透亮，口感醇厚回甘，香氣持久。焙香烏龍結合了烏龍茶的清香和烘焙的香氣，是台灣茶文化的代表之一。'
    },
    'oriental-beauty': {
        name: '東方美人茶',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&fit=crop',
        description: '東方美人茶是台灣最具特色的茶葉品種，也被稱為白毫烏龍。茶葉經過小綠葉蟬叮咬後產生特殊的蜜香，茶湯呈現琥珀色，口感甘甜順滑，具有獨特的果香和蜜香。'
    },
    oolong: {
        name: '烏龍茶',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&fit=crop',
        description: '烏龍茶是台灣最主要的茶葉品種，介於綠茶和紅茶之間，屬於半發酵茶。茶湯清澈透亮，香氣清雅，口感甘甜回甘。烏龍茶具有豐富的層次感和變化，是台灣茶文化的精髓。'
    },
    baozhong: {
        name: '包種茶',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&fit=crop',
        description: '包種茶是台灣傳統的茶葉品種，具有清香淡雅的特點。茶湯清澈透明，香氣清幽持久，口感清爽甘甜。包種茶製作工藝精細，是台灣茶文化的重要組成部分。'
    },
    green: {
        name: '綠茶',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&fit=crop',
        description: '綠茶是台灣重要的茶葉品種，屬於不發酵茶。茶湯清澈透亮，香氣清雅，口感清爽甘甜。綠茶含有豐富的維生素和抗氧化物質，具有清熱解毒、提神醒腦的功效。'
    }
};

// 特色介紹資料
const featureData = {
    red: {
        title: '紅茶特色',
        description: '紅茶具有濃郁的香氣和醇厚的口感，茶湯呈現深紅色，口感濃郁甘甜。紅茶經過完全發酵，含有豐富的茶多酚和咖啡因，具有提神醒腦的功效。適合搭配牛奶或檸檬飲用，是早餐茶的首選。'
    },
    'roasted-oolong': {
        title: '焙香烏龍特色',
        description: '焙香烏龍結合了烏龍茶的清香和烘焙的香氣，具有獨特的焙火香氣。茶湯金黃透亮，口感醇厚回甘，香氣持久。經過特殊烘焙工藝，使茶葉產生豐富的層次感和變化。'
    },
    'oriental-beauty': {
        title: '東方美人茶特色',
        description: '東方美人茶具有獨特的蜜香和果香，茶湯呈現琥珀色，口感甘甜順滑。茶葉經過小綠葉蟬叮咬後產生特殊香氣，是台灣最具特色的茶葉品種，也是台灣茶文化的代表。'
    },
    oolong: {
        title: '烏龍茶特色',
        description: '烏龍茶介於綠茶和紅茶之間，屬於半發酵茶，具有豐富的層次感和變化。茶湯清澈透亮，香氣清雅，口感甘甜回甘。是台灣最主要的茶葉品種，也是台灣茶文化的精髓。'
    },
    baozhong: {
        title: '包種茶特色',
        description: '包種茶具有清香淡雅的特點，茶湯清澈透明，香氣清幽持久，口感清爽甘甜。製作工藝精細，是台灣傳統的茶葉品種，也是台灣茶文化的重要組成部分。'
    },
    green: {
        title: '綠茶特色',
        description: '綠茶屬於不發酵茶，含有豐富的維生素和抗氧化物質。茶湯清澈透亮，香氣清雅，口感清爽甘甜。具有清熱解毒、提神醒腦的功效，是健康的茶飲選擇。'
    }
};

// 沖泡方式輪播相關變數
let currentBrewingSlideIndex = 0;
const brewingSlides = document.querySelectorAll('.brewing-slide');
const brewingDots = document.querySelectorAll('.brewing-carousel .dot');

// 特色介紹輪播相關變數
let currentFeatureSlideIndex = 0;
const featureSlides = document.querySelectorAll('.feature-slide');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 茶葉卡片點擊事件
    const teaCards = document.querySelectorAll('.tea-card');
    teaCards.forEach(card => {
        card.addEventListener('click', function() {
            const teaType = this.dataset.tea;
            showTeaModal(teaType);
        });
    });

    // 彈窗關閉事件
    const modal = document.getElementById('teaModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 初始化輪播
    initBrewingCarousel();
    initFeatureCarousel();
});

// 顯示茶葉詳細資訊彈窗
function showTeaModal(teaType) {
    const modal = document.getElementById('teaModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');

    const tea = teaData[teaType];
    if (tea) {
        modalImg.src = tea.image;
        modalImg.alt = tea.name;
        modalTitle.textContent = tea.name;
        modalDescription.textContent = tea.description;
        modal.style.display = 'block';
    }
}

// 初始化沖泡方式輪播
function initBrewingCarousel() {
    showBrewingSlide(0);
    
    // 自動輪播
    setInterval(() => {
        changeBrewingSlide(1);
    }, 5000);
}

// 改變沖泡方式輪播
function changeBrewingSlide(direction) {
    currentBrewingSlideIndex += direction;
    
    if (currentBrewingSlideIndex >= brewingSlides.length) {
        currentBrewingSlideIndex = 0;
    } else if (currentBrewingSlideIndex < 0) {
        currentBrewingSlideIndex = brewingSlides.length - 1;
    }
    
    showBrewingSlide(currentBrewingSlideIndex);
}

// 顯示指定沖泡方式輪播
function currentBrewingSlide(n) {
    currentBrewingSlideIndex = n - 1;
    showBrewingSlide(currentBrewingSlideIndex);
}

// 顯示沖泡方式輪播
function showBrewingSlide(index) {
    // 隱藏所有輪播
    brewingSlides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // 移除所有點選狀態
    brewingDots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // 顯示當前輪播
    if (brewingSlides[index]) {
        brewingSlides[index].classList.add('active');
        brewingDots[index].classList.add('active');
    }
}

// 初始化特色介紹輪播
function initFeatureCarousel() {
    showFeatureSlide(0);
    updateFeatureDescription(0);
    
    // 自動輪播
    setInterval(() => {
        changeFeatureSlide(1);
    }, 6000);
}

// 改變特色介紹輪播
function changeFeatureSlide(direction) {
    currentFeatureSlideIndex += direction;
    
    if (currentFeatureSlideIndex >= featureSlides.length) {
        currentFeatureSlideIndex = 0;
    } else if (currentFeatureSlideIndex < 0) {
        currentFeatureSlideIndex = featureSlides.length - 1;
    }
    
    showFeatureSlide(currentFeatureSlideIndex);
    updateFeatureDescription(currentFeatureSlideIndex);
}

// 顯示特色介紹輪播
function showFeatureSlide(index) {
    // 隱藏所有輪播
    featureSlides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // 顯示當前輪播
    if (featureSlides[index]) {
        featureSlides[index].classList.add('active');
    }
}

// 更新特色介紹文字
function updateFeatureDescription(index) {
    const featureTitle = document.getElementById('feature-title');
    const featureText = document.getElementById('feature-text');
    
    const slide = featureSlides[index];
    if (slide) {
        const teaType = slide.dataset.feature;
        const feature = featureData[teaType];
        
        if (feature) {
            featureTitle.textContent = feature.title;
            featureText.innerHTML = `<p>${feature.description}</p>`;
        }
    }
}

// 平滑滾動到指定區域
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 響應式處理
function handleResize() {
    // 在移動設備上調整輪播大小
    if (window.innerWidth <= 768) {
        // 移動設備特殊處理
        const featureImages = document.querySelectorAll('.feature-image');
        featureImages.forEach(img => {
            img.style.width = '250px';
            img.style.height = '250px';
        });
    } else {
        // 桌面設備恢復原始大小
        const featureImages = document.querySelectorAll('.feature-image');
        featureImages.forEach(img => {
            img.style.width = '400px';
            img.style.height = '400px';
        });
    }
}

// 監聽視窗大小變化
window.addEventListener('resize', handleResize);

// 頁面載入完成後執行
window.addEventListener('load', function() {
    handleResize();
    
    // 添加載入動畫
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        setTimeout(() => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.6s ease-in-out';
            
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
});

// 鍵盤導航支援
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('teaModal');
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    }
    
    if (event.key === 'ArrowLeft') {
        changeBrewingSlide(-1);
        changeFeatureSlide(-1);
    }
    
    if (event.key === 'ArrowRight') {
        changeBrewingSlide(1);
        changeFeatureSlide(1);
    }
});

// 觸控手勢支援（移動設備）
let startX = 0;
let startY = 0;

document.addEventListener('touchstart', function(event) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
});

document.addEventListener('touchend', function(event) {
    if (!startX || !startY) {
        return;
    }
    
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;
    
    const diffX = startX - endX;
    const diffY = startY - endY;
    
    // 檢查是否為水平滑動
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > 50) { // 滑動距離超過50px
            if (diffX > 0) {
                // 向左滑動，下一張
                changeBrewingSlide(1);
                changeFeatureSlide(1);
            } else {
                // 向右滑動，上一張
                changeBrewingSlide(-1);
                changeFeatureSlide(-1);
            }
        }
    }
    
    startX = 0;
    startY = 0;
});