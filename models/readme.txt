*Type command to use database:
>$ docker-compose up
*open another terminal and type
>$ docker inspect newsweb_mysql | grep IPAddress
*Lock up "IPAdress" line 
*install mysql client to use in terminal
>$ sudo apt-get install mysql-client
*to use database you must type password 123456 after type below command
>$ mysql -u root -p -h $IP_ADRESS -P 3306
