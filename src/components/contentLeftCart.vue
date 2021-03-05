<template>
  <div>
    <div class="tog-filert container" id="people">
      <div class="filter">
        <div
          class="cart-itme-icon text-center cursor-pointer"
          :class="activeButton === 0 ? 'activeButton' : ''"
          @click="activeButton = 0"
        >
          <label>
            <input
              @click="getProductByCategory('All')"
              type="radio"
              v-model="selectedCategory"
              value="All"
            />
            {{ $t('all') }}
          </label>
        </div>
        <div
          v-for="category in categories"
          :key="category.id"
          :label="category.id"
          @click="activeButton = category.id"
          :class="activeButton === category.id ? 'activeButton' : ''"
          class="cart-itme-icon text-center cursor-pointer"
        >
          <label>
            <input
              type="radio"
              v-model="selectedCategory"
              :value="category.id"
            />
            {{ category.name }}
          </label>
        </div>
      </div>

      <ul class="people-list" v-if="products.length > 0">
        <li
          class="itme-people-list"
          v-for="product in products"
          :key="product.id"
          @click="addCart(product)"
        >
          <product-card :product="product" />
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import ProductsService from "../api/product";
import CategoryService from "../api/category";
import Total from "../utils/Total";
import OrderItem from "../models/OrderItem";
import Order from "../models/Order";
import VueTypes from "vue-types";
import ProductCard from "./ProductCard";

export default {
  props: {
    refresh: VueTypes.bool,
    name: VueTypes.string
  },
  components: {
    ProductCard
  },
  data() {
    return {
      selectedCategory: "All",
      activeButton: 0,
      isTrueRefresh: false,
      searchByName: "",
      products: []
    };
  },
  watch: {
    refresh: {
      immediate: true,
      handler(newVal) {
        this.isTrueRefresh = newVal;
      }
    },
    name: {
      immediate: true,
      handler(newVal) {
        if (newVal !== "") {
          this.getProductsByName(newVal);
        }
      }
    },
    selectedCategory: {
      handler(newVal) {
        this.getProductByCategory(newVal);
      }
    }
  },

  asyncComputed: {
    async getProducts() {
      const loading = this.$loading({
        customClass: "login-loading",
        lock: true,
        text: "Загрузка",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let is_loading = true;
      if (this.isTrueRefresh) {
        const { result } = (await ProductsService.getProducts()).data;
        loading.close();
        is_loading = false;
        this.products = await Total.totalRemainderPercentage(
          result.data.products
        );
      }
      const { result } = (await ProductsService.getProducts()).data;
      this.products = await Total.totalRemainderPercentage(
        result.data.products
      );
      loading.close();
      is_loading = false;
      return;
    },
    async categories() {
      const { result } = (await CategoryService.getAll()).data;
      return result.data.categories;
    }
  },
  methods: {
    async addCart(product) {
      const hasProduct = await this.$store.getters["cart/getProduct"](
        product.id
      );
      if (product.total_remainder !== 0) {
        if (hasProduct) {
          const item = OrderItem.reverseProduct(product);

          return await this.$store.dispatch("cart/add", item);
        } else {
          const order = await this.$store.getters["order/getOrder"];
          if (!order.retail_order_id) {
            await this.$store.dispatch("order/create", Order.newOrder());
          }
          const item = OrderItem.reverseProduct(product);

          return await this.$store.dispatch("cart/add", item);
        }
      } else {
        this.$notify({
          title: "Info",
          type: "info",
          message: "Товар не найдена в складах"
        });
      }
    },
    async getProductsByName(name) {
      this.activeButton = 0;
      const loading = this.$loading({
        customClass: "login-loading",
        lock: true,
        text: "Загрузка",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let is_loading = true;
      await ProductsService.getProductByCategoryId({
        name: name
      })
        .then(async res => {
          if (res.status === 200 && res.data.result.data.products.length > 0) {
            loading.close();
            is_loading = false;
            this.searchByName = "";
            this.products = await Total.totalRemainderPercentage(
              res.data.result.data.products
            );
          } else {
            loading.close();
            this.searchByName = "";
            is_loading = false;
            this.$notify({
              message: "Продукты не найдено."
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    async getProductByCategory(id) {
      const loading = this.$loading({
        customClass: "login-loading",
        lock: true,
        text: "Загрузка",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let is_loading = true;
      if (id !== "All") {
        await ProductsService.getProductByCategoryId({
          category_id: id
        })
          .then(async res => {
            if (
              res.status === 200 &&
              res.data.result.data.products.length > 0
            ) {
              this.products = await Total.totalRemainderPercentage(
                res.data.result.data.products
              );
              loading.close();
              is_loading = false;
            } else {
              loading.close();
              is_loading = false;
              this.$notify({
                message: "Продукты не найдено."
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        const { result } = (await ProductsService.getProducts()).data;
        this.products = await Total.totalRemainderPercentage(
          result.data.products
        );
        loading.close();
        is_loading = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.is-active {
  background-color: #67c23a;
}
</style>
