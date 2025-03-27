const themeToggle = document.getElementById('themeToggle');

    // Function to set the theme
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme); // Store the theme in localStorage
    }

    // Function to get the current theme from localStorage
    function getStoredTheme() {
        return localStorage.getItem('theme');
    }

    // Function to initialize the theme
    function initializeTheme() {
        const storedTheme = getStoredTheme();
        if (storedTheme) {
            setTheme(storedTheme);
            if(storedTheme === 'dracula'){
                themeToggle.checked = true;
            } else {
                themeToggle.checked = false;
            }
        } else {
            // Set a default theme if none is stored
            setTheme('light'); // Or any default theme you prefer
            themeToggle.checked = false;
        }
    }

    // Initialize the theme on page load
    initializeTheme();

    // Event listener for theme toggle change
    themeToggle.addEventListener('change', (event) => {
        if (event.target.checked) {
            setTheme('dracula'); // Or your dark theme name
        } else {
            setTheme('light'); // Or your light theme name
        }
    });