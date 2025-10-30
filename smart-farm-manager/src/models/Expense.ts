import { Schema, model, models, Document, Types } from "mongoose";

export interface IExpense extends Document {
  category: string;
  amount: number;
  date: Date;
  description?: string;
  farmer_id: Types.ObjectId;
}

const ExpenseSchema = new Schema<IExpense>({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  farmer_id: { type: Schema.Types.ObjectId, ref: "Farmer", required: true },
});

const Expense = models.Expense || model<IExpense>("Expense", ExpenseSchema);
export default Expense;
