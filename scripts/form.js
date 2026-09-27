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
    credentials: 'omit'
   });
   if (!response.ok) throw new Error('Request was not accepted');
   message.textContent = 'Thank you. Your callback request has been sent. The practice will contact you to arrange your visit.';
   form.reset();
  } catch {
   message.textContent = 'We could not confirm your request was sent. Please call the practice to book. Your details remain below.';
  } finally {
   sending = false; button.disabled = false; form.removeAttribute('aria-busy');
  }
 });
}
