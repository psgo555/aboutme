/**
 * MuscleMap — Interactive Muscle Group Training Recommender
 *
 * Main application logic:
 *  - Handle muscle group clicks on SVG
 *  - Display related exercises
 *  - Highlight muscles on exercise selection with involvement colors
 *  - Show percentage labels on the body map
 */

(function () {
  'use strict';

  // ===== DOM References =====
  const svg = document.querySelector('.muscle-map-svg');
  const muscleElements = svg.querySelectorAll('.muscle-group');
  const exercisePanel = document.getElementById('exercisePanel');
  const exerciseList = document.getElementById('exerciseList');
  const muscleInfo = document.getElementById('muscleInfo');
  const muscleName = document.getElementById('muscleName');
  const muscleNameEn = document.getElementById('muscleNameEn');
  const muscleSubtitle = document.getElementById('muscleSubtitle');
  const subGroups = document.getElementById('subGroups');
  const placeholder = document.getElementById('placeholder');
  const backBtn = document.getElementById('backBtn');
  const instructions = document.getElementById('instructions');
  const legend = document.getElementById('legend');

  // ===== State =====
  let selectedMuscle = null;
  let selectedExercise = null;
  let percentageLabels = []; // SVG text elements for percentages

  // Center positions for each muscle group (for percentage labels)
  // These correspond to approximate visual centers of each muscle group in the SVG
  const muscleCenters = {
    traps:     { x: 200, y: 128 },
    deltoids:  { lx: 118, rx: 282, y: 172 },
    chest:     { lx: 162, rx: 238, y: 200 },
    biceps:    { lx: 108, rx: 292, y: 268 },
    forearms:  { lx: 95,  rx: 305, y: 388 },
    abs:       { x: 200, y: 320 },
    obliques:  { lx: 145, rx: 255, y: 300 },
    quads:     { lx: 158, rx: 242, y: 480 },
    adductors: { lx: 176, rx: 224, y: 480 },
    tibialis:  { lx: 165, rx: 235, y: 695 },
  };

  // ===== Initialize =====
  init();

  function init() {
    // Attach click handlers to muscle groups
    muscleElements.forEach((el) => {
      el.addEventListener('click', handleMuscleClick);
    });

    // Back button
    backBtn.addEventListener('click', resetToInitial);

    // Click on background to deselect
    svg.addEventListener('click', (e) => {
      if (e.target === svg || e.target.classList.contains('body-part')) {
        resetToInitial();
      }
    });
  }

  // ===== Muscle Click =====
  function handleMuscleClick(e) {
    e.stopPropagation();
    const muscleId = e.currentTarget.getAttribute('data-muscle');
    if (!muscleId) return;

    // If clicking same muscle, deselect
    if (selectedMuscle === muscleId && !selectedExercise) {
      resetToInitial();
      return;
    }

    selectMuscle(muscleId);
  }

  function selectMuscle(muscleId) {
    selectedMuscle = muscleId;
    selectedExercise = null;

    const group = MUSCLE_GROUPS[muscleId];
    if (!group) return;

    // Update SVG highlights
    clearAllHighlights();
    highlightMuscle(muscleId, true);

    // Hide instructions
    instructions.classList.add('hidden');
    legend.classList.remove('visible');

    // Show muscle info
    placeholder.style.display = 'none';
    muscleInfo.style.display = 'block';
    backBtn.classList.add('visible');

    muscleName.textContent = group.name;
    muscleNameEn.textContent = group.nameEn;
    muscleSubtitle.textContent = '點擊下方動作查看肌群參與分析';

    // Populate sub-groups
    subGroups.innerHTML = '';
    group.subGroups.forEach((sg) => {
      const tag = document.createElement('span');
      tag.className = 'sub-group-tag';
      tag.textContent = sg.name;
      subGroups.appendChild(tag);
    });

    // Populate exercises
    const exercises = getExercisesForMuscle(muscleId);
    renderExerciseList(exercises);
  }

  // ===== Render Exercise List =====
  function renderExerciseList(exercises) {
    exerciseList.innerHTML = '';

    exercises.forEach((ex, index) => {
      const card = document.createElement('div');
      card.className = 'exercise-card';
      card.style.animationDelay = `${index * 0.03}s`;

      // Build muscle bars HTML
      const barsHtml = Object.entries(ex.muscles)
        .sort((a, b) => b[1] - a[1])
        .map(([mId, pct]) => {
          const mGroup = MUSCLE_GROUPS[mId];
          const label = mGroup ? mGroup.name : mId;
          return `
            <div class="muscle-bar-row">
              <span class="muscle-bar-label">${label}</span>
              <div class="muscle-bar-track">
                <div class="muscle-bar-fill" style="width: 0%;" data-width="${pct}"></div>
              </div>
              <span class="muscle-bar-pct">${pct}%</span>
            </div>
          `;
        })
        .join('');

      card.innerHTML = `
        <div class="exercise-name">${ex.name}</div>
        <div class="exercise-name-en">${ex.nameEn}</div>
        <div class="exercise-desc">${ex.description}</div>
        <div class="muscle-bars">${barsHtml}</div>
      `;

      card.addEventListener('click', () => handleExerciseClick(ex, card));
      exerciseList.appendChild(card);
    });
  }

  // ===== Exercise Click =====
  function handleExerciseClick(exercise, cardElement) {
    // If clicking same exercise, deselect it
    if (selectedExercise === exercise.id) {
      selectedExercise = null;
      cardElement.classList.remove('active');
      clearAllHighlights();
      highlightMuscle(selectedMuscle, true);
      legend.classList.remove('visible');
      clearPercentageLabels();
      return;
    }

    selectedExercise = exercise.id;

    // Update card states
    exerciseList.querySelectorAll('.exercise-card').forEach((c) => c.classList.remove('active'));
    cardElement.classList.add('active');

    // Animate bars
    requestAnimationFrame(() => {
      cardElement.querySelectorAll('.muscle-bar-fill').forEach((bar) => {
        bar.style.width = bar.getAttribute('data-width') + '%';
      });
    });

    // Update SVG — highlight all involved muscles
    clearAllHighlights();
    clearPercentageLabels();

    Object.entries(exercise.muscles).forEach(([muscleId, percentage]) => {
      highlightMuscleWithPercentage(muscleId, percentage);
    });

    // Show legend
    legend.classList.add('visible');
  }

  // ===== SVG Highlight Functions =====
  function highlightMuscle(muscleId, isActive) {
    muscleElements.forEach((el) => {
      if (el.getAttribute('data-muscle') === muscleId) {
        el.classList.toggle('active', isActive);
      }
    });
  }

  function highlightMuscleWithPercentage(muscleId, percentage) {
    const color = getMuscleColor(percentage);

    muscleElements.forEach((el) => {
      if (el.getAttribute('data-muscle') === muscleId) {
        el.classList.add('highlighted');
        el.style.fill = color;
        el.style.stroke = percentage >= 40 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)';
        el.style.strokeWidth = percentage >= 60 ? '1.5' : '1';
      }
    });

    // Add percentage label
    addPercentageLabel(muscleId, percentage);
  }

  function clearAllHighlights() {
    muscleElements.forEach((el) => {
      el.classList.remove('active', 'highlighted');
      el.style.fill = '';
      el.style.stroke = '';
      el.style.strokeWidth = '';
    });
  }

  // ===== Percentage Labels =====
  function addPercentageLabel(muscleId, percentage) {
    const center = muscleCenters[muscleId];
    if (!center) return;

    // Determine positions — some muscles have left/right
    const positions = [];
    if (center.x !== undefined) {
      positions.push({ x: center.x, y: center.y || center.y });
    } else {
      positions.push({ x: center.lx, y: center.y });
      positions.push({ x: center.rx, y: center.y });
    }

    positions.forEach((pos) => {
      // Background rect
      const textWidth = percentage >= 10 ? 34 : 28;
      const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bg.setAttribute('x', pos.x - textWidth / 2);
      bg.setAttribute('y', pos.y - 8);
      bg.setAttribute('width', textWidth);
      bg.setAttribute('height', 16);
      bg.setAttribute('rx', 4);
      bg.setAttribute('ry', 4);
      bg.setAttribute('fill', 'rgba(0, 0, 0, 0.7)');
      bg.setAttribute('class', 'percentage-label-bg');
      bg.style.pointerEvents = 'none';
      svg.appendChild(bg);

      // Percentage text
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', pos.x);
      text.setAttribute('y', pos.y + 4);
      text.setAttribute('class', 'percentage-label');
      text.textContent = percentage + '%';
      text.style.pointerEvents = 'none';
      svg.appendChild(text);

      // Animate in
      requestAnimationFrame(() => {
        bg.classList.add('visible');
        text.classList.add('visible');
      });

      percentageLabels.push(bg, text);
    });
  }

  function clearPercentageLabels() {
    percentageLabels.forEach((el) => {
      el.classList.remove('visible');
      setTimeout(() => el.remove(), 300);
    });
    percentageLabels = [];
  }

  // ===== Reset =====
  function resetToInitial() {
    selectedMuscle = null;
    selectedExercise = null;

    clearAllHighlights();
    clearPercentageLabels();

    // Reset UI
    placeholder.style.display = '';
    muscleInfo.style.display = 'none';
    exerciseList.innerHTML = '';
    backBtn.classList.remove('visible');
    instructions.classList.remove('hidden');
    legend.classList.remove('visible');
  }
})();