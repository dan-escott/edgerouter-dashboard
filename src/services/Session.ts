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

    const request = new Request('/', {
      method: 'POST',
      body: new URLSearchParams({ 'username': username, 'password': password }),
    });

    fetch(request)
      .then(res => {
        this.#checkSession(checkResponse => {
          if (checkResponse.status === 200) {
            this.#key = this.#getCookie('PHPSESSID') ?? '';
            this.emit(SessionEvent.Login, this.#key);
            this.#keepAliveTimeout = setInterval(this.#keepAlive, this.#refreshInterval * 1000);
          }
          return checkResponse;
        });
        return res;
      })
      .catch(err => {
        console.log(err);
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

  #getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  }
}
