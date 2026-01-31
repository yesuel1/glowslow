// 슬라이더 전용 유틸리티 함수들

/**
 * 슬라이더의 현재 인덱스를 가져옵니다
 */
export function getSliderIndex(slider) {
  const transform = slider.querySelector('.slider-container').style.transform;
  const match = transform.match(/translateX\(-?(\d+)%\)/);
  return match ? parseInt(match[1]) / 100 : 0;
}

/**
 * 슬라이더를 특정 인덱스로 이동합니다
 */
export function goToSlide(slider, index) {
  const container = slider.querySelector('.slider-container');
  const slides = slider.querySelectorAll('.slide');
  const indicators = slider.querySelectorAll('.indicator-dot');
  const prevBtn = slider.querySelector('.prev');
  const nextBtn = slider.querySelector('.next');

  if (index < 0 || index >= slides.length) return;

  container.style.transform = `translateX(-${index * 100}%)`;

  indicators.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  if (prevBtn) prevBtn.disabled = index === 0;
  if (nextBtn) nextBtn.disabled = index === slides.length - 1;
}

/**
 * 슬라이더 자동 재생
 */
export function autoplaySlider(slider, interval = 3000) {
  const slides = slider.querySelectorAll('.slide');
  if (slides.length <= 1) return null;

  let currentIndex = 0;

  const intervalId = setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    goToSlide(slider, currentIndex);
  }, interval);

  return intervalId;
}
