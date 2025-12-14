
/************************************ 
* Vue CLI Configuration File
*
* This file is used to configure various settings for a Vue.js project
*
*********************************************
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
  
*/


const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/2024/iFriendShipApp/' 
 
})
