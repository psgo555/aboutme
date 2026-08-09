/**
 * Muscle Data & Exercise Database
 *
 * Each muscle group has:
 *   - id: unique identifier matching SVG data-muscle attribute
 *   - name: Chinese name
 *   - nameEn: English name
 *   - subGroups: detailed sub-muscles (shown on drill-down)
 *   - exercises: related training movements
 *
 * Each exercise has:
 *   - id: unique identifier
 *   - name: Chinese name
 *   - nameEn: English name
 *   - description: brief description in Chinese
 *   - muscles: object mapping muscle IDs to involvement percentage
 */

const MUSCLE_GROUPS = {
  traps: {
    id: 'traps',
    name: '斜方肌',
    nameEn: 'Trapezius',
    subGroups: [
      { name: '上斜方肌', nameEn: 'Upper Trapezius' },
      { name: '中斜方肌', nameEn: 'Middle Trapezius' },
    ],
  },
  deltoids: {
    id: 'deltoids',
    name: '三角肌',
    nameEn: 'Deltoids',
    subGroups: [
      { name: '前三角肌', nameEn: 'Anterior Deltoid' },
      { name: '中三角肌', nameEn: 'Lateral Deltoid' },
      { name: '後三角肌', nameEn: 'Posterior Deltoid' },
    ],
  },
  chest: {
    id: 'chest',
    name: '胸肌',
    nameEn: 'Pectorals',
    subGroups: [
      { name: '上胸', nameEn: 'Upper Chest (Clavicular)' },
      { name: '胸大肌', nameEn: 'Pectoralis Major' },
      { name: '下胸', nameEn: 'Lower Chest' },
    ],
  },
  biceps: {
    id: 'biceps',
    name: '二頭肌',
    nameEn: 'Biceps',
    subGroups: [
      { name: '二頭肌長頭', nameEn: 'Long Head' },
      { name: '二頭肌短頭', nameEn: 'Short Head' },
      { name: '肱肌', nameEn: 'Brachialis' },
    ],
  },
  forearms: {
    id: 'forearms',
    name: '前臂',
    nameEn: 'Forearms',
    subGroups: [
      { name: '肱橈肌', nameEn: 'Brachioradialis' },
      { name: '腕屈肌群', nameEn: 'Wrist Flexors' },
      { name: '腕伸肌群', nameEn: 'Wrist Extensors' },
    ],
  },
  abs: {
    id: 'abs',
    name: '腹直肌',
    nameEn: 'Rectus Abdominis',
    subGroups: [
      { name: '上腹', nameEn: 'Upper Abs' },
      { name: '下腹', nameEn: 'Lower Abs' },
    ],
  },
  obliques: {
    id: 'obliques',
    name: '側腹 / 鯊魚肌',
    nameEn: 'Obliques / Serratus',
    subGroups: [
      { name: '腹外斜肌', nameEn: 'External Oblique' },
      { name: '腹內斜肌', nameEn: 'Internal Oblique' },
      { name: '前鋸肌', nameEn: 'Serratus Anterior' },
    ],
  },
  quads: {
    id: 'quads',
    name: '股四頭肌',
    nameEn: 'Quadriceps',
    subGroups: [
      { name: '股直肌', nameEn: 'Rectus Femoris' },
      { name: '股外側肌', nameEn: 'Vastus Lateralis' },
      { name: '股內側肌', nameEn: 'Vastus Medialis' },
      { name: '股中間肌', nameEn: 'Vastus Intermedius' },
    ],
  },
  adductors: {
    id: 'adductors',
    name: '股內收肌',
    nameEn: 'Adductors',
    subGroups: [
      { name: '長收肌', nameEn: 'Adductor Longus' },
      { name: '大收肌', nameEn: 'Adductor Magnus' },
      { name: '恥骨肌', nameEn: 'Pectineus' },
    ],
  },
  tibialis: {
    id: 'tibialis',
    name: '脛前肌 / 小腿',
    nameEn: 'Tibialis / Calves',
    subGroups: [
      { name: '脛前肌', nameEn: 'Tibialis Anterior' },
      { name: '腓腸肌（前側可見）', nameEn: 'Gastrocnemius (front-visible)' },
    ],
  },
};

