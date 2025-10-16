(function extractAndCalculateFullDetails_V2() {
    // --- Phase 1: Candidate and Exam Details Extraction ---
    
    const details = {};
    const cleanText = (text) => text.trim().replace(/^:\s*/, '').trim();

    // Find the main outer table element for candidate details by its unique bgcolor
    const mainDetailTable = document.querySelector('table[bgcolor="#D4CAB6"]');
    let candidateDetailsTable;
    
    if (mainDetailTable) {
        candidateDetailsTable = mainDetailTable.querySelector('table');
        if (candidateDetailsTable) {
            const rows = candidateDetailsTable.querySelectorAll('tr');

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2) {
                    const labelCell = cells[0];
                    const valueCell = cells[1];
                    
                    if (labelCell.classList.contains('bld')) {
                        const label = cleanText(labelCell.textContent).toLowerCase().replace(/\s/g, '');
                        let value = cleanText(valueCell.textContent);

                        if (label.includes('rollno')) {
                            details.RollNo = value;
                        } else if (label.includes('candidatename')) {
                            details.CandidateName = value;
                        } else if (label.includes('examlevel')) {
                            const selectElement = valueCell.querySelector('select');
                            details.ExamName = selectElement 
                                ? cleanText(selectElement.options[selectElement.selectedIndex].textContent) 
                                : value;
                        } else if (label.includes('testdate')) {
                            details.TestDate = value;
                        } else if (label.includes('testtime') && label.includes('shift')) {
                            details.TestShift = value;
                        } else if (label.includes('centre')) {
                            details.CentreName = value;
                        }
                    }
                }
            });
        }
    } else {
        console.warn("⚠️ Warning: Candidate details table (bgcolor='#D4CAB6') not found. Skipping personal details.");
    }

    // --- Phase 2: Score Calculation and Question Breakdown ---
    
    const MARKS_PER_RIGHT = 2;
    const NEGATIVE_MARKS = -0.5;

    let totalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let notAttemptedCount = 0;
    let totalQuestions = 0;
    let currentPart = 'Unknown Part'; 
    const questionResults = []; 
    const uniqueParts = new Set(); 

    // Find all potential section headers and question tables across the entire document
    const allElements = Array.from(document.querySelectorAll('span#lblsubject, table[bgcolor="#D4CAB6"]'));

    // The key improvement: Filter to ensure we only process question-answer tables.
    const filteredElements = allElements.filter(el => {
        if (el.id === 'lblsubject') return true; // Keep all part headers

        if (el.tagName === 'TABLE' && el.getAttribute('bgcolor') === '#D4CAB6') {
            // A question table must contain a "Q.No:" cell (font.tdtext)
            // AND must NOT contain a "Roll No." bold cell, which is unique to the candidate details table.
            const isQuestionTable = el.querySelector('font.tdtext') !== null;
            const isDetailsTable = el.querySelector('td.bld') !== null && el.textContent.includes('Roll No.');
            
            return isQuestionTable && !isDetailsTable;
        }
        return false;
    });

    if (filteredElements.length === 0) {
        console.warn("⚠️ Warning: No question-answer tables or part names found for score calculation.");
    }
    
    // Process the filtered elements in order
    filteredElements.forEach(element => {
        // --- A. Identify Part Name ---
        if (element.id === 'lblsubject') {
            currentPart = cleanText(element.textContent);
            uniqueParts.add(currentPart);
        }

        // --- B. Identify Question Table and Calculate Score ---
        if (element.tagName === 'TABLE') {
            totalQuestions++;
            let status = 'Not Attempted';
            let marksObtained = 0;
            
            const qNoElement = element.querySelector('font.tdtext');
            const qNoText = qNoElement ? qNoElement.textContent.trim() : 'Unknown';
            const qNo = qNoText.replace('Q.No:', '').trim();
            
            // Find the option status cells
            const optionCells = element.querySelectorAll('tr > td:first-child[width="2%"]');
            
            optionCells.forEach(cell => {
                const bgColor = cell.style.backgroundColor || cell.getAttribute('bgcolor');
                
                if (bgColor === 'green') {
                    status = 'Correct';
                    marksObtained = MARKS_PER_RIGHT;
                } else if (bgColor === 'red') {
                    status = 'Incorrect';
                    marksObtained = NEGATIVE_MARKS;
                } else if (bgColor === 'yellow') {
                    if (status === 'Not Attempted') {
                         status = 'Missed Correct Answer';
                         marksObtained = 0;
                    }
                }
            });

            // Update running totals
            totalScore += marksObtained;
            if (status === 'Correct') {
                correctCount++;
            } else if (status === 'Incorrect') {
                wrongCount++;
            } else if (status === 'Not Attempted' || status === 'Missed Correct Answer') {
                notAttemptedCount++;
            }
            
            // Store detailed result
            questionResults.push({
                'Part Name': currentPart,
                'Q.No': qNo,
                'Status': status,
                'Marks': marksObtained,
            });
        }
    });

    // --- Phase 3: Final Combined Output ---

    const scoreSummary = {
        'Total Questions': totalQuestions,
        'Correct Answers': correctCount,
        'Incorrect Answers': wrongCount,
        'Not Attempted/Missed': notAttemptedCount,
        'Marks per Correct Answer': MARKS_PER_RIGHT,
        'Negative Marking': NEGATIVE_MARKS,
        'Final Calculated Score': totalScore.toFixed(2)
    };
    
    const partsList = Array.from(uniqueParts);
    
    console.log("==========================================");
    console.log("👤 **Candidate & Exam Details** 📝");
    console.table(details);
    console.log("==========================================");

    console.log("📊 **Exam Score Calculation Summary** 📊");
    
    if (partsList.length > 0) {
        console.log("📚 **Parts Included:**");
        partsList.forEach((part, index) => {
            console.log(`\t${index + 1}. ${part}`);
        });
        console.log("\n");
    }

    console.table(scoreSummary);
    console.log("------------------------------------------");
    console.log("📋 **Detailed Question Breakdown** 📋");
    console.table(questionResults);
    console.log("------------------------------------------");
    
    return { details, scoreSummary, questionResults };
})();