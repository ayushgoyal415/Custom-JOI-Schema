const opt = require("./opt");

class Schema {
  constructor(obj) {
    this.prop = Object.keys(obj)[0];
    this.opt = Object.values(obj)[0];
  }

  static string = opt.string;
  static number = opt.number;
  static any = opt.any;

  fx = {
    req: () => this.prop === this.key && this.value !== undefined,
    type: () => typeof this.value === this.opt.type,
    nn: () => this.value !== null,
    c_min: () => new RegExp(`(?=^.{${this.opt.c_min},}$)`).test(this.value),
    c_max: () => new RegExp(`(?=^.{0,${this.opt.c_max}}$)`).test(this.value),
    disallow: () => this.opt.disallow.includes(this.value),
    wsp_no_flank: () => /(?!\s|.*\s$)^.*$/.test(this.value),
    wsp_no_middle: () => /(?!.+\s.+$)^.*$/.test(this.value),
    wsp_no_consecutive: () => /(?!.*\s\s)^.*$/.test(this.value),
    n_min: () => this.value >= this.opt.n_min,
    n_max: () => this.value <= this.opt.n_max,
    no_spl: () => {
      const chars = [ "!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
        ":", ";", "<", "=", ">", "?", "@", "[", "\\", "]", "^", "_", "`", "{", "|", "}", "~" ]; // prettier-ignore

      for (let i of this.opt.no_spl)
        if (i !== "\\" && chars.includes(i)) chars.splice(chars.indexOf(i), 1);
      if (!new RegExp(`(?!.*[${chars.join("")}])^.*$`).test(this.value))
        return false;
      if (!this.opt.no_spl.includes("\\"))
        return /(?!.*\\)^.*$/.test(this.value);
      return true;
    }
  };

  msg = {
    req: () => `${this.prop} is required`,
    type: () => `${this.key} must be a type of ${this.opt.type}`,
    nn: () => `${this.key} cannot be null`,
    c_min: () =>
      `${this.key} must be at least ${this.opt.c_min} characters long`,
    c_max: () =>
      `${this.key} must not be more than ${this.opt.c_max} characters long`,
    disallow: () => `${this.key} cannot be set as ${this.value}`,
    wsp_no_flank: () => `${this.key} must not contain whitespace at flanks`,
    wsp_no_middle: () => `${this.key} must not middle whitespace`,
    wsp_no_consecutive: () => `${this.key} must not consecutive whitespace`,
    n_min: () =>
      `${this.key} must be greater than or equal to ${this.opt.n_min}`,
    n_max: () => `${this.key} must be not be greater than ${this.opt.n_max}`,
    no_spl: () =>  this.opt.no_spl.length === 0
        ? `${this.key} must not contain any special characters`
        : `${this.key} can only contain these special characters ${this.opt.no_spl.join(" ")}` // prettier-ignore
  };

  validate(obj) {
    this.key = Object.keys(obj)[0];
    this.value = Object.values(obj)[0];

    if (this.opt.req && !this.fx.req()) return { err: this.msg.req() };
    if (this.opt.type !== "any" && !this.fx.type())
      return { err: this.msg.type() };

    if (typeof this.value === "string") {
      if (this.opt.wsp) {
        if (this.opt.wsp.flank === "trim") this.value = this.value.trim();
        if (this.opt.wsp.flank === false && !this.fx.wsp_no_flank())
          return { err: this.msg.wsp_no_flank() };
        if (this.opt.wsp.middle === false && !this.fx.wsp_no_middle())
          return { err: this.msg.wsp_no_middle() };
        if (this.opt.wsp.consecutive === false && !this.fx.wsp_no_consecutive())
          return { err: this.msg.wsp_no_consecutive() };
      }
      if (this.opt.no_spl && !this.fx.no_spl())
        return { err: this.msg.no_spl() };
    }

    if (typeof this.value === "number") {
      if (this.opt.n_min && !this.fx.n_min()) return { err: this.msg.n_min() };
      if (this.opt.n_max && !this.fx.n_max()) return { err: this.msg.n_max() };
    }

    if (typeof this.value === "number" || typeof this.value === "string") {
      if (this.opt.c_min && !this.fx.c_min()) return { err: this.msg.c_min() };
      if (this.opt.c_max && !this.fx.c_max()) return { err: this.msg.c_max() };
    }

    if (this.opt.nn && !this.fx.nn()) return { err: this.msg.nn() };
    if (this.opt.disallow && this.fx.disallow())
      return { err: this.msg.disallow() };

    return { val: this.value };
  }
}

module.exports = Schema;
