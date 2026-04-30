/* ── SECURITY ── */
if (window.top !== window.self) {
  try { window.top.location.href = window.self.location.href; }
  catch(e) { document.body.innerHTML = ''; }
}

document.querySelectorAll('.protected').forEach(el => {
  el.addEventListener('contextmenu', e => e.preventDefault());
});

const formState = { lastSubmit: 0, count: 0 };

/* ── NAV SCROLL ── */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);

  let cur = '';
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) cur = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === '#' + cur);
  });
}, { passive: true });

/* ── PROJECT ACCORDION ── */
function toggleProject(header) {
  const card = header.closest('.proj-card');
  const body = card.querySelector('.proj-body');
  const isOpen = card.classList.contains('open');

  document.querySelectorAll('.proj-card.open').forEach(c => {
    c.classList.remove('open');
    c.querySelector('.proj-body').style.maxHeight = '0';
    c.querySelector('.proj-header').setAttribute('aria-expanded', 'false');
  });

  if (!isOpen) {
    card.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 'px';
    header.setAttribute('aria-expanded', 'true');
  }
}

/* ── PRINT RESUME ONLY ── */
function printResume() {
  window.print();
}

/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── CONTACT FORM ── */
function submitForm(e) {
  e.preventDefault();
  const msg = document.getElementById('formMsg');

  if (document.getElementById('hp-website').value) return;

  const now = Date.now();
  if (now - formState.lastSubmit < 60000) {
    formState.count++;
    if (formState.count > 2) {
      showMsg('Too many attempts. Please wait a moment.', 'err');
      return;
    }
  } else {
    formState.count = 1;
    formState.lastSubmit = now;
  }

  const name    = document.getElementById('f-name').value.trim();
  const email   = document.getElementById('f-email').value.trim();
  const message = document.getElementById('f-msg').value.trim();

  if (!name || name.length < 2)                               { showMsg('Please enter your name.', 'err'); return; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))   { showMsg('Please enter a valid email address.', 'err'); return; }
  if (!message || message.length < 10)                        { showMsg('Message is too short — say a little more!', 'err'); return; }

  const btn = e.target;
  btn.textContent = 'Sending…';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.disabled = false;
    document.getElementById('f-name').value  = '';
    document.getElementById('f-email').value = '';
    document.getElementById('f-msg').value   = '';
    showMsg("Message sent! I'll get back to you soon.", 'ok');
  }, 1200);

  function showMsg(text, type) {
    msg.textContent = text;
    msg.className   = 'form-msg ' + type;
    msg.style.display = 'block';
    setTimeout(() => { msg.style.display = 'none'; }, 5000);
  }
}
