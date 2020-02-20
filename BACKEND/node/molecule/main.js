let { ServiceBroker } = require("moleculer");
let ApiService = require("moleculer-web");

let broker = new ServiceBroker({ logger: console });

// Create a service
broker.createService({
    name: "test",
    actions: {
        hello() {
            var user = {
                name: "dong",
                age: "24"
            }
            return user;
        }
    }
});

// Load API Gateway
broker.createService(ApiService);

// Start server
broker.start();
