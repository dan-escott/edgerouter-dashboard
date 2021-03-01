import EventEmitter from "events";
import { BufferedReader } from "./BufferedReader";

export class StatsService extends EventEmitter {

    #buffer;
    #ws?: WebSocket;

    constructor() {
        super();

        this.#buffer = new BufferedReader();
        this.#buffer.on('message', this.#processData);
    }

    start = (session: string) => {

        if (this.#ws) {
            console.info('Stats stream already started');
            return;
        }

        const serverLocation = window.location;
        const protocol = (serverLocation.protocol === "https:") ? "wss:" : "ws:";

        this.#ws = new WebSocket(`${protocol}//${serverLocation.host}/ws/stats`);
        this.#ws.onmessage = (event) => this.#buffer.receive(event.data);
        this.#ws.addEventListener('error', (err) => console.error(err));
        this.#ws.onopen = () => {
            this.#subscribe(session);
        };
    };

    stop = () => {
        if (this.#ws) {
            this.#ws.close();
            this.#ws = undefined;
        }
    };

    #subscribe = (session: string) => {
        const subscription = {
            "SUBSCRIBE": [
                //{ "name": "export" }, // traffic by source IP
                //{ "name": "discover" }, // device info, IPs and MACs
                { "name": "interfaces" },
                //{ "name": "system-stats" }, //uptime, cpu, mem
                //{ "name": "num-routes" },
                //{ "name": "config-change" },
                { "name": "users" },
            ],
            "UNSUBSCRIBE": [],
            "SESSION_ID": session
        };
        let subscriptionPayload = JSON.stringify(subscription);
        subscriptionPayload = subscriptionPayload.length + '\n' + subscriptionPayload;

        this.#ws ? this.#ws.send(subscriptionPayload) : console.error('WebSocket is null');
    };

    #processData = (data: Object) => {
        this.emit(Object.keys(data)[0], data)
    };
}
