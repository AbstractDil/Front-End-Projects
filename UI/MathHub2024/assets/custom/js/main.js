// App Header
const appHeader = Vue.createApp({
  data() {
    return {
      urls: [
        { id: 1, url: "home" },
        { id: 2, url: "about" },
        { id: 3, url: "registration" },
        { id: 4, url: "login" },
      ],

      app_header: {
        firstLine: "",
        secondLine: "",
        appLogoUrl: "",
        formattedDateTime: "",
        isMobile: window.innerWidth <= 767,
        loginText: "Login",
        loginLink: "/login.html", // Default login link
      },
      timer: null, // Timer reference for cleanup
      isRegistrationForm: false, // Tracks whether to show the registration form
      currentStep: 1, // Tracks the current registration step
      formData: {
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
      },
      emailExists: null, // Tracks email existence (null = not checked, true = exists, false = doesn't exist)
      errorMessage: "", // Holds error messages for display
    };
  },
  methods: {
    updateDateTime() {
      const options = {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      const currentDate = new Date();
      this.app_header.formattedDateTime = currentDate.toLocaleString(
        "en-US",
        options
      );
    },
    handleResize() {
      this.app_header.isMobile = window.innerWidth <= 767;
    },

    showRegForm() {
      this.isRegistrationForm = true; // Show registration form
      this.currentStep = 1; // Reset to first step
    },
    showLoginForm() {
      this.isRegistrationForm = false; // Show login form
    },

    goToStep(step) {
      this.errorMessage = ""; // Clear any previous error messages
      this.currentStep = step;
    },

    async validateEmail() {
      this.errorMessage = "";
      if (!this.formData.email) {
        this.errorMessage = "Email is required.";
        return;
      }

      // Simulate an API call
      const simulatedResponse = { exists: false }; // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay

      if (simulatedResponse.exists) {
        this.emailExists = true;
        this.errorMessage = "Email already exists. Please use a different email.";
      } else {
        this.emailExists = false;
        this.currentStep = 2; // Proceed to the next step
      }
    },

    validateNames() {
      if (!this.formData.firstName || !this.formData.lastName) {
        this.errorMessage = "Both First Name and Last Name are required.";
        return;
      }
      this.errorMessage = "";
      this.currentStep = 3; // Proceed to the last step
    },

    validatePassword() {
      if (!this.formData.password || !this.formData.confirmPassword) {
        this.errorMessage = "Both password fields are required.";
        return;
      }
      if (this.formData.password !== this.formData.confirmPassword) {
        this.errorMessage = "Passwords do not match.";
        return;
      }
      this.errorMessage = "";
      alert("Registration successful!");
      // Reset form
      this.showLoginForm();
      this.formData = {
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
      };
    },
  },
  async mounted() {
    try {
      // Fetch configuration from config.json
      const response = await fetch("assets/custom/js/config.json");
      const config = await response.json();
      this.app_header.firstLine = config.app_firstname;
      this.app_header.secondLine = config.app_lastname;
      this.app_header.appLogoUrl = config.app_logo_url;

      // Start the timer for date-time updates
      this.updateDateTime(); // Initial call
      this.timer = setInterval(this.updateDateTime, 1000);

      // Add resize listener
      window.addEventListener("resize", this.handleResize);
      this.handleResize(); // Initial resize check
    } catch (error) {
      console.error("Error fetching config.json:", error);
    }
  },
  beforeUnmount() {
    // Clear the timer and remove listeners
    clearInterval(this.timer);
    window.removeEventListener("resize", this.handleResize);
  },
});

// App Footer

const appFooter = Vue.createApp({
  data() {
    return {
      app_footer: {
        developer_name: "Sagar Nandy",
        developer_profile: "https://nandysagar.in/",
        app_name: "",
      },

      currentYear: "",
      sections: [
        {
          name: "Official Links",
          links: [
            { label: "SSC New Portal", url: "https://ssc.gov.in/" },
            { label: "WBPSC Portal 1", url: "https://psc.wb.gov.in/" },
            { label: "WBPSC Portal 2", url: "https://wbpsc.ucanapply.com/" },
            { label: "Railway - RRB", url: "https://rrbapply.gov.in/" },
          ],
        },
        {
          name: "Free Mocks",
          links: [
            { label: "iMOES Mock", url: "https://imoes.nandysagar.in/" },
            { label: "RBE Mock", url: "https://rbelearning.com/" },
            { label: "Parmar SSC Mock", url: "https://www.parmaracademy.in/" },
            { label: "Test Ranker Mock", url: "https://www.testranker.com/" },
            { label: "Testbook Mock", url: "https://www.testbook.com/" },
            { label: "Olive Board Mock", url: "https://www.oliveboard.in/" },
          ],
        },

        {
          name: "Site Links",
          links: [
            { label: "Home", url: "/" },
            { label: "Registration", url: "/registration" },
            { label: "Login", url: "/login" },
            { label: "Contact", url: "/contact" },
            { label: "About", url: "/about" },
            { label: "Careers", url: "/careers" },
          ],
        },
      ],
    };
  },

  methods: {
    getCurrentYear() {
      const year = new Date().getFullYear();
      console.log(year);
      this.currentYear = year;
    },
  },
  created() {
    this.getCurrentYear(); // Call the method when the component is created
  },

  async mounted() {
    try {
      // Fetch configuration from config.json
      const response = await fetch("assets/custom/js/config.json");
      const config = await response.json();
      this.app_footer.developer_name = config.app_developer_name;
      this.app_footer.developer_profile = config.app_developer_profile;
      this.app_footer.app_name = config.app_name;
    } catch (error) {
      console.error("Error fetching config.json:", error);
    }
  },
});

// Mount App Header the Vue app
appHeader.mount("#appHeader");
// Mount App Footer the Vue app
appFooter.mount("#appFooter");