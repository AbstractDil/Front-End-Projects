const { createApp } = Vue;

createApp({
  data() {
    return {
      examData: {},
      setId: '', 
      questions: [],
      questionsPerPage: 15,
      ansRowsPerPage: 23 
    }
  },
  computed: {

    paginatedQuestions() {
      let pages = [];
      let currentNum = 1;
      for (let i = 0; i < this.questions.length; i += this.questionsPerPage) {
        let pageQ = this.questions.slice(i, i + this.questionsPerPage);
        let mid = Math.ceil(pageQ.length / 2);
        pages.push([
          { startIndex: currentNum, questions: pageQ.slice(0, mid) },
          { startIndex: currentNum + mid, questions: pageQ.slice(mid) }
        ]);
        currentNum += pageQ.length;
      }
      return pages;
    },
   
    paginatedAnswers() {
      let pages = [];
      for (let i = 0; i < this.questions.length; i += this.ansRowsPerPage) {
        pages.push(this.questions.slice(i, i + this.ansRowsPerPage));
      }
      return pages;
    }
  },
  methods: {
    
    shuffle(array) {
      /* Fisher-Yates shuffle algorithm */
      /*
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
      */

      /* Shuffle using based important tag in json file*/

       // Group questions by importance
    const groups = {};

    array.forEach(item => {
        const priority = item.important_order ?? 0;

        if (!groups[priority]) {
            groups[priority] = [];
        }

        groups[priority].push(item);
    });

    // Shuffle inside each priority group
    Object.values(groups).forEach(group => {
        for (let i = group.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [group[i], group[j]] = [group[j], group[i]];
        }
    });

    // Merge groups from highest priority to lowest
    return Object.keys(groups)
        .map(Number)
        .sort((a, b) => b - a)
        .flatMap(priority => groups[priority]);


    },
    generateSetId() {
      return 'MS-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    },
    getLabel(index) {
      return `(${String.fromCharCode(97 + index)}) `;
    },
    async init() {
      const params = new URLSearchParams(window.location.search);
      const targetId = params.get('id');
      this.setId = this.generateSetId(); 

      try {
        const resMeta = await fetch('data.json');
        const allExams = await resMeta.json();
        const found = allExams.find(e => e.id == targetId);

        if (found) {
          this.examData = found;
          this.questionsPerPage = found.questionsPerPage || 15;
          const limit = found.totalQuestions || 40;

          const resQ = await fetch(`db/${this.examData.dbFile}`);
          let rawData = await resQ.json();
          
          let shuffledDb = this.shuffle([...rawData]);
          let selected = shuffledDb.slice(0, limit);

          this.questions = selected.map((q, idx) => {
            if (q.type === "saq") {
        return {
            ...q,
            displayNum: idx + 1,
            qid: q.qid
        };
    }
            const correctIdx = q.correct_option[0] - 1;
            const correctText = q.options[correctIdx];
            let shuffledOptions = this.shuffle([...q.options]);
            const newCorrectIdx = shuffledOptions.indexOf(correctText);

            return {
              ...q,
              options: shuffledOptions,
              ansLabel: this.getLabel(newCorrectIdx),
              displayNum: idx + 1,
              qid: q.qid 
            };
          });

          this.$nextTick(() => {
            if (window.MathJax) window.MathJax.typeset();
          });
        }
      } catch (e) { console.error(e); }
    }
  },
  mounted() { this.init(); }
}).mount('#app');