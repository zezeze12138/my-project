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
            "name": "申请贷款查询",
            "parentPath": "/trading/manager",
            "path": "/tradingManage"
          }], "iconClass": "fafa-language", "indexNum": "2", "name": "合同订单查询", "url": "#"
        }, {
          "children": [{
            "indexNum": "1",
            "name": "待监控清单",
            "parentPath": "/afterloan/manager",
            "path": "/main/data"
          }, {"indexNum": "2", "name": "风险客户清单", "parentPath": "/afterloan/manager", "path": "/risk"}, {
            "indexNum": "3",
            "name": "无风险客户清单",
            "parentPath": "/afterloan/manager",
            "path": "/main/user"
          }], "iconClass": "fafa-television", "indexNum": "3", "name": "风险监控", "url": "#"
        }, {
          "children": [{
            "indexNum": "1",
            "name": "管理员管理",
            "parentPath": "",
            "path": "/customerFinance/show"
          }, {"indexNum": "1", "name": "利率配置", "parentPath": "", "path": "/financeTask/task"}, {
            "indexNum": "2",
            "name": "角色管理",
            "parentPath": "/sys",
            "path": "/role"
          }, {"indexNum": "3", "name": "菜单管理", "parentPath": "/sys", "path": "/menu"}],
          "iconClass": "fafa-cog",
          "indexNum": "6",
          "name": "系统管理",
          "url": "#"
        }, {
          "children": [{
            "indexNum": "1",
            "name": "customerFinance",
            "parentPath": "/zrx-platform",
            "path": "/customerFinance/show"
          }, {
            "indexNum": "2",
            "name": "financeTask",
            "parentPath": "/zrx-platform",
            "path": "/financeTask/task"
          }, {"indexNum": "3", "name": "文件上传", "parentPath": "/", "path": "file/importButton"}],
          "iconClass": "fafa-television",
          "indexNum": "4",
          "name": "顾客信息",
          "url": "#"
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
