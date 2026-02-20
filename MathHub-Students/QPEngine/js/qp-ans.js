const { createApp } = Vue;

createApp({
  data() {
    return {
      examData: {},
      questions: [],
      questionsPerPage: 8, 
    };
  },
  computed: {
    paginatedQuestions() {
      let pages = [];
      let currentNum = 1;

      for (let i = 0; i < this.questions.length; i += this.questionsPerPage) {
        let pageQ = this.questions.slice(i, i + this.questionsPerPage);
        let mid = Math.ceil(pageQ.length / 2);

        let col1 = { startIndex: currentNum, questions: pageQ.slice(0, mid) };
        let col2 = {
          startIndex: currentNum + mid,
          questions: pageQ.slice(mid),
        };

        pages.push([col1, col2]);
        currentNum += pageQ.length;
      }
      return pages;
    },
  },
  methods: {
   
    isCorrect(question, optionIndex) {
      return question.correct_option.includes(optionIndex + 1);
    },
   
    getLabel(index) {
      return `(${String.fromCharCode(97 + index)})`;
    },
    async init() {
      const params = new URLSearchParams(window.location.search);
      const targetId = params.get("id");

      try {
       
        const resMeta = await fetch("data2.json");
        const allExams = await resMeta.json();
        const found = allExams.find((e) => e.id == targetId);

        if (found) {
          this.examData = found;
         
          this.questionsPerPage = found.questionsPerPage || 8; 
          
          const resQ = await fetch(`db/${this.examData.dbFile}`);
          this.questions = await resQ.json();

          this.$nextTick(() => {
            if (window.MathJax) window.MathJax.typeset();
          });
        }
      } catch (e) {
        console.error("Data Load Error", e);
      }
    },
  },
  mounted() {
    this.init();
  },
}).mount("#app");