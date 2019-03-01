import InputModel from "./Input.json";

const InputTransferBetweenStocks =  {
    title: 'رسید ورود انتقال بین انبار ها',
    model: 'InputTransferBetweenStocks',
    fields: InputModel.fields.concat([
        {
            key: "sourceStock",
            display: "تفصیل انبار مبدا",
            value: 1,
            type: 'DetailAccount'
        }
    ]),
    data: InputModel.data
};
export default InputTransferBetweenStocks;