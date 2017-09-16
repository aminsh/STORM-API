"use strict";

import io from 'socket.io-client';

export default class PubSub {
    constructor() {
        this.container = [];
        this.socket = io.connect('/');
    }

    subscribe(name, callback) {
        this.socket.on(name, callback);
        this.pushContainer(name);
    }

    pushContainer(name) {
        this.container.push(name);
    }

    unsubscribeAll() {
        this.container.forEach(this.socket.removeAllListeners);
    }
}