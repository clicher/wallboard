'use strict';

/* Controllers */
/* Controllers */

angular.module('myApp.controllers', []).
    controller('AppCtrl',function ($scope, socket) {
        socket.on('send:name', function (data) {
            $scope.name = data.name;
        });
    }).
    controller('MyCtrl1',function ($scope, $http, locations, Maps) {
        $scope.markers = locations;
        console.log($scope.markers);
        console.log($scope.markers);

        $scope.london = {
            lat: 37.996162679728116,
            lng: -95.44921875,
            zoom: 5
        }
        $scope.layers = {
            baselayers: {
                wgc: {
                    name: "Esri_WorldGrayCanvas",
                    type: "xyz",
                    url: "http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
                    layerOptions: {
                        attribution:'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                    }
                }
            }
        }

        var Esri_WorldGrayCanvas = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
            maxZoom: 16
        });

        setInterval(function() {
            Maps.async().then(function(res) {
                var keys = Object.keys(res);
                var len = keys.length;
                console.log(len);
                console.log(res);
                keys = Object.keys($scope.markers);
                len = keys.length;
                console.log(len);
                console.log($scope.markers);
                console.log('running update!')
                $scope.markers = res;
            })
        }, 20000);

    }).
    controller('rtStatsController', function($scope, agentInfo, queueInfo, $filter, RTQueue, RTStats) {



        //NG-Model Used By Agent Listing On Left of Page
        //Initially Set to agentInfo from Route Resolve
        $scope.aspAgents = agentInfo;
        $scope.aspQueues = queueInfo;

        console.log($scope.aspAgents);
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //CHART DATA - Queue Daily Inbound Calls
        $scope.removedQueues = ['Outbound'];
        $scope.qdicLabels = [];
        $scope.qdicData = [[]];
        $scope.qdicAcceptedColors = [
            {
                backgroundColor: "rgba(33, 150, 243,1.0)",
                borderColor: "rgba(33, 150, 243,1.0)",
                borderWidth: 0
            }
        ];
        $scope.qdicSeries = ['Accepted Inbound Calls Per Queue'];
        $scope.qdicOptions = {
            scales: {
                xAxes: [
                    {
                        gridLines: {
                            display: true
                        }
                    }
                ],
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: {
                            beginAtZero: true
                        },
                        barThickness: 3
                    }
                ]
            }
        };
        //Push Queue Names and Data to the Chart Variables Minus the $scope.removedQueues Variable
        angular.forEach($filter('removeArrayOfQueues')($scope.aspQueues, $scope.removedQueues), function(value, index) {
            $scope.qdicLabels.push( value['queue-name'] );
            $scope.qdicData[0].push(value['day-accepted']);
        });
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //CHART DATA - Agent Status'
        $scope.ascLabels = [];
        $scope.ascData = [[], [], []];
        $scope.ascAcceptedColors = [
            {
                backgroundColor: "rgba(76, 175, 80,1.0)",
                borderColor: "rgba(76, 175, 80,1.0)",
                borderWidth: 0
            }, {
                backgroundColor: "rgba(255, 193, 7,1.0)",
                borderColor: "rgba(255, 193, 7,1.0)",
                borderWidth: 0
            },{
                backgroundColor: "rgba(244, 67, 54,1.0)",
                borderColor: "rgba(244, 67, 54,1.0)",
                borderWidth: 0
            }
        ];
        //Push Queue Names and Data to the Chart Variables Minus the $scope.removedQueues Variable
        angular.forEach($filter('removeArrayOfQueues')($scope.aspQueues, $scope.removedQueues), function(value, index) {
            $scope.ascLabels.push( value['queue-name'] );
            $scope.ascData[0].push(value['agent-count-waitTransact']);
            $scope.ascData[1].push(value['agent-count-workOffline']);
            $scope.ascData[2].push(value['agent-count-onBreak']);
        });
        $scope.ascSeries = ['Available', 'Working Offline', 'Break'];
        $scope.ascOptions = {
            scales: {
                xAxes: [
                    {
                        gridLines: {
                            display: true,
                            tickMarkLength: 15 
                        }
                    }
                ],
                yAxes: [
                    {
                        zeroLineWidth: 0,
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: {
                            maxTicksLimit: 3,
                            stepSize: 2,
                            beginAtZero: true
                        },
                        gridLines: {
                          drawTicks: false
                        },
                        barThickness: 3
                    }
                ]
            }
        };

        //console.log($scope.ascLabels);

        function updateQueueCharts() {
            angular.forEach($filter('removeArrayOfQueues')($scope.aspQueues, $scope.removedQueues), function(value, index) {
                $scope.qdicLabels[index] = value['queue-name'];
                $scope.qdicData[0][index] = value['day-accepted'];

                $scope.ascLabels[index] = value['queue-name'];
                $scope.ascData[0][index] = value['agent-count-waitTransact'];
                $scope.ascData[1][index] = value['agent-count-workOffline'];
                $scope.ascData[2][index] = value['agent-count-onBreak'];
            });
        };


        setInterval(function() {
            RTStats.async().then(function(res) {
                for(var i = 0; i < res.length; i++) {
                    var newTime = timerConversion(res[i]['time-in-status']);
                    res[i]['time-in-status'] = newTime;
                }
                $scope.aspAgents = res;
            })
            RTQueue.async().then(function(res) {
                $scope.aspQueues = res;
                updateQueueCharts();
            })
        }, 3000);



        //Convert Second from Server to Current Epoch Minus Milliseconds in Status
        function timerConversion(time) {
            var d = new Date().getTime();
            return (d - (time * 1000));
        };

    });

