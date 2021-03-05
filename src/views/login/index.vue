<template>
  <div class="home login" id="login">
    <el-row :gutter="10">
      <el-col :span="14">
        <div class="login-logo">
          <img src="../../../public/img/logo2.png" alt="" />
          <div class="el-radio-clents">
            <el-row :gutter="10">
              <el-col v-for="user in users" :key="user.id" :span="12">
                <el-radio v-model="user_id" :label="user.id" border>
                  {{ user.name }}
                </el-radio>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="10">
        <section class="login">
          <div class="login-block">
            <div :class="{ 'login-correct': correct, 'login-wrong': wrong }">
              <div class="login-block__dots aliomas">
                <div class="login-block__dot">
                  <div
                    class="login-block__circle"
                    :class="{
                      'login-block__circle__active': pin_code.length >= 1
                    }"
                  ></div>
                </div>
                <div class="login-block__dot">
                  <div
                    class="login-block__circle"
                    :class="{
                      'login-block__circle__active': pin_code.length >= 2
                    }"
                  ></div>
                </div>
                <div class="login-block__dot">
                  <div
                    class="login-block__circle"
                    :class="{
                      'login-block__circle__active': pin_code.length >= 3
                    }"
                  ></div>
                </div>
                <div class="login-block__dot">
                  <div
                    class="login-block__circle"
                    :class="{
                      'login-block__circle__active': pin_code.length >= 4
                    }"
                  ></div>
                </div>
                <div class="login-block__dot">
                  <div
                    class="login-block__circle"
                    :class="{
                      'login-block__circle__active': pin_code.length >= 5
                    }"
                  ></div>
                </div>
                <div class="login-block__dot">
                  <div
                    class="login-block__circle"
                    :class="{
                      'login-block__circle__active': pin_code.length >= 6
                    }"
                  ></div>
                </div>
              </div>
              <p class="login__text">Введите пароль</p>
              <div class="login-block__numbers">
                <div class="itme_login-block__numbers">
                  <div class="login-block__number" @click="enter('1')">1</div>
                  <div class="login-block__number" @click="enter('2')">2</div>
                  <div class="login-block__number" @click="enter('3')">3</div>
                </div>
                <div class="itme_login-block__numbers">
                  <div class="login-block__number" @click="enter('4')">4</div>
                  <div class="login-block__number" @click="enter('5')">5</div>
                  <div class="login-block__number" @click="enter('6')">6</div>
                </div>
                <div class="itme_login-block__numbers">
                  <div class="login-block__number" @click="enter('7')">7</div>
                  <div class="login-block__number" @click="enter('8')">8</div>
                  <div class="login-block__number" @click="enter('9')">9</div>
                </div>
                <div class="itme_login-block__numbers">
                  <div
                    class="login-block__number"
                    @click="dialogVisible = true"
                  >
                    <i class="el-icon-setting"></i>
                  </div>
                  <div class="login-block__number" @click="enter('0')">0</div>
                  <div class="login-block__number" @click="back()">
                    <i class="el-icon-back"></i>
                  </div>
                </div>
              </div>
              <el-dialog
                title="Изменить адрес сервера"
                :visible.sync="dialogVisible"
                class="limer"
              >
                <el-form label-position="top">
                  <el-form-item
                    label="Введите адрес сервера"
                    :rules="[
                      { required: true, message: 'адрес сервера is required' }
                    ]"
                  >
                    <el-input placeholder="Введите адрес сервера">
                      <template slot="prepend">Http://</template>
                    </el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">Отмена </el-button>
                  <el-button type="primary" @click="dialogVisible = false"
                    >Ок
                  </el-button>
                </span>
              </el-dialog>
            </div>
          </div>
        </section>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import user from "../../api/user";
import auth from "../../api/auth/auth";

