<template>
    <div class="wrap">
      <el-container>
        <el-aside width="200px">
            <ul class="slide_ul">
              <li><router-link to="/index">处理中心</router-link></li>
              <li><router-link to="/cytwo">我的工作台</router-link></li>
              <li><router-link to="/datail">消息中心</router-link></li>
              <li><router-link to="/cyone">订单管理</router-link></li>
            </ul>
        </el-aside>
        <el-container>
          <el-header>
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                 <el-menu-item index="1"><router-link to="/index">处理中心</router-link></el-menu-item>
                 <el-menu-item index="2"><router-link to="/cytwo">我的工作台</router-link></el-menu-item>
                 <el-menu-item index="3"><router-link to="/datail">消息中心</router-link></el-menu-item>
                 <el-menu-item index="4"><router-link to="/cyone">订单管理</router-link></el-menu-item>
                </el-menu>
          </el-header>
          <el-main>
            <div class="forms" style="width:700px;margin:0 auto;">
                <el-form ref="form" :model="form" label-width="80px">
                  <el-form-item label="活动名称">
                    <el-input v-model="form.name"></el-input>
                  </el-form-item>
                  <el-form-item label="活动区域">
                    <el-select v-model="form.region" placeholder="请选择活动区域">
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="活动时间">
                    <el-col :span="11">
                      <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                      <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="即时配送">
                    <el-switch v-model="form.delivery"></el-switch>
                  </el-form-item>
                  <el-form-item label="活动性质">
                    <el-checkbox-group v-model="form.type">
                      <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                      <el-checkbox label="地推活动" name="type"></el-checkbox>
                      <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                      <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="特殊资源">
                    <el-radio-group v-model="form.resource">
                      <el-radio label="线上品牌商赞助"></el-radio>
                      <el-radio label="线下场地免费"></el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="活动形式">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit">立即创建</el-button>
                    <el-button>取消</el-button>
                  </el-form-item>
                </el-form>
                <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </div>
          </el-main>
          <el-footer>
              <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item title="底部底部" name="2">
                  <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                  <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
                </el-collapse-item>
              </el-collapse>
          </el-footer>
        </el-container>
      </el-container>
    </div>
</template>
<script type="text/javascript">
export default {
  data() {
      return {
        activeIndex: '2',
        activeIndex2: '2',
        activeName: 'second',
        activeNames: ['1'],
        dialogImageUrl: '',
        dialogVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      };
    },
    methods: {
      handleChange(val) {
        console.log(val);
      },
      // handleClick(tab, event) {
      //   console.log(tab, event);
      // },
      onSubmit() {
        console.log('submit!');
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSelect(key, keyPath) {
        this.activeIndex = key,
        this.activeIndex2 = key,
        console.log(key, keyPath);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    }
  }
</script>
<style type="text/css">
    .forms{
        width:300px;
    }
</style>
