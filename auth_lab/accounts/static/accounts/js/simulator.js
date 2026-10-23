document.addEventListener('DOMContentLoaded', () => {
  const stages = [
    {title:'Create your account.', desc:'Choose a username and password. The simulator keeps these details only in this browser tab.', button:'Create account'},
    {title:'Now, prove it’s you.', desc:'Enter the same username and password. Try changing either value to see the server reject a mismatch.', button:'Log in'},
    {title:'Request a protected page.', desc:'The server checks your authenticated session before returning your profile.', button:'Open profile'},
    {title:'End the session.', desc:'Logging out clears the session. The profile page will no longer be available.', button:'Log out'}
  ];
  const state = {username:'', password:'', loginUsername:'', loginPassword:'', authenticated:false};
  let current = 0;
  let completed = 0;
  const title = document.querySelector('#sim-title');
  const desc = document.querySelector('#sim-desc');
  const result = document.querySelector('#sim-result');
  const content = document.querySelector('#sim-window-content');
  const next = document.querySelector('#sim-next');
  const back = document.querySelector('#sim-back');
  const fill = document.querySelector('#sim-progress-fill');
  const progressCount = document.querySelector('#sim-progress-count');
  const reset = document.querySelector('#reset-sim');
  const simSteps = [...document.querySelectorAll('.sim-step')];
  if (!next || !back || !fill || !progressCount || !reset || !title || !desc || !result || !content) return;

  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const input = (id, label, type, value, autocomplete='off') => `<label class="sim-input-label" for="${id}">${label}</label><input class="sim-input" id="${id}" type="${type}" value="${escapeHTML(value)}" autocomplete="${autocomplete}" ${type === 'password' ? 'minlength="8"' : ''} required>`;

  function render(message = '', isError = false) {
    const stage = stages[current];
    title.textContent = completed === stages.length ? 'Experiment complete.' : stage.title;
    desc.textContent = completed === stages.length
      ? 'You completed registration, login, protected-page access, and logout. Reset to try different credentials.'
      : stage.desc;
    next.innerHTML = completed === stages.length ? 'Run again <span>↺</span>' : `${stage.button} <span>↗</span>`;
    back.disabled = current === 0 || completed === stages.length;
    fill.style.setProperty('width', `${(completed / stages.length) * 100}%`);
    progressCount.textContent = `${completed} / ${stages.length} STEPS COMPLETE`;
    const guideFill = document.querySelector('#progress-fill');
    const guideLabel = document.querySelector('#progress-label');
    if (guideFill) guideFill.style.setProperty('width', `${(completed / stages.length) * 100}%`);
    if (guideLabel) guideLabel.textContent = `${completed} / ${stages.length}`;
    simSteps.forEach((el, index) => {
      el.classList.toggle('active', index === current && completed < stages.length);
      el.classList.toggle('done', index < completed);
    });

    let panel = '';
    if (current === 0) {
      panel = `<div class="mini-form"><div class="mini-label">CREATE ACCOUNT</div>${input('sim-username','Username','text',state.username)}${input('sim-password','Password','password',state.password)}<small class="sim-help">Use at least 8 characters.</small></div>`;
    } else if (current === 1) {
      panel = `<div class="mini-form"><div class="mini-label">SIGN IN</div>${input('sim-login-username','Username','text',state.loginUsername,'username')}${input('sim-login-password','Password','password',state.loginPassword,'current-password')}</div>`;
    } else if (current === 2) {
      panel = `<div class="mini-form"><div class="mini-label">PROTECTED PROFILE</div><div class="profile-preview-avatar">${escapeHTML(state.username.slice(0,1).toUpperCase() || '?')}</div><div class="profile-preview-name">${escapeHTML(state.username)}</div><small class="sim-help">Session: authenticated</small></div>`;
    } else {
      panel = `<div class="mini-form"><div class="mini-label">SIGN OUT</div><div class="session-preview"><span class="live-dot"></span>${state.authenticated ? 'Active session' : 'Session ended'}</div><small class="sim-help">The server will clear this session.</small></div>`;
    }
    const serverMessage = completed > 0 ? ['Account created and password hashed.', 'Credentials matched; session started.', 'Session checked; access granted.', 'Session cleared; user signed out.'][completed - 1] : 'Waiting for request…';
    content.innerHTML = `${panel}<div class="server-card"><span class="server-icon">⌘</span><b>SERVER</b><small>${serverMessage}</small></div>`;
    result.classList.toggle('success', Boolean(completed) && !isError);
    result.classList.toggle('error', isError);
    const defaultMessage = completed === stages.length ? 'All four steps are complete. Reset and try another username or password.' : completed ? 'Last request completed successfully.' : 'Enter your details, then start the simulation.';
    result.innerHTML = `<span class="result-dot"></span><span>${escapeHTML(message || defaultMessage)}</span>`;

    const pairs = [['sim-username','username'],['sim-password','password'],['sim-login-username','loginUsername'],['sim-login-password','loginPassword']];
    pairs.forEach(([id,key]) => {
      const field = document.getElementById(id);
      if (field) field.addEventListener('input', () => { state[key] = field.value; });
    });
  }

  function submitStage() {
    if (completed === stages.length) {
      current = 0; completed = 0;
      state.username = ''; state.password = ''; state.loginUsername = ''; state.loginPassword = ''; state.authenticated = false;
      render(); return;
    }
    if (current === 0) {
      state.username = document.querySelector('#sim-username')?.value.trim() || '';
      state.password = document.querySelector('#sim-password')?.value || '';
      if (!state.username || !state.password) return render('Enter a username and password to create the account.', true);
      if (state.password.length < 8) return render('Use a password with at least 8 characters.', true);
      completed = 1; current = 1; state.loginUsername = state.username; state.loginPassword = '';
      return render('Account created. The simulator has saved your password in memory for this demo.');
    }
    if (current === 1) {
      state.loginUsername = document.querySelector('#sim-login-username')?.value.trim() || '';
      state.loginPassword = document.querySelector('#sim-login-password')?.value || '';
      if (state.loginUsername !== state.username || state.loginPassword !== state.password) return render('Login failed. Check that both values match the account you created.', true);
      state.authenticated = true; completed = 2; current = 2;
      return render('Credentials match. The server starts an authenticated session.');
    }
    if (current === 2) {
      if (!state.authenticated) return render('Access denied. Log in before opening this protected page.', true);
      completed = 3; current = 3;
      return render(`Access granted. Welcome, ${state.username}.`);
    }
    state.authenticated = false; completed = 4;
    render('You are logged out. The protected profile would now require a new login.');
  }

  next.addEventListener('click', submitStage);
  back.addEventListener('click', () => {
    if (current > 0 && completed < stages.length) {
      current -= 1;
      completed = current;
      if (current < 2) state.authenticated = false;
      render('You went back. Review or edit the details, then continue.');
    }
  });
  reset.addEventListener('click', () => {
    current = 0; completed = 0;
    state.username = ''; state.password = ''; state.loginUsername = ''; state.loginPassword = ''; state.authenticated = false;
    render('Reset complete. Enter a username and password to begin.');
  });
  render();
});
