const io = require('socket.io-client');
import {serverUrl} from '../core/api';
import {getLogger} from '../core/utils';
import {dogCreated, dogUpdated, dogDeleted} from './service';

window.navigator.userAgent = 'ReactNative';

const log = getLogger('NotificationClient');

const DOG_CREATED = 'dog/created';
const DOG_UPDATED = 'dog/updated';
const DOG_DELETED = 'dog/deleted';

export class NotificationClient {
    constructor(store) {
        this.store = store;
    }

    connect() {
        log(`connect...`);
        const store = this.store;
        const auth = store.getState().auth;
        this.socket = io(auth.server.url, {transports: ['websocket']});
        const socket = this.socket;
        socket.on('connect', () => {
            log('connected');
            socket
                .emit('authenticate', {token: auth.token})
                .on('authenticated', () => log(`authenticated`))
                .on('unauthorized', (msg) => log(`unauthorized: ${JSON.stringify(msg.data)}`))
        });
        socket.on(DOG_CREATED, (dog) => {
            log(DOG_CREATED);
            store.dispatch(dogCreated(dog));
        });
        socket.on(DOG_UPDATED, (dog) => {
            log(DOG_UPDATED);
            store.dispatch(dogUpdated(dog))
        });
        socket.on(DOG_DELETED, (dog) => {
            log(DOG_DELETED);
            store.dispatch(dogDeleted(dog))
        });
    };

    disconnect() {
        log(`disconnect`);
        this.socket.disconnect();
    }
}