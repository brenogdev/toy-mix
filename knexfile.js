/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST || '127.0.0.1',
      user: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASSWORD || 'postgres',
      database: process.env.PG_DATABASE || 'toy_mix',
      port: process.env.PG_PORT || 5433
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  test: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST || '127.0.0.1',
      user: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASSWORD || 'postgres',
      database: process.env.PG_DATABASE || 'toy_mix_test',
      port: process.env.PG_PORT || 5433
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }

};
