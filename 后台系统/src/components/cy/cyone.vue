<template>
    <div class="wrap">
      <el-container>
        <el-aside width="200px">
            <ul class="slide_ul">
              <li><router-link to="/">处理中心</router-link></li>
              <li><router-link to="/cytwo">我的工作台</router-link></li>
              <li><router-link to="/datail">消息中心</router-link></li>
              <li><router-link to="/cyone">订单管理</router-link></li>
            </ul>
        </el-aside>
        <el-container>
          <el-header>
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                 <el-menu-item index="1"><router-link to="/">处理中心</router-link></el-menu-item>
                 <el-menu-item index="2"><router-link to="/cytwo">我的工作台</router-link></el-menu-item>
                 <el-menu-item index="3"><router-link to="/datail">消息中心</router-link></el-menu-item>
                 <el-menu-item index="4"><router-link to="/cyone">订单管理</router-link></el-menu-item>
                </el-menu>
          </el-header>
          <el-main>
              <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                  fixed
                  prop="date"
                  label="日期">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="姓名">
                </el-table-column>
                <el-table-column
                  prop="province"
                  label="省份">
                </el-table-column>
                <el-table-column
                  prop="city"
                  label="市区">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="地址">
                </el-table-column>
                <el-table-column
                  prop="zip"
                  label="邮编">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                    <el-button type="text" size="small" @click="edit(scope.row,scope.$index)">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-popover
                  ref="popover4"
                  placement="right"
                  width="400"
                  trigger="click">
                  <el-table :data="gridData">
                    <el-table-column width="150" property="date" label="日期"></el-table-column>
                    <el-table-column width="100" property="name" label="姓名"></el-table-column>
                    <el-table-column width="300" property="address" label="地址"></el-table-column>
                  </el-table>
                </el-popover>
              <el-pagination
                background
                layout="prev, pager, next"
                :total="1000">
              </el-pagination>
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
      <div class="fms" v-show="shows">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="名字">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="日期">
              <el-input v-model="form.data"></el-input>
            </el-form-item>
            <el-form-item label="地址">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
          </el-form>
          <el-button @click=submits>确定</el-button>
      </div>
    </div>
</template>
<script type="text/javascript">
export default {
  data() {
      return {
        activeIndex: '4',
        activeIndex2: '4',
        activeName: 'fourth',
        activeNames: ['1'],
        shows:false,
        count:'',
        tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        multipleSelection: [],
        form: {
          name:'',
          data:'',
          address:''
        }
      };
    },
    methods: {
      handleChange(val) {
        console.log(val);
      },
       handleClick(row) {

        this.$alert('<p>地址是'+row.address+'名字是'+row.name+'日期是'+row.date+'</p>', '内容', {
          dangerouslyUseHTMLString: true
        });
      },
      handleSelect(key, keyPath) {
        this.activeIndex = key,
        this.activeIndex2 = key,
        console.log(key, keyPath);
      },
      edit(data,key){
        this.count=key;
        this.shows=true;
        this.form.name = data.name
        this.form.data = data.date
        this.form.address = data.address
      },
      submits(){
        var count = this.count;
        this.tableData[count].name = this.form.name;
        this.tableData[count].date = this.form.data;
        this.tableData[count].address = this.form.address;
        this.shows=false;
      }
    }
  }
</script>
<style type="text/css">
  .is-group{
      height:100px;
  }
  .has-gutter{
    height:100px;
  }
  .el-table__header-wrapper{
      height:100px;
  }
  .cell{
    text-align: center;
  }
  .fms{
    position: fixed;
    width:300px;
    height:300px;
    z-index: 1000;
    top: 30%;
    left: 30%;
    border:1px solid #333;
    border-radius: 10px;
    padding:10px;
    background:#fff;
  }
</style>
