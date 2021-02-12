

# EdgeRouter Dashboard

Alternative dashboard for Ubiquiti EdgeRouter. The static SPA is intended to be hosted by the EdgeRouter lighttpd server at `/dashboard` and calls the existing EdgeRouter APIs.

## EdgeRouter Setup

1. Create `/var/www/htdocs/dashboard`.
2. Change owner of `/var/www/htdocs/dashboard` from `root` to an admin user account to allow easier updating of content.
3. Modify `/etc/lighttpd/conf-enabled/15-fastcgi-python.conf` to include `dashboard` alongside the other static paths such as `lib` and `media`.
4. Kill the lighttpd process and restart:

    `sudo /usr/sbin/lighttpd -f /etc/lighttpd/lighttpd.conf`

## Deployment

1. Run `npm run build`.
2. Copy contents of `build` to `/var/www/htdocs/dashboard` on EdgeRouter:

    `scp -r build/* <edgerouter user>@<edgerouter server>:/var/www/htdocs/dashboard`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
