import * as mongoose from 'mongoose';

export const NonceSchema = new mongoose.Schema({
  address: { type: String, required: true },
  token_id: { type: String, required: true },
  date: { type: String, required: true },
});

export interface Nonce {
  id: string;
  address: string;
  token_id: string;
  date: string;
}
