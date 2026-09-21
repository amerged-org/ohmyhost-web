/* First-party technical preference and private contact intake. */
(() => {
  const form=document.getElementById('contact-form');if(!form)return;
  let requestKey,previousPayload;
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const input={name:document.getElementById('contact-name').value,email:document.getElementById('contact-email').value,company:document.getElementById('contact-company').value,message:document.getElementById('contact-message').value};
    const payload=JSON.stringify(input);if(previousPayload!==payload){requestKey=crypto.randomUUID();previousPayload=payload;}
    const button=document.getElementById('contact-submit'),result=document.getElementById('contact-result');button.disabled=true;result.textContent='Sending…';
    try{const response=await fetch('/v1/contact-requests',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...input,idempotency_key:requestKey})});if(!response.ok)throw Error(response.status===429?'rate':'send');const receipt=await response.json();if(receipt.accepted!==true)throw Error('send');form.hidden=true;result.textContent='Your request has been received.';}
    catch(error){result.textContent=error.message==='rate'?'Please wait a minute and try again.':'We couldn’t send your request. Your message is still here; please try again.';}
    finally{button.disabled=false;}
  });
})();
