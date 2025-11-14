/* =====================
   Utilities & Storage
   ===================== */
const $ = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => Array.from(root.querySelectorAll(q));
const todayISO = () => new Date().toISOString().slice(0,10);
const monISO = () => new Date().toISOString().slice(0,7);

const db = {
  get(key, fallback){
    try{ return JSON.parse(localStorage.getItem(key)) ?? fallback }catch{ return fallback }
  },
  set(key, val){ localStorage.setItem(key, JSON.stringify(val)) }
}

const store = {
  users: 'sl_users',
  students: 'sl_students',
  attendance: 'sl_attendance', // array of {date, studentId, status}
}

function uid(prefix='U'){
  return prefix + Math.random().toString(36).slice(2,8).toUpperCase();
}

function seeded(){ return db.get('sl_seeded', false) }
function setSeeded(v){ db.set('sl_seeded', !!v) }

function seedDemo(){
  // Teacher
  const users = [
        { id: 'T001', role:'teacher', email:'Jitendra Kumar', password:'teacher123', name:'Admin Jitendra Kumar' },
         { id: 'T002', role:'teacher', email:'Naman Jaiswal', password:'teacher123', name:'Admin Naman Jaiswal' },
          { id: 'T003', role:'teacher', email:'Jyoti Srivastava', password:'teacher123', name:'Admin Jyoti Srivastava' },
           { id: 'T004', role:'teacher', email:'Devendra Awasthi', password:'teacher123', name:'Admin Devendra Awasthi' }
  ];

  // Students
  const students = [
    { id:'176', name:'Utsav Dwivedi', roll:'2204280100176', class:'CS-7A', email:'utsavdwivedi51@gmail.com', password:'utsav@123' },
    { id:'169', name:'Shristi Tripathi', roll:'2204280100169', class:'CS-7A', email:'shristi66@gmail.com', password:'shristi@123' },
    { id:'150', name:'Raj Dwivedi', roll:'2204280100150', class:'CS-7B', email:'rajdwivedi@gmail.com', password:'raj@123' },
    { id:'054', name:'Akshay Yadav', roll:'2204280100054', class:'CS-7B', email:'akshay12@gmail.com', password:'akshay@123' }
  ];

  // Attendance for last 10 days
  const attendance = [];
  const now = new Date();
  for(let d=0; d<10; d++){
    const date = new Date(now);
    date.setDate(now.getDate()-d);
    const iso = date.toISOString().slice(0,10);
    for(const s of students){
      // random-ish pattern
      const present = Math.random() > 0.15;
      attendance.push({date: iso, studentId: s.id, status: present ? 'P' : 'A'});
    }
  }

  db.set(store.users, users);
  db.set(store.students, students);
  db.set(store.attendance, attendance);
  setSeeded(true);
}

function ensureSeed(){ if(!seeded()){ seedDemo() } }

/* =====================
   Auth
   ===================== */
const auth = {
  current: null,
  login(idOrEmail, password, role){
    const users = db.get(store.users, []);
    const students = db.get(store.students, []);
    if(role === 'teacher'){
      const u = users.find(u=> (u.email?.toLowerCase()===idOrEmail.toLowerCase()) && u.password===password);
      if(u){ this.current = u; sessionStorage.setItem('sl_user', JSON.stringify(u)); return {ok:true, user:u} }
    }else{
      const s = students.find(s=> (s.id===idOrEmail || s.email?.toLowerCase()===idOrEmail.toLowerCase()) && s.password===password);
      if(s){ this.current = {...s, role:'student'}; sessionStorage.setItem('sl_user', JSON.stringify(this.current)); return {ok:true, user:this.current} }
    }
    return {ok:false, msg:'Invalid credentials'}
  },
  logout(){ this.current=null; sessionStorage.removeItem('sl_user') },
  load(){ try{ this.current = JSON.parse(sessionStorage.getItem('sl_user')); return this.current }catch{ return null } }
}

/* =====================
   DOM Handlers
   ===================== */
