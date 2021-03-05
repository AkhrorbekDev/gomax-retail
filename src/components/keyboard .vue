<template>
  <div class="keyboard">
    <el-row :gutter="20" class="dfJ">
      <el-col :span="6">
        <div class="pras-list">
          <div class="flex1">
            <div class="itme-payments">
              <span>{{ $t("totalPrice") }}</span
              ><b
                >{{ total.totalCostPrice | formatNumber }}
                {{ currencySymbol }}</b
              >
            </div>
            <div class="itme-payments">
              <span>{{ $t("discount") }}</span
              ><b
                >{{ total.totalCostDiscount | formatNumber }}
                {{ currencySymbol }}</b
              >
            </div>
            <div class="itme-payments">
              <span>{{ $t("elements") }}</span
              ><b>{{ total.totalCostElements }}</b>
            </div>
            <div class="itme-payments">
              <span>{{ $t("client") }}</span
              ><b>{{ client.name }}</b>
            </div>
          </div>

          <div class="paymentType">
            <!-- <div class="itme-paymentType">Dollar <b>$</b></div> -->
            <div class="itme-paymentType">
              <b>{{ currencySymbol }}</b>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="13">
        <input
          v-model="type.amount"
          ref="input"
          v-for="type in transaction.payment_types"
          :key="type.payment_type"
          :id="type.payment_type"
          :placeholder="$t(paymentTypeTitles[type.payment_type].name)"
          class="keyboard-input"
          autocomplete="off"
          @input="input"
          @focus="setFocus(type.payment_type)"
        />

        <div class="keyboard-nombeer">
          <el-button @click="append(1)">1</el-button>
          <el-button @click="append(2)">2</el-button>
          <el-button @click="append(3)">3</el-button>
          <el-button @click="append(4)">4</el-button>
          <el-button @click="append(5)">5</el-button>
          <el-button @click="append(6)">6</el-button>
          <el-button @click="append(7)">7</el-button>
          <el-button @click="append(8)">8</el-button>
          <el-button @click="append(9)">9</el-button>
          <el-button @click="append('dot')">.</el-button>
          <el-button @click="append(0)">0</el-button>
          <el-button @click="append('splice')"
            ><i class="el-icon-house"></i
          ></el-button>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="dfJ">
      <el-col :span="19">
        <div class="itme-bottom-keyboard">
          <el-button
            :class="activeButton === 'cash' ? 'activeButton' : ''"
            @click="changePaymentType('cash')"
            >{{ $t("cash") }}
          </el-button>
          <el-button
            :class="activeButton === 'card' ? 'activeButton' : ''"
            @click="changePaymentType('card')"
            >{{ $t("card") }}
          </el-button>
          <el-button
            :class="activeButton === 'combination' ? 'activeButton' : ''"
            type="danger"
            @click="changePaymentType('combination')"
          >
            {{ $t("combination") }}
          </el-button>
          <el-button @click="currencyModal = true">{{
            $t("currency")
          }}</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="dfJ">
      <el-col :span="19">
        <div class="itme-bottom-keyboard">
          <el-button type="success" @click="submit">{{ $t("pay") }}</el-button>
        </div>
      </el-col>
    </el-row>
    <div class="modal-center currency x-right-top">
      <el-dialog
        :visible="currencyModal"
        width="50%"
        :center="true"
        @close="currencyModal = false"
      >
        <el-select
          v-model="currentCurrency"
          value-key="name"
          @change="changeCurrency"
        >
          <el-option
            v-for="currency in currencies"
            :key="currency.id"
            :label="currency.name"
            :value="currency"
          >
          </el-option>
        </el-select>
        <div class="buttonSModal">
          <el-button type="success" @click="currencyModal = false"
            >{{ $t("save") }}
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Total from "../utils/Total";
import auth from "../utils/auth";
import OrderApi from "../api/Order";
import OrderItem from "../models/OrderItem";
import { mapGetters } from "vuex";
import { filter, flatMap, every, forEach, round } from "lodash";

