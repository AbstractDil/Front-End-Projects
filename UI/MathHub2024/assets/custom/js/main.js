const app = Vue.createApp({
    data() {
        return {
        app_settings: {
          firstLine: "",
          secondLine: "",
          appLogoUrl: "",
        }
    }
      },
      async mounted() {
        try {
          const response = await fetch('assets/custom/js/config.json');
          const config = await response.json(); // Parse JSON response
    
          // Extract and set data from config
          this.app_settings.firstLine = config.app_firstname;
          this.app_settings.secondLine = config.app_lastname;
          this.app_settings.appLogoUrl = config.app_logo_url;
        } catch (error) {
          console.error('Error fetching config.json:', error);
        }
      }

    });
   
app.mount('#mathhubApp')
 