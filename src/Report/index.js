import { ReportAccountsQuery } from "./ReportAccountsQuery";
import { ReportBalanceQuery } from "./ReportBalanceQuery";
import { ReportBalanceSheetQuery } from "./ReportBalanceSheetQuery";
import { ReportConfig } from "./ReportConfig";
import { ReportCustomerReceiptsQuery } from "./ReportCustomerReceiptsQuery";
import { ReportFinancialOfficesQuery } from "./ReportFinantialOfficesQuery";
import { ReportInventoryTurnoverQuery } from "./ReportInventoryTurnoverQuery";
import { ReportInvoiceQuery } from "./ReportInvoiceQuery";
import { ReportJournalQuery } from "./ReportJournalQuery";
import { ReportProductQuery } from "./ReportProductQuery";
import { ReportProfitLossStatementQuery } from "./ReportProfitLossStatementQuery";
import { ReportSaleQuery } from "./ReportSaleQuery";
import { ReportSeasonalQuery } from "./ReportSeasonalQuery";
import { ReportTreasuryChequeQuery } from "./ReportTreasuryChequeQuery";
import { ReportTurnoverQuery } from "./ReportTurnoverQuery";
import { ReportInventoryInputsOutputsTurnoverQuery } from "./ReportInventoryInputsOutputsTurnoverQuery";

import { ReportInventory } from "./ReportInventory";
import { InventoryReportQuery } from "./InventoryReportQuery";

import "./ReportController";
import "./InventoryReportController";

export function register(container) {

    container.bind("ReportAccountsQuery").to(ReportAccountsQuery);
    container.bind("ReportBalanceQuery").to(ReportBalanceQuery);
    container.bind("ReportBalanceSheetQuery").to(ReportBalanceSheetQuery);
    container.bind("ReportConfig").to(ReportConfig);
    container.bind("ReportCustomerReceiptsQuery").to(ReportCustomerReceiptsQuery);
    container.bind("ReportFinancialOfficesQuery").to(ReportFinancialOfficesQuery);
    container.bind("ReportInventoryTurnoverQuery").to(ReportInventoryTurnoverQuery);
    container.bind("ReportInvoiceQuery").to(ReportInvoiceQuery);
    container.bind("ReportJournalQuery").to(ReportJournalQuery);
    container.bind("ReportProductQuery").to(ReportProductQuery);
    container.bind("ReportProfitLossStatementQuery").to(ReportProfitLossStatementQuery);
    container.bind("ReportSaleQuery").to(ReportSaleQuery);
    container.bind("ReportSeasonalQuery").to(ReportSeasonalQuery);
    container.bind("ReportTreasuryChequeQuery").to(ReportTreasuryChequeQuery);
    container.bind("ReportTurnoverQuery").to(ReportTurnoverQuery);
    container.bind("ReportInventoryInputsOutputsTurnoverQuery").to(ReportInventoryInputsOutputsTurnoverQuery);
    container.bind("ReportInventory").to(ReportInventory);

    container.bind("InventoryReportQuery").to(InventoryReportQuery);
}