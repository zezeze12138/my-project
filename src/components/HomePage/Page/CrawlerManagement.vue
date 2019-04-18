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
          <el-table-column label="运行id" prop="jobId" align="center" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="状态" align="center" :show-overflow-tooltip="true">
            <template scope="scope">
              <el-tag :type="scope.row.status | statusType">
                {{ scope.row.status | statusFormat }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="定时任务" prop="timing" align="center" :show-overflow-tooltip="true">
            <template scope="scope">
              {{ scope.row.timing | timingFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="350px">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click.prevent="getContext(scope.$index)">查看</el-button>
              <el-button :type="scope.row.status | deployType" size="mini" @click.prevent="spiderData(scope.$index)">
                <!--部署/取消部署：不同的状态显示不同的名称-->
                {{ scope.row.status | deployFormat }}
              </el-button>
              <el-button :type="scope.row.status | runType" size="mini" @click.prevent="spiderData(scope.$index)">
                {{ scope.row.status | runFormat }}
              </el-button>
              <el-button type="primary" size="mini" @click.prevent="deleteRow()">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>



      <el-dialog :visible.sync="dialogItemListVisible" title="爬取内容" @close='closeDialog'>

        <div class="dialog-body">
          <div style="margin: 0px 0px 10px 0px;">
            <el-row>
              <el-input :disabled=dialogEditController v-model="dialog.projectName">
                <template slot="prepend"> 项目名称</template>
              </el-input>
            </el-row>
            <el-row>
              <el-input :disabled=dialogEditController v-model="dialog.scrapyName">
                <template slot="prepend">爬虫名称</template>
              </el-input>
            </el-row>
          </div>

          <div class="xml-body">
            <el-input
              type="textarea"
              autosize
              :disabled=dialogEditController
              :autosize="{ minRows: 2, maxRows: 10}"
              placeholder="请输入爬虫xml"
              v-model="dialog.xmlTextArea">
            </el-input>
            <!--<el-table
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
            </el-table>-->
          </div>
        </div>

        <div class="controllMenu">
          <el-row type="flex" justify="center" style="margin:10px 10px 10px">
            <el-button type="primary" size="mini" @click.prevent="editInfo()">修改</el-button>
            <el-button type="primary" size="mini" @click.prevent="editInfo()">提交</el-button>
          </el-row>
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
            ScrapyConfigList: [{"scrapy":"scrapy1","program":"scrapy1","status":"0","timing":"1"},
                              {"scrapy":"scrapy2","program":"scrapy2","status":"1","timing":"0"},
                              {"scrapy":"scrapy3","program":"scrapy3","status":"2","timing":"0"},
                              {"scrapy":"scrapy4","program":"scrapy4","status":"3","timing":"1"},
                              {"scrapy":"scrapy5","program":"scrapy5","status":"4","timing":"0"}],
            itemList:[],
            dbName:'',
            collectName:'',
            dialogEditController:true,
            dialog:{
              projectName:'',
              scrapyName:'',
              xmlTextArea:''
            }
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
          },
          //修改爬虫内容
          editInfo(){
            this.dialogEditController = false;
          },
          //关闭爬虫内容框
          closeDialog(){
            this.dialogEditController = true;
          }
        }  ,
        filters: {
          statusFormat: function (value) {
            switch (value){
              case "0": return "未部署"; break;
              case "1": return "已部署"; break;
              case "2": return "运行中"; break;
              case "3": return "暂停"; break;
              case "4": return "未启动"; break;
              default: return ""; break;
            }
          },
          statusType: function (value) {
            switch (value){
              case "0": return "danger"; break;
              case "1": return "success"; break;
              case "2": return "primary"; break;
              case "3": return "warning"; break;
              default: return "info"; break;
            }
          },
          timingFormat: function (value) {
            switch (value){
              case "1": return "开启定时" ; break;
              default: return ""; break;
            }
          },
          deployFormat: function (status) {
            switch (status){
              case "0": return "部署" ; break;
              case "1": return "取消部署" ; break;
              default: return "取消部署"; break;
            }
          },
          deployType: function (status) {
            switch (status){
              case "0": return "warning" ; break;
              case "1": return "danger" ; break;
              default: return "danger"; break;
            }
          },
          runFormat: function (status) {
            switch (status){
              case "1": return "运行" ; break;
              case "2": return "停止" ; break;
              case "3": return "继续" ; break;
              default: return "运行"; break;
            }
          },
          runType: function (status) {
            switch (status){
              case "1": return "success" ; break;
              case "2": return "danger" ; break;
              case "3": return "warning" ; break;
              default: return "success"; break;
            }
          }
        },

        created: function () {
           //this.getScrpayConfigList();
        }
    }
</script>

<style scoped>
.dialog-body{
  padding:10px 10px;
}
</style>
