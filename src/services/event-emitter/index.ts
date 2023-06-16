import EventEmitter from 'events';

// TODO: 自己写个eventEmitter

const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(50);

export default eventEmitter;
