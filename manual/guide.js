const links = [...document.querySelectorAll('.sidebar-link')];
const sidebar = document.querySelector('.sidebar');
const targets = links.map((link) => document.getElementById(link.hash.slice(1)));
let activeLink;
let animationFrame;

function highlightSection() {
  const position = window.innerHeight * 0.35;
  let current = 0;
  for (let index = 1; index < targets.length; index += 1) {
    if (targets[index].getBoundingClientRect().top > position) break;
    current = index;
  }

  const next = links[current];
  if (next === activeLink) return;
  activeLink?.classList.remove('active');
  activeLink?.removeAttribute('aria-current');
  activeLink = next;
  activeLink.classList.add('active');
  activeLink.setAttribute('aria-current', 'location');

  const linkBounds = activeLink.getBoundingClientRect();
  const sidebarBounds = sidebar.getBoundingClientRect();
  if (linkBounds.bottom > sidebarBounds.bottom) {
    sidebar.scrollTop += linkBounds.bottom - sidebarBounds.bottom + 8;
  } else if (linkBounds.top < sidebarBounds.top) {
    sidebar.scrollTop -= sidebarBounds.top - linkBounds.top + 8;
  }
}

function queueHighlight() {
  cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(highlightSection);
}

activeLink = links.find((link) => link.classList.contains('active'));
window.addEventListener('scroll', queueHighlight, { passive: true });
window.addEventListener('resize', queueHighlight);
queueHighlight();

const pipeline = document.querySelector('.pipeline');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      pipeline.classList.add('visible');
      observer.disconnect();
    }
  }, { threshold: 0.2 });
  observer.observe(pipeline);
} else {
  pipeline.classList.add('visible');
}

const lightbox = document.querySelector('.lb-overlay');
const previewImage = lightbox.querySelector('img');
const closeButton = lightbox.querySelector('button');

function openPreview(image) {
  previewImage.src = image.currentSrc || image.src;
  previewImage.alt = image.alt;
  lightbox.showModal();
  lightbox.classList.add('lb-show');
  document.body.classList.add('preview-open');
}

document.querySelectorAll('.step-img').forEach((image) => {
  image.addEventListener('click', () => openPreview(image));
  image.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPreview(image);
    }
  });
});

closeButton.addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener('close', () => {
  lightbox.classList.remove('lb-show');
  document.body.classList.remove('preview-open');
  previewImage.removeAttribute('src');
});

const copyStatus = document.querySelector('#copy-status');
document.querySelectorAll('.code-copy-btn').forEach((button) => {
  const code = button.closest('.code-wrap').querySelector('code');
  const label = button.querySelector('span');
  let reset;

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code.textContent.trim());
      copyStatus.textContent = '已复制代码。';
      label.textContent = '已复制';
      button.classList.add('copied');
    } catch {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      label.textContent = '请手动复制';
      copyStatus.textContent = '已选中代码，请用系统复制快捷键。';
    }

    clearTimeout(reset);
    reset = setTimeout(() => {
      button.classList.remove('copied');
      label.textContent = '复制';
    }, 1700);
  });
});
