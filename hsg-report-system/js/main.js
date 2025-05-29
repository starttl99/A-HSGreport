let currentView = 'daily';
let hsgData = null;
let autoRefreshTimer = null;

function showLoader(show) {
  document.getElementById('loader').classList.toggle('active', show);
}

function showNotification(msg) {
  const n = document.getElementById('notification');
  n.textContent = msg;
  n.classList.add('active');
  setTimeout(() => n.classList.remove('active'), 2500);
}

function updateManagementList(data) {
  const ul = document.getElementById('management-list');
  ul.innerHTML = '';
  data.management.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.point;
    if (item.urgent) li.style.color = '#ef4444';
    ul.appendChild(li);
  });
}

async function loadDashboard(viewType = 'daily') {
  showLoader(true);
  hsgData = await fetchHSGData();
  renderCharts(hsgData, viewType);
  updateManagementList(hsgData);
  showLoader(false);
}

function exportJSON() {
  const blob = new Blob([JSON.stringify(hsgData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'hsg_report.json';
  a.click();
  URL.revokeObjectURL(url);
  showNotification('JSON 파일로 내보냈습니다.');
}

function exportCSV() {
  let csv = '구분,값\n';
  csv += `의료기 달성률,${hsgData.production.medical.rate}\n`;
  csv += `자동문 달성률,${hsgData.production.door.rate}\n`;
  csv += `품질 불량률,${hsgData.quality.defectRate}\n`;
  csv += `설비 가동률,${hsgData.facility.operationRate}\n`;
  csv += `무사고일수,${hsgData.safety.noAccidentDays}\n`;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'hsg_report.csv';
  a.click();
  URL.revokeObjectURL(url);
  showNotification('CSV 파일로 내보냈습니다.');
}

function setupViewSwitch() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentView = btn.id.replace('view-', '');
      loadDashboard(currentView);
    });
  });
}

function setupExport() {
  document.getElementById('export-json').addEventListener('click', exportJSON);
  document.getElementById('export-csv').addEventListener('click', exportCSV);
}

function setupShortcuts() {
  document.addEventListener('keydown', e => {
    if (e.ctrlKey) {
      if (e.key === '1') document.getElementById('view-daily').click();
      if (e.key === '2') document.getElementById('view-weekly').click();
      if (e.key === '3') document.getElementById('view-monthly').click();
    }
  });
}

function setupContextMenu() {
  document.addEventListener('contextmenu', e => {
    e.preventDefault();
    showNotification('데이터 내보내기: JSON/CSV 버튼을 이용하세요.');
  });
}

function setupTouchGestures() {
  let startX = 0;
  document.body.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });
  document.body.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (dx > 80) {
      // 오른쪽 스와이프: 이전 뷰
      if (currentView === 'weekly') document.getElementById('view-daily').click();
      if (currentView === 'monthly') document.getElementById('view-weekly').click();
    } else if (dx < -80) {
      // 왼쪽 스와이프: 다음 뷰
      if (currentView === 'daily') document.getElementById('view-weekly').click();
      if (currentView === 'weekly') document.getElementById('view-monthly').click();
    }
  });
}

function setupAutoRefresh() {
  if (autoRefreshTimer) clearInterval(autoRefreshTimer);
  autoRefreshTimer = setInterval(() => {
    loadDashboard(currentView);
    showNotification('5분마다 자동 새로고침!');
  }, 5 * 60 * 1000);
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  setupViewSwitch();
  setupExport();
  setupShortcuts();
  setupContextMenu();
  setupTouchGestures();
  setupAutoRefresh();
  registerServiceWorker();
}); 