// LUSIC12 — minimal homepage JS
(function () {
  'use strict';

  // Header scroll shadow
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 10
        ? '0 2px 12px rgba(0,0,0,0.08)'
        : 'none';
    }, { passive: true });
  }

  // Active nav link based on scroll position
  var sections = document.querySelectorAll('[id]');
  var navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

  if (navLinks.length && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  }

  // Publication filter
  var filterBtns = document.querySelectorAll('.filter-btn');
  var paperCards = document.querySelectorAll('.paper-card');

  if (filterBtns.length && paperCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        
        // Update active button
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        
        // Filter papers
        paperCards.forEach(function (card) {
          var categories = card.getAttribute('data-category').split(' ');
          var show = filter === 'all' || categories.includes(filter);
          card.style.display = show ? 'flex' : 'none';
          if (show) {
            card.style.animation = 'fadeIn 300ms ease forwards';
          }
        });
      });
    });
  }

  // Auto project visualization thumbnail:
  // Drop one image named visualize.(png|jpg|jpeg|webp|avif) into figs/projects/<project-folder>/
  // and the corresponding card will pick it up automatically.
  var autoThumbs = document.querySelectorAll('.paper-thumb-auto');
  var candidateNames = [
    'visualize.png',
    'visualize.jpg',
    'visualize.jpeg',
    'visualize.webp',
    'visualize.avif',
    'cover.png',
    'cover.jpg',
    'cover.jpeg',
    'multicamera.png',
    'Multicamera.png',
    'preview.png',
    'preview.jpg'
  ];

  function loadFirstExistingImage(basePath, names, onSuccess, onFail) {
    var index = 0;

    function tryNext() {
      if (index >= names.length) {
        onFail();
        return;
      }

      var url = basePath + names[index];
      index += 1;

      var testImg = new Image();
      testImg.onload = function () { onSuccess(url); };
      testImg.onerror = tryNext;
      testImg.src = url;
    }

    tryNext();
  }

  autoThumbs.forEach(function (thumb) {
    var folder = thumb.getAttribute('data-project-folder');
    var fallbackIcon = thumb.getAttribute('data-fallback-icon') || 'fa-image';

    thumb.innerHTML = '<i class="fas ' + fallbackIcon + '"></i>';

    if (!folder) {
      return;
    }

    loadFirstExistingImage(
      'figs/projects/' + folder + '/',
      candidateNames,
      function (src) {
        thumb.classList.remove('paper-thumb-placeholder');
        thumb.innerHTML = '<img src="' + src + '" alt="' + folder + ' visualization">';
      },
      function () {
        // Keep icon placeholder if no image exists.
      }
    );
  });
}());
