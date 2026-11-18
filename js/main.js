(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- header: scrolled state ---------- */
  const header = $('#header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile gnb toggle ---------- */
  const toggle = $('.header__toggle');
  const gnb = $('#gnb');

  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    gnb.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('.gnb__link').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.matchMedia('(min-width: 769px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- active nav on scroll ---------- */
  const sections = $$('main section[id]');
  const navLinks = $$('.gnb__link');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => navObserver.observe(s));

  /* ---------- scroll reveal ---------- */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 80}ms`;
    revealObserver.observe(el);
  });

  /* ---------- count up ---------- */
  const countUp = (el) => {
    const target = Number(el.dataset.count);
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countUp(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => countObserver.observe(el));

  /* ---------- works filter ---------- */
  const filterBtns = $$('.works__filter-btn');
  const cards = $$('.works__list .card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      cards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !show);
        if (show) card.classList.add('is-visible');
      });
    });
  });

  /* ---------- footer ---------- */
  $('#year').textContent = new Date().getFullYear();
  $('.footer__top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
