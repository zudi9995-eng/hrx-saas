import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { SB, LANGS, tr, initials } from './lib/api.js'
import { PLANS, LOGO } from './lib/config.js'

function Logo(){ return <img src={LOGO} alt="HRX" style={{height:"30px",width:"auto",display:"block"}}/>; }



function Toast({msg}){ return msg ? <div className="toast">{msg}</div> : null; }
function LangSwitch({lang,setLang}){
  return (
    <div className="langsel">
      {LANGS.map(([code,lbl])=>(
        <button key={code} className={lang===code?"on":""} onClick={()=>setLang(code)}>{lbl}</button>
      ))}
    </div>
  );
}

// ============ LANDING ============
function Landing({lang,setLang,onSignup,onLogin}){
  const feats=[["📝","feat1t","feat1d"],["🌐","feat2t","feat2d"],["⏱","feat3t","feat3d"],["📊","feat4t","feat4d"],["🔗","feat5t","feat5d"],["🔒","feat6t","feat6d"]];
  return (
    <div>
      <div className="nav"><div className="wrap nav-in">
        <div className="logo"><Logo/></div>
        <div className="nav-links">
          <LangSwitch lang={lang} setLang={setLang}/>
          <button className="navbtn" onClick={onLogin}>{tr(lang,"login")}</button>
          <button className="btn btn-primary btn-sm" onClick={onSignup}>{tr(lang,"start_free")}</button>
        </div>
      </div></div>
      <div className="wrap">
        <div className="hero">
          <span className="badge"><span className="dot"></span>{tr(lang,"land_badge")}</span>
          <h1>{tr(lang,"land_h1a")} <span className="accent">{tr(lang,"land_h1b")}</span></h1>
          <p>{tr(lang,"land_sub")}</p>
          <div className="hero-cta">
            <button className="btn btn-gold btn-lg" onClick={onSignup}>{tr(lang,"land_cta")}</button>
            <button className="btn btn-line btn-lg" onClick={onLogin}>{tr(lang,"login")}</button>
          </div>
          <div className="hero-note">{tr(lang,"land_note")}</div>
          <div className="logos">
            <span>{tr(lang,"land_l1")}</span><span>{tr(lang,"land_l2")}</span><span>{tr(lang,"land_l3")}</span><span>{tr(lang,"land_l4")}</span>
          </div>
        </div>
        <div className="features">
          <div className="section-eyebrow">{tr(lang,"land_eyebrow")}</div>
          <h2 className="section-title">{tr(lang,"land_ftitle")}</h2>
          <p className="section-sub">{tr(lang,"land_fsub")}</p>
          <div className="feat-grid">
            {feats.map((f,i)=>(
              <div className="feat" key={i}><div className="ic">{f[0]}</div><h3>{tr(lang,f[1])}</h3><p>{tr(lang,f[2])}</p></div>
            ))}
          </div>
        </div>
      </div>
      <div className="wrap"><div className="footer"><span><b>HRX</b> · Sales Growth</span><span>{tr(lang,"tagline")}</span></div></div>
    </div>
  );
}

// ============ AUTH ============
function Auth({lang,setLang,mode,setMode,onDone}){
  const [f,setF] = useState({company:"",name:"",email:"",password:""});
  const [err,setErr] = useState(""); const [ok,setOk] = useState(""); const [busy,setBusy] = useState(false);
  const isSignup = mode==="signup";
  async function submit(){
    setErr(""); setOk(""); setBusy(true);
    try {
      if(isSignup){
        if(!f.company.trim()||!f.name.trim()||!f.email.trim()||f.password.length<6){ setErr(tr(lang,"err_fields")); setBusy(false); return; }
        const { data, error } = await SB.auth.signUp({ email:f.email.trim(), password:f.password,
          options:{ data:{ company_name:f.company.trim(), full_name:f.name.trim(), lang } } });
        if(error){ setErr(error.message); setBusy(false); return; }
        if(data.session){ onDone(); } else { setOk(tr(lang,"signup_ok")); setMode("login"); }
      } else {
        const { error } = await SB.auth.signInWithPassword({ email:f.email.trim(), password:f.password });
        if(error){ setErr(error.message); setBusy(false); return; }
        onDone();
      }
    } catch(e){ setErr(String(e.message||e)); }
    setBusy(false);
  }
  return (
    <div>
      <div className="nav"><div className="wrap nav-in">
        <div className="logo" onClick={()=>setMode("landing")} style={{cursor:"pointer"}}><Logo/></div>
        <div className="nav-links">
          <LangSwitch lang={lang} setLang={setLang}/>
          {isSignup
            ? <span style={{fontSize:"14px",color:"var(--muted)"}}>{tr(lang,"have_account")} <a onClick={()=>setMode("login")} style={{color:"var(--ink)",fontWeight:600,cursor:"pointer"}}>{tr(lang,"login")}</a></span>
            : <span style={{fontSize:"14px",color:"var(--muted)"}}>{tr(lang,"new_here")} <a onClick={()=>setMode("signup")} style={{color:"var(--ink)",fontWeight:600,cursor:"pointer"}}>{tr(lang,"start_free")}</a></span>}
        </div>
      </div></div>
      <div className="auth-wrap"><div className="auth-card">
        <h1>{isSignup?tr(lang,"create_ws"):tr(lang,"welcome_back")}</h1>
        <p className="sub">{isSignup?tr(lang,"auth_sub_up"):tr(lang,"auth_sub_in")}</p>
        {err && <div className="err">{err}</div>}
        {ok && <div className="ok">{ok}</div>}
        {isSignup && <>
          <div className="field"><label>{tr(lang,"company_name")}</label>
            <input className="inp" placeholder="Acme Inc." value={f.company} onChange={e=>setF({...f,company:e.target.value})}/></div>
          <div className="field"><label>{tr(lang,"your_name")}</label>
            <input className="inp" placeholder="Jane Doe" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></div>
        </>}
        <div className="field"><label>{tr(lang,"work_email")}</label>
          <input className="inp" type="email" placeholder="you@company.com" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></div>
        <div className="field"><label>{tr(lang,"password")}</label>
          <input className="inp" type="password" placeholder={isSignup?tr(lang,"pw_hint"):tr(lang,"pw_your")} value={f.password}
            onChange={e=>setF({...f,password:e.target.value})} onKeyDown={e=>{if(e.key==="Enter")submit()}}/></div>
        <button className="btn btn-gold btn-block btn-lg" disabled={busy} onClick={submit}>
          {busy?<span className="spin"></span>:(isSignup?tr(lang,"create_ws_btn"):tr(lang,"login"))}
        </button>
        <div className="auth-foot">
          {isSignup ? <>{tr(lang,"have_account")} <a onClick={()=>setMode("login")}>{tr(lang,"login")}</a></>
                    : <>{tr(lang,"new_here")} <a onClick={()=>setMode("signup")}>{tr(lang,"start_free")}</a></>}
        </div>
      </div></div>
    </div>
  );
}

