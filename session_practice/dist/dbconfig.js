'use strict';

var _require = require('pg');

const Pool = _require.Pool;


let pool;

pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'practice',
  password: 'postgres',
  port: 5432
});

module.exports = { pool: pool };
//# sourceMappingURL=dbconfig.js.map