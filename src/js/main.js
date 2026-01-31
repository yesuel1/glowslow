// 게시물 데이터 로드 및 렌더링
import { generateCaption, generateComments } from './api.js';

// 전역 변수
let posts = [];
let uploadedImages = [];

// 게시물 카드 HTML 생성
function createPostCard(post) {
  const commentsHTML = post.comments.map(comment => `
    <div class="comment">
      <div class="comment-avatar">${comment.avatar}</div>
      <div class="comment-content">
        <div class="comment-author">${comment.author}</div>
        <div class="comment-text">${comment.text}</div>
      </div>
    </div>
  `).join('');

  const keywordsHTML = post.keywords.map(keyword =>
    `<span class="keyword-tag">#${keyword}</span>`
  ).join('');

  // 슬라이더 HTML 생성 (이미지가 배열인 경우)
  let imageHTML;
  if (Array.isArray(post.images) && post.images.length > 0) {
    const slidesHTML = post.images.map((img, index) => `
      <div class="slide">
        ${img.startsWith('data:') || img.startsWith('http') || img.startsWith('/')
          ? `<img src="${img}" alt="Slide ${index + 1}" class="slide-image">`
          : `<div class="slide-emoji">${img}</div>`
        }
        <div class="photo-frame"></div>
        ${post.captions && post.captions[index] ? `
          <div class="slide-caption">${post.captions[index]}</div>
        ` : ''}
      </div>
    `).join('');

    const indicatorsHTML = post.images.length > 1 ? `
      <div class="slider-indicators">
        ${post.images.map((_, i) => `
          <div class="indicator-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>
        `).join('')}
      </div>
    ` : '';

    const buttonsHTML = post.images.length > 1 ? `
      <button class="slider-btn prev" ${post.images.length <= 1 ? 'disabled' : ''}>‹</button>
      <button class="slider-btn next" ${post.images.length <= 1 ? 'disabled' : ''}>›</button>
    ` : '';

    imageHTML = `
      <div class="post-slider" data-post-id="${post.id}">
        <div class="slider-container">
          ${slidesHTML}
        </div>
        ${buttonsHTML}
        ${indicatorsHTML}
      </div>
    `;
  } else {
    // 단일 이미지 (기존 방식)
    imageHTML = `<div class="post-image">${post.image}</div>`;
  }

  return `
    <article class="post-card" data-post-id="${post.id}">
      <div class="post-header">
        <div class="post-avatar">${post.avatar}</div>
        <div class="post-author-info">
          <div class="post-author">${post.author}</div>
          <div class="post-date">${post.date}</div>
        </div>
      </div>

      ${imageHTML}

      <div class="post-content">
        <div class="post-keywords">${keywordsHTML}</div>
        ${!Array.isArray(post.images) ? `<p class="post-caption">${post.caption}</p>` : ''}

        <div class="post-comments">
          <div class="comments-title">💬 응원 댓글 ${post.comments.length}개</div>
          ${commentsHTML}
        </div>
      </div>
    </article>
  `;
}

