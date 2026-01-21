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
  // Teacher
  const users = [
    { id: 'T001', role:'teacher', email:'Jitendra Kumar', password:'teacher123', name:'Admin Jitendra Kumar' },
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
      paymentMode: 'Online Transfer',
      receiptNo: 'RCPT001',
      status: 'Completed'
    },
    {
      id: 'P002',
      feeId: 'F002',
      studentId: '176',
      amount: 2000,
      date: '2024-11-20',
      paymentMode: 'Cash',
      receiptNo: 'RCPT002',
      status: 'Completed'
    },
    {
      id: 'P003',
      feeId: 'F003',
      studentId: '169',
      amount: 10000,
      date: '2024-11-18',
      paymentMode: 'Cheque',
      receiptNo: 'RCPT003',
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

// Sections
const sections = ['teacherHome','manageStudents','takeAttendance','feeMonitoring','reports','studentHome','studentFees'];

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
      // also remove fees
      const fees = db.get(store.fees, []);
      db.set(store.fees, fees.filter(f=>f.studentId!==id));
      // also remove payments
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
  if (!studentId) {
    alert('Please select a student');
    return;
  }

  const students = db.get(store.students, []);
  const student = students.find(s => s.id === studentId);
  if (!student) {
    alert('Student not found');
    return;
  }

  const feeType = $('#feeType').value;
  const amount = parseFloat($('#feeAmount').value);
  const paidAmount = parseFloat($('#feePaidAmount').value) || 0;
  const dueDate = $('#feeDueDate').value;
  const academicYear = $('#feeAcademicYear').value;
  const semester = $('#feeSemester').value;
  const status = $('#feeStatus').value;
  const notes = $('#feeNotes').value;

  if (!amount || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  if (paidAmount > amount) {
    alert('Paid amount cannot exceed total amount');
    return;
  }

  const fees = db.get(store.fees, []);
  
  if (editingFeeId) {
    const index = fees.findIndex(f => f.id === editingFeeId);
    if (index !== -1) {
      fees[index] = {
        ...fees[index],
        feeType,
        amount,
        paidAmount,
        dueDate,
        academicYear,
        semester,
        status,
        notes
      };
    }
  } else {
    const feeId = 'F' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const newFee = {
      id: feeId,
      studentId: student.id,
      studentName: student.name,
      rollNo: student.roll,
      className: student.class,
      feeType,
      amount,
      paidAmount,
      dueDate,
      academicYear,
      semester,
      status,
      notes,
      createdAt: todayISO()
    };
    fees.push(newFee);
  }

  db.set(store.fees, fees);
  
  if (paidAmount > 0) {
    const payments = db.get(store.payments, []);
    const paymentId = 'P' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const newPayment = {
      id: paymentId,
      feeId: editingFeeId || feeId,
      studentId: student.id,
      amount: paidAmount,
      date: todayISO(),
      paymentMode: 'Manual Entry',
      receiptNo: 'RCPT' + Math.random().toString(36).slice(2, 6).toUpperCase(),
      status: 'Completed'
    };
    payments.push(newPayment);
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

function recordPayment(feeId) {
  const fees = db.get(store.fees, []);
  const fee = fees.find(f => f.id === feeId);
  
  if (!fee) {
    alert('Fee record not found');
    return;
  }

  const paymentAmount = prompt(`Enter payment amount for ${fee.studentName} (Fee: ${fee.feeType})\nTotal: ₹${fee.amount}\nAlready Paid: ₹${fee.paidAmount}\nDue: ₹${fee.amount - fee.paidAmount}`, 
    (fee.amount - fee.paidAmount).toString());
  
  if (!paymentAmount || isNaN(paymentAmount) || parseFloat(paymentAmount) <= 0) {
    alert('Invalid payment amount');
    return;
  }

  const payment = parseFloat(paymentAmount);
  const totalPaid = fee.paidAmount + payment;
  
  if (totalPaid > fee.amount) {
    alert('Payment amount exceeds total fee amount');
    return;
  }

  fee.paidAmount = totalPaid;
  fee.status = totalPaid === fee.amount ? 'Paid' : 'Partial';
  
  const payments = db.get(store.payments, []);
  const paymentId = 'P' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const newPayment = {
    id: paymentId,
    feeId: fee.id,
    studentId: fee.studentId,
    amount: payment,
    date: todayISO(),
    paymentMode: 'Cash',
    receiptNo: 'RCPT' + Math.random().toString(36).slice(2, 6).toUpperCase(),
    status: 'Completed'
  };
  payments.push(newPayment);

  db.set(store.fees, fees);
  db.set(store.payments, payments);
  
  alert(`Payment of ₹${payment.toLocaleString()} recorded successfully!\nReceipt No: ${newPayment.receiptNo}`);
  
  renderFeeTable();
  refreshFeeStats();
}

function deleteFeeRecord(feeId) {
  if (!confirm('Are you sure you want to delete this fee record?')) return;

  const fees = db.get(store.fees, []);
  const updatedFees = fees.filter(f => f.id !== feeId);
  const payments = db.get(store.payments, []);
  const updatedPayments = payments.filter(p => p.feeId !== feeId);
  
  db.set(store.fees, updatedFees);
  db.set(store.payments, updatedPayments);
  
  renderFeeTable();
  refreshFeeStats();
}

function refreshFeeStats() {
  const fees = db.get(store.fees, []);
  let totalAmount = 0;
  let totalPaid = 0;
  let pendingFees = 0;
  let overdueFees = 0;
  const today = new Date();
  
  fees.forEach(fee => {
    totalAmount += fee.amount;
    totalPaid += fee.paidAmount;
    
    if (fee.status !== 'Paid') {
      pendingFees++;
      const dueDate = new Date(fee.dueDate);
      if (dueDate < today) overdueFees++;
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
    if (!classSummary[fee.className]) {
      classSummary[fee.className] = { totalAmount: 0, totalPaid: 0, students: new Set() };
    }
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
    const collectionPercentage = data.totalAmount > 0 ? 
      Math.round((data.totalPaid / data.totalAmount) * 100) : 0;
    
    reportData.push([
      className,
      data.students.size,
      data.totalAmount.toLocaleString(),
      data.totalPaid.toLocaleString(),
      dueAmount.toLocaleString(),
      collectionPercentage + '%'
    ]);
  }
  
  reportData.push(['', '', '', '', '', '']);
  
  reportData.push(['DETAILED FEE LIST', '', '', '', '', '']);
  reportData.push(['Student Name', 'Roll No', 'Class', 'Fee Type', 'Amount (₹)', 'Paid (₹)', 'Due (₹)', 'Status', 'Due Date']);
  
  fees.forEach(fee => {
    const dueAmount = fee.amount - fee.paidAmount;
    reportData.push([
      fee.studentName,
      fee.rollNo,
      fee.className,
      fee.feeType,
      fee.amount.toLocaleString(),
      fee.paidAmount.toLocaleString(),
      dueAmount.toLocaleString(),
      fee.status,
      fee.dueDate
    ]);
  });
  
  reportData.push(['', '', '', '', '', '', '', '', '']);
  
  reportData.push(['PAYMENT SUMMARY (Last 30 days)', '', '', '', '', '']);
  reportData.push(['Date', 'Student', 'Amount (₹)', 'Payment Mode', 'Receipt No', 'Status']);
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentPayments = payments.filter(p => new Date(p.date) >= thirtyDaysAgo);
  recentPayments.forEach(payment => {
    const student = students.find(s => s.id === payment.studentId);
    reportData.push([
      payment.date,
      student ? student.name : payment.studentId,
      payment.amount.toLocaleString(),
      payment.paymentMode,
      payment.receiptNo,
      payment.status
    ]);
  });
  
  downloadCSV(reportData, `fee_report_${todayISO()}.csv`);
}

/* =====================
   Student Fee View
   ===================== */
function renderStudentFeeView() {
  const user = auth.current;
  if (!user || user.role !== 'student') return;
  
  const fees = db.get(store.fees, []).filter(fee => fee.studentId === user.id);
  const payments = db.get(store.payments, []).filter(payment => payment.studentId === user.id);
  
  let totalFees = 0;
  let paidFees = 0;
  let pendingCount = 0;
  
  fees.forEach(fee => {
    totalFees += fee.amount;
    paidFees += fee.paidAmount;
    if (fee.status !== 'Paid') pendingCount++;
  });
  
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
      <td>${fee.feeType}</td>
      <td>${fee.academicYear}</td>
      <td>${fee.semester}</td>
      <td>₹${fee.amount.toLocaleString()}</td>
      <td>₹${fee.paidAmount.toLocaleString()}</td>
      <td class="${dueAmount > 0 ? 'bad' : ''}">₹${dueAmount.toLocaleString()}</td>
      <td class="${isOverdue ? 'bad' : ''}">${fee.dueDate}</td>
      <td>${statusChip}</td>
    `;
    feeTbody.appendChild(tr);
  });
  
  const paymentTbody = $('#stuPaymentTbody');
  paymentTbody.innerHTML = '';
  
  payments.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(payment => {
    const fee = fees.find(f => f.id === payment.feeId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${payment.date}</td>
      <td>${fee ? fee.feeType : 'N/A'}</td>
      <td>₹${payment.amount.toLocaleString()}</td>
      <td>${payment.paymentMode}</td>
      <td><code>${payment.receiptNo}</code></td>
      <td><span class="chip ok">${payment.status}</span></td>
    `;
    paymentTbody.appendChild(tr);
  });
}

function downloadFeeReceipt() {
  const user = auth.current;
  if (!user || user.role !== 'student') return;
  
  const payments = db.get(store.payments, []).filter(p => p.studentId === user.id);
  const latestPayment = payments.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  
  if (!latestPayment) {
    alert('No payment records found');
    return;
  }
  
  const fees = db.get(store.fees, []);
  const fee = fees.find(f => f.id === latestPayment.feeId);
  
  const receiptData = [
    ['UGIverse - Fee Payment Receipt', '', '', '', ''],
    ['', '', '', '', ''],
    ['Receipt No:', latestPayment.receiptNo, '', 'Date:', latestPayment.date],
    ['Student Name:', user.name, '', 'Roll No:', user.roll || user.id],
    ['Fee Type:', fee ? fee.feeType : 'N/A', '', 'Academic Year:', fee ? fee.academicYear : 'N/A'],
    ['', '', '', '', ''],
    ['Amount Paid (₹):', latestPayment.amount.toLocaleString(), '', '', ''],
    ['Payment Mode:', latestPayment.paymentMode, '', 'Status:', latestPayment.status],
    ['', '', '', '', ''],
    ['Authorized Signature', '', '', 'Student Signature', ''],
    ['', '', '', '', ''],
    ['Note: This is a computer-generated receipt.', '', '', '', '']
  ];
  
  downloadCSV(receiptData, `fee_receipt_${latestPayment.receiptNo}.csv`);
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
  const u = auth.current; userName.textContent = u.name; userRole.textContent = u.role;
  if(u.role==='teacher'){
    $('#navTeacherHome').classList.remove('hide');
    $('#navManageStudents').classList.remove('hide');
    $('#navTakeAttendance').classList.remove('hide');
    $('#navFeeMonitoring').classList.remove('hide');
    $('#navReports').classList.remove('hide');
    $('#navStudentHome').classList.add('hide');
    $('#navStudentFees').classList.add('hide');
    setActive('teacherHome'); refreshTeacherStats(); listStudents(); refreshClassFilter();
    attDate.value = todayISO(); renderAttendanceTable();
    $('#repMonth').value = monISO(); renderReports();
    populateStudentDropdown();
    populateFeeClassFilter();
    renderFeeTable();
    refreshFeeStats();
  }else{
    $('#navTeacherHome').classList.add('hide');
    $('#navManageStudents').classList.add('hide');
    $('#navTakeAttendance').classList.add('hide');
    $('#navFeeMonitoring').classList.add('hide');
    $('#navReports').classList.add('hide');
    $('#navStudentHome').classList.remove('hide');
    $('#navStudentFees').classList.remove('hide');
    setActive('studentHome'); $('#stuMonth').value = monISO(); renderStudentHome();
    renderStudentFeeView();
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
  if(target==='feeMonitoring') {
    populateStudentDropdown();
    populateFeeClassFilter();
    renderFeeTable();
    refreshFeeStats();
  }
  if(target==='studentFees') renderStudentFeeView();
})

// Quick actions
$('#quickTakeBtn').addEventListener('click', ()=>{ setActive('takeAttendance'); renderAttendanceTable() });
$('#seedBtn').addEventListener('click', ()=>{ if(confirm('Reset demo data?')){ seedDemo(); refreshLandingStats(); refreshTeacherStats(); listStudents(); renderAttendanceTable(); renderReports(); } })

// Fee Event Listeners
$('#addFeeRecordBtn').addEventListener('click', () => openFeeModal());
$('#closeFeeModal').addEventListener('click', closeFeeModal);
$('#cancelFeeBtn').addEventListener('click', closeFeeModal);
$('#saveFeeBtn').addEventListener('click', saveFeeRecord);
$('#generateFeeReportBtn').addEventListener('click', generateFeeReport);
$('#feeClassFilter').addEventListener('change', renderFeeTable);
$('#feeStatusFilter').addEventListener('change', renderFeeTable);
$('#feeSearch').addEventListener('input', renderFeeTable);
$('#downloadFeeReceiptBtn').addEventListener('click', downloadFeeReceipt);

$('#feeTbody').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const feeId = btn.dataset.id;
  const action = btn.dataset.act;
  if (action === 'record-payment') recordPayment(feeId);
  else if (action === 'edit-fee') {
    const fees = db.get(store.fees, []);
    const fee = fees.find(f => f.id === feeId);
    if (fee) openFeeModal(fee);
  } else if (action === 'delete-fee') deleteFeeRecord(feeId);
});

// Student fee tabs
$('.tabs').addEventListener('click', (e) => {
  const tab = e.target.closest('.tab');
  if (!tab) return;
  $$('.tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  const tabType = tab.dataset.tab;
  if (tabType === 'current') {
    $('#currentFeesTable').classList.remove('hide');
    $('#paymentHistoryTable').classList.add('hide');
  } else if (tabType === 'history') {
    $('#currentFeesTable').classList.add('hide');
    $('#paymentHistoryTable').classList.remove('hide');
  }
});

/* =====================
   Bootstrap
   ===================== */
ensureSeed();
refreshLandingStats();
todayDate.textContent = new Date().toLocaleDateString();
const existing = auth.load(); 
if(existing){ 
  enterDashboard(); 
} else { 
  leaveDashboard(); 
}
