const string = {
  required ()  { this.req = true; return this; },
  char_min (n)  { this.c_min = n; return this; },
  char_max (n)  { this.c_max = n; return this; },
  invalid (...A)  { this.disallow = A; return this; },
  no_spl_char (...A)  {this.no_spl = A || []; return this; },
  whitespace({ flank, middle, consecutive }) {
    this.wsp = { flank, middle, consecutive }; return this;
  }
}; // prettier-ignore

const number = {
  required ()  { this.req = true; return this; },
  char_min (n)  { this.c_min = n; return this; },
  char_max (n)  { this.c_max = n; return this; },
  num_min (n)  { this.n_min = n; return this; },
  num_max (n)  { this.n_max = n; return this; },
  invalid (...A)  { this.disallow = A; return this; },
}; // prettier-ignore

const any = {
  required ()  { this.req = true; return this; },
  not_null ()  { this.nn = true; return this; },
  char_min (n)  { this.c_min = n; return this; },
  char_max (n)  { this.c_max = n; return this; },
  num_min (n)  { this.n_min = n; return this; },
  num_max (n)  { this.n_max = n; return this; },
  invalid (...A)  { this.disallow = A; return this; },
  whitespace (obj)  { this.wsp = obj; return this; },
  no_spl_char (...A)  {this.no_spl = A || []; return this; }
}; // prettier-ignore

Object.defineProperty(string, "type", { value: "string" });
Object.defineProperty(number, "type", { value: "number" });
Object.defineProperty(any, "type", { value: "any" });

module.exports = { string, number, any };
