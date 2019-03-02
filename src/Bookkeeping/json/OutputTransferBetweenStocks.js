import OutputModel from "./Output.json";

const OutputTransferBetweenStocks =  {
    title: 'حواله خروجی انتقال بین انبار ها',
    model: 'OutputTransferBetweenStocks',
    fields: OutputModel.fields.concat([
        {
            key: "destinationStock",
            display: "تفصیل انبار مقصد",
            value: 1,
            type: 'DetailAccount'
        }
    ]),
    data: OutputModel.data
};
export default OutputTransferBetweenStocks;