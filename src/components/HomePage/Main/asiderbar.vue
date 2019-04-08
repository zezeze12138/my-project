<template>
    <div v-bind:style="{width: '200px'}" class="drop_menu">
     <!-- <div style="text-align: center">
        <span style="line-height: 50px;font-size: 16px; text-align: center;color:#fff">管理系统</span>
      </div>-->

      <el-menu default-active=""
             unique-opened
             theme="dark"
             style="width: 100%;padding-right: 0px;"
             text-color="#fff"
             background-color="#2f4050"
             @select="handleSelect"
             :default-active="currentRouter"
             class="el-menu-vertical-demo"
             :collapse="isCollapse">
      <el-submenu v-for="item in menuArr"
                  :index="item.indexNum"
                  :key="item.indexNum">
        <template slot="title">
          <i :class="item.iconClass"></i>
          <span slot="title" v-text="item.name"></span>
        </template>
        <el-menu-item v-for="itemChild in item.children"
                      :index="itemChild.path"
                      :key="itemChild.indexNum"
                      @click="menuItemClick(item.name, itemChild.name)">
          <a class='inlineBlock' :href="itemChild.path | hashLink"> <span v-text="itemChild.name"></span> </a>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: "asiderbar",
    data: function () {
      return {
        parentName: '首页',
        childName: null,
        isCollapse: false,
        currentRouter:'/hello',
        menuArr: [{
          "children": [{
            "indexNum": "1",
            "name": "用户管理",
            "parentPath": "/userManage",
            "path": "/main/user"
          }, {
            "indexNum": "1",
            "name": "管理员管理",
            "parentPath": "",
            "path": "/customerFinance/show"
          }], "iconClass": "fafa-language", "indexNum": "2", "name": "用户管理", "url": "#"
        }, {
          "children": [{
            "indexNum": "1",
            "name": "数据统计",
            "parentPath": "/afterloan/manager",
            "path": "/main/data"
          }, {
            "indexNum": "2",
            "name": "舆情预警",
            "parentPath": "/afterloan/manager",
            "path": "/main/data"
          }], "iconClass": "fafa-television", "indexNum": "3", "name": "数据分析", "url": "#"
        }, {
          "children": [{
            "indexNum": "1",
            "name": "数据爬取",
            "parentPath": "",
            "path": "/main/data"
          }, {
            "indexNum": "1",
            "name": "爬虫管理",
            "parentPath": "",
            "path": "/main/crawlerManagement"
          }],"iconClass": "fafa-cog", "indexNum": "6", "name": "推送管理", "url": "#"
        }]
      }
    },methods:{
      //点击侧边栏链接对应的方法
      handleSelect: function (key, keyPath) {
      },
      menuItemClick: function (parentName, childName) {
        this.parentName = parentName;
        this.childName = childName;
        console.log(this.parentName);
        console.log(this.childName);
      }
    },filters: {
      hashLink: function (val) {
        return '#' + val;
      }
    }
  }
</script>

<style scoped>
  a{
    text-decoration: none;
    color:#fff;
  }
  .inlineBlock{
    display: block;
  }
  .drop_menu{
    height: inherit;
    width: 180px;
    /*border-top: 1px solid #e6e6e6;
      border-right: 1px solid #e6e6e6;
      border-bottom: 1px solid #e6e6e6;*/
    box-sizing: border-box;
    overflow-x: hidden;
    transition: width 0.3s ease;
    -moz-transition: width 0.3s ease;
    -webkit-transition: width 0.3s ease;
    -o-transition: width 0.3s ease;
    background-color:#2f4050 ;
    position: absolute;
    left: 0px;
  }

</style>
