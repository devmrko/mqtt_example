var obj_NgApp = angular.module('app_gridTest', []);

obj_NgApp.controller('ctr_gridTest', function ($scope, $http, $document, $window) {

    var baseUrl = '/mqttSubscriber';

    $scope.curPage = 1;

    $scope.editViewBool = false;
    $scope.deviceList = [];            

    $document.ready(function () {
        //$scope.searchClick();
        google.charts.load('current', { packages: ['corechart', 'line'] });
        google.charts.setOnLoadCallback(drawBasic);
            
    });
    
    $scope.chartTest = function () {
        var ctrUrl = baseUrl + '/searchChartData';

        var dataObj = {};
        
        $http.post(ctrUrl, dataObj).success(function (returnData) {
            // $scope.chartDobj = 
            // drawBasic();
             $scope.deviceList = [];
            for(var i = 0; i < Object.keys(returnData.chartDobj).length; i++) {
                $scope.deviceList[$scope.deviceList.length] = Object.keys(returnData.chartDobj)[i];
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
            
        }).error(function (data, status, headers, config) {
            alert('error: ' + status);
        });
        
    }
    
    function drawBasic() {

        var data = new google.visualization.DataTable();
        data.addColumn('number', 'X');
        data.addColumn('number', 'Dogs');
        var testData = [
            [0, 0],   [1, 10],  [2, 23],  [3, 17],  [4, 18],  [5, 9],
        [6, 11],  [7, 27],  [8, 33],  [9, 40],  [10, 32], [11, 35],
        [12, 30], [13, 40], [14, 42], [15, 47], [16, 44], [17, 48],
        [18, 52], [19, 54], [20, 42], [21, 55], [22, 56], [23, 57],
        [24, 60], [25, 50], [26, 52], [27, 51], [28, 49], [29, 53],
        [30, 55], [31, 60], [32, 61], [33, 59], [34, 62], [35, 65],
        [36, 62], [37, 58], [38, 55], [39, 61], [40, 64], [41, 65],
        [42, 63], [43, 66], [44, 67], [45, 69], [46, 69], [47, 70],
        [48, 72], [49, 68], [50, 66], [51, 65], [52, 67], [53, 70],
        [54, 71], [55, 72], [56, 73], [57, 75], [58, 70], [59, 68],
        [60, 64], [61, 60], [62, 65], [63, 67], [64, 68], [65, 69],
        [66, 70], [67, 72], [68, 75], [69, 80] 
        ];

        //data.addRows($scope.chartDobj);
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

    function searchHanlder() {
        var ctrUrl = baseUrl + '/search';

        var dataObj = {};
        addDataObj(jQuery, dataObj, "searchText", $scope.searchText);
        addDataObj(jQuery, dataObj, "pageNo", $scope.curPage);

        $http.post(ctrUrl, dataObj).success(function (returnData) {
            $scope.test_cols = returnData.test_cols;


        }).error(function (data, status, headers, config) {
            alert('error: ' + status);
        });
    }

    $scope.nextClick = function () {
        $scope.cancleClick();
        if ($scope.test_cols.length == 0) {
            alert('There is no more page.')
        } else {
            $scope.curPage = $scope.curPage + 1;
            searchHanlder();
        }
    }

    $scope.newPostClick = function () {
        $scope.editViewBool = true;
        $scope.sel_contents = '';
        $scope.sel_tags = '';
        $scope.sel_id = '';
    }

    $scope.rowClick = function (idx) {
        if ($scope.editViewBool == true && $scope.selInx == idx) {
            $scope.editViewBool = false;
        } else {
            $scope.editViewBool = true;
            $scope.selInx = idx;
            $scope.sel_contents = $scope.test_cols[idx].contents;
            $scope.sel_tags = $scope.test_cols[idx].tags;
            $scope.sel_id = $scope.test_cols[idx]._id;
        }
    }

    $scope.cancleClick = function () {
        $scope.editViewBool = false;
    }

    function addDataObj(jQuery, dataObj, keyNm, keyVal) {
        eval("jQuery.extend(dataObj, {" + keyNm + " : keyVal})");
    }

});