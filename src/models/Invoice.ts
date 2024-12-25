import mongoose, { Document, Schema } from 'mongoose';

export interface IInvoice extends Document {
  company: Schema.Types.ObjectId;
  subscription: Schema.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

const invoiceSchema = new Schema<IInvoice>({
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  subscription: {
    type: Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'cancelled'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    required: true
  },
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    total: Number
  }]
}, {
  timestamps: true
});