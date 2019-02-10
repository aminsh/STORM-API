export const outputStatusQuery = baseTable => `SELECT SUM("remaiderQuantity") <= 0 FROM 
                                  (SELECT invoice."productId", invoice.quantity as "invoiceQuantity" , output.quantity as "outputQuantity" ,
                                  COALESCE(invoice.quantity, 0) - COALESCE(output.quantity,0) as "remaiderQuantity"
                                  FROM
                                 (SELECT * FROM "invoiceLines" 
                                  LEFT JOIN  products on "invoiceLines"."productId" = products.id 
                                   WHERE "invoiceId" = ${baseTable}.id AND products."productType" = 'good'
                                  ) as invoice
                                 LEFT JOIN 
                                 (SELECT "productId", quantity FROM inventories as i LEFT JOIN "inventoryLines" as il on i.id = il."inventoryId"
                                 where "invoiceId" = ${baseTable}.id 
                                 and "ioType" = 'outputSale') as output on invoice."productId" = output."productId") as "baseOutput"`;