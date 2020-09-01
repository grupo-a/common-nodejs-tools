<p align="center">
  <a href="https://www.grupoa.com.br/" target="_blank">
    <img src="https://www.grupoa.com.br/hs-fs/hubfs/logo-grupoa.png?width=136&name=logo-grupoa.png" />
  </a>
</p>

<a name="description"/>

# common-nodejs-tools
<p align="center">🚀 A common utility library for NodeJS</p>


<a name="content"/>

###  🏁 Content
<!--ts-->
   * [Description](#description)
   * [Content](#content)
   * [Install](#install)
   * [Environment Variables](#environment-variables)
   * [How to use](#how-to-use)
   * [Common Functions](#common-functions)
      * [Database](#function-database)
      * [Error](#function-error)
      * [Express](#function-express)
      * [Logger](#function-logger)
      * [Request](#function-request)
      * [Response](#function-response)
      * [Validator](#function-validator)
   * [Status](#status)
   * [Tecnologies](#tecnologies)
<!--te-->

<br>
<a name="install"/>

# Install
In your package.json > dependencies:
``` bash
  "common-api": "git+https://github.com/grupo-a/common-nodejs-tools.git#<TAG_VERSION>"
```
You need to change <TAG_VERSION>. See all tags clicking <a href="https://github.com/grupo-a/common-nodejs-tools/tags"> here</a>.

<br>
<a name="environment-variables"/>

# Environment Variables
```env
  # Express
  PORT=3000

  # Logs
  LOG_INFO_ENABLE=true
  LOG_WARN_ENABLE=true
  LOG_ERROR_ENABLE=true
  LOG_AUDIT_ENABLE=true

  # Database
  DB_READ_HOST=localhost
  DB_WRITE_HOST=localhost
  DB_PORT=5432
  DB_DATABASE=database-example
  DB_USER=postgres
  DB_PASSWORD=postgres
```

<br>
<a name="how-to-use"/>

# How to Use
In your file.js, import the dependency and extract the common function that you want to use.

``` javascript
  const { database } = require('common-api');
```

<br>
<a name="common-functions"/>

# Common Functions
<a name="function-database"/>

#### Database
It's a function to use PostgreSQL and you need to set the environment variables shown on the previous section. **PG** is the dependency that we use to connecting host.

Note: We are used to using two types of instances: read and write. By the way, when you will use this function, remember to inform which of the options you wanna use.

Example:
``` javascript
  const { postgres } = require('common-api').database;
  const query   = "SELECT * FROM example WHERE id = $1";
  const values  = [1];
  await postgres.read.queryFirstOrNull(query, values);
```
<br>
<a name="function-error"/>

#### Error
There are two models: HttpError and DbError. They are responsible for mount the default structure when an error is occurred.

Example:
``` javascript
  const { error } = require('common-api');
  throw new error.HttpError(message, httpStatusCode, businessStatusCode);
```
<br>
<a name="function-express"/>

#### Express
To use express in your API, we recommend our common function. It's responsible to set default configs like: enable cors, format body, handle the error page (route not found), etc.

Note: The default port is 3000.

Example:
``` javascript
  const { express } = require('common-api');
  express.instance.get('/path', 'middlewareIfNecessary', controller.get);
  express.init();
  module.exports = express.instance;
```

<br>
<a name="function-logger"/>

#### Logger
There are some functions inside this module which we use either success or failure logs. They are important for debugging our API and register what's happening inside it.

Example:
``` javascript
  const { logger } = require('common-api');
  logger.info('Example console');
  logger.warn('Error inside function');
```

<br>
<a name="function-request"/>

#### Request
When you need to do some request, we recommend to use this function. You just have to pass the options from your request like the example.

Example:
``` javascript
  const { request } = require('common-api');
  const options     = {
    uri     : `localhost`,
    method  : 'GET',
    headers : {}
  };
  const response = await request.handler(options);
```


<br>
<a name="function-response"/>

#### Response
Each response from your API, you can use this standard function that receives the parameter res (from your express), body (body response) and HttpCode, in addition to setting up the structure to serve your client.

Example:
``` javascript
  const { response } = require('common-api');
  return response.success(res, body, 200);
```


<br>
<a name="function-validator"/>

#### Validator
It's a helper function that uses <a href="https://www.npmjs.com/package/jsonschema">jsonschema</a> and validade your received body.

Example:
``` javascript
  const { validator } = require('common-api');
  const changeSchema = {
    'id'  : '/MethodName',
    'type': 'object',
    'properties': {
      'variable' : {'type' : 'string'}
    },
    'required': ['variable'] // if is required
  };
  validator.validate(changeSchema, body);
```

<br>
<a name="status"/>

# Status
<h4 align="center">
	🚧  Open for contribuitions...   🚧
</h4>