// 게시물 로드 및 렌더링
async function loadPosts() {
  try {
    const response = await fetch('/data/posts.json');
    posts = await response.json();
    renderPosts();

  } catch (error) {
    console.error('게시물을 로드하는 중 오류 발생:', error);
    document.getElementById('posts-container').innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
        게시물을 불러올 수 없습니다 😢
      </div>
    `;
  }
}

// 게시물 렌더링
function renderPosts() {
  const postsContainer = document.getElementById('posts-container');
  postsContainer.innerHTML = posts.map(post => createPostCard(post)).join('');

  // 슬라이더 이벤트 리스너 추가
  initSliders();
}

// 슬라이더 초기화
function initSliders() {
  document.querySelectorAll('.post-slider').forEach(slider => {
    const container = slider.querySelector('.slider-container');
    const slides = slider.querySelectorAll('.slide');
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');
    const indicators = slider.querySelectorAll('.indicator-dot');

    if (slides.length <= 1) return;

    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;

    function updateSlider() {
      container.style.transform = `translateX(-${currentIndex * 100}%)`;

      // 인디케이터 업데이트
      indicators.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });

      // 버튼 상태 업데이트
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex === slides.length - 1;
    }

    // 버튼 클릭
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateSlider();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
          currentIndex++;
          updateSlider();
        }
      });
    }

    // 터치/마우스 드래그
    slider.addEventListener('mousedown', handleDragStart);
    slider.addEventListener('touchstart', handleDragStart);
    slider.addEventListener('mousemove', handleDragMove);
    slider.addEventListener('touchmove', handleDragMove);
    slider.addEventListener('mouseup', handleDragEnd);
    slider.addEventListener('touchend', handleDragEnd);
    slider.addEventListener('mouseleave', handleDragEnd);

    function handleDragStart(e) {
      isDragging = true;
      startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
      container.style.transition = 'none';
    }

    function handleDragMove(e) {
      if (!isDragging) return;
      e.preventDefault();

      const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
      const diff = startX - currentX;

      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex < slides.length - 1) {
          currentIndex++;
          updateSlider();
        } else if (diff < 0 && currentIndex > 0) {
          currentIndex--;
          updateSlider();
        }
        isDragging = false;
      }
    }

    function handleDragEnd() {
      if (isDragging) {
        container.style.transition = 'transform 0.3s ease';
        isDragging = false;
      }
    }

    // 인디케이터 클릭
    indicators.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateSlider();
      });
    });
  });
}

// 새 게시물 추가
function addNewPost(post) {
  posts.unshift(post); // 맨 앞에 추가
  renderPosts();
}

// 모달 관련
const modal = document.getElementById('postModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');

// 모달 열기
openModalBtn.addEventListener('click', () => {
  modal.classList.add('active');
});

// 모달 닫기
function closeModal() {
  modal.classList.remove('active');
  document.getElementById('postForm').reset();
  uploadedImages = [];
  document.getElementById('imagePreviewGrid').innerHTML = '';
  document.getElementById('uploadPlaceholder').style.display = 'block';
}

closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// 모달 외부 클릭 시 닫기
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// 이미지 업로드 관련
const uploadArea = document.getElementById('uploadArea');
const imageUpload = document.getElementById('imageUpload');
const imagePreviewGrid = document.getElementById('imagePreviewGrid');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');

uploadArea.addEventListener('click', () => {
  imageUpload.click();
});

// 드래그 앤 드롭
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');

  const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
  handleImageUpload(files);
});

imageUpload.addEventListener('change', (e) => {
  const files = Array.from(e.target.files);
  handleImageUpload(files);
});

function handleImageUpload(files) {
  // 최대 10개 제한
  const remainingSlots = 10 - uploadedImages.length;
  const filesToAdd = files.slice(0, remainingSlots);

  if (files.length > remainingSlots) {
    alert(`최대 10개까지만 업로드할 수 있습니다. ${remainingSlots}개만 추가됩니다.`);
  }

  filesToAdd.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImages.push(e.target.result);
      renderImagePreviews();
    };
    reader.readAsDataURL(file);
  });
}

function renderImagePreviews() {
  if (uploadedImages.length === 0) {
    imagePreviewGrid.innerHTML = '';
    uploadPlaceholder.style.display = 'block';
    return;
  }

  uploadPlaceholder.style.display = 'none';

  imagePreviewGrid.innerHTML = uploadedImages.map((img, index) => `
    <div class="preview-item">
      <img src="${img}" alt="Preview ${index + 1}">
      <button type="button" class="preview-remove" data-index="${index}">×</button>
      <div class="preview-index">${index + 1}</div>
    </div>
  `).join('');

  // 삭제 버튼 이벤트
  document.querySelectorAll('.preview-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      uploadedImages.splice(index, 1);
      renderImagePreviews();
    });
  });
}

// 폼 제출
document.getElementById('postForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const keywordsInput = document.getElementById('keywords').value;
  const authorName = document.getElementById('authorName').value;

  if (uploadedImages.length === 0) {
    alert('최소 1개 이상의 이미지를 업로드해주세요!');
    return;
  }

  // 키워드 파싱
  const keywords = keywordsInput.split(',').map(k => k.trim()).filter(k => k);

  if (keywords.length === 0) {
    alert('최소 1개 이상의 키워드를 입력해주세요!');
    return;
  }

  // 로딩 상태
  const generateBtn = document.getElementById('generateBtn');
  const btnText = generateBtn.querySelector('.btn-text');
  const btnLoading = generateBtn.querySelector('.btn-loading');

  generateBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';

  try {
    // 각 이미지별로 캡션 생성
    btnLoading.textContent = `캡션 생성 중... (1/${uploadedImages.length})`;
    const captions = [];

    for (let i = 0; i < uploadedImages.length; i++) {
      btnLoading.textContent = `캡션 생성 중... (${i + 1}/${uploadedImages.length})`;
      const caption = await generateCaption(keywords, `이미지 ${i + 1}`);
      captions.push(caption);
    }

    // 첫 번째 캡션으로 응원 댓글 생성
    btnLoading.textContent = '응원 댓글 생성 중...';
    const comments = await generateComments(keywords, captions[0]);

    // 새 게시물 객체 생성
    const newPost = {
      id: Date.now(),
      author: authorName,
      avatar: uploadedImages[0], // 첫 번째 이미지를 아바타로
      date: '방금 전',
      images: uploadedImages,
      captions: captions,
      keywords: keywords,
      comments: comments
    };

    // 게시물 추가
    addNewPost(newPost);

    // 모달 닫기
    closeModal();

    // 성공 메시지
    alert(`✨ 게시물이 성공적으로 작성되었습니다!\n${uploadedImages.length}개의 이미지와 ${comments.length}개의 응원 댓글이 달렸어요 💕`);

  } catch (error) {
    console.error('게시물 작성 중 오류:', error);
    alert('게시물 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
  } finally {
    // 로딩 상태 해제
    generateBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    btnLoading.textContent = '생성 중...';
  }
});

// 페이지 로드 시 게시물 로드
loadPosts();
