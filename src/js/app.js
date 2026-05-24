// Priority Terminal Application Logic (with Mock Firebase Auth & Vercel DB Sync)

// Initial State
let state = {
  user: null, // Simulated Auth State
  tasks: JSON.parse(localStorage.getItem('terminal_tasks')) || [
    { id: '1', title: 'Review morning trade logs and macro data', quadrant: 'q1', completed: false, time: '08:30' },
    { id: '2', title: 'Backtest Q3 options strategy changes', quadrant: 'q2', completed: false, time: '14:00' },
    { id: '3', title: 'Respond to standard broker compliance emails', quadrant: 'q3', completed: true, time: '11:00' },
    { id: '4', title: 'Organize research desk and monitors', quadrant: 'q4', completed: false, time: '16:30' }
  ],
  streak: parseInt(localStorage.getItem('terminal_streak')) || 5
};

// DOM Elements
const authOverlay = document.getElementById('auth-overlay');
const btnGoogleLogin = document.getElementById('btn-google-login');
const btnEmailLogin = document.getElementById('btn-email-login');
const btnBypassAuth = document.getElementById('btn-bypass-auth');
const btnSignOut = document.getElementById('btn-signout');

const authEmail = document.getElementById('auth-email');
const userEmailDisplay = document.getElementById('user-email');
const syncIcon = document.getElementById('sync-icon');
const syncStatus = document.getElementById('sync-status');

const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskQuadrant = document.getElementById('task-quadrant');
const taskTime = document.getElementById('task-time');

const q1List = document.getElementById('q1-list');
const q2List = document.getElementById('q2-list');
const q3List = document.getElementById('q3-list');
const q4List = document.getElementById('q4-list');

const focusScoreEl = document.getElementById('focus-score');
const streakCountEl = document.getElementById('streak-count');
const urgentCountEl = document.getElementById('urgent-count');
const chartTodayVal = document.getElementById('chart-today-val');
const chartTodayBar = document.getElementById('chart-today-bar');
const advisoryText = document.getElementById('advisory-text');

// ----------------------------------------------------
// Authentication Handlers (Mocking Google Firebase)
// ----------------------------------------------------
function handleLogin(email) {
  state.user = { email: email || 'trader.default@vercel.app' };
  authOverlay.classList.add('opacity-0', 'pointer-events-none');
  userEmailDisplay.textContent = state.user.email;
  triggerVercelSync('Initial pull complete');
  renderTasks();
  updateStats();
}

function handleLogout() {
  state.user = null;
  authOverlay.classList.remove('opacity-0', 'pointer-events-none');
  syncStatus.textContent = 'OFFLINE';
  syncIcon.className = 'material-symbols-outlined text-xs text-terminal-danger';
  syncIcon.textContent = 'cloud_off';
  syncIcon.classList.remove('animate-spin');
}

btnGoogleLogin.addEventListener('click', () => {
  // Simulate Google popup login
  btnGoogleLogin.innerHTML = '<span class="animate-spin material-symbols-outlined text-sm">sync</span> Connecting to Google...';
  setTimeout(() => {
    btnGoogleLogin.innerHTML = 'Sign in with Google';
    handleLogin('google.trader@gmail.com');
  }, 1000);
});

btnEmailLogin.addEventListener('click', () => {
  const email = authEmail.value.trim();
  if (email) {
    handleLogin(email);
  } else {
    authEmail.focus();
    authEmail.classList.add('border-terminal-danger');
    setTimeout(() => authEmail.classList.remove('border-terminal-danger'), 1000);
  }
});

btnBypassAuth.addEventListener('click', () => {
  handleLogin('mock.trader@terminal.io');
});

btnSignOut.addEventListener('click', () => {
  handleLogout();
});

// ----------------------------------------------------
// Vercel Database Synchronization Mocking
// ----------------------------------------------------
function triggerVercelSync(actionName) {
  // Update UI to syncing state
  syncStatus.textContent = 'SYNCING TO VERCEL DB...';
  syncStatus.className = 'text-terminal-warning font-mono';
  syncIcon.className = 'material-symbols-outlined text-xs text-terminal-warning animate-spin';
  syncIcon.textContent = 'sync';
  
  // Simulate network latency to Vercel Postgres Serverless endpoint
  const latency = Math.floor(Math.random() * 30) + 10; // 10ms - 40ms
  setTimeout(() => {
    syncStatus.textContent = `VERCEL DB: ONLINE (${latency}ms)`;
    syncStatus.className = 'text-terminal-text font-mono';
    syncIcon.className = 'material-symbols-outlined text-xs text-terminal-success';
    syncIcon.textContent = 'check_circle';
    syncIcon.classList.remove('animate-spin');
  }, 800);
}

// Save to LocalStorage & Mock Sync
function saveStateAndSync() {
  localStorage.setItem('terminal_tasks', JSON.stringify(state.tasks));
  localStorage.setItem('terminal_streak', state.streak.toString());
  triggerVercelSync();
}

