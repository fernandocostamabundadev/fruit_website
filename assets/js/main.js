const menu = document.getElementById('nav-menu');
const openButton = document.getElementById('nav-toggle');
const closeButton = document.getElementById('nav-close');
const mobileViewport = window.matchMedia('(max-width: 720px)');

function setMenuOpen(open) {
  const wasOpen = menu?.classList.contains('is-open');
  menu?.classList.toggle('is-open', open);
  openButton?.setAttribute('aria-expanded', String(open));
  openButton?.setAttribute('aria-label', open ? 'Fechar navegação' : 'Abrir navegação');
  menu?.setAttribute('aria-hidden', String(mobileViewport.matches && !open));
  if (menu) menu.inert = mobileViewport.matches && !open;
  if (open && mobileViewport.matches) menu?.querySelector('a')?.focus();
  else if (wasOpen) openButton?.focus();
}

setMenuOpen(false);
openButton?.addEventListener('click', () => setMenuOpen(!menu?.classList.contains('is-open')));
closeButton?.addEventListener('click', () => setMenuOpen(false));
menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.classList.contains('is-open')) setMenuOpen(false);
});
mobileViewport.addEventListener('change', () => setMenuOpen(false));

const themeButton = document.querySelector('.theme-toggle');
const themeKey = 'fruit-theme';
if (localStorage.getItem(themeKey) === 'dark') document.body.classList.add('dark-theme');

function updateThemeButton() {
  const dark = document.body.classList.contains('dark-theme');
  themeButton?.setAttribute('aria-label', `Ativar tema ${dark ? 'claro' : 'escuro'}`);
  themeButton?.setAttribute('aria-pressed', String(dark));
  themeButton?.setAttribute('title', `Ativar tema ${dark ? 'claro' : 'escuro'}`);
}

updateThemeButton();
themeButton?.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  localStorage.setItem(themeKey, document.body.classList.contains('dark-theme') ? 'dark' : 'light');
  updateThemeButton();
});

document.querySelectorAll('[data-demo-form]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    if (status) status.textContent = 'Obrigado por subscrever! Esta demonstração confirma o pedido apenas nesta página; nenhum dado foi enviado.';
    form.reset();
  });
});

const header = document.getElementById('header');
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav__link')];

function updatePageState() {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
  const current = sections.filter(section => section.getBoundingClientRect().top <= 140).at(-1);
  navLinks.forEach(link => {
    const active = link.hash === `#${current?.id}`;
    link.classList.toggle('active-link', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

window.addEventListener('scroll', updatePageState, { passive: true });
window.addEventListener('resize', updatePageState);
updatePageState();

document.querySelectorAll('[data-year]').forEach(year => {
  year.textContent = String(new Date().getFullYear());
});

const revealElements = document.querySelectorAll('[data-reveal]');
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
  revealElements.forEach(element => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealElements.forEach(element => revealObserver.observe(element));
}
