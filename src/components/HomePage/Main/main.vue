<template>

  <div class="content_area" >
    <Header></Header>
    <div style="height: 100%;"><Asiderbar></Asiderbar></div>
    <div class="content_right" v-bind:style="{paddingLeft:  '200px'}">
      <el-row id="main_content" style="border: 1px solid #ebebeb;">
        <!--<el-col style="padding:10px;border-bottom:1px solid #ebebeb;">
          <el-row>
            <div class="menu_wrap">
            </div>
            <div>
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item><span v-text="parentName"></span></el-breadcrumb-item>
                <el-breadcrumb-item><span v-text="childName"></span></el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </el-row>
        </el-col>-->
        <el-col>
          <div id="content_table" style="padding: 10px;height: 600px;" >
            <router-view></router-view>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  //import AsiderBar from '@/components/HomePage/Main/main.vue'
  import Asiderbar from "./asiderbar";
  import Header from "./header";
  export default {
    components: {Asiderbar,Header},
    name: "main",
    data () {
      return {
        parentName:"首页",
        childName:null
      }
    },
    methods: {

    },
    created: function () {

    }
  }
</script>

<style scoped>
  .content_area{
    position: relative;
  }
  .content_right{
    padding-left: 180px;
    margin-left: 10px;
    transition: padding-left 0.3s;
    -moz-transition: padding-left 0.3s ease;
    -webkit-transition: padding-left 0.3s ease;
    -o-transition: padding-left 0.3s ease;
  }
  .menu_wrap{
    width: 40px;
    height: 24px;
    float: left;
    display: table;
    cursor: pointer;
  }
  .content_right{
    padding-left: 180px;
    margin-left: 0px;
    transition: padding-left 0.3s;
    -moz-transition: padding-left 0.3s ease;
    -webkit-transition: padding-left 0.3s ease;
    -o-transition: padding-left 0.3s ease;
  }
</style>
