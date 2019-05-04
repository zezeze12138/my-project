<template>

  <div class="ScrapyTable">
    <div>
      <el-row type="flex" style="margin:10px 20px 20px">
        <el-button type="primary" @click.prevent="addScrapy()">新增爬虫</el-button>
        <el-button type="primary" @click.prevent="setTiming()">设置定时任务</el-button>
        <el-button type="primary" @click.prevent="spiderAll()">爬取</el-button>
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
        <el-table-column label="一级主题" prop="" align="center" :show-overflow-tooltip="true">
          <template scope="scope">
            <el-tag type="primary">
              {{ scope.row.firstTopic | firstTopicFormat }}
            </el-tag>
          </template>
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
            {{ scope.row.timing }}
          </template>
        </el-table-column>
        <el-table-column label="开启分类" prop="timing" align="center" :show-overflow-tooltip="true">
          <template scope="scope">
            <el-switch
              v-model="scope.row.isclassify"
              active-color="#13ce66"
              active-value="1"
              inactive-color="#ff4949"
              inactive-value="0"
              @change="classifyChange(scope)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click.prevent="getContext(scope.row)">查看</el-button>
            <el-button :type="scope.row.status | deployType" size="mini" @click.prevent="deploySpider(scope.row)">
              <!--部署/取消部署：不同的状态显示不同的名称-->
              {{ scope.row.status | deployFormat }}
            </el-button>
            <el-button :type="scope.row.status | runType" size="mini" @click.prevent="spiderData(scope.row)">
              {{ scope.row.status | runFormat }}
            </el-button>
            <el-button type="primary" size="mini" @click.prevent="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--添加爬虫-->
    <el-dialog :visible.sync="dialogAddScrapyVisible" title="新增爬虫" @close='closeDialog'>
      <div class="dialog-body-addScrapy">
        <el-form  :model="uploadForm" label-width="100px">
          <el-form-item label="项目名称">
            <el-input v-model="uploadForm.upLoadData.projectName"></el-input>
          </el-form-item>
          <el-form-item label="爬虫名称">
            <el-input v-model="uploadForm.upLoadData.scrapyName"></el-input>
          </el-form-item>
          <el-form-item label="一级主题类别">
            <el-select v-model="uploadForm.upLoadData.firstTopic" placeholder="请选择">
              <el-option
                v-for="item in firstTopicOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传爬虫程序">
            <el-upload
              ref="upload"
              :action=uploadForm.importFileUrl
              :data=uploadForm.upLoadData
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list=uploadForm.fileList
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">请将爬虫程序压缩后上传</div>
            </el-upload>
          </el-form-item>
         <!--<el-form-item>-->
            <!--<el-button style="margin-left: 10px;" size="small" justify="center" type="success" @click="submitUpload">提交</el-button>-->
          <!--</el-form-item>-->
        </el-form>
        <div class="upload-zip">

        </div>
        <div class="controllMenu">
          <el-row type="flex" justify="center" style="margin:10px 10px 10px">
            <el-button style="margin-left: 10px;" justify="center" type="success" @click.prevent="submitUpload()">提交</el-button>
          </el-row>
        </div>
      </div>
    </el-dialog>

    <!--设置定时-->
    <el-dialog :visible.sync="dialogTimingVisible" title="设置定时" @close='closeDialog'>

      <div class="dialog-body">
        <div style="margin: 0px 0px 10px 0px;">
          <el-row type="flex" justify="center" style="margin:10px 10px 10px">
            <el-time-select
              v-model="timing"
              placeholder="选择时间">
            </el-time-select>
          </el-row>
        </div>
      </div>

      <div class="controllMenu">
        <el-row type="flex" justify="center" style="margin:10px 10px 10px">
          <el-button type="primary" size="mini" @click.prevent="setTimingButton()">提交设置</el-button>
        </el-row>
      </div>
    </el-dialog>

    <!--查看爬虫-->
    <el-dialog :visible.sync="dialogItemListVisible" title="爬取内容" @close='closeDialog'>

      <div class="dialog-body">
        <div style="margin: 0px 0px 10px 0px;">
          <el-row>
            <el-input :disabled="true" v-model="dialog.program">
              <template slot="prepend">项目名称</template>
            </el-input>
            <el-input :disabled="true" v-model="dialog.scrapy">
              <template slot="prepend">爬虫名称</template>
            </el-input>
          </el-row>
          <el-row>
            <el-input :disabled="true" v-model="dialog.jobId">
              <template slot="prepend">jobId</template>
            </el-input>
            <el-select :disabled=dialogEditController v-model="dialog.firstTopic" placeholder="请选择">
              <el-option
                v-for="item in firstTopicOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-row>
          <el-row>
            <el-input :disabled=dialogEditController v-model="dialog.timing">
              <template slot="prepend">定时任务</template>
            </el-input>
          </el-row>
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
        dialogAddScrapyVisible:false,
        dialogTimingVisible:false,
        selectlistRow:[],
        ScrapyConfigList: [],
        itemList:[],
        dbName:'',
        collectName:'',
        timing:'',
        dialogEditController:true,
        dialog:{

        },
        uploadForm:{
          importFileUrl: requestIP+'/addScrapyConfigAndUploadProgram',
          upLoadData: {
            projectName: '',
            scrapyName: '',
            firstTopic: ''
          },
          fileList:[]
        },
        firstTopicOptions: [
          {value: '11',label: '军事'},
          {value: '12',label: '新闻'},
          {value: '13',label: '探索'},
          {value: '14',label: '财经'},
          {value: '15',label: '科技'},
          {value: '16',label: '体育'},
          {value: '17',label: '娱乐'},
          {value: '18',label: '教育'},
          {value: '19',label: '健康'},
          {value: '20',label: '时尚'}]
      }
    },
    methods: {
      // 获取表格选中时的数据
      selectRow:function(check) {
        var applyIds = check.map(function(item){ return item.scrapy });
        this.selectlistRow = applyIds;
        console.log(this.selectlistRow);
      },
      getContext(row){
        var self = this;
        self.dialogItemListVisible = true;
        //跨域异步请求获取item数据
        this.$http.get(requestIP+'/getItemListByProgramName?programName='+row.program).then(function (response) {
          console.log(response.data.data[0].fields);
          self.dialog = response.data.data[0].fields;
          console.log(self.dialog)
        });
      },
      //删除爬虫
      deleteRow(row){
        var self = this;
        var data = {
          "programName":row.program,
          "status":row.status
        }
        if(row.status!=0){
          self.$message({
            message: '爬虫需要退出部署才可以删除',
            type: 'warning'
          });
        }else{
          this.$confirm('此操作将删除该爬虫, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.$http.post(requestIP+'/deleteScrapyConfig',data).then(function (response) {
              console.log(response.data.data);
              if(response.data.data == "true"){
                self.getScrpayConfigList();
                self.$message({
                  message: '删除成功',
                  type: 'success'
                });

              }else{
                self.$message.error('爬虫需要退出部署才可以删除');
              }
            });
          }).catch(() => {
            self.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },
      //设置定时按钮
      setTimingButton(){
        var self = this;
        console.log(self.selectlistRow);
        console.log(self.timing);
        var data = {
          "programList":self.selectlistRow,
          "timing":self.timing
        }
        this.$http.post(requestIP+'/setTimingByProgramName',data).then(function (response) {
          console.log(response.data)
          var result = response.data.data;
          console.log(result);
          self.getScrpayConfigList();
          self.dialogTimingVisible = false;
        });
      },
      //获取配置列表
      getScrpayConfigList() {
        var self = this;
        this.$http.get(requestIP+'/scrapyConfig').then(function (response) {
          var dataArray = response.data.data;
          //清空数组
          self.ScrapyConfigList = []
          //重新获取配置表
          for(let data of dataArray)
            self.ScrapyConfigList.push(data.fields);
        });
      },
      getListJobs(row){
        var self = this;
        var data = {
          "project":row.program
        }
        console.log(data);
        this.$http.post(requestIP+'/getListJob',data).then(function (response) {
          console.log(response.data)
          var result = response.data.data;
          console.log(result);
          var runningJson = result.running;
          console.log(runningJson)
          console.log(runningJson.id);
        });
      },
      //开始爬取或取消爬取
      spiderData(row){
        var self = this;
        if(row.status == "2"){
          //状态为2标识爬虫正在运行中，可以进行取消爬虫操作
          //请求启动爬虫服务
          var data = {
            "project":row.program,
            "spider":row.scrapy
          }
          console.log(data);
          this.$http.post(requestIP+'/cancelSpider',data).then(function (response) {
            var result = response.data;
            console.log(response.data);
            console.log(result.data);
            self.getScrpayConfigList();
          });
        }else{
          //请求启动爬虫服务
          var data = {
            "project":row.program,
            "spider":row.scrapy
          }
          console.log(data);
          this.$http.post(requestIP+'/startSpider',data).then(function (response) {
            var result = response.data;
            console.log(response.data);
            console.log(result.data);
            self.getScrpayConfigList();
          });
        }

      },
      //部署或取消部署
      deploySpider(row){
        var self = this;
        if(row.status == "1"){
          //如果是部署状态1,点击按钮后取消部署
          var data = {
            "id":row.id,
            "project":row.scrapy
          }
          this.$http.post(requestIP+'/deleteSpider',data).then(function (response) {
            var result = response.data;
            console.log(response.data);
            console.log(result.data);
            self.getScrpayConfigList();
          });
        }else{
          //如果是非部署状态,点击按钮后进行部署
          var data = {
            "id":row.id,
            "project":row.scrapy,
            "scrapy":row.scrapy
          }
          console.log(this.ScrapyConfigList);
          this.$http.post(requestIP+'/deploySpider',data).then(function (response) {
            var result = response.data;
            console.log(response.data);
            console.log(result.data);
            self.getScrpayConfigList();
          });
        }
      },
      //修改爬虫内容
      editInfo(){
        this.dialogEditController = false;
      },
      //关闭爬虫内容框
      closeDialog(){
        this.dialogEditController = true;
      },
      //爬取所有已选项
      spiderAll(){
        var self = this;
        var data = {
          "project":"spiderNews"
        }
        console.log(data);
        this.$http.post(requestIP+'/getListJob',data).then(function (response) {
          console.log(response.data)
        });
      },
      //新增爬虫
      addScrapy(){
        this.dialogAddScrapyVisible = true;
      },
      setTiming(){
        this.dialogTimingVisible = true;
      },
      //文件上传方法
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      classifyChange:function(scope){
        console.log(scope.row)
        var data = {
          "project":scope.row.scrapy,
          "isclassify":scope.row.isclassify
        }
        this.$http.post(requestIP+'/chargeClassifyStatus',data).then(function (response) {
        });
      }
    }  ,
    filters: {
      statusFormat: function (value) {
        switch (value){
          case "0": return "未部署"; break;
          case "1": return "已部署"; break;
          case "2": return "运行中"; break;
          case "3": return "正在启动"; break;
          case "4": return "分类中"; break;
          default: return ""; break;
        }
      },
      statusType: function (value) {
        switch (value){
          case "4": return "danger"; break;
          case "1": return "success"; break;
          case "2": return "primary"; break;
          case "3": return "warning"; break;
          default: return "info"; break;
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
          case "2": return "取消" ; break;
          default: return "运行"; break;
        }
      },
      runType: function (status) {
        switch (status){
          case "0": return "info"; break;
          case "1": return "success" ; break;
          case "2": return "danger" ; break;
          default: return "success"; break;
        }
      },
      firstTopicFormat:function (firstTopic) {
        switch (firstTopic){
          case "11": return "军事"; break;
          case "12": return "新闻" ; break;
          case "13": return "探索" ; break;
          case "14": return "财经"; break;
          case "15": return "科技" ; break;
          case "16": return "体育" ; break;
          case "17": return "娱乐"; break;
          case "18": return "教育" ; break;
          case "19": return "健康" ; break;
          case "20": return "时尚" ; break;
        }
      }
    },
    created: function () {
      this.getScrpayConfigList();
    }
  }
</script>

<style scoped>
  .dialog-body{
    padding:10px 10px;
  }
</style>
