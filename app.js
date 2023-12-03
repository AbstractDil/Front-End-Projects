
Vue.createApp({

    data(){
        return {
           
             navElement:[
                {
                    link : {text: 'Home', url : 'index.html'},
                    pageTitle : 'Home - Welcome to NANDYSAGAR.IN',

                },
                {
                    link : {text: 'About', url : 'about.html'},
                    pageTitle : 'About - Welcome to NANDYSAGAR.IN',

                }
             ]

        }
    }

}).mount("#nsApp");