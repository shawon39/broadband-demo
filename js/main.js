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

/* ============================================================
   AGENTFORCE CHATBOT
   ============================================================ */
(function () {
  const fab   = document.getElementById('afFab');
  const chat  = document.getElementById('afChat');
  const close = document.getElementById('afChatClose');
  const body  = document.getElementById('afChatBody');
  const input = document.getElementById('afChatInput');
  const send  = document.getElementById('afChatSend');
  const suggest = document.getElementById('afChatSuggest');
  if (!fab || !chat) return;

  const ROBOT = 'assets/agentforce-robot.png';

  /* Canned, call-specific answers so the demo feels live */
  const ANSWERS = {
    summary:
      "Here's the gist of the <strong>Acme Corp discovery call</strong>:" +
      "<ul><li>UK-wide broadband rollout — 4 offices, ~1,200 connections</li>" +
      "<li>Phased plan agreed: <strong>London first in Q3 2026</strong>, full estate by Q1 2027</li>" +
      "<li>Steve (Procurement) pushed back on pricing — incumbent is 18% cheaper</li>" +
      "<li>36-month term direction confirmed — a strong buying signal</li></ul>",
    risks:
      "Three risks stand out:" +
      "<ul><li><strong>Pricing gap</strong> — incumbent 18% below our rate; board won't approve unless we're within 10% on TCO</li>" +
      "<li><strong>Price-lock demand</strong> — Steve wants a fixed price for the full term, no CPI/RPI indexing</li>" +
      "<li><strong>Early-exit clause</strong> — he's wary of a heavy break penalty if the business restructures</li></ul>",
    signals:
      "Strong buying signals from this call:" +
      "<ul><li>Colin proactively sequenced the rollout (London → Manchester/Leeds → Bristol)</li>" +
      "<li>Both stakeholders agreed on a <strong>36-month term</strong></li>" +
      "<li>Positive close — Colin to confirm the London cutover window by Friday</li></ul>",
    email:
      "Here's a draft follow-up to Steve:<br><br>" +
      "<strong>Subject:</strong> Acme Corp — TCO comparison &amp; price-lock terms<br>" +
      "Hi Steve, thanks for the call. As promised, I'll send a total-cost comparison vs. your incumbent " +
      "plus written price-lock terms (fixed for the full 36 months, no CPI/RPI) by Thursday. " +
      "Happy to walk the board through it. Best, Tom",
    _default:
      "Good question. Based on the discovery call, the deal is progressing well — a phased London-first " +
      "rollout with a 36-month term. The main thing to resolve is the pricing gap and Steve's price-lock " +
      "request. Want me to summarize the call, list the risks, or draft a follow-up email?"
  };

  function resolve(text) {
    const t = text.toLowerCase();
    if (ANSWERS[t]) return ANSWERS[t];
    if (/summar/.test(t)) return ANSWERS.summary;
    if (/risk|concern|objection/.test(t)) return ANSWERS.risks;
    if (/signal|buy|close/.test(t)) return ANSWERS.signals;
    if (/email|follow|draft|message/.test(t)) return ANSWERS.email;
    return ANSWERS._default;
  }

  function openChat() {
    chat.classList.add('open');
    chat.setAttribute('aria-hidden', 'false');
    fab.setAttribute('aria-expanded', 'true');
    document.body.classList.add('af-chat-open');
    setTimeout(() => input.focus(), 250);
  }
  function closeChat() {
    chat.classList.remove('open');
    chat.setAttribute('aria-hidden', 'true');
    fab.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('af-chat-open');
  }

  function addUser(text) {
    const row = document.createElement('div');
    row.className = 'af-msg user';
    row.innerHTML = '<div class="af-msg-bubble"></div>';
    row.querySelector('.af-msg-bubble').textContent = text;
    body.appendChild(row);
    body.scrollTop = body.scrollHeight;
  }

  function showTyping() {
    const row = document.createElement('div');
    row.className = 'af-msg bot';
    row.id = 'af-typing-row';
    row.innerHTML =
      '<div class="af-msg-avatar"><img src="' + ROBOT + '" alt=""></div>' +
      '<div class="af-msg-bubble"><div class="af-typing"><span></span><span></span><span></span></div></div>';
    body.appendChild(row);
    body.scrollTop = body.scrollHeight;
  }

  function addBot(html) {
    const typing = document.getElementById('af-typing-row');
    if (typing) typing.remove();
    const row = document.createElement('div');
    row.className = 'af-msg bot';
    row.innerHTML =
      '<div class="af-msg-avatar"><img src="' + ROBOT + '" alt=""></div>' +
      '<div class="af-msg-bubble">' + html + '</div>';
    body.appendChild(row);
    body.scrollTop = body.scrollHeight;
  }

  function ask(text) {
    if (!text.trim()) return;
    addUser(text);
    showTyping();
    const reply = resolve(text);
    setTimeout(() => addBot(reply), 850);
  }

  fab.addEventListener('click', openChat);
  close.addEventListener('click', closeChat);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeChat(); });

  send.addEventListener('click', () => { ask(input.value); input.value = ''; });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { ask(input.value); input.value = ''; }
  });

  suggest.querySelectorAll('.af-chip').forEach(chip => {
    chip.addEventListener('click', () => ask(chip.textContent.trim()));
  });
})();
