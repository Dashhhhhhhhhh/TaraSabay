--
-- PostgreSQL database dump
--


-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: driver_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driver_profiles (
    driver_profile_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    vehicle_type character varying(20) NOT NULL,
    seat_capacity integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT driver_profiles_seat_capacity_check CHECK ((seat_capacity > 0))
);



--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    message_id uuid DEFAULT gen_random_uuid() NOT NULL,
    sender_user_id uuid NOT NULL,
    receiver_user_id uuid NOT NULL,
    ride_offer_id uuid,
    ride_request_id uuid,
    offer_request_id uuid,
    request_response_id uuid,
    message_text text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_messages_sender_not_receiver CHECK ((sender_user_id <> receiver_user_id)),
    CONSTRAINT chk_messages_single_context CHECK (((((((ride_offer_id IS NOT NULL))::integer + ((ride_request_id IS NOT NULL))::integer) + ((offer_request_id IS NOT NULL))::integer) + ((request_response_id IS NOT NULL))::integer) <= 1))
);



--
-- Name: offer_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offer_requests (
    offer_request_id uuid DEFAULT gen_random_uuid() NOT NULL,
    ride_offer_id uuid NOT NULL,
    passenger_user_id uuid NOT NULL,
    requested_seats integer NOT NULL,
    message text,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_offer_requests_requested_seats CHECK ((requested_seats > 0)),
    CONSTRAINT chk_offer_requests_status CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'accepted'::character varying, 'rejected'::character varying, 'cancelled'::character varying])::text[])))
);



--
-- Name: reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reports (
    report_id uuid DEFAULT gen_random_uuid() NOT NULL,
    reported_by_user_id uuid NOT NULL,
    reported_user_id uuid,
    ride_offer_id uuid,
    ride_request_id uuid,
    message_id uuid,
    reason character varying(100) NOT NULL,
    details text,
    status character varying(20) DEFAULT 'open'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_reports_single_target CHECK (((((((reported_user_id IS NOT NULL))::integer + ((ride_offer_id IS NOT NULL))::integer) + ((ride_request_id IS NOT NULL))::integer) + ((message_id IS NOT NULL))::integer) = 1)),
    CONSTRAINT chk_reports_status CHECK (((status)::text = ANY ((ARRAY['open'::character varying, 'reviewed'::character varying, 'resolved'::character varying, 'dismissed'::character varying])::text[])))
);



--
-- Name: request_responses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request_responses (
    request_response_id uuid DEFAULT gen_random_uuid() NOT NULL,
    ride_request_id uuid NOT NULL,
    driver_user_id uuid NOT NULL,
    message text,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_request_status CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'accepted'::character varying, 'rejected'::character varying, 'cancelled'::character varying])::text[])))
);



