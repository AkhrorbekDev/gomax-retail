<template>
  <div class="haeder-content haederLeft">
    <div class="img-logo"><img src="../../public/img/logo2.png" alt="" /></div>
    <div class="icon-sorche d-flex">
      <el-tooltip :content="'Search by: ' + value" placement="top">
        <el-switch
          v-model="value"
          active-color="#13ce66"
          active-value="name"
          inactive-value="code"
          class="switch"
        >
        </el-switch>
      </el-tooltip>
      <el-input
        :placeholder="value === 'code' ? $t('code') : $t('name')"
        suffix-icon="el-icon-search"
        v-model="searchProductByCode"
      >
      </el-input>
      <el-button
        type="text"
        icon="el-icon-switch-button"
        class="logout-btn"
        @click="logOut"
      >
      </el-button>
    </div>
  </div>
</template>

<script>
import auth from "../api/auth/auth";
import authUtil from "../utils/auth";
import ProductsService from "../api/product";
import { debounce } from "lodash";
import OrderItem from "../models/OrderItem";

export default {
  name: "Header",
  data() {
    return {
      searchProductByCode: "",
      value: ""
    };
  },
  watch: {
    searchProductByCode: {
      handler(newVal, oldVal) {
        this.debouncedLoadModel();
      }
    }
  },
  created() {
    this.debouncedLoadModel = debounce(this.loadModel, 2000);
  },
  methods: {
    async loadModel() {
      if (this.searchProductByCode && this.value === "code") {
        const response = await ProductsService.getProductByCode({
          code: this.searchProductByCode
        })
          .then(res => {
            return res.data.result.data.product;
          })
          .catch(err => {
            return err.response;
          });

        if (response.status === 404) {
          this.searchProductByCode = "";
          return this.$notify({
            type: "error",
            message: response.data.error.message
          });
        } else {
          const item = OrderItem.reverseProduct(response);
          this.searchProductByCode = "";
          return await this.$store.dispatch("cart/add", item);
        }
      } else if (this.searchProductByCode && this.value === "name") {
        this.$emit("emit:name", this.searchProductByCode);
        this.searchProductByCode = "";
      }
    },
    onEnter(event) {
      event.preventDefault();
    },
    async logOut() {
      this.$confirm(this.$t("logOut"), {
        confirmButtonClass: "danger",
        confirmButtonText: this.$t("logOut"),
        cancelButtonText: this.$t("cancel"),
        type: "warning",
        center: true
      })
        .then(async () => {
          const response = await auth.logout();
          this.$notify({
            type: "success",
            message: response.data.result.data.message,
            duration: 1000,
            onClose: () => {
              authUtil.clearStorge();
              this.$store.dispatch("cart/clear");
              this.$store.dispatch("order/clear");
              authUtil.removeClientData();
              this.client = "";
              this.$router.push({ name: "login" });
            }
          });
        })
        .catch(err => {
          this.$message({
            type: "info",
            showClose: true,
            message: "Отменено."
          });
        });
    }
  }
};
</script>

<style scoped lang="scss">
.logout-btn {
  &:active,
  &:hover {
    color: white;
  }
  background: transparent;
  color: white;
  border: none;
  font-size: 25px;
  padding: 12px 20px;
}
</style>
