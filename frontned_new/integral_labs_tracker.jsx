import { useState, useEffect, useCallback } from "react";

const WEEK_DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const TEAM_MEMBERS = ["Person A","Person B","Manager"];
const SOURCES = ["Google Maps","Instagram","JustDial","LinkedIn","Other"];
const CHANNELS = ["Instagram DM","WhatsApp","Email","LinkedIn","Other"];
const LEAD_TYPES = {
  "1":"Type 1 — No website + High competition",
  "2":"Type 2 — Bad website + Running ads",
  "3":"Type 3 — No website + Low competition",
  "4":"Type 4 — Active IG + No website"
};
const FREE_VALUE = {
  "1":"Competitor Report",
  "2":"Annotated Website Audit",
  "3":"Homepage Mockup",
  "4":"Mockup / IG Post Designs"
};
const STATUSES = ["New","Classified","Researched","FV Ready","Messaged","Replied","Call Booked","Closed","Dead"];
const STATUS_COLORS = {
  "New":"#B5D4F4","Classified":"#CECBF6","Researched":"#FAC775",
  "FV Ready":"#C0DD97","Messaged":"#85B7EB","Replied":"#EF9F27",
  "Call Booked":"#1D9E75","Closed":"#3B6D11","Dead":"#F09595"
};
const STATUS_TEXT = {
  "New":"#0C447C","Classified":"#3C3489","Researched":"#633806",
  "FV Ready":"#27500A","Messaged":"#042C53","Replied":"#412402",
  "Call Booked":"white","Closed":"white","Dead":"#791F1F"
};

function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
function today(){ return new Date().toISOString().slice(0,10); }
function dayLabel(d){ const days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]; return days[new Date(d+"T12:00:00").getDay()]; }

const EMPTY_LEAD = {
  gymName:"",city:"",source:"Google Maps",channel:"Instagram DM",
  handle:"",ownerName:"",reviews:"",hasWebsite:"No",
  type:"1",score:0,list:"3500",assignedTo:"Person A",
  status:"New",addedBy:"Person A",dateAdded:today(),
  competitorName:"",compReviews:"",problems:"",membersLost:"",revenueLost:"",
  fvType:"",fvCreated:"No",fvLink:"",researchDate:"",researchBy:"",
  notes:""
};

const SCORE_ITEMS = [
  {label:"Running paid ads",pts:3},
  {label:"Professional photos/video content",pts:2},
  {label:"Multiple locations or expanding",pts:2},
  {label:"Owner name identified",pts:2},
  {label:"WhatsApp number found",pts:2},
  {label:"Email address found",pts:1},
  {label:"3+ competitors in area",pts:2},
  {label:"Enquiries in IG comments",pts:2},
  {label:"Posted within last 7 days",pts:1},
  {label:"Listed on JustDial/IndiaMart",pts:1},
];

function Badge({status}){
  return (
    <span style={{
      background:STATUS_COLORS[status]||"#eee",
      color:STATUS_TEXT[status]||"#333",
      padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:500,whiteSpace:"nowrap"
    }}>{status}</span>
  );
}

function StatCard({label,value,sub,color}){
  return (
    <div style={{background:"rgba(0,0,0,0.03)",borderRadius:10,padding:"12px 14px",border:"0.5px solid rgba(0,0,0,0.08)"}}>
      <div style={{fontSize:11,color:"#888",marginBottom:4}}>{label}</div>
      <div style={{fontSize:22,fontWeight:600,color:color||"inherit"}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:"#aaa",marginTop:2}}>{sub}</div>}
    </div>
  );
}

function ProgressBar({val,max,color}){
  const pct = max>0?Math.min(100,Math.round(val/max*100)):0;
  return (
    <div style={{height:6,background:"rgba(0,0,0,0.08)",borderRadius:3,overflow:"hidden"}}>
      <div style={{width:pct+"%",height:"100%",background:color||"#378ADD",borderRadius:3,transition:"width 0.3s"}}/>
    </div>
  );
}

