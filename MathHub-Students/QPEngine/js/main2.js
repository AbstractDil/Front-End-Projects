const { createApp } = Vue;

createApp({
    data() {
        return {
            examData: {},
            questions: [],
            questionsPerPage: 15 
        }
    },
    computed: {
        
        paginatedQuestions() {
            let pages = [];
            let currentNum = 1;

            for (let i = 0; i < this.questions.length; i += this.questionsPerPage) {
                let pageQ = this.questions.slice(i, i + this.questionsPerPage);
                let mid = Math.ceil(pageQ.length / 2);
                
                let col1 = { startIndex: currentNum, questions: pageQ.slice(0, mid) };
                let col2 = { startIndex: currentNum + mid, questions: pageQ.slice(mid) };

                pages.push([col1, col2]);
                currentNum += pageQ.length;
            }
            return pages;
        }
    },
    methods: {
        
        shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },

        async init() {
            const params = new URLSearchParams(window.location.search);
            const targetId = params.get('id');

            try {
              
                const resMeta = await fetch('data.json');
                const allExams = await resMeta.json();
                const found = allExams.find(e => e.id == targetId);

                if (found) {
                    this.examData = found;
                   
                    this.questionsPerPage = found.questionsPerPage || 15;
                    const limit = found.totalQuestions || 40;

                  
                    const resQ = await fetch(`db/${this.examData.dbFile}`);
                    let allQuestions = await resQ.json();

                
                    let shuffledDb = this.shuffle([...allQuestions]);
                    
             
                    let selectedQuestions = shuffledDb.slice(0, limit);

                  
                    this.questions = selectedQuestions.map(q => {
                        return {
                            ...q,
                            options: this.shuffle([...q.options])
                        };
                    });

                   
                    this.$nextTick(() => {
                        if (window.MathJax) window.MathJax.typeset();
                    });
                }
            } catch (e) {
                console.error("Initialization Failed:", e);
            }
        },
        getLabel(index) {
            return `(${String.fromCharCode(97 + index)}) `; 
        }
    },
    mounted() {
        this.init();
    }
}).mount('#app');