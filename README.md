1- install Node.js (https://nodejs.org/en/download/)

2- install PostgreSQL (https://www.postgresql.org/download/)

3- install gulp by command : "npm install gulp -g"

4- install bower by command : "npm install bower -g"

5- git clone https://github.com/aminsh/accounfing.git

6- go to admin directory install dependencies by command : npm install

7- go to client directory use gulp command for bundling client files

    - "gulp build-acc" : bundles js files (after js soure has been changed)
    - "gulp build-template" : bundles html files (after html source has been changed)
    - "gulp " : bundles both js and html files
    - "gulp build-vendor" to bundles external libraries (just after add new library)
  
9- go to admin directory again and run app by command "npm start"

10- go to http://localhost:1000

Please dont use farsi charactors in the source . instead you could write farsi on "admin/server/config/translate.fa.json" file and use copy of the key in the source.

Example :

        view : 

        {{ 'Hello world!'| translte }}

        controller : 

        angularModule.controller('homeController', ($scope, translate) => {
              $scope.tilte = translate('Home');
        });
