import messages from "./messages";
import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

const i18n = {
  locale: "en-EN",
  fallbackLocale: "en-EN",
  messages: {
    "en-EN": messages.en,
    "ru-RU": messages.ru
  }
};

export default i18n;
