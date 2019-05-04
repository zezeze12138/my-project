<template>
  <div id="createSpider">
    <el-form ref="form" :model="ScrapyForm" label-width="5%">
      <el-form-item>
        <el-input v-model="ScrapyForm.projectName" style="width: 45%;">
          <template slot="prepend">项目名称</template>
        </el-input>
        <el-input v-model="ScrapyForm.scrapyName" style="width: 45%; margin-left: 5%">
          <template slot="prepend">爬虫名称</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="http://" v-model="ScrapyForm.request" style="width: 45%;">
          <template slot="prepend">请求地址</template>
        </el-input>
        <el-input v-model="ScrapyForm.page" style="width: 45%; margin-left: 5%">
          <template slot="prepend">翻页字段</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="ScrapyForm.datas" style="width: 45%;">
          <template slot="prepend">data节点名称</template>
        </el-input>
        <el-input v-model="ScrapyForm.url" style="width: 45%; margin-left: 5%">
          <template slot="prepend">url节点名称</template>
        </el-input>
      </el-form-item>
      <!--item项目获取-->
      <el-form-item>
        <div class="tableDate">
          <div class="table">
            <el-table
              :data="ScrapyForm.spiderItemList"
              ref="table"
              max-height="300px"
              tooltip-effect="dark"
              border
              stripe
              style="width: 95%; overflow: auto"
              @selection-change='selectRow'>
              <el-table-column type="selection" width="45" align="center"></el-table-column>
              <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
              <el-table-column label="名称" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="item">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.item"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="xpath">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.xpath"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="备注">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, ScrapyForm.spiderItemList)"
                    type="text"
                    size="small">
                    移除
                  </el-button>
                </template>
              </el-table-column>

            </el-table>
            <div style="border: 1px #e2e2e2 solid; width: 95%;">
              <el-row type="flex" justify="center">
                <el-button style="width: 30%" type="primary" plain class="el-icon-plus"
                           @click.prevent="addRow()"></el-button>
                <el-button style="width: 30%" type="danger" plain class="el-icon-minus"
                           @click.prevent="delSelectData()"></el-button>
              </el-row>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item>
        <el-row type="flex" justify="center">
          <el-button type="primary" round @click="showScrapyXmlResult">爬虫xml预览</el-button>
          <el-button type="primary" round @click="downScrapyXmlFile2">爬虫xml文件下载</el-button>
          <el-button type="warning" round @click="showUploadXmlDialog">获取爬虫程序</el-button>
          <el-button type="warning" round @click="downScrapypProgram">爬虫程序下载</el-button>
        </el-row>
      </el-form-item>
    </el-form>



    <!--查看爬虫-->
    <el-dialog :visible.sync="dialogShowXmlResult" title="爬取内容" @close='closeDialog'>

      <div class="dialog-body">
        <div class="xml-body">
          <el-input
            type="textarea"
            autosize
            :autosize="{ minRows: 2, maxRows: 20}"
            v-model="xmlTextArea">
          </el-input>
        </div>
      </div>
    </el-dialog>


    <!--上传爬虫xml，下载爬虫程序-->
    <el-dialog :visible.sync="dialogGetProgramVisible" title="上传爬虫xml文件" @close='closeDialog'>
      <div class="dialog-body-getProgram">
        <el-form  :model="uploadForm" label-width="100px">
          <el-form-item label="上传爬虫xml">
            <el-upload
              ref="upload"
              :action=uploadForm.importFileUrl
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="getResponseInfo"
              :file-list=uploadForm.fileList
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">请将上传xml文件</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="controllMenu">
          <el-row type="flex" justify="center" style="margin:10px 10px 10px">
            <el-button style="margin-left: 10px;" justify="center" type="success" @click.prevent="uploadXmlDownProgram()">获取爬虫程序</el-button>
          </el-row>
        </div>
      </div>
    </el-dialog>


  </div>

</template>

