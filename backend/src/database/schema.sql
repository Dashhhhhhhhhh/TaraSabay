CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id INTEGER NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    middle_initial VARCHAR(5), 
    last_name VARCHAR(50) NOT NULL,
    display_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    contact_number VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_id_fkey
        FOREIGN KEY (role_id) REFERENCES roles(role_id),
    CONSTRAINT chk_email_format 
        CHECK (email LIKE '%@%.%'),
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) 
        REFERENCES roles(role_id)
        ON UPDATE CASCADE 
        ON DELETE RESTRICT
);

CREATE TABLE driver_profiles (
    driver_profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    vehicle_type VARCHAR(20) NOT NULL,
    seat_capacity INTEGER NOT NULL CHECK (seat_capacity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_driver_profiles_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE ride_offers (
    ride_offer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    driver_profile_id UUID NOT NULL,
    pickup_location VARCHAR(150) NOT NULL,
    dropoff_location VARCHAR(150) NOT NULL,
    departure_time TIMESTAMPTZ NOT NULL,
    vehicle_type_snapshot VARCHAR(50) NOT NULL,
    seat_capacity_snapshot INTEGER NOT NULL,
    available_seats INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ride_offers_user 
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_ride_offers_driver 
        FOREIGN KEY (driver_profile_id) REFERENCES driver_profiles(driver_profile_id),
    CONSTRAINT chk_ride_offers_status 
        CHECK (status IN ('open', 'full', 'completed', 'cancelled')),
    CONSTRAINT chk_seat_capacity 
        CHECK (seat_capacity_snapshot > 0),
    CONSTRAINT chk_available_seats 
        CHECK (available_seats >= 0),
    CONSTRAINT chk_seat_logic 
        CHECK (available_seats <= seat_capacity_snapshot)
);

CREATE TABLE offer_requests (
    offer_request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ride_offer_id UUID NOT NULL,
    passenger_user_id UUID NOT NULL,
    requested_seats INTEGER NOT NULL,
    message TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_offer_requests_ride_offer 
        FOREIGN KEY (ride_offer_id) REFERENCES ride_offers(ride_offer_id),
    CONSTRAINT fk_offer_requests_passenger_user 
        FOREIGN KEY (passenger_user_id) REFERENCES users(user_id),
    CONSTRAINT chk_offer_requests_status 
        CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
    CONSTRAINT chk_offer_requests_requested_seats 
        CHECK (requested_seats > 0)
);

CREATE UNIQUE INDEX uniq_pending_request_per_passenger_offer
ON offer_requests (ride_offer_id, passenger_user_id)
WHERE status = 'pending';

CREATE TABLE ride_requests (
    ride_request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rider_user_id UUID NOT NULL,
    pickup_location VARCHAR(150) NOT NULL,
    dropoff_location VARCHAR(150) NOT NULL,
    departure_time TIMESTAMPTZ NOT NULL,
    requested_seats INTEGER NOT NULL,
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ride_requests_rider_user
        FOREIGN KEY (rider_user_id) REFERENCES users(user_id),
    CONSTRAINT chk_ride_requests_status 
        CHECK (status IN ('open', 'matched', 'completed', 'cancelled')),
    CONSTRAINT chk_ride_requests_requested_seats
        CHECK (requested_seats > 0)
);

CREATE TABLE request_responses (
    request_response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ride_request_id UUID NOT NULL,
    driver_user_id UUID NOT NULL,
    message TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    CONSTRAINT fk_request_responses_ride_request
        FOREIGN KEY (ride_request_id) REFERENCES ride_requests(ride_request_id),
    CONSTRAINT fk_request_responses_driver_user
        FOREIGN KEY (driver_user_id) REFERENCES users(user_id),
    CONSTRAINT chk_request_status
        CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled'))
);

CREATE UNIQUE INDEX uniq_pending_request_per_driver_request
ON request_responses (ride_request_id, driver_user_id)
WHERE status = 'pending';

CREATE TABLE messages (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_user_id UUID NOT NULL,
    receiver_user_id UUID NOT NULL,
    ride_offer_id UUID,
    ride_request_id UUID,
    offer_request_id UUID,
    request_response_id UUID,
    message_text TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    CONSTRAINT message_sender_user_id
        FOREIGN KEY (sender_user_id) REFERENCES users(user_id), 
    CONSTRAINT message_receive_user_id
        FOREIGN KEY (receiver_user_id) REFERENCES users(user_id),
    CONSTRAINT message_ride_offer_id
        FOREIGN KEY (ride_offer_id) REFERENCES ride_offers(ride_offer_id),
    CONSTRAINT message_ride_request_id
        FOREIGN KEY (ride_request_id) REFERENCES ride_requests(ride_request_id),
    CONSTRAINT message_offer_request_id
        FOREIGN KEY (offer_request_id) REFERENCES offer_requests(offer_request_id),
    CONSTRAINT message_request_response
        FOREIGN KEY (request_response_id) REFERENCES request_responses(request_response_id),
    CONSTRAINT chk_messages_single_context
        CHECK (
            (
                (ride_offer_id IS NOT NULL)::int +
                (ride_request_id IS NOT NULL)::int +
                (offer_request_id IS NOT NULL)::int +
                (request_response_id IS NOT NULL)::int
            ) <= 1
        ),
    CONSTRAINT chk_messages_sender_not_receiver
        CHECK (sender_user_id <> receiver_user_id)
);

CREATE TABLE reports (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reported_by_user_id UUID NOT NULL,
    reported_user_id UUID,
    ride_offer_id UUID,
    ride_request_id UUID,
    message_id UUID,
    reason VARCHAR(100) NOT NULL,
    details TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reports_reported_by_user_id
        FOREIGN KEY (reported_by_user_id) REFERENCES users(user_id),
    CONSTRAINT fk_reports_reported_user_id
        FOREIGN KEY (reported_user_id) REFERENCES users(user_id),
    CONSTRAINT fk_reports_ride_offer_id
        FOREIGN KEY (ride_offer_id) REFERENCES ride_offers(ride_offer_id),
    CONSTRAINT fk_reports_ride_request_id
        FOREIGN KEY (ride_request_id) REFERENCES ride_requests(ride_request_id),
    CONSTRAINT fk_reports_message_id
        FOREIGN KEY (message_id) REFERENCES messages(message_id),
    CONSTRAINT chk_reports_status
        CHECK (status IN ('open', 'reviewed', 'resolved', 'dismissed')),
    CONSTRAINT chk_reports_single_target
        CHECK (
            ((reported_user_id IS NOT NULL)::int +
             (ride_offer_id IS NOT NULL)::int +
             (ride_request_id IS NOT NULL)::int +
             (message_id IS NOT NULL)::int) = 1
        )
);

