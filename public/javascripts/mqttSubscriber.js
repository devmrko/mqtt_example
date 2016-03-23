var obj_NgApp = angular.module('app_gridTest', []);

obj_NgApp.controller('ctr_gridTest', function ($scope, $http, $document, $window) {

    var baseUrl = '/mqttSubscriber';

    $scope.curPage = 1;

    $scope.editViewBool = false;
    $scope.deviceList = [];

    $document.ready(function () {
        google.charts.load('current', { packages: ['corechart', 'line'] });
        google.charts.setOnLoadCallback(drawBasic);
    });

    $scope.chartTest = function () {
        var ctrUrl = baseUrl + '/searchChartData';
        var dataObj = {};
        $http.post(ctrUrl, dataObj).success(function (returnData) {
            $scope.deviceList = [];
            for (var i = 0; i < Object.keys(returnData.chartDobj).length; i++) {
                $scope.deviceList[$scope.deviceList.length] = Object.keys(returnData.chartDobj)[i];
            }
            setTimeout(function () {
                for (var i = 0; i < Object.keys(returnData.chartDobj).length; i++) {
                    var data = new google.visualization.DataTable();
                    var options = {
                        hAxis: {
                            title: 'Time'
                        },
                        vAxis: {
                            title: 'device: ' + Object.keys(returnData.chartDobj)[i]
                        }
                    };
                    data.addColumn('number', 'X');
                    data.addColumn('number', 'gyro-x');
                    data.addColumn('number', 'gyro-y');
                    data.addColumn('number', 'gyro-z');

                    data.addRows(eval('returnData.chartDobj.' + Object.keys(returnData.chartDobj)[i]));
                    var chart = new google.visualization.LineChart(document.getElementById('chart_div' + i));
                    chart.draw(data, options);
                }
                
            }, 1000);

        }).error(function (data, status, headers, config) {
            alert('error: ' + status);
        });

    }

    function drawBasic() {

        var data = new google.visualization.DataTable();
        data.addColumn('number', 'X');
        data.addColumn('number', 'Dogs');
        var testData = [];
        data.addRows(testData);
        var options = {
            hAxis: {
                title: 'Time'
            },
            vAxis: {
                title: 'Popularity'
            }
        };
        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }

    $scope.searchClick = function () {
        $scope.curPage = 1;
        searchHanlder();
    }

    function addDataObj(jQuery, dataObj, keyNm, keyVal) {
        eval("jQuery.extend(dataObj, {" + keyNm + " : keyVal})");
    }

});