import { defineRule, configure } from "vee-validate";
import {
  required,
  min,
  max,
  regex,
  email,
  alpha,
  confirmed,
  numeric,
} from "@vee-validate/rules";
import i18n from "../i18n";

export default {
  install(app) {
    defineRule("required", required);
    defineRule("email", email);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("regex", regex);
    defineRule("alpha", alpha);
    defineRule("confirmed", confirmed);
    defineRule("numeric", numeric);

    /********* Customized/Crafted rules ************* */
    // At least one special char
    defineRule("special", (value) => {
      const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
      if (!specialChars.test(value)) {
        return false;
      }
      return true;
    });
    // At least one uppercase
    defineRule("upper", (value) => {
      const uppercaseChars = /[A-Z]/;
      if (!uppercaseChars.test(value)) {
        return false;
      }
      return true;
    });
    // At least one lowercase
    defineRule("lower", (value) => {
      const lowercaseChars = /[a-z]/;
      if (!lowercaseChars.test(value)) {
        return false;
      }
      return true;
    });
    // At least one number
    defineRule("num", (value) => {
      const num = /[\d\u0660-\u0669]+/; // Ar or eng numerals
      if (!num.test(value)) {
        return false;
      }
      return true;
    });
    // Only numbers
    defineRule("numOnly", (value) => {
      const num = /^[\d\u0660-\u0669]+$/; // Ar or eng numerals
      if (!num.test(value)) {
        return false;
      }
      return true;
    });
    // Alphabet only
    defineRule("alphaOnly", (value) => {
      const reg = /^[\u0621-\u064AA-Za-z]+$/; // Ar or eng letters
      if (!reg.test(value)) {
        return false;
      }
      return true;
    });

    defineRule("confirmed", (value, [target], ctx) => {
      if (value === ctx.form[target]) {
        return true;
      }
      return false;
    });

    defineRule("integer", (value) => {
      if (value === null || value === undefined || value === "") return true;
      return Number.isInteger(Number(value)) || false;
    });

    defineRule("string", (value) => {
      if (value === null || value === undefined || value === "") return true;
      return typeof value === "string" || false;
    });

    defineRule("boolean", (value) => {
      if (value === null || value === undefined || value === "") return true;
      return (
        typeof value === "boolean" ||
        value === "true" ||
        value === "false" ||
        value === 1 ||
        value === 0 ||
        false
      );
    });

    defineRule("phone", (value, [countryCode]) => {
      if (!value || !countryCode) return false;
      try {
        const phoneNumber = parsePhoneNumber(value, countryCode);
        return phoneNumber.isValid();
      } catch {
        return false;
      }
    });

    configure({
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: true,
      validateOnModelUpdate: true,
      generateMessage: (ctx) => {
        const messages = {
          required: `${i18n.global.t(`fields.${ctx.field}`)} ${i18n.global.t(
            "validation.required"
          )}`,
          confirmed: `${i18n.global.t("validation.confirmed")}`,
          email: `${i18n.global.t("validation.email")}`,
          min: `${i18n.global.t(`fields.${ctx.field}`)} ${i18n.global.t(
            "validation.min",
            { min: ctx.rule.params[0] }
          )}`,
          max: `${i18n.global.t(`fields.${ctx.field}`)} ${i18n.global.t(
            "validation.max",
            { max: ctx.rule.params[0] }
          )}`,
          special: i18n.global.t("validation.special", {
            field: i18n.global.t(`fields.${ctx.field}`),
          }),
          num: i18n.global.t("validation.num", {
            field: i18n.global.t(`fields.${ctx.field}`),
          }),
          numeric: i18n.global.t("validation.numeric", {
            field: i18n.global.t(`fields.${ctx.field}`),
          }),
          alphaOnly: i18n.global.t("validation.alphaOnly", {
            field: i18n.global.t(`fields.${ctx.field}`),
          }),
          upper: i18n.global.t("validation.upper", {
            field: i18n.global.t(`fields.${ctx.field}`),
          }),
          lower: i18n.global.t("validation.lower", {
            field: i18n.global.t(`fields.${ctx.field}`),
          }),
          regex: i18n.global.t("validation.regex", {
            field: i18n.global.t(`fields.${ctx.field}`),
          }),
          integer: i18n.global.t("validation.integer", {
            field: i18n.global.t(`fields.${ctx.field}`),
          }),
          string: i18n.global.t("validation.string", {
            field: i18n.global.t(`fields.${ctx.field}`),
          }),
          boolean: i18n.global.t("validation.boolean", {
            field: i18n.global.t(`fields.${ctx.field}`),
          }),
        };
        return messages[ctx.rule.name] || `${ctx.field} is invalid`;
      },
    });
  },
};
