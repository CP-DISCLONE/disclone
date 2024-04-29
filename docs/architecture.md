# Architecture

This application is constructed with the following stack:

- Front-End: Vite + React.js + TypeScript
- Back-End: Django + DRF + Django Channels
- Caching: Redis
- Database: PostgreSQL

## Front-End

### Software Design

The code is designed to follow the DRY principle. Utility functions live within their own directory and are used around the application where needed. Custom types and interfaces live in their own directory as well, enabling use across all pages and components effeciently.

### UI Design

## Back-End

### Software Design

The back-end utilizes multiple services to serve both the asynchronous and synchronous functions of the server.

Django and Django Rest Framework are used to manage the project and handle model creation, serializers, class-based views, and user authentication.

- Models: The Server, Channel, and Message models are used to create the nested structure of the servers, allowing users to create their own servers and channels or join other servers and send messages within each. The User model is also created to handle user creation and authentication.
- Authentication: Token Authentication is used to authenticate users in this application, with no other views being accessible without the user making the request being authenticated.
- Views: The views in this application allow for all CRUD capabilities on Servers, Channels, and Messages.
  - Servers and Channels can only be created, edited, and deleted by the Server's admin, which is the owner of the server (the user that created it).
  - Messages can be edited only by the user that created them, and any user can create a message. Server admins, channel moderators, and the user that authored the message can delete messages as well.

Redis is used as both a caching layer for the application and the main channel layer for WebSocket channels to be opened.
- Redis gives this application more flexibility and also makes response and update times much faster and more efficient by using RAM to serve requests and channels.

Channels/Django Channels is used to serve the WebSocket and create consumers.
- By using Channels paired with Daphne, the ASGI (asynchronous) portion of our application is utilized to open channel layers and allow consumers to handle all asynchronous requests from the front-end.

Celery is used as a worker service and depends on Redis to handle shared tasks across the application.
- By bringing Celery into the application, we are able to designate shared tasks across the back-end and have Celery workers handle them asynchronously without an immediate response required.

## Containerization

### Docker + Compose

This application utilizes Docker and Compose to handle containerization of all dependencies and running the local development environment.

Version control and team programming is a skill that is vital to the creation of this application. Our group found that running multiple services with a large amount of dependencies was difficult, and our solution for this was containerizing the application to isolate the development environment. This way, we are able to freely develop and push code, while other team members can pull new updates, rebuild the images if necessary, and spin up the development environment with ease.