<script>
  var requestIP = "http://127.0.0.1:8081";
  export default {
    name: "scrapy-edit",
    data() {
      return {
        dialogShowXmlResult:false,
        dialogGetProgramVisible:false,
        xmlTextArea:'',
        ScrapyForm: {
          projectName: '',
          scrapyName: '',
          request: '',
          page: '',
          datas: '',
          url:'',
          spiderItemList: [],
        },
        uploadForm:{
          importFileUrl: requestIP+'/uploadXml',
          fileList:[]
        },
        selectlistRow: []
      }
    },
    methods: {
      async onSubmit() {
        var getData = await this.HelloAxios();
        console.log(getData);
      },
      async downScrapyXmlFile2() {
        var self = this;
        var getData = await this.HelloAxios();
        console.log(getData.json);
        this.$http.post(requestIP + '/downScrapyXml', getData.json, {responseType:'blob' }).then(function (response) {
          console.log(response)
          self.download(response.data)
        });
      },
      download(data){
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(new Blob([data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', 'data.xml')
        document.body.appendChild(link)
        link.click()
      },
      showUploadXmlDialog(){
        this.dialogGetProgramVisible = true;
      },
      //上传爬虫xml，下载爬虫程序
      uploadXmlDownProgram(){
        var self = this;
        var data = {
          "projectName":self.uploadForm.programName
        }
        this.$refs.upload.submit();
        // this.$http.post(requestIP + '/uploadXmlAndDownloadScrapyProgram',data,{responseType:'blob' }).then(function (response) {
        //   console.log(response.data.data);
        //   self.downloadProgram(response.data,self.ScrapyForm.projectName);
        // });
      },
      getResponseInfo(response, file, fileList){
        var self = this;
        console.log(response);
        var programName = response.programName;
        var data = {
          "programName":programName,
          "xmlId":response.data
        };
        this.$http.post(requestIP + '/downloadScrapyProgramByXmlName',data,{responseType:'blob' }).then(function (response) {
          self.downloadProgram(response.data,programName);
        });
      },
      //文件上传方法
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file.response);
      },
      //创建爬虫程序
      downScrapypProgram(){
        var self = this;
        var data = {
          "projectName":self.ScrapyForm.projectName,
          "scrapyForm":self.ScrapyForm
        }
        this.$http.post(requestIP + '/createScrapyProgramAndDownload',data,{responseType:'blob' }).then(function (response) {
          console.log(response.data.data);
          self.downloadProgram(response.data,self.ScrapyForm.projectName);
        });
      },
      //下载爬虫程序
      downloadProgram(data,projectName){
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(new Blob([data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', projectName+'.zip')
        document.body.appendChild(link)
        link.click()
      },
      //爬取数据
      async spiderData(){
        return await this.$http.post(requestIP + '/spiderData', this.ScrapyForm).then(function (response) {
          console.log(response)
        })
      },
      // 获取表格选中时的数据
      selectRow(val) {
        this.selectlistRow = val
      },
      // 增加行
      addRow() {
        var list = {
          name: this.name,
          item: this.item,
          xpath: this.xpath,
          remark: this.remark
        }
        console.log(list);
        this.ScrapyForm.spiderItemList.unshift(list)
      },
      // 删除方法
      // 删除选中行
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      delSelectData() {
        for (let i = 0; i < this.selectlistRow.length; i++) {
          let val = this.selectlistRow
          console.log(this.selectlistRow)
          // 获取选中行的索引的方法
          // 遍历表格中tableData数据和选中的val数据，比较它们的rowNum,相等则输出选中行的索引
          // rowNum的作用主要是为了让每一行有一个唯一的数据，方便比较，可以根据个人的开发需求从后台传入特定的数据
          val.forEach((val, index) => {
            this.ScrapyForm.spiderItemList.forEach((v, i) => {
              if (val.rowNum === v.rowNum) {
                // i 为选中的索引
                this.ScrapyForm.spiderItemList.splice(i, 1)
              }
            })
          })
        }
        // 删除完数据之后清除勾选框
        this.$refs.ScrapyForm.spiderItemList.clearSelection()
      },
      async HelloAxios() {
        return await this.$http.post(requestIP + '/createScrapyXml', this.ScrapyForm).then(function (response) {
          return response.data
        })
      },
      //查看xml结果
      showScrapyXmlResult(){
        var self = this;
        this.$http.post(requestIP + '/scrapyJsonToXmlStr',this.ScrapyForm).then(function (response) {
          console.log(response.data.data);
          self.xmlTextArea = response.data.data;
          self.dialogShowXmlResult = true;
        });
      }
    },
    created: function () {
      //this.HelloAxios();
    }
  }
</script>

<style scoped>

</style>
