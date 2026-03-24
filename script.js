
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
  attendance: 'sl_attendance',
  fees: 'sl_fees',
  payments: 'sl_payments'
};

// The single admin ID — Jitendra Kumar (T001)
const ADMIN_ID = 'T001';

function isAdmin(user){
  return user && user.role === 'teacher' && user.id === ADMIN_ID;
}

function uid(prefix='U'){
  return prefix + Math.random().toString(36).slice(2,8).toUpperCase();
}

function seeded(){ return db.get('sl_seeded', false) }
function setSeeded(v){ db.set('sl_seeded', !!v) }

function initFeeStores() {
  if (!db.get(store.fees)) db.set(store.fees, []);
  if (!db.get(store.payments)) db.set(store.payments, []);
}

function seedDemo(){
  // Teacher / admin accounts
  const users = [
    { id: 'T001', role:'teacher', email:'Jitendra Kumar', password:'teacher123', name:'Admin Jitendra Kumar', isAdmin: true },
    { id: 'T002', role:'teacher', email:'Naman Jaiswal', password:'teacher123', name:'Admin Naman Jaiswal' },
    { id: 'T003', role:'teacher', email:'Jyoti Srivastava', password:'teacher123', name:'Admin Jyoti Srivastava' },
    { id: 'T004', role:'teacher', email:'Devendra Awasthi', password:'teacher123', name:'Admin Devendra Awasthi' }
  ];

  // Students
  const students = [
    { id:'176', name:'Om Malviya', roll:'2204280100176', class:'CS-7A', email:'mrmalviyaji@gmail.com', password:'om@123' },
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
      const present = Math.random() > 0.15;
      attendance.push({date: iso, studentId: s.id, status: present ? 'P' : 'A'});
    }
  }

  // Fees
  const fees = [
    {
      id: 'F001',
      studentId: '176',
      studentName: 'Om Malviya',
      rollNo: '2204280100176',
      className: 'CS-7A',
      feeType: 'Tuition',
      amount: 15000,
      paidAmount: 15000,
      dueDate: '2024-12-31',
      academicYear: '2024-25',
      semester: 'Semester 7',
      status: 'Paid',
      notes: 'Paid via online banking'
    },
    {
      id: 'F002',
      studentId: '176',
      studentName: 'Om Malviya',
      rollNo: '2204280100176',
      className: 'CS-7A',
      feeType: 'Library',
      amount: 2000,
      paidAmount: 2000,
      dueDate: '2024-12-31',
      academicYear: '2024-25',
      semester: 'Semester 7',
      status: 'Paid'
    },
    {
      id: 'F003',
      studentId: '169',
      studentName: 'Shristi Tripathi',
      rollNo: '2204280100169',
      className: 'CS-7A',
      feeType: 'Tuition',
      amount: 15000,
      paidAmount: 10000,
      dueDate: '2024-12-31',
      academicYear: '2024-25',
      semester: 'Semester 7',
      status: 'Partial',
      notes: 'Remaining 5000 due'
    },
    {
      id: 'F004',
      studentId: '150',
      studentName: 'Raj Dwivedi',
      rollNo: '2204280100150',
      className: 'CS-7B',
      feeType: 'Tuition',
      amount: 15000,
      paidAmount: 0,
      dueDate: '2024-12-31',
      academicYear: '2024-25',
      semester: 'Semester 7',
      status: 'Pending'
    }
  ];

  // Payments
  const payments = [
    {
      id: 'P001',
      feeId: 'F001',
      studentId: '176',
      amount: 15000,
      date: '2024-11-15',
      paymentMode: 'online',
      receiptNo: 'RCPT001',
      referenceNo: 'TXN0012345',
      status: 'Completed'
    },
    {
      id: 'P002',
      feeId: 'F002',
      studentId: '176',
      amount: 2000,
      date: '2024-11-20',
      paymentMode: 'card',
      receiptNo: 'RCPT002',
      referenceNo: 'TXN0012346',
      status: 'Completed'
    },
    {
      id: 'P003',
      feeId: 'F003',
      studentId: '169',
      amount: 10000,
      date: '2024-11-18',
      paymentMode: 'upi',
      receiptNo: 'RCPT003',
      referenceNo: 'TXN0012347',
      status: 'Completed'
    }
  ];

  db.set(store.users, users);
  db.set(store.students, students);
  db.set(store.attendance, attendance);
  db.set(store.fees, fees);
  db.set(store.payments, payments);
  setSeeded(true);
}

function ensureSeed(){ 
  if(!seeded()){ 
    seedDemo(); 
  } else {
    initFeeStores();
  }
}

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

// Sections — includes manageTeachers
const sections = ['teacherHome','manageStudents','takeAttendance','feeMonitoring','reports','manageTeachers','studentHome','studentFees'];

function show(el){ el.classList.remove('hide') }
function hide(el){ el.classList.add('hide') }
function setActive(id){ 
  sections.forEach(s=> hide($('#'+s))); 
  show($('#'+id)); 
  $$('.nav .item').forEach(i=> i.classList.toggle('active', i.dataset.target===id)); 
}

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

  // Admin extra stat: teacher count
  if(isAdmin(auth.current)){
    const users = db.get(store.users, []);
    $('#tStatTeachers').textContent = users.filter(u=>u.role==='teacher').length;
  }
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
  const cls = sClass.value;
  const email = sEmail.value.trim();
  const pass = sPass.value.trim() || Math.random().toString(36).slice(2,8);
  if(!name || !roll || !cls){ alert('Name, Roll and Class are required'); return }
  const students = db.get(store.students, []);
  const id = 'S' + roll.padStart(4,'0');
  if(students.some(x=>x.id===id)){ alert('A student with this roll already exists.'); return }
  students.push({ id, name, roll, class: cls, email, password: pass });
  db.set(store.students, students);
  sName.value = ''; sRoll.value = ''; sClass.value = ''; sEmail.value = ''; sPass.value = '';
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
      const attendance = db.get(store.attendance, []);
      db.set(store.attendance, attendance.filter(r=>r.studentId!==id));
      const fees = db.get(store.fees, []);
      db.set(store.fees, fees.filter(f=>f.studentId!==id));
      const payments = db.get(store.payments, []);
      db.set(store.payments, payments.filter(p=>p.studentId!==id));
      listStudents(studentSearch.value); refreshClassFilter(); refreshTeacherStats();
    }
  }else if(act==='reset'){
    const npw = prompt('Enter new password for '+students[idx].name, 'pass123');
    if(npw){ students[idx].password=npw; db.set(store.students, students); alert('Password updated.') }
  }
})

