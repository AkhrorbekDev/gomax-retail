<template>
  <div class="basicUsage title_my">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <span @click="$emit('c-change', 'home')">{{ $t("home") }}</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="main === 'payment'">
        <span>{{ $t("payment") }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import VueTypes from "vue-types";
export default {
  name: "Breadcrumb",
  props: {
    main: VueTypes.string
  },
  computed: {
    breadcrumb() {
      return this.data;
    }
  }
};
</script>
<style scoped>
.breadcrumb {
  color: white;
}
</style>
