// start our angular module and inject angular-chartist
angular.module('chartCtrl', ['angular-chartist'])

    .controller('ChartistController', ['$scope', '$interval', '$timeout',
        function($scope, $interval, $timeout) {
          this.chartType = 'Line';
          this.data = null;
          this.responsiveOptions = null;
          this.options = {
            fullWidth: true,
            chartPadding: {
              right: 40
            }
          };
          //this.data = {
          //  labels: ['10:39:37 AM', '10:40:24 AM', '10:40:55 AM', '10:42:06 AM', '10:42:43 AM', '10:43:08 AM', '10:43:37 AM', '10:44:17 AM', '10:44:40 AM'],
            //series: [[1, 10, 5, 7, 5, 6, 2, 7, 8]]
          //};
          
          this.data = {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                series: [
                    [0, 1, 2, 4, 7, 6, 9, 10, 8, 10, 14, 13, 16, 14, 17, 19, 20, 31, 32, 26, 36, 28, 31, 40, 26, 26, 43, 47, 55, 30],
                    [0, 1, 2, 4, 4, 6, 6, 13, 9, 10, 16, 18, 21, 16, 16, 16, 31, 17, 27, 23, 31, 29, 35, 39, 30, 32, 26, 43, 51, 46]
                ]
            };
        }
    ]);
