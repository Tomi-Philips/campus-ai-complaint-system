-- Migration: Fix Complaints Update Policies
-- Recreate update policies on the complaints table to ensure admins and students have correct update access.

-- 1. Drop existing update policies to ensure a clean slate
DROP POLICY IF EXISTS "Admins can update complaints" ON complaints;
DROP POLICY IF EXISTS "Students can update own complaints" ON complaints;

-- 2. Create the Admin Update policy with explicit public schema qualification and WITH CHECK clause
CREATE POLICY "Admins can update complaints" ON complaints 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE public.profiles.id = auth.uid() 
    AND public.profiles.role IN ('admin', 'super_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE public.profiles.id = auth.uid() 
    AND public.profiles.role IN ('admin', 'super_admin')
  )
);

-- 3. Create the Student Update policy to allow students to update their own complaints
CREATE POLICY "Students can update own complaints" ON complaints 
FOR UPDATE 
USING (
  auth.uid() = student_id
)
WITH CHECK (
  auth.uid() = student_id
);
