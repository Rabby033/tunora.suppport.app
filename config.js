/* ==========================================================================
   Tunora Support — site configuration
   --------------------------------------------------------------------------
   Change these values in ONE place. main.js applies them across every page.
   The HTML also contains sensible default hrefs, so links keep working even
   if JavaScript is disabled.
   ========================================================================== */

window.TUNORA_CONFIG = {
  // Support contact — used for every mailto: link and displayed address.
  supportEmail: "tunora.support@gmail.com",

  // Legal pages. Point these at external URLs if you host the policies
  // elsewhere; otherwise they use the bundled pages in this folder.
  privacyUrl: "privacy.html",
  termsUrl: "terms.html",

  // Apple's subscription management deep link (works on iOS + web).
  manageSubscriptionsUrl: "https://apps.apple.com/account/subscriptions",

  // App Store review/listing link (optional). Leave "" to hide "Rate" links.
  appStoreUrl: ""
};
