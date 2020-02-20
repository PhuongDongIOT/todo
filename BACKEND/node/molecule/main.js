let { ServiceBroker } = require("moleculer");
let ApiService = require("moleculer-web");

let broker = new ServiceBroker({ logger: console });

// Create a service
broker.createService({
    name: "json",
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

broker.createService({
    name: "home",
    actions: {
        hello() {
            return "Hello word!!";
        }
    }
});

// Load API Gateway
broker.createService(ApiService);

// Start server
broker.start();
