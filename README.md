# TaraSabay

## What is TaraSabay?

TaraSabay is a public carpooling platform where commuters can offer rides, request rides, and connect with other users for shared trips.

## Why I Built It

I built TaraSabay because of the rising fuel prices and transportation difficulties that commuters often experience. The idea is to help people save money by sharing rides, conserving fuel, and making it easier to find transportation options, especially during situations like transport strikes.

## Main Features

- Users can register, log in, and access the app based on their role.
- Drivers can create ride offers with pickup location, dropoff location, departure time, available seats, and notes.
- Passengers can browse ride offers and request seats from available rides.
- Passengers can also create ride requests when they are looking for a ride.
- Drivers can respond to passenger ride requests.
- Users can message each other after a ride-related connection is made.
- Users can submit reports if there is an issue related to a message, ride offer, ride request, or another user.
- Admins can review submitted reports.

## Tech Stack

**Frontend**
- React
- Axios
- CSS

**Backend**
- Node.js
- Express.js
- CORS
- JSON Web Token (JWT)

**Database**
- PostgreSQL

**Authentication and Authorization**
- JWT-based authentication
- Role-based access control for Passenger, Driver, and Admin routes
- Password hashing for stored user passwords

TaraSabay uses JWT-based authentication to verify logged-in users. It also uses role-based authorization to control which routes and features are available to Passengers, Drivers, and Admins.

## Database Design

TaraSabay uses a PostgreSQL database with the following main entities:

- **roles** - stores the available user roles such as Passenger, Driver, and Admin.
- **users** - stores user account information and connects each user to a role.
- **driver_profiles** - stores driver-specific information required before a user can offer rides, such as vehicle type and seat capacity.
- **ride_offers** - stores trip posts created by drivers, including pickup location, dropoff location, departure time, available seats, and notes.
- **offer_requests** - handles the passenger request flow for existing ride offers. Passengers can request seats, and the ride offer owner can accept or reject those requests.
- **ride_requests** - allows passengers to publish ride requests when they are looking for a ride.
- **request_responses** - handles the driver-to-passenger response flow for posted ride requests.
- **messages** - handles user-to-user communication inside a valid ride-related context so users can coordinate trip details.
- **reports** - stores user-submitted reports related to users, ride offers, ride requests, or messages for admin review.

The database is designed around role-based users and ride-related workflows. A user belongs to a role, a driver profile belongs to a user, ride offers are created by drivers, and passengers can either request seats from ride offers or create their own ride requests. Messages and reports are connected to ride-related records so communication and safety actions stay tied to the correct context.

I separated `ride_offers` and `ride_requests` to keep the business logic clearer. A ride offer starts from a driver who is offering available seats, while a ride request starts from a passenger who is looking for a ride. Keeping them separate makes the workflows easier to understand, validate, and maintain.

## API Modules

- **Auth** - handles user registration, login, and fetching the current logged-in user.
- **Driver Profiles** - handles creating, viewing, and updating driver profile information.
- **Ride Offers** - allows drivers to publicly post available rides that passengers can browse and request seats from.
- **Offer Requests** - allows passengers to request one or more seats from an existing published ride offer.
- **Ride Requests** - allows passengers to publish a ride need so drivers can respond with an offer.
- **Request Responses** - allows drivers to respond to passenger-created ride requests.
- **Messages** - allows users to communicate inside a valid ride-related context.
- **Reports** - handles user-submitted reports for admin review.

`offer_requests` and `request_responses` support two different ride-matching flows. `offer_requests` are created by passengers when they want to join an existing ride offer posted by a driver. `request_responses` are created by drivers when they want to respond to a ride request posted by a passenger.

## Database Setup

TaraSabay uses PostgreSQL. The initial database structure is defined in `schema.sql`. During development, smaller schema updates may be applied through `psql`.

To set up the database locally, create the database first:

```bash
createdb tarasabay
```

Then run the schema file:

```bash
psql -U your_postgres_user -d tarasabay -f schema.sql
```

If you are using pgAdmin, you can also open `schema.sql` and run it through the query tool.

## How to Run Locally

### 1. Clone the repository

```bash
git clone <repository-url>
cd TaraSabay
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tarasabay
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_jwt_secret
PORT=5000
```

Make sure PostgreSQL is running and the database has been created using the **Database Setup** section.

Run the backend:

```bash
npm run dev
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

### 4. Open the app

The frontend usually runs at:

```txt
http://localhost:5173
```

The backend usually runs at:

```txt
http://localhost:5000
```

## Screenshots

Screenshots will be added to show the main user flows of TaraSabay.

Planned screenshots:

- Login page
- Register page
- Dashboard
- Profile page
- Driver Profile page
- Ride Offers page
- Ride Offer Details modal
- My Ride Offers page
- Ride Offer Requests page
- My Offer Requests page
- Ride Requests page
- My Ride Requests page
- Request Responses modal
- Messages page
- Message Details modal
- Create Message modal
- Reports page
- Admin Reports page

## Future Improvements

- Add map-based pickup and dropoff selection.
- Add route previews and distance-based fare estimation.
- Add real-time chat or notifications using WebSockets.
- Improve message threading and unread message counts.
- Add filtering, sorting, and pagination for large tables.
- Improve admin report moderation workflow.
- Add deployment configuration for frontend, backend, and database.
