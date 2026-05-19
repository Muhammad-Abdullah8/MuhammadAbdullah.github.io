const tabLinks = document.querySelectorAll('[data-tab-link]');
const panels = document.querySelectorAll('.tab-panel');
const nav = document.querySelector('.site-nav');
const menuToggle = document.querySelector('.menu-toggle');
const toast = document.getElementById('toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function activateTab(tabId, updateHash = true) {
  const target = document.getElementById(tabId) ? tabId : 'home';
  panels.forEach(panel => panel.classList.toggle('active', panel.id === target));
  tabLinks.forEach(link => link.classList.toggle('active', link.dataset.tabLink === target));
  if (updateHash) history.replaceState(null, '', `#${target}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (nav) nav.classList.remove('open');
  if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  revealVisible();
}

tabLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    activateTab(link.dataset.tabLink);
  });
});

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const initialHash = window.location.hash.replace('#', '');
activateTab(initialHash || 'home', false);

// Project filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    projectCards.forEach(card => {
      const categories = (card.dataset.category || '').split(/\s+/);
      card.classList.toggle('hidden', filter !== 'all' && !categories.includes(filter));
    });
  });
});

// Publication search
const publicationSearch = document.getElementById('publication-search');
const publications = document.querySelectorAll('.publication-card');
if (publicationSearch) {
  publicationSearch.addEventListener('input', () => {
    const query = publicationSearch.value.trim().toLowerCase();
    publications.forEach(pub => {
      const haystack = (pub.dataset.search + ' ' + pub.textContent).toLowerCase();
      pub.classList.toggle('hidden', query && !haystack.includes(query));
    });
  });
}

// Copy citation buttons
const citationButtons = document.querySelectorAll('.copy-citation');
citationButtons.forEach(button => {
  button.addEventListener('click', async () => {
    const citation = button.dataset.citation;
    try {
      await navigator.clipboard.writeText(citation);
      showToast('Citation copied');
    } catch (error) {
      showToast('Copy failed. Select text manually.');
    }
  });
});

// Contact form opens mail client
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(contactForm);
    const name = form.get('name') || '';
    const email = form.get('email') || '';
    const subject = encodeURIComponent(form.get('subject') || 'Portfolio contact');
    const message = encodeURIComponent(`${form.get('message') || ''}\n\nFrom: ${name}\nEmail: ${email}`);
    window.location.href = `mailto:abdullahabbi16@gmail.com?subject=${subject}&body=${message}`;
  });
}

// Reveal animations
const revealEls = document.querySelectorAll('.reveal');
function revealVisible() {
  const activePanel = document.querySelector('.tab-panel.active');
  if (!activePanel) return;
  activePanel.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));
revealVisible();

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
