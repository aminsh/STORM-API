
export default function (ADMdtpProvider) {
    ADMdtpProvider.setOptions({
        calType: 'jalali',
        dtpType: 'date',
        format: 'YYYY/MM/DD',
        default: 'today',
        autoClose: true
    });
}
