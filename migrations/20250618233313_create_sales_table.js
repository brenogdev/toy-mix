/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('sales', function(table) {
    table.increments('id').primary();
    table.integer('cliente_id').unsigned().notNullable().references('id').inTable('clientes').onDelete('CASCADE');
    table.date('data').notNullable();
    table.decimal('valor', 12, 2).notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('sales');
};
