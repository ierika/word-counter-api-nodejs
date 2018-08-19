# Word Counter API

Counts all word occurrence in a web page source. You can visit it [here](https://node-wordcounterapi.herokuapp.com/).

## How to use

Just provide the API with the `url` and `word` parameter. The request should look like this:

https://wordcounterapi.herokuapp.com/wordcount?url=http://virtusize.jp&word=fit


### Note

New query result will be saved to a MongoDB database for faster access.
