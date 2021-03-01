import { EventEmitter } from 'events';

export class BufferedReader extends EventEmitter {
  dataBuffer = '';

  receive = (data: string) => {
    if (this.dataBuffer) {
      data = this.dataBuffer + data;
      this.dataBuffer = '';
    }

    const expectedLength = +data.substring(0, data.indexOf('\n'));
    const actualLength = data.length - data.indexOf('\n') - 1;
    if (expectedLength !== actualLength) {
      this.dataBuffer = data;
      return;
    }

    data = data.substring(data.indexOf('\n') + 1);
    let parsedData = JSON.parse(data);

    this.emit('message', parsedData);
  };
}