export default {
  name: "login",
  data() {
    return {
      pin_code: "",
      dialogVisible: false,
      correct: false,
      wrong: false,
      user_id: ""
    };
  },
  watch: {
    pin_code: {
      handler: function() {
        if (this.pin_code.length === 6) {
          this.login();
        }
      }
    }
  },
  asyncComputed: {
    async users() {
      const { users } = (await user.getUsers()).data;
      this.$loading().close();
      return users;
    }
  },
  methods: {
    async login() {
      const loading = this.$loading({
        customClass: "login-loading",
        lock: true,
        text: "Загрузка",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      let is_loading = true;

      const result = await auth
        .login({
          pin_code: this.pin_code,
          user_id: this.user_id
        })
        .then(res => {
          return res.data.result;
        })
        .catch(err => {
          return err.response;
        });

      if (result.success) {
        loading.close();
        is_loading = false;
        const auth_data = result.data;
        await this.$store.dispatch("auth/login", auth_data);
        await this.$router.push({ name: "home" });
      } else {
        loading.close();
        is_loading = false;
        this.pin_code = "";
        return this.$notify({
          type: "error",
          message: "Неверные учетные данные"
        });
      }
    },

    enter(number) {
      if (this.pin_code.length < 6) {
        this.pin_code += number;
      }
    },
    back() {
      if (this.pin_code.length > 0) {
        this.pin_code = this.pin_code.slice(0, -1);
      }
    }
  }
};
</script>
<style lang="scss">
.login {
  background: #0999d0;
  display: flex;
  height: 100vh;
  /* padding-bottom: 2vh; */
  align-items: center;
  justify-content: space-around;
}

.login-block {
  display: block;
  flex-basis: 60%;
}

.login-block__dots {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 0;
  width: 100%;
}

.login-block__dot {
  width: 1.5em;
  height: 1.5em;
  border: 2px solid #ffffff;
  border-radius: 50%;
  margin-right: 1rem;
  // padding: 0.3em;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-block__dot:last-child {
  margin-right: 0;
}

.login-block__circle {
  width: 70%;
  height: 70%;
  background-color: #fff;
  border-radius: 100%;
  opacity: 0;
}

.login-block__circle__active {
  opacity: 1;
}

.login-block__numbers {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
}

.login-block__number {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-basis: 5.5vw;
  height: 5.5vw;
  width: 5.5vw;
  border-radius: 50%;
  border: 1px solid #fff;
  // background-color: #10163a;
  font-size: 1.5rem;
  // margin-bottom: 0.5rem;
  margin: 0.3rem;
  box-shadow: 2px 2px 4px -2px #80808045;
  cursor: pointer;
  transition: all 0.5s ease;
  color: #fff;
  background: #0076aa;
}

.login-block__number:hover {
  border: 1px solid #00c200;
  color: #ffffff;
}

.login-block__number:after:before {
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.login__text {
  display: block;
  text-align: center;
  color: #ffffff;
  font-size: 1em;
  margin-bottom: 1rem;
}

.login-correct {
  animation: correct 0.9s;
}

.login-wrong {
  animation: wrong 0.9s;
}

.login-loading .el-icon-loading {
  font-size: 4em;
}

.login-loading .el-loading-text {
  font-size: 24px;
}

.login-loading .refresh_button {
  font-size: 3em;
  cursor: pointer;
}

.login-loading .refresh_button i {
  color: white;
}

@keyframes correct {
  20% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-10px);
  }

  60% {
    transform: translateY(20px);
  }

  80% {
    transform: translateY(-10px);
  }
}

@keyframes wrong {
  20% {
    transform: translateX(0);
  }

  40% {
    transform: translateX(-20px);
  }

  60% {
    transform: translateX(40px);
  }

  80% {
    transform: translateX(-20px);
  }
}

.limer {
  .el-dialog {
    width: 95% !important;
  }
}

.home.login .haeder-content {
  z-index: 1999;
  box-shadow: none;
}

.itme_login-block__numbers {
  display: flex;
  width: 100%;
  justify-content: space-around;
}

.login-logo {
  display: flex;
  /* text-align: center; */
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;

  img {
    width: 70%;
  }
}

.el-radio-clents {
  width: 70%;
  margin-top: 4vw;

  .el-radio.is-bordered.is-checked {
    background-color: #056088;

    .el-radio__label {
      color: #fff;
    }
  }

  .el-radio.is-bordered {
    background-color: #0076aa;
    width: 100%;
    text-align: center;
    height: 4vw;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    border: none;
    color: #ffffff;
    margin-top: 1vw;
  }

  .el-radio__inner {
    display: none;
  }
}

.login-logo::after {
  content: "";
  display: block;
  height: 50vw;
  width: 1px;
  background: #ffffff;
  position: absolute;
  right: 0;
}
</style>
