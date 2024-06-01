<template>
  <div class="about">
    <h1>This is an about page</h1>

    <button @click="test">test</button>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>


<script setup>
    import { onMounted, onUnmounted } from 'vue'
    import axios from 'axios'

    const baseUrl = 'https://api.waqi.info'

    onMounted(() => {
        axios.get(`${baseUrl}/feed/here`, {
            params: {
                token: 'f1f0dd17dce3aedf4604850d8caa3bfb25e81d1a'
            }
        }).then(res => {
            console.log(res)
        })
    })
</script>