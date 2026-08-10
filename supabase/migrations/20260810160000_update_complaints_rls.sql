-- Migration: Update Complaints RLS select policy to allow all authenticated users
-- This enables students to see and track other students' complaints.

-- 1. Drop the old restrictive SELECT policy
DROP POLICY IF EXISTS "Complaints are viewable by owner and admins" ON complaints;

-- 2. Create a new SELECT policy allowing all authenticated users to read complaints
CREATE POLICY "Complaints are viewable by all authenticated users"
ON complaints
FOR SELECT
USING (auth.uid() IS NOT NULL);
