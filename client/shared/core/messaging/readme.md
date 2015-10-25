The messaging system is used to communicate between multiple browser windows/tabs opened from the
application. It consists of two parts:

* A messaging service, used to send messages, and
* A receive-messages directive, used to subscribe to messages.

### Service to send messages
The messaging service is called _messagingService_ and has a single method called _send_.

Simply inject the service and call the _send_ method to broadcast a message to all subscribers.

````js
send<T>(id: string, value: T): void;
````

_send_ is a generic method that accepts two parameters:
1. _id: string_ - A unique identifier for the message. Subscribers use this identifier to subscribe.
1. _value: T_ - The message data to be sent. This can be of any type.

````js
let loan: Loan = {
    id: '12345',
    borrower: 'John Doe',
    address: 'Chicago'
}
messagingService.send('loanDetails', loan);
````

### Directive to receive messages
In order to receive messages in a view, you must apply the receive-messages directive to the view, typically on the outer-most tag.

````html
<div receive-messages="id1 id2">
    ...
</div>
````

The attribute should specify a space-separated list of message identifiers it wants to receive.

When a message is received, a _$onMessageReceived_ event is fired on the corresponding scope, which can be used to handle the message.

_$onMessageReceived_ passes in an object that contains the identifier of the message and the actual message content.

````js
constructor($scope: ng.IScope) {
    $scope.$on('$onMessageReceived', (event: ng.AngularEvent, message: shared.messaging.IMessage) => {
        //Handle messages here
        if (message.id === 'loanDetails') {
            this.loan = message.message;
        }
    });
}
````

### When to use the messaging system
Use the messaging system only when communicating between browser windows and tabs from the same application.

Do not use this system to communicate with anything in the same window. Not all browser support receiving messages in the same window from where they were sent.

Additionally, you do not need to use this system to pass input values to a newly-opened browser window/tab, or to receive any output once the window/tab is closed.
This capability is already present in the popup framework.
