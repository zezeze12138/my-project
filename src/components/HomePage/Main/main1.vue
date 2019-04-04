<template>
  <el-container>
    <el-header></el-header>
    <el-container>
      <el-aside><asiderbar></asiderbar></el-aside>
      <el-main style="border: 1px solid #000;">
        <router-view></router-view>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </el-container>
</template>

<script>
  import Asiderbar from "./asiderbar";

  export default {
    components: {Asiderbar},
    name: "main1"

  }
</script>

<style scoped>

</style>
