// 聯絡表單提交處理
document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault(); // 阻止預設送出
    alert("您的訊息已送出，我們將盡快與您聯繫！");
});

// 手風琴功能
document.addEventListener('DOMContentLoaded', function() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', function() {
            // 關閉其他已開啟的手風琴項目
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // 切換當前項目的狀態
            item.classList.toggle('active');
        });
    });
});
