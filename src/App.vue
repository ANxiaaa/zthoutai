<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #484a4d;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
*{
  margin: 0;
  padding: 0;
}
ul{
  list-style: none
}
.moreBtn{
  overflow: hidden;
  overflow-y: auto;
  position: fixed;
  top: 0;left: 0;
  max-height: 150px;
  background: #fff;
  width: 80px;
  border: 1px solid #ececec;
  border-radius: 15px;
  box-shadow: 0 0 12px 0 #666;
  z-index: 9999;
}
.moreBtn button{
  width: 100%;
  border-radius: 0;
  border-top: none;
  border-left: none;
  border-right: none;
}
.moreBtn li:last-child button{
  border-bottom: none;
}
</style>