// ============ SHELL ============
function Shell({lang,setLang,session,profile,company,onSignOut}){
  const [tab,setTab] = useState("overview");
  const [toast,setToast] = useState("");
  const flash = m=>{ setToast(m); setTimeout(()=>setToast(""),2600); };
  const plan = PLANS[company.plan] || PLANS.free;
  return (
    <div>
      <Toast msg={toast}/>
      <div className="nav"><div className="wrap nav-in">
        <div className="logo"><Logo/></div>
        <div className="nav-links">
          <LangSwitch lang={lang} setLang={setLang}/>
          <div className="pill-user"><span>{profile.full_name||profile.email}</span><span className="avatar">{initials(profile.full_name||profile.email)}</span></div>
        </div>
      </div></div>
      <div className="shell">
        <aside className="side">
          <div className="side-co">
            <span className="ci">{initials(company.name)}</span>
            <div style={{overflow:"hidden"}}><div className="cn">{company.name}</div><div className="cp">{plan.name} {tr(lang,"plan_word")}</div></div>
          </div>
          {[["overview","nav_overview","◍"],["tests","nav_tests","▤"],["candidates","nav_cands","◔"],["settings","nav_settings","⚙"]].map(([k,l,ic])=>(
            <div key={k} className={"nav-item"+(tab===k?" on":"")} onClick={()=>setTab(k)}><span className="ni">{ic}</span>{tr(lang,l)}</div>
          ))}
          <div style={{position:"absolute",bottom:"20px",left:"14px",right:"14px"}}>
            <div className="nav-item" onClick={onSignOut}><span className="ni">⏻</span>{tr(lang,"sign_out")}</div>
          </div>
        </aside>
        <main className="main">
          {tab==="overview" && <Overview lang={lang} company={company} plan={plan} setTab={setTab}/>}
          {tab==="tests" && <Tests lang={lang} company={company} plan={plan} flash={flash}/>}
          {tab==="candidates" && <Candidates lang={lang} company={company} flash={flash}/>}
          {tab==="settings" && <Settings lang={lang} company={company} profile={profile} flash={flash}/>}
        </main>
      </div>
    </div>
  );
}

// ============ OVERVIEW ============
function Overview({lang,company,plan,setTab}){
  const [stats,setStats] = useState(null);
  useEffect(()=>{
    (async()=>{
      const subs = await SB.from("saas_submissions").select("passed,score_pct,created_at");
      const tests = await SB.from("saas_tests").select("id");
      const rows = subs.data||[];
      const month = rows.filter(r=>{ const d=new Date(r.created_at); const n=new Date(); return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear(); });
      setStats({ tests:(tests.data||[]).length, total:rows.length, passed:rows.filter(r=>r.passed).length, thisMonth:month.length,
        avg: rows.length?Math.round(rows.reduce((a,r)=>a+(r.score_pct||0),0)/rows.length):0 });
    })();
  },[]);
  return (
    <div>
      <div className="page-head"><div><h1>{tr(lang,"nav_overview")}</h1><p>{tr(lang,"ov_sub")}</p></div></div>
      {!stats ? <div className="center-load"><span className="spin dark"></span>{tr(lang,"loading")}</div> : (
        <>
          <div className="stats">
            <div className="stat"><div className="k">{tr(lang,"ov_tests")}</div><div className="v">{stats.tests}</div></div>
            <div className="stat"><div className="k">{tr(lang,"ov_month")}</div><div className="v">{stats.thisMonth}<span style={{fontSize:"15px",color:"var(--muted)",fontWeight:500}}> / {plan.subsPerMonth}</span></div></div>
            <div className="stat"><div className="k">{tr(lang,"ov_passed")}</div><div className="v g">{stats.passed}</div></div>
            <div className="stat"><div className="k">{tr(lang,"ov_avg")}</div><div className="v">{stats.avg}%</div></div>
          </div>
          {stats.tests===0 && (
            <div className="card"><div className="empty"><div className="ic">▤</div><h3>{tr(lang,"ov_empty_t")}</h3><p>{tr(lang,"ov_empty_d")}</p>
              <button className="btn btn-gold" onClick={()=>setTab("tests")}>{tr(lang,"new_test")}</button></div></div>
          )}
        </>
      )}
    </div>
  );
}

