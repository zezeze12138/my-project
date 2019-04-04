<template>
    <Main></Main>
</template>

<script>

  import Main from "./HomePage/Main/main";
  export default {
    components: {Main},
    name: "index",
    data () {
      return {
        parentName:"首页",
        childName:null
      }
    },
    methods: {
      menuItemClick: function (parentName, childName) {
        this.parentName = parentName;
        this.childName = childName;
      }
    },
    created: function () {

    }
  }


</script>

<style scoped>

</style>
