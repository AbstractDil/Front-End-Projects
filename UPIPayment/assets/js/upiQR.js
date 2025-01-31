 // Show the modal on page load
 window.addEventListener('DOMContentLoaded', (event) => {
    const myModal = new bootstrap.Modal(document.getElementById('instructionsModal'));
    myModal.show();
});

Vue.createApp({
    data() {
        return {
            upiId: '',
            name: '',
            transactionNote: '',
            amount: '',
            qrCodeData: null,
            loading: false,
            errors: {}
        };
    },
    methods: {
        validateForm() {
            this.errors = {};
            const upiPattern = /^[0-9a-z@.-]{10,50}$/i;
            const namePattern = /^.{3,}$/;
            const transactionNotePattern = /^[a-zA-Z0-9-.?!]{5,}$/;
            
            if (!upiPattern.test(this.upiId)) {
                this.errors.upiId = "UPI ID must be 10-50 characters long and can include 0-9, a-z, @, ., -";
            }
            if (!namePattern.test(this.name)) {
                this.errors.name = "Name must be at least 3 characters long.";
            }
            if (this.transactionNote && !transactionNotePattern.test(this.transactionNote)) {
                this.errors.transactionNote = "Transaction note must be at least 5 characters long and contain only a-z, A-Z, 0-9, -, ., ?, !";
            }
            if (!this.amount || isNaN(this.amount) || this.amount <= 0) {
                this.errors.amount = "Please enter a valid amount.";
            }
            
            if (Object.keys(this.errors).length === 0) {
                this.generateQrCode();
            }
        },
        generateQrCode() {
            this.loading = true;
            setTimeout(() => {
                const upiLinkId = `upi://pay?pa=${this.upiId}&pn=${this.name}&tn=${this.transactionNote}&am=${this.amount}&cu=INR`;
                const qrCodeContainer = document.getElementById('qr-code-container');
                qrCodeContainer.innerHTML = '';
                new QRCode(qrCodeContainer, {
                    text: upiLinkId,
                    width: 200,
                    height: 200,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
                this.qrCodeData = upiLinkId;
                this.loading = false;
                this.successMessage = " Your payment QR code has been generated successfully!";
            },1500);
        },
        convertToWords(num) {
            const a = [
                "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
                "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"
            ];
            const b = [
                "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
            ];
            if (num === 0) return "zero";
            if (num < 20) return a[num];
            if (num < 100) return b[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + a[num % 10] : "");
            if (num < 1000) return a[Math.floor(num / 100)] + " hundred" + (num % 100 !== 0 ? " and " + this.convertToWords(num % 100) : "");
            if (num < 100000) return this.convertToWords(Math.floor(num / 1000)) + " thousand" + (num % 1000 !== 0 ? " " + this.convertToWords(num % 1000) : "");
            return num;
        }
    }
}).mount('#app');