
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

interface Video {
  title: string;
  url: string;
  category: 'cleaning' | 'consumables' | 'self-care' | 'etc';
}

// Initial list of videos provided by the user
const initialVideos: Video[] = [
  { title: '[AI구독클럽] 얼룩 걱정 없이 반짝이게 ! 전문가에게 맡길 케어 – 전기레인지편 | 삼성전자', url: 'http://www.youtube.com/watch?v=BOne2J4LpjU', category: 'cleaning' },
  { title: '[AI구독클럽] 뛰어난 청소능력 오래도록! 전문가에게 맡길 케어 – 청소기편 | 삼성전자', url: 'http://www.youtube.com/watch?v=y9KzxBySP_Y', category: 'consumables' },
  { title: '[AI구독클럽] 속 바람부터 쾌적하게! 전문가에게 맡길 케어 – 에어컨편 | 삼성전자', url: 'http://www.youtube.com/watch?v=J_84rMgpsQ4', category: 'self-care' },
  { title: '[AI구독클럽] 신선함을 오래도록! 전문가에게 맡길 케어-냉장고편 | 삼성전자', url: 'http://www.youtube.com/watch?v=Voj_4sy6O_8', category: 'self-care' },
  { title: '[AI구독클럽] 물 한 방울까지 깨끗하게! 전문가에게 맡길 케어-정수기편 | 삼성전자', url: 'http://www.youtube.com/watch?v=tdkG5zEGizk', category: 'consumables' },
  { title: '[AI구독클럽] 입에 닿는 식기 안심되게! 전문가에게 맡길 케어 ? 식기세척기편 | 삼성전자', url: 'http://www.youtube.com/watch?v=nmUm1LPmeWQ', category: 'cleaning' },
  { title: '[AI구독클럽] 공기의 시작부터 청정하게! 전문가에게 맡길 케어 – 공기청정기편 | 삼성전자', url: 'http://www.youtube.com/watch?v=Qtef4ZxvNyU', category: 'consumables' },
  { title: '[AI구독클럽] 속부터 산뜻한 의류관리! 전문가에게 맡길 케어 ? 에어드레서편 | 삼성전자', url: 'http://www.youtube.com/watch?v=Eu1v6iVdE9E', category: 'self-care' },
  { title: '[AI구독클럽] 분해 없는 초음파 세척! 전문가에게 맡길 케어 - 세탁기편 | 삼성전자', url: 'http://www.youtube.com/watch?v=XoeS-Bm83mU', category: 'cleaning' },
];

let videos: Video[] = [...initialVideos];
let currentCategory: string = 'all';

const videoGrid = document.getElementById('video-grid') as HTMLElement;
const addVideoForm = document.getElementById('add-video-form') as HTMLFormElement;
const videoUrlInput = document.getElementById('video-url-input') as HTMLInputElement;
const videoCategorySelect = document.getElementById('video-category-select') as HTMLSelectElement;
const modalOverlay = document.getElementById('modal-overlay') as HTMLElement;
const closeModalButton = document.getElementById('close-modal') as HTMLButtonElement;
const videoPlayerContainer = document.getElementById('video-player-container') as HTMLElement;
const categoryButtons = document.querySelectorAll('.category-button');

function getYoutubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function deleteVideo(urlToDelete: string) {
    if (confirm('이 비디오를 정말 삭제하시겠습니까?')) {
        videos = videos.filter(video => video.url !== urlToDelete);
        renderVideos();
    }
}

function handleCategoryChange(urlToChange: string, newCategory: Video['category']) {
    const video = videos.find(v => v.url === urlToChange);
    if(video) {
        video.category = newCategory;
        renderVideos();
    }
}

