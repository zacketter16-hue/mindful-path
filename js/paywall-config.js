window.MFL_PAYWALL = {
  planId: "pln_monthly-mfl-access-pa6c0ihe",
  priceId: "prc_monthly-vh19z0asx",
  activeStatuses: ["ACTIVE", "TRIALING"],

  // Kit form used only to tag paying members. A Kit automation on this form
  // applies the "Member" tag, which excludes them from the quiz sales sequence
  // and gives us an audience for member-only email (live event reminders).
  // Public form endpoint by design — no API key belongs in client-side code.
  // Leave empty to disable the sync entirely.
  //
  // 9790789 = "Member Signups" (uid f47236abe8). Note the quiz form is the
  // near-identical 9790827 — swapping them would tag every quiz lead as a
  // member and silently disable the sales sequence.
  kitMemberFormAction: "https://app.kit.com/forms/9790789/subscriptions"
};