const authPage = $('#authPage');
const dash = $('#dash');
const loginBtn = $('#loginBtn');
const togglePass = $('#togglePass');
const loginId = $('#loginId');
const loginPass = $('#loginPass');
const loginMsg = $('#loginMsg');
const navLogoutBtn = $('#navLogoutBtn');
const logoutBtn = $('#logoutBtn');

const userName = $('#userName');
const userRole = $('#userRole');
const nav = $('#nav');

const todayDate = $('#todayDate');

// Sections
const sections = ['teacherHome','manageStudents','takeAttendance','reports','studentHome'];

function show(el){ el.classList.remove('hide') }
function hide(el){ el.classList.add('hide') }
function setActive(id){ sections.forEach(s=> hide($('#'+s))); show($('#'+id)); $$('.nav .item').forEach(i=> i.classList.toggle('active', i.dataset.target===id)); }

// Stats on Auth page
function refreshLandingStats(){
  const students = db.get(store.students, []);
  const att = db.get(store.attendance, []);
  const classes = [...new Set(students.map(s=>s.class))];
  const today = todayISO();
  const todays = att.filter(r=>r.date===today);
  const present = todays.filter(r=>r.status==='P').length;
  $('#statStudents').textContent = students.length;
  $('#statClasses').textContent = classes.length;
  $('#statRecords').textContent = att.length;
  $('#statToday').textContent = todays.length? Math.round(present/todays.length*100)+'%':'0%';
}

function refreshTeacherStats(){
  const students = db.get(store.students, []);
  const att = db.get(store.attendance, []);
  const classes = [...new Set(students.map(s=>s.class))];
  const today = todayISO();
  const todays = att.filter(r=>r.date===today);
  const present = todays.filter(r=>r.status==='P').length;
  $('#tStatStudents').textContent = students.length;
  $('#tStatClasses').textContent = classes.length;
  $('#tStatRecords').textContent = att.length;
  $('#tStatPresent').textContent = todays.length? Math.round(present/todays.length*100)+'%':'0%';
  todayDate.textContent = new Date().toLocaleDateString();
}

/* =====================
   Students CRUD
   ===================== */
const sName = $('#sName');
const sRoll = $('#sRoll');
const sClass = $('#sClass');
const sEmail = $('#sEmail');
const sPass = $('#sPass');
const addStudentBtn = $('#addStudentBtn');
const studentsTbody = $('#studentsTbody');
const studentSearch = $('#studentSearch');

