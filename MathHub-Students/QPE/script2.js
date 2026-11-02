/* MathSquadz Question Paper Engine
 *
 * URL example:
 *   index.html?folder=02112026
 *   index.html?folder=02112026&qpp=6
 *   index.html?folder=02112026&set=4821
 * 
 * Each exam folder contains:
 *   data.json
 *   qMarks1MCQ.json
 *   qMarks2SAQ.json
 *   qMarks5LAQ.json
 *
 * qid is mandatory and must be unique across all question-bank files
 * used by the same examination.
 */

const { createApp } = Vue;

const QuestionNode = {
  name: "QuestionNode",
  props: {
    node: { type: Object, required: true },
    depth: { type: Number, default: 1 },
    label: { type: String, default: "" },
    showMarks: { type: Boolean, default: true }
  },
  methods: {
    childLabel(index) {
      return this.node.children?.[index]?.label || this.makeLabel(index, this.depth);
    },
    makeLabel(index, depth) {
      if (depth % 3 === 0) return String(index + 1);
      if (depth % 3 === 1) return this.toAlpha(index);
      return this.toRoman(index + 1);
    },
    toAlpha(index) {
      let value = index + 1, result = "";
      while (value > 0) {
        value--;
        result = String.fromCharCode(97 + (value % 26)) + result;
        value = Math.floor(value / 26);
      }
      return result;
    },
    toRoman(number) {
      const values = [
        [1000, "m"], [900, "cm"], [500, "d"], [400, "cd"],
        [100, "c"], [90, "xc"], [50, "l"], [40, "xl"],
        [10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"]
      ];
      let result = "";
      for (const [value, symbol] of values) {
        while (number >= value) {
          result += symbol;
          number -= value;
        }
      }
      return result;
    }
  },
  template: `
    <div class="nested-question">
      <div class="question-line">
        <span class="question-label">({{ label }})</span>
        <span class="question-text" v-html="node.q || ''"></span>
        <span class="marks" v-if="showMarks && node.marks != null">({{ node.marks }})</span>
      </div>
      <question-node
        v-for="(child, index) in (node.children || [])"
        :key="child.qid || child.label || index"
        :node="child"
        :depth="depth + 1"
        :label="child.label || childLabel(index)"
        :show-marks="showMarks">
      </question-node>
    </div>
  `
};

/* One unit of the paper: the header, a main-question heading, or one question.
 * A "question" block is never split across pages. */
const PaperBlock = {
  name: "PaperBlock",
  components: { QuestionNode },
  props: {
    block: { type: Object, required: true },
    exam: { type: Object, default: () => ({}) },
    showMarks: { type: Boolean, default: true }
  },
  methods: {
    alpha(index) { return String.fromCharCode(97 + (index % 26)); },
    optionLabel(index) { return `(${String.fromCharCode(97 + index)})`; },
    roman(number) {
      const values = [[10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"]];
      let result = "";
      for (const [value, symbol] of values) {
        while (number >= value) { result += symbol; number -= value; }
      }
      return result;
    }
  },
  template: `
    <div>
      <template v-if="block.type === 'header'">
        <header class="exam-header">
          <div class="logo-area"><img src="images/logo.png" alt="Logo" /></div>
          <div class="header-info">
            <h2>{{ exam.examName }}</h2>
            <p>Subject: {{ exam.subject }} | Class: {{ exam.class }}</p>
            <p>Full Marks: {{ exam.fullMarks }} | Time: {{ exam.time }} |
               Set: {{ exam.questionSet || 'A' }}</p>
          </div>
        </header>
        <div class="instructions" v-if="exam.instructions && exam.instructions.length">
          <b>নির্দেশাবলি:</b>
          <ol><li v-for="(ins, i) in exam.instructions" :key="i">{{ ins }}</li></ol>
        </div>
      </template>

      <div v-else-if="block.type === 'heading'">
        <div class="main-question-heading">
          <span class="main-number">{{ block.section.number }}.</span>
          <span class="main-title">{{ block.section.title }}
            <span class="choice-note" v-if="block.section.choiceNote"> ({{ block.section.choiceNote }})</span>
          </span>
          <span class="main-total" v-if="block.section.hasChoice">
            ({{ block.section.marksEach }} × {{ block.section.attempt }}) = {{ block.section.totalMarks }}
          </span>
          <span class="main-total" v-else>({{ block.section.totalMarks }})</span>
        </div>
      </div>

      <div v-else class="question-item">
        <div class="question-line">
          <span class="question-label">{{ alpha(block.index) }}.</span>
          <span class="question-text" v-html="block.question.q"></span>
          <span class="marks" v-if="showMarks && block.question.marks != null">({{ block.question.marks }})</span>
        </div>
        <div class="options" v-if="block.section.type === 'MCQ'">
          <div class="option" v-for="(option, oi) in block.question.displayOptions" :key="oi">
            <span class="option-label">{{ optionLabel(oi) }}</span>
            <span v-html="option.text"></span>
          </div>
        </div>
        <question-node
          v-for="(child, ci) in (block.question.children || [])"
          :key="child.qid || child.label || ci"
          :node="child"
          :depth="1"
          :label="child.label || roman(ci + 1)"
          :show-marks="showMarks">
        </question-node>
      </div>
    </div>
  `
};

createApp({
  components: { QuestionNode, PaperBlock },

  data() {
    return {
      loading: true,
      loaded: false,
      error: "",
      examData: {},
      settings: {},
      layout: { autoFit: true, questionsPerPage: 0, footerReserveMm: 14, safetyMm: 4 },
      blocks: [],
      pages: [],
      measuring: false,
      paperSections: [],
      answerKey: [],
      usedQids: new Set()
    };
  },

  methods: {
    getLabel(index, depth = 0) {
      if (depth % 3 === 0) return this.toAlpha(index);
      if (depth % 3 === 1) return this.toRoman(index + 1);
      return String(index + 1);
    },

    toAlpha(index) {
      let value = index + 1;
      let result = "";
      while (value > 0) {
        value--;
        result = String.fromCharCode(97 + (value % 26)) + result;
        value = Math.floor(value / 26);
      }
      return result;
    },

    toRoman(number) {
      const values = [
        [1000, "m"], [900, "cm"], [500, "d"], [400, "cd"],
        [100, "c"], [90, "xc"], [50, "l"], [40, "xl"],
        [10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"]
      ];
      let result = "";
      for (const [value, symbol] of values) {
        while (number >= value) {
          result += symbol;
          number -= value;
        }
      }
      return result;
    },

    getOptionLabel(index) {
      return `(${String.fromCharCode(97 + index)})`;
    },

    showMarks(question) {
      return this.settings.showMarks !== false && question.marks != null;
    },

    shuffle(array) {
      const copy = [...array];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    },

    async fetchJson(url) {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Could not load ${url} (HTTP ${response.status}).`);
      }
      return response.json();
    },

    normalizeCorrectOptions(correctOption) {
      if (Array.isArray(correctOption)) return correctOption.map(Number);
      if (correctOption === undefined || correctOption === null) return [];
      return [Number(correctOption)];
    },

    prepareMcq(question, section, displayNumber) {
      const originalOptions = Array.isArray(question.options) ? question.options : [];
      if (originalOptions.length < 2) {
        throw new Error(`MCQ ${question.qid} must contain an options array.`);
      }

      const correctIndexes = this.normalizeCorrectOptions(question.correct_option);
      const optionObjects = originalOptions.map((text, originalIndex) => ({
        text,
        originalIndex
      }));

      const shouldShuffle = this.settings.shuffleOptions !== false;
      const displayed = shouldShuffle ? this.shuffle(optionObjects) : optionObjects;

      const answerLabels = correctIndexes.map(originalIndex => {
        const displayedIndex = displayed.findIndex(
          option => option.originalIndex === originalIndex
        );
        if (displayedIndex < 0) {
          throw new Error(`Invalid correct_option index in MCQ ${question.qid}.`);
        }
        return this.getOptionLabel(displayedIndex);
      });

      this.answerKey.push({
        qid: question.qid,
        displayNumber,
        answer: answerLabels.join(", ") || "Not provided"
      });

      return {
        ...question,
        marks: question.marks ?? section.marksEach,
        displayOptions: displayed
      };
    },

    async init() {
      try {
        const params = new URLSearchParams(window.location.search);
        const folder = params.get("folder") || params.get("date") || "02112026";
        const folderPath = folder.replace(/^\/+|\/+$/g, "");

        if (folderPath.includes("..")) {
          throw new Error("Invalid examination folder name.");
        }

        const dataUrl = `${folderPath}/data.json`;
        this.examData = await this.fetchJson(dataUrl);
        this.settings = this.examData.settings || {};

        // Random Question Set ID (3 or 4 digits). Fixed with ?set=1234 in the URL.
      const setParam = params.get("set");
      if (setParam) {
        this.examData.questionSet = setParam;
      } else {
        const cfg = this.examData.setIdDigits;            // 3, 4 or "any" (data.json)
        const digits = cfg === "any" ? (Math.random() < 0.5 ? 3 : 4) : (Number(cfg) === 3 ? 3 : 4);
        const min = Math.pow(10, digits - 1);
        const max = Math.pow(10, digits) - 1;
        this.examData.questionSet = String(Math.floor(Math.random() * (max - min + 1)) + min);
      }

        if (!Array.isArray(this.examData.paperStructure) ||
            this.examData.paperStructure.length === 0) {
          throw new Error("data.json must contain a non-empty paperStructure array.");
        }

        const bankFiles = this.examData.questionFiles || {};
        const bankCache = {};

        // Load each bank file only once, even if it is used by more than one section.
        const requestedFiles = new Set();
        for (const section of this.examData.paperStructure) {
          const file = section.bankFile || bankFiles[section.type];
          if (!file) {
            throw new Error(
              `No bankFile/questionFiles entry found for main question ${section.number} (${section.type}).`
            );
          }
          requestedFiles.add(file);
        }

        await Promise.all([...requestedFiles].map(async file => {
          const data = await this.fetchJson(`${folderPath}/${file}`);
          if (!Array.isArray(data)) {
            throw new Error(`${file} must contain a JSON array of questions.`);
          }

          const localIds = new Set();
          for (const question of data) {
            if (!question.qid || typeof question.qid !== "string") {
              throw new Error(`Every question in ${file} must have a non-empty string qid.`);
            }
            if (localIds.has(question.qid)) {
              throw new Error(`Duplicate qid "${question.qid}" found inside ${file}.`);
            }
            localIds.add(question.qid);
          }
          bankCache[file] = data;
        }));

        this.paperSections = [];
        this.answerKey = [];
        this.usedQids = new Set();

        let calculatedTotal = 0;

        for (const section of this.examData.paperStructure) {
          const bankFile = section.bankFile || bankFiles[section.type];
          // noOfVisibleQuestions = how many questions are printed (overrides count).
          const count = Number(section.noOfVisibleQuestions ?? section.count);
          const marksEach = Number(section.marksEach);

          if (!Number.isInteger(count) || count < 1) {
            throw new Error(`Main question ${section.number}: count must be a positive integer.`);
          }
          if (!Number.isFinite(marksEach) || marksEach <= 0) {
            throw new Error(`Main question ${section.number}: marksEach must be greater than zero.`);
          }

          const bank = bankCache[bankFile];
          const candidates = bank.filter(question => {
            const questionMarks = question.marks ?? marksEach;
            return Number(questionMarks) === marksEach && !this.usedQids.has(question.qid);
          });

          if (candidates.length < count) {
            throw new Error(
              `Not enough questions for main question ${section.number}.\n` +
              `File: ${bankFile}\n` +
              `Required: ${count}\n` +
              `Available (after duplicate exclusion): ${candidates.length}\n\n` +
              `Please add more questions or reduce the requested count.`
            );
          }

          const selected = this.shuffle(candidates).slice(0, count);
          const preparedQuestions = [];

          selected.forEach((question, index) => {
            this.usedQids.add(question.qid);
            const displayNumber = `${section.number}.${this.getLabel(index, 0)}`;

            if (section.type === "MCQ") {
              preparedQuestions.push(
                this.prepareMcq(question, section, displayNumber)
              );
            } else {
              preparedQuestions.push({
                ...question,
                marks: question.marks ?? marksEach,
                children: question.children || []
              });
            }
          });

          const sectionMarks = preparedQuestions.reduce(
            (sum, question) => sum + this.getQuestionMarks(question),
            0
          );

          const expectedMarks = count * marksEach;
          if (sectionMarks !== expectedMarks) {
            throw new Error(
              `Marks mismatch in main question ${section.number}. ` +
              `Expected ${expectedMarks}, calculated ${sectionMarks}.`
            );
          }

          // "Answer any N": `attempt` questions count towards the total.
          const attempt = section.attempt === undefined ? count : Number(section.attempt);
          if (!Number.isInteger(attempt) || attempt < 1 || attempt > count) {
            throw new Error(
              `Main question ${section.number}: attempt must be a whole number between 1 and count (${count}).`
            );
          }
          const countedMarks = attempt * marksEach;
          const hasChoice = attempt < count;

          calculatedTotal += countedMarks;
          this.paperSections.push({
            ...section,
            bankFile,
            questions: preparedQuestions,
            attempt,
            hasChoice,
            marksEach,
            totalMarks: countedMarks,
            choiceNote: hasChoice
              ? (section.attemptText || `যে-কোনো ${attempt}টি`)
              : ""
          });
        }

        if (Number(this.examData.fullMarks) !== calculatedTotal) {
          throw new Error(
            `Full marks validation failed.\n` +
            `data.json fullMarks: ${this.examData.fullMarks}\n` +
            `Selected questions total: ${calculatedTotal}\n\n` +
            `Please correct fullMarks or paperStructure.`
          );
        }

        // Layout settings: data.json "layout", optionally overridden by ?qpp=6
        this.layout = { ...this.layout, ...(this.examData.layout || {}) };
        const qppParam = params.get("qpp");
        if (qppParam !== null) this.layout.questionsPerPage = Number(qppParam) || 0;

        this.loading = false;
        this.loaded = true;
        await this.repaginate();
      } catch (error) {
        console.error(error);
        this.loading = false;
        this.error = error.message || "An unknown error occurred.";
      }
    },

    getQuestionMarks(question) {
      if (Array.isArray(question.children) && question.children.length) {
        return question.children.reduce(
          (sum, child) => sum + this.getQuestionMarks(child), 0
        );
      }
      return Number(question.marks || 0);
    },

    async typesetMath(el) {
      try {
        if (window.MathJax && window.MathJax.startup && window.MathJax.startup.promise) {
          await window.MathJax.startup.promise;
        }
        if (window.MathJax && window.MathJax.typesetPromise) {
          await window.MathJax.typesetPromise(el ? [el] : undefined);
        }
      } catch (error) {
        console.error(error);
      }
    },

    buildBlocks() {
      const blocks = [{ type: "header" }];
      for (const section of this.paperSections) {
        blocks.push({ type: "heading", section });
        section.questions.forEach((question, index) => {
          blocks.push({ type: "question", section, question, index });
        });
      }
      return blocks;
    },

    // Measure everything off-screen, then split into A4 pages.
    async repaginate() {
      this.blocks = this.buildBlocks();
      this.measuring = true;
      await this.$nextTick();

      const measure = this.$refs.measure;
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      if (measure) {
        const imgs = [...measure.querySelectorAll("img")];
        await Promise.all(imgs.map(img => img.complete ? null :
          new Promise(resolve => { img.onload = img.onerror = resolve; })));
        await this.typesetMath(measure);
      }

      this.pages = this.paginate();
      this.measuring = false;
      await this.$nextTick();
      await this.typesetMath();
    },

    paginate() {
      const measure = this.$refs.measure;
      const blockEls = measure ? [...measure.querySelectorAll(".blk")] : [];
      const heights = blockEls.map(el => el.getBoundingClientRect().height);
      const miniEl = this.$refs.miniHeader;
      const miniHeight = miniEl ? miniEl.getBoundingClientRect().height + 10 : 0;

      const L = this.layout;
      const mm = 96 / 25.4;
      const available = (297 - 24 - Number(L.footerReserveMm ?? 14) - Number(L.safetyMm ?? 4)) * mm;
      const autoFit = L.autoFit !== false;
      const globalLimit = Number(L.questionsPerPage) || 0;

      // Max questions allowed on one page for a given section.
      const limitFor = section => Number(section.questionsPerPage) || globalLimit;

      const pages = [];
      let current = [];
      let used = 0;
      let qCount = 0;

      const startNewPage = () => {
        if (current.length) pages.push(current);
        current = [];
        used = miniHeight;
        qCount = 0;
      };

      this.blocks.forEach((block, i) => {
        const h = heights[i] || 0;
        let needed = h;
        let forceBreak = false;
        const hasContent = current.some(b => b.type !== "header");

        if (block.type === "heading") {
          // Keep heading together with its first question.
          const next = this.blocks[i + 1];
          if (next) needed += heights[i + 1] || 0;
          if (block.section.pageBreakBefore && hasContent) forceBreak = true;
          const lim = limitFor(block.section);
          if (lim && qCount >= lim && hasContent) forceBreak = true;
        } else if (block.type === "question") {
          const lim = limitFor(block.section);
          if (lim && qCount >= lim) forceBreak = true;
        }

        const overflow = autoFit && used + needed > available;
        if (current.length && (forceBreak || overflow)) startNewPage();

        current.push(block);
        used += h;
        if (block.type === "question") qCount++;
      });

      if (current.length) pages.push(current);
      return pages;
    },

    reloadPage() {
      window.location.reload();
    },

    printPaper() {
      this.typesetMath();
      setTimeout(() => window.print(), 250);
    }
  },

  mounted() {
    this.init();
  }
}).mount("#app");