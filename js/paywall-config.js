window.MFL_PAYWALL = {
  planId: "pln_monthly-mfl-access-pa6c0ihe",
  priceId: "prc_monthly-vh19z0asx",
  activeStatuses: ["ACTIVE", "TRIALING"],

  // Kit form used only to tag paying members. A Kit automation on this form
  // applies the "Member" tag, which excludes them from the quiz sales sequence
  // and gives us an audience for member-only email (live event reminders).
  // Public form endpoint by design — no API key belongs in client-side code.
  // Leave empty to disable the sync entirely.
  kitMemberFormAction: ""
};