function listStudents(filter=''){
  const students = db.get(store.students, []);
  const q = filter.toLowerCase();
  const filtered = students.filter(s=> [s.name, s.roll, s.class].some(x=> String(x).toLowerCase().includes(q)));

  studentsTbody.innerHTML = '';
  filtered.forEach((s, i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>${s.name}</td>
      <td>${s.roll}</td>
      <td>${s.class}</td>
      <td>${s.email??''}</td>
      <td><code>${s.id}</code></td>
      <td class="row">
        <button class="btn small" data-act="reset" data-id="${s.id}">Reset PW</button>
        <button class="btn small danger" data-act="del" data-id="${s.id}">Delete</button>
      </td>
    `;
    studentsTbody.appendChild(tr);
  })
}

function refreshClassFilter(){
  const students = db.get(store.students, []);
  const classes = [...new Set(students.map(s=>s.class))].sort();
  const sel = $('#classFilter');
  sel.innerHTML = '<option value="">All Classes</option>' + classes.map(c=>`<option value="${c}">${c}</option>`).join('');
}

addStudentBtn.addEventListener('click', ()=>{
  const name = sName.value.trim();
  const roll = sRoll.value.trim();
  const cls = sClass.value.trim();
  const email = sEmail.value.trim();
  const pass = sPass.value.trim() || Math.random().toString(36).slice(2,8);
  if(!name || !roll || !cls){ alert('Name, Roll and Class are required'); return }
  const students = db.get(store.students, []);
  const id = 'S' + roll.padStart(4,'0');
  if(students.some(x=>x.id===id)){ alert('A student with this roll already exists.'); return }
  students.push({ id, name, roll, class: cls, email, password: pass });
  db.set(store.students, students);
  sName.value = sRoll.value = sClass.value = sEmail.value = sPass.value = '';
  listStudents(studentSearch.value);
  refreshClassFilter();
  refreshTeacherStats();
})

studentsTbody.addEventListener('click', (e)=>{
  const btn = e.target.closest('button'); if(!btn) return;
  const id = btn.dataset.id; const act = btn.dataset.act;
  const students = db.get(store.students, []);
  const idx = students.findIndex(s=>s.id===id);
  if(idx===-1) return;
  if(act==='del'){
    if(confirm('Delete this student?')){
      students.splice(idx,1); db.set(store.students, students);
      // also remove attendance
      const attendance = db.get(store.attendance, []);
      db.set(store.attendance, attendance.filter(r=>r.studentId!==id));
      listStudents(studentSearch.value); refreshClassFilter(); refreshTeacherStats();
    }
  }else if(act==='reset'){
    const npw = prompt('Enter new password for '+students[idx].name, 'pass123');
    if(npw){ students[idx].password=npw; db.set(store.students, students); alert('Password updated.') }
  }
})

studentSearch.addEventListener('input', e=> listStudents(e.target.value));

// Export students CSV
$('#exportStudentsBtn').addEventListener('click', ()=>{
  const students = db.get(store.students, []);
  const rows = [['ID','Name','Roll','Class','Email']].concat(students.map(s=>[s.id,s.name,s.roll,s.class,s.email||'']))
  downloadCSV(rows, 'students.csv');
})

/* =====================
   Take Attendance
   ===================== */
const attTbody = $('#attTbody');
const attDate = $('#attDate');
const attSearch = $('#attSearch');
const markAllPresentBtn = $('#markAllPresentBtn');
const clearMarksBtn = $('#clearMarksBtn');

function renderAttendanceTable(){
  const students = db.get(store.students, []);
  const q = attSearch.value.trim().toLowerCase();
  const cls = $('#classFilter').value;
  const date = attDate.value || todayISO();

  const att = db.get(store.attendance, []);
  const existing = new Map(att.filter(r=>r.date===date).map(r=> [r.studentId, r.status]));

  const view = students
    .filter(s=> (cls? s.class===cls : true))
    .filter(s=> [s.name, s.roll].some(x=> String(x).toLowerCase().includes(q)) )
    .sort((a,b)=> a.roll.localeCompare(b.roll));

  attTbody.innerHTML = '';
  view.forEach((s,i)=>{
    const tr = document.createElement('tr');
    const status = existing.get(s.id) || '';
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>${s.name}</td>
      <td>${s.roll}</td>
      <td>${s.class}</td>
      <td>
        <div class="row">
          <button class="btn small ${status==='P'?'success':''}" data-sid="${s.id}" data-status="P">Present</button>
          <button class="btn small ${status==='A'?'danger':''}" data-sid="${s.id}" data-status="A">Absent</button>
          <span class="chip ${status==='P'?'ok':status==='A'?'bad':'warn'}">${status===''?'—':(status==='P'?'Present':'Absent')}</span>
        </div>
      </td>
    `;
    attTbody.appendChild(tr);
  })
}

attTbody.addEventListener('click', (e)=>{
  const btn = e.target.closest('button'); if(!btn) return;
  const sid = btn.dataset.sid; const status = btn.dataset.status;
  const date = attDate.value || todayISO();
  let att = db.get(store.attendance, []);
  const idx = att.findIndex(r=> r.date===date && r.studentId===sid);
  if(idx>-1){ att[idx].status=status } else { att.push({date, studentId:sid, status}) }
  db.set(store.attendance, att);
  renderAttendanceTable(); refreshTeacherStats(); refreshLandingStats();
})

$('#classFilter').addEventListener('change', renderAttendanceTable);
attSearch.addEventListener('input', renderAttendanceTable);
attDate.addEventListener('change', renderAttendanceTable);

