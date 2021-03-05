<template>
  <div>
    <div class="item-cost flex1">
      <div class="cost-name">{{ product.name }}</div>
      <span class="costs-pley">{{ product.price | formatNumber }} UZS</span>
      <span class="costs-pley"
        >{{ product.total_remainder }}
        {{ product.measurement ? product.measurement.name : "" }}
      </span>
    </div>
    <el-progress
      :text-inside="true"
      :stroke-width="20"
      :percentage="product.totalPercentage"
      :color="customColors"
      status="exception"
      class="ali"
    />
  </div>
</template>

<script>
import VueTypes from "vue-types";

export default {
  name: "ProductCard",
  props: {
    product: VueTypes.object
  },
  data() {
    return {
      customColors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#e6a23c", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#5cb87a", percentage: 100 }
      ]
    };
  }
};
</script>

<style></style>