// ============ TESTS ============
const emptyQ = ()=>({type:"test",q:"",points:10,options:["","","",""],correct:0});
function Tests({lang,company,plan,flash}){
  const [rows,setRows] = useState(null);
  const [editing,setEditing] = useState(null);
  const load = useCallback(async()=>{ const { data } = await SB.from("saas_tests").select("*").order("created_at",{ascending:false}); setRows(data||[]); },[]);
  useEffect(()=>{ load(); },[load]);
  const atLimit = rows && rows.length>=plan.tests;
  async function save(test){
    const payload = { company_id:company.id, title:test.title, description:test.description, category:test.category,
      pass_pct:Number(test.pass_pct)||80, lang:test.lang||"en", active:true, questions:test.questions };
    if(test.id){ await SB.from("saas_tests").update(payload).eq("id",test.id); } else { await SB.from("saas_tests").insert(payload); }
    setEditing(null); flash(tr(lang,"test_saved")); load();
  }
  async function del(id){ if(!confirm(tr(lang,"del_test_q"))) return; await SB.from("saas_tests").delete().eq("id",id); flash(tr(lang,"test_deleted")); load(); }
  function copyLink(t){ const link=location.origin+location.pathname+"?test="+t.id; navigator.clipboard?.writeText(link).then(()=>flash(tr(lang,"link_copied"))).catch(()=>flash(link)); }
  if(editing) return <TestEditor lang={lang} test={editing} onCancel={()=>setEditing(null)} onSave={save}/>;
  return (
    <div>
      <div className="page-head">
        <div><h1>{tr(lang,"nav_tests")}</h1><p>{tr(lang,"tests_sub")}</p></div>
        <button className="btn btn-gold" disabled={atLimit} onClick={()=>setEditing({title:"",description:"",category:"",pass_pct:80,lang,questions:[emptyQ()]})}>{tr(lang,"new_test")}</button>
      </div>
      {atLimit && <div className="err" style={{marginBottom:"18px"}}>{tr(lang,"limit_msg",{plan:plan.name,n:plan.tests})}</div>}
      {rows===null ? <div className="center-load"><span className="spin dark"></span>{tr(lang,"loading")}</div>
        : rows.length===0 ? (
          <div className="card"><div className="empty"><div className="ic">▤</div><h3>{tr(lang,"no_tests_t")}</h3><p>{tr(lang,"no_tests_d")}</p>
            <button className="btn btn-gold" onClick={()=>setEditing({title:"",description:"",category:"",pass_pct:80,lang,questions:[emptyQ()]})}>{tr(lang,"new_test")}</button></div></div>
        ) : (
          <div className="tgrid">
            {rows.map(t=>{
              const pts=(t.questions||[]).reduce((a,q)=>a+(Number(q.points)||0),0);
              return (
                <div className="tcard" key={t.id}>
                  <h3>{t.title}</h3>
                  <div className="d">{t.description||tr(lang,"no_desc")}</div>
                  <div className="meta">
                    <span className="tag n">{(t.questions||[]).length} {tr(lang,"questions_w")}</span>
                    <span className="tag n">{pts} {tr(lang,"pts_w")}</span>
                    <span className="tag gold">{tr(lang,"pass_w")} {t.pass_pct}%</span>
                  </div>
                  <div className="foot">
                    <button className="btn btn-line btn-sm" onClick={()=>copyLink(t)}>{tr(lang,"copy_link")}</button>
                    <button className="btn btn-ghost btn-sm" onClick={()=>setEditing(t)}>{tr(lang,"edit")}</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>del(t.id)}>{tr(lang,"delete")}</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}

// ============ TEST EDITOR ============
function TestEditor({lang,test,onCancel,onSave}){
  const [t,setT] = useState({...test, questions:test.questions&&test.questions.length?test.questions:[emptyQ()]});
  const upd=(k,v)=>setT({...t,[k]:v});
  function updQ(i,patch){ const qs=[...t.questions]; qs[i]={...qs[i],...patch}; setT({...t,questions:qs}); }
  function addQ(){ setT({...t,questions:[...t.questions,emptyQ()]}); }
  function delQ(i){ setT({...t,questions:t.questions.filter((_,x)=>x!==i)}); }
  function updOpt(qi,oi,val){ const qs=[...t.questions]; const o=[...qs[qi].options]; o[oi]=val; qs[qi]={...qs[qi],options:o}; setT({...t,questions:qs}); }
  const valid = t.title.trim() && t.questions.every(q=>q.q.trim() && (q.type==="open"||q.options.filter(o=>o.trim()).length>=2));
  return (
    <div>
      <div className="page-head">
        <div><h1>{test.id?tr(lang,"ed_edit"):tr(lang,"ed_new")}</h1><p>{tr(lang,"ed_sub")}</p></div>
        <div style={{display:"flex",gap:"10px"}}>
          <button className="btn btn-line" onClick={onCancel}>{tr(lang,"cancel")}</button>
          <button className="btn btn-gold" disabled={!valid} onClick={()=>onSave(t)}>{tr(lang,"save_test")}</button>
        </div>
      </div>
      <div style={{maxWidth:"720px"}}>
        <div className="card" style={{marginBottom:"18px"}}><div style={{padding:"20px"}}>
          <div className="field"><label>{tr(lang,"test_title")}</label>
            <input className="inp" placeholder={tr(lang,"test_title_ph")} value={t.title} onChange={e=>upd("title",e.target.value)}/></div>
          <div className="field"><label>{tr(lang,"description")}</label>
            <textarea className="inp" placeholder={tr(lang,"desc_ph")} value={t.description||""} onChange={e=>upd("description",e.target.value)}/></div>
          <div style={{display:"flex",gap:"14px",flexWrap:"wrap"}}>
            <div className="field" style={{flex:1,minWidth:"140px"}}><label>{tr(lang,"category")}</label>
              <input className="inp" placeholder={tr(lang,"category_ph")} value={t.category||""} onChange={e=>upd("category",e.target.value)}/></div>
            <div className="field" style={{width:"130px"}}><label>{tr(lang,"pass_thr")}</label>
              <input className="inp" type="number" min="1" max="100" value={t.pass_pct} onChange={e=>upd("pass_pct",e.target.value)}/></div>
            <div className="field" style={{width:"130px"}}><label>{tr(lang,"language")}</label>
              <select className="inp" value={t.lang} onChange={e=>upd("lang",e.target.value)}>
                <option value="en">English</option><option value="uz">O'zbek</option><option value="ru">Русский</option><option value="zh">中文</option><option value="tr">Türkçe</option>
              </select></div>
          </div>
        </div></div>
        {t.questions.map((q,i)=>(
          <div className="card" key={i} style={{marginBottom:"14px"}}>
            <div className="card-head">
              <h3>{tr(lang,"question_n")} {i+1}</h3>
              <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                <select className="inp" style={{width:"auto",padding:"7px 10px",fontSize:"13px"}} value={q.type} onChange={e=>updQ(i,{type:e.target.value})}>
                  <option value="test">{tr(lang,"q_mc")}</option><option value="open">{tr(lang,"q_open")}</option>
                </select>
                {t.questions.length>1 && <button className="btn btn-danger btn-sm" onClick={()=>delQ(i)}>{tr(lang,"remove")}</button>}
              </div>
            </div>
            <div style={{padding:"18px 20px"}}>
              <div className="field"><label>{tr(lang,"question_n")}</label>
                <input className="inp" placeholder={tr(lang,"q_ph")} value={q.q} onChange={e=>updQ(i,{q:e.target.value})}/></div>
              <div style={{display:"flex",gap:"14px",marginBottom:q.type==="test"?"14px":"0"}}>
                <div className="field" style={{width:"120px",marginBottom:0}}><label>{tr(lang,"points")}</label>
                  <input className="inp" type="number" min="1" value={q.points} onChange={e=>updQ(i,{points:Number(e.target.value)||0})}/></div>
              </div>
              {q.type==="test" && (
                <div>
                  <label style={{display:"block",fontSize:"13px",fontWeight:600,marginBottom:"8px",color:"var(--ink2)"}}>{tr(lang,"options_pick")}</label>
                  {q.options.map((o,oi)=>(
                    <div key={oi} style={{display:"flex",gap:"10px",alignItems:"center",marginBottom:"8px"}}>
                      <input type="radio" name={"c"+i} checked={q.correct===oi} onChange={()=>updQ(i,{correct:oi})} style={{accentColor:"var(--gold)",width:"18px",height:"18px"}}/>
                      <input className="inp" placeholder={tr(lang,"option_n")+" "+(oi+1)} value={o} onChange={e=>updOpt(i,oi,e.target.value)}/>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <button className="btn btn-line btn-block" onClick={addQ}>{tr(lang,"add_q")}</button>
      </div>
    </div>
  );
}

// ============ CANDIDATES ============
function Candidates({lang,company,flash}){
  const [rows,setRows] = useState(null);
  const [q,setQ] = useState(""); const [fs,setFs]=useState("all"); const [sel,setSel]=useState(null);
  const load = useCallback(async()=>{ const { data } = await SB.from("saas_submissions").select("*").order("created_at",{ascending:false}); setRows(data||[]); },[]);
  useEffect(()=>{ load(); },[load]);
  async function del(id){ if(!confirm(tr(lang,"del_result_q"))) return; await SB.from("saas_submissions").delete().eq("id",id); flash(tr(lang,"result_deleted")); setSel(null); load(); }
  const list=(rows||[]).filter(r=>{ if(fs==="pass"&&!r.passed)return false; if(fs==="fail"&&r.passed)return false;
    if(q){ const s=(r.full_name+" "+r.email+" "+(r.phone||"")).toLowerCase(); if(!s.includes(q.toLowerCase()))return false; } return true; });
  const fmt=d=>{ try{return new Date(d).toLocaleString(lang==="uz"?"en":lang)}catch(e){return d} };
  return (
    <div>
      <div className="page-head"><div><h1>{tr(lang,"nav_cands")}</h1><p>{tr(lang,"cands_sub")}</p></div></div>
      <div style={{display:"flex",gap:"10px",marginBottom:"18px",flexWrap:"wrap"}}>
        <input className="inp" style={{flex:1,minWidth:"200px"}} placeholder={tr(lang,"search_ph")} value={q} onChange={e=>setQ(e.target.value)}/>
        <select className="inp" style={{width:"auto"}} value={fs} onChange={e=>setFs(e.target.value)}>
          <option value="all">{tr(lang,"all_status")}</option><option value="pass">{tr(lang,"passed_s")}</option><option value="fail">{tr(lang,"failed_s")}</option>
        </select>
      </div>
      {rows===null ? <div className="center-load"><span className="spin dark"></span>{tr(lang,"loading")}</div>
        : list.length===0 ? (
          <div className="card"><div className="empty"><div className="ic">◔</div><h3>{tr(lang,"no_cands_t")}</h3><p>{tr(lang,"no_cands_d")}</p></div></div>
        ) : (
          <div className="card"><table>
            <thead><tr><th>{tr(lang,"th_cand")}</th><th>{tr(lang,"th_test")}</th><th>{tr(lang,"th_score")}</th><th>{tr(lang,"th_status")}</th><th>{tr(lang,"th_date")}</th><th></th></tr></thead>
            <tbody>
              {list.map(r=>(
                <tr key={r.id} className="click">
                  <td onClick={()=>setSel(r)}><b>{r.full_name}</b><br/><span style={{color:"var(--muted)",fontSize:"12.5px"}}>{r.email}</span></td>
                  <td onClick={()=>setSel(r)}>{r.test_title||"—"}</td>
                  <td onClick={()=>setSel(r)}><b>{r.score_pct}%</b></td>
                  <td onClick={()=>setSel(r)}><span className={"tag "+(r.passed?"g":"r")}>{r.passed?tr(lang,"passed_s"):tr(lang,"failed_s")}</span></td>
                  <td onClick={()=>setSel(r)} style={{color:"var(--muted)",fontSize:"13px"}}>{fmt(r.created_at)}</td>
                  <td style={{textAlign:"right"}}><button className="btn btn-danger btn-sm" onClick={()=>del(r.id)}>{tr(lang,"delete")}</button></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      {sel && (
        <div className="modal-bg" onClick={()=>setSel(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-h"><div><h2>{sel.full_name}</h2><div style={{color:"var(--muted)",fontSize:"13.5px",marginTop:"4px"}}>{sel.email}{sel.phone?" · "+sel.phone:""}</div></div>
              <button className="x" onClick={()=>setSel(null)}>×</button></div>
            <div className="modal-b">
              <div style={{display:"flex",gap:"8px",marginBottom:"18px",flexWrap:"wrap"}}>
                <span className="tag n">{sel.test_title}</span>
                <span className={"tag "+(sel.passed?"g":"r")}>{sel.score_pct}% · {sel.passed?tr(lang,"passed_s"):tr(lang,"failed_s")}</span>
              </div>
              {(sel.answers||[]).filter(a=>a&&!a.__meta).map((d,idx)=>(
                <div key={idx} style={{border:"1px solid var(--line)",borderRadius:"11px",padding:"14px 16px",marginBottom:"10px"}}>
                  <div style={{fontSize:"14px",fontWeight:600,marginBottom:"7px"}}>{idx+1}. {d.q}</div>
                  {d.type==="test" ? (
                    <div style={{fontSize:"13.5px",color:"var(--muted)"}}>{tr(lang,"answer_l")} <span style={{color:d.correct?"var(--green)":"var(--red)",fontWeight:600}}>{d.chosen}</span>
                      {!d.correct && <span> · {tr(lang,"correct_l")} <span style={{color:"var(--green)",fontWeight:600}}>{d.right}</span></span>}</div>
                  ) : (
                    <div style={{fontSize:"13.5px",color:"var(--muted)"}}><i>{tr(lang,"answer_l")}</i> {d.answer}<br/><b>{d.got}/{d.points} {tr(lang,"pts_w")}</b></div>
                  )}
                </div>
              ))}
              <button className="btn btn-danger btn-block" style={{marginTop:"8px"}} onClick={()=>del(sel.id)}>{tr(lang,"del_result")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ SETTINGS ============
function Settings({lang,company,profile,flash}){
  const [name,setName] = useState(company.name);
  const [busy,setBusy] = useState(false);
  const plan = PLANS[company.plan]||PLANS.free;
  async function save(){ setBusy(true); await SB.from("saas_companies").update({name}).eq("id",company.id); setBusy(false); flash(tr(lang,"saved")); }
  return (
    <div>
      <div className="page-head"><div><h1>{tr(lang,"nav_settings")}</h1><p>{tr(lang,"set_sub")}</p></div></div>
      <div style={{maxWidth:"560px"}}>
        <div className="card" style={{marginBottom:"18px"}}><div style={{padding:"20px"}}>
          <div className="field"><label>{tr(lang,"company_name")}</label><input className="inp" value={name} onChange={e=>setName(e.target.value)}/></div>
          <button className="btn btn-primary" disabled={busy} onClick={save}>{busy?<span className="spin"></span>:tr(lang,"save_changes")}</button>
        </div></div>
        <div className="card"><div style={{padding:"20px"}}>
          <div style={{fontSize:"13px",color:"var(--muted)",fontWeight:600,marginBottom:"6px"}}>{tr(lang,"current_plan")}</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div><div style={{fontSize:"20px",fontWeight:800}}>{plan.name}</div>
              <div style={{fontSize:"13px",color:"var(--muted)",marginTop:"4px"}}>{tr(lang,"plan_detail",{t:plan.tests,c:plan.subsPerMonth})}</div></div>
            <span className="tag gold">{tr(lang,"active")}</span>
          </div>
          <div style={{fontSize:"12.5px",color:"var(--muted)",marginTop:"14px"}}>{tr(lang,"billing_soon")}</div>
        </div></div>
      </div>
    </div>
  );
}

// ============ CANDIDATE TEST RUNNER (public, via ?test=ID) ============
function gradeOpenC(text, kw){
  const a=(text||"").toString().trim().toLowerCase();
  if(a.length<15) return 0;
  const words=kw||[];
  const lenBonus=Math.min(0.30,a.length/600);
  let hit=0; words.forEach(w=>{ if(w&&a.includes(String(w).toLowerCase())) hit++; });
  const kwRatio=words.length?hit/words.length:0.4;
  return Math.min(1,0.25+lenBonus+kwRatio*0.6);
}
function fmtTime(s){ const m=Math.floor(s/60), ss=s%60; return m>0?(m+":"+String(ss).padStart(2,"0")):(ss+"s"); }

function CandidateRunner({lang,setLang,testId}){
  const [test,setTest] = useState(undefined); // undefined=loading, null=notfound
  const [company,setCompany] = useState(null);
  const [stage,setStage] = useState("intro"); // intro | quiz | done
  const [form,setForm] = useState({full_name:"",email:"",phone:""});
  const [err,setErr] = useState("");
  const [i,setI] = useState(0);
  const [ans,setAns] = useState({});
  const [secs,setSecs] = useState(0);
  const [result,setResult] = useState(null);
  const [send,setSend] = useState(0);
  const ansRef = useRef(ans); ansRef.current = ans;
  const iRef = useRef(i); iRef.current = i;

  useEffect(()=>{
    (async()=>{
      const { data } = await SB.from("saas_tests").select("*").eq("id",testId).eq("active",true).maybeSingle();
      if(!data){ setTest(null); return; }
      setTest(data);
      if(data.lang) setLang(data.lang);
      const { data:co } = await SB.from("saas_companies").select("name,logo_url").eq("id",data.company_id).maybeSingle();
      setCompany(co);
    })();
  },[testId]);

  const qs = (test&&test.questions)||[];
  const q = qs[i];
  const qTime = q ? (Number(q.timeSec)|| (q.type==="test"?30:120)) : 30;

  function computeAndFinish(){
    const a=ansRef.current; let earned=0,total=0;
    const detail=qs.map((qq,idx)=>{
      const pts=Number(qq.points)||0; total+=pts;
      if(qq.type==="test"){
        const opts=qq.options||[];
        const hasCorrect = qq.correct!=null && qq.correct>=0;
        const correct = hasCorrect && a[idx]===qq.correct;
        if(correct) earned+=pts;
        else if(!hasCorrect && a[idx]!=null) earned+=pts; // screening: any answer = full (no wrong answer)
        return {type:"test",q:qq.q,points:pts,correct:hasCorrect?!!correct:true,
          chosen:(a[idx]!=null&&opts[a[idx]])?opts[a[idx]]:"—",
          right:hasCorrect&&opts[qq.correct]?opts[qq.correct]:"—"};
      } else {
        const r=gradeOpenC(a[idx],qq.keywords); const got=Math.round(pts*r); earned+=got;
        return {type:"open",q:qq.q,points:pts,got,answer:(a[idx]||"").toString()||"—"};
      }
    });
    const pct=total?Math.round((earned/total)*100):0;
    const passed=pct>=(test.pass_pct||70);
    const res={earned,total,pct,passed,detail};
    setResult(res); setStage("done");
    (async()=>{
      try{
        await SB.from("saas_submissions").insert({
          company_id:test.company_id, test_id:test.id, test_title:test.title,
          full_name:form.full_name, email:form.email, phone:form.phone||"",
          score_earned:earned, score_total:total, score_pct:pct, passed, voided:false, violations:0, answers:detail
        });
        setSend(1);
      }catch(e){ console.error(e); setSend(1); }
    })();
  }

  const goNext = useCallback(()=>{ if(iRef.current>=qs.length-1) computeAndFinish(); else setI(x=>x+1); },[qs.length]);

  useEffect(()=>{
    if(stage!=="quiz") return;
    setSecs(qTime);
    const id=setInterval(()=>{ setSecs(s=>{ if(s<=1){ clearInterval(id); setTimeout(()=>goNext(),250); return 0; } return s-1; }); },1000);
    return ()=>clearInterval(id);
  },[i,stage]);

  if(test===undefined) return <div className="center-load" style={{minHeight:"100vh"}}><span className="spin dark"></span>{tr(lang,"loading")}</div>;
  if(test===null) return (
    <div>
      <div className="nav"><div className="wrap nav-in"><div className="logo"><Logo/></div><LangSwitch lang={lang} setLang={setLang}/></div></div>
      <div className="auth-wrap"><div className="auth-card" style={{textAlign:"center"}}>
        <div style={{fontSize:"40px",marginBottom:"10px"}}>🔍</div>
        <h1>{tr(lang,"cand_notfound")}</h1>
      </div></div>
    </div>
  );

  const cur=ans[i];
  const total = qs.reduce((a,qq)=>a+(Number(qq.points)||0),0);
  const totalMin = Math.round(qs.reduce((a,qq)=>a+(Number(qq.timeSec)||0),0)/60);

  return (
    <div>
      <div className="nav"><div className="wrap nav-in">
        <div className="logo"><Logo/>{company?<span style={{marginLeft:"4px"}}>{company.name}</span>:null}</div>
        <LangSwitch lang={lang} setLang={setLang}/>
      </div></div>

      {stage==="intro" && (
        <div className="auth-wrap"><div className="auth-card">
          <div className="badge" style={{marginBottom:"18px"}}><span className="dot"></span>{test.category||"Assessment"}</div>
          <h1 style={{marginBottom:"8px"}}>{test.title}</h1>
          <p className="sub" style={{marginBottom:"8px"}}>{test.description}</p>
          <div style={{display:"flex",gap:"8px",margin:"0 0 24px",flexWrap:"wrap"}}>
            <span className="tag n">{qs.length} {tr(lang,"questions_w")}</span>
            <span className="tag n">{total} {tr(lang,"pts_w")}</span>
            <span className="tag n">~{totalMin} {tr(lang,"cand_min")}</span>
            <span className="tag gold">{tr(lang,"pass_w")} {test.pass_pct}%</span>
          </div>
          {err && <div className="err">{err}</div>}
          <div className="field"><label>{tr(lang,"cand_name")}</label>
            <input className="inp" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})}/></div>
          <div className="field"><label>{tr(lang,"cand_email")}</label>
            <input className="inp" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
          <div className="field"><label>{tr(lang,"cand_phone")}</label>
            <input className="inp" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
          <button className="btn btn-gold btn-block btn-lg" onClick={()=>{
            if(!form.full_name.trim()||!form.email.trim()){ setErr(tr(lang,"cand_fill")); return; }
            setErr(""); setStage("quiz"); setI(0);
          }}>{tr(lang,"cand_begin")}</button>
        </div></div>
      )}

      {stage==="quiz" && q && (
        <div className="wrap" style={{maxWidth:"720px",paddingTop:"32px"}}>
          <div className="card"><div style={{padding:"26px 28px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
              <span style={{fontSize:"13px",fontWeight:600,color:"var(--muted)"}}>{tr(lang,"cand_question")} {i+1} {tr(lang,"cand_of")} {qs.length}</span>
              <span className="tag" style={{background:secs<=10?"var(--red-soft)":"var(--soft)",color:secs<=10?"var(--red)":"var(--ink2)",fontWeight:700,fontVariantNumeric:"tabular-nums"}}>⏱ {fmtTime(secs)}</span>
            </div>
            <div style={{height:"5px",background:"var(--soft)",borderRadius:"999px",overflow:"hidden",marginBottom:"22px"}}>
              <div style={{height:"100%",width:(secs/qTime*100)+"%",background:secs<=10?"var(--red)":"linear-gradient(90deg,var(--gold),#a9781f)",borderRadius:"999px",transition:"width 1s linear"}}></div>
            </div>
            <span className="tag gold" style={{marginBottom:"12px"}}>{q.type==="test"?tr(lang,"cand_sec_screening"):tr(lang,"cand_sec_open")} · {q.points} {tr(lang,"pts_w")}</span>
            <div style={{fontSize:"19px",fontWeight:700,lineHeight:1.4,margin:"12px 0 22px",whiteSpace:"pre-wrap"}}>{q.q}</div>
            {q.type==="test" ? (
              <div>
                {(q.options||[]).map((o,oi)=>(
                  <button key={oi} onClick={()=>setAns({...ans,[i]:oi})} style={{
                    display:"flex",alignItems:"center",gap:"12px",width:"100%",textAlign:"left",
                    padding:"14px 16px",border:"1px solid "+(cur===oi?"var(--gold)":"var(--line2)"),
                    borderRadius:"12px",marginBottom:"10px",background:cur===oi?"var(--gold-soft)":"#fff",
                    fontSize:"15px",transition:".14s",cursor:"pointer"}}>
                    <span style={{flexShrink:0,width:"20px",height:"20px",borderRadius:"50%",border:"2px solid "+(cur===oi?"var(--gold)":"var(--line2)"),position:"relative"}}>
                      {cur===oi&&<span style={{position:"absolute",inset:"3px",borderRadius:"50%",background:"var(--gold)"}}></span>}
                    </span>{o}
                  </button>
                ))}
              </div>
            ) : (
              <textarea className="inp" style={{minHeight:"160px"}} placeholder={tr(lang,"cand_answer_ph")} value={cur||""} onChange={e=>setAns({...ans,[i]:e.target.value})}/>
            )}
            <button className="btn btn-gold btn-block btn-lg" style={{marginTop:"22px"}} onClick={goNext}>
              {i===qs.length-1?tr(lang,"cand_finish"):tr(lang,"cand_next")}
            </button>
          </div></div>
        </div>
      )}

      {stage==="done" && result && (
        <div className="auth-wrap"><div className="auth-card" style={{textAlign:"center"}}>
          <div style={{width:"96px",height:"96px",borderRadius:"50%",margin:"0 auto 18px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
            background:result.passed?"var(--green-soft)":"var(--red-soft)",color:result.passed?"var(--green)":"var(--red)"}}>
            <span style={{fontSize:"28px",fontWeight:800}}>{result.pct}</span><span style={{fontSize:"11px",fontWeight:600,opacity:.7}}>/ 100</span>
          </div>
          <h1 style={{marginBottom:"8px"}}>{result.passed?tr(lang,"cand_done_pass"):tr(lang,"cand_done_fail")}</h1>
          <p className="sub">{result.passed?tr(lang,"cand_pass_msg",{pct:result.pct}):tr(lang,"cand_fail_msg",{pct:result.pct})}</p>
          <div style={{fontSize:"13px",fontWeight:600,padding:"11px",borderRadius:"10px",marginTop:"8px",
            background:send===0?"var(--soft)":"var(--green-soft)",color:send===0?"var(--muted)":"var(--green)"}}>
            {send===0?tr(lang,"cand_submitting"):tr(lang,"cand_submitted")}
          </div>
        </div></div>
      )}
    </div>
  );
}

// ============ ROOT ============
export default function App(){
  const [lang,setLang] = useState("en");
  const testId = useMemo(()=>{ try{ return new URLSearchParams(location.search).get("test"); }catch(e){ return null; } },[]);
  if(testId) return <CandidateRunner lang={lang} setLang={setLang} testId={testId}/>;
  return <Dashboard lang={lang} setLang={setLang}/>;
}

function Dashboard({lang,setLang}){
  const [mode,setMode] = useState("landing");
  const [session,setSession] = useState(null);
  const [profile,setProfile] = useState(null);
  const [company,setCompany] = useState(null);
  const [loading,setLoading] = useState(true);
  useEffect(()=>{ document.documentElement.lang = lang; },[lang]);

  const loadProfile = useCallback(async(sess)=>{
    if(!sess){ setProfile(null); setCompany(null); return; }
    for(let i=0;i<5;i++){
      const { data:prof } = await SB.from("saas_profiles").select("*").eq("id",sess.user.id).maybeSingle();
      if(prof){ const { data:co } = await SB.from("saas_companies").select("*").eq("id",prof.company_id).maybeSingle(); setProfile(prof); setCompany(co); return; }
      await new Promise(r=>setTimeout(r,700));
    }
  },[]);

  useEffect(()=>{
    SB.auth.getSession().then(async({data})=>{ setSession(data.session); await loadProfile(data.session); setLoading(false); });
    const { data:sub } = SB.auth.onAuthStateChange(async(_e,sess)=>{ setSession(sess); await loadProfile(sess); if(sess) setMode("landing"); });
    return ()=>sub.subscription.unsubscribe();
  },[loadProfile]);

  async function signOut(){ await SB.auth.signOut(); setSession(null); setProfile(null); setCompany(null); setMode("landing"); }

  if(loading) return <div className="center-load" style={{minHeight:"100vh"}}><span className="spin dark"></span>{tr(lang,"loading")}</div>;
  if(session && profile && company) return <Shell lang={lang} setLang={setLang} session={session} profile={profile} company={company} onSignOut={signOut}/>;
  if(session && !profile) return <div className="center-load" style={{minHeight:"100vh"}}><span className="spin dark"></span>{tr(lang,"setting_up")}</div>;
  if(mode==="signup"||mode==="login") return <Auth lang={lang} setLang={setLang} mode={mode} setMode={setMode} onDone={()=>{}}/>;
  return <Landing lang={lang} setLang={setLang} onSignup={()=>setMode("signup")} onLogin={()=>setMode("login")}/>;
}