export default {
  data() {
    return {
      transaction: {
        currency_id: 1,
        rate: 1,
        payment_types: [
          {
            payment_type: "cash",
            amount: ""
          }
        ]
      },
      paymentTypeTitles: {
        cash: {
          name: "cash"
        },
        card: {
          name: "card"
        }
      },
      activeButton: "cash",
      values: [],
      backspace: false,
      focusedInput: null,
      currentCurrency: "",
      currencySymbol: "",
      currencyModal: false
    };
  },
  computed: {
    ...mapGetters({
      products: "cart/getProducts",
      currencies: "cart/getCurrency",
      client: "order/getClient"
    }),
    total() {
      const total = Total.totalCost(this.products, this.currentCurrency.rate);
      return total;
    }
  },
  watch: {
    focusedInput: {
      immediate: true,
      handler(newVal) {
        if (this.focusedInput !== newVal) {
          this.values = [];
        }
      }
    },
    total: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.transaction.payment_types[0].amount = this.formatNumber(
            String(newVal.totalCostPrice)
          );
        }
      }
    },
    currencies: {
      immediate: true,
      handler(newVal) {
        const activeCurrency = filter(newVal, "active")[0];
        this.currentCurrency = activeCurrency.name;
        this.currencySymbol = activeCurrency.symbol;
        this.transaction.rate = activeCurrency.rate;
        this.transaction.currency_id = activeCurrency.id;
      }
    },
    currentCurrency: {
      handler(newVal) {
        this.transaction.rate = newVal.rate;
        this.transaction.currency_id = newVal.id;
      }
    }
  },
  methods: {
    formatNumber(value) {
      if (value.indexOf(".") >= 0) {
        let decimal_pos = value.indexOf(".");

        let left_side = value.substring(0, decimal_pos);
        let right_side = value.substring(decimal_pos);

        left_side = left_side
          .replace(/\D/g, "")
          .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

        right_side = right_side
          .replace(/\D/g, "")
          .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        if (right_side.length > 2) {
          if (left_side.charAt(0) === "0") {
            left_side = left_side.slice(1) + right_side.slice(-3, -2);
          } else {
            left_side += right_side.slice(-3, -2);
          }
          left_side.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
          right_side = right_side.slice(-2);
        }
        value = left_side + "." + right_side;
      } else {
        value = value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      }
      return value;
    },
    input(e) {
      const activeInput = filter(this.transaction.payment_types, [
        "payment_type",
        this.focusedInput
      ])[0];
      activeInput.amount = this.formatNumber(e.target.value);
    },
    setFocus(type) {
      this.focusedInput = type;
    },
    append(number) {
      const activeInput = filter(this.transaction.payment_types, [
        "payment_type",
        this.focusedInput
      ])[0];
      if (
        typeof number === "number" ||
        number === "dot" ||
        number === "splice"
      ) {
        switch (number) {
          case "splice":
            activeInput.amount = activeInput.amount.substring(
              0,
              activeInput.amount.length - 1
            );
            break;
          case "dot":
            if (!activeInput.amount.includes(".")) {
              activeInput.amount += ".";
            }
            break;
          default:
            const value = (activeInput.amount += number);
            activeInput.amount = this.formatNumber(value);
            break;
        }
      }
    },
    changePaymentType(type) {
      switch (type) {
        case "cash":
          this.activeButton = type;
          if ((this.transaction.payment_types.length = 2)) {
            this.transaction.payment_types[0].payment_type = type;
            this.transaction.payment_types[0].amount = this.formatNumber(
              String(this.total.totalCostPrice)
            );
            this.transaction.payment_types.pop();
            return;
          }
          this.transaction.payment_types[0].payment_type = type;
          break;
        case "card":
          this.activeButton = type;
          if ((this.transaction.payment_types.length = 2)) {
            this.transaction.payment_types[0].payment_type = type;
            this.transaction.payment_types[0].amount = this.formatNumber(
              String(this.total.totalCostPrice)
            );
            this.transaction.payment_types.pop();
            return;
          }
          this.transaction.payment_types[0].payment_type = type;
          break;
        case "combination":
          this.activeButton = type;
          this.transaction.payment_types = [
            {
              payment_type: "cash",
              amount: ""
            },
            {
              payment_type: "card",
              amount: ""
            }
          ];
          break;
      }
    },
    submit() {
      const paymentMessages = {
        cash: {
          message: this.$t("surrender")
        },
        card: {
          message: this.$t("paymentMessageCart")
        }
      };
      let message;
      const transactions = this.transaction;
      transactions.payment_types = flatMap(
        transactions.payment_types,
        payment_type => {
          return {
            ...payment_type,
            amount:
              payment_type.amount !== 0
                ? Number(payment_type.amount.replace(/ /gi, ""))
                : 0
          };
        }
      );

      const hasEmptyAmount = every(transactions.payment_types, "amount");
      if (!hasEmptyAmount) {
        this.$notify({
          type: "error",
          message: "Введите сумму.",
          showClose: true
        });
      } else {
        let totalPaymentSumm = 0;
        forEach(transactions.payment_types, function(item) {
          totalPaymentSumm += item.amount;
        });
        if (totalPaymentSumm >= this.total.totalCostPrice) {
          const includeCashType = flatMap(
            transactions.payment_types,
            "payment_type"
          );
          if (includeCashType.length > 1) {
            message = paymentMessages["cash"].message;
          } else {
            message = paymentMessages[includeCashType].message;
          }
          const deliveryPrice = round(
            totalPaymentSumm - this.total.totalCostPrice,
            2
          );
          message = message + "  " + deliveryPrice + "  " + this.currencySymbol;
        } else {
          return this.$notify({
            type: "error",
            message: "Введите сумму больше.",
            showClose: true
          });
        }

        this.$confirm("", message, {
          confirmButtonClass: "success",
          confirmButtonText: this.$t("save"),
          cancelButtonText: this.$t("cancel"),
          center: true
        })
          .then(async () => {
            if (
              transactions.payment_types[0].payment_type === "cash" &&
              !transactions.payment_types[1]
            ) {
              console.log(transactions, 1111);
              transactions.payment_types[0].amount = this.total.totalCostPrice;
            }
            const loading = this.$loading({
              customClass: "login-loading",
              lock: true,
              text: "Загрузка",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            let is_loading = true;
            const order = await this.$store.getters["order/getOrder"];
            order.items = OrderItem.rawResources(this.products);
            order.transactions = transactions;
            await OrderApi.createOrderWithTransaction(order)
              .then(async response => {
                if (response.data.result.success) {
                  const createResponse = response;
                  this.$confirm(this.$t("printMessage"), {
                    confirmButtonClass: "success",
                    confirmButtonText: this.$t("yes"),
                    cancelButtonText: this.$t("no"),
                    center: true
                  })
                    .then(async () => {
                      const deliveryPrice = round(
                        totalPaymentSumm - this.total.totalCostPrice,
                        2
                      );
                      const data = {
                        retail_order_id:
                          createResponse.data.result.data.retailOrder.id,
                        is_with_transaction: true,
                        change: deliveryPrice
                      };
                      await OrderApi.getCashBox(data, true)
                        .then(async response => {
                          loading.close();
                          is_loading = false;
                          await auth.removeClientData();
                          await this.$store.dispatch("cart/clear");
                          await this.$store.dispatch("order/getCount");
                          await this.$store.dispatch("order/clear");
                          this.$message({
                            type: "success",
                            message: createResponse.data.result.message,
                            showClose: true
                            // position: "bottom-right",
                          });
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
                          this.$emit("c-change", "home");
                        })
                        .catch(err => {
                          loading.close();
                          is_loading = false;
                        });
                    })
                    .catch(async err => {
                      loading.close();
                      is_loading = false;
                      await auth.removeClientData();
                      await this.$store.dispatch("cart/clear");
                      await this.$store.dispatch("order/getCount");
                      await this.$store.dispatch("order/clear");
                      this.$message({
                        type: "success",
                        message: createResponse.data.result.message,
                        showClose: true
                        // position: "bottom-right",
                      });
                      this.$emit("c-change", "home");
                    });
                }
              })
              .catch(err => {
                loading.close();
                is_loading = false;
                if (err.response && err.response.data.error.code === 422) {
                  let ms = "";
                  for (const key in err.response.data.validation_errors) {
                    if (
                      err.response.data.validation_errors.hasOwnProperty(key)
                    ) {
                      const element = err.response.data.validation_errors[key];
                      ms += element.join("<br>") + "<br>";
                    }
                  }
                  this.$message({
                    dangerouslyUseHTMLString: true,
                    type: "warning",
                    title: this.$t("warning"),
                    message: ms,
                    duration: 15000,
                    showClose: true
                  });
                } else {
                  this.$message({
                    dangerouslyUseHTMLString: true,
                    type: "warning",
                    message: err.message,
                    showClose: true
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
    changeCurrency(e) {
      this.currencyModal = false;
      this.transaction.rate = e.rate;
      this.transaction.currency_id = e.id;
      this.currencySymbol = e.symbol;
    }
  },
  mounted() {
    this.setFocus("cash");
  }
};
</script>

<style>
.keyboard-input {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  height: 6.5vw;
  font-size: 3vw;
  text-align: right;
  border-radius: 0px;
}

.keyboard-input:hover {
  border-color: #c0c4cc;
}
</style>
