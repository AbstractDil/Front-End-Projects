const { createApp, ref, computed, reactive } = Vue;

createApp({
  setup() {
    // ─── State ───────────────────────────────────────────────────
    const tab = ref('setup'); // 'setup' | 'lottery' | 'results'

    const studentInput = ref('');
    const students = ref([...defaultStudents]);

    // Question sets as a list of strings (no min/max range)
    const questionSetInput = ref('');
    const questionSetList = ref([...defaultQuestionSets]);

    // Lottery state
    const assignments = reactive({});   // { studentName: setCode }
    const remaining   = ref([]);        // set codes not yet drawn
    const drawOrder   = ref([]);        // students in shuffled order
    const currentIndex = ref(-1);
    const spinning    = ref(false);
    const spinDisplay = ref('?');
    const spinInterval = ref(null);
    const lotteryDone = ref(false);

    // ─── Modal state ─────────────────────────────────────────────
    const modal = reactive({ show: false, student: '', set: '' });

    const showModal = (student, set) => {
      modal.student = student;
      modal.set     = set;
      modal.show    = true;
    };

    const closeModal = () => { modal.show = false; };

    // ─── Setup helpers ───────────────────────────────────────────
    const addStudent = () => {
      const name = studentInput.value.trim();
      if (name && !students.value.includes(name)) students.value.push(name);
      studentInput.value = '';
    };

    const removeStudent = (i) => students.value.splice(i, 1);

    const addSet = () => {
      const code = questionSetInput.value.trim().toUpperCase();
      if (code && !questionSetList.value.includes(code)) questionSetList.value.push(code);
      questionSetInput.value = '';
    };

    const removeSet = (i) => questionSetList.value.splice(i, 1);

    const canStart = computed(
      () => students.value.length > 0 && questionSetList.value.length >= students.value.length
    );

    // ─── Lottery logic ───────────────────────────────────────────
    const startLottery = () => {
      drawOrder.value = [...students.value].sort(() => Math.random() - 0.5);
      remaining.value = [...questionSetList.value].sort(() => Math.random() - 0.5);
      Object.keys(assignments).forEach((k) => delete assignments[k]);
      currentIndex.value = -1;
      lotteryDone.value  = false;
      spinDisplay.value  = '?';
      modal.show         = false;
      tab.value = 'lottery';
    };

    const drawNext = () => {
      if (spinning.value) return;
      const nextIdx = currentIndex.value + 1;
      if (nextIdx >= drawOrder.value.length) return;

      spinning.value    = true;
      spinDisplay.value = '?';

      const pool = remaining.value;
      let tick = 0;
      const totalTicks = 22 + Math.floor(Math.random() * 14);

      spinInterval.value = setInterval(() => {
        spinDisplay.value = pool[Math.floor(Math.random() * pool.length)];
        tick++;

        if (tick >= totalTicks) {
          clearInterval(spinInterval.value);

          const resultIdx = Math.floor(Math.random() * remaining.value.length);
          const result    = remaining.value.splice(resultIdx, 1)[0];
          const student   = drawOrder.value[nextIdx];

          assignments[student] = result;
          spinDisplay.value    = result;
          currentIndex.value   = nextIdx;
          spinning.value       = false;

          if (nextIdx === drawOrder.value.length - 1) lotteryDone.value = true;

          // Auto-show modal with result
          showModal(student, result);
        }
      }, 60);
    };

    const goToResults = () => { tab.value = 'results'; };

    const resetAll = () => {
      tab.value = 'setup';
      lotteryDone.value  = false;
      currentIndex.value = -1;
      spinning.value     = false;
      spinDisplay.value  = '?';
      modal.show         = false;
      Object.keys(assignments).forEach((k) => delete assignments[k]);
    };

    const resultsList = computed(() =>
      drawOrder.value.map((s) => ({ student: s, set: assignments[s] ?? '—' }))
    );

    // Import from JSON
    const importJSON = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (Array.isArray(data.students))     students.value        = data.students;
          if (Array.isArray(data.questionSets)) questionSetList.value = data.questionSets;
        } catch { alert('Invalid JSON file.'); }
      };
      reader.readAsText(file);
    };

    // Export results as JSON
    const exportResults = () => {
      const blob = new Blob([JSON.stringify(resultsList.value, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = 'lottery-results.json'; a.click();
      URL.revokeObjectURL(url);
    };

    return {
      tab, studentInput, students, questionSetInput, questionSetList,
      addStudent, removeStudent, addSet, removeSet, canStart,
      startLottery, drawNext, drawOrder,
      spinning, spinDisplay, lotteryDone, goToResults, resetAll,
      assignments, resultsList, importJSON, exportResults, currentIndex,
      modal, showModal, closeModal,
    };
  },
}).mount('#app');