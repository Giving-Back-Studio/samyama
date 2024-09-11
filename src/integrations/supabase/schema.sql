-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'To Do',
    assigned_to UUID,
    start_date DATE,
    end_date DATE,
    next_actions JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create next_actions table (related to projects)
CREATE TABLE IF NOT EXISTS next_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    is_complete BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Existing tables (keeping them for reference)
CREATE TABLE IF NOT EXISTS apps (
    id BIGINT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS opportunities (
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

CREATE TABLE IF NOT EXISTS farmers (
    id UUID PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT (TIMEZONE('utc', NOW())),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT (TIMEZONE('utc', NOW())),
    farm_name TEXT,
    location TEXT,
    bio TEXT
);

-- Add triggers for updating 'updated_at' columns
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_modtime
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_next_actions_modtime
BEFORE UPDATE ON next_actions
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_opportunities_modtime
BEFORE UPDATE ON opportunities
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_farmers_modtime
BEFORE UPDATE ON farmers
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Add next_actions column to projects table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'next_actions') THEN
        ALTER TABLE projects ADD COLUMN next_actions JSONB DEFAULT '[]';
    END IF;
END $$;