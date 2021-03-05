<template>
  <div class="right_blocks">
    <div class="right-top-tab">
      <el-tabs
        type="card"
        v-model="activeTab"
        @tab-click="getOrders"
        class="tabb"
      >
        <el-tab-pane name="cart">
          <div slot="label" class="right-top-icon">
            <i class="el-icon-shopping-bag-1"></i>
            <div>{{ $t("basket") }}</div>
          </div>
          <!-- content-block-tabl -->

          <div class="content-block-tabl">
            <el-row class="title-right-praductic">
              <el-col :span="10">{{ $t("name") }}</el-col>
              <el-col :span="2">{{ $t("qty") }}</el-col>
              <el-col :span="6">{{ $t("price") }}</el-col>
              <el-col :span="6">{{ $t("total") }}</el-col>
            </el-row>
            <div class="itme-colom">
              <div class="right-praductic">
                <el-collapse v-model="active" accordion>
                  <el-collapse-item
                    v-for="(item, index) in products"
                    :key="item.product.id"
                    :name="item.product.id"
                    :ref="item.product.id"
                    :id="item.product.id"
                  >
                    <template slot="title">
                      <el-row class="title-collapse">
                        <el-col :span="10">
                          <v-clamp :max-lines="2">
                            {{ item.product.name }}
                          </v-clamp>
                        </el-col>
                        <el-col :span="2">{{ item.quantity }}</el-col>
                        <el-col :span="6">{{ item.product.price }}</el-col>
                        <el-col :span="6">{{ item.total.total }}</el-col>
                      </el-row>
                    </template>
                    <cart-item
                      :item="item"
                      :permissions="{
                        delete: deleteItem
                      }"
                      @emitComment="setComment"
                      @emitDiscount="setDiscount"
                      @emitWarehouses="setWarehouses"
                      @emitQuantity="changeQuantity($event, index)"
                      @removeProduct="removeProduct($event, index)"
                    />
                  </el-collapse-item>
                  <!-- end  collapse-item-->
                </el-collapse>
                <!-- end  collapse -->
              </div>
            </div>

            <div class="itme-prast">
              <div class="payments">
                <el-row>
                  <el-col :span="24">
                    <div class="itme-payments font12">
                      <span>{{ $t("totalPrice") }}</span>
                      <b>{{ totalCost.totalCostPrice | formatNumber }} UZS</b>
                    </div>
                    <div class="itme-payments">
                      <span>{{ $t("discount") }}</span>
                      <b
                        >{{ totalCost.totalCostDiscount | formatNumber }} UZS</b
                      >
                    </div>
                    <div class="itme-payments">
                      <span>{{ $t("elements") }}</span>
                      <b>{{ totalCost.totalCostElements }}</b>
                    </div>
                    <div class="itme-payments">
                      <span :class="client ? 'success' : ''">
                        {{ $t("client") }}
                      </span>
                      <b :class="client ? 'success' : ''">
                        {{ client ? client : $t("changeClient") }}
                      </b>
                    </div>
                    <div class="itme-payments">
                      <span> {{ $t("cashier") }} ( {{ $t("seller") }} ) </span>
                      <b>
                        {{ user ? user : "" }}
                      </b>
                    </div>
                  </el-col>
                </el-row>
              </div>

              <div class="itme-bottom my-scrol2">
                <el-button @click="setDiscount('all')">
                  <i class="el-icon-discount"></i>
                  <div>{{ $t("totalPrice") }}</div>
                </el-button>
                <el-button @click="clientDrawer.open = true">
                  <i class="el-icon-user"></i>
                  <div>{{ $t("client") }}</div>
                </el-button>
                <el-button @click="print">
                  <i class="el-icon-printer"></i>
                  <div>{{ $t("print") }}</div>
                </el-button>
              </div>
              <!-- elemrnt-click-icon  -->
              <div class="itme-bottom bottonpadding">
                <el-button
                  :disabled="!hasProducts"
                  type="danger"
                  @click="clear"
                >
                  {{ $t("clear") }}
                </el-button>
                <el-button
                  v-can="create_update"
                  :disabled="!hasProducts"
                  type="primary"
                  @click="saveOrder"
                  >{{ $t("postponement") }}
                </el-button>
                <el-button
                  v-can="createTransaction"
                  :disabled="!hasProducts"
                  type="success"
                  @click="openPaymentWindow"
                >
                  {{ $t("pay") }}
                </el-button>
              </div>
            </div>
          </div>
          <!-- content-block-tabl -->
        </el-tab-pane>
        <el-tab-pane name="order" @tab-click="getOrders">
          <div slot="label" class="right-top-icon">
            <i class="el-icon-tickets"></i>
            <span class="son">{{ currentOrdersQuantity }}</span>
            <div>{{ $t("application") }}</div>
          </div>
          <!-- content-block-tabl -->
          <div class="content-block-tabl">
            <order-modal :orders="orders" @change:order="getOrderItems" />
          </div>
          <!-- content-block-tabl -->
        </el-tab-pane>
      </el-tabs>
    </div>

    <clients-drawer
      :open="clientDrawer.open"
      @drawer:close="clientDrawer.open = $event"
      @change:client="saveClient"
    />
    <!-- end clents -->

    <warehouses-drawer
      :open="warehouseDrawer.open"
      :item="warehouseDrawer.item"
      @drawer:close="warehouseDrawer.open = $event"
      @change:warehouse="saveWarehouse"
    />

    <!-- end warehouse -->

    <discount-modal
      :open="discountModal.open"
      :discount="discountModal.discount"
      :product-id="discountModal.id"
      @modal:close="discountModal.open = $event"
      @change:discount="saveDiscount"
    />
    <!-- end discountModal -->
    <comment-modal
      :open="commentModal.open"
      :note="commentModal.note"
      :product-id="commentModal.id"
      @modal:close="commentModal.open = $event"
      @change:note="saveNote"
    />

    <!-- end commentModal -->
  </div>
