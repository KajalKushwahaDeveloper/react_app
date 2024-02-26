FROM nginx:stable-alpine

COPY build/ /usr/share/nginx/html 

# npm run build
# docker build -t shresthasaurabh86/react-app:latest .
# docker push shresthasaurabh86/react-app:latest