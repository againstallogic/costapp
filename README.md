INSTALL prerequisits on EC2 server
//install mysql server
//npm install --save express express-handlebars mysql body-parser
//npm install --save-dev nodemon
//sudo npm install -g --force nodemon
//pm2 start server.js


SETUP proxy
-ngix
sudo yum install nginx
sudo nano /etc/nginx/nginx.conf
server {
    listen 80;
    server_name stackoverflowexample.com;

    location / {
        proxy_set_header  X-Forwarded-For $remote_addr;
        proxy_set_header  Host $http_host;

        # Proxy all requests to the NodeJS app on port 8181
        proxy_pass        http://localhost:3000;
    }
}
^C
sudo service nginx reload

DELETE folder and contents
rm -R folder

//-UPDATE github
//git add .
//git status
//git commit -m "comment"
//git push
//-DELETE folder and contents
//rm -R folder

CONNECT TO MYSQL DATABASE
sql217.main-hosting.eu
u566242939_glorifiedexcel
u566242939_admin
Password1
