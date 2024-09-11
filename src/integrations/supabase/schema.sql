-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create apps table
CREATE TABLE apps (
    id BIGINT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create opportunities table
CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL,
    details TEXT,
    picture TEXT,
    link TEXT,
    tags TEXT[],
    user_id UUID
);

-- Create farmers table
CREATE TABLE farmers (
    id UUID PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT (TIMEZONE('utc', NOW())),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT (TIMEZONE('utc', NOW())),
    farm_name TEXT,
    location TEXT,
    bio TEXT
);

-- Create leads table
CREATE TABLE leads (
    id BIGINT PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    tags TEXT,
    location TEXT,
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create chats table
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    name TEXT,
    type TEXT,
    user1_id UUID,
    user2_id UUID
);

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    website TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_type VARCHAR(20),
    bio TEXT,
    interests TEXT[],
    experience_level VARCHAR(20)
);

-- Create next_action_status table
CREATE TABLE next_action_status (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT,
    order_index INTEGER NOT NULL
);

-- Create enterprises table
CREATE TABLE enterprises (
    id BIGINT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    name TEXT,
    created_by UUID NOT NULL DEFAULT auth.uid(),
    logo_path TEXT,
    cover_photo_path TEXT,
    description TEXT,
    purpose TEXT
);

-- Create join_requests table
CREATE TABLE join_requests (
    id BIGINT PRIMARY KEY,
    enterprise_id BIGINT REFERENCES enterprises(id),
    user_id UUID,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create sponsorships table
CREATE TABLE sponsorships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    amount NUMERIC NOT NULL,
    frequency TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create enterprise_members table
CREATE TABLE enterprise_members (
    id BIGINT PRIMARY KEY,
    enterprise_id BIGINT REFERENCES enterprises(id),
    user_id UUID,
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create waitlist table
CREATE TABLE waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    interests TEXT[],
    name TEXT,
    location TEXT
);

-- Create messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES chats(id),
    user_id UUID,
    content TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_ai_message BOOLEAN NOT NULL DEFAULT FALSE,
    enterprise_id BIGINT REFERENCES enterprises(id)
);

-- Create enthusiasts table
CREATE TABLE enthusiasts (
    id UUID PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT (TIMEZONE('utc', NOW())),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT (TIMEZONE('utc', NOW())),
    bio TEXT,
    interests TEXT[]
);

-- Create finances table
CREATE TABLE finances (
    id BIGINT PRIMARY KEY,
    enterprise_id BIGINT REFERENCES enterprises(id),
    type TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    description TEXT,
    category TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create action_media table
CREATE TABLE action_media (
    id BIGINT PRIMARY KEY,
    next_action_id BIGINT,
    media_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create next_actions table
CREATE TABLE next_actions (
    id BIGINT PRIMARY KEY,
    project_id BIGINT,
    enterprise_id BIGINT REFERENCES enterprises(id),
    title TEXT NOT NULL,
    details TEXT,
    status TEXT NOT NULL DEFAULT 'to do',
    is_priority BOOLEAN NOT NULL DEFAULT FALSE,
    is_complete BOOLEAN NOT NULL DEFAULT FALSE,
    action_order INTEGER NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create farm_models table
CREATE TABLE farm_models (
    id BIGINT PRIMARY KEY,
    enterprise_id BIGINT REFERENCES enterprises(id),
    purpose TEXT,
    inputs_outputs JSONB,
    infrastructure TEXT,
    short_term_goals JSONB,
    long_term_goals JSONB,
    revenue_streams TEXT[],
    budget TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create project_status table
CREATE TABLE project_status (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT,
    order_index INTEGER NOT NULL
);

-- Add triggers for updating 'updated_at' columns
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
}
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_opportunities_modtime
BEFORE UPDATE ON opportunities
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_farmers_modtime
BEFORE UPDATE ON farmers
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_chats_modtime
BEFORE UPDATE ON chats
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_join_requests_modtime
BEFORE UPDATE ON join_requests
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_sponsorships_modtime
BEFORE UPDATE ON sponsorships
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_enterprise_members_modtime
BEFORE UPDATE ON enterprise_members
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_finances_modtime
BEFORE UPDATE ON finances
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_next_actions_modtime
BEFORE UPDATE ON next_actions
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_farm_models_modtime
BEFORE UPDATE ON farm_models
FOR EACH ROW EXECUTE FUNCTION update_modified_column();