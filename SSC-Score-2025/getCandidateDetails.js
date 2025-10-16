(function extractExamDetails() {
    // 1. Find the main outer table element based on its distinctive bgcolor
    const mainTable = document.querySelector('table[bgcolor="#D4CAB6"]');
    
    if (!mainTable) {
        console.error("❌ Error: The main table with bgcolor='#D4CAB6' was not found on the page.");
        return;
    }

    // 2. Navigate to the inner table containing the key-value pairs
    const innerTable = mainTable.querySelector('table');
    if (!innerTable) {
        console.error("❌ Error: The inner details table was not found.");
        return;
    }

    const details = {};
    const rows = innerTable.querySelectorAll('tr');

    // Helper function to clean the text (remove leading/trailing spaces and the ":   " separator)
    const cleanText = (text) => text.trim().replace(/^:\s*/, '').trim();

    // 3. Iterate over the rows to extract information
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        
        // Ensure we have at least a label cell (index 0) and a value cell (index 1)
        if (cells.length >= 2) {
            const labelCell = cells[0];
            const valueCell = cells[1];
            
            // Check if the label cell has the "bld" class to confirm it's a header
            if (labelCell.classList.contains('bld')) {
                // Get a cleaned, lowercase label to match against
                const label = cleanText(labelCell.textContent).toLowerCase().replace(/\s/g, ''); 
                let value = cleanText(valueCell.textContent);

                // Extracting details
                if (label.includes('rollno')) {
                    details.rollNo = value;
                } else if (label.includes('candidatename')) {
                    details.candidateName = value;
                } else if (label.includes('examlevel')) {
                    // For Exam Level/Name, the actual value is in the selected option of the dropdown
                    const selectElement = valueCell.querySelector('select');
                    if (selectElement) {
                        const selectedOption = selectElement.options[selectElement.selectedIndex];
                        details.examName = selectedOption ? cleanText(selectedOption.textContent) : value;
                    } else {
                        details.examName = value;
                    }
                } else if (label.includes('testdate')) {
                    details.testDate = value;
                } else if (label.includes('testtime') && label.includes('shift')) {
                    // Split the Test Time and Shift (e.g., "04:00 PM (Shift-3)")
                    details.testTimeAndShift = value; 
                    const match = value.match(/(\d{2}:\d{2}\sPM)\s+\((Shift-\d)\)/);
                    if (match) {
                        details.testTime = match[1];
                        details.shift = match[2];
                    } else {
                        details.shift = value; // Fallback
                    }
                }
            }
        }
    });

    // 4. Output the final extracted details
    console.log("✅ Successfully extracted Exam Details:");
    console.table(details);
    return details;

})();