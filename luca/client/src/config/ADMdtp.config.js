
export default function (ADMdtpProvider, ChartJsProvider) {
    ADMdtpProvider.setOptions({
        calType: 'jalali',
        dtpType: 'date',
        format: 'YYYY/MM/DD',
        //default: 'today',
        autoClose: true
    });

    ChartJsProvider.setOptions({ defaultFontFamily: "'IRANSans', 'Segoe UI', 'Helvetica Neue', 'Helvetica', 'Arial, sans-serif'",
        colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
}

import Chart from 'chart.js';
Chart.defaults.global.defaultFontFamily="'IRANSans'";
Chart.defaults.global.scaleLabel = "<%=kendo.toString(value, '#,##0;(#,##0)');%>";
Chart.defaults.global.tooltipTemplate = "<%if (label){%><%=label%>: <%}%><%=kendo.toString(label, '#,##0;(#,##0)')%>";
