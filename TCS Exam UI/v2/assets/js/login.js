/**
 * login.js
 * Alpine.js component handling professional light examination layout
 */

document.addEventListener('alpine:init', () => {
    Alpine.data('loginComponent', () => ({
        password: '', 
        candidate_id: '202605191112', 
        errorMessage: '', 
        showError: false,
        
        // Keyboard state controls
        isUpperCase: false,
        showSpecialChars: false,

        // Core row maps
        rows: {
            letters: [
                ['q','w','e','r','t','y','u','i','o','p'],
                ['a','s','d','f','g','h','j','k','l'],
                ['z','x','c','v','b','n','m']
            ],
            special: [
                ['!','@','#','$','%','^','&','*','(',')'],
                ['-','_','+','=','{','}','[',']','|','\\'],
                [':',';','"','\'','<','>',',','.','?','/']
            ]
        },
        
        // Virtual Keyboard Operations
        appendKey(char) {
            // Apply casing shift if symbol layout is not open
            if (!this.showSpecialChars) {
                this.password += this.isUpperCase ? char.toUpperCase() : char.toLowerCase();
            } else {
                this.password += char;
            }
        },
        toggleCaps() {
            this.isUpperCase = !this.isUpperCase;
        },
        toggleSpecial() {
            this.showSpecialChars = !this.showSpecialChars;
        },
        clearPassword() {
            this.password = '';
        },
        backspace() {
            this.password = this.password.slice(0, -1);
        },
        
        // Form Validation Engine
        validateForm(e) {
            e.preventDefault();
            if (!this.password.trim()) {
                this.errorMessage = 'Password cannot be blank.';
                this.showError = true;
                return;
            }
            if (this.password !== 'password123') {
                this.errorMessage = 'Invalid password credentials. Please try again.';
                this.showError = true;
                return;
            }
            this.showError = false;
            alert('Form Submitted Successfully!');
        }
    }));
});