studentSearch.addEventListener('input', e=> listStudents(e.target.value));

$('#exportStudentsBtn').addEventListener('click', ()=>{
  const students = db.get(store.students, []);
  const rows = [['ID','Name','Roll','Class','Email']].concat(students.map(s=>[s.id,s.name,s.roll,s.class,s.email||'']))
  downloadCSV(rows, 'students.csv');
})

/* =====================
   Manage Teachers (Admin only)
   ===================== */
function listTeachers(filter=''){
  const users = db.get(store.users, []).filter(u=>u.role==='teacher');
  const q = filter.toLowerCase();
  const filtered = users.filter(u=> [u.name, u.email].some(x=> String(x).toLowerCase().includes(q)));

  const tbody = $('#teachersTbody');
  tbody.innerHTML = '';
  filtered.forEach((t, i)=>{
    const adminFlag = t.id === ADMIN_ID;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>${t.name}</td>
      <td>${t.email}</td>
      <td><code>${t.id}</code></td>
      <td>
        ${adminFlag
          ? '<span class="chip admin">Admin</span>'
          : '<span class="chip ok">Teacher</span>'
        }
      </td>
      <td class="row">
        ${adminFlag
          ? '<span style="color:var(--muted); font-size:.9rem;">Protected</span>'
          : `<button class="btn small" data-tact="reset-t" data-tid="${t.id}">Reset PW</button>
             <button class="btn small danger" data-tact="del-t" data-tid="${t.id}">Delete</button>`
        }
      </td>
    `;
    tbody.appendChild(tr);
  });
}

$('#addTeacherBtn').addEventListener('click', ()=>{
  const name = $('#tName').value.trim();
  const email = $('#tEmail').value.trim();
  const pass = $('#tPass').value.trim();
  if(!name || !email || !pass){ alert('Name, Email/Login ID and Password are required.'); return }
  const users = db.get(store.users, []);
  if(users.some(u=> u.email.toLowerCase()===email.toLowerCase())){ alert('A teacher with this email/login already exists.'); return }
  const newId = 'T' + Math.random().toString(36).slice(2,6).toUpperCase();
  users.push({ id: newId, role:'teacher', email, password: pass, name });
  db.set(store.users, users);
  $('#tName').value=''; $('#tEmail').value=''; $('#tPass').value='';
  listTeachers($('#teacherSearch').value);
  refreshTeacherStats();
  alert(`Teacher "${name}" added successfully!\nLogin ID: ${email}\nPassword: ${pass}`);
})

$('#teacherSearch').addEventListener('input', e=> listTeachers(e.target.value));

$('#teachersTbody').addEventListener('click', (e)=>{
  const btn = e.target.closest('button'); if(!btn) return;
  const tid = btn.dataset.tid; const act = btn.dataset.tact;
  if(!tid) return;
  const users = db.get(store.users, []);
  const idx = users.findIndex(u=>u.id===tid);
  if(idx===-1) return;
  if(act==='del-t'){
    if(tid===ADMIN_ID){ alert('The admin account cannot be deleted.'); return }
    if(confirm(`Delete teacher "${users[idx].name}"?`)){
      users.splice(idx,1); db.set(store.users, users);
      listTeachers($('#teacherSearch').value); refreshTeacherStats();
    }
  }else if(act==='reset-t'){
    if(tid===ADMIN_ID){ alert('Use the admin password reset flow.'); return }
    const npw = prompt('Enter new password for '+users[idx].name, 'teacher123');
    if(npw){ users[idx].password=npw; db.set(store.users, users); alert('Password updated.') }
  }
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

$('#exportAttendanceBtn').addEventListener('click', ()=>{
  const month = $('#repMonth').value || monISO();
  const rows = buildAttendanceCSV(month);
  downloadCSV(rows, `attendance_${month}.csv`);
})

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
  att.sort((a,b)=> a.date.localeCompare(b.date));
  for(const r of att){
    if(r.status==='P') P++; else A++;
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
   Fee Management
   ===================== */
let editingFeeId = null;
let selectedFeeForPayment = null;

function populateStudentDropdown() {
  const students = db.get(store.students, []);
  const select = $('#feeStudentSelect');
  select.innerHTML = '<option value="">Select Student</option>';
  students.forEach(student => {
    const option = document.createElement('option');
    option.value = student.id;
    option.textContent = `${student.name} (${student.roll}) - ${student.class}`;
    select.appendChild(option);
  });
}

function populateFeeClassFilter() {
  const students = db.get(store.students, []);
  const classes = [...new Set(students.map(s => s.class))].sort();
  const select = $('#feeClassFilter');
  select.innerHTML = '<option value="">All Classes</option>';
  classes.forEach(cls => {
    const option = document.createElement('option');
    option.value = cls;
    option.textContent = cls;
    select.appendChild(option);
  });
}

function renderFeeTable() {
  const fees = db.get(store.fees, []);
  const classFilter = $('#feeClassFilter').value;
  const statusFilter = $('#feeStatusFilter').value;
  const searchQuery = $('#feeSearch').value.toLowerCase();

  let filteredFees = fees;
  
  if (classFilter) filteredFees = filteredFees.filter(fee => fee.className === classFilter);
  if (statusFilter) filteredFees = filteredFees.filter(fee => fee.status === statusFilter);
  if (searchQuery) filteredFees = filteredFees.filter(fee => 
    fee.studentName.toLowerCase().includes(searchQuery) || fee.rollNo.toLowerCase().includes(searchQuery)
  );

  const tbody = $('#feeTbody');
  tbody.innerHTML = '';

  filteredFees.forEach((fee, index) => {
    const dueAmount = fee.amount - fee.paidAmount;
    const dueDate = new Date(fee.dueDate);
    const today = new Date();
    const isOverdue = dueDate < today && fee.status !== 'Paid';
    
    let statusChip = '';
    if (fee.status === 'Paid') {
      statusChip = '<span class="chip ok">Paid</span>';
    } else if (fee.status === 'Partial') {
      statusChip = '<span class="chip warn">Partial</span>';
    } else {
      statusChip = isOverdue ? 
        '<span class="chip bad">Overdue</span>' : 
        '<span class="chip warn">Pending</span>';
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${fee.studentName}</td>
      <td>${fee.rollNo}</td>
      <td>${fee.className}</td>
      <td>${fee.feeType}</td>
      <td>₹${fee.amount.toLocaleString()}</td>
      <td>₹${fee.paidAmount.toLocaleString()}</td>
      <td class="${isOverdue ? 'bad' : ''}">${fee.dueDate}</td>
      <td>${statusChip}</td>
      <td class="row">
        <button class="btn small" data-act="record-payment" data-id="${fee.id}">Record Payment</button>
        <button class="btn small" data-act="edit-fee" data-id="${fee.id}">Edit</button>
        <button class="btn small danger" data-act="delete-fee" data-id="${fee.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openFeeModal(fee = null) {
  editingFeeId = fee ? fee.id : null;
  
  if (fee) {
    $('#feeStudentSelect').value = fee.studentId;
    $('#feeType').value = fee.feeType;
    $('#feeAmount').value = fee.amount;
    $('#feeDueDate').value = fee.dueDate;
    $('#feeAcademicYear').value = fee.academicYear;
    $('#feeSemester').value = fee.semester;
    $('#feeStatus').value = fee.status;
    $('#feePaidAmount').value = fee.paidAmount;
    $('#feeNotes').value = fee.notes || '';
    $('#feeStudentSelect').disabled = true;
  } else {
    $('#feeStudentSelect').value = '';
    $('#feeType').value = 'Tuition';
    $('#feeAmount').value = '';
    $('#feeDueDate').value = new Date().toISOString().slice(0, 10);
    $('#feeAcademicYear').value = '2024-25';
    $('#feeSemester').value = 'Semester 1';
    $('#feeStatus').value = 'Pending';
    $('#feePaidAmount').value = '0';
    $('#feeNotes').value = '';
    $('#feeStudentSelect').disabled = false;
  }
  
  $('#addFeeModal').classList.remove('hide');
}

function saveFeeRecord() {
  const studentId = $('#feeStudentSelect').value;
  if (!studentId) { alert('Please select a student'); return }

  const students = db.get(store.students, []);
  const student = students.find(s => s.id === studentId);
  if (!student) { alert('Student not found'); return }

  const feeType = $('#feeType').value;
  const amount = parseFloat($('#feeAmount').value);
  const paidAmount = parseFloat($('#feePaidAmount').value) || 0;
  const dueDate = $('#feeDueDate').value;
  const academicYear = $('#feeAcademicYear').value;
  const semester = $('#feeSemester').value;
  const status = $('#feeStatus').value;
  const notes = $('#feeNotes').value;

  if (!amount || amount <= 0) { alert('Please enter a valid amount'); return }
  if (paidAmount > amount) { alert('Paid amount cannot exceed total amount'); return }

  const fees = db.get(store.fees, []);
  let feeId = editingFeeId;
  
  if (editingFeeId) {
    const index = fees.findIndex(f => f.id === editingFeeId);
    if (index !== -1) {
      fees[index] = { ...fees[index], feeType, amount, paidAmount, dueDate, academicYear, semester, status, notes };
    }
  } else {
    feeId = 'F' + Math.random().toString(36).slice(2, 8).toUpperCase();
    fees.push({
      id: feeId, studentId: student.id, studentName: student.name, rollNo: student.roll,
      className: student.class, feeType, amount, paidAmount, dueDate, academicYear, semester, status, notes,
      createdAt: todayISO()
    });
  }

  db.set(store.fees, fees);
  
  if (paidAmount > 0) {
    const payments = db.get(store.payments, []);
    payments.push({
      id: 'P' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      feeId: feeId, studentId: student.id, amount: paidAmount, date: todayISO(),
      paymentMode: 'Manual Entry',
      receiptNo: 'RCPT' + Math.random().toString(36).slice(2, 6).toUpperCase(),
      referenceNo: 'MANUAL' + Date.now(), status: 'Completed'
    });
    db.set(store.payments, payments);
  }

  closeFeeModal();
  renderFeeTable();
  refreshFeeStats();
}

function closeFeeModal() {
  $('#addFeeModal').classList.add('hide');
  editingFeeId = null;
}

function openPaymentModal(feeId) {
  const fees = db.get(store.fees, []);
  const fee = fees.find(f => f.id === feeId);
  if (!fee) { alert('Fee record not found'); return }

  selectedFeeForPayment = fee;
  
  $('#paymentStudent').value = `${fee.studentName} (${fee.rollNo})`;
  $('#paymentFeeType').value = fee.feeType;
  $('#paymentTotalAmount').value = `₹${fee.amount.toLocaleString()}`;
  $('#paymentAlreadyPaid').value = `₹${fee.paidAmount.toLocaleString()}`;
  $('#paymentDueAmount').value = `₹${(fee.amount - fee.paidAmount).toLocaleString()}`;
  $('#paymentAmount').value = fee.amount - fee.paidAmount;
  $('#paymentDate').value = todayISO();
  $('#paymentReference').value = '';
  $('#paymentNotes').value = '';
  
  $$('#paymentModal .payment-method').forEach(el => el.classList.remove('selected'));
  $('#paymentMethod').value = '';
  
  $('#paymentModal').classList.remove('hide');
}

function closePaymentModal() {
  $('#paymentModal').classList.add('hide');
  selectedFeeForPayment = null;
}

function recordPayment() {
  if (!selectedFeeForPayment) return;
  
  const paymentAmount = parseFloat($('#paymentAmount').value);
  const paymentMethod = $('#paymentMethod').value;
  const paymentDate = $('#paymentDate').value;
  const referenceNo = $('#paymentReference').value.trim();
  const notes = $('#paymentNotes').value.trim();
  
  if (!paymentAmount || paymentAmount <= 0) { alert('Please enter a valid payment amount'); return }
  if (!paymentMethod) { alert('Please select a payment method'); return }
  
  const dueAmount = selectedFeeForPayment.amount - selectedFeeForPayment.paidAmount;
  if (paymentAmount > dueAmount) { alert(`Payment amount cannot exceed due amount of ₹${dueAmount.toLocaleString()}`); return }
  
  const fees = db.get(store.fees, []);
  const feeIndex = fees.findIndex(f => f.id === selectedFeeForPayment.id);
  if (feeIndex !== -1) {
    fees[feeIndex].paidAmount += paymentAmount;
    fees[feeIndex].status = fees[feeIndex].paidAmount === fees[feeIndex].amount ? 'Paid' : 'Partial';
  }
  
  const payments = db.get(store.payments, []);
  const receiptNo = 'RCPT' + Math.random().toString(36).slice(2, 6).toUpperCase();
  payments.push({
    id: 'P' + Math.random().toString(36).slice(2, 8).toUpperCase(),
    feeId: selectedFeeForPayment.id, studentId: selectedFeeForPayment.studentId,
    amount: paymentAmount, date: paymentDate, paymentMode: paymentMethod,
    receiptNo, referenceNo: referenceNo || 'N/A', status: 'Completed', notes
  });
  
  db.set(store.fees, fees);
  db.set(store.payments, payments);
  
  closePaymentModal();
  renderFeeTable();
  refreshFeeStats();
  
  alert(`Payment of ₹${paymentAmount.toLocaleString()} recorded successfully!\nReceipt No: ${receiptNo}`);
}

function deleteFeeRecord(feeId) {
  if (!confirm('Are you sure you want to delete this fee record?')) return;
  db.set(store.fees, db.get(store.fees, []).filter(f => f.id !== feeId));
  db.set(store.payments, db.get(store.payments, []).filter(p => p.feeId !== feeId));
  renderFeeTable();
  refreshFeeStats();
}

function refreshFeeStats() {
  const fees = db.get(store.fees, []);
  let totalAmount = 0, totalPaid = 0, pendingFees = 0, overdueFees = 0;
  const today = new Date();
  fees.forEach(fee => {
    totalAmount += fee.amount;
    totalPaid += fee.paidAmount;
    if (fee.status !== 'Paid') {
      pendingFees++;
      if (new Date(fee.dueDate) < today) overdueFees++;
    }
  });
}

function generateFeeReport() {
  const fees = db.get(store.fees, []);
  const students = db.get(store.students, []);
  const payments = db.get(store.payments, []);
  const reportData = [];
  
  const classSummary = {};
  fees.forEach(fee => {
    if (!classSummary[fee.className]) classSummary[fee.className] = { totalAmount: 0, totalPaid: 0, students: new Set() };
    classSummary[fee.className].totalAmount += fee.amount;
    classSummary[fee.className].totalPaid += fee.paidAmount;
    classSummary[fee.className].students.add(fee.studentId);
  });
  
  reportData.push(['FEE MONITORING REPORT', '', '', '', '', '']);
  reportData.push(['Generated on:', new Date().toLocaleDateString(), '', '', '', '']);
  reportData.push(['', '', '', '', '', '']);
  reportData.push(['CLASS-WISE SUMMARY', '', '', '', '', '']);
  reportData.push(['Class', 'Students', 'Total Fees (₹)', 'Paid (₹)', 'Due (₹)', 'Collection %']);
  
  for (const [className, data] of Object.entries(classSummary)) {
    const dueAmount = data.totalAmount - data.totalPaid;
    const pct = data.totalAmount > 0 ? Math.round((data.totalPaid / data.totalAmount) * 100) : 0;
    reportData.push([className, data.students.size, data.totalAmount.toLocaleString(), data.totalPaid.toLocaleString(), dueAmount.toLocaleString(), pct + '%']);
  }
  
  reportData.push(['', '', '', '', '', '']);
  reportData.push(['DETAILED FEE LIST', '', '', '', '', '']);
  reportData.push(['Student Name', 'Roll No', 'Class', 'Fee Type', 'Amount (₹)', 'Paid (₹)', 'Due (₹)', 'Status', 'Due Date']);
  
  fees.forEach(fee => {
    reportData.push([fee.studentName, fee.rollNo, fee.className, fee.feeType, fee.amount.toLocaleString(), fee.paidAmount.toLocaleString(), (fee.amount-fee.paidAmount).toLocaleString(), fee.status, fee.dueDate]);
  });
  
  const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  reportData.push(['', '', '', '', '', '', '', '', '']);
  reportData.push(['PAYMENT SUMMARY (Last 30 days)', '', '', '', '', '']);
  reportData.push(['Date', 'Student', 'Amount (₹)', 'Payment Mode', 'Receipt No', 'Reference No', 'Status']);
  payments.filter(p => new Date(p.date) >= thirtyDaysAgo).forEach(payment => {
    const student = students.find(s => s.id === payment.studentId);
    reportData.push([payment.date, student ? student.name : payment.studentId, payment.amount.toLocaleString(), payment.paymentMode, payment.receiptNo, payment.referenceNo, payment.status]);
  });
  
  downloadCSV(reportData, `fee_report_${todayISO()}.csv`);
}

/* =====================
   Student Fee View
   ===================== */
let selectedFeesToPay = [];

function renderStudentFeeView() {
  const user = auth.current;
  if (!user || user.role !== 'student') return;
  
  const fees = db.get(store.fees, []).filter(fee => fee.studentId === user.id);
  const payments = db.get(store.payments, []).filter(payment => payment.studentId === user.id);
  
  let totalFees = 0, paidFees = 0, pendingCount = 0;
  fees.forEach(fee => { totalFees += fee.amount; paidFees += fee.paidAmount; if (fee.status !== 'Paid') pendingCount++; });
  
  $('#stuTotalFees').textContent = `₹${totalFees.toLocaleString()}`;
  $('#stuPaidFees').textContent = `₹${paidFees.toLocaleString()}`;
  $('#stuDueFees').textContent = `₹${(totalFees - paidFees).toLocaleString()}`;
  $('#stuPendingCount').textContent = pendingCount;
  
  const feeTbody = $('#stuFeeTbody');
  feeTbody.innerHTML = '';
  fees.forEach(fee => {
    const dueAmount = fee.amount - fee.paidAmount;
    const dueDate = new Date(fee.dueDate);
    const today = new Date();
    const isOverdue = dueDate < today && fee.status !== 'Paid';
    let statusChip = fee.status === 'Paid' ? '<span class="chip ok">Paid</span>' : fee.status === 'Partial' ? '<span class="chip warn">Partial</span>' : (isOverdue ? '<span class="chip bad">Overdue</span>' : '<span class="chip warn">Pending</span>');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${fee.feeType}</td><td>${fee.academicYear}</td><td>${fee.semester}</td>
      <td>₹${fee.amount.toLocaleString()}</td><td>₹${fee.paidAmount.toLocaleString()}</td>
      <td class="${dueAmount > 0 ? 'bad' : ''}">₹${dueAmount.toLocaleString()}</td>
      <td class="${isOverdue ? 'bad' : ''}">${fee.dueDate}</td>
      <td>${statusChip}</td>
      <td>${fee.status !== 'Paid' ? `<button class="btn small" data-pay-fee="${fee.id}">Pay Now</button>` : 'Paid'}</td>
    `;
    feeTbody.appendChild(tr);
  });
  
  const paymentTbody = $('#stuPaymentTbody');
  paymentTbody.innerHTML = '';
  payments.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(payment => {
    const fee = fees.find(f => f.id === payment.feeId);
    let pm = payment.paymentMode;
    if(pm==='cash') pm='💵 Cash'; else if(pm==='card') pm='💳 Card'; else if(pm==='online') pm='🌐 Online'; else if(pm==='upi') pm='📱 UPI'; else if(pm==='cheque') pm='📄 Cheque'; else if(pm==='bank_transfer') pm='🏦 Bank Transfer';
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${payment.date}</td><td>${fee ? fee.feeType : 'N/A'}</td><td>₹${payment.amount.toLocaleString()}</td><td>${pm}</td><td><code>${payment.receiptNo}</code></td><td>${payment.referenceNo || 'N/A'}</td><td><span class="chip ok">${payment.status}</span></td>`;
    paymentTbody.appendChild(tr);
  });
  
  renderPayFeesSection(fees);
}

function renderPayFeesSection(fees) {
  const pendingFees = fees.filter(fee => fee.status !== 'Paid');
  const payFeesList = $('#payFeesList');
  payFeesList.innerHTML = '';
  if (pendingFees.length === 0) {
    payFeesList.innerHTML = '<p style="text-align:center; color:var(--muted); padding:20px;">No pending fees to pay.</p>';
    return;
  }
  pendingFees.forEach(fee => {
    const dueAmount = fee.amount - fee.paidAmount;
    const isOverdue = new Date(fee.dueDate) < new Date();
    const feeItem = document.createElement('div');
    feeItem.className = 'row';
    feeItem.style.cssText = 'padding:12px; border-bottom:1px solid var(--border); align-items:center';
    feeItem.innerHTML = `
      <div style="flex:1"><div style="font-weight:600">${fee.feeType}</div><div style="font-size:0.9rem;color:var(--muted)">Due: ${fee.dueDate}${isOverdue?' (Overdue)':''}</div></div>
      <div style="text-align:right"><div style="font-weight:600">₹${dueAmount.toLocaleString()}</div><div style="font-size:0.9rem;color:var(--muted)">Total: ₹${fee.amount.toLocaleString()}</div></div>
      <div><input type="checkbox" class="fee-checkbox" data-fee-id="${fee.id}" data-amount="${dueAmount}" style="margin-left:12px"></div>
    `;
    payFeesList.appendChild(feeItem);
  });
  $$('.fee-checkbox').forEach(cb => cb.addEventListener('change', updateSelectedFees));
}

function updateSelectedFees() {
  selectedFeesToPay = [];
  let totalAmount = 0;
  $$('.fee-checkbox:checked').forEach(cb => { selectedFeesToPay.push({ feeId: cb.dataset.feeId, amount: parseFloat(cb.dataset.amount) }); totalAmount += parseFloat(cb.dataset.amount); });
  const btn = $('#proceedToPaymentBtn');
  if (selectedFeesToPay.length > 0) { btn.textContent = `Proceed to Pay (₹${totalAmount.toLocaleString()})`; btn.disabled = false; }
  else { btn.textContent = 'Proceed to Payment'; btn.disabled = true; }
}

/* =====================
   Payment Processing
   ===================== */
function openPaymentProcessing() {
  if (selectedFeesToPay.length === 0) { alert('Please select at least one fee to pay'); return }
  const totalAmount = selectedFeesToPay.reduce((sum, fee) => sum + fee.amount, 0);
  $('#totalPaymentAmount').value = `₹${totalAmount.toLocaleString()}`;
  $$('#paymentProcessingModal .payment-method').forEach(el => el.classList.remove('selected'));
  $('#selectedPaymentMethod').value = '';
  ['#cardPaymentForm','#upiPaymentForm','#onlineBankingForm','#bankTransferForm','#paymentSuccessMessage'].forEach(s => $(s).classList.add('hide'));
  ['#cardNumber','#cardExpiry','#cardHolderName'].forEach(s => $(s).value = '');
  $('#cardCVV').value=''; $('#upiId').value=''; $('#bankSelect').value='';
  $('#paymentProcessingModal').classList.remove('hide');
  $('#confirmPaymentBtn').textContent = 'Confirm Payment';
  $('#confirmPaymentBtn').disabled = false;
  $('#confirmPaymentBtn').onclick = processPayment;
}

function closePaymentProcessing() {
  $('#paymentProcessingModal').classList.add('hide');
  selectedFeesToPay = [];
  $$('.fee-checkbox').forEach(cb => cb.checked = false);
  updateSelectedFees();
}

function processPayment() {
  const paymentMethod = $('#selectedPaymentMethod').value;
  const totalAmount = selectedFeesToPay.reduce((sum, fee) => sum + fee.amount, 0);
  if (!paymentMethod) { alert('Please select a payment method'); return }
  if (paymentMethod === 'card') {
    if (!$('#cardNumber').value.trim() || !$('#cardExpiry').value.trim() || !$('#cardCVV').value.trim() || !$('#cardHolderName').value.trim()) { alert('Please fill all card details'); return }
    if ($('#cardNumber').value.replace(/\s/g, '').length !== 16) { alert('Please enter a valid 16-digit card number'); return }
  } else if (paymentMethod === 'upi') {
    if (!$('#upiId').value.trim()) { alert('Please enter UPI ID'); return }
    if (!$('#upiId').value.includes('@')) { alert('Please enter a valid UPI ID (e.g., name@upi)'); return }
  } else if (paymentMethod === 'online') {
    if (!$('#bankSelect').value) { alert('Please select a bank'); return }
  }
  
  $('#confirmPaymentBtn').textContent = 'Processing...';
  $('#confirmPaymentBtn').disabled = true;
  
  setTimeout(() => {
    const transactionId = 'TXN' + Date.now();
    const receiptNo = 'RCPT' + Math.random().toString(36).slice(2, 8).toUpperCase();
    selectedFeesToPay.forEach(feeData => {
      const fees = db.get(store.fees, []);
      const feeIndex = fees.findIndex(f => f.id === feeData.feeId);
      if (feeIndex !== -1) {
        fees[feeIndex].paidAmount += feeData.amount;
        fees[feeIndex].status = fees[feeIndex].paidAmount === fees[feeIndex].amount ? 'Paid' : 'Partial';
        const payments = db.get(store.payments, []);
        payments.push({
          id: 'P' + Math.random().toString(36).slice(2, 8).toUpperCase(),
          feeId: feeData.feeId, studentId: auth.current.id, amount: feeData.amount,
          date: todayISO(), paymentMode: paymentMethod, receiptNo, referenceNo: transactionId,
          status: 'Completed', notes: `Paid via ${paymentMethod}`
        });
        db.set(store.fees, fees);
        db.set(store.payments, payments);
      }
    });
    $('#paidAmountSuccess').textContent = totalAmount.toLocaleString();
    $('#transactionId').textContent = transactionId;
    $('#receiptNumber').textContent = receiptNo;
    $$('#paymentProcessingContent > div').forEach(el => { if (el.id !== 'paymentSuccessMessage') el.classList.add('hide'); });
    $('#paymentSuccessMessage').classList.remove('hide');
    $('#confirmPaymentBtn').classList.add('hide');
    $('#cancelProcessingBtn').classList.add('hide');
    setTimeout(() => { renderStudentFeeView(); }, 1000);
  }, 2000);
}

function printReceipt() {
  const receiptContent = `<html><head><title>Payment Receipt</title><style>body{font-family:Arial,sans-serif;padding:20px}.receipt{max-width:500px;margin:0 auto}.header{text-align:center;margin-bottom:20px}.details{margin:20px 0}.detail-row{display:flex;justify-content:space-between;margin:8px 0}.footer{margin-top:30px;text-align:center}@media print{button{display:none}}</style></head><body><div class="receipt"><div class="header"><h2>UGIverse University</h2><h3>Fee Payment Receipt</h3></div><div class="details"><div class="detail-row"><span>Receipt No:</span><span>${$('#receiptNumber').textContent}</span></div><div class="detail-row"><span>Date:</span><span>${new Date().toLocaleDateString()}</span></div><div class="detail-row"><span>Student:</span><span>${auth.current.name}</span></div><div class="detail-row"><span>Roll No:</span><span>${auth.current.roll || auth.current.id}</span></div><div class="detail-row"><span>Amount Paid:</span><span>₹${$('#paidAmountSuccess').textContent}</span></div><div class="detail-row"><span>Transaction ID:</span><span>${$('#transactionId').textContent}</span></div><div class="detail-row"><span>Payment Method:</span><span>${$('#selectedPaymentMethod').value}</span></div></div><div class="footer"><p>Thank you for your payment!</p><p>This is a computer-generated receipt.</p><button onclick="window.print()">Print Receipt</button><button onclick="window.close()">Close</button></div></div></body></html>`;
  const w = window.open('', '_blank'); w.document.write(receiptContent); w.document.close();
}

function downloadFeeReceipt() {
  const user = auth.current; if (!user || user.role !== 'student') return;
  const payments = db.get(store.payments, []).filter(p => p.studentId === user.id);
  const latestPayment = payments.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  if (!latestPayment) { alert('No payment records found'); return }
  const fee = db.get(store.fees, []).find(f => f.id === latestPayment.feeId);
  let pm = latestPayment.paymentMode;
  if(pm==='cash') pm='Cash'; else if(pm==='card') pm='Credit/Debit Card'; else if(pm==='online') pm='Online Banking'; else if(pm==='upi') pm='UPI'; else if(pm==='cheque') pm='Cheque'; else if(pm==='bank_transfer') pm='Bank Transfer';
  downloadCSV([
    ['UGIverse - Fee Payment Receipt','','','',''],['','','','',''],
    ['Receipt No:',latestPayment.receiptNo,'','Date:',latestPayment.date],
    ['Student Name:',user.name,'','Roll No:',user.roll||user.id],
    ['Fee Type:',fee?fee.feeType:'N/A','','Academic Year:',fee?fee.academicYear:'N/A'],
    ['','','','',''],['Amount Paid (₹):',latestPayment.amount.toLocaleString(),'','',''],
    ['Payment Mode:',pm,'','Status:',latestPayment.status],
    ['Transaction ID:',latestPayment.referenceNo,'','',''],
    ['','','','',''],['Authorized Signature','','','Student Signature',''],
    ['','','','',''],['Note: This is a computer-generated receipt.','','','','']
  ], `fee_receipt_${latestPayment.receiptNo}.csv`);
}

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
  const u = auth.current;
  userName.textContent = u.name;

  // Role pill — show "Admin" badge for admin
  if(isAdmin(u)){
    userRole.textContent = 'Admin';
    userRole.classList.add('admin-pill');
  } else {
    userRole.textContent = u.role;
    userRole.classList.remove('admin-pill');
  }

  if(u.role==='teacher'){
    // Show common teacher nav items
    $('#navTeacherHome').classList.remove('hide');
    $('#navManageStudents').classList.remove('hide');
    $('#navFeeMonitoring').classList.remove('hide');
    $('#navReports').classList.remove('hide');
    $('#navStudentHome').classList.add('hide');
    $('#navStudentFees').classList.add('hide');

    if(isAdmin(u)){
      // Admin: show Manage Teachers, hide Take Attendance & Quick Take
      $('#navManageTeachers').classList.remove('hide');
      $('#navTakeAttendance').classList.add('hide');
      $('#quickTakeBtn').classList.add('hide');
      // Show admin extra stats
      $('#adminExtraStats').classList.remove('hide');
      setActive('teacherHome');
    } else {
      // Regular teacher: show Take Attendance, hide Manage Teachers
      $('#navTakeAttendance').classList.remove('hide');
      $('#navManageTeachers').classList.add('hide');
      $('#quickTakeBtn').classList.remove('hide');
      $('#adminExtraStats').classList.add('hide');
      setActive('teacherHome');
      attDate.value = todayISO();
      renderAttendanceTable();
    }

    refreshTeacherStats();
    listStudents();
    refreshClassFilter();
    $('#repMonth').value = monISO();
    renderReports();
    populateStudentDropdown();
    populateFeeClassFilter();
    renderFeeTable();
    refreshFeeStats();

    // Pre-load teacher list if admin
    if(isAdmin(u)) listTeachers();

  }else{
    $('#navTeacherHome').classList.add('hide');
    $('#navManageStudents').classList.add('hide');
    $('#navTakeAttendance').classList.add('hide');
    $('#navFeeMonitoring').classList.add('hide');
    $('#navReports').classList.add('hide');
    $('#navManageTeachers').classList.add('hide');
    $('#navStudentHome').classList.remove('hide');
    $('#navStudentFees').classList.remove('hide');
    setActive('studentHome');
    $('#stuMonth').value = monISO();
    renderStudentHome();
    renderStudentFeeView();
  }
}

function leaveDashboard(){
  show(authPage); hide(dash); hide(navLogoutBtn); refreshLandingStats(); loginPass.value='';
}

/* =====================
   Role Selector (3 buttons)
   ===================== */
let selectedRole = 'teacher'; // default

function selectRole(role) {
  selectedRole = role;
  // Update active button
  $$('.role-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.role === role));

  // Sync hidden radio for legacy compat (admin treated as teacher login)
  if (role === 'student') {
    $('#radioStudent').checked = true;
  } else {
    $('#radioTeacher').checked = true;
  }

  // Update placeholders & pre-fill for admin
  const idInput = $('#loginId');
  const passInput = $('#loginPass');
  const label = $('#loginIdLabel');

  if (role === 'admin') {
    label.textContent = 'Email / ID';
    idInput.value = 'Jitendra Kumar';
    passInput.value = 'teacher123';
    idInput.placeholder = 'Jitendra Kumar';
    passInput.placeholder = 'teacher123';
  } else if (role === 'teacher') {
    label.textContent = 'Email / ID';
    idInput.value = '';
    passInput.value = '';
    idInput.placeholder = 'Naman Jaiswal';
    passInput.placeholder = 'teacher123';
  } else {
    label.textContent = 'Email / ID';
    idInput.value = '';
    passInput.value = '';
    idInput.placeholder = 'mrmalviyaji@gmail.com';
    passInput.placeholder = 'om@123';
  }
  idInput.focus();
  $('#loginMsg').textContent = '';
}

// Override login handler to use selectedRole
loginBtn.addEventListener('click', ()=>{
  const id = loginId.value.trim();
  const pw = loginPass.value.trim();
  if(!id || !pw){ loginMsg.textContent = 'Please fill all fields.'; return }

  // Admin: force teacher login and verify it's Jitendra Kumar's account
  const loginRoleForAuth = selectedRole === 'student' ? 'student' : 'teacher';
  const res = auth.login(id, pw, loginRoleForAuth);

  if(res.ok){
    // If "admin" button was selected, verify the user is actually the admin
    if(selectedRole === 'admin' && !isAdmin(res.user)){
      loginMsg.textContent = 'This account is not the Admin.';
      auth.logout();
      return;
    }
    loginMsg.textContent = '';
    enterDashboard();
  } else {
    loginMsg.textContent = 'Invalid credentials.';
  }
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
  if(target==='feeMonitoring'){ populateStudentDropdown(); populateFeeClassFilter(); renderFeeTable(); refreshFeeStats(); }
  if(target==='studentFees') renderStudentFeeView();
  if(target==='manageTeachers') listTeachers($('#teacherSearch').value);
})

// Quick actions
$('#quickTakeBtn').addEventListener('click', ()=>{ setActive('takeAttendance'); renderAttendanceTable() });
$('#seedBtn').addEventListener('click', ()=>{
  if(confirm('Reset demo data?')){
    seedDemo();
    refreshLandingStats(); refreshTeacherStats(); listStudents(); renderAttendanceTable(); renderReports(); renderStudentFeeView();
    if(isAdmin(auth.current)) listTeachers();
  }
})

// Fee Event Listeners
$('#addFeeRecordBtn').addEventListener('click', () => openFeeModal());
$('#closeFeeModal').addEventListener('click', closeFeeModal);
$('#cancelFeeBtn').addEventListener('click', closeFeeModal);
$('#saveFeeBtn').addEventListener('click', saveFeeRecord);
$('#generateFeeReportBtn').addEventListener('click', generateFeeReport);
$('#feeClassFilter').addEventListener('change', renderFeeTable);
$('#feeStatusFilter').addEventListener('change', renderFeeTable);
$('#feeSearch').addEventListener('input', renderFeeTable);

$('#paymentModal').addEventListener('click', (e) => {
  const methodEl = e.target.closest('.payment-method');
  if (methodEl) {
    $$('#paymentModal .payment-method').forEach(m => m.classList.remove('selected'));
    methodEl.classList.add('selected');
    $('#paymentMethod').value = methodEl.dataset.method;
  }
});

$('#closePaymentModal').addEventListener('click', closePaymentModal);
$('#cancelPaymentBtn').addEventListener('click', closePaymentModal);
$('#savePaymentBtn').addEventListener('click', recordPayment);

$('#feeTbody').addEventListener('click', (e) => {
  const btn = e.target.closest('button'); if (!btn) return;
  const feeId = btn.dataset.id; const action = btn.dataset.act;
  if (action === 'record-payment') openPaymentModal(feeId);
  else if (action === 'edit-fee') { const fee = db.get(store.fees, []).find(f => f.id === feeId); if (fee) openFeeModal(fee); }
  else if (action === 'delete-fee') deleteFeeRecord(feeId);
});

$('#stuFeeTbody').addEventListener('click', (e) => {
  const btn = e.target.closest('button'); if (!btn) return;
  const feeId = btn.dataset.payFee;
  if (feeId) {
    const fee = db.get(store.fees, []).find(f => f.id === feeId);
    if (fee) {
      selectedFeesToPay = [{ feeId: fee.id, amount: fee.amount - fee.paidAmount }];
      $$('.fee-checkbox').forEach(cb => { cb.checked = cb.dataset.feeId === feeId; });
      updateSelectedFees();
      setActive('studentFees');
      $$('.tab').forEach(t => t.classList.remove('active'));
      $('.tab[data-tab="pay"]').classList.add('active');
      $('#currentFeesTable').classList.add('hide');
      $('#paymentHistoryTable').classList.add('hide');
      $('#payFeesTable').classList.remove('hide');
    }
  }
});

$('.tabs').addEventListener('click', (e) => {
  const tab = e.target.closest('.tab'); if (!tab) return;
  $$('.tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  const tabType = tab.dataset.tab;
  $('#currentFeesTable').classList.toggle('hide', tabType !== 'current');
  $('#paymentHistoryTable').classList.toggle('hide', tabType !== 'history');
  $('#payFeesTable').classList.toggle('hide', tabType !== 'pay');
});

$('#downloadFeeReceiptBtn').addEventListener('click', downloadFeeReceipt);
$('#proceedToPaymentBtn').addEventListener('click', openPaymentProcessing);
$('#cancelProcessingBtn').addEventListener('click', closePaymentProcessing);

$('#paymentProcessingModal').addEventListener('click', (e) => {
  const methodEl = e.target.closest('.payment-method');
  if (methodEl) {
    $$('#paymentProcessingModal .payment-method').forEach(m => m.classList.remove('selected'));
    methodEl.classList.add('selected');
    $('#selectedPaymentMethod').value = methodEl.dataset.method;
    ['#cardPaymentForm','#upiPaymentForm','#onlineBankingForm','#bankTransferForm'].forEach(s => $(s).classList.add('hide'));
    if (methodEl.dataset.method === 'card') $('#cardPaymentForm').classList.remove('hide');
    else if (methodEl.dataset.method === 'upi') $('#upiPaymentForm').classList.remove('hide');
    else if (methodEl.dataset.method === 'online') $('#onlineBankingForm').classList.remove('hide');
    else if (methodEl.dataset.method === 'bank_transfer') $('#bankTransferForm').classList.remove('hide');
  }
});

$('#printReceiptBtn').addEventListener('click', printReceipt);
$('#closeSuccessBtn').addEventListener('click', closePaymentProcessing);

/* =====================
   Bootstrap
   ===================== */
ensureSeed();
refreshLandingStats();
todayDate.textContent = new Date().toLocaleDateString();

// Init role selector to default (teacher)
selectRole('teacher');

const existing = auth.load(); 
if(existing){ enterDashboard(); } else { leaveDashboard(); }
