// Callback form delivery via Netlify Forms.
//
// Netlify registers the form by parsing the built HTML at deploy time, so the
// markup in Home.dc.html is what makes this work — there is no endpoint to
// configure and no key to keep. Submissions post back to the site itself as
// URL-encoded data; JSON is not supported. Who gets notified is set in
// Netlify under Forms > Submission notifications.
const form = document.querySelector('[data-contact-form]');
if (form) {
 const message = form.querySelector('[data-form-message]');
 const button = form.querySelector('button[type="submit"]');
 let sending = false;
 form.addEventListener('submit', async event => {
  event.preventDefault();
  if (sending || !form.reportValidity()) return;
  // Netlify injects the reCAPTCHA widget, and its response field, at deploy
  // time. Check it only when it is actually present, so the form still works
  // locally and on any host that has not injected it.
  const captcha = form.querySelector('[name="g-recaptcha-response"]');
  if (captcha && !captcha.value) {
   message.textContent = 'Please confirm you are not a robot, then send your request again.';
   return;
  }
  sending = true; button.disabled = true; form.setAttribute('aria-busy', 'true');
  message.textContent = 'Sending your callback request…';
  try {
   const response = await fetch('/', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams(new FormData(form)).toString(),
    signal: AbortSignal.timeout(15000),
    // Same-origin: the cookie must go with it. While the project is private or
    // password protected, Netlify's access gate answers 401 without it and the
    // submission never reaches form processing, so it lands in neither the
    // verified nor the spam list. 'omit' was right when this posted to a
    // third-party endpoint; it is wrong now that it posts to the site itself.
    credentials: 'same-origin'
   });
   if (!response.ok) throw new Error(`Submission rejected with HTTP ${response.status}`);
   message.textContent = 'Thank you. Your callback request has been sent. The practice will contact you to arrange your visit.';
   form.reset();
  } catch (error) {
   // Visitors get a calm message; the reason goes to the console so a failed
   // submission can be diagnosed without guessing.
   console.error('Callback form submission failed:', error);
   message.textContent = 'We could not confirm your request was sent. Please call the practice to book. Your details remain below.';
  } finally {
   sending = false; button.disabled = false; form.removeAttribute('aria-busy');
  }
 });
}
