import { pgTable, serial, varchar, text, numeric, timestamp } from 'drizzle-orm/pg-core';

export const cars = pgTable('cars', {
  id: serial('id').primaryKey(),
  make: varchar('make', {length:100}).notNull(),
  model: text('model',  {length:100}).notNull(),
  year: text('year', {length:4}).notNull(),
  price : numeric('price', { precision: 10, scale: 2 }).notNull(),
  cretedAt: timestamp('created_at').defaultNow().notNull(),  
})