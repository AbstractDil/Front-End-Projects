const { createApp } = Vue;

createApp({
    data() {
        return {
            examData: {},
            questions: [],
            questionsPerPage: 15 // ডিফল্ট ভ্যালু
        }
    },
    computed: {
        // পেজিনেশন লজিক যা কলাম অনুযায়ী প্রশ্ন ভাগ করবে
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
        // Fisher-Yates Shuffle অ্যালগরিদম
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
                // ১. data.json থেকে মেটাডাটা ফেচ করা
                const resMeta = await fetch('data.json');
                const allExams = await resMeta.json();
                const found = allExams.find(e => e.id == targetId);

                if (found) {
                    this.examData = found;
                    // ২. data.json থেকে কনফিগ লোড করা
                    this.questionsPerPage = found.questionsPerPage || 15;
                    const limit = found.totalQuestions || 40;

                    // ৩. মূল ডাটাবেস ফাইল ফেচ করা
                    const resQ = await fetch(`db/${this.examData.dbFile}`);
                    let allQuestions = await resQ.json();

                    // ৪. র‍্যান্ডমাইজেশন প্রসেস
                    // প্রথমে পুরো ডাটাবেস শাফেল করা
                    let shuffledDb = this.shuffle([...allQuestions]);
                    
                    // ৫. totalQuestions অনুযায়ী প্রশ্ন বেছে নেওয়া
                    let selectedQuestions = shuffledDb.slice(0, limit);

                    // ৬. প্রতিটি প্রশ্নের অপশনগুলোও শাফেল করা
                    this.questions = selectedQuestions.map(q => {
                        return {
                            ...q,
                            options: this.shuffle([...q.options])
                        };
                    });

                    // ৭. MathJax ট্রিগার করা
                    this.$nextTick(() => {
                        if (window.MathJax) window.MathJax.typeset();
                    });
                }
            } catch (e) {
                console.error("Initialization Failed:", e);
            }
        },
        getLabel(index) {
            return `(${String.fromCharCode(97 + index)}) `; // (a), (b), (c), (d)
        }
    },
    mounted() {
        this.init();
    }
}).mount('#app');