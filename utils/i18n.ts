import i18n from "i18n";
import { join } from "path";
import { config } from "./config";

i18n.configure({
  locales: [
    "en",
    "vi"
  ],
  directory: join(__dirname, "..", "locales"),
  defaultLocale: "vi",
  retryInDefaultLocale: true,
  objectNotation: true,
  register: global,

  logWarnFn: function (msg) {
    console.log(msg);
  },

  logErrorFn: function (msg) {
    console.log(msg);
  },

  missingKeyFn: function (locale, value) {
    return value;
  },

  mustacheConfig: {
    tags: ["{{", "}}"],
    disable: false
  }
});

i18n.setLocale(config.LOCALE);

export { i18n };
