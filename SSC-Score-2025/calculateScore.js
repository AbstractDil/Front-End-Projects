(function calculateExamScoreWithUniquePartNames() {
    // Scoring constants
    const MARKS_PER_RIGHT = 2;
    const NEGATIVE_MARKS = -0.5;

    let totalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let notAttemptedCount = 0;
    let totalQuestions = 0;
    let currentPart = 'Unknown Part'; 
    const questionResults = []; 
    const uniqueParts = new Set(); // To store unique part names

    // Helper function to clean the text (remove leading/trailing spaces)
    const cleanText = (text) => text.trim();

    // 1. Get all elements that could be a Part Name or a Question Table
    const mainContainer = document.body;
    const allElements = Array.from(mainContainer.querySelectorAll('span#lblsubject, table[bgcolor="#D4CAB6"]'));

    if (allElements.length === 0) {
        console.error("❌ Error: No subject part names or question tables found using the expected structure.");
        return;
    }

    // 2. Iterate through all elements to track the Part Name and process Questions
    allElements.forEach(element => {
        // --- A. Identify Part Name ---
        if (element.id === 'lblsubject') {
            // Found a new Part Name
            currentPart = cleanText(element.textContent);
            uniqueParts.add(currentPart); // Add to the Set for unique list
        }

        // --- B. Identify Question Table and Calculate Score ---
        if (element.tagName === 'TABLE' && element.getAttribute('bgcolor') === '#D4CAB6' && element.querySelector('font.tdtext')) {
            totalQuestions++;
            let status = 'Not Attempted';
            
            const questionNumberElement = element.querySelector('font.tdtext');
            const qNoText = questionNumberElement ? questionNumberElement.textContent.trim() : `Unknown`;
            const qNo = qNoText.replace('Q.No:', '').trim();
            
            let marksObtained = 0;

            // Find the option status cells (the narrow column on the left)
            const optionCells = element.querySelectorAll('tr > td:first-child[width="2%"]');
            
            // Determine the status of the attempt based on color codes
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
            
            // Store detailed result for the array output (including Part Name for the breakdown table)
            questionResults.push({
                'Part Name': currentPart,
                'Q.No': qNo,
                'Status': status,
                'Marks': marksObtained,
            });
        }
    });

    // 3. Prepare Summary Output
    const summary = {
        'Total Questions': totalQuestions,
        'Correct Answers': correctCount,
        'Incorrect Answers': wrongCount,
        'Not Attempted/Missed': notAttemptedCount,
        'Marks per Correct Answer': MARKS_PER_RIGHT,
        'Negative Marking': NEGATIVE_MARKS,
        'Final Calculated Score': totalScore.toFixed(2)
    };
    
    const partsList = Array.from(uniqueParts);

    // 4. Output the final summary and detailed results
    console.log("------------------------------------------");
    console.log("📊 **Exam Score Calculation Summary** 📊");
    
    // Display Part Names ONCE
    console.log("📚 **Parts Included:**");
    partsList.forEach((part, index) => {
        console.log(`\t${index + 1}. ${part}`);
    });
    console.log("\n"); // Add a blank line for separation

    console.table(summary);
    console.log("------------------------------------------");
    console.log("📋 **Detailed Question Breakdown** 📋");
    console.table(questionResults);
    console.log("------------------------------------------");
    
    return { summary, details: questionResults };
})();