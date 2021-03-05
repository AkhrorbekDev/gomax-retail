<template>
  <div class="wrapper">
    <el-form ref="form">
      <div class="d-flex style-scorch-form">
        <el-form-item class="input-poli" @keydown.enter.native="onEnter">
          <el-input v-model="search"> </el-input>
        </el-form-item>
        <el-button type="text" class="search-btn" @click="getOrders">
          <i class="el-icon-refresh"></i
        ></el-button>
      </div>
    </el-form>
    <div class="orders">
      <div v-if="orders.length === 0">
        <div v-loading="is_loading"></div>
      </div>

      <div
        v-else
        class="ordes-itme"
        v-for="order in retailOrders.retailOrders"
        :key="order.id"
      >
        <el-row class="flex_j">
          <el-col :span="3">
            <div class="itme-color-font">№ {{ order.id }}</div>
          </el-col>
          <el-col :span="10">
            <div class="itme-color-font text-center">
              {{ order.retail_client ? order.retail_client.name : "" }}
            </div>
          </el-col>
          <el-col :span="2">
            <div class="itme-color-font">
              {{ order.total_product_quantity }}
            </div>
          </el-col>
          <el-col :span="7">
            <div class="itme-color-font">{{ order.total_price }}</div>
          </el-col>
          <el-col :span="2">
            <el-button
              class="iconFlex w100"
              type="primary"
              icon="el-icon-arrow-right"
              @click="$emit('change:order', order.id)"
            ></el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import VueTypes from "vue-types";
import { debounce } from "lodash";
import OrderApi from "../api/Order";

export default {
  name: "OrderModal",
  props: {
    orders: VueTypes.object
  },
  data() {
    return {
      is_loading: true,
      retailOrders: [],
      search: ""
    };
  },
  watch: {
    search: {
      handler(newVal, oldVal) {
        this.debouncedLoadModel();
      }
    },
    orders: {
      handler(newVal) {
        this.retailOrders = newVal;
      }
    }
  },
  created() {
    this.debouncedLoadModel = debounce(this.loadModel, 1000);
  },
  methods: {
    onEnter(event) {
      event.preventDefault();
    },
    async loadModel() {
      if (this.search) {
        const { result } = (await OrderApi.getOrders(this.search)).data;
        if (result.success) {
          this.search = "";
          this.retailOrders = result.data;
        }
      }
    },
    async getOrders() {
      this.search = "";
      await this.$store.dispatch("order/getCount");
      const { result } = (await OrderApi.getOrders()).data;
      if (result.success) {
        this.retailOrders = result.data;
      }
    }
  }
};
</script>

<style scoped lang="scss">
$primary: #0076aa;
.search-btn {
  background: transparent;
  color: $primary;
  border: none;
  font-size: 25px;
  padding: 12px 20px;
}
</style>
