# Kirana Store

An unique online grocery store where you can seamlessly order items of your daily needs. It is a multi user application which has three types of users, namely customers, store managers and an administrator.

## Feature Log

* Aesthetic background devoid of jarring colours facilitating easy usage

* Multiple users can access the application simultaneously.

* Can differentiate whether the person logging into the application is an administrator, store manager or regular customer.

* Daily reminder and monthly report is sent to the user's email.

## Points to Note

* The complete application is compatible with a Linux system

* Please download the Mail Hog application (Spurious SMTP server) for your system, if you are using Windows Subsystem for Linux(WSL). 

* One can run the application in WSL and run the MailHog server in Windows.

## How to use

* Run the shell-script by the name `setup.sh` located in the root folder of the file hierarchy to start the application server. 

* Start the redis server in another terminal window by typing `redis-server`.

* Open another terminal window and type `Mailhog` to start a fake SMTP server for the asynchronous email services.

* Set up the Celery workers and Celery beat by typing `Celery -A celery_task.celery worker -l info -B` in another terminal window.
