import {createAction, props} from "@ngrx/store";
import {Invoice} from "../../models/invoice.model";

export const LoadInvoices = createAction('[Invoices] load Invoices list');
export const LoadInvoicesFailed = createAction('[Invoices] load Invoices list');
export const LoadInvoicesSuccess = createAction('[Invoices] load Invoices list successes', props<{invoices: Invoice[]}>());

export const AddInvoice = createAction('[Invoices] Add Invoice', props<{invoice: Invoice}>());
export const AddInvoiceFailed = createAction('[Invoices] Add Invoice', props<{invoice: Invoice}>());
export const AddInvoiceSuccess = createAction('[Invoices] Add Invoice', props<{invoice: Invoice}>());

export const RemoveInvoice = createAction('[Invoices] Remove Invoice', props<{invoice: Invoice}>());
export const RemoveInvoiceFailed = createAction('[Invoices] Remove Invoice', props<{invoiceId: number}>());
export const RemoveInvoiceSuccess = createAction('[Invoices] Remove Invoice', props<{invoice: Invoice}>());

export const UpdateInvoice = createAction('[Invoices] Update Invoice', props<{invoice: Invoice}>());
export const UpdateInvoiceFailed = createAction('[Invoices] Update Invoice', props<{invoice: Invoice}>());
export const UpdateInvoiceSuccess = createAction('[Invoices] Update Invoice', props<{invoice: Invoice}>());

export const SetCurrentInvoice = createAction('[Invoices] Set Current Invoice', props<{invoiceId: number}>());
