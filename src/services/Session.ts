import EventEmitter from "events";

export class Session extends EventEmitter {

    #refreshInterval = 600; //seconds
    #key = '';

    start = (username: string, password: string) => {

        const credentials = `username=${username}&password=${password}`

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': credentials.length
            }
        };

        this.#makeRequest(options, { 'username': username, 'password': password }, (res: Response) => {
            this.#key = this.#getCookie('PHPSESSID') ?? '';
            this.emit('login', this.#key);
            setInterval(this.#keepAlive, this.#refreshInterval * 1000);
            return res;
        });
    };

    #keepAlive = () => {

        const options = {
            method: 'GET',
            headers: {
                'cookie': `PHPSESSID=${this.#key}; beaker.session.id=${this.#key}`
            }
        };

        this.#makeRequest(options, {}, 
            (res: Response) => {
                console.log(`session keep-alive responded with status code: ${res.status}`);
                return res;
            }
        );
    };
    
    #makeRequest = (options: any, data: {}, onSuccess: (res: Response) => Response) => {

        const myRequest = new Request('/', {
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
