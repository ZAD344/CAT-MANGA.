/*
# Add authenticated write policies for admin dashboard

## Overview
The CAT-MANGA admin dashboard requires authenticated users to create and manage
series and chapters. The existing schema only has public SELECT policies. This
migration adds INSERT, UPDATE, and DELETE policies scoped to authenticated users
so that a signed-in admin can add new series and chapters, while anonymous
visitors retain read-only access.

## Modified Tables
1. `series`
   - INSERT policy: authenticated users can create new series
   - UPDATE policy: authenticated users can edit series
   - DELETE policy: authenticated users can delete series
2. `chapters`
   - INSERT policy: authenticated users can create new chapters
   - UPDATE policy: authenticated users can edit chapters
   - DELETE policy: authenticated users can delete chapters

## Security
- SELECT remains public (anon + authenticated) — unchanged.
- INSERT/UPDATE/DELETE scoped to `authenticated` only — requires a valid Supabase session.
- No `user_id` ownership column is needed since this is admin-managed content;
  any authenticated admin can manage all rows.
*/

DROP POLICY IF EXISTS "auth_insert_series" ON series;
CREATE POLICY "auth_insert_series" ON series FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_series" ON series;
CREATE POLICY "auth_update_series" ON series FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_series" ON series;
CREATE POLICY "auth_delete_series" ON series FOR DELETE
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_chapters" ON chapters;
CREATE POLICY "auth_insert_chapters" ON chapters FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_chapters" ON chapters;
CREATE POLICY "auth_update_chapters" ON chapters FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_chapters" ON chapters;
CREATE POLICY "auth_delete_chapters" ON chapters FOR DELETE
  TO authenticated USING (true);
