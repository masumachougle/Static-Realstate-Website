#!/usr/bin/env bash
# Deploy Supabase edge functions and set Resend secrets.
# Requires: supabase CLI logged in (`supabase login`) and linked (`supabase link`).

set -euo pipefail

supabase secrets set \
  RESEND_API_KEY="${RESEND_API_KEY}" \
  RESEND_NOTIFICATION_EMAIL="${RESEND_NOTIFICATION_EMAIL:-info@ksenzaproperties.ae}" \
  RESEND_FROM_EMAIL="${RESEND_FROM_EMAIL:-KSENZA Properties <info@ksenzaproperties.ae>}"

supabase functions deploy send-contact-email --no-verify-jwt
supabase functions deploy manage-user
