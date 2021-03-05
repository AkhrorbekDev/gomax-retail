<template>
  <div id="app">
    <template>
      <component :is="layout">
        <router-view :key="$route.fullPath" />
      </component>
    </template>
  </div>
</template>

<script>
import EmptyLayout from '@/layouts/EmptyLayout';
import MainLayout from '@/layouts/MainLayout';
import { findLast, has } from 'lodash';

export default {
  data() {
    return {
      layout: null,
    };
  },
  watch: {
    $route: {
      handler() {
        this.layout = findLast(this.$route.matched, (route) => has(route, 'meta.layout'))?.meta?.layout ?? EmptyLayout;
      },
      immediate: true,
    },
  },
  components: {
    EmptyLayout,
    MainLayout,
  },
};
</script>