</template>
<script>
import { sumBy, map, includes } from "lodash";
import { mapGetters } from "vuex";
import OrderApi from "../api/Order";
import Order from "../models/Order";
import auth from "../utils/auth";
import Total from "../utils/Total";
import OrderItem from "../models/OrderItem";
import OrderModal from "./OrderModal";
import DiscountModal from "./DiscountModal";
import CommentModal from "./CommentModal";
import ClientsDrawer from "./ClientsDrawer";
import WarehousesDrawer from "./WarehousesDrawer";
import CartItem from "./CartItem";
import VueTypes from "vue-types";

export default {
  props: {
    ordersQuantity: VueTypes.number
  },
  data() {
    return {
      warehouseDrawer: {
        open: false,
        item: {}
      },
      clientDrawer: {
        open: false
      },
      discountModal: {
        open: false,
        id: 0,
        discount: 0
      },
      commentModal: {
        note: "",
        open: false,
        id: 0
      },
      create_update: false,
      deleteItem: false,
      createTransaction: false,
      active: 1,
      activeTab: "cart",
      client: null,
      user: null,
      orderId: 0,
      orders: {},
      totalCost: null,
      currentOrdersQuantity: 0
    };
  },
  components: {
    OrderModal,
    WarehousesDrawer,
    ClientsDrawer,
    CommentModal,
    DiscountModal,
    CartItem
  },
  computed: {
    products() {
      let products = this.$store.getters["cart/getProducts"];
      products = products.map(item => {
        item.product.totalRemainder = sumBy(item.warehouses, "total_remainder");
        item.total = Total.totalPrices(item);
        return { ...item };
      });

      this.totalCost = Total.totalCost(products);
      this.client = auth.getClientName();
      return products;
    },
    ...mapGetters({
      hasProducts: "cart/hasProducts",
      quantity: "cart/getQuantity",
      activeItem: "cart/getActiveItem",
      hasEmptyWarehouses: "cart/hasEmptyWarehouse",
      ordersCount: "order/getOrderCount",
      order: "order/getOrder",
      permissions: "auth/getPermissions"
    })
  },

  created() {
    this.user = auth.getName();
  },
  watch: {
    products: {
      immediate: true,
      handler(newVal) {
        if (newVal && this.activeTab === "order") {
          this.activeTab = "cart";
        }
      }
    },
    permissions: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          if (this.order.retail_order_id) {
            this.create_update = includes(
              map(this.permissions, "slug"),
              "retailOrders.create"
            );
          } else {
            this.create_update = includes(
              map(this.permissions, "slug"),
              "retailOrders.update"
            );
          }
          this.deleteItem = includes(
            map(this.permissions, "slug"),
            "retailOrders.deleteItem"
          );
          this.createTransaction = includes(
            map(this.permissions, "slug"),
            "retailOrders.createTransaction"
          );
        }
      }
    },
    activeItem: {
      immediate: true,
      handler(newVal) {
        this.active = newVal;
      }
    },
    ordersQuantity: {
      immediate: true,
      handler(newVal) {
        this.currentOrdersQuantity = newVal;
      }
    },
    ordersCount: {
      immediate: true,
      handler(newVal) {
        this.currentOrdersQuantity = newVal;
      }
    }
  },
  methods: {
    openPaymentWindow() {
      this.$emit("c-change", "payment");
    },
    setDiscount(e) {
      this.discountModal.open = true;
      this.discountModal.id = e.id ? e.id : e;
      this.discountModal.discount = e.discount ? e.discount : 0;
    },
    setComment(e) {
      this.commentModal.open = true;
      this.commentModal.id = e.id;
      this.commentModal.note = e.note;
    },
    setWarehouses(item) {
      this.warehouseDrawer = {
        open: true,
        item
      };
    },
    saveDiscount(e) {
      if (e.id === "all") {
        this.discountModal.open = e.open;
        if (e.discount || e.discount === 0) {
          map(this.products, ({ product }) => {
            e.id = product.id;
            this.$store.dispatch("cart/changeDiscount", e);
          });
        }
      } else {
        this.discountModal.open = e.open;
        if (e.discount || e.discount === 0) {
          this.$store.dispatch("cart/changeDiscount", e);
        }
      }
    },
    saveNote(e) {
      this.commentModal.open = e.open;
      this.$store.dispatch("cart/changeNote", e);
    },
    saveClient(e) {
      if (e) {
        auth.setClientData(e);
        this.$store.dispatch("order/setClientID", e);
        return (this.client = e.name);
      }
    },
    saveWarehouse(e) {
      const { warehouses, id } = e;
      this.warehouseDrawer.open = e.open;
      const quantityByProductId = this.quantity(id);
      const totalRemainder = sumBy(warehouses, "total_remainder");
      if (totalRemainder < quantityByProductId) {
        this.$store.dispatch("cart/changeQuantity", {
          id,
          quantity: totalRemainder
        });
      }
      this.$store.dispatch("cart/changeWarehouse", {
        ...e
      });
    },
    async changeQuantity(e, index) {
      if (e.value === 0) {
        await this.removeProduct(e.item_id, index);
      } else {
        this.$store.dispatch("cart/changeQuantity", {
          id: e.id,
          quantity: e.value
        });
      }
    },
    removeProduct(e, index) {
      this.$confirm(this.$t("deleteProduct"), {
        confirmButtonText: this.$t("delete"),
        cancelButtonText: this.$t("cancel"),
        confirmButtonClass: "danger",
        showClose: true,
        center: true
      })
        .then(async () => {
          if (e.id) {
            await OrderApi.deleteOrderItem(e.id)
              .then(async res => {
                if (res.status === 200) {
                  await this.$store.dispatch("cart/remove", index);
                  return this.$cNotify.displayMessage(
                    res.data.result.message,
                    "success"
                  );
                }
              })
              .catch(err => {
                return this.$cNotify.displayMessage(err.message, "warning", {
                  dangerouslyUseHTMLString: true
                });
              });
          } else {
            await this.$store.dispatch("cart/remove", index);
            return this.$cNotify.displayMessage("Удалено.", "success");
          }
        })
        .catch(() => {});
    },
    clear() {
      this.$confirm(this.$t("clearCart"), {
        confirmButtonText: this.$t("clear"),
        cancelButtonText: this.$t("cancel"),
        confirmButtonClass: "danger",
        showClose: true,
        center: true
      })
        .then(() => {
          this.$store.dispatch("cart/clear");
          this.$store.dispatch("order/clear");
          auth.removeClientData();
          this.client = "";
          return this.$message({
            type: "success",
            message: "Очищено",
            showClose: true
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("cancel"),
            showClose: true
          });
        });
    },
    saveOrder() {
      if (this.hasEmptyWarehouses) {
        this.$cNotify.displayNotify(
          "У вас есть пустые склады в продукте.",
          "error"
        );
      } else {
        const loading = this.$loading({
          customClass: "login-loading",
          lock: true,
          text: "Загрузка",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        let is_loading = true;
        this.$confirm(this.$t("savePostPonement"), {
          confirmButtonText: this.$t("save"),
          confirmButtonClass: "success",
          cancelButtonText: this.$t("cancel"),
          center: true
        })
          .then(async () => {
            const products = await this.$store.getters["cart/getProducts"];
            const order = await this.$store.getters["order/getOrder"];
            order.items = OrderItem.rawResources(products);
            await OrderApi.createOrder(order)
              .then(async response => {
                if (response.data.result.success) {
                  loading.close();
                  is_loading = false;
                  await auth.removeClientData();
                  await this.$store.dispatch("order/getCount");
                  await this.$store.dispatch("cart/clear");
                  await this.$store.dispatch("order/clear");
                  this.$emit("refresh:products", true);
                  const message =
                    response.data.result.message +
                    " " +
                    `ID ${response.data.result.data.retailOrder.id}`;
                  this.$cNotify.displayMessage(message, "success");
                }
              })
              .catch(err => {
                loading.close();
                is_loading = false;
                if (err.response && err.response.status === 422) {
                  let ms = "";
                  for (const key in err.response.data.validation_errors) {
                    if (
                      err.response.data.validation_errors.hasOwnProperty(key)
                    ) {
                      const element = err.response.data.validation_errors[key];
                      ms += element.join("<br>") + "<br>";
                    }
                  }
                  this.$cNotify.displayMessage(ms, "warning", {
                    dangerouslyUseHTMLString: true,
                    type: "warning",
                    title: this.$t("warning"),
                    duration: 3000
                  });
                } else {
                  this.$cNotify.displayMessage(err.message, "warning", {
                    dangerouslyUseHTMLString: true,
                    type: "warning",
                    title: this.$t("warning"),
                    duration: 2000
                  });
                }
              });
          })
          .catch(err => {
            loading.close();
            is_loading = false;
          });
      }
    },
    async getOrders(tab) {
      if (tab.name === "order") {
        const { result } = (await OrderApi.getOrders()).data;
        if (result.success) {
          this.orders = result.data;
        } else {
          this.orders = [];
        }
      }
    },
    async getOrderItems(order_id) {
      let is_loading = true;
      const loading = this.$loading({
        customClass: "login-loading",
        lock: true,
        text: "Загрузка",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      await OrderApi.getOrderItems(order_id)
        .then(async response => {
          const { result } = response.data;
          if (result.success) {
            loading.close();
            is_loading = false;
            const orderResult = result.data.retailOrder;
            if (orderResult.retail_client) {
              await auth.setClientData(orderResult.retail_client);
            } else {
              await auth.removeClientData();
            }
            const items = OrderItem.reverseResources(
              orderResult.retail_order_items
            );
            const order = Order.reverseResource(orderResult);
            await this.$store.dispatch("cart/clear");
            await this.$store.dispatch("warehouse/clear");
            await this.$store.dispatch("order/clear");
            await this.$store.dispatch("order/create", order);
            await items.map(item => this.$store.dispatch("cart/add", item));
            this.activeTab = "cart";
            return true;
          }
        })
        .catch(err => {
          loading.close();
          is_loading = false;
          if (err.response.data.error.code === 404) {
            this.$$cNotify.displayMessage(
              err.response.data.error.message,
              "error",
              {
                dangerouslyUseHTMLString: true,
                duration: 3000
              }
            );
          }
        });
    },
    print() {
      if (this.hasProducts) {
        this.$confirm(this.$t("printMessage"), {
          confirmButtonClass: "success",
          confirmButtonText: this.$t("yes"),
          cancelButtonText: this.$t("no"),
          center: true
        })
          .then(async () => {
            const products = await this.$store.getters["cart/getProducts"];
            const order = await this.$store.getters["order/getOrder"];
            order.items = OrderItem.rawResources(products);
            await OrderApi.getCashBox(order, false)
              .then(async response => {
                const WinPrint = window.open(
                  "",
                  "",
                  "left=0,top=0,toolbar=0,scrollbars=0,status=0"
                );
                WinPrint.document.write(response.data);
                WinPrint.document.close();
                WinPrint.focus();
                setTimeout(() => {
                  WinPrint.print();
                  WinPrint.close();
                }, 1000);
              })
              .catch(err => {});
          })
          .catch(async err => {});
      }
    }
  }
};
</script>

<style scoped lang="scss">
.success {
  color: limegreen !important;
}

.danger {
  color: red !important;
}
</style>
