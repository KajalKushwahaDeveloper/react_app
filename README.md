## FIXING ERROR 404 (PART 1) APACHER SERVER AT ROUTES OTHER THAN '/'; like '/login'

To configure your React application to open the "/login" route when deployed on an Apache server at "/var/www/html," you need to make sure you have the following steps in place:

Build your React application: Before deploying your application, you need to build it using the following command:


`npm run build`
This command will create an optimized build of your React application that can be deployed to the Apache server.

Copy the build files: After the build process completes, you need to copy the generated build files to the appropriate location on your Apache server. In this case, you would copy the contents of the build folder to "/var/www/html." You can use the following command to copy the files:

`cp -r build/. /var/www/html/`
This command recursively copies all the files and directories from the build folder to "/var/www/html."

Configure Apache: Now, you need to configure Apache to serve your React application and enable URL rewriting to handle client-side routing. Follow these steps:

a. Enable Apache's rewrite module: `sudo a2enmod rewrite`

b. Create an .htaccess file: In the root of your "/var/www/html" directory, create an .htaccess file if it doesn't already exist. Use the following command:

`sudo nano /var/www/html/.htaccess`
c. Add the following configuration to the .htaccess file:


##### Options -MultiViews
##### RewriteEngine On
##### RewriteCond %{REQUEST_FILENAME} !-f
##### RewriteRule ^ index.html [QSA,L]
This configuration tells Apache to serve the index.html file for all requests that are not existing files. It allows client-side routing to handle the "/login" route and other routes defined in your React application.

Restart Apache: After making changes to the Apache configuration, restart the Apache service to apply the new settings:

`sudo service apache2 restart`

Now, when you access your deployed React application at http://localhost/login, Apache will serve the React application's index.html file, and your React Router will handle the "/login" route on the client side.

## FIXING ERROR 404 (PART 2) APACHER SERVER AT ROUTES OTHER THAN '/'; like '/login'

The configuration file like `000-default.conf` at `/etc/apache2/sites-available/` might be missing the necessary directives to handle client-side routing with React Router.

To enable client-side routing on your Apache server, you need to add the FallbackResource directive to the virtual host configuration. Modify your 000-default.conf file as follows:

<VirtualHost *:80>
  ServerAdmin webmaster@localhost
  DocumentRoot /var/www/html
  <Directory /var/www/html>
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
  </ Directory>
  ErrorLog ${APACHE_LOG_DIR}/error.log
  CustomLog ${APACHE_LOG_DIR}/access.log combined
  FallbackResource /index.html
</ VirtualHost>

Save the changes to the 000-default.conf file, and then restart the Apache service:

`sudo service apache2 restart`

With this configuration, the FallbackResource directive instructs Apache to serve the index.html file for any URL that does not match an existing file on the server. This allows your React application to handle client-side routing properly.

After restarting Apache, try accessing the '/login' route in your deployed React application. It should now work as expected.


<!-- 
npm cache clean --force
npm install @material-ui/core --legacy-peer-deps 
-->
