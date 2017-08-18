1- install Node.js (https://nodejs.org/en/download/)

2- install PostgreSQL  (https://www.postgresql.org/download/)

3- install gulp by command : "npm install gulp -g"

4- install bower by command : "npm install bower -g"

5- git clone https://github.com/aminsh/admin.git -b development

6- go to admin directory install dependencies by command : npm install

7- go to client directory use gulp command for bundling client files
      
      - "gulp build-app" : bundles js files (after js soure has been changed)
      - "gulp build-template" : bundles html files (after html source has been changed)
      - "gulp " : bundles both js and html files
      - "gulp build-vendor" to bundles external libraries (just after add new library)
      
 8- Add a database name : "admin"
      
 9- go to admin directory again and run app by command "npm start"
 
 10- go to http://localhost:2000
 
 
 Please dont use farsi charactors in the source . 
 instead you could write farsi on "admin/server/config/translate.fa.json" file 
 and use copy of the key in the source.
 
 Example : 
            
            view : 
            
            {{ 'Hello world!'| translate }}
            
            controller : 
            
            angularModule.controller('homeController', ($scope, translate) => {
                  $scope.tilte = translate('Home');
            });


            // Enviroment for webstorm debug
            /*
              <env name="NODE_ENV" value="development" />
              <env name="RECAPCH_KEY_SITE" value="6LcB-ysUAAAAAE_uDz0N0IiwjdwFGbqUTfcFi_Ey" />
              <env name="RECAPCH_KEY_SECRET" value="6LcB-ysUAAAAAIF1O8KjVQG0ykrQLJb5AUkRK44y" />
              <env name="PORT" value="2000" />
              <env name="EMAIL_FROM" value="STORM &lt;info@storm-online.ir&gt;" />
              <env name="EMAIL_HOST" value="smtp.zoho.com" />
              <env name="EMAIL_PORT" value="465" />
              <env name="EMAIL_AUTH_USER" value="info@storm-online.ir" />
              <env name="EMAIL_AUTH_PASSWORD" value="rAEMtxezr3UN" />
              <env name="ORIGIN_URL" value="http://localhost:2000" />
              <env name="GOOGLE_AUTH_CLIENTID" value="44908669153-rgtap5scj693g240t9p3k69tplearpto.apps.googleusercontent.com" />
              <env name="GOOGLE_AUTH_SECRET" value="ZAc3SYGLyKenCssgRzs0iY-1" />
              <env name="DATABASE_URL" value="postgres://postgres:P@ssw0rd@localhost:5432/dbAccounting" />
              <env name="PAYPING_USERNAME" value="aminsh" />
              <env name="PAYPING_PASSWORD" value="am681980" />
            */