const EXERCISES = [
  // ===== Chest Exercises =====
  {
    id: 'bench-press',
    name: '槓鈴臥推',
    nameEn: 'Barbell Bench Press',
    description: '經典胸部訓練動作，躺在臥推椅上將槓鈴從胸口推起。',
    primaryMuscle: 'chest',
    muscles: { chest: 60, deltoids: 25, biceps: 5 },
  },
  {
    id: 'incline-bench-press',
    name: '上斜臥推',
    nameEn: 'Incline Bench Press',
    description: '臥推椅傾斜30-45度，強調上胸部的訓練。',
    primaryMuscle: 'chest',
    muscles: { chest: 50, deltoids: 35, biceps: 5 },
  },
  {
    id: 'dumbbell-fly',
    name: '啞鈴飛鳥',
    nameEn: 'Dumbbell Fly',
    description: '雙手持啞鈴向兩側展開再合攏，強調胸肌伸展與收縮。',
    primaryMuscle: 'chest',
    muscles: { chest: 80, deltoids: 15, biceps: 5 },
  },
  {
    id: 'cable-fly',
    name: '繩索飛鳥',
    nameEn: 'Cable Fly',
    description: '使用繩索機進行飛鳥動作，提供持續張力刺激胸肌。',
    primaryMuscle: 'chest',
    muscles: { chest: 75, deltoids: 15, biceps: 10 },
  },
  {
    id: 'push-up',
    name: '伏地挺身',
    nameEn: 'Push-up',
    description: '徒手經典動作，全身發力推起身體，訓練胸肌與核心。',
    primaryMuscle: 'chest',
    muscles: { chest: 55, deltoids: 20, abs: 10, biceps: 5 },
  },
  {
    id: 'dips',
    name: '雙槓撐體',
    nameEn: 'Dips',
    description: '雙手撐在平行槓上，身體下沉再推起，強調下胸。',
    primaryMuscle: 'chest',
    muscles: { chest: 55, deltoids: 25, abs: 5 },
  },

  // ===== Shoulder Exercises =====
  {
    id: 'overhead-press',
    name: '肩推',
    nameEn: 'Overhead Press',
    description: '站姿或坐姿將槓鈴/啞鈴從肩膀推至頭頂，全面訓練三角肌。',
    primaryMuscle: 'deltoids',
    muscles: { deltoids: 60, traps: 20, abs: 10 },
  },
  {
    id: 'lateral-raise',
    name: '側平舉',
    nameEn: 'Lateral Raise',
    description: '雙手持啞鈴向兩側平舉至肩膀高度，孤立訓練中三角肌。',
    primaryMuscle: 'deltoids',
    muscles: { deltoids: 85, traps: 15 },
  },
  {
    id: 'front-raise',
    name: '前平舉',
    nameEn: 'Front Raise',
    description: '啞鈴或槓片由身前舉至肩膀高度，強調前三角肌。',
    primaryMuscle: 'deltoids',
    muscles: { deltoids: 65, chest: 20, traps: 10, abs: 5 },
  },
  {
    id: 'upright-row',
    name: '直立划船',
    nameEn: 'Upright Row',
    description: '雙手持槓鈴沿身體前方拉至下巴高度，訓練三角肌與斜方肌。',
    primaryMuscle: 'deltoids',
    muscles: { deltoids: 45, traps: 35, biceps: 15, forearms: 5 },
  },
  {
    id: 'arnold-press',
    name: '阿諾肩推',
    nameEn: 'Arnold Press',
    description: '旋轉式肩推動作，從掌心朝內旋轉至朝前，全面刺激三角肌。',
    primaryMuscle: 'deltoids',
    muscles: { deltoids: 65, traps: 15, chest: 10, abs: 5 },
  },

  // ===== Biceps / Arm Exercises =====
  {
    id: 'barbell-curl',
    name: '槓鈴彎舉',
    nameEn: 'Barbell Curl',
    description: '雙手持槓鈴進行彎舉，二頭肌的經典訓練動作。',
    primaryMuscle: 'biceps',
    muscles: { biceps: 80, forearms: 20 },
  },
  {
    id: 'hammer-curl',
    name: '錘式彎舉',
    nameEn: 'Hammer Curl',
    description: '掌心相對持啞鈴彎舉，同時訓練二頭肌與肱橈肌。',
    primaryMuscle: 'biceps',
    muscles: { biceps: 55, forearms: 45 },
  },
  {
    id: 'concentration-curl',
    name: '集中彎舉',
    nameEn: 'Concentration Curl',
    description: '坐姿單手彎舉，手肘抵住大腿內側，孤立刺激二頭肌。',
    primaryMuscle: 'biceps',
    muscles: { biceps: 90, forearms: 10 },
  },
  {
    id: 'preacher-curl',
    name: '牧師彎舉',
    nameEn: 'Preacher Curl',
    description: '手臂靠在傾斜墊上進行彎舉，消除借力，專注二頭肌。',
    primaryMuscle: 'biceps',
    muscles: { biceps: 85, forearms: 15 },
  },
  {
    id: 'cable-curl',
    name: '繩索彎舉',
    nameEn: 'Cable Curl',
    description: '使用繩索機進行彎舉，提供全程持續張力。',
    primaryMuscle: 'biceps',
    muscles: { biceps: 75, forearms: 25 },
  },

  // ===== Forearm Exercises =====
  {
    id: 'wrist-curl',
    name: '腕彎舉',
    nameEn: 'Wrist Curl',
    description: '前臂放在大腿或平面上，手腕向上捲曲啞鈴或槓鈴。',
    primaryMuscle: 'forearms',
    muscles: { forearms: 90, biceps: 10 },
  },
  {
    id: 'reverse-wrist-curl',
    name: '反握腕彎舉',
    nameEn: 'Reverse Wrist Curl',
    description: '掌心朝下進行腕彎舉，訓練前臂伸肌群。',
    primaryMuscle: 'forearms',
    muscles: { forearms: 95, biceps: 5 },
  },
  {
    id: 'farmer-walk',
    name: '農夫走路',
    nameEn: "Farmer's Walk",
    description: '雙手提重物行走，強化握力與前臂肌群。',
    primaryMuscle: 'forearms',
    muscles: { forearms: 50, traps: 25, abs: 15, quads: 10 },
  },

  // ===== Abs Exercises =====
  {
    id: 'crunch',
    name: '捲腹',
    nameEn: 'Crunch',
    description: '躺姿將上半身捲起，專注收縮腹直肌。',
    primaryMuscle: 'abs',
    muscles: { abs: 85, obliques: 15 },
  },
  {
    id: 'leg-raise',
    name: '抬腿',
    nameEn: 'Leg Raise',
    description: '躺姿或懸吊將雙腿抬起，強調下腹部訓練。',
    primaryMuscle: 'abs',
    muscles: { abs: 65, obliques: 15, quads: 20 },
  },
  {
    id: 'plank',
    name: '棒式（平板撐）',
    nameEn: 'Plank',
    description: '前臂撐地保持身體成一直線，全面訓練核心穩定。',
    primaryMuscle: 'abs',
    muscles: { abs: 45, obliques: 25, deltoids: 15, quads: 10, chest: 5 },
  },
  {
    id: 'ab-wheel-rollout',
    name: '健腹輪',
    nameEn: 'Ab Wheel Rollout',
    description: '跪姿推動健腹輪向前延伸再收回，高強度腹部訓練。',
    primaryMuscle: 'abs',
    muscles: { abs: 55, obliques: 20, deltoids: 15, chest: 10 },
  },
  {
    id: 'hanging-knee-raise',
    name: '懸吊抬膝',
    nameEn: 'Hanging Knee Raise',
    description: '懸吊於單槓，將膝蓋向胸口抬起，訓練下腹與髖屈肌。',
    primaryMuscle: 'abs',
    muscles: { abs: 60, obliques: 20, quads: 10, forearms: 10 },
  },

  // ===== Obliques / Serratus Exercises =====
  {
    id: 'russian-twist',
    name: '俄羅斯轉體',
    nameEn: 'Russian Twist',
    description: '坐姿雙腳離地，身體左右轉動，強化側腹與旋轉力量。',
    primaryMuscle: 'obliques',
    muscles: { obliques: 60, abs: 35, quads: 5 },
  },
  {
    id: 'cable-woodchop',
    name: '繩索劈砍',
    nameEn: 'Cable Woodchop',
    description: '使用繩索機從高處向對側下方拉動，訓練旋轉與側腹力量。',
    primaryMuscle: 'obliques',
    muscles: { obliques: 55, abs: 25, deltoids: 15, chest: 5 },
  },
  {
    id: 'side-plank',
    name: '側棒式',
    nameEn: 'Side Plank',
    description: '側身單手撐地保持身體成直線，孤立訓練側腹穩定。',
    primaryMuscle: 'obliques',
    muscles: { obliques: 65, abs: 20, deltoids: 10, quads: 5 },
  },
  {
    id: 'bicycle-crunch',
    name: '腳踏車捲腹',
    nameEn: 'Bicycle Crunch',
    description: '仰臥交替以肘碰對側膝蓋，同時訓練腹直肌與側腹。',
    primaryMuscle: 'obliques',
    muscles: { obliques: 50, abs: 40, quads: 10 },
  },

  // ===== Quadriceps / Leg Exercises =====
  {
    id: 'barbell-squat',
    name: '槓鈴深蹲',
    nameEn: 'Barbell Squat',
    description: '槓鈴置於肩上進行深蹲，下肢訓練之王。',
    primaryMuscle: 'quads',
    muscles: { quads: 45, adductors: 15, abs: 10, traps: 5 },
  },
  {
    id: 'leg-press',
    name: '腿推機',
    nameEn: 'Leg Press',
    description: '坐姿在腿推機上將重量推出，針對大腿前側訓練。',
    primaryMuscle: 'quads',
    muscles: { quads: 60, adductors: 20, tibialis: 5 },
  },
  {
    id: 'leg-extension',
    name: '腿伸展',
    nameEn: 'Leg Extension',
    description: '坐姿在腿伸展機上伸直雙腿，孤立訓練股四頭肌。',
    primaryMuscle: 'quads',
    muscles: { quads: 95, tibialis: 5 },
  },
  {
    id: 'lunge',
    name: '弓步蹲',
    nameEn: 'Lunge',
    description: '單腳向前跨出下蹲，訓練大腿與平衡穩定。',
    primaryMuscle: 'quads',
    muscles: { quads: 45, adductors: 20, abs: 10, tibialis: 5 },
  },
  {
    id: 'bulgarian-split-squat',
    name: '保加利亞分腿蹲',
    nameEn: 'Bulgarian Split Squat',
    description: '後腳架高進行單腿深蹲，強化大腿肌力與穩定性。',
    primaryMuscle: 'quads',
    muscles: { quads: 50, adductors: 20, abs: 10, tibialis: 5 },
  },
  {
    id: 'hack-squat',
    name: '哈克深蹲',
    nameEn: 'Hack Squat',
    description: '在哈克機上進行深蹲，背部有靠墊支撐，專注大腿發力。',
    primaryMuscle: 'quads',
    muscles: { quads: 65, adductors: 20, tibialis: 5 },
  },
  {
    id: 'front-squat',
    name: '前蹲舉',
    nameEn: 'Front Squat',
    description: '槓鈴置於肩前進行深蹲，強調股四頭肌與核心穩定。',
    primaryMuscle: 'quads',
    muscles: { quads: 55, adductors: 15, abs: 15, traps: 5 },
  },

  // ===== Adductor Exercises =====
  {
    id: 'adductor-machine',
    name: '內收肌機',
    nameEn: 'Adductor Machine',
    description: '坐姿在內收肌機上將雙腿向內合攏，孤立訓練股內側。',
    primaryMuscle: 'adductors',
    muscles: { adductors: 90, quads: 10 },
  },
  {
    id: 'sumo-squat',
    name: '相撲深蹲',
    nameEn: 'Sumo Squat',
    description: '寬站距深蹲，腳尖外開，強調股內側與臀部訓練。',
    primaryMuscle: 'adductors',
    muscles: { adductors: 40, quads: 40, abs: 10 },
  },
  {
    id: 'copenhagen-plank',
    name: '哥本哈根側棒式',
    nameEn: 'Copenhagen Plank',
    description: '側棒式變化，上腿放在高處支撐，強化內收肌群。',
    primaryMuscle: 'adductors',
    muscles: { adductors: 55, obliques: 25, abs: 15, deltoids: 5 },
  },

  // ===== Tibialis / Calf Exercises =====
  {
    id: 'tibialis-raise',
    name: '脛前肌抬舉',
    nameEn: 'Tibialis Raise',
    description: '背靠牆壁，腳跟著地將腳尖抬起，訓練脛前肌。',
    primaryMuscle: 'tibialis',
    muscles: { tibialis: 95, quads: 5 },
  },
  {
    id: 'calf-raise',
    name: '小腿提踵',
    nameEn: 'Calf Raise',
    description: '站姿或坐姿將腳跟抬起至最高點，訓練小腿肌群。',
    primaryMuscle: 'tibialis',
    muscles: { tibialis: 90, quads: 10 },
  },
  {
    id: 'seated-calf-raise',
    name: '坐姿提踵',
    nameEn: 'Seated Calf Raise',
    description: '坐姿在提踵機上將腳跟抬起，專注比目魚肌訓練。',
    primaryMuscle: 'tibialis',
    muscles: { tibialis: 95, quads: 5 },
  },

  // ===== Trapezius Exercises =====
  {
    id: 'barbell-shrug',
    name: '槓鈴聳肩',
    nameEn: 'Barbell Shrug',
    description: '雙手持槓鈴將肩膀向上聳起，孤立訓練上斜方肌。',
    primaryMuscle: 'traps',
    muscles: { traps: 85, deltoids: 10, forearms: 5 },
  },
  {
    id: 'dumbbell-shrug',
    name: '啞鈴聳肩',
    nameEn: 'Dumbbell Shrug',
    description: '雙手持啞鈴進行聳肩動作，訓練上斜方肌。',
    primaryMuscle: 'traps',
    muscles: { traps: 85, deltoids: 10, forearms: 5 },
  },
  {
    id: 'face-pull',
    name: '面拉',
    nameEn: 'Face Pull',
    description: '使用繩索將把手拉向面部，訓練後三角肌與上背。',
    primaryMuscle: 'traps',
    muscles: { traps: 40, deltoids: 40, biceps: 10, forearms: 10 },
  },
];

/**
 * Get exercises related to a specific muscle group
 * Returns exercises where the given muscle is involved
 */
function getExercisesForMuscle(muscleId) {
  return EXERCISES.filter(
    (ex) => ex.primaryMuscle === muscleId || (ex.muscles[muscleId] && ex.muscles[muscleId] >= 10)
  );
}

/**
 * Get the color for a given involvement percentage
 * Returns an HSL color string: deeper red = higher involvement
 */
function getMuscleColor(percentage) {
  if (percentage >= 80) return 'rgba(220, 38, 38, 0.95)';   // Deep red
  if (percentage >= 60) return 'rgba(239, 68, 68, 0.90)';   // Red
  if (percentage >= 40) return 'rgba(248, 113, 113, 0.80)';  // Medium red
  if (percentage >= 20) return 'rgba(252, 165, 165, 0.70)';  // Light red
  return 'rgba(254, 202, 202, 0.55)';                        // Very light red
}

/**
 * Get the opacity for a given involvement percentage (0-1)
 */
function getMuscleOpacity(percentage) {
  return 0.3 + (percentage / 100) * 0.7;
}