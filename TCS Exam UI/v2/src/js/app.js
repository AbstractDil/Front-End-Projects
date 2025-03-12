const { createApp } = Vue;

createApp({
    data() {
        return {
            isDropdownOpen: false,
        };
    },
    methods: {
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        openFullscreen() {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
              } else if (document.documentElement.mozRequestFullScreen) {
                /* Firefox */
                document.documentElement.mozRequestFullScreen();
              } else if (document.documentElement.webkitRequestFullscreen) {
                /* Chrome, Safari and Opera */
                document.documentElement.webkitRequestFullscreen();
              } else if (document.documentElement.msRequestFullscreen) {
                /* IE/Edge */
                document.documentElement.msRequestFullscreen();
              }
        },
        closeFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
              } else if (document.mozCancelFullScreen) {
                /* Firefox */
                document.mozCancelFullScreen();
              } else if (document.webkitExitFullscreen) {
                /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
              } else if (document.msExitFullscreen) {
                /* IE/Edge */
                document.msExitFullscreen();
              }
        },
    },
}).mount('#app');