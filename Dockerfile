FROM php:apache

# Enable Apache Rewrite Module
RUN a2enmod rewrite

# Copy build files to Apache document root
COPY build/ /var/www/html/

# Copy .htaccess file
COPY dot-htaccess /var/www/html/.htaccess

# Copy 000-default-fix.conf and replace the existing 000-default.conf
COPY 000-default-fix.conf /etc/apache2/sites-available/000-default.conf

# Restart Apache
RUN service apache2 restart

# Expose port 80 to allow outside access to your container
EXPOSE 80

# npm run build:prod
# docker build -t shresthasaurabh86/react-app:latest .
# docker push shresthasaurabh86/react-app:latest