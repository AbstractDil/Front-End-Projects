 document.addEventListener("DOMContentLoaded", function() {
            const toggleButton = document.getElementById('mode-toggle');
            const modeIcon = document.getElementById('mode-icon');
            const body = document.body;

            // Check for saved theme in localStorage
            const savedTheme = localStorage.getItem('theme');

            // Function to set the theme
            function setTheme(theme) {
                if (theme === 'dark') {
                    body.classList.add('dark-mode');
                    modeIcon.classList.remove('fa-sun');
                    modeIcon.classList.add('fa-moon');
                } else {
                    body.classList.remove('dark-mode');
                    modeIcon.classList.remove('fa-moon');
                    modeIcon.classList.add('fa-sun');
                }
                localStorage.setItem('theme', theme);
            }

            // Set default theme to dark if no theme is saved
            if (!savedTheme) {
                setTheme('dark');
            } else {
                setTheme(savedTheme);
            }

            // Toggle theme on button click
            toggleButton.addEventListener('click', () => {
                const currentTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
                setTheme(currentTheme);
            });
        });