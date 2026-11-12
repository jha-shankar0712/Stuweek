import React,{useEffect,useState,useRef} from 'react';
import {Routes,Route,Navigate,useNavigate} from 'react-router-dom';
import {LayoutDashboard,CalendarDays,Timer,BookOpen,Brain,Layers,UserRound,LogOut,Flame,Plus,Check,Trash2,Play,Pause,RotateCcw,ChevronRight,Eye,EyeOff,Menu,X,Clock3,Target,Sparkles,ArrowRight,Filter,CalendarCheck2,BookOpenCheck,Zap,CheckCircle2,Circle,CalendarClock} from 'lucide-react';
import api from './api';

const initials = n => (n||'Student').split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase();
function Auth({onLogin}) {
 const [mode,setMode]=useState('login'),[name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false),[show,setShow]=useState(false);
 async function submit(e){e.preventDefault();setBusy(true);setError('');try{const {data}=await api.post(`/auth/${mode}`,mode==='register'?{name,email,password}:{email,password});localStorage.setItem('stuweek_token',data.token);onLogin(data.user);}catch(err){setError(err.response?.data?.error||'Could not connect. Is the API server running?');}finally{setBusy(false);}}
 return <div className="auth-page"><div className="auth-art"><div className="orb orb-one"/><div className="orb orb-two"/><div className="brand-mark">S<span>.</span></div><p className="eyebrow">YOUR STUDY SPACE, REIMAGINED</p><h1>Make every<br/><em>week count.</em></h1><p className="muted">Plan smarter. Focus deeper. Make progress you can see.</p><div className="auth-foot">STUWEEK <span>•</span> STUDENT WEEK</div></div><form className="auth-form" onSubmit={submit}><div className="mobile-brand">STU<span>WEEK</span></div><p className="eyebrow">{mode==='login'?'WELCOME BACK':'GET STARTED'}</p><h2>{mode==='login'?'Sign in to your space':'Create your account'}</h2><p className="muted">A calmer, clearer way to stay on top of study.</p>{mode==='register'&&<label>Full name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" required/></label>}<label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/></label><label>Password<div className="password-wrap"><input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" minLength="6" required/><button type="button" className="eye" onClick={()=>setShow(!show)}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>{error&&<div className="error">{error}</div>}<button className="btn-primary full" disabled={busy}>{busy?'Please wait…':mode==='login'?'Sign in':'Create account'} <ChevronRight size={18}/></button><p className="switch-auth">{mode==='login'?"New to Stuweek?":"Already have an account?"} <button type="button" onClick={()=>{setMode(mode==='login'?'register':'login');setError('')}}>{mode==='login'?'Create account':'Sign in'}</button></p></form></div>
}
function App(){
 const [user,setUser]=useState(null),[loading,setLoading]=useState(true),[page,setPage]=useState('Dashboard'),[mobile,setMobile]=useState(false);
 useEffect(()=>{if(localStorage.getItem('stuweek_token'))api.get('/auth/me').then(r=>setUser(r.data.user)).catch(()=>localStorage.removeItem('stuweek_token')).finally(()=>setLoading(false));else setLoading(false);},[]);
 function logout(){localStorage.removeItem('stuweek_token');setUser(null);}
 if(loading)return <div className="loading">STU<span>WEEK</span></div>;
 if(!user)return <Auth onLogin={setUser}/>;
 const nav=[['Dashboard',LayoutDashboard],['Study Planner',CalendarDays],['Focus Timer',Timer],['Notes Library',BookOpen],['Quiz Practice',Brain],['Flashcards',Layers],['My Profile',UserRound]];
 return <div className="app-shell"><aside className={`sidebar ${mobile?'open':''}`}><div className="logo">STU<span>WEEK</span><small>STUDENT WEEK</small></div><div className="side-label">WORKSPACE</div>{nav.map(([n,I])=><button key={n} className={`nav-item ${page===n?'active':''}`} onClick={()=>{setPage(n);setMobile(false)}}><I size={18}/>{n}{page===n&&<i/>}</button>)}<div className="side-bottom"><div className="mini-user"><div className="avatar">{initials(user.name)}</div><div><b>{user.name}</b><small>Student account</small></div></div><button className="logout" onClick={logout}><LogOut size={17}/> Sign out</button></div></aside><main className="main-area"><header className="topbar"><button className="mobile-menu" onClick={()=>setMobile(!mobile)}>{mobile?<X/>:<Menu/>}</button><div><span className="crumb">WORKSPACE</span><b>{page}</b></div><div className="top-right"><span className="today">{new Date().toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}</span><div className="avatar">{initials(user.name)}</div></div></header><div className="content"><Routes><Route path="*" element={<PageRouter page={page} user={user} setPage={setPage}/>}/></Routes></div></main></div>
}
function PageRouter({page,user,setPage}){switch(page){case 'Study Planner':return <Planner setPage={setPage}/>;case 'Focus Timer':return <Focus/>;case 'Notes Library':return <Notes/>;case 'Quiz Practice':return <Quiz/>;case 'Flashcards':return <Flashcards/>;case 'My Profile':return <Profile user={user}/>;default:return <Dashboard user={user} setPage={setPage}/>;}}
function Heading({tag,title,desc,action}){return <div className="page-heading"><div><p className="eyebrow">{tag}</p><h1>{title}</h1><p className="muted">{desc}</p></div>{action}</div>}

function Dashboard({ user, setPage }) {
  const [stats, setStats] = useState({
    tasks: 0,
    completed: 0,
    notes: 0,
    sessions: 0,
    minutes: 0
  });

  const [tasks, setTasks] = useState([]);
  const [weekly, setWeekly] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/planner'),
      api.get('/notes'),
      api.get('/focus/stats'),
      api.get('/focus/weekly')
    ])
      .then(([a, b, c, d]) => {
        const list = a.data.tasks || [];

        setTasks(list.filter(t => !t.done).slice(0, 4));

        setStats({
          tasks: list.filter(t => !t.done).length,
          completed: list.filter(t => t.done).length,
          notes: (b.data.notes || []).length,
          sessions: c.data.sessions || 0,
          minutes: c.data.minutes || 0
        });

        setWeekly(d.data.days || []);
      })
      .catch(error => {
        console.error('Dashboard loading error:', error);
      });
  }, []);

  const total = stats.tasks + stats.completed;
  const progress = total
    ? Math.round((stats.completed / total) * 100)
    : 0;

  const maxMinutes = Math.max(
    30,
    ...weekly.map(day => day.minutes || 0)
  );

  const totalWeeklyMinutes = weekly.reduce(
    (sum, day) => sum + (day.minutes || 0),
    0
  );

  const firstName = (user?.name || 'Student').split(' ')[0];

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 17
      ? 'Good afternoon'
      : 'Good evening';

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="sw-dashboard">

      {/* WELCOME SECTION */}
      <div className="sw-welcome">
        <div>
          <span className="sw-overline">YOUR LEARNING SPACE</span>

          <h1>
            {greeting}, <span>{firstName}.</span>
          </h1>

          <p>
            A little progress every day adds up to something great.
          </p>
        </div>

        <div className="sw-date">
          <span>TODAY</span>
          <strong>{today}</strong>
        </div>
      </div>

      {/* MAIN HERO */}
      <section className="sw-hero">

        <div className="sw-hero-content">
          <div className="sw-brand-line">
            <div className="sw-logo-mark">S</div>
            <span>STUWEEK</span>
          </div>

          <span className="sw-hero-label">
            A BETTER WAY TO STUDY
          </span>

          <h2>
            Plan less,
            <br />
            <em>learn better.</em>
          </h2>

          <p>
            Stay consistent. Build your own learning rhythm,
            one focused session at a time.
          </p>

          <button
            className="sw-hero-button"
            onClick={() => setPage('Study Planner')}
          >
            Open my planner
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="sw-hero-side">
          <div className="sw-hero-decoration">S.</div>

          <div className="sw-hero-quote">
            <span>YOUR DAILY REMINDER</span>
            <h3>
              Consistency
              <br />
              beats intensity.
            </h3>
            <div className="sw-quote-line"></div>
            <small>SHOW UP. KEEP LEARNING.</small>
          </div>
        </div>

      </section>

      {/* QUICK OVERVIEW */}
      <section className="sw-overview">

        <div className="sw-section-title">
          <span className="sw-overline">YOUR ACTIVITY</span>
          <h2>A quick overview</h2>
        </div>

        <div className="sw-stats-grid">

          <div className="sw-stat-card">
            <div className="sw-stat-icon">
              <CalendarDays size={19} />
            </div>
            <span>Pending tasks</span>
            <strong>{stats.tasks}</strong>
            <small>Waiting to be completed</small>
          </div>

          <div className="sw-stat-card">
            <div className="sw-stat-icon">
              <Timer size={19} />
            </div>
            <span>Focus minutes</span>
            <strong>{stats.minutes}</strong>
            <small>Time spent learning</small>
          </div>

          <div className="sw-stat-card">
            <div className="sw-stat-icon">
              <BookOpen size={19} />
            </div>
            <span>Saved notes</span>
            <strong>{stats.notes}</strong>
            <small>Your personal knowledge</small>
          </div>

          <div className="sw-stat-card">
            <div className="sw-stat-icon">
              <Flame size={19} />
            </div>
            <span>Focus sessions</span>
            <strong>{stats.sessions}</strong>
            <small>Sessions completed</small>
          </div>

        </div>
      </section>

      {/* PROGRESS AND WEEKLY ACTIVITY */}
      <div className="sw-activity-grid">

        <section className="sw-panel sw-progress-panel">

          <div className="sw-panel-heading">
            <div>
              <span className="sw-overline">KEEP GOING</span>
              <h2>Your progress</h2>
            </div>

            <div className="sw-progress-percent">
              {progress}%
            </div>
          </div>

          <div className="sw-progress-track">
            <div
              className="sw-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="sw-progress-details">
            <span>{stats.completed} completed</span>
            <span>{stats.tasks} remaining</span>
          </div>

          <div className="sw-progress-message">
            {total
              ? `You've completed ${stats.completed} out of ${total} tasks. Keep moving forward.`
              : 'Your learning journey starts with one small task. Add your first task in the planner.'}
          </div>

          <button
            className="sw-simple-link"
            onClick={() => setPage('Study Planner')}
          >
            View study plan <ChevronRight size={16} />
          </button>

        </section>

        <section className="sw-panel sw-week-panel">

          <div className="sw-panel-heading">
            <div>
              <span className="sw-overline">YOUR LAST 7 DAYS</span>
              <h2>Focus activity</h2>
            </div>

            <span className="sw-chart-unit">MINUTES</span>
          </div>

          <div className="sw-chart">

            {weekly.map((day, index) => (
              <div className="sw-chart-day" key={day.day || index}>

                <div className="sw-chart-track">
                  <div
                    className="sw-chart-bar"
                    style={{
                      height: `${day.minutes
                        ? Math.max(8, (day.minutes / maxMinutes) * 100)
                        : 4}%`
                    }}
                    title={`${day.minutes} minutes`}
                  />
                </div>

                <span>{day.day}</span>
              </div>
            ))}

            {!weekly.length && (
              <div className="sw-chart-empty">
                Your focus activity will appear here.
              </div>
            )}

          </div>

          <div className="sw-week-summary">
            <strong>{totalWeeklyMinutes} min</strong>
            <span>focused this week</span>
          </div>

        </section>

      </div>

      {/* UPCOMING TASKS */}
      <section className="sw-tasks-section">

        <div className="sw-tasks-heading">
          <div>
            <span className="sw-overline">ONE STEP AT A TIME</span>
            <h2>Upcoming tasks</h2>
          </div>

          <button
            className="sw-simple-link"
            onClick={() => setPage('Study Planner')}
          >
            View all <ChevronRight size={16} />
          </button>
        </div>

        <div className="sw-task-list">

          {tasks.length ? (
            tasks.map(task => (
              <div className="sw-task-row" key={task.id}>

                <div className="sw-task-indicator"></div>

                <div className="sw-task-info">
                  <strong>{task.title}</strong>
                  <span>
                    {task.subject || 'General'}
                  </span>
                </div>

                <div className="sw-task-date">
                  {task.due_date
                    ? `Due ${task.due_date}`
                    : 'No due date'}
                </div>

              </div>
            ))
          ) : (
            <div className="sw-task-empty">
              <strong>Nothing pending right now.</strong>
              <span>Enjoy the free time or plan your next learning session.</span>
              <button
                className="sw-simple-link"
                onClick={() => setPage('Study Planner')}
              >
                Add a task <ChevronRight size={16} />
              </button>
            </div>
          )}

        </div>

      </section>

      {/* BRAND FOOTER */}
      <div className="sw-dashboard-footer">
        <div className="sw-footer-brand">
          <span className="sw-footer-logo">S</span>
          <strong>STUWEEK</strong>
        </div>

        <p>Plan less, learn better, stay consistent.</p>
      </div>

    </div>
  );
}

