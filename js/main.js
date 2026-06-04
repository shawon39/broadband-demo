/* ---- Tab switching ---- */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});

/* ---- Transcript: live search + tag filtering ---- */
const transcriptInput = document.querySelector('.transcript-search input');
const transcriptChips = document.querySelectorAll('.transcript-toolbar .filter-chip');
const transcriptRows = document.querySelectorAll('.chat-list .chat-row');
const transcriptList = document.querySelector('.chat-list');

let activeTagFilter = 'all'; /* all | buying | concern | question */

/* Empty state shown when nothing matches */
let transcriptEmpty = null;
if (transcriptList) {
  transcriptEmpty = document.createElement('div');
  transcriptEmpty.className = 'chat-empty';
  transcriptEmpty.textContent = 'No messages match your search or filter.';
  transcriptEmpty.style.cssText = 'display:none;text-align:center;color:var(--text-tertiary);font-size:12px;padding:1.5rem 0;';
  transcriptList.appendChild(transcriptEmpty);
}

/* Map a chip's label to a tag class (chat-tag.buying / .concern / .question) */
function chipToFilter(chip) {
  const t = chip.textContent.toLowerCase();
  if (t.includes('buying'))   return 'buying';
  if (t.includes('concern'))  return 'concern';
  if (t.includes('question')) return 'question';
  return 'all';
}

/* A row is shown only if it matches BOTH the active chip and the search text */
function applyTranscriptFilter() {
  const q = (transcriptInput ? transcriptInput.value : '').trim().toLowerCase();
  let visible = 0;
  transcriptRows.forEach(row => {
    const matchesTag  = activeTagFilter === 'all' || row.querySelector('.chat-tag.' + activeTagFilter);
    const matchesText = !q || row.textContent.toLowerCase().includes(q);
    const show = matchesTag && matchesText;
    row.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  if (transcriptEmpty) transcriptEmpty.style.display = visible ? 'none' : 'block';
}

transcriptChips.forEach(chip => {
  chip.addEventListener('click', () => {
    transcriptChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeTagFilter = chipToFilter(chip);
    applyTranscriptFilter();
  });
});

if (transcriptInput) {
  transcriptInput.addEventListener('input', applyTranscriptFilter);
}

/* Clear any active filter so a jumped-to chapter is always visible */
function resetTranscriptFilter() {
  activeTagFilter = 'all';
  if (transcriptInput) transcriptInput.value = '';
  transcriptChips.forEach(c => c.classList.toggle('active', chipToFilter(c) === 'all'));
  applyTranscriptFilter();
}

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

/* ---- Jump to a transcript chapter (shared by chapter bands + key moments) ---- */
function jumpToChapter(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  /* Switch to Transcript tab */
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('[data-target="tab-transcript"]').classList.add('active');
  document.getElementById('tab-transcript').classList.add('active');

  /* Make sure no active filter is hiding the target */
  resetTranscriptFilter();

  /* Scroll + pulse */
  setTimeout(() => {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('eng-pulsing');
    setTimeout(() => target.classList.remove('eng-pulsing'), 900);
  }, 60);
}

/* Engagement chapter bands + Key Moments both jump to the transcript */
document.querySelectorAll('.eng-chapter-band, .moment-item').forEach(el => {
  el.addEventListener('click', () => jumpToChapter(el.dataset.chapter));
});
