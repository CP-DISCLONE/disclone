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