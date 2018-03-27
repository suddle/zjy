<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height:100%;
}
html,body{
  height:100%;
  margin:0px;
}
.wrap,.el-container,.slide_ul{
  height:100%;
}
  .el-header, .el-footer {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-aside {
    background-color: #00579E;
    color: #333;
    text-align: center;
    line-height: 200px;
    height:100%;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  .slide_ul{
      background:#122B3C;
      padding: 0;
      margin:0;
  }
  .slide_ul li{
    line-height: 30px;
      list-style: none;
      height:30px;
      background:#545C64;
      margin-bottom: 5px;
  }
  .slide_ul li a{
    color:#fff;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .el-collapse-item{
    height:100%;
  }
  .el-collapse-item__header,.el-collapse-item__wrap{
    background:#B3C0D1;
  }
  /*chrome滚动条颜色设置*/
::-webkit-scrollbar {width:3px; height:10px; background-color:#333;} /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar-track {background-color:#ccc; border-radius:10px; -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3);} 
::-webkit-scrollbar-thumb {background-color:#555; border-radius:10px; -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);} 
</style>