function Stat({label,value,icon:Icon}){return <div className="stat-card"><div className="stat-icon"><Icon size={19}/></div><span>{label}</span><b>{value}</b></div>}
function Planner({setPage}){
 const todayKey=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
 const plusDays=(base,n)=>{const d=new Date(`${base}T12:00:00`);d.setDate(d.getDate()+n);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
 const [tasks,setTasks]=useState([]),[title,setTitle]=useState(''),[subject,setSubject]=useState(''),[due,setDue]=useState(''),[planned,setPlanned]=useState(todayKey()),[priority,setPriority]=useState('Medium'),[minutes,setMinutes]=useState('45'),[kind,setKind]=useState('Concept learning'),[energy,setEnergy]=useState('Balanced'),[filter,setFilter]=useState('All'),[showForm,setShowForm]=useState(false),[busy,setBusy]=useState(false),[notice,setNotice]=useState('');
 const load=()=>api.get('/planner').then(r=>setTasks(r.data.tasks||[])).catch(()=>setNotice('Could not load your planner. Check that the API server is running.'));
 useEffect(()=>{load()},[]);
 const today=todayKey(),week=Array.from({length:7},(_,i)=>plusDays(today,i));
 const pending=tasks.filter(t=>!t.done),completed=tasks.filter(t=>t.done);
 const todayTasks=pending.filter(t=>(t.planned_date||t.due_date)===today);
 const overdue=pending.filter(t=>t.due_date&&t.due_date<today);
 const plannedMinutes=todayTasks.reduce((n,t)=>n+(Number(t.estimated_minutes)||45),0);
 const totalMinutes=pending.reduce((n,t)=>n+(Number(t.estimated_minutes)||45),0);
 const pct=tasks.length?Math.round(completed.length/tasks.length*100):0;
 const subjectCounts=[...new Set(pending.map(t=>t.subject).filter(Boolean))].map(name=>({name,count:pending.filter(t=>t.subject===name).length})).sort((a,b)=>b.count-a.count).slice(0,4);
 const visible=tasks.filter(t=>filter==='All'?( !t.done ):filter==='Completed'?t.done:filter==='Overdue'?( !t.done&&t.due_date&&t.due_date<today ):filter==='Today'?(!t.done&&(t.planned_date||t.due_date)===today):(!t.done&&t.priority===filter));
 async function add(e){e.preventDefault();if(!title.trim())return;setBusy(true);setNotice('');try{await api.post('/planner',{title,subject,due_date:due,planned_date:planned,priority,estimated_minutes:Number(minutes),task_type:kind});setTitle('');setSubject('');setDue('');setPlanned(today);setPriority('Medium');setMinutes('45');setKind('Concept learning');setShowForm(false);await load();setNotice('Your study mission is on the board.');}catch{setNotice('Could not save this task. Please try again.');}finally{setBusy(false)}}
 async function toggle(t){try{await api.patch(`/planner/${t.id}`,{done:!t.done});await load()}catch{setNotice('Could not update this task.')}}
 async function del(id){try{await api.delete(`/planner/${id}`);await load()}catch{setNotice('Could not delete this task.')}}
 const fmt=d=>d?new Date(`${d}T12:00:00`).toLocaleDateString(undefined,{day:'numeric',month:'short'}):'No date';
 const dayName=d=>new Date(`${d}T12:00:00`).toLocaleDateString(undefined,{weekday:'short'});
 const queue=[...pending].sort((a,b)=>{const rank={High:0,Medium:1,Low:2};return (rank[a.priority]??1)-(rank[b.priority]??1)||(a.due_date||'9999').localeCompare(b.due_date||'9999')}).slice(0,3);
 return <div className="planner-page">
  <Heading tag="YOUR PERSONAL STUDY SYSTEM" title="Study planner" desc="Turn scattered study intentions into a realistic weekly rhythm." action={<button className="btn-primary" onClick={()=>setShowForm(v=>!v)}><Plus size={17}/>{showForm?'Close form':'Create a mission'}</button>}/>
  <section className="planner-welcome"><div className="planner-welcome-copy"><span className="planner-kicker"><Sparkles size={14}/> THE STUWEEK STUDY FLOW</span><h2>Make progress,<br/><em>not just plans.</em></h2><p>Your next best step is more useful than a perfect timetable. Pick a mission, give it a time, and build momentum.</p><div className="planner-welcome-actions"><button className="planner-cta" onClick={()=>setShowForm(true)}>Add a study mission <ArrowRight size={16}/></button><button className="planner-quiet" onClick={()=>setPage('Focus Timer')}>Open focus room <Clock3 size={15}/></button></div></div><div className="planner-orbit"><div className="orbit-ring orbit-ring-a"/><div className="orbit-ring orbit-ring-b"/><div className="orbit-core"><Target size={27}/><b>{pct}%</b><small>COMPLETE</small></div><span className="orbit-dot orbit-dot-one"/><span className="orbit-dot orbit-dot-two"/></div></section>
  <div className="planner-metrics"><div className="planner-metric"><span><CalendarCheck2 size={16}/> TODAY'S MISSIONS</span><b>{todayTasks.length}</b><small>{todayTasks.length?'Ready when you are':'A clean slate'}</small></div><div className="planner-metric"><span><Clock3 size={16}/> ESTIMATED STUDY</span><b>{plannedMinutes>=60?`${Math.floor(plannedMinutes/60)}h ${plannedMinutes%60}m`:`${plannedMinutes}m`}</b><small>Across today's plan</small></div><div className="planner-metric"><span><Flame size={16}/> OPEN MISSIONS</span><b>{pending.length}</b><small>{overdue.length?`${overdue.length} need attention`:'You are in control'}</small></div><div className="planner-metric"><span><CheckCircle2 size={16}/> COMPLETION</span><b>{pct}%</b><small>{completed.length} missions completed</small></div></div>
  {showForm&&<section className="planner-create"><div className="planner-section-title"><div><span className="planner-kicker">BUILD YOUR NEXT WIN</span><h3>Create a study mission</h3></div><button className="planner-close" onClick={()=>setShowForm(false)}><X size={18}/></button></div><form className="mission-form" onSubmit={add}><label className="mission-wide">What do you want to get done?<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Understand Java inheritance with 3 examples" required maxLength={120}/></label><label>Subject<input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Java / DBMS / Maths"/></label><label>Mission type<select value={kind} onChange={e=>setKind(e.target.value)}><option>Concept learning</option><option>Problem solving</option><option>Revision</option><option>Assignment</option><option>Mock test</option><option>Project work</option></select></label><label>Plan for<input type="date" value={planned} min={today} onChange={e=>setPlanned(e.target.value)}/></label><label>Deadline (optional)<input type="date" value={due} min={today} onChange={e=>setDue(e.target.value)}/></label><label>Time needed<select value={minutes} onChange={e=>setMinutes(e.target.value)}><option value="15">15 minutes</option><option value="25">25 minutes</option><option value="45">45 minutes</option><option value="60">1 hour</option><option value="90">1.5 hours</option><option value="120">2 hours</option></select></label><label>Priority<select value={priority} onChange={e=>setPriority(e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label><div className="mission-submit"><button className="btn-primary" disabled={busy}><Plus size={16}/>{busy?'Saving…':'Add to my week'}</button><span>Keep each mission small enough to finish.</span></div></form></section>}
  <div className="planner-columns"><section className="planner-week"><div className="planner-section-title"><div><span className="planner-kicker">THE NEXT 7 DAYS</span><h3>Your study runway</h3></div><span className="planner-section-note">Plan ahead, stay flexible</span></div><div className="week-strip">{week.map(d=>{const count=pending.filter(t=>(t.planned_date||t.due_date)===d).length;const isToday=d===today;return <button key={d} className={`week-cell ${isToday?'is-today':''} ${count?'has-work':''}`} onClick={()=>{setPlanned(d);setShowForm(true)}}><small>{dayName(d)}</small><b>{new Date(`${d}T12:00:00`).getDate()}</b><i>{count?`${count} ${count===1?'mission':'missions'}`:'+'}</i></button>})}</div><div className="planner-section-title queue-heading"><div><span className="planner-kicker">YOUR NEXT BEST MOVES</span><h3>Smart study queue</h3></div><span className="queue-chip"><Zap size={13}/> Priority first</span></div><div className="smart-queue">{queue.length?queue.map((t,i)=><div className="queue-item" key={t.id}><span className="queue-number">0{i+1}</span><div className="queue-main"><b>{t.title}</b><small>{t.subject||'General'} · {t.task_type||'Study'} · {t.estimated_minutes||45} min</small></div><span className={`priority-pill ${(t.priority||'Medium').toLowerCase()}`}>{t.priority||'Medium'}</span></div>):<div className="planner-empty"><BookOpenCheck size={22}/><b>Your queue is clear</b><span>Add a mission and Stuweek will line it up here.</span></div>}</div></section>
  <aside className="planner-insights"><div className="insight-card energy-card"><span className="planner-kicker">MATCH YOUR ENERGY</span><h3>How are you feeling today?</h3><p>Choose a pace. Use it as a guide, not a rule.</p><div className="energy-options">{['Low','Balanced','High'].map(x=><button key={x} className={energy===x?'selected':''} onClick={()=>setEnergy(x)}><span>{x==='Low'?'◒':x==='Balanced'?'◐':'◕'}</span>{x}</button>)}</div><div className="energy-tip"><Sparkles size={15}/>{energy==='Low'?'Low-energy mode: start with a 15-minute revision or one easy concept.':energy==='High'?'High-energy mode: tackle a difficult topic or a problem-solving mission first.':'Balanced mode: alternate one learning mission with one practice mission.'}</div></div><div className="insight-card subject-card"><span className="planner-kicker">SUBJECT BALANCE</span><h3>Where your effort goes</h3>{subjectCounts.length?subjectCounts.map(x=><div className="subject-meter" key={x.name}><div><span>{x.name}</span><b>{x.count}</b></div><i><em style={{width:`${Math.max(8,x.count/Math.max(1,subjectCounts[0].count)*100)}%`}}/></i></div>):<div className="subject-empty">Add subjects to see your study balance.</div>}</div><div className="planner-tip"><div className="tip-icon"><Target size={18}/></div><div><b>Stuweek rule #01</b><p>Don't schedule every minute. Leave breathing room so one delay doesn't break your whole week.</p></div></div></aside></div>
  <section className="planner-task-section"><div className="planner-section-title"><div><span className="planner-kicker">YOUR PERSONAL WORKLOAD</span><h3>All missions</h3></div><div className="planner-filter"><Filter size={14}/><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Today</option><option>High</option><option>Medium</option><option>Low</option><option>Overdue</option><option>Completed</option></select></div></div><div className="mission-list">{visible.length?visible.map(t=><article className={`mission-row ${t.done?'is-done':''}`} key={t.id}><button className={`mission-check ${t.done?'checked':''}`} onClick={()=>toggle(t)} aria-label={t.done?'Mark incomplete':'Mark complete'}>{t.done?<Check size={15}/>:<Circle size={17}/>}</button><div className="mission-info"><b>{t.title}</b><span>{t.subject||'General'} <i>·</i> {t.task_type||'Study'} <i>·</i> {t.estimated_minutes||45} min</span></div><div className="mission-dates"><small>Planned {fmt(t.planned_date||t.due_date)}</small>{t.due_date&&<small>Due {fmt(t.due_date)}</small>}</div><span className={`priority-pill ${(t.priority||'Medium').toLowerCase()}`}>{t.priority||'Medium'}</span><button className="mission-delete" onClick={()=>del(t.id)} aria-label="Delete mission"><Trash2 size={16}/></button></article>):<div className="planner-empty"><CalendarClock size={24}/><b>Nothing in this view</b><span>Try another filter or create a new study mission.</span></div>}</div></section>
  {notice&&<div className="planner-notice" role="status">{notice}<button onClick={()=>setNotice('')}><X size={14}/></button></div>}
 </div>
}


function Focus(){
 const modes = {
  focus:{label:'Focus session',minutes:25,description:'One task. Give it your full attention.',color:'#79876E'},
  short:{label:'Short break',minutes:5,description:'Take a breath. You are doing great.',color:'#79909C'},
  long:{label:'Long break',minutes:15,description:'Relax, recharge and come back stronger.',color:'#B28B62'}
 };

 const [mode,setMode]=useState('focus');
 const [duration,setDuration]=useState(25);
 const [remaining,setRemaining]=useState(25*60);
 const [running,setRunning]=useState(false);
 const [custom,setCustom]=useState('25');
 const [sessions,setSessions]=useState(0);
 const [totalMinutes,setTotalMinutes]=useState(0);
 const [notice,setNotice]=useState('');
 const [sound,setSound]=useState(true);
 const completedRef=useRef(false);

 useEffect(()=>{
  if(!running)return;
  const id=setInterval(()=>{
   setRemaining(prev=>{
    if(prev<=1){
     setRunning(false);
     return 0;
    }
    return prev-1;
   });
  },1000);
  return ()=>clearInterval(id);
 },[running]);

 useEffect(()=>{
  if(running||remaining!==0||completedRef.current)return;

  completedRef.current=true;

  if(mode==='focus'){
   setSessions(s=>s+1);
   setTotalMinutes(m=>m+duration);
   setNotice('Focus session completed! Amazing work.');
   api.post('/focus',{duration}).catch(()=>{});
  }else{
   setNotice(mode==='short'?'Short break completed. Ready to focus?':'Long break completed. Welcome back!');
  }

  if(sound){
   try{
    const AudioContextClass=window.AudioContext||window.webkitAudioContext;
    if(AudioContextClass){
     const ctx=new AudioContextClass();
     [523.25,659.25,783.99].forEach((frequency,i)=>{
      const oscillator=ctx.createOscillator();
      const gain=ctx.createGain();
      oscillator.frequency.value=frequency;
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.12,ctx.currentTime+i*0.18);
      gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.18+0.35);
      oscillator.start(ctx.currentTime+i*0.18);
      oscillator.stop(ctx.currentTime+i*0.18+0.35);
     });
     setTimeout(()=>ctx.close(),1300);
    }
   }catch{}
  }

  if('Notification' in window&&Notification.permission==='granted'){
   new Notification('Stuweek Focus Studio',{
    body:mode==='focus'?'Focus session complete. Take a well-deserved break!':'Your break is over. Ready for the next session?'
   });
  }
 },[running,remaining,mode,duration,sound]);

 function selectMode(next){
  setRunning(false);
  setMode(next);
  setDuration(modes[next].minutes);
  setRemaining(modes[next].minutes*60);
  completedRef.current=false;
  setNotice('');
 }

 function startTimer(){
  if(remaining===0){
   setRemaining(duration*60);
   completedRef.current=false;
  }
  setNotice('');
  setRunning(true);

  if('Notification' in window&&Notification.permission==='default'){
   Notification.requestPermission().catch(()=>{});
  }
 }

 function resetTimer(){
  setRunning(false);
  setRemaining(duration*60);
  completedRef.current=false;
  setNotice('');
 }

 function applyCustom(e){
  e.preventDefault();
  const value=Number(custom);
  if(!Number.isInteger(value)||value<1||value>120){
   setNotice('Please enter a time between 1 and 120 minutes.');
   return;
  }
  setRunning(false);
  setMode('custom');
  setDuration(value);
  setRemaining(value*60);
  completedRef.current=false;
  setNotice('Your custom focus session is ready.');
 }

 const minutes=Math.floor(remaining/60);
 const seconds=remaining%60;
 const progress=duration>0?((duration*60-remaining)/(duration*60))*100:0;
 const circumference=2*Math.PI*105;
 const strokeOffset=circumference-(progress/100)*circumference;
 const activeColor=modes[mode]?.color||'#79876E';

 return <div className="focus-studio">
  <Heading
   tag="DEEP WORK MODE"
   title="Focus studio"
   desc="Make time for what matters. One focused session at a time."
  />

  <section className="focus-welcome">
   <div>
    <span className="focus-kicker"><Sparkles size={14}/> YOUR PERSONAL FOCUS SPACE</span>
    <h2>Less distraction.<br/><em>More progress.</em></h2>
    <p>Choose your session, settle in and let Stuweek protect your study time.</p>
   </div>
   <div className="focus-welcome-icon"><Target size={36}/><span>STAY<br/>FOCUSED</span></div>
  </section>

  <div className="focus-layout">
   <section className="focus-main-card">
    <div className="focus-mode-tabs">
     {Object.entries(modes).map(([key,item])=>(
      <button
       key={key}
       className={mode===key?'active':''}
       onClick={()=>selectMode(key)}
       disabled={running}
      >
       {key==='focus'?<Target size={15}/>:key==='short'?<CoffeeIcon/>:<Clock3 size={15}/>}
       {key==='focus'?'Focus':key==='short'?'Short break':'Long break'}
      </button>
     ))}
    </div>

    <div className="focus-timer-area">
     <div className="focus-progress-ring" style={{'--focus-color':activeColor}}>
      <svg viewBox="0 0 240 240">
       <circle className="focus-ring-bg" cx="120" cy="120" r="105"/>
       <circle
        className="focus-ring-progress"
        cx="120" cy="120" r="105"
        strokeDasharray={circumference}
        strokeDashoffset={strokeOffset}
       />
      </svg>
      <div className="focus-time-display">
       <span className="focus-live-label">{running?'SESSION IN PROGRESS':remaining===0?'SESSION COMPLETE':'READY WHEN YOU ARE'}</span>
       <strong>{String(minutes).padStart(2,'0')}:{String(seconds).padStart(2,'0')}</strong>
       <small>{mode==='focus'?'MINUTES OF FOCUS':mode==='custom'?'CUSTOM SESSION':mode==='short'?'SHORT RECOVERY':'LONG RECOVERY'}</small>
      </div>
     </div>
    </div>

    <div className="focus-mode-description">
     <span className="focus-status-dot" style={{background:activeColor}}/>
     {mode==='custom'?'Your personalised focus session':modes[mode].description}
    </div>

    <div className="focus-controls">
     <button className="btn-primary focus-start-btn" onClick={running?()=>setRunning(false):startTimer}>
      {running?<Pause size={18}/>:<Play size={18}/>}
      {running?'Pause session':remaining===0?'Start again':'Start session'}
     </button>
     <button className="btn-outline" onClick={resetTimer}>
      <RotateCcw size={16}/> Reset
     </button>
    </div>

    <div className="focus-session-footer">
     <span><CheckCircle2 size={15}/> {sessions} completed this visit</span>
     <span><Clock3 size={15}/> {totalMinutes} focus minutes</span>
    </div>

    {notice&&<div className="focus-notice" role="status">{notice}</div>}
   </section>

   <aside className="focus-sidebar">
    <div className="focus-side-card">
     <span className="focus-kicker">CUSTOM SESSION</span>
     <h3>Set your own pace</h3>
     <p>Need more or less time? Create a session that fits your task.</p>
     <form className="focus-custom-form" onSubmit={applyCustom}>
      <label htmlFor="focus-custom-minutes">Duration in minutes</label>
      <input
       id="focus-custom-minutes"
       type="number"
       min="1"
       max="120"
       value={custom}
       onChange={e=>setCustom(e.target.value)}
       disabled={running}
      />
      <button className="btn-primary" type="submit" disabled={running}>
       <Timer size={16}/> Apply custom time
      </button>
     </form>
     <small className="focus-hint">Choose between 1 and 120 minutes.</small>
    </div>

    <div className="focus-side-card focus-stats-card">
     <span className="focus-kicker">YOUR SESSION ACTIVITY</span>
     <h3>Today's momentum</h3>
     <div className="focus-mini-stat">
      <span>Sessions completed</span><b>{sessions}</b>
     </div>
     <div className="focus-mini-stat">
      <span>Total focus time</span><b>{totalMinutes} min</b>
     </div>
     <div className="focus-mini-stat">
      <span>Current session</span><b>{running?'Active':'Paused / Ready'}</b>
     </div>
    </div>

    <div className="focus-side-card focus-settings-card">
     <div>
      <span className="focus-kicker">EXPERIENCE</span>
      <h3>Timer sound</h3>
      <p>Play a gentle sound when a session ends.</p>
     </div>
     <button
      type="button"
      className={`focus-toggle ${sound?'enabled':''}`}
      onClick={()=>setSound(v=>!v)}
      aria-label="Toggle timer sound"
     ><i/></button>
    </div>
   </aside>
  </div>

  <section className="focus-bottom-tip">
   <div className="focus-tip-icon"><Flame size={20}/></div>
   <div><b>A little focus goes a long way.</b><p>Keep your phone away, close unnecessary tabs and give one task your full attention.</p></div>
   <span>STUWEEK · FOCUS BETTER</span>
  </section>
 </div>;
}

function CoffeeIcon(){
 return <span className="focus-coffee-icon">☕</span>;
}


function Notes(){
  const [notes,setNotes]=useState([]);
  const [title,setTitle]=useState('');
  const [body,setBody]=useState('');
  const [search,setSearch]=useState('');
  const [sort,setSort]=useState('newest');
  const [busy,setBusy]=useState(false);
  const [loading,setLoading]=useState(true);
  const [notice,setNotice]=useState('');
  const [expanded,setExpanded]=useState(null);

  const load=async()=>{
    try{
      const r=await api.get('/notes');
      setNotes(r.data.notes||[]);
    }catch{
      setNotice('Could not load notes. Please check your connection.');
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{load()},[]);

  async function add(e){
    e.preventDefault();
    if(!title.trim()||!body.trim())return;

    setBusy(true);
    setNotice('');

    try{
      await api.post('/notes',{
        title:title.trim(),
        body:body.trim()
      });

      setTitle('');
      setBody('');
      await load();
      setNotice('Your note has been saved successfully.');
    }catch{
      setNotice('Could not save your note. Please try again.');
    }finally{
      setBusy(false);
    }
  }

  async function del(id){
    if(!window.confirm('Are you sure you want to delete this note?'))return;

    try{
      await api.delete(`/notes/${id}`);
      setNotes(prev=>prev.filter(n=>n.id!==id));
      setNotice('Note deleted successfully.');
      if(expanded===id)setExpanded(null);
    }catch{
      setNotice('Could not delete this note.');
    }
  }

  const filtered=notes
    .filter(n=>
      `${n.title} ${n.body}`.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a,b)=>{
      const da=new Date(a.created_at||0).getTime();
      const db=new Date(b.created_at||0).getTime();
      return sort==='newest'?db-da:da-db;
    });

  const wordCount=body.trim()
    ?body.trim().split(/\s+/).length:0;

  return (
    <div className="notes-studio">
      <Heading
        tag="YOUR KNOWLEDGE SPACE"
        title="Notes library"
        desc="Capture ideas, organise your learning and revisit important concepts."
      />

      <section className="notes-welcome">
        <div>
          <span className="notes-kicker">STUWeek KNOWLEDGE HUB</span>
          <h2>Your ideas deserve<br/>
            <em>a better space.</em>
          </h2>
          <p>Save your class notes, coding concepts and important revision points in one place.</p>
        </div>
        <div className="notes-welcome-icon">✎</div>
      </section>

      <div className="notes-stats">
        <div className="notes-stat">
          <span>TOTAL NOTES</span>
          <b>{notes.length}</b>
          <small>Your saved knowledge</small>
        </div>
        <div className="notes-stat">
          <span>SEARCH RESULTS</span>
          <b>{filtered.length}</b>
          <small>Matching notes</small>
        </div>
        <div className="notes-stat">
          <span>WRITING WORDS</span>
          <b>{wordCount}</b>
          <small>In your current draft</small>
        </div>
      </div>

      <section className="notes-editor">
        <div className="notes-section-heading">
          <div>
            <span className="notes-kicker">CREATE SOMETHING USEFUL</span>
            <h3>Write a new note</h3>
          </div>
          <span className="notes-draft-label">✦ New draft</span>
        </div>

        <form onSubmit={add}>
          <input
            className="notes-title-input"
            value={title}
            onChange={e=>setTitle(e.target.value)}
            placeholder="Give your note a meaningful title..."
            maxLength={100}
            required
          />

          <textarea
            className="notes-body-input"
            value={body}
            onChange={e=>setBody(e.target.value)}
            placeholder="Start writing your ideas, definitions, code concepts or revision notes..."
            rows={6}
            required
          />

          <div className="notes-editor-footer">
            <span>{wordCount} words · {body.length} characters</span>
            <button className="btn-primary" type="submit" disabled={busy}>
              {busy?'Saving note...':'＋ Save to library'}
            </button>
          </div>
        </form>
      </section>

      <section className="notes-library-section">
        <div className="notes-section-heading">
          <div>
            <span className="notes-kicker">YOUR COLLECTION</span>
            <h3>Saved notes</h3>
          </div>
          <span className="notes-count">{notes.length} notes</span>
        </div>

        <div className="notes-toolbar">
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="⌕  Search your notes..."
            aria-label="Search notes"
          />

          <select value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        {notice&&<p className="notes-notice">{notice}</p>}

        {loading?(
          <div className="notes-empty">Loading your notes...</div>
        ):filtered.length?(
          <div className="notes-grid">
            {filtered.map(n=>(
              <article className="note-card" key={n.id}>
                <div className="note-top">
                  <span className="note-tag">PERSONAL NOTE</span>
                  <button
                    className="icon-btn danger"
                    type="button"
                    onClick={()=>del(n.id)}
                    title="Delete note"
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>

                <h3>{n.title}</h3>

                <p className={expanded===n.id?'note-expanded':'note-preview'}>
                  {n.body}
                </p>

                <div className="note-card-footer">
                  <small>
                    {n.created_at
                      ?new Date(n.created_at).toLocaleDateString()
                      :'Saved note'}
                  </small>

                  <button
                    type="button"
                    className="notes-read-btn"
                    onClick={()=>setExpanded(expanded===n.id?null:n.id)}
                  >
                    {expanded===n.id?'Show less':'Read note →'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ):(
          <div className="notes-empty">
            <span>✎</span>
            <h3>{search?'No matching notes':'Your library is waiting'}</h3>
            <p>
              {search
                ?'Try another keyword to find your notes.'
                :'Create your first note and start building your personal knowledge space.'}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}


const quizBank = {
  PHP: {
    "PHP Basics": [
      { q: "What does PHP stand for?", a: ["Personal Home Page", "PHP: Hypertext Preprocessor", "Private Home Processor", "Program Hypertext Page"], correct: 1, why: "PHP stands for PHP: Hypertext Preprocessor." },
      { q: "Which symbol is used before a PHP variable?", a: ["#", "$", "@", "&"], correct: 1, why: "PHP variables begin with the dollar ($) symbol." },
      { q: "Which tag is used to write PHP code?", a: ["<script>", "<php>", "<?php", "<code>"], correct: 2, why: "PHP code is commonly enclosed within <?php and ?> tags." }
    ],
    "Arrays": [
      { q: "Which function counts the elements in a PHP array?", a: ["count()", "length()", "size()", "total()"], correct: 0, why: "The count() function returns the number of elements in an array." },
      { q: "Which function adds an element at the end of an array?", a: ["array_pop()", "array_shift()", "array_push()", "array_merge()"], correct: 2, why: "array_push() adds one or more elements at the end of an array." },
      { q: "Which type of array uses named keys?", a: ["Indexed array", "Associative array", "Multidimensional array only", "Numeric array"], correct: 1, why: "Associative arrays store values using named keys." }
    ],
    "Functions": [
      { q: "Which keyword is used to define a function in PHP?", a: ["func", "define", "function", "method"], correct: 2, why: "The function keyword declares a user-defined function in PHP." },
      { q: "Which statement sends a value back from a function?", a: ["echo", "return", "break", "print"], correct: 1, why: "return sends a value back to the calling code." }
    ],
    "OOP": [
      { q: "Which keyword is used to create a class in PHP?", a: ["object", "struct", "class", "new"], correct: 2, why: "The class keyword defines a class in PHP." },
      { q: "Which keyword creates an object from a class?", a: ["this", "new", "create", "object"], correct: 1, why: "The new keyword creates an object instance." }
    ],
    "Forms": [
      { q: "Which superglobal collects form data sent using POST?", a: ["$_GET", "$_POST", "$_FORM", "$_REQUESTS"], correct: 1, why: "$_POST is used to access data submitted through the POST method." },
      { q: "Which HTML attribute specifies where form data is sent?", a: ["method", "action", "target", "name"], correct: 1, why: "The action attribute specifies the destination that processes form data." }
    ],
    "MySQL & SQL Joins": [
      { q: "Which SQL JOIN returns only matching rows from both tables?", a: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "CROSS JOIN"], correct: 2, why: "INNER JOIN returns rows that have matching values in both tables." },
      { q: "Which PHP extension provides a database access interface?", a: ["PDO", "HTML", "CSS", "XML"], correct: 0, why: "PDO provides a consistent interface for accessing databases in PHP." }
    ]
  },

  Java: {
    "Java Basics": [
      { q: "Which method is the entry point of a standard Java application?", a: ["start()", "run()", "main()", "execute()"], correct: 2, why: "The main() method is the standard entry point of a Java application." },
      { q: "Which keyword creates an object in Java?", a: ["class", "this", "new", "static"], correct: 2, why: "The new keyword creates an object." }
    ],
    "OOP": [
      { q: "Which OOP concept allows a class to inherit another class?", a: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"], correct: 1, why: "Inheritance allows a class to acquire properties and methods of another class." },
      { q: "Which keyword refers to the current object in Java?", a: ["super", "this", "self", "current"], correct: 1, why: "this refers to the current object." }
    ],
    "Arrays": [
      { q: "What is the index of the first element in a Java array?", a: ["1", "-1", "0", "2"], correct: 2, why: "Java arrays use zero-based indexing." },
      { q: "Which property gives the size of an array in Java?", a: ["size()", "length", "count()", "capacity"], correct: 1, why: "The length property gives the number of elements in a Java array." }
    ]
  },

  Python: {
    "Python Basics": [
      { q: "Which symbol is used for comments in Python?", a: ["//", "#", "/*", "<!--"], correct: 1, why: "The hash symbol (#) starts a single-line comment in Python." },
      { q: "Which function displays output in Python?", a: ["show()", "display()", "print()", "write()"], correct: 2, why: "print() displays output on the screen." }
    ],
    "Lists": [
      { q: "Which method adds an item at the end of a Python list?", a: ["add()", "append()", "insertEnd()", "push()"], correct: 1, why: "append() adds an item to the end of a list." },
      { q: "Which brackets are used to create a Python list?", a: ["()", "{}", "[]", "<>"], correct: 2, why: "Square brackets are used to create lists." }
    ],
    "Functions": [
      { q: "Which keyword defines a function in Python?", a: ["function", "def", "fun", "define"], correct: 1, why: "The def keyword is used to define a function." },
      { q: "Which keyword sends a value back from a function?", a: ["break", "continue", "return", "pass"], correct: 2, why: "return sends a result back to the caller." }
    ]
  },

  DBMS: {
    "SQL Joins": [
      { q: "Which JOIN returns only matching records from two tables?", a: ["LEFT JOIN", "INNER JOIN", "FULL OUTER JOIN", "CROSS JOIN"], correct: 1, why: "INNER JOIN returns records with matching values in both tables." },
      { q: "Which JOIN keeps all rows from the left table?", a: ["LEFT JOIN", "INNER JOIN", "CROSS JOIN", "SELF JOIN"], correct: 0, why: "LEFT JOIN preserves all rows from the left table and matching rows from the right table." }
    ],
    "Normalization": [
      { q: "Which normal form removes repeating groups?", a: ["1NF", "2NF", "3NF", "BCNF"], correct: 0, why: "First Normal Form requires atomic values and no repeating groups." },
      { q: "Which normal form removes transitive dependencies?", a: ["1NF", "2NF", "3NF", "4NF"], correct: 2, why: "Third Normal Form addresses transitive dependencies of non-key attributes." }
    ],
    "SQL Commands": [
      { q: "Which SQL command retrieves records from a table?", a: ["INSERT", "UPDATE", "SELECT", "DELETE"], correct: 2, why: "SELECT retrieves data from database tables." },
      { q: "Which command removes a table completely?", a: ["DELETE", "DROP", "UPDATE", "SELECT"], correct: 1, why: "DROP TABLE removes the table structure and its data." }
    ]
  },

  "C Programming": {
    "C Basics": [
      { q: "Which function is the starting point of a C program?", a: ["printf()", "main()", "scanf()", "start()"], correct: 1, why: "Execution of a standard C program begins from main()." },
      { q: "Which format specifier is used for an integer in C?", a: ["%c", "%f", "%d", "%s"], correct: 2, why: "%d is commonly used for integer values." }
    ],
    "Arrays": [
      { q: "What is the index of the first element in a C array?", a: ["1", "0", "-1", "2"], correct: 1, why: "C arrays use zero-based indexing." },
      { q: "Which type of loop is commonly used to traverse an array?", a: ["for loop", "switch", "if statement", "goto only"], correct: 0, why: "A for loop is commonly used to visit array elements using an index." }
    ]
  },

  "Web Development": {
    "HTML": [
      { q: "Which tag creates a hyperlink in HTML?", a: ["<p>", "<a>", "<linker>", "<href>"], correct: 1, why: "The anchor tag <a> creates hyperlinks." },
      { q: "Which tag inserts an image in HTML?", a: ["<picture-src>", "<img>", "<image>", "<src>"], correct: 1, why: "The img tag embeds an image in HTML." }
    ],
    "CSS": [
      { q: "Which property changes text color in CSS?", a: ["font-style", "background", "color", "text-align"], correct: 2, why: "The color property changes the text color." },
      { q: "Which selector targets an element by its ID?", a: [".", "#", "*", "&"], correct: 1, why: "The # selector targets an element by its ID." }
    ],
    "JavaScript": [
      { q: "Which keyword declares a block-scoped variable that can be reassigned?", a: ["const", "let", "static", "final"], correct: 1, why: "let declares a block-scoped variable that can be reassigned." },
      { q: "Which method selects an element by its ID in JavaScript?", a: ["getElementById()", "queryByClass()", "getByName()", "selectId()"], correct: 0, why: "document.getElementById() selects an element using its ID." }
    ]
  },

  "Data Structures & Algorithms": {
    "Arrays": [
      { q: "What is the index of the first element in a typical array?", a: ["1", "0", "-1", "2"], correct: 1, why: "Most common programming languages use zero-based array indexing." },
      { q: "Which operation adds an element to an array?", a: ["Insertion", "Traversal", "Searching", "Sorting"], correct: 0, why: "Insertion adds a new element to a data structure." }
    ],
    "Stack & Queue": [
      { q: "Which data structure follows LIFO?", a: ["Queue", "Stack", "Tree", "Graph"], correct: 1, why: "Stack follows Last In, First Out." },
      { q: "Which data structure follows FIFO?", a: ["Stack", "Queue", "Tree", "Graph"], correct: 1, why: "Queue follows First In, First Out." }
    ],
    "Sorting Algorithms": [
      { q: "Which sorting algorithm repeatedly compares adjacent elements?", a: ["Binary Search", "Bubble Sort", "Linear Search", "DFS"], correct: 1, why: "Bubble Sort repeatedly compares and swaps adjacent elements when needed." },
      { q: "Which sorting algorithm uses divide and conquer?", a: ["Bubble Sort", "Selection Sort", "Merge Sort", "Linear Search"], correct: 2, why: "Merge Sort divides the data into smaller parts and merges sorted results." }
    ]
  }
};


function Quiz() {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  const subjects = Object.keys(quizBank);
  const topics = subject ? Object.keys(quizBank[subject]) : [];
  const questions = subject && topic ? quizBank[subject][topic] : [];
  const q = questions[index];

  const score = questions.reduce(
    (total, question, i) =>
      total + (answers[i] === question.correct ? 1 : 0),
    0
  );

  const wrong = questions.length - score;
  const percentage = questions.length
    ? Math.round((score / questions.length) * 100)
    : 0;

  const choice = answers[index] ?? null;

  const remark =
    percentage >= 80
      ? 'Excellent! Your understanding of this topic is strong.'
      : percentage >= 60
      ? 'Good work! Revise a few concepts to improve further.'
      : percentage >= 40
      ? 'You are making progress. More practice is recommended.'
      : 'Keep learning! Revise this chapter and try again.';

  function startQuiz() {
    if (!subject || !topic) return;
    setIndex(0);
    setAnswers({});
    setDone(false);
  }

  function selectSubject(value) {
    setSubject(value);
    setTopic('');
    setIndex(0);
    setAnswers({});
    setDone(false);
  }

  function selectTopic(value) {
    setTopic(value);
    setIndex(0);
    setAnswers({});
    setDone(false);
  }

  function next() {
    if (choice === null) return;

    if (index === questions.length - 1) {
      setDone(true);
    } else {
      setIndex(i => i + 1);
    }
  }

  function restart() {
    setIndex(0);
    setAnswers({});
    setDone(false);
  }

  function backToSelection() {
    setSubject('');
    setTopic('');
    setIndex(0);
    setAnswers({});
    setDone(false);
  }

  return (
    <>
      <Heading
        tag="TEST YOUR KNOWLEDGE"
        title="Quiz practice"
        desc="Choose your subject, select a chapter and test your knowledge."
      />

      <div className="quiz-card">

        {!subject || !topic ? (
          <div className="quiz-selection">
            <div className="quiz-selection-heading">
              <p className="eyebrow">PERSONALIZED LEARNING</p>
              <h2>Build your quiz</h2>
              <p className="muted">
                Select a subject and chapter to get relevant questions.
              </p>
            </div>

            <div className="quiz-select-grid">
              <div className="quiz-select-group">
                <label>Select Subject</label>
                <select
                  className="quiz-select"
                  value={subject}
                  onChange={e => selectSubject(e.target.value)}
                >
                  <option value="">Choose a subject</option>
                  {subjects.map(item => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="quiz-select-group">
                <label>Select Topic / Chapter</label>
                <select
                  className="quiz-select"
                  value={topic}
                  disabled={!subject}
                  onChange={e => selectTopic(e.target.value)}
                >
                  <option value="">Choose a topic</option>
                  {topics.map(item => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            {subject && (
              <div className="quiz-topic-info">
                <strong>{subject}</strong>
                <span>{topics.length} available topics</span>
              </div>
            )}

            <button
              className="btn-primary"
              disabled={!subject || !topic}
              onClick={startQuiz}
            >
              Start Quiz <ChevronRight size={17} />
            </button>
          </div>
        ) : done ? (
          <div className="quiz-result">
            <p className="eyebrow">QUIZ COMPLETED</p>
            <h2>Your performance report</h2>
            <p className="muted">{subject} / {topic}</p>

            <div className="quiz-score-circle">
              <strong>{percentage}%</strong>
              <span>YOUR SCORE</span>
            </div>

            <div className="quiz-result-stats">
              <div className="quiz-result-stat">
                <strong>{questions.length}</strong>
                <span>Total Questions</span>
              </div>
              <div className="quiz-result-stat">
                <strong className="quiz-correct">{score}</strong>
                <span>Correct</span>
              </div>
              <div className="quiz-result-stat">
                <strong className="quiz-wrong">{wrong}</strong>
                <span>Wrong</span>
              </div>
            </div>

            <div className="quiz-remark">
              <strong>Performance Remark</strong>
              <p>{remark}</p>
            </div>

            <div className="quiz-review">
              <h3>Answer Review</h3>

              {questions.map((question, i) => (
                <div className="quiz-review-item" key={i}>
                  <p><strong>Q{i + 1}.</strong> {question.q}</p>

                  <p className={answers[i] === question.correct
                    ? 'quiz-review-correct'
                    : 'quiz-review-wrong'}>
                    Your answer: {answers[i] !== undefined
                      ? question.a[answers[i]]
                      : 'Not answered'}
                  </p>

                  <p className="quiz-review-answer">
                    Correct answer: {question.a[question.correct]}
                  </p>

                  <small>{question.why}</small>
                </div>
              ))}
            </div>

            <div className="quiz-result-actions">
              <button className="btn-primary" onClick={restart}>
                Try Again <RotateCcw size={16} />
              </button>
              <button className="btn-secondary" onClick={backToSelection}>
                Change Subject
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="quiz-active-heading">
              <div>
                <p className="eyebrow">{subject}</p>
                <h2>{topic}</h2>
              </div>
              <span className="quiz-question-count">
                {index + 1} / {questions.length}
              </span>
            </div>

            <div className="quiz-meta">
              <span>QUESTION {index + 1}</span>
              <span>{Math.round(((index + 1) / questions.length) * 100)}% COMPLETE</span>
            </div>

            <div className="progress">
              <i style={{
                width: `${((index + 1) / questions.length) * 100}%`
              }} />
            </div>

            <h2 className="quiz-question">{q.q}</h2>

            <div className="options">
              {q.a.map((answer, i) => (
                <button
                  key={i}
                  className={`option ${
                    choice === i ? 'selected' : ''
                  } ${
                    choice !== null && i === q.correct ? 'correct' : ''
                  } ${
                    choice === i && i !== q.correct ? 'incorrect' : ''
                  }`}
                  onClick={() => {
                    if (choice === null) {
                      setAnswers(prev => ({ ...prev, [index]: i }));
                    }
                  }}
                >
                  <span>{String.fromCharCode(65 + i)}.</span> {answer}
                </button>
              ))}
            </div>

            {choice !== null && (
              <div className="explanation">
                <strong>
                  {choice === q.correct ? 'Correct answer!' : 'Not quite right!'}
                </strong>
                <p>{q.why}</p>
              </div>
            )}

            <div className="quiz-navigation">
              <button
                className="btn-secondary"
                disabled={index === 0}
                onClick={() => setIndex(i => i - 1)}
              >
                Previous
              </button>

              <button
                className="btn-primary"
                disabled={choice === null}
                onClick={next}
              >
                {index === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                <ChevronRight size={17} />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}


const flashcardBank = {
  PHP: {
    "PHP Basics": [
      ["What is PHP?", "PHP is a server-side scripting language used for web development."],
      ["PHP variable symbol", "The dollar ($) symbol is used before PHP variable names."],
      ["PHP opening tag", "<?php is used to start PHP code."],
      ["PHP output function", "echo and print are used to display output."]
    ],
    "Arrays": [
      ["What is an array?", "An array stores multiple values in a single variable."],
      ["Indexed Array", "An array that uses numeric indexes to access elements."],
      ["Associative Array", "An array that uses named keys instead of numeric indexes."],
      ["count()", "Returns the number of elements in an array."],
      ["array_push()", "Adds one or more elements at the end of an array."]
    ],
    "Functions": [
      ["What is a function?", "A reusable block of code designed to perform a specific task."],
      ["function keyword", "Used to declare a user-defined function in PHP."],
      ["return statement", "Sends a value back from a function."],
      ["Function parameter", "A variable that receives a value passed to a function."]
    ],
    "OOP": [
      ["What is a class?", "A blueprint used to create objects."],
      ["What is an object?", "An instance of a class."],
      ["Inheritance", "Allows one class to acquire properties and methods of another class."],
      ["Encapsulation", "Bundling data and methods inside a single unit or class."]
    ],
    "Forms": [
      ["What is an HTML form?", "A form collects user input and sends it for processing."],
      ["GET method", "Sends form data through URL query parameters."],
      ["POST method", "Sends form data in the HTTP request body."],
      ["$_POST", "A PHP superglobal used to collect POST form data."]
    ],
    "MySQL & SQL Joins": [
      ["What is a database?", "An organized collection of data stored for easy access and management."],
      ["INNER JOIN", "Returns rows with matching values in both tables."],
      ["LEFT JOIN", "Returns all rows from the left table and matching rows from the right table."],
      ["PDO", "PHP Data Objects provides a consistent interface for database access."]
    ]
  },

  Java: {
    "Java Basics": [
      ["What is Java?", "Java is an object-oriented, class-based programming language."],
      ["main() method", "The standard entry point of a Java application."],
      ["JVM", "Java Virtual Machine executes Java bytecode."],
      ["Variable", "A named storage location used to hold a value."]
    ],
    "OOP": [
      ["Class", "A blueprint for creating objects."],
      ["Object", "An instance of a class."],
      ["Inheritance", "Allows a class to reuse properties and methods of another class."],
      ["Polymorphism", "Allows one interface or method name to have multiple forms."]
    ],
    "Arrays": [
      ["Java array", "A fixed-size collection of elements of the same data type."],
      ["Array index", "The position of an element; indexing starts from zero."],
      ["length", "The property used to get the size of an array."]
    ]
  },

  Python: {
    "Python Basics": [
      ["What is Python?", "A high-level, interpreted, general-purpose programming language."],
      ["print()", "Displays output on the screen."],
      ["Variable", "A named reference used to store a value."],
      ["Comment symbol", "The hash (#) symbol starts a single-line comment."]
    ],
    "Lists": [
      ["What is a list?", "An ordered and mutable collection of elements."],
      ["append()", "Adds an element at the end of a list."],
      ["insert()", "Adds an element at a specified index."],
      ["remove()", "Removes the first matching value from a list."]
    ],
    "Functions": [
      ["def keyword", "Used to define a function in Python."],
      ["return", "Sends a result back from a function."],
      ["Parameter", "A variable that receives an argument."]
    ]
  },

  DBMS: {
    "SQL Joins": [
      ["What is a JOIN?", "Combines rows from two or more tables using a related column."],
      ["INNER JOIN", "Returns only matching rows from both tables."],
      ["LEFT JOIN", "Returns every row from the left table and matching right-table rows."],
      ["RIGHT JOIN", "Returns every row from the right table and matching left-table rows."],
      ["FULL OUTER JOIN", "Returns matching and non-matching rows from both tables where supported."]
    ],
    "Normalization": [
      ["What is normalization?", "Organizing database tables to reduce redundancy and improve data integrity."],
      ["1NF", "Requires atomic values and no repeating groups."],
      ["2NF", "Must be in 1NF and have no partial dependency on a candidate key."],
      ["3NF", "Must be in 2NF and have no transitive dependency of non-key attributes."]
    ],
    "SQL Commands": [
      ["SELECT", "Retrieves records from a database table."],
      ["INSERT", "Adds new records into a table."],
      ["UPDATE", "Modifies existing records."],
      ["DELETE", "Removes records from a table."]
    ]
  },

  "C Programming": {
    "C Basics": [
      ["What is C?", "A general-purpose procedural programming language."],
      ["main()", "The starting function of a standard C program."],
      ["printf()", "Displays formatted output."],
      ["scanf()", "Reads formatted input from the user."]
    ],
    "Arrays": [
      ["What is an array?", "A collection of elements of the same data type."],
      ["Array index", "The position of an element, starting from zero."],
      ["Array traversal", "Visiting each element of an array."]
    ]
  },

  "Web Development": {
    "HTML": [
      ["HTML", "HyperText Markup Language structures web page content."],
      ["<h1>", "Defines a top-level heading."],
      ["<a>", "Creates a hyperlink."],
      ["<img>", "Embeds an image in a web page."]
    ],
    "CSS": [
      ["CSS", "Cascading Style Sheets controls the presentation of web pages."],
      ["color", "CSS property used to set text color."],
      ["ID selector", "The # symbol targets an element by its ID."],
      ["Class selector", "The dot (.) symbol targets elements by class."]
    ],
    "JavaScript": [
      ["JavaScript", "A programming language used to add interactivity to web pages."],
      ["const", "Declares a block-scoped binding that cannot be reassigned."],
      ["let", "Declares a block-scoped variable that can be reassigned."],
      ["API", "A defined way for software systems to communicate."]
    ]
  },

  "Data Structures & Algorithms": {
    "Arrays": [
      ["Array", "A collection of elements stored in indexed positions."],
      ["Traversal", "Visiting each element of a data structure."],
      ["Searching", "Finding a particular element in a collection."]
    ],
    "Stack & Queue": [
      ["Stack", "A linear data structure that follows Last In, First Out."],
      ["Queue", "A linear data structure that follows First In, First Out."],
      ["Push", "An operation that inserts an element into a stack."],
      ["Pop", "An operation that removes the top element from a stack."]
    ],
    "Sorting Algorithms": [
      ["Bubble Sort", "Repeatedly compares adjacent elements and swaps them if needed."],
      ["Merge Sort", "A divide-and-conquer sorting algorithm."],
      ["Quick Sort", "Sorts elements using a pivot and partitioning."]
    ]
  }
};


function Flashcards() {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [deck, setDeck] = useState([]);
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState(false);
  const [status, setStatus] = useState({});
  const [shuffle, setShuffle] = useState(false);

  const subjects = Object.keys(flashcardBank);
  const topics = subject ? Object.keys(flashcardBank[subject]) : [];

  const known = Object.values(status).filter(v => v === 'known').length;
  const revision = Object.values(status).filter(v => v === 'revision').length;
  const current = deck[index];

  function selectSubject(value) {
    setSubject(value);
    setTopic('');
    setDeck([]);
    setIndex(0);
    setFlip(false);
    setStatus({});
    setShuffle(false);
  }

  function selectTopic(value) {
    setTopic(value);
    setDeck(flashcardBank[subject][value].map((card, i) => ({
      id: i,
      front: card[0],
      back: card[1]
    })));
    setIndex(0);
    setFlip(false);
    setStatus({});
    setShuffle(false);
  }

  function move(direction) {
    setIndex(i => (i + direction + deck.length) % deck.length);
    setFlip(false);
  }

  function markCard(value) {
    setStatus(prev => ({ ...prev, [current.id]: value }));
    if (index < deck.length - 1) {
      move(1);
    } else {
      setFlip(false);
    }
  }

  function shuffleDeck() {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setDeck(shuffled);
    setIndex(0);
    setFlip(false);
    setShuffle(true);
  }

  function resetDeck() {
    setDeck(flashcardBank[subject][topic].map((card, i) => ({
      id: i,
      front: card[0],
      back: card[1]
    })));
    setIndex(0);
    setFlip(false);
    setStatus({});
    setShuffle(false);
  }

  function changeSelection() {
    setSubject('');
    setTopic('');
    setDeck([]);
    setIndex(0);
    setFlip(false);
    setStatus({});
    setShuffle(false);
  }

  return (
    <>
      <Heading
        tag="ACTIVE RECALL"
        title="Flashcards"
        desc="Choose a subject, revise a chapter and strengthen your memory."
      />

      <div className="flash-wrap">

        {!subject || !topic ? (
          <div className="flash-selection">
            <p className="eyebrow">YOUR STUDY DECK</p>
            <h2>Choose what to learn</h2>
            <p className="muted">Select a subject and topic to open your flashcards.</p>

            <div className="flash-select-grid">
              <div>
                <label>Select Subject</label>
                <select
                  className="flash-select"
                  value={subject}
                  onChange={e => selectSubject(e.target.value)}
                >
                  <option value="">Choose subject</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label>Select Topic / Chapter</label>
                <select
                  className="flash-select"
                  value={topic}
                  disabled={!subject}
                  onChange={e => selectTopic(e.target.value)}
                >
                  <option value="">Choose topic</option>
                  {topics.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flash-dashboard">
              <div>
                <p className="eyebrow">{subject}</p>
                <h2>{topic}</h2>
                <p className="muted">{deck.length} flashcards in this deck</p>
              </div>

              <button className="btn-secondary" onClick={changeSelection}>
                Change Topic
              </button>
            </div>

            <div className="flash-stats">
              <div><strong>{deck.length}</strong><span>Total Cards</span></div>
              <div><strong className="flash-known">{known}</strong><span>Know It</span></div>
              <div><strong className="flash-revision">{revision}</strong><span>Need Revision</span></div>
            </div>

            <div className="flash-progress">
              <div>
                <span>Learning progress</span>
                <strong>{deck.length ? Math.round((known / deck.length) * 100) : 0}%</strong>
              </div>
              <div className="progress">
                <i style={{ width: `${deck.length ? (known / deck.length) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="flash-count">
              CARD {index + 1} / {deck.length}
              {shuffle ? ' · SHUFFLED DECK' : ''}
            </div>

            <button
              className={`flash-card ${flip ? 'flipped' : ''}`}
              onClick={() => setFlip(v => !v)}
            >
              <span className="eyebrow">{flip ? 'ANSWER / DEFINITION' : 'QUESTION / TERM'}</span>
              <strong>{flip ? current.back : current.front}</strong>
              <small>Click anywhere on the card to flip</small>
            </button>

            {flip && (
              <div className="flash-rating">
                <button className="flash-know" onClick={() => markCard('known')}>
                  ✓ Know It
                </button>
                <button className="flash-revise" onClick={() => markCard('revision')}>
                  ↻ Need Revision
                </button>
              </div>
            )}

            <div className="flash-controls">
              <button className="btn-outline" onClick={() => move(-1)} disabled={deck.length < 2}>
                Previous
              </button>
              <button className="btn-primary" onClick={() => move(1)} disabled={deck.length < 2}>
                Next Card <ChevronRight size={17} />
              </button>
            </div>

            <div className="flash-extra-controls">
              <button className="btn-secondary" onClick={shuffleDeck}>Shuffle Cards</button>
              <button className="btn-secondary" onClick={resetDeck}>Reset Progress</button>
            </div>

            {known + revision === deck.length && (
              <div className="flash-complete">
                <h3>Deck reviewed!</h3>
                <p>You marked {known} cards as known and {revision} for revision.</p>
                <button className="btn-primary" onClick={resetDeck}>
                  Review Again <RotateCcw size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function Profile({user}){
 const key=`stuweek_profile_${user.id||user.email}`;
 const defaults={name:user.name||'',bio:'',course:'BCA',college:'',department:'',studentId:'',semester:'',academicYear:'',location:'',phone:'',dob:'',goal:'',skills:'',interests:'',languages:'',github:'',linkedin:'',avatar:''};
 const [form,setForm]=useState(()=>{try{return {...defaults,...JSON.parse(localStorage.getItem(key)||'{}')}}catch{return defaults}});
 const [editing,setEditing]=useState(false),[notice,setNotice]=useState(''),[stats,setStats]=useState({tasks:0,completed:0,notes:0,sessions:0,minutes:0}),[weekly,setWeekly]=useState([]);
 useEffect(()=>{Promise.all([api.get('/planner'),api.get('/notes'),api.get('/focus/stats'),api.get('/focus/weekly')]).then(([a,b,c,d])=>{const tasks=a.data.tasks||[];setStats({tasks:tasks.length,completed:tasks.filter(t=>t.done).length,notes:(b.data.notes||[]).length,sessions:c.data.sessions||0,minutes:c.data.minutes||0});setWeekly(d.data.days||[])}).catch(()=>setNotice('Some learning statistics could not be loaded right now.'));},[]);
 const update=(k,v)=>setForm(old=>({...old,[k]:v}));
 function save(e){e.preventDefault();localStorage.setItem(key,JSON.stringify(form));setEditing(false);setNotice('Profile saved on this device.');}
 function cancel(){try{setForm({...defaults,...JSON.parse(localStorage.getItem(key)||'{}')})}catch{setForm(defaults)}setEditing(false);}
 function upload(e){const f=e.target.files?.[0];if(!f)return;if(!f.type.startsWith('image/')||f.size>2*1024*1024){setNotice('Please choose an image smaller than 2 MB.');e.target.value='';return;}const r=new FileReader();r.onload=()=>{update('avatar',r.result);setNotice('Photo preview ready. Save changes to keep it.');};r.readAsDataURL(f);}
 const skills=form.skills.split(',').map(x=>x.trim()).filter(Boolean), interests=form.interests.split(',').map(x=>x.trim()).filter(Boolean), languages=form.languages.split(',').map(x=>x.trim()).filter(Boolean);
 const completionFields=['name','course','college','department','studentId','semester','academicYear','location','phone','dob','goal','bio','skills','interests','languages','avatar'];
 const completion=Math.round(completionFields.filter(k=>String(form[k]||'').trim()).length/completionFields.length*100);
 const badges=[{name:'First Steps',desc:'Created your student account',earned:true,icon:'✦'},{name:'Planner Starter',desc:'Completed your first study task',earned:stats.completed>0,icon:'✓'},{name:'Knowledge Keeper',desc:'Saved your first note',earned:stats.notes>0,icon:'▤'},{name:'Focus Builder',desc:'Completed a focus session',earned:stats.sessions>0,icon:'◷'}];
 return <>
  <Heading tag="STUDENT IDENTITY" title="My profile" desc="Your academic identity, learning journey and progress — all in one place." action={<button className="btn-primary" onClick={()=>setEditing(v=>!v)}>{editing?'Close editor':'Edit profile'}</button>}/>
  <section className="profile-hero profile-hero-v2"><div className="profile-cover"><span>STUWEEK · STUDENT PROFILE</span><div className="cover-orbit"/></div><div className="profile-identity"><div className="profile-photo">{form.avatar?<img src={form.avatar} alt="Student profile"/>:initials(form.name||user.name)}</div><div className="profile-intro"><h2>{form.name||user.name}</h2><p>{[form.course,form.department,form.semester].filter(Boolean).join(' · ')||'Student profile'}</p><span><i/> Active student</span></div><div className="profile-member">PROFILE COMPLETION<br/><b>{completion}%</b><div className="completion-track"><i style={{width:`${completion}%`}}/></div></div></div></section>
  {editing?<form className="profile-editor" onSubmit={save}>
   <div className="profile-section-title"><p className="eyebrow">STUDENT INFORMATION</p><h3>Complete your profile</h3><p className="muted">Add your academic and personal details. You can leave optional fields blank.</p></div>
   <div className="profile-fields">
    <label>Full name<input value={form.name} onChange={e=>update('name',e.target.value)} required maxLength="60" placeholder="Your full name"/></label>
    <label>Student ID / Roll number<input value={form.studentId} onChange={e=>update('studentId',e.target.value)} placeholder="College roll / registration number"/></label>
    <label>Course / Degree<input value={form.course} onChange={e=>update('course',e.target.value)} placeholder="e.g. BCA"/></label>
    <label>Department / Specialisation<input value={form.department} onChange={e=>update('department',e.target.value)} placeholder="e.g. Computer Applications"/></label>
    <label>College / Institution<input value={form.college} onChange={e=>update('college',e.target.value)} placeholder="Your college name"/></label>
    <label>Semester<input value={form.semester} onChange={e=>update('semester',e.target.value)} placeholder="e.g. 5th Semester"/></label>
    <label>Academic year<input value={form.academicYear} onChange={e=>update('academicYear',e.target.value)} placeholder="e.g. 2026–27"/></label>
    <label>Location<input value={form.location} onChange={e=>update('location',e.target.value)} placeholder="City, State"/></label>
    <label>Email address<input value={user.email||''} readOnly/></label>
    <label>Phone number<input type="tel" value={form.phone} onChange={e=>update('phone',e.target.value)} placeholder="Optional contact number"/></label>
    <label>Date of birth<input type="date" value={form.dob} onChange={e=>update('dob',e.target.value)}/></label>
    <label>Learning / Career goal<input value={form.goal} onChange={e=>update('goal',e.target.value)} placeholder="e.g. Become a full-stack developer"/></label>
    <label className="wide">About me<textarea rows="3" maxLength="500" value={form.bio} onChange={e=>update('bio',e.target.value)} placeholder="Introduce yourself, your interests and what you are learning…"/></label>
    <label className="wide">Skills & technologies<input value={form.skills} onChange={e=>update('skills',e.target.value)} placeholder="Java, Python, HTML, CSS, JavaScript"/><small>Separate each skill with a comma.</small></label>
    <label>Interests<input value={form.interests} onChange={e=>update('interests',e.target.value)} placeholder="Web development, AI/ML, DSA"/></label>
    <label>Languages<input value={form.languages} onChange={e=>update('languages',e.target.value)} placeholder="English, Hindi, Bengali"/></label>
    <label>GitHub profile<input type="url" value={form.github} onChange={e=>update('github',e.target.value)} placeholder="https://github.com/username"/></label>
    <label>LinkedIn profile<input type="url" value={form.linkedin} onChange={e=>update('linkedin',e.target.value)} placeholder="https://linkedin.com/in/username"/></label>
    <label className="wide">Student photo<input type="file" accept="image/png,image/jpeg,image/webp" onChange={upload}/><small>Upload a clear JPG, PNG or WebP photo · maximum 2 MB. It stays in this browser.</small>{form.avatar&&<button type="button" className="text-link photo-remove" onClick={()=>update('avatar','')}>Remove current photo</button>}</label>
   </div><div className="profile-actions"><button type="button" className="btn-outline" onClick={cancel}>Cancel</button><button className="btn-primary">Save profile</button></div>
  </form>:<>
   <div className="profile-detail-grid profile-detail-grid-v2">
    <section className="profile-info-card"><p className="eyebrow">STUDENT DETAILS</p><h3>Academic information</h3><div className="profile-facts"><div><span>Student ID</span><b>{form.studentId||'Not added'}</b></div><div><span>Course</span><b>{form.course||'Not added'}</b></div><div><span>Department</span><b>{form.department||'Not added'}</b></div><div><span>Institution</span><b>{form.college||'Not added'}</b></div><div><span>Semester</span><b>{form.semester||'Not added'}</b></div><div><span>Academic year</span><b>{form.academicYear||'Not added'}</b></div></div></section>
    <section className="profile-info-card"><p className="eyebrow">PERSONAL INFORMATION</p><h3>About the student</h3><p className="profile-bio">{form.bio||'Add a short introduction to tell others about yourself and your learning journey.'}</p><div className="profile-facts"><div><span>Email</span><b>{user.email}</b></div><div><span>Phone</span><b>{form.phone||'Not added'}</b></div><div><span>Location</span><b>{form.location||'Not added'}</b></div><div><span>Date of birth</span><b>{form.dob||'Not added'}</b></div><div><span>Member since</span><b>{user.created_at?new Date(user.created_at).toLocaleDateString():'Recently'}</b></div></div></section>
   </div>
   <div className="profile-detail-grid profile-lower-grid"><section className="profile-info-card"><p className="eyebrow">LEARNING JOURNEY</p><h3>Goals, skills & interests</h3><div className="goal-box"><span>MY MAIN GOAL</span><b>{form.goal||'Set a learning goal'}</b><small>{form.course||'Course not added'} {form.semester?`· ${form.semester}`:''}</small></div><h3 className="skills-heading">Skills & technologies</h3><div className="skill-chips">{skills.length?skills.map((x,i)=><span key={i}>{x}</span>):<small className="muted">Add your skills from Edit profile.</small>}</div><h3 className="skills-heading">Interests</h3><div className="skill-chips">{interests.length?interests.map((x,i)=><span key={i}>{x}</span>):<small className="muted">No interests added yet.</small>}</div><h3 className="skills-heading">Languages</h3><div className="skill-chips">{languages.length?languages.map((x,i)=><span key={i}>{x}</span>):<small className="muted">No languages added yet.</small>}</div></section>
    <section className="profile-info-card"><p className="eyebrow">YOUR STUWEEK ACTIVITY</p><h3>Learning statistics</h3><div className="profile-stat-grid"><div><b>{stats.completed}/{stats.tasks}</b><span>Tasks completed</span></div><div><b>{stats.notes}</b><span>Notes saved</span></div><div><b>{stats.sessions}</b><span>Focus sessions</span></div><div><b>{stats.minutes}</b><span>Focus minutes</span></div></div><div className="profile-activity-head"><span>7-day focus activity</span><small>{weekly.reduce((sum,d)=>sum+(d.minutes||0),0)} min total</small></div><div className="profile-week-bars">{weekly.map((d,i)=>{const max=Math.max(1,...weekly.map(x=>x.minutes||0));return <div key={d.day||i}><i style={{height:`${Math.max(4,((d.minutes||0)/max)*100)}%`}} title={`${d.minutes||0} min`}/><small>{d.day}</small></div>})}</div></section>
   </div>
   <section className="profile-info-card"><div className="profile-section-title"><p className="eyebrow">MILESTONES</p><h3>Achievements</h3><p className="muted">Small wins that show your learning habit growing.</p></div><div className="achievement-grid">{badges.map(b=><div className={`achievement ${b.earned?'earned':''}`} key={b.name}><span>{b.icon}</span><div><b>{b.name}</b><small>{b.desc}</small></div><em>{b.earned?'UNLOCKED':'LOCKED'}</em></div>)}</div></section>
   <section className="profile-info-card profile-links"><p className="eyebrow">AROUND THE WEB</p><h3>Connect with me</h3><div>{form.github?<a href={form.github} target="_blank" rel="noreferrer">GitHub ↗</a>:<span>GitHub not added</span>}{form.linkedin?<a href={form.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>:<span>LinkedIn not added</span>}</div></section>
  </>}
  {notice&&<p className="profile-message">{notice}</p>}
 </>;
}
export default App;