$('#saveAttendanceBtn').addEventListener('click', ()=>{
  alert('Attendance saved for '+ (attDate.value || todayISO()));
})
markAllPresentBtn.addEventListener('click', ()=>{
  const date = attDate.value || todayISO();
  const students = db.get(store.students, []);
  let att = db.get(store.attendance, []);
  for(const s of students){
    const idx = att.findIndex(r=> r.date===date && r.studentId===s.id);
    if(idx>-1) att[idx].status='P'; else att.push({date, studentId:s.id, status:'P'});
  }
  db.set(store.attendance, att); renderAttendanceTable(); refreshTeacherStats();
})
clearMarksBtn.addEventListener('click', ()=>{
  const date = attDate.value || todayISO();
  let att = db.get(store.attendance, []);
  att = att.filter(r=> r.date !== date);
  db.set(store.attendance, att); renderAttendanceTable(); refreshTeacherStats();
})

// Export attendance CSV
$('#exportAttendanceBtn').addEventListener('click', ()=>{
  const month = $('#repMonth').value || monISO();
  const rows = buildAttendanceCSV(month);
  downloadCSV(rows, `attendance_${month}.csv`);
})

// Reports table
function renderReports(){
  const month = $('#repMonth').value || monISO();
  const students = db.get(store.students, []);
  const att = db.get(store.attendance, []);
  const inMonth = att.filter(r=> r.date.startsWith(month));
  const byStu = new Map();
  for(const r of inMonth){
    const o = byStu.get(r.studentId) || {P:0,A:0};
    o[r.status]++; byStu.set(r.studentId, o);
  }
  const tbody = $('#repTbody');
  tbody.innerHTML='';
  for(const s of students){
    const o = byStu.get(s.id) || {P:0,A:0};
    const total = o.P + o.A; const pct = total? Math.round(o.P/total*100) : 0;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.name}</td>
      <td>${s.roll}</td>
      <td>${s.class}</td>
      <td>${o.P}</td>
      <td>${o.A}</td>
      <td><span class="chip ${pct>=75?'ok':pct>=50?'warn':'bad'}">${pct}%</span></td>
    `;
    tbody.appendChild(tr);
  }
}

/* =====================
   Student View
   ===================== */
function renderStudentHome(){
  const u = auth.current; if(!u) return;
  $('#stuWelcome').textContent = u.name;
  const month = $('#stuMonth').value || monISO();
  const att = db.get(store.attendance, []).filter(r=> r.studentId===u.id && r.date.startsWith(month));
  const tbody = $('#stuTbody'); tbody.innerHTML='';
  let P=0, A=0; let streak=0; let prevDate=null;
  // sort by date asc
  att.sort((a,b)=> a.date.localeCompare(b.date));
  for(const r of att){
    if(r.status==='P') P++; else A++;
    // streak calc (consecutive present)
    if(r.status==='P'){
      if(!prevDate) streak=1; else {
        const d1 = new Date(prevDate), d2 = new Date(r.date);
        const diff = (d2 - d1) / (1000*60*60*24);
        streak = (diff===1) ? streak+1 : 1;
      }
      prevDate = r.date;
    }
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.date}</td><td>${r.status==='P'?'<span class="chip ok">Present</span>':'<span class="chip bad">Absent</span>'}</td>`;
    tbody.appendChild(tr);
  }
  const total = P + A; const pct = total? Math.round(P/total*100) : 0;
  $('#stuPresent').textContent=P; $('#stuAbsent').textContent=A; $('#stuPercent').textContent=pct+'%'; $('#stuStreak').textContent=streak;
}

$('#stuMonth').addEventListener('change', renderStudentHome);
$('#stuExportBtn').addEventListener('click', ()=>{
  const u = auth.current; if(!u) return;
  const month = $('#stuMonth').value || monISO();
  const rows = buildAttendanceCSV(month, u.id);
  downloadCSV(rows, `attendance_${u.id}_${month}.csv`);
})

