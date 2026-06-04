/* ---- Tab switching ---- */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});

/* ---- Filter chips ---- */
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chip.parentElement.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

/* ---- Detail section collapse ---- */
document.querySelectorAll('.detail-section-header').forEach(header => {
  header.addEventListener('click', () => {
    const grid = header.nextElementSibling;
    if (header.classList.contains('collapsed')) {
      header.classList.remove('collapsed');
      grid.style.display = '';
    } else {
      header.classList.add('collapsed');
      grid.style.display = 'none';
    }
  });
});

/* ---- Engagement: tooltip on key-moment dots ---- */
const engTooltip = document.getElementById('eng-tooltip');

document.querySelectorAll('.eng-moment-dot').forEach(dot => {
  dot.style.cursor = 'pointer';

  dot.addEventListener('mouseenter', e => {
    const rect = dot.getBoundingClientRect();
    const tagClass = dot.dataset.tagClass || 'discovery';
    engTooltip.innerHTML =
      '<div class="eng-tooltip-time">' + dot.dataset.time + '</div>' +
      '<div class="eng-tooltip-label">' + dot.dataset.label + '</div>' +
      '<span class="eng-tooltip-tag ' + tagClass + '">' + dot.dataset.tag + '</span>';

    const tx = Math.min(rect.left + rect.width / 2 - 115, window.innerWidth - 240);
    const ty = rect.top - 80;
    engTooltip.style.left = Math.max(4, tx) + 'px';
    engTooltip.style.top  = (ty < 8 ? rect.bottom + 8 : ty) + 'px';
    engTooltip.classList.add('visible');
  });

  dot.addEventListener('mouseleave', () => engTooltip.classList.remove('visible'));
});

/* ---- Engagement: click chapter band → jump to transcript ---- */
document.querySelectorAll('.eng-chapter-band').forEach(band => {
  band.addEventListener('click', () => {
    const targetId = band.dataset.chapter;
    const target = document.getElementById(targetId);
    if (!target) return;

    /* Switch to Transcript tab */
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelector('[data-target="tab-transcript"]').classList.add('active');
    document.getElementById('tab-transcript').classList.add('active');

    /* Scroll + pulse */
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('eng-pulsing');
      setTimeout(() => target.classList.remove('eng-pulsing'), 900);
    }, 60);
  });
});