--
-- Name: ride_offers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ride_offers (
    ride_offer_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    driver_profile_id uuid NOT NULL,
    pickup_location character varying(150) NOT NULL,
    dropoff_location character varying(150) NOT NULL,
    departure_time timestamp with time zone NOT NULL,
    vehicle_type_snapshot character varying(50) NOT NULL,
    seat_capacity_snapshot integer NOT NULL,
    available_seats integer NOT NULL,
    status character varying(20) DEFAULT 'open'::character varying NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_available_seats CHECK ((available_seats >= 0)),
    CONSTRAINT chk_ride_offers_status CHECK (((status)::text = ANY ((ARRAY['open'::character varying, 'full'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[]))),
    CONSTRAINT chk_seat_capacity CHECK ((seat_capacity_snapshot > 0)),
    CONSTRAINT chk_seat_logic CHECK ((available_seats <= seat_capacity_snapshot))
);



--
-- Name: ride_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ride_requests (
    ride_request_id uuid DEFAULT gen_random_uuid() NOT NULL,
    rider_user_id uuid NOT NULL,
    pickup_location character varying(150) NOT NULL,
    dropoff_location character varying(150) NOT NULL,
    departure_time timestamp with time zone NOT NULL,
    requested_seats integer NOT NULL,
    notes text,
    status character varying(20) DEFAULT 'open'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_ride_requests_requested_seats CHECK ((requested_seats > 0)),
    CONSTRAINT chk_ride_requests_status CHECK (((status)::text = ANY ((ARRAY['open'::character varying, 'matched'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[])))
);



--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    role_id integer NOT NULL,
    role_name character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



--
-- Name: roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: roles_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_role_id_seq OWNED BY public.roles.role_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    role_id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    middle_initial character varying(5),
    last_name character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    contact_number character varying(20),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_email_format CHECK (((email)::text ~~ '%@%.%'::text))
);



--
-- Name: roles role_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN role_id SET DEFAULT nextval('public.roles_role_id_seq'::regclass);


--
-- Name: driver_profiles driver_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_profiles
    ADD CONSTRAINT driver_profiles_pkey PRIMARY KEY (driver_profile_id);


--
-- Name: driver_profiles driver_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_profiles
    ADD CONSTRAINT driver_profiles_user_id_key UNIQUE (user_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (message_id);


--
-- Name: offer_requests offer_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offer_requests
    ADD CONSTRAINT offer_requests_pkey PRIMARY KEY (offer_request_id);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (report_id);


--
-- Name: request_responses request_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_responses
    ADD CONSTRAINT request_responses_pkey PRIMARY KEY (request_response_id);


--
-- Name: ride_offers ride_offers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ride_offers
    ADD CONSTRAINT ride_offers_pkey PRIMARY KEY (ride_offer_id);


--
-- Name: ride_requests ride_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ride_requests
    ADD CONSTRAINT ride_requests_pkey PRIMARY KEY (ride_request_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: uniq_pending_request_per_driver_request; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_pending_request_per_driver_request ON public.request_responses USING btree (ride_request_id, driver_user_id) WHERE ((status)::text = 'pending'::text);


--
-- Name: uniq_pending_request_per_passenger_offer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_pending_request_per_passenger_offer ON public.offer_requests USING btree (ride_offer_id, passenger_user_id) WHERE ((status)::text = 'pending'::text);


--
-- Name: driver_profiles fk_driver_profiles_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_profiles
    ADD CONSTRAINT fk_driver_profiles_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: offer_requests fk_offer_requests_passenger_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offer_requests
    ADD CONSTRAINT fk_offer_requests_passenger_user FOREIGN KEY (passenger_user_id) REFERENCES public.users(user_id);


--
-- Name: offer_requests fk_offer_requests_ride_offer; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offer_requests
    ADD CONSTRAINT fk_offer_requests_ride_offer FOREIGN KEY (ride_offer_id) REFERENCES public.ride_offers(ride_offer_id);


--
-- Name: reports fk_reports_message_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT fk_reports_message_id FOREIGN KEY (message_id) REFERENCES public.messages(message_id);


--
-- Name: reports fk_reports_reported_by_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT fk_reports_reported_by_user_id FOREIGN KEY (reported_by_user_id) REFERENCES public.users(user_id);


--
-- Name: reports fk_reports_reported_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT fk_reports_reported_user_id FOREIGN KEY (reported_user_id) REFERENCES public.users(user_id);


--
-- Name: reports fk_reports_ride_offer_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT fk_reports_ride_offer_id FOREIGN KEY (ride_offer_id) REFERENCES public.ride_offers(ride_offer_id);


--
-- Name: reports fk_reports_ride_request_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT fk_reports_ride_request_id FOREIGN KEY (ride_request_id) REFERENCES public.ride_requests(ride_request_id);


--
-- Name: request_responses fk_request_responses_driver_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_responses
    ADD CONSTRAINT fk_request_responses_driver_user FOREIGN KEY (driver_user_id) REFERENCES public.users(user_id);


--
-- Name: request_responses fk_request_responses_ride_request; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_responses
    ADD CONSTRAINT fk_request_responses_ride_request FOREIGN KEY (ride_request_id) REFERENCES public.ride_requests(ride_request_id);


--
-- Name: ride_offers fk_ride_offers_driver; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ride_offers
    ADD CONSTRAINT fk_ride_offers_driver FOREIGN KEY (driver_profile_id) REFERENCES public.driver_profiles(driver_profile_id);


--
-- Name: ride_offers fk_ride_offers_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ride_offers
    ADD CONSTRAINT fk_ride_offers_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: ride_requests fk_ride_requests_rider_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ride_requests
    ADD CONSTRAINT fk_ride_requests_rider_user FOREIGN KEY (rider_user_id) REFERENCES public.users(user_id);


--
-- Name: users fk_users_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES public.roles(role_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: messages message_offer_request_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT message_offer_request_id FOREIGN KEY (offer_request_id) REFERENCES public.offer_requests(offer_request_id);


--
-- Name: messages message_receive_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT message_receive_user_id FOREIGN KEY (receiver_user_id) REFERENCES public.users(user_id);


--
-- Name: messages message_request_response; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT message_request_response FOREIGN KEY (request_response_id) REFERENCES public.request_responses(request_response_id);


--
-- Name: messages message_ride_offer_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT message_ride_offer_id FOREIGN KEY (ride_offer_id) REFERENCES public.ride_offers(ride_offer_id);


--
-- Name: messages message_ride_request_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT message_ride_request_id FOREIGN KEY (ride_request_id) REFERENCES public.ride_requests(ride_request_id);


--
-- Name: messages message_sender_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT message_sender_user_id FOREIGN KEY (sender_user_id) REFERENCES public.users(user_id);


INSERT INTO public.roles (role_name)
VALUES ('Admin'), ('Driver'), ('Passenger')
ON CONFLICT (role_name) DO NOTHING;

--
-- PostgreSQL database dump complete
--


