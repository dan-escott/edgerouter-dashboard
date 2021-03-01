import EventEmitter from "events";

export enum SessionEvent {
    Login = 'login',
    Logout = 'logout'
}

export class Session extends EventEmitter {

    #refreshInterval = 600; //seconds
    #key = '';
    #keepAliveTimeout: any;

    start = (username: string, password: string) => {

        const credentials = `username=${username}&password=${password}`

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': credentials.length
            }
        };

        this.#makeRequest('/', options, { 'username': username, 'password': password }, (res: Response) => {
            this.#checkSession((checkResponse) => {

                if (checkResponse.status === 200) {
                    this.#key = this.#getCookie('PHPSESSID') ?? '';
                    this.emit(SessionEvent.Login, this.#key);
                    this.#keepAliveTimeout = setInterval(this.#keepAlive, this.#refreshInterval * 1000);
                }

                return checkResponse;
            });
            return res;
        });
    };

    #checkSession = (callback: (res: Response) => Response) => {
        fetch('/api/edge/heartbeat.json')
            .then(callback)
            .catch(err => console.error(err))
    };

    
    #keepAlive = () => {
        this.#checkSession((res) => {
            if (res.status === 403 && this.#key) {
                this.#key = '';
                clearInterval(this.#keepAliveTimeout);
                this.#keepAliveTimeout = null;
                this.emit(SessionEvent.Logout)
            }
            return res;
        });
    }

    #makeRequest = (url: string, options: any, data: {}, onSuccess: (res: Response) => Response) => {

        const myRequest = new Request(url, {
            redirect: 'follow',
            method: options.method,
            body: Object.keys(data).length > 0 ? new URLSearchParams(data) : null,

            mode: 'no-cors',
            referrerPolicy: 'unsafe-url',
            credentials: 'same-origin'
        });

        fetch(myRequest)
            .then(
                onSuccess
            )
            .catch(err => {
                console.log(err);
            });
    }

    #getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
    }
}
