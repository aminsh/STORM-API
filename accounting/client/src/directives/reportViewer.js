import Guid from 'guid';
import {viewerConfig, addVariable, addTranslates} from '../utilities/stimulsoft';

export  default function reportViewer($rootScope, devConstants) {
    return {
        restrict: 'E',
        template: '<div id="contentViewer" style="direction: ltr"></div>',
        scope: {
            reportData: '=',
            reportFileName: '@',
            reportTitle: '@',
            reportParameters: '@',
            reportDataSourceName: '@'
        },
        link: function (scope, element, attrs) {
            let id = Guid.new(),
                config = viewerConfig(),
                data = {},
                report = new Stimulsoft.Report.StiReport(),
                viewer = new Stimulsoft.Viewer.StiViewer(config, "StiViewer" + id, false);

            $(element).find('div').attr('id', id);

            report.loadFile(`${devConstants.urls.rootUrl}/reports/file/${scope.reportFileName}`);
            viewer.renderHtml(id);

            report.dictionary.variables.add(addVariable({
                name: 'today',
                alias: 'Today',
                category: "general",
                value: $rootScope.today
            }));

            report.dictionary.variables.add(addVariable({
                name: 'currentUser',
                alias: 'Current user',
                category: 'general',
                value: $rootScope.user.name
            }));

            report.dictionary.variables.add(addVariable({
                name: 'branchLogo',
                alias: 'Branch Logo',
                category: "general",
                value: $rootScope.branch.logo
            }));

            report.dictionary.variables.add(addVariable({
                name: 'branchPhone',
                alias: 'Branch Phone',
                category: "general",
                value: $rootScope.branch.phone
            }));

            report.dictionary.variables.add(addVariable({
                name: 'branchMobile',
                alias: 'Branch Mobile',
                category: "general",
                value: $rootScope.branch.phone
            }));

            report.dictionary.variables.add(addVariable({
                name: 'branchPostalCode',
                alias: 'Branch postalCode',
                category: "general",
                value: $rootScope.branch.postalCode
            }));

            report.dictionary.variables.add(addVariable({
                name: 'branchNationalCode',
                alias: 'Branch nationalCode',
                category: "general",
                value: $rootScope.branch.nationalCode
            }));

            report.dictionary.variables.add(addVariable({
                name: 'branchAddress',
                alias: 'Branch address',
                category: "general",
                value: $rootScope.branch.address
            }));

            report.dictionary.variables.add(addVariable({
                name: 'branchTitle',
                alias: 'Branch title',
                category: "general",
                value: $rootScope.branch.name
            }));

            report.dictionary.variables.add(addVariable({
                name: 'reportTitle',
                alias: 'Report title',
                category: "general",
                value: scope.reportTitle
            }));

            report.dictionary.variables.add(addVariable({
                name: 'reportParameters',
                alias: 'Report parameters',
                category: "general",
                value: scope.reportParameters
            }));

            report.dictionary.variables.add(addVariable({
                name: 'branchCity',
                alias: 'Branch city',
                category: "general",
                value: $rootScope.branch.city
            }));

            report.dictionary.variables.add(addVariable({
                name: 'branchFax',
                alias: 'Branch fax',
                category: "general",
                value: $rootScope.branch.fax
            }));

            report.dictionary.variables.add(addVariable({
                name: 'branchRegistrationNumber',
                alias: 'Branch registrationNumber',
                category: "general",
                value: $rootScope.branch.registrationNumber
            }));

            addTranslates(report);

            data[scope.reportDataSourceName] = scope.reportData;

            report.regData("data", "data", data);
            viewer.report = report;
        }
    };
}
