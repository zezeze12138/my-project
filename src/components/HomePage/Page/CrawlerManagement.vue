<template>

    <div class="ScrapyTable">
      <div>
        <el-row type="flex" style="margin:10px 20px 20px">
          <el-button type="primary" @click.prevent="addRow()">设置定时任务</el-button>
          <el-button type="primary" @click.prevent="addRow()">爬取</el-button>
        </el-row>
      </div>
      <div class="table">
        <el-table
          :data="ScrapyConfigList"
          ref="table"
          max-height="3000px"
          tooltip-effect="dark"
          border
          stripe
          style="width: 95%; overflow: auto"
          @selection-change='selectRow'>
          <el-table-column type="selection" width="45" align="center"></el-table-column>
          <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
          <el-table-column label="项目名称" prop="scrapy" align="center" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="爬虫名称" prop="program" align="center" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="开始地址" prop="startUrl" align="center" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="过滤地址" prop="allowedDomain" align="center" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="urls列表" prop="urlsXpath" align="center" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="状态" prop="dbName" align="center" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
              <el-button type="primary" @click.prevent="getContext(scope.$index)">查看</el-button>
              <el-button type="primary" @click.prevent="spiderData(scope.$index)">爬取</el-button>
              <el-button type="primary" @click.prevent="deleteRow()">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>



      <el-dialog :visible.sync="dialogItemListVisible" title="爬取内容">
        <div class="dialog-body">
          <div style="margin: 0px 0px 10px 0px;">
            数据库名称:
            <el-tag>{{dbName}}</el-tag>
            集合名称:
            <el-tag>{{collectName}}</el-tag>
          </div>
          <div class="table">
            <el-table
              :data="itemList"
              ref="table"
              max-height="600px"
              tooltip-effect="dark"
              border
              stripe>
              <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
              <el-table-column label="item名称" prop="itemName" align="center" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column label="item" prop="item" align="center" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column label="xpath" prop="xpath" align="center" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column label="备注" prop="remark" align="center" :show-overflow-tooltip="true">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!--<div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSave">确 定</el-button>
        </div>-->
      </el-dialog>


    </div>

</template>

<script>
    var requestIP = "http://127.0.0.1:8081";
    export default {
        name: "crawler-management",
        data() {
          return {
            dialogItemListVisible:false,
            ScrapyConfigList: [],
            itemList:[],
            dbName:'',
            collectName:''
          }
        },
        methods: {
          // 获取表格选中时的数据
          selectRow(val) {
            this.selectlistRow = val
          },
          getContext(index){
            var self = this;
            var config = null;
            //清空itemList内元素
            self.itemList.splice(0,self.itemList.length);
            //获取选择的scrapy项目名称
            config = self.ScrapyConfigList[index];
            self.dbName = config.dbName;
            self.collectName = config.collectName;
            //显示dialog
            self.dialogItemListVisible = true;
            //跨域异步请求获取item数据
            this.$http.get(requestIP+'/getItemList?scrapyName='+config.scrapy).then(function (response) {
              for(let data of response.data.data)
                self.itemList.push(data.fields);
            });
          },
          //获取配置列表
          getScrpayConfigList() {
            var self = this;
            this.$http.get(requestIP+'/scrapyConfig').then(function (response) {
              var dataArray = response.data.data;
              for(let data of dataArray)
                self.ScrapyConfigList.push(data.fields);
            });
          },
          //开始爬虫
          spiderData(index){
            var self = this;
            var config = null;
            //获取选择的scrapy项目名称
            config = self.ScrapyConfigList[index];
            //请求启动爬虫服务
            var data = {
              "project":config.scrapy,
              "spider":config.scrapy
            }
            console.log(data);
            this.$http.post(requestIP+'/startSpider',data).then(function (response) {
              var result = response.data;
              console.log(response.data);
              console.log(result.data);
            });
          }
        },
        created: function () {
           this.getScrpayConfigList();
        }
    }
</script>

<style scoped>

</style>
