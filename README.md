# Volunteer Manager UI

## Development Set Up

0. git clone this repo to where ever you like.
1. Install node.js (download from : <https://nodejs.org/en/>).
   It has npm, which stands for "node packaged modules".
   The LTS version is good enough.
2. Go to command prompt install grunt-cli globally with command `npm install -g grunt-cli http-server`.
3. Go to root folder where package.json file exist run the command line `npm install`.
   This will install all the grunt dependencies into `node_modules` folder to run the project. 
4. Now you can run the grunt commands, which are configured in `Gruntfile.js`, for this project you just have to type `grunt`.
   This command watches changes happening in files such as less, css, js. This generates concatenated, minfied css and js files.

## Running Node Server

From root folder type: `npm start` command.
Now you can view the site in your browser at <http://localhost:8000/#/>.

## Adding an Open Source Library

* Check if it is located in [cdnjs](https://cdnjs.com/).
* If it's there, include the script tag in the index.html, along with the [SRI Hash](https://www.srihash.org/).

## Addinga Scholastic JS File

Try to find a URL that the other team hosts it at.
The less we maintain the better.
If they don't host it...

* Place the unminified file in `libs`.
* In the Gruntfile's uglify step, add the file (try to match what is there)
* Include the minified source in the index.html

## Adding a new Angular {service,controller,filter,directive}

Depening on the type of file, place it in the appropriate folder in: `app/js/`.
Once placed there the file will automatically be picked up by Grunt during future compilations.

## For Deployment

### Determining Version

Look at `http://127.0.0.1:8000/scripts/script.min.js`, but in whatever environment you want.
The first line will have the git commit.

### Deployment

Just deploy `dist/` with any web server :)
