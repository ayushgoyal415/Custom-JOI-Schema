const Schema = require("./schema");

const options = Schema.string
  .char_min(3)
  .char_max(8)
  .whitespace({ flank: 'trim' })
  .no_spl_char("@", "_")
  .required()

console.log(options);

const schema = new Schema({ name: options });

const { err, val } = schema.validate({ name: "hello" });

console.log(`\u001b[31m${err}`);
console.log(`\u001b[34m${val}`);