// Calculate and Update Stats
function updateStats() {
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(t => t.completed);
  const activeTasks = state.tasks.filter(t => !t.completed);
  
  // Urgent Count (Active Q1 Tasks)
  const urgentCount = activeTasks.filter(t => t.quadrant === 'q1').length;
  urgentCountEl.textContent = urgentCount;
  
  // Focus Score: Percentage of completed tasks that were High-Impact (Q1 & Q2)
  const completedHighImpact = completedTasks.filter(t => t.quadrant === 'q1' || t.quadrant === 'q2').length;
  const focusScore = completedTasks.length > 0 
    ? Math.round((completedHighImpact / completedTasks.length) * 100) 
    : 100;
  focusScoreEl.textContent = `${focusScore}%`;
  
  // Today's Chart Progress (Completed vs Total)
  const completionRate = totalTasks > 0 
    ? Math.round((completedTasks.length / totalTasks) * 100) 
    : 0;
  chartTodayVal.textContent = `${completionRate}%`;
  chartTodayBar.style.height = `${completionRate}%`;
  
  // Streak Element
  streakCountEl.textContent = state.streak;

  // Real-time Advisory Engine
  if (urgentCount > 0) {
    advisoryText.innerHTML = `[WARNING]: ${urgentCount} high-risk positions (Q1 tasks) are active. Clear them immediately to mitigate exposure.`;
    advisoryText.className = 'text-xs leading-relaxed text-terminal-danger font-mono';
  } else if (activeTasks.filter(t => t.quadrant === 'q2').length > 0) {
    advisoryText.innerHTML = `[ADVISORY]: Strategic growth opportunities (Q2 tasks) are open. Allocate active hours to maximize long-term gains.`;
    advisoryText.className = 'text-xs leading-relaxed text-terminal-primary font-mono';
  } else if (activeTasks.length === 0 && totalTasks > 0) {
    advisoryText.innerHTML = `[SUCCESS]: All positions closed. Daily risk profile cleared. Enjoy the market break.`;
    advisoryText.className = 'text-xs leading-relaxed text-terminal-success font-mono';
  } else {
    advisoryText.innerHTML = `[ANALYSIS]: Terminal is in wait mode. Add positions to calculate real-time strategic execution.`;
    advisoryText.className = 'text-xs leading-relaxed text-terminal-text font-mono';
  }
}

// Render Task Lists
function renderTasks() {
  // Clear lists
  q1List.innerHTML = '';
  q2List.innerHTML = '';
  q3List.innerHTML = '';
  q4List.innerHTML = '';

  state.tasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item bg-terminal-surface border border-terminal-border/80 hover:border-terminal-border rounded-lg p-3 flex items-center justify-between gap-3 shadow transition-all ${task.completed ? 'opacity-65' : ''}`;
    
    // Determine quadrant label styles
    let checkColor = 'focus:ring-terminal-primary text-terminal-primary border-terminal-border';
    if (task.quadrant === 'q1') checkColor = 'focus:ring-terminal-danger text-terminal-danger checked:bg-terminal-danger checked:border-terminal-danger';
    if (task.quadrant === 'q2') checkColor = 'focus:ring-terminal-primary text-terminal-primary checked:bg-terminal-primary checked:border-terminal-primary';
    if (task.quadrant === 'q3') checkColor = 'focus:ring-terminal-warning text-terminal-warning checked:bg-terminal-warning checked:border-terminal-warning';
    
    taskItem.innerHTML = `
      <div class="flex items-center gap-3 flex-grow min-w-0">
        <input type="checkbox" ${task.completed ? 'checked' : ''} 
          class="task-toggle h-5 w-5 rounded border-2 bg-terminal-bg text-black ${checkColor} transition-all cursor-pointer">
        <div class="min-w-0 flex-grow">
          <p class="text-sm font-medium ${task.completed ? 'line-through text-terminal-textMuted' : 'text-white'} truncate">${task.title}</p>
          ${task.time ? `<span class="text-[10px] font-mono text-terminal-textMuted flex items-center gap-1 mt-0.5"><span class="material-symbols-outlined text-[10px]">schedule</span>${task.time}</span>` : ''}
        </div>
      </div>
      <button class="task-delete text-terminal-textMuted hover:text-terminal-danger transition-colors p-1 flex items-center justify-center">
        <span class="material-symbols-outlined text-lg">close</span>
      </button>
    `;

    // Event Listeners
    taskItem.querySelector('.task-toggle').addEventListener('change', () => toggleTask(task.id));
    taskItem.querySelector('.task-delete').addEventListener('click', () => deleteTask(task.id));

    // Append to correct list
    if (task.quadrant === 'q1') q1List.appendChild(taskItem);
    if (task.quadrant === 'q2') q2List.appendChild(taskItem);
    if (task.quadrant === 'q3') q3List.appendChild(taskItem);
    if (task.quadrant === 'q4') q4List.appendChild(taskItem);
  });

  // Empty state indicators
  const lists = [
    { el: q1List, text: 'No high risks active.' },
    { el: q2List, text: 'No strategic tasks planned.' },
    { el: q3List, text: 'No delegated tasks listed.' },
    { el: q4List, text: 'No backlog tasks.' }
  ];

  lists.forEach(list => {
    if (list.el.children.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'text-center py-6 text-xs text-terminal-textMuted font-mono border border-dashed border-terminal-border/40 rounded-lg flex flex-col items-center justify-center gap-1';
      emptyMsg.innerHTML = `<span class="material-symbols-outlined text-sm">check_circle</span> ${list.text}`;
      list.el.appendChild(emptyMsg);
    }
  });
}

// Actions
function toggleTask(id) {
  state.tasks = state.tasks.map(t => {
    if (t.id === id) {
      const newStatus = !t.completed;
      // Increment streak if completed
      if (newStatus) {
        state.streak += 1;
      } else {
        state.streak = Math.max(0, state.streak - 1);
      }
      return { ...t, completed: newStatus };
    }
    return t;
  });
  saveStateAndSync();
  renderTasks();
  updateStats();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  saveStateAndSync();
  renderTasks();
  updateStats();
}

// Add Task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const newTask = {
    id: Date.now().toString(),
    title: taskTitle.value.trim(),
    quadrant: taskQuadrant.value,
    completed: false,
    time: taskTime.value || null
  };

  state.tasks.unshift(newTask);
  saveStateAndSync();
  
  taskTitle.value = '';
  taskTime.value = '';

  renderTasks();
  updateStats();
});

// Initial Setup
// (Don't auto-login so user sees the login gate mockup first)
handleLogout();
