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
              <el-table
                ref="multipleTable"
                :data="tableData3"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  label="日期"
                  width="120">
                  <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="姓名"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="地址"
                  show-overflow-tooltip>
                </el-table-column>
              </el-table>
              <div style="margin-top: 20px">
                <el-button @click="toggleSelection([tableData3[1], tableData3[2]])">切换第二、第三行的选中状态</el-button>
                <el-button @click="toggleSelection()">取消选择</el-button>
              </div>
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
    </div>
</template>
<script type="text/javascript">
export default {
  data() {
      return {
        activeIndex: '1',
        activeIndex2: '1',
        activeName: 'first',
        activeNames: ['1'],
        tableData3: [{
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
        multipleSelection: []
      };
    },
    methods: {
      handleChange(val) {
        console.log(val);
      },
      // handleClick(tab, event) {
      //   console.log(tab, event);
      // },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSelect(key, keyPath) {
        this.activeIndex = key,
        this.activeIndex2 = key,
        console.log(key, keyPath);
      }
    }
  }
</script>