export default function App(){
  const [leads,setLeads] = useState([]);
  const [messages,setMessages] = useState([]);
  const [tab,setTab] = useState("dashboard");
  const [loaded,setLoaded] = useState(false);
  const [showAddLead,setShowAddLead] = useState(false);
  const [showAddMsg,setShowAddMsg] = useState(false);
  const [newLead,setNewLead] = useState({...EMPTY_LEAD});
  const [newMsg,setNewMsg] = useState({leadId:"",channel:"Instagram DM",sentBy:"Person A",msgType:"First message",response:"No reply",date:today(),notes:""});
  const [filterPerson,setFilterPerson] = useState("All");
  const [filterStatus,setFilterStatus] = useState("All");
  const [filterList,setFilterList] = useState("All");
  const [editId,setEditId] = useState(null);
  const [scoreChecked,setScoreChecked] = useState([]);
  const [expandedLead,setExpandedLead] = useState(null);

  useEffect(()=>{
    async function load(){
      try{
        const l = await window.storage.get("il_leads_v2");
        if(l) setLeads(JSON.parse(l.value));
      }catch(e){}
      try{
        const m = await window.storage.get("il_messages_v2");
        if(m) setMessages(JSON.parse(m.value));
      }catch(e){}
      setLoaded(true);
    }
    load();
  },[]);

  const saveLeads = useCallback(async(data)=>{
    setLeads(data);
    try{ await window.storage.set("il_leads_v2",JSON.stringify(data)); }catch(e){}
  },[]);

  const saveMsgs = useCallback(async(data)=>{
    setMessages(data);
    try{ await window.storage.set("il_messages_v2",JSON.stringify(data)); }catch(e){}
  },[]);

  const computedScore = scoreChecked.reduce((s,i)=>s+(SCORE_ITEMS[i]?.pts||0),0);

  function addLead(){
    if(!newLead.gymName.trim()) return;
    const score = computedScore;
    const list = score>=8?"500 Deep":"3500 General";
    const fvType = FREE_VALUE[newLead.type]||"";
    const entry = {...newLead,id:uid(),score,list,fvType,status:"New",dateAdded:today()};
    const updated = [entry,...leads];
    saveLeads(updated);
    setNewLead({...EMPTY_LEAD});
    setScoreChecked([]);
    setShowAddLead(false);
  }

  function updateLeadField(id,field,value){
    const updated = leads.map(l=>l.id===id?{...l,[field]:value}:l);
    saveLeads(updated);
  }

  function addMessage(){
    if(!newMsg.leadId) return;
    const entry = {...newMsg,id:uid()};
    const updated = [entry,...messages];
    saveMsgs(updated);
    const lead = leads.find(l=>l.id===newMsg.leadId);
    if(lead){
      let newStatus = "Messaged";
      if(newMsg.response==="Positive") newStatus="Replied";
      if(newMsg.response==="Call booked") newStatus="Call Booked";
      if(newMsg.msgType!=="First message"&&lead.status==="Messaged") newStatus="Messaged";
      updateLeadField(newMsg.leadId,"status",newStatus);
    }
    setNewMsg({leadId:"",channel:"Instagram DM",sentBy:"Person A",msgType:"First message",response:"No reply",date:today(),notes:""});
    setShowAddMsg(false);
  }

  function deleteLead(id){
    saveLeads(leads.filter(l=>l.id!==id));
    saveMsgs(messages.filter(m=>m.leadId!==id));
  }

  const filtered = leads.filter(l=>{
    if(filterPerson!=="All"&&l.assignedTo!==filterPerson) return false;
    if(filterStatus!=="All"&&l.status!==filterStatus) return false;
    if(filterList!=="All"&&l.list!==filterList) return false;
    return true;
  });

  const deepLeads = leads.filter(l=>l.list==="500 Deep");
  const totalMessages = messages.length;
  const replies = messages.filter(m=>m.response==="Positive"||m.response==="Call booked").length;
  const closed = leads.filter(l=>l.status==="Closed").length;

  const perPerson = (person)=>({
    found: leads.filter(l=>l.addedBy===person).length,
    messaged: messages.filter(m=>m.sentBy===person).length,
    deep: leads.filter(l=>l.assignedTo===person&&l.list==="500 Deep").length,
    closed: leads.filter(l=>l.assignedTo===person&&l.status==="Closed").length,
  });

  const pA = perPerson("Person A");
  const pB = perPerson("Person B");

  const followupsDue = leads.filter(l=>{
    const msgs = messages.filter(m=>m.leadId===l.id);
    if(!msgs.length) return false;
    if(l.status==="Closed"||l.status==="Dead") return false;
    const first = msgs.reduce((a,b)=>a.date<b.date?a:b);
    const daysSince = Math.floor((Date.now()-new Date(first.date).getTime())/(1000*60*60*24));
    const followupDays = [3,7,12];
    const sentTypes = msgs.map(m=>m.msgType);
    for(const d of followupDays){
      const fuType = d===3?"Follow-up 1":d===7?"Follow-up 2":"Follow-up 3";
      if(daysSince>=d&&!sentTypes.includes(fuType)) return true;
    }
    return false;
  });

  const tabs = [
    {id:"dashboard",label:"Dashboard",icon:"ti-chart-bar"},
    {id:"add",label:"Add lead",icon:"ti-plus"},
    {id:"pipeline",label:"Pipeline",icon:"ti-list"},
    {id:"deep",label:"Deep 500",icon:"ti-microscope"},
    {id:"messages",label:"Messages",icon:"ti-message"},
    {id:"followups",label:"Follow-ups",icon:"ti-bell"},
  ];

  const s = {
    wrap:{padding:"1rem 0",fontFamily:"var(--font-sans)",color:"var(--color-text-primary)"},
    tabBar:{display:"flex",gap:6,marginBottom:20,overflowX:"auto",paddingBottom:4,flexWrap:"wrap"},
    tab:(active)=>({padding:"7px 14px",border:`0.5px solid ${active?"var(--color-border-secondary)":"var(--color-border-tertiary)"}`,borderRadius:8,fontSize:12,fontWeight:500,cursor:"pointer",background:active?"var(--color-background-secondary)":"var(--color-background-primary)",color:active?"var(--color-text-primary)":"var(--color-text-secondary)",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:6}),
    card:{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:"14px 16px",marginBottom:12},
    label:{fontSize:11,color:"var(--color-text-secondary)",marginBottom:4,display:"block"},
    input:{width:"100%",fontSize:13,padding:"7px 10px",border:"0.5px solid var(--color-border-secondary)",borderRadius:8,background:"var(--color-background-primary)",color:"var(--color-text-primary)"},
    select:{width:"100%",fontSize:13,padding:"7px 10px",border:"0.5px solid var(--color-border-secondary)",borderRadius:8,background:"var(--color-background-primary)",color:"var(--color-text-primary)"},
    grid2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},
    grid4:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:14},
    secLabel:{fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.06em",margin:"12px 0 8px",paddingBottom:4,borderBottom:"0.5px solid var(--color-border-tertiary)"},
    btnPrimary:{padding:"8px 16px",border:"0.5px solid #B5D4F4",borderRadius:8,fontSize:13,fontWeight:500,cursor:"pointer",background:"#E6F1FB",color:"#0C447C"},
    btnGhost:{padding:"8px 16px",border:"0.5px solid var(--color-border-secondary)",borderRadius:8,fontSize:13,cursor:"pointer",background:"var(--color-background-secondary)",color:"var(--color-text-primary)"},
    btnDanger:{padding:"6px 12px",border:"0.5px solid #F7C1C1",borderRadius:6,fontSize:12,cursor:"pointer",background:"#FCEBEB",color:"#791F1F"},
    row:{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"},
    th:{fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)",padding:"6px 8px",textAlign:"left",background:"var(--color-background-secondary)",whiteSpace:"nowrap"},
    td:{fontSize:12,padding:"8px 8px",borderBottom:"0.5px solid var(--color-border-tertiary)",verticalAlign:"top"},
  };

  if(!loaded) return <div style={{padding:"2rem",fontSize:13,color:"var(--color-text-secondary)"}}>Loading system...</div>;

  return (
    <div style={s.wrap}>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:16,fontWeight:500}}>Integral Labs — outreach tracker</div>
        <div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:2}}>Week 1 · Target: 1000 outreaches · 2 team members</div>
      </div>

      <div style={s.tabBar}>
        {tabs.map(t=>(
          <div key={t.id} style={s.tab(tab===t.id)} onClick={()=>setTab(t.id)}>
            <i className={`ti ${t.icon}`} aria-hidden="true"/>
            {t.label}
            {t.id==="followups"&&followupsDue.length>0&&<span style={{background:"#E24B4A",color:"white",borderRadius:10,fontSize:10,fontWeight:500,padding:"1px 5px"}}>{followupsDue.length}</span>}
          </div>
        ))}
      </div>

      {/* DASHBOARD */}
      {tab==="dashboard"&&(
        <div>
          <div style={s.grid4}>
            <StatCard label="Total leads found" value={leads.length} sub={`Goal: 1000`} color="#185FA5"/>
            <StatCard label="Messages sent" value={totalMessages} sub={`Goal: 700-800/week`} color="#534AB7"/>
            <StatCard label="Replies received" value={replies} color="#1D9E75"/>
            <StatCard label="Closed / Booked" value={closed+leads.filter(l=>l.status==="Call Booked").length} color="#639922"/>
          </div>

          <div style={s.grid2}>
            <div style={s.card}>
              <div style={{fontSize:13,fontWeight:500,marginBottom:10}}>Person A</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <div><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:"var(--color-text-secondary)"}}>Leads found</span><span style={{fontWeight:500}}>{pA.found}</span></div><ProgressBar val={pA.found} max={500} color="#378ADD"/></div>
                <div><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:"var(--color-text-secondary)"}}>Messages sent</span><span style={{fontWeight:500}}>{pA.messaged}</span></div><ProgressBar val={pA.messaged} max={400} color="#7F77DD"/></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span style={{color:"var(--color-text-secondary)"}}>Deep research leads</span><span style={{fontWeight:500}}>{pA.deep}</span></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span style={{color:"var(--color-text-secondary)"}}>Closed</span><span style={{fontWeight:500,color:"#3B6D11"}}>{pA.closed}</span></div>
              </div>
            </div>
            <div style={s.card}>
              <div style={{fontSize:13,fontWeight:500,marginBottom:10}}>Person B</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <div><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:"var(--color-text-secondary)"}}>Leads found</span><span style={{fontWeight:500}}>{pB.found}</span></div><ProgressBar val={pB.found} max={500} color="#378ADD"/></div>
                <div><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:"var(--color-text-secondary)"}}>Messages sent</span><span style={{fontWeight:500}}>{pB.messaged}</span></div><ProgressBar val={pB.messaged} max={400} color="#7F77DD"/></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span style={{color:"var(--color-text-secondary)"}}>Deep research leads</span><span style={{fontWeight:500}}>{pB.deep}</span></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span style={{color:"var(--color-text-secondary)"}}>Closed</span><span style={{fontWeight:500,color:"#3B6D11"}}>{pB.closed}</span></div>
              </div>
            </div>
          </div>

          <div style={s.card}>
            <div style={{fontSize:13,fontWeight:500,marginBottom:10}}>Weekly pipeline</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {STATUSES.map(st=>{
                const count = leads.filter(l=>l.status===st).length;
                return (
                  <div key={st} style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:100,flexShrink:0}}><Badge status={st}/></div>
                    <div style={{flex:1}}><ProgressBar val={count} max={Math.max(leads.length,1)} color={STATUS_COLORS[st]}/></div>
                    <div style={{fontSize:12,fontWeight:500,minWidth:24,textAlign:"right"}}>{count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={s.card}>
            <div style={{fontSize:13,fontWeight:500,marginBottom:10}}>Follow-ups due now <span style={{background:"#FCEBEB",color:"#791F1F",padding:"2px 8px",borderRadius:6,fontSize:11,marginLeft:6}}>{followupsDue.length}</span></div>
            {followupsDue.length===0&&<div style={{fontSize:12,color:"var(--color-text-tertiary)"}}>No follow-ups due. Good job!</div>}
            {followupsDue.slice(0,5).map(l=>(
              <div key={l.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                <div><div style={{fontSize:13}}>{l.gymName}</div><div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{l.assignedTo} · {l.city}</div></div>
                <Badge status={l.status}/>
              </div>
            ))}
            {followupsDue.length>5&&<div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:6}}>+{followupsDue.length-5} more — see Follow-ups tab</div>}
          </div>
        </div>
      )}

      {/* ADD LEAD */}
      {tab==="add"&&(
        <div style={s.card}>
          <div style={{fontSize:14,fontWeight:500,marginBottom:4}}>Add new lead</div>
          <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:14}}>Fill every field before moving to research. Score the lead at the bottom to auto-assign to 500 Deep or 3500 General.</div>

          <div style={s.secLabel}>Basic info</div>
          <div style={{...s.grid2,marginBottom:10}}>
            <div><label style={s.label}>Gym / business name *</label><input style={s.input} value={newLead.gymName} onChange={e=>setNewLead({...newLead,gymName:e.target.value})} placeholder="e.g. FitLife Gym"/></div>
            <div><label style={s.label}>City</label><input style={s.input} value={newLead.city} onChange={e=>setNewLead({...newLead,city:e.target.value})} placeholder="e.g. Lucknow"/></div>
          </div>
          <div style={{...s.grid2,marginBottom:10}}>
            <div><label style={s.label}>Source</label><select style={s.select} value={newLead.source} onChange={e=>setNewLead({...newLead,source:e.target.value})}>{SOURCES.map(s=><option key={s}>{s}</option>)}</select></div>
            <div><label style={s.label}>Contact channel</label><select style={s.select} value={newLead.channel} onChange={e=>setNewLead({...newLead,channel:e.target.value})}>{CHANNELS.map(c=><option key={c}>{c}</option>)}</select></div>
          </div>
          <div style={{...s.grid2,marginBottom:10}}>
            <div><label style={s.label}>IG handle / phone / email</label><input style={s.input} value={newLead.handle} onChange={e=>setNewLead({...newLead,handle:e.target.value})} placeholder="@gymhandle or 9876543210"/></div>
            <div><label style={s.label}>Owner name (if found)</label><input style={s.input} value={newLead.ownerName} onChange={e=>setNewLead({...newLead,ownerName:e.target.value})} placeholder="Rahul / Unknown"/></div>
          </div>
          <div style={{...s.grid2,marginBottom:10}}>
            <div><label style={s.label}>Google reviews count</label><input style={s.input} type="number" value={newLead.reviews} onChange={e=>setNewLead({...newLead,reviews:e.target.value})} placeholder="0"/></div>
            <div><label style={s.label}>Has website?</label><select style={s.select} value={newLead.hasWebsite} onChange={e=>setNewLead({...newLead,hasWebsite:e.target.value})}><option>No</option><option>Yes — good</option><option>Yes — bad</option></select></div>
          </div>
          <div style={{...s.grid2,marginBottom:10}}>
            <div><label style={s.label}>Lead type</label><select style={s.select} value={newLead.type} onChange={e=>setNewLead({...newLead,type:e.target.value})}>{Object.entries(LEAD_TYPES).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div>
            <div><label style={s.label}>Assigned to</label><select style={s.select} value={newLead.assignedTo} onChange={e=>setNewLead({...newLead,assignedTo:e.target.value})}>{TEAM_MEMBERS.map(m=><option key={m}>{m}</option>)}</select></div>
          </div>
          <div style={{marginBottom:10}}><label style={s.label}>Added by</label><select style={s.select} value={newLead.addedBy} onChange={e=>setNewLead({...newLead,addedBy:e.target.value})}>{TEAM_MEMBERS.map(m=><option key={m}>{m}</option>)}</select></div>

          <div style={s.secLabel}>Score this lead (tick all that apply)</div>
          <div style={{marginBottom:12}}>
            {SCORE_ITEMS.map((item,i)=>(
              <div key={i} onClick={()=>setScoreChecked(prev=>prev.includes(i)?prev.filter(x=>x!==i):[...prev,i])} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:"0.5px solid var(--color-border-tertiary)",cursor:"pointer"}}>
                <div style={{width:18,height:18,borderRadius:4,border:`1.5px solid ${scoreChecked.includes(i)?"#639922":"var(--color-border-secondary)"}`,background:scoreChecked.includes(i)?"#EAF3DE":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {scoreChecked.includes(i)&&<i className="ti ti-check" style={{fontSize:11,color:"#3B6D11"}} aria-hidden="true"/>}
                </div>
                <span style={{flex:1,fontSize:13}}>{item.label}</span>
                <span style={{fontSize:11,fontWeight:500,color:"#185FA5",background:"#E6F1FB",padding:"2px 6px",borderRadius:4}}>+{item.pts}</span>
              </div>
            ))}
            <div style={{marginTop:12,padding:"10px 14px",background:"var(--color-background-secondary)",borderRadius:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13}}>Total score: <strong>{computedScore}</strong></span>
              <span style={{fontSize:13,fontWeight:500,background:computedScore>=8?"#CECBF6":computedScore>=4?"#FAEEDA":"#FCEBEB",color:computedScore>=8?"#3C3489":computedScore>=4?"#633806":"#791F1F",padding:"4px 12px",borderRadius:6}}>{computedScore>=8?"→ 500 Deep list":computedScore>=4?"→ 3500 General list":"→ Low priority"}</span>
            </div>
          </div>

          <div style={{marginBottom:10}}><label style={s.label}>Notes (optional)</label><input style={s.input} value={newLead.notes} onChange={e=>setNewLead({...newLead,notes:e.target.value})} placeholder="Any additional observations..."/></div>

          <div style={{display:"flex",gap:8,marginTop:4}}>
            <button style={s.btnPrimary} onClick={addLead}><i className="ti ti-plus" aria-hidden="true"/> Add lead</button>
            <button style={s.btnGhost} onClick={()=>{setNewLead({...EMPTY_LEAD});setScoreChecked([]);}}>Clear</button>
          </div>
        </div>
      )}

      {/* PIPELINE */}
      {tab==="pipeline"&&(
        <div>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
            <select style={{...s.select,width:"auto",fontSize:12}} value={filterPerson} onChange={e=>setFilterPerson(e.target.value)}>
              <option value="All">All people</option>{TEAM_MEMBERS.map(m=><option key={m}>{m}</option>)}
            </select>
            <select style={{...s.select,width:"auto",fontSize:12}} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
              <option value="All">All statuses</option>{STATUSES.map(s=><option key={s}>{s}</option>)}
            </select>
            <select style={{...s.select,width:"auto",fontSize:12}} value={filterList} onChange={e=>setFilterList(e.target.value)}>
              <option value="All">All lists</option><option>500 Deep</option><option>3500 General</option>
            </select>
            <span style={{fontSize:12,color:"var(--color-text-secondary)",marginLeft:"auto"}}>{filtered.length} leads</span>
          </div>

          {filtered.length===0&&<div style={{fontSize:13,color:"var(--color-text-tertiary)",textAlign:"center",padding:"2rem"}}>No leads yet. Go to Add Lead to start.</div>}

          {filtered.map(l=>(
            <div key={l.id} style={{...s.card,padding:"12px 14px"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                    <span style={{fontSize:14,fontWeight:500}}>{l.gymName}</span>
                    <Badge status={l.status}/>
                    <span style={{fontSize:11,background:l.list==="500 Deep"?"#CECBF6":"#FAEEDA",color:l.list==="500 Deep"?"#3C3489":"#633806",padding:"2px 6px",borderRadius:4,fontWeight:500}}>{l.list}</span>
                  </div>
                  <div style={{fontSize:12,color:"var(--color-text-secondary)",display:"flex",gap:12,flexWrap:"wrap"}}>
                    <span><i className="ti ti-map-pin" aria-hidden="true"/> {l.city||"—"}</span>
                    <span><i className="ti ti-user" aria-hidden="true"/> {l.assignedTo}</span>
                    <span><i className="ti ti-tag" aria-hidden="true"/> {LEAD_TYPES[l.type]?.split("—")[0]?.trim()}</span>
                    <span><i className="ti ti-star" aria-hidden="true"/> Score: {l.score}</span>
                  </div>
                </div>
                <div style={{display:"flex",gap:6,flexShrink:0}}>
                  <button style={s.btnGhost} onClick={()=>setExpandedLead(expandedLead===l.id?null:l.id)} title="Expand"><i className="ti ti-chevron-down" aria-hidden="true"/></button>
                  <button style={s.btnDanger} onClick={()=>deleteLead(l.id)} title="Delete"><i className="ti ti-trash" aria-hidden="true"/></button>
                </div>
              </div>

              {expandedLead===l.id&&(
                <div style={{marginTop:12,paddingTop:12,borderTop:"0.5px solid var(--color-border-tertiary)"}}>
                  <div style={s.grid2}>
                    <div>
                      <div style={s.secLabel}>Contact</div>
                      <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>Channel: {l.channel}</div>
                      <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>Handle/No: {l.handle||"—"}</div>
                      <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>Owner: {l.ownerName||"Unknown"}</div>
                      <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>Reviews: {l.reviews||"—"}</div>
                      <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>Website: {l.hasWebsite}</div>
                    </div>
                    <div>
                      <div style={s.secLabel}>Research</div>
                      <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>Competitor: {l.competitorName||"Not researched"}</div>
                      <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>Comp reviews: {l.compReviews||"—"}</div>
                      <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>Members lost/mo: {l.membersLost||"—"}</div>
                      <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>Revenue lost/mo: ₹{l.revenueLost||"—"}</div>
                    </div>
                  </div>
                  {l.problems&&<div style={{marginTop:8}}><span style={{fontSize:11,color:"var(--color-text-tertiary)"}}>Problems found:</span><div style={{fontSize:12,color:"var(--color-text-primary)",marginTop:2}}>{l.problems}</div></div>}
                  {l.list==="500 Deep"&&(
                    <div style={{marginTop:8,padding:"8px 12px",background:"#EEEDFE",borderRadius:8}}>
                      <span style={{fontSize:11,fontWeight:500,color:"#3C3489"}}>Free value: </span>
                      <span style={{fontSize:12,color:"#534AB7"}}>{l.fvType} — {l.fvCreated==="Yes"?"Created ✓":"Not created yet"}</span>
                      {l.fvLink&&<div style={{fontSize:11,color:"#534AB7",marginTop:2}}>Link: {l.fvLink}</div>}
                    </div>
                  )}
                  <div style={s.secLabel}>Update status</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {STATUSES.map(st=>(
                      <button key={st} onClick={()=>updateLeadField(l.id,"status",st)} style={{padding:"4px 10px",border:`0.5px solid ${STATUS_COLORS[st]}`,borderRadius:6,fontSize:11,cursor:"pointer",background:l.status===st?STATUS_COLORS[st]:"transparent",color:l.status===st?STATUS_TEXT[st]:"var(--color-text-secondary)",fontWeight:l.status===st?500:400}}>{st}</button>
                    ))}
                  </div>
                  <div style={{marginTop:10,display:"flex",gap:8}}>
                    <button style={s.btnPrimary} onClick={()=>{setNewMsg({...newMsg,leadId:l.id});setTab("messages");}}>
                      <i className="ti ti-message-plus" aria-hidden="true"/> Log message
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* DEEP 500 */}
      {tab==="deep"&&(
        <div>
          <div style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:14}}>Only 500 Deep leads appear here. Fill research details and track free value creation for each.</div>
          {deepLeads.length===0&&<div style={{fontSize:13,color:"var(--color-text-tertiary)",textAlign:"center",padding:"2rem"}}>No deep research leads yet. Add leads with score 8+ to see them here.</div>}
          {deepLeads.map(l=>(
            <div key={l.id} style={s.card}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div>
                  <div style={{fontSize:14,fontWeight:500}}>{l.gymName} <span style={{fontSize:11,color:"var(--color-text-secondary)"}}>· {l.city} · {l.assignedTo}</span></div>
                  <div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:2}}>{LEAD_TYPES[l.type]}</div>
                </div>
                <Badge status={l.status}/>
              </div>

              <div style={s.secLabel}>Research checklist</div>
              <div style={s.grid2}>
                <div>
                  <label style={s.label}>Competitor gym name</label>
                  <input style={s.input} value={l.competitorName} onChange={e=>updateLeadField(l.id,"competitorName",e.target.value)} placeholder="PowerFit Gym"/>
                </div>
                <div>
                  <label style={s.label}>Competitor review count</label>
                  <input style={s.input} value={l.compReviews} onChange={e=>updateLeadField(l.id,"compReviews",e.target.value)} placeholder="184"/>
                </div>
              </div>
              <div style={{margin:"10px 0"}}>
                <label style={s.label}>Problems found (write 2-3 specific issues)</label>
                <input style={s.input} value={l.problems} onChange={e=>updateLeadField(l.id,"problems",e.target.value)} placeholder="No booking button, 8s load time, no phone number visible"/>
              </div>
              <div style={s.grid2}>
                <div>
                  <label style={s.label}>Members lost per month</label>
                  <input style={s.input} value={l.membersLost} onChange={e=>updateLeadField(l.id,"membersLost",e.target.value)} placeholder="6"/>
                </div>
                <div>
                  <label style={s.label}>Revenue lost per month ₹</label>
                  <input style={s.input} value={l.revenueLost} onChange={e=>updateLeadField(l.id,"revenueLost",e.target.value)} placeholder="54,000"/>
                </div>
              </div>

              <div style={s.secLabel}>Free value</div>
              <div style={{padding:"10px 12px",background:"#EEEDFE",borderRadius:8,marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:13,color:"#3C3489",fontWeight:500}}>Offer: {FREE_VALUE[l.type]}</span>
                <select style={{...s.select,width:"auto",fontSize:12,background:"transparent",border:"0.5px solid #AFA9EC",color:"#3C3489"}} value={l.fvCreated} onChange={e=>updateLeadField(l.id,"fvCreated",e.target.value)}>
                  <option>No</option><option>In progress</option><option>Yes</option>
                </select>
              </div>
              <div>
                <label style={s.label}>Canva / Drive link to free value file</label>
                <input style={s.input} value={l.fvLink} onChange={e=>updateLeadField(l.id,"fvLink",e.target.value)} placeholder="https://drive.google.com/..."/>
              </div>

              <div style={s.secLabel}>Research done by</div>
              <div style={s.grid2}>
                <select style={s.select} value={l.researchBy} onChange={e=>updateLeadField(l.id,"researchBy",e.target.value)}>
                  <option value="">Select person</option>{TEAM_MEMBERS.map(m=><option key={m}>{m}</option>)}
                </select>
                <input style={s.input} type="date" value={l.researchDate} onChange={e=>updateLeadField(l.id,"researchDate",e.target.value)}/>
              </div>

              {l.fvCreated==="Yes"&&<div style={{marginTop:10}}>
                <button style={s.btnPrimary} onClick={()=>{setNewMsg({...newMsg,leadId:l.id,msgType:"First message"});setTab("messages");}}>
                  <i className="ti ti-message-plus" aria-hidden="true"/> Log first message
                </button>
              </div>}
            </div>
          ))}
        </div>
      )}

      {/* MESSAGES */}
      {tab==="messages"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontSize:13,color:"var(--color-text-secondary)"}}>All sent messages — {messages.length} total</div>
            <button style={s.btnPrimary} onClick={()=>setShowAddMsg(!showAddMsg)}>
              <i className="ti ti-plus" aria-hidden="true"/> Log message
            </button>
          </div>

          {showAddMsg&&(
            <div style={{...s.card,background:"#E6F1FB",borderColor:"#B5D4F4",marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:500,marginBottom:10,color:"#0C447C"}}>Log a message sent</div>
              <div style={s.grid2}>
                <div>
                  <label style={s.label}>Lead</label>
                  <select style={s.select} value={newMsg.leadId} onChange={e=>setNewMsg({...newMsg,leadId:e.target.value})}>
                    <option value="">Select lead</option>
                    {leads.map(l=><option key={l.id} value={l.id}>{l.gymName} — {l.city}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Channel used</label>
                  <select style={s.select} value={newMsg.channel} onChange={e=>setNewMsg({...newMsg,channel:e.target.value})}>
                    {CHANNELS.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{...s.grid2,marginTop:10}}>
                <div>
                  <label style={s.label}>Message type</label>
                  <select style={s.select} value={newMsg.msgType} onChange={e=>setNewMsg({...newMsg,msgType:e.target.value})}>
                    <option>First message</option><option>Follow-up 1</option><option>Follow-up 2</option><option>Follow-up 3</option>
                  </select>
                </div>
                <div>
                  <label style={s.label}>Response received</label>
                  <select style={s.select} value={newMsg.response} onChange={e=>setNewMsg({...newMsg,response:e.target.value})}>
                    <option>No reply</option><option>Positive</option><option>Not interested</option><option>Call booked</option>
                  </select>
                </div>
              </div>
              <div style={{...s.grid2,marginTop:10}}>
                <div>
                  <label style={s.label}>Sent by</label>
                  <select style={s.select} value={newMsg.sentBy} onChange={e=>setNewMsg({...newMsg,sentBy:e.target.value})}>
                    {TEAM_MEMBERS.map(m=><option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Date sent</label>
                  <input style={s.input} type="date" value={newMsg.date} onChange={e=>setNewMsg({...newMsg,date:e.target.value})}/>
                </div>
              </div>
              <div style={{marginTop:10}}>
                <label style={s.label}>Notes</label>
                <input style={s.input} value={newMsg.notes} onChange={e=>setNewMsg({...newMsg,notes:e.target.value})} placeholder="Any context about the message or response"/>
              </div>
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <button style={s.btnPrimary} onClick={addMessage}><i className="ti ti-check" aria-hidden="true"/> Save</button>
                <button style={s.btnGhost} onClick={()=>setShowAddMsg(false)}>Cancel</button>
              </div>
            </div>
          )}

          {messages.length===0&&<div style={{fontSize:13,color:"var(--color-text-tertiary)",textAlign:"center",padding:"2rem"}}>No messages logged yet.</div>}

          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:500}}>
              <thead>
                <tr>
                  {["Gym","Channel","Type","Sent by","Date","Response"].map(h=>(
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {messages.map(m=>{
                  const lead = leads.find(l=>l.id===m.leadId);
                  const respColor = m.response==="Positive"||m.response==="Call booked"?"#EAF3DE":m.response==="Not interested"?"#FCEBEB":"var(--color-background-secondary)";
                  const respText = m.response==="Positive"||m.response==="Call booked"?"#27500A":m.response==="Not interested"?"#791F1F":"var(--color-text-secondary)";
                  return (
                    <tr key={m.id}>
                      <td style={s.td}><div style={{fontWeight:500}}>{lead?.gymName||"—"}</div><div style={{color:"var(--color-text-tertiary)",fontSize:11}}>{lead?.city}</div></td>
                      <td style={s.td}>{m.channel}</td>
                      <td style={s.td}>{m.msgType}</td>
                      <td style={s.td}>{m.sentBy}</td>
                      <td style={s.td}>{m.date}</td>
                      <td style={s.td}><span style={{background:respColor,color:respText,padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:500}}>{m.response}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FOLLOW-UPS */}
      {tab==="followups"&&(
        <div>
          <div style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:14}}>Leads where follow-up is due based on first message date. Day 3, Day 7, Day 12.</div>

          {followupsDue.length===0&&(
            <div style={{textAlign:"center",padding:"2rem",fontSize:13,color:"var(--color-text-tertiary)"}}>
              <i className="ti ti-circle-check" style={{fontSize:32,display:"block",marginBottom:8,color:"#639922"}} aria-hidden="true"/>
              No follow-ups due right now. Great work!
            </div>
          )}

          {followupsDue.map(l=>{
            const msgs = messages.filter(m=>m.leadId===l.id);
            const first = msgs.length?msgs.reduce((a,b)=>a.date<b.date?a:b):null;
            const daysSince = first?Math.floor((Date.now()-new Date(first.date).getTime())/(1000*60*60*24)):0;
            const sentTypes = msgs.map(m=>m.msgType);
            const dueFU = [
              {label:"Follow-up 1",day:3,done:sentTypes.includes("Follow-up 1")},
              {label:"Follow-up 2",day:7,done:sentTypes.includes("Follow-up 2")},
              {label:"Follow-up 3",day:12,done:sentTypes.includes("Follow-up 3")},
            ].filter(f=>daysSince>=f.day&&!f.done);

            return (
              <div key={l.id} style={s.card}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:500}}>{l.gymName}</div>
                    <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{l.assignedTo} · {l.city} · {l.channel}</div>
                  </div>
                  <Badge status={l.status}/>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                  {dueFU.map(f=>(
                    <span key={f.label} style={{background:"#FCEBEB",color:"#791F1F",padding:"3px 10px",borderRadius:6,fontSize:12,fontWeight:500}}>
                      <i className="ti ti-bell" style={{fontSize:11,marginRight:4}} aria-hidden="true"/>
                      {f.label} due (day {f.day})
                    </span>
                  ))}
                </div>
                <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginBottom:8}}>First message: {first?.date||"—"} · {daysSince} days ago</div>
                <div style={{display:"flex",gap:6}}>
                  <button style={s.btnPrimary} onClick={()=>{setNewMsg({...newMsg,leadId:l.id,msgType:dueFU[0]?.label||"Follow-up 1"});setShowAddMsg(true);setTab("messages");}}>
                    <i className="ti ti-message-plus" aria-hidden="true"/> Log follow-up
                  </button>
                  <button style={{...s.btnGhost,fontSize:12}} onClick={()=>updateLeadField(l.id,"status","Dead")}>
                    Mark dead
                  </button>
                </div>
              </div>
            );
          })}

          <div style={{...s.card,marginTop:16,background:"var(--color-background-secondary)",border:"none"}}>
            <div style={{fontSize:13,fontWeight:500,marginBottom:8}}>Follow-up rules</div>
            {[["Day 3","Short check-in — did they see the message?"],["Day 7","Send the free value asset if not sent yet"],["Day 12","Final message — soft close, no pressure"]].map(([d,t])=>(
              <div key={d} style={{display:"flex",gap:10,padding:"6px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                <span style={{fontWeight:500,fontSize:12,minWidth:40,color:"#185FA5"}}>{d}</span>
                <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
