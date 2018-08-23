# Word Counter API

Counts all word occurrence in a web page source. You can visit it [here](https://node-wordcounterapi.herokuapp.com/).

## Dependencies

1. Node.js (platform)
2. MongoDB (database)
3. npm (package/dependency manager)

## How to run local environment

1. Clone this repo.
2. Install MongoDB. https://www.mongodb.com/
3. Run MongoDB server in the background or foreground, whichever you like.
    ```bash
    $ nohup mongod &
    ```
4. Navigate to the cloned repository and install dependencies
    ```bash
    $ cd /path/to/repo
    $ npm install
    ```
1. Set up environment variables.
    - MONGODB_URI - the URI for the MongoDB instance
    - PORT - For Node.js projects, port `3000` is commonly used.
    - DEBUG - set to `true` if on local environment
    
5. Install `nodemon` globally if you haven't yet.
    ```bash
    $ npm install nodemon -g
    ```
6. Fire up the application.
    ```bash
    $ nodemon
    ```

## How to use

Just provide the API with the `url` and `word` parameter. The request should look like this:

https://node-wordcounterapi.herokuapp.com/wordcount?url=http://virtusize.jp&word=fit


### Note

New query result will be saved to a MongoDB database for faster access.
