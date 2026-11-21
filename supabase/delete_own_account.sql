-- Lets a signed-in reader delete their own account from account.html (Delete Account).
-- Run once in the Supabase SQL editor. Without it, the page records a deletion request instead.
create or replace function public.delete_own_account()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.users where id = auth.uid();
$$;

revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
