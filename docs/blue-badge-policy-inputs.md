# Blue Badge — inputs for the legal drafts

Planning information only; not effective subscription terms or legal advice.
The final documents require owner approval and qualified legal review.

## Confirmed product direction

The owner confirms that Oldtime will offer Blue Badges.

Existing product decisions establish a planned optional paid membership at
**US $2.99 per month**. The existing PWA iOS wrapper will use Apple StoreKit,
verified directly by Oldtime’s Cloudflare backend. Google Play and web billing
are out of scope.

The owner approved these Blue Badge planning inputs for the legal drafts on
2026-11-08 and subsequently explicitly instructed enabling payments in the
existing PWA. Payment implementation and activation are authorized, subject
to provider setup and server verification. The owner later approved the
policy material as a whole and clarified that digital sales must go through
Apple. Physical goods may use other payment methods, but none are offered.
This is not evidence of attorney review, functioning purchases or publication.

## Keep future plans separate from current availability

The reviewed backend currently reports billing, purchases and restoration as
disabled. Activation is now requested, but approval alone does not make a
store product or native purchase flow operational.

Describe Blue Badge as a planned membership, not an already operational
purchase flow. An installed integration is not proof of active processing.
Do not list Apple or any other purchase processor as currently receiving Oldtime
subscription data solely because they are the chosen future providers.

## Requirements before sales launch

- Disclose the actual store-displayed price, currency, billing period,
  automatic renewal, cancellation method, applicable refund process and
  membership benefits before purchase.
- Implement and verify the relevant native purchase and restoration flow in
  the existing website wrapper. A website-only checkout is not evidence of a
  working native in-app purchase integration.
- Keep membership entitlement verification server-side; a client purchase
  indication must not grant a badge on its own.
- Add accurate disclosures for transaction/receipt references, entitlement
  status and account linkage once that processing is implemented.
- Do not describe previously planned gifts or discounts as available until
  their billing behavior is implemented and verified.
- Retain the separate approval requirement for final terms and publishing.

The shared legal drafts live in
`artifacts/oldtimehive/app/legal-documents.js`; these inputs should be reconciled
with the policy-finalization work before adoption.