/* =====================
   CSV helpers
   ===================== */
function buildAttendanceCSV(month, onlyStudentId=null){
  const students = db.get(store.students, []);
  const mapStu = new Map(students.map(s=> [s.id, s]));
  const att = db.get(store.attendance, []).filter(r=> r.date.startsWith(month));
  const rows = [['Date','Student ID','Name','Roll','Class','Status']];
  for(const r of att){
    if(onlyStudentId && r.studentId!==onlyStudentId) continue;
    const s = mapStu.get(r.studentId); if(!s) continue;
    rows.push([r.date, s.id, s.name, s.roll, s.class, r.status==='P'?'Present':'Absent']);
  }
  return rows;
}

function downloadCSV(rows, filename){
  const csv = rows.map(r=> r.map(x=> '"'+String(x).replaceAll('"','""')+'"').join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url);
}

/* =====================
   Navigation & Auth flow
   ===================== */
function enterDashboard(){
  hide(authPage); show(dash); show(navLogoutBtn);
  const u = auth.current; userName.textContent = u.name; userRole.textContent = u.role;
  if(u.role==='teacher'){
    $('#navTeacherHome').classList.remove('hide');
    $('#navManageStudents').classList.remove('hide');
    $('#navTakeAttendance').classList.remove('hide');
    $('#navReports').classList.remove('hide');
    $('#navStudentHome').classList.add('hide');
    setActive('teacherHome'); refreshTeacherStats(); listStudents(); refreshClassFilter();
    attDate.value = todayISO(); renderAttendanceTable();
    $('#repMonth').value = monISO(); renderReports();
  }else{
    $('#navTeacherHome').classList.add('hide');
    $('#navManageStudents').classList.add('hide');
    $('#navTakeAttendance').classList.add('hide');
    $('#navReports').classList.add('hide');
    $('#navStudentHome').classList.remove('hide');
    setActive('studentHome'); $('#stuMonth').value = monISO(); renderStudentHome();
  }
}

function leaveDashboard(){
  show(authPage); hide(dash); hide(navLogoutBtn); refreshLandingStats(); loginPass.value='';
}

loginBtn.addEventListener('click', ()=>{
  const role = document.querySelector('input[name="role"]:checked').value;
  const id = loginId.value.trim(); const pw = loginPass.value.trim();
  if(!id || !pw){ loginMsg.textContent = 'Please fill all fields.'; return }
  const res = auth.login(id, pw, role);
  if(res.ok){ loginMsg.textContent=''; enterDashboard() } else { loginMsg.textContent = 'Invalid '+role+' credentials.' }
})

togglePass.addEventListener('click', ()=>{
  loginPass.type = loginPass.type==='password' ? 'text' : 'password';
  togglePass.textContent = loginPass.type==='password' ? 'Show' : 'Hide';
})

logoutBtn.addEventListener('click', ()=>{ auth.logout(); leaveDashboard() });
navLogoutBtn.addEventListener('click', ()=>{ auth.logout(); leaveDashboard() });
$('#navHomeBtn').addEventListener('click', ()=>{ auth.logout(); leaveDashboard() });

// Sidebar navigation
nav.addEventListener('click', (e)=>{
  const it = e.target.closest('.item'); if(!it) return;
  const target = it.dataset.target; setActive(target);
  if(target==='reports') renderReports();
  if(target==='takeAttendance') renderAttendanceTable();
  if(target==='studentHome') renderStudentHome();
})

// Quick actions
$('#quickTakeBtn').addEventListener('click', ()=>{ setActive('takeAttendance'); renderAttendanceTable() });
$('#seedBtn').addEventListener('click', ()=>{ if(confirm('Reset demo data?')){ seedDemo(); refreshLandingStats(); refreshTeacherStats(); listStudents(); renderAttendanceTable(); renderReports(); } })

// Bootstrap
ensureSeed();
refreshLandingStats();
todayDate.textContent = new Date().toLocaleDateString();
const existing = auth.load(); if(existing){ enterDashboard() } else { leaveDashboard() }
