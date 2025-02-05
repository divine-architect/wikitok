// wait for dom to load
document.addEventListener('DOMContentLoaded', () => {
    const articleContainer = document.getElementById('article-container');
    const startBtn = document.getElementById('start-btn');
    let canScroll = false;

    // Add desktop warning if not on mobile
    if (window.innerWidth > 768) {
        const desktopWarning = document.createElement('p');
        desktopWarning.textContent = 'Best viewed on a mobile device!';
        desktopWarning.classList.add('desktop-warning');
        document.body.insertBefore(desktopWarning, articleContainer);
    }
 
    startBtn.addEventListener('click', () => {
        fetchRandomArticle();
        canScroll = true;
    });
 
    // fetch and display random article from server
    function fetchRandomArticle() {
        fetch('/random-article')
            .then(response => response.json())
            .then(article => {
                const articleElement = createArticleElement(article);
                articleContainer.innerHTML = '';
                articleContainer.appendChild(articleElement);
            })
            .catch(error => {
                console.error('Error fetching article:', error);
            });
    }
 
    function createArticleElement(article) {
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('content', 'article-content');
        
        const imageHtml = article.image_url 
            ? `
            <div class="image-container">
                <img src="${article.image_url}" alt="${article.title}" class="article-image">
                <div class="share-icon">
                    <a href="#" onclick="shareArticle('${article.title}', '${article.article_url}')">
                        <i class="fas fa-share-alt"></i>
                    </a>
                </div>
            </div>` 
            : '';
 
        articleDiv.innerHTML = `
            ${imageHtml}
            <h2>${article.title}</h2>
            <p>${article.summary}</p>
            <a href="${article.article_url}" target="_blank" class="read-more-btn">Read Full Article</a>
        `;
 
        return articleDiv;
    }
 
    window.shareArticle = function(title, url) {
        if (navigator.share) {
            navigator.share({
                title: title,
                url: url
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(url).then(() => {
                alert('Article link copied to clipboard!');
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        }
    }
 
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });
 
    document.addEventListener('touchend', (e) => {
        if (!canScroll) return;
        
        const touchEndY = e.changedTouches[0].clientY;
        if (touchStartY - touchEndY > 50) {  //swipe up
            fetchRandomArticle();
        }
    });
 
    document.addEventListener('wheel', (e) => {
        if (!canScroll) return;
        
        if (e.deltaY < 0) return;  
        fetchRandomArticle();
    });
 });