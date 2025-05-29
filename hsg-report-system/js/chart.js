let productionChart, qualityChart, facilityChart, safetyChart;

function renderCharts(data, viewType = 'daily') {
  // 생산실적
  const prodCtx = document.getElementById('productionChart').getContext('2d');
  if (productionChart) productionChart.destroy();
  productionChart = new Chart(prodCtx, {
    type: 'bar',
    data: {
      labels: ['의료기', '자동문'],
      datasets: [{
        label: '달성률(%)',
        data: [data.production.medical.rate, data.production.door.rate],
        backgroundColor: ['#2563eb', '#38bdf8']
      }]
    },
    options: { 
      responsive: true, 
      plugins: { 
        legend: { display: false },
        title: {
          display: true,
          text: '부문별 생산 달성률'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });

  // 품질현황
  const qualCtx = document.getElementById('qualityChart').getContext('2d');
  if (qualityChart) qualityChart.destroy();
  qualityChart = new Chart(qualCtx, {
    type: 'doughnut',
    data: {
      labels: ['불량률', '정상'],
      datasets: [{
        data: [data.quality.defectRate, 100 - data.quality.defectRate],
        backgroundColor: ['#f87171', '#22d3ee']
      }]
    },
    options: { 
      responsive: true, 
      plugins: { 
        legend: { position: 'bottom' },
        title: {
          display: true,
          text: '품질 등급: ' + data.quality.grade
        }
      }
    }
  });

  // 설비현황
  const facCtx = document.getElementById('facilityChart').getContext('2d');
  if (facilityChart) facilityChart.destroy();
  facilityChart = new Chart(facCtx, {
    type: 'bar',
    data: {
      labels: ['가동률'],
      datasets: [{
        label: '가동률(%)',
        data: [data.facility.operationRate],
        backgroundColor: ['#34d399']
      }]
    },
    options: { 
      responsive: true, 
      plugins: { 
        legend: { display: false },
        title: {
          display: true,
          text: '설비 가동 현황'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });

  // 안전현황
  const safCtx = document.getElementById('safetyChart').getContext('2d');
  if (safetyChart) safetyChart.destroy();
  safetyChart = new Chart(safCtx, {
    type: 'pie',
    data: {
      labels: ['무사고일수', '사고건수'],
      datasets: [{
        data: [data.safety.noAccidentDays, data.safety.accidentCount],
        backgroundColor: ['#818cf8', '#fbbf24']
      }]
    },
    options: { 
      responsive: true, 
      plugins: { 
        legend: { position: 'bottom' },
        title: {
          display: true,
          text: '안전 현황'
        }
      }
    }
  });
} 