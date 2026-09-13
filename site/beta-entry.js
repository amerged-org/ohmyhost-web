/* The server supplies an eligible source; the existing backend rechecks it at signup. */
(() => {
  const source=document.querySelector('meta[name="ohmyhost-signup-source"]')?.content;
  const prompt='Read https://ohmyho.st/llms.txt and https://ohmyho.st/skills/ohmyhost-get-started/SKILL.md. Connect this agent to ohmyho.st and deploy this GitHub project using only the capabilities it needs. '+(source?'My invitation is https://ohmyho.st/?r='+encodeURIComponent(source)+'. ':'')+'Follow the deployment Skill, keep my existing project decisions and verify the app.';

  const buttons='[data-copy], #copy, #shcopy2, #shcopy, [data-wincopy], [data-beta-access]';
  document.querySelectorAll(buttons).forEach(button=>{const label=button.querySelector('span');if(label)label.textContent=source?'Copy prompt for your agent':'Get beta access';else if(button.matches('[data-beta-access]'))button.textContent=source?'Copy prompt for your agent':'Get beta access';});
  document.querySelectorAll('.body.prompt').forEach(node=>node.textContent=prompt);
  const modal=document.getElementById('beta-modal');
  document.addEventListener('click',async event=>{
    const button=event.target.closest?.(buttons);if(!button)return;
    event.preventDefault();event.stopImmediatePropagation();
    if(!source){modal.showModal();document.getElementById('beta-email').focus();return;}
    const label=button.querySelector('span')||button;
    try{
      if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(prompt);
      else {const field=document.createElement('textarea');field.value=prompt;document.body.append(field);field.select();const copied=document.execCommand('copy');field.remove();if(!copied)throw Error('copy');}
      label.textContent='Copied';button.classList.add('done');
      document.getElementById('next')?.classList.add('on');
      const hero=document.getElementById('hero-cta');if(hero)hero.style.display='none';
      const under=document.getElementById('under');if(under)under.style.display='none';
      setTimeout(()=>{label.textContent='Copy prompt for your agent';button.classList.remove('done');},2500);
    }catch{label.textContent='Copy failed — select the prompt';document.getElementById('next')?.classList.add('on');}
  },true);
  document.getElementById('beta-close').addEventListener('click',()=>modal.close());
  modal.addEventListener('click',event=>{if(event.target===modal){const bounds=modal.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)modal.close();}});
  const form=document.getElementById('beta-form'),message=document.getElementById('beta-message'),submit=document.getElementById('beta-submit');
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(!form.reportValidity())return;submit.disabled=true;message.textContent='Saving…';
    try{
      const response=await fetch('/v1/beta/interests',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:document.getElementById('beta-email').value,consent:document.getElementById('beta-consent').checked,consent_version:'beta-interest-2026-09-13'})});
      if(!response.ok)throw Error(response.status===429?'rate':'save');
      const result=await response.json();if(result.accepted!==true)throw Error('save');
      form.hidden=true;message.textContent='You’re on the list. Thanks for your interest.';
    }catch(error){message.textContent=error.message==='rate'?'Please wait a minute and try again.':'We couldn’t save your email. Please try again.';}
    finally{submit.disabled=false;}
  });
  document.addEventListener('click',async event=>{
    const button=event.target.closest?.('.want');if(!button)return;event.preventDefault();event.stopImmediatePropagation();
    if(button.classList.contains('done')||button.disabled)return;
    button.disabled=true;const key='omh-feature-'+button.dataset.f;
    let requestKey;try{requestKey=sessionStorage.getItem(key)||crypto.randomUUID();sessionStorage.setItem(key,requestKey);}catch{requestKey=crypto.randomUUID();}
    try{const response=await fetch('/want',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({feature:button.dataset.f,idempotency_key:requestKey})});
      if(!response.ok||(await response.json()).accepted!==true)throw Error('save');button.classList.add('done');button.textContent='✓';button.dataset.tip='Noted. Thanks.';
    }catch{button.dataset.tip='Could not save. Please retry.';}finally{button.disabled=false;}
  },true);
  const status=document.getElementById('service-status');if(status)fetch('/status.json',{cache:'no-store'}).then(response=>{if(!response.ok)throw Error('status');return response.json();}).then(result=>{status.replaceChildren();for(const component of result.components){const row=document.createElement('p');row.textContent=component.name+': '+component.status.replaceAll('_',' ');status.append(row);}const time=document.createElement('p');time.textContent='Checked '+result.observed_at;status.append(time);}).catch(()=>status.textContent='Status is temporarily unavailable. Please retry.');
})();
