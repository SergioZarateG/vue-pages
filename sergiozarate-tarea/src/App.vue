<template>
  <div id="app">
    <h1><strong>Mi Restaurante</strong></h1>
    <ul>
      <li><router-link to="/salesList">Ventas Realizadas</router-link></li>
      <li><router-link to="/productsSales">Productos vendidos</router-link></li>
      <li><router-link to="/statistics">Más datos importantes</router-link></li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      msg: 'Bienvenido a tu restaurante'
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
