document.addEventListener('DOMContentLoaded', () => {
    // 1. ローダーの非表示と初期アニメーション
    setTimeout(() => {
        document.getElementById('loader').classList.add('fade-out');
        document.querySelector('.hero').classList.add('is-loaded');
        
        // ヒーロー画像のスライドショー（クロスフェード）を開始
        startHeroSlideshow();
    }, 800);

    // スライドショー制御関数
    function startHeroSlideshow() {
        const heroImg1 = document.getElementById('hero-img-1');
        const heroImg2 = document.getElementById('hero-img-2');
        let isImg1Active = true;

        // 5秒ごとに画像を切り替える
        setInterval(() => {
            if (isImg1Active) {
                heroImg1.classList.remove('active');
                heroImg2.classList.add('active');
            } else {
                heroImg2.classList.remove('active');
                heroImg1.classList.add('active');
            }
            isImg1Active = !isImg1Active;
        }, 5000);
    }

    // 2. ギャラリー画像の動的生成（ダミー20点）
    const galleryGrid = document.getElementById('gallery-grid');
    const totalImages = 20;

    for (let i = 1; i <= totalImages; i++) {
        const item = document.createElement('div');
        item.classList.add('gallery-item', 'fade-in-up');
        // 少しずつアニメーションを遅らせて波のような表示にする
        item.style.transitionDelay = `${(i % 4) * 0.1}s`;

        // ローカルに保存される「gallery1.png」等から読み込み。（未保存の場合はonerrorでダミー写真を表示）
        const imgSrc = `gallery${i}.png`;
        const fallbackSrc = `https://picsum.photos/seed/ittobori_${i}/800/800`;
        
        item.innerHTML = `
            <img src="${imgSrc}" alt="作品 ${i}" class="gallery-img" loading="lazy" onerror="this.onerror=null; this.src='${fallbackSrc}';">
            <div class="gallery-item-overlay">
                <h3 class="gallery-item-title">作品 ${i}</h3>
            </div>
        `;
        
        // モーダルを開くイベント
        item.addEventListener('click', () => openLightbox(imgSrc, `作品 ${i}`));
        
        galleryGrid.appendChild(item);
    }

    // 3. スクロール時のフェードインアニメーション（Intersection Observer）
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // 一度表示したら監視を終了
            }
        });
    }, observerOptions);

    // DOMへの追加完了を少し待ってから監視を開始
    setTimeout(() => {
        const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in');
        animatedElements.forEach(el => observer.observe(el));
    }, 100);

    // 4. Lightbox (モーダル) 機能
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');

    function openLightbox(src, caption) {
        lightboxImg.src = src;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // 背景のスクロールを禁止
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { lightboxImg.src = ''; }, 400); // フェードアウト後に画像をクリア
    }

    closeBtn.addEventListener('click', closeLightbox);
    
    // 背景クリックで閉じる
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Escキーで閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // 5. ナビゲーションバーのスクロール制御（ヘッダー通過後に背景色を付ける）
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 150) {
            navbar.style.padding = '1rem 4rem';
            navbar.style.backgroundColor = 'rgba(249, 248, 246, 0.95)'; // 生成り色の背景
            navbar.style.mixBlendMode = 'normal'; // 重なり効果を解除
            navbar.style.color = 'var(--text-color)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            navLinks.forEach(a => a.style.color = 'var(--text-color)');
        } else {
            navbar.style.padding = '2rem 4rem';
            navbar.style.backgroundColor = 'transparent';
            navbar.style.mixBlendMode = 'difference'; // 画像上で文字を反転させて読みやすくする効果
            navbar.style.color = '#fff';
            navbar.style.boxShadow = 'none';
            navLinks.forEach(a => a.style.color = '#fff');
        }
    });
});