function renderVideos() {
  videoGrid.innerHTML = '';
  const filteredVideos = currentCategory === 'all'
    ? videos
    : videos.filter(video => video.category === currentCategory);

  filteredVideos.forEach(video => {
    const videoId = getYoutubeVideoId(video.url);
    if (!videoId) return;

    const originalThumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const previewThumbnails = [
        `https://img.youtube.com/vi/${videoId}/1.jpg`,
        `https://img.youtube.com/vi/${videoId}/2.jpg`,
        `https://img.youtube.com/vi/${videoId}/3.jpg`,
    ];

    const videoItem = document.createElement('div');
    videoItem.className = 'video-item';
    videoItem.setAttribute('aria-label', `Play video: ${video.title}`);
    
    const thumbnailContainer = document.createElement('div');
    thumbnailContainer.className = 'thumbnail-container';
    thumbnailContainer.setAttribute('role', 'button');
    thumbnailContainer.setAttribute('tabindex', '0');

    const thumbnailImage = document.createElement('img');
    thumbnailImage.src = originalThumbnailUrl;
    thumbnailImage.alt = `${video.title} thumbnail`;
    thumbnailContainer.appendChild(thumbnailImage);

    let previewInterval: number | undefined;

    thumbnailContainer.addEventListener('mouseenter', () => {
        let currentPreviewIndex = 0;
        previewInterval = window.setInterval(() => {
            currentPreviewIndex = (currentPreviewIndex + 1) % previewThumbnails.length;
            thumbnailImage.src = previewThumbnails[currentPreviewIndex];
        }, 1000);
    });

    thumbnailContainer.addEventListener('mouseleave', () => {
        if (previewInterval) {
            clearInterval(previewInterval);
            previewInterval = undefined;
        }
        thumbnailImage.src = originalThumbnailUrl;
    });

    thumbnailContainer.addEventListener('click', () => openModal(videoId));
    thumbnailContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            openModal(videoId);
        }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-video-btn';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.setAttribute('aria-label', `Delete video: ${video.title}`);
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteVideo(video.url);
    });

    const infoContainer = document.createElement('div');
    infoContainer.className = 'video-info';
    infoContainer.innerHTML = `<p>${video.title}</p>`;

    const categoryChangerWrapper = document.createElement('div');
    categoryChangerWrapper.className = 'category-changer-wrapper';

    const categoryChanger = document.createElement('select');
    categoryChanger.className = 'category-changer';
    categoryChanger.innerHTML = `
        <option value="cleaning">전문세척</option>
        <option value="consumables">소모품관리</option>
        <option value="self-care">셀프케어</option>
        <option value="etc">기타</option>
    `;
    categoryChanger.value = video.category;
    categoryChanger.addEventListener('change', (e) => {
        const newCategory = (e.target as HTMLSelectElement).value as Video['category'];
        handleCategoryChange(video.url, newCategory);
    });
    categoryChanger.addEventListener('click', (e) => e.stopPropagation());

    categoryChangerWrapper.appendChild(categoryChanger);
    infoContainer.appendChild(categoryChangerWrapper);

    videoItem.appendChild(deleteBtn);
    videoItem.appendChild(thumbnailContainer);
    videoItem.appendChild(infoContainer);
    
    videoGrid.appendChild(videoItem);
  });
}

function openModal(videoId: string) {
  videoPlayerContainer.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${videoId}?autoplay=1"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowfullscreen
      title="YouTube video player">
    </iframe>
  `;
  modalOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.add('hidden');
  videoPlayerContainer.innerHTML = '';
  document.body.style.overflow = '';
}

function handleCategoryClick(e: Event) {
    const clickedButton = (e.currentTarget as HTMLElement);
    currentCategory = clickedButton.dataset.category || 'all';

    categoryButtons.forEach(button => {
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
    });

    clickedButton.classList.add('active');
    clickedButton.setAttribute('aria-pressed', 'true');

    renderVideos();
}

categoryButtons.forEach(button => button.addEventListener('click', handleCategoryClick));

addVideoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newUrl = videoUrlInput.value.trim();
  const newCategory = videoCategorySelect.value as Video['category'];

  if (videos.some(v => v.url === newUrl)) {
    alert('이 비디오는 이미 목록에 있습니다.');
    return;
  }

  if (newUrl && newCategory) {
    const videoId = getYoutubeVideoId(newUrl);
    if(videoId) {
        // Fetch title later if possible, for now use a placeholder
        // This is a simple implementation. A real app would fetch the title via API.
        videos.push({ title: `새 비디오: ${videoId}`, url: newUrl, category: newCategory });
        renderVideos();
        videoUrlInput.value = '';
        videoCategorySelect.value = '';
    } else {
        alert('유효한 유튜브 URL을 입력해주세요.');
    }
  } else if (!newCategory) {
      alert('카테고리를 선택해주세요.');
  }
});

closeModalButton.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
        closeModal();
    }
});

// Initial render
renderVideos();