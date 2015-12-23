



app = angular.module("demo", []);

app.controller("demoCtrl", function($scope) {

    $scope.serverUrl = "http://10.86.19.34";
    $scope.connected = false;
    
    $scope.substr = function(str) {
        return str.substring(0,13) + "...";
    }

    $scope.setMessage = function(newMessage) {
        $scope.message =  (JSON.parse(JSON.stringify(newMessage)));
    }

    $scope.reconnect = function() {
        if ($scope.g) {
            $scope.g.close();            
        }
        $scope.connected = false;

        $scope.g = new Guble($scope.serverUrl);
        $scope.g.connect("webapp");
        
        $scope.g.onOpen(function() {
            $scope.connected = true;            
        });
    }
    
    $scope.send = function(message) {
        $scope.g.sendMessage("/gcm/broadcast", JSON.stringify(message));
    }
    
    $scope.predefinedMessages = [
        {
            "type": "marketing",
            "data": {
                "title": "Neue Produkte in ihrer Einkaufliste",
                "message": "Es wurden neue Produkte zu ihrer Einkaufsliste hinzugef\u00fcgt.",
                "link": "einkaufsliste"
            }
        },
        {
            "type": "marketing",
            "data": {
                "title": "Payback update!",
                "message": "Ihnen wurden neue Payback-Punkte gutgeschrieben!",
                "link": "payback"
            }
        },
        {
            "type": "marketing",
            "data": {
                "title": "Neue Produkte",
                "message": "Schauen Sie doch mal in ihre Angebote - es gibt neue leckere Schmeckerlis.",
                "link": "angebote"
            }
        }        
    ];

    $scope.message = $scope.predefinedMessages[0];
    $scope.reconnect();
});



