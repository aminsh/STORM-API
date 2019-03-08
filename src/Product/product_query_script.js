export function productInventory(fiscalPeriodId, branchId, productId) {
    return `
        SELECT 
          SUM (CASE WHEN 
            "inventoryType" = 'input' THEN quantity
          ELSE
            quantity * -1
          END)
        FROM 
        inventories as i
        LEFT JOIN "inventoryLines" as il ON i.id = il."inventoryId"
        WHERE "fiscalPeriodId" = '${fiscalPeriodId}'
        AND i."branchId" = '${branchId}'
        AND "productId" = ${productId}
    `;
}