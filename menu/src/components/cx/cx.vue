<!--html结构-->
<template>
 <div>
  <router-link to="/ct">ct</router-link>
  <router-link to="/">index</router-link>
 </div>
</template>
<script>
export default {
 data() {
  return {
   num: '11'
  }
 },
 props: ['mdzz']
}
</script>