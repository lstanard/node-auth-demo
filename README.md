# Todo demo
Simple todo application setup/project starter with authentication. Node/Express server using Passport for authentication, Webpack and Angular front-end.

## Installation

* `npm install` to install dependencies
* `mongod` to start the Mongo server
    * For mongo `errno:48` see [this StackOverflow post](http://stackoverflow.com/questions/14428123/mongodb-wont-start)
* `node server.js` or `nodemon server.js` to start the application
	* Alternately `npm run start` to build webpack assets and run `nodemon server.js`
* `npm run dev` to start `webpack --watch`
* Visit `http://localhost:8080`

### Credit

* Authentication setup originally from [scotch.io](https://scotch.io/tutorials/easy-node-authentication-google).
* Icons from [Zondicons](http://www.zondicons.com/icons.html)