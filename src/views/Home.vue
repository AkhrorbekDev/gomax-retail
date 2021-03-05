<template>
  <div class="home">
    <home-page />
  </div>
</template>

<script>
import HomePage from './Home/index';
// @ is an alias to /src
export default {
  name: 'Home',
  components: { HomePage },
};
</script>
