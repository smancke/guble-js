



app = angular.module("demo", []);

app.controller("demoCtrl", function($scope) {

    $scope.reconnect = function() {
        $scope.g = new Guble("http://10.86.17.26:8080");
        $scope.g.connect("webapp");
    }
    
    
    $scope.send = function(message) {
        $scope.g.sendMessage("/gcm/broadcast", JSON.stringify(message));
    }
    
    $scope.predefinedMessages = [
        {
            "type": "marketing",
            "data": {
                "title": "Neue Produkte in ihrer Einkaufliste",
                "message": "Es wurden neue Produkte zu ihrer Einkaufsliste hinzugefügt.",
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
                "title": "Neue REWE-Produkte",
                "message": "Schauen Sie doch mal in ihre Angebote - es gibt neue leckere Schmeckerlis.",
                "link": "angebote"
            }
        }        
    ];
    $scope.message = $scope.predefinedMessages[0];
});



