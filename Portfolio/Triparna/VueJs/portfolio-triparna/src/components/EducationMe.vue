<template>
   <div class="d-flex flex-column flex-md-row p-4 gap-4 py-md-5 align-items-center justify-content-center">
  <div class="list-group">
    <a href="javascript:void(0)" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true" v-for="degree in degrees" :key="degree.id">
        <img src="../assets/img/education.png" alt="twbs" width="38" height="38" class="rounded-circle flex-shrink-0">
      <div class="d-flex gap-2 w-100 justify-content-between">
        <div>
          <h6 class="mb-0">{{degree.degree}}</h6>
          <p class="mb-0 opacity-75">{{degree.inst}}</p>
        </div>
        <small class="opacity-50 text-nowrap">{{degree.pyear}}</small>
      </div>
    </a>
   
  </div>
</div>
</template>

<script>
    export default {
        components : "EducationMe",
        data(){
        return{
          degrees : [
            {id:1,  degree: 'M.Sc in Mathematics', inst: 'Murshidabad University', pyear: '2021-2023'},
            {id :2 ,  degree: 'B.Sc in Mathematics', inst: 'Santipur College under University of kalyani', pyear: '2018-2021'},
            {id :3 ,  degree: 'Higher Secondary', inst: 'Sarat Kumari Girls High School', pyear: '2017-2018'},
            {id :4,  degree: 'Secondary Education', inst: 'Sarat Kumari Girls High School', pyear: '2015-2016'},
    
          ],
         // isDark : false
        }
    },
  }
</script>

<style lang="scss" scoped>

</style>