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
  payments: 'sl_payments',
  assignments: 'sl_assignments',
  submissions: 'sl_submissions'
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
  if (!db.get(store.assignments)) db.set(store.assignments, []);
  if (!db.get(store.submissions)) db.set(store.submissions, []);
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
      id: 'F001', studentId: '176', studentName: 'Om Malviya', rollNo: '2204280100176', className: 'CS-7A',
      feeType: 'Tuition', amount: 15000, paidAmount: 15000, dueDate: '2024-12-31', academicYear: '2024-25',
      semester: 'Semester 7', status: 'Paid', notes: 'Paid via online banking'
    },
    {
      id: 'F002', studentId: '176', studentName: 'Om Malviya', rollNo: '2204280100176', className: 'CS-7A',
      feeType: 'Library', amount: 2000, paidAmount: 2000, dueDate: '2024-12-31', academicYear: '2024-25',
      semester: 'Semester 7', status: 'Paid'
    },
    {
      id: 'F003', studentId: '169', studentName: 'Shristi Tripathi', rollNo: '2204280100169', className: 'CS-7A',
      feeType: 'Tuition', amount: 15000, paidAmount: 10000, dueDate: '2024-12-31', academicYear: '2024-25',
      semester: 'Semester 7', status: 'Partial', notes: 'Remaining 5000 due'
    },
    {
      id: 'F004', studentId: '150', studentName: 'Raj Dwivedi', rollNo: '2204280100150', className: 'CS-7B',
      feeType: 'Tuition', amount: 15000, paidAmount: 0, dueDate: '2024-12-31', academicYear: '2024-25',
      semester: 'Semester 7', status: 'Pending'
    }
  ];

  // Payments
  const payments = [
    { id:'P001', feeId:'F001', studentId:'176', amount:15000, date:'2024-11-15', paymentMode:'online', receiptNo:'RCPT001', referenceNo:'TXN0012345', status:'Completed' },
    { id:'P002', feeId:'F002', studentId:'176', amount:2000, date:'2024-11-20', paymentMode:'card', receiptNo:'RCPT002', referenceNo:'TXN0012346', status:'Completed' },
    { id:'P003', feeId:'F003', studentId:'169', amount:10000, date:'2024-11-18', paymentMode:'upi', receiptNo:'RCPT003', referenceNo:'TXN0012347', status:'Completed' }
  ];

  // Demo assignments
  const futureDeadline1 = new Date(); futureDeadline1.setDate(futureDeadline1.getDate() + 5);
  const futureDeadline2 = new Date(); futureDeadline2.setDate(futureDeadline2.getDate() + 1);
  const pastDeadline = new Date(); pastDeadline.setDate(pastDeadline.getDate() - 3);

  // Helper: make a real downloadable text file as base64 dataURL
  function makeTxtDataURL(content) {
    const b64 = btoa(unescape(encodeURIComponent(content)));
    return 'data:text/plain;base64,' + b64;
  }

  const linkedListInstructions = makeTxtDataURL(
`LINKED LIST IMPLEMENTATION - CS DATA STRUCTURES
Assignment Instructions (A001)
================================
Topic   : Doubly Linked List in C++
Subject : Data Structures
Class   : CS-7A
Marks   : 100

REQUIREMENTS
------------
Implement a doubly linked list with the following operations:
  1. insertAtHead(value)   - O(1)
  2. insertAtTail(value)   - O(1)
  3. deleteNode(value)     - O(n)
  4. search(value)         - O(n)
  5. reverse()             - O(n)
  6. display()             - O(n)

SUBMISSION FORMAT
-----------------
- Submit one .cpp file with all functions implemented.
- Include a sample main() showing all operations.
- Add comments explaining each function's logic.
- Include a screenshot of successful compilation and output.

DEADLINE: ${futureDeadline1.toLocaleDateString()}
MARKS   : 100

Good luck!
- Admin Jitendra Kumar`
  );

  const normalizationDataset = makeTxtDataURL(
`DATABASE NORMALIZATION ASSIGNMENT (A002)
=========================================
Subject : DBMS
Class   : CS-7B
Marks   : 50

UN-NORMALIZED TABLE: Student_Course
--------------------------------------
StudentID | StudentName | Course1 | Course2 | Course3 | Instructor1 | Instructor2 | Instructor3
101       | Ravi Sharma | DBMS    | DSA     | OS      | Dr. Gupta   | Dr. Singh   | Dr. Mehta
102       | Priya Patel | DBMS    | CN      | NULL    | Dr. Gupta   | Dr. Roy     | NULL
103       | Amit Kumar  | DSA     | OS      | NULL    | Dr. Singh   | Dr. Mehta   | NULL

YOUR TASK
---------
Step 1: Identify all repeating groups and bring to 1NF.
Step 2: Identify partial dependencies and bring to 2NF.
Step 3: Identify transitive dependencies and bring to 3NF.

Show ALL functional dependencies at each step.
Draw the final ER diagram.

DEADLINE: ${futureDeadline2.toLocaleDateString()}
- Admin Naman Jaiswal`
  );

  const linkedListSampleCpp = makeTxtDataURL(
`// Om Malviya - Roll: 2204280100176
// Doubly Linked List Implementation
// Assignment A001 - Data Structures

#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* prev;
    Node* next;
    Node(int val) : data(val), prev(nullptr), next(nullptr) {}
};

class DoublyLinkedList {
    Node* head;
    Node* tail;
public:
    DoublyLinkedList() : head(nullptr), tail(nullptr) {}

    void insertAtHead(int val) {
        Node* n = new Node(val);
        if (!head) { head = tail = n; return; }
        n->next = head;
        head->prev = n;
        head = n;
    }

    void insertAtTail(int val) {
        Node* n = new Node(val);
        if (!tail) { head = tail = n; return; }
        tail->next = n;
        n->prev = tail;
        tail = n;
    }

    void display() {
        Node* cur = head;
        while (cur) { cout << cur->data << " "; cur = cur->next; }
        cout << endl;
    }
};

int main() {
    DoublyLinkedList dll;
    dll.insertAtHead(10);
    dll.insertAtHead(20);
    dll.insertAtTail(5);
    dll.display(); // Output: 20 10 5
    return 0;
}`
  );

  const osiReportOm = makeTxtDataURL(
`OSI MODEL REPORT
Student: Om Malviya | Roll: 2204280100176 | Class: CS-7A
Assignment: A003 - Computer Networks

THE 7 LAYERS OF THE OSI MODEL
==============================

1. PHYSICAL LAYER
   - Transmits raw bits over a physical medium.
   - Examples: Ethernet cables, fiber optics, Wi-Fi signals.
   - Protocols: RS-232, USB, Bluetooth.

2. DATA LINK LAYER
   - Provides node-to-node data transfer and error detection.
   - Examples: Switches, MAC addresses.
   - Protocols: Ethernet (IEEE 802.3), Wi-Fi (IEEE 802.11).

3. NETWORK LAYER
   - Handles logical addressing and routing between networks.
   - Examples: Routers, IP addresses.
   - Protocols: IP, ICMP, OSPF.

4. TRANSPORT LAYER
   - Ensures reliable end-to-end communication.
   - Examples: TCP (reliable), UDP (fast).
   - Protocols: TCP, UDP.

5. SESSION LAYER
   - Manages sessions between applications.
   - Protocols: NetBIOS, RPC.

6. PRESENTATION LAYER
   - Translates data formats (encryption, compression).
   - Protocols: SSL/TLS, JPEG, ASCII.

7. APPLICATION LAYER
   - Interface for end-user applications.
   - Protocols: HTTP, FTP, SMTP, DNS.

OSI vs TCP/IP COMPARISON
=========================
OSI has 7 layers; TCP/IP has 4 layers.
- Network Access = Physical + Data Link
- Internet = Network
- Transport = Transport
- Application = Session + Presentation + Application

CONCLUSION
----------
The OSI model is a conceptual framework while TCP/IP is
the practical implementation used on the internet today.`
  );

  const osiReportShristi = makeTxtDataURL(
`OSI MODEL - DETAILED REPORT
Student: Shristi Tripathi | Roll: 2204280100169 | Class: CS-7A
Assignment: A003 - Computer Networks

INTRODUCTION
============
The Open Systems Interconnection (OSI) model is a conceptual
framework that standardizes the functions of a communication
system into seven abstract layers.

LAYER-BY-LAYER ANALYSIS
========================

Layer 7 - APPLICATION
  Purpose : Provides network services to end-user applications.
  Devices : Gateways, Firewalls
  PDU     : Data
  Example : A user opens Gmail in a browser (HTTP/HTTPS).

Layer 6 - PRESENTATION
  Purpose : Data translation, encryption, and compression.
  Devices : Gateway
  PDU     : Data
  Example : SSL encrypts data before transmission.

Layer 5 - SESSION
  Purpose : Establishes, manages, and terminates sessions.
  Devices : Gateway
  PDU     : Data
  Example : A video call session maintained via RTP.

Layer 4 - TRANSPORT
  Purpose : End-to-end reliable delivery.
  Devices : Load Balancers
  PDU     : Segments
  Example : TCP ensures WhatsApp message delivery.

Layer 3 - NETWORK
  Purpose : Logical addressing and routing.
  Devices : Routers
  PDU     : Packets
  Example : IP routes packets across the internet.

Layer 2 - DATA LINK
  Purpose : Physical addressing (MAC), error detection.
  Devices : Switches, Bridges
  PDU     : Frames
  Example : Ethernet frame with MAC address.

Layer 1 - PHYSICAL
  Purpose : Raw bit transmission.
  Devices : Hubs, Repeaters, Cables
  PDU     : Bits
  Example : Fiber optic cable transmitting light pulses.

OSI vs TCP/IP
=============
OSI Model (7 layers) is theoretical.
TCP/IP Model (4 layers) is practical and used in real networks.
Both models agree that reliable communication needs layered design.`
  );

  const assignments = [
    {
      id: 'A001', title: 'Linked List Implementation in C++', subject: 'Data Structures', targetClass: 'CS-7A',
      description: 'Implement a doubly linked list with insert, delete, search and reverse operations. Submit a .cpp file with proper comments and a sample output screenshot.',
      deadline: futureDeadline1.toISOString().slice(0,16),
      maxMarks: 100, createdBy: 'T001', createdByName: 'Admin Jitendra Kumar',
      createdAt: todayISO(),
      attachments: [
        { name: 'LinkedList_Instructions.txt', size: linkedListInstructions.length, type: 'txt', data: linkedListInstructions }
      ]
    },
    {
      id: 'A002', title: 'Database Normalization – 1NF to 3NF Assignment', subject: 'DBMS', targetClass: 'CS-7B',
      description: 'Normalize the given un-normalized table to First Normal Form (1NF), Second Normal Form (2NF), and Third Normal Form (3NF). Show all functional dependencies and steps clearly.',
      deadline: futureDeadline2.toISOString().slice(0,16),
      maxMarks: 50, createdBy: 'T002', createdByName: 'Admin Naman Jaiswal',
      createdAt: todayISO(),
      attachments: [
        { name: 'Normalization_Dataset.txt', size: normalizationDataset.length, type: 'txt', data: normalizationDataset }
      ]
    },
    {
      id: 'A003', title: 'Computer Networks OSI Model Report', subject: 'Computer Networks', targetClass: 'All',
      description: 'Write a detailed 5-page report explaining each layer of the OSI model with real-world examples, protocols used, and a comparison with the TCP/IP model.',
      deadline: pastDeadline.toISOString().slice(0,16),
      maxMarks: 75, createdBy: 'T001', createdByName: 'Admin Jitendra Kumar',
      createdAt: new Date(Date.now() - 7*86400000).toISOString().slice(0,10),
      attachments: []
    }
  ];

  // Demo submissions — all have real downloadable data
  const submissions = [
    {
      id: 'SUB001', assignmentId: 'A001', studentId: '176', studentName: 'Om Malviya', rollNo: '2204280100176', className: 'CS-7A',
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
      notes: 'Implemented all required operations with O(1) insert at head.',
      files: [{ name: 'Om_LinkedList.cpp', size: linkedListSampleCpp.length, type: 'cpp', data: linkedListSampleCpp }],
      marks: null, feedback: null, graded: false
    },
    {
      id: 'SUB002', assignmentId: 'A003', studentId: '176', studentName: 'Om Malviya', rollNo: '2204280100176', className: 'CS-7A',
      submittedAt: new Date(Date.now() - 4*86400000).toISOString(),
      notes: 'Submitted OSI report.',
      files: [{ name: 'Om_OSI_Report.txt', size: osiReportOm.length, type: 'txt', data: osiReportOm }],
      marks: 68, feedback: 'Good explanation of layers. TCP/IP comparison could be more detailed.', graded: true
    },
    {
      id: 'SUB003', assignmentId: 'A003', studentId: '169', studentName: 'Shristi Tripathi', rollNo: '2204280100169', className: 'CS-7A',
      submittedAt: new Date(Date.now() - 3*86400000).toISOString(),
      notes: '',
      files: [{ name: 'Shristi_OSI_Report.txt', size: osiReportShristi.length, type: 'txt', data: osiReportShristi }],
      marks: 71, feedback: 'Excellent report with clear diagrams.', graded: true
    }
  ];

  db.set(store.users, users);
  db.set(store.students, students);
  db.set(store.attendance, attendance);
  db.set(store.fees, fees);
  db.set(store.payments, payments);
  db.set(store.assignments, assignments);
  db.set(store.submissions, submissions);
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
const sections = ['teacherHome','manageStudents','takeAttendance','feeMonitoring','assignments','reports','manageTeachers','studentHome','studentFees','studentAssignments'];

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

  const assignmentCount = db.get(store.assignments, []).length;
  $('#tStatAssignmentsAll').textContent = assignmentCount;

  if(isAdmin(auth.current)){
    const users = db.get(store.users, []);
    $('#tStatTeachers').textContent = users.filter(u=>u.role==='teacher').length;
    $('#tStatAssignments').textContent = assignmentCount;
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
  if(!name || !roll || !cls){ alert('Name, Roll No and Class are required'); return }
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
  filteredFees.forEach((fee) => {
    const dueAmount = fee.amount - fee.paidAmount;
    const dueDate = new Date(fee.dueDate);
    const today = new Date();
    const isOverdue = dueDate < today && fee.status !== 'Paid';
    let statusChip = '';
    if (fee.status === 'Paid') statusChip = '<span class="chip ok">Paid</span>';
    else if (fee.status === 'Partial') statusChip = '<span class="chip warn">Partial</span>';
    else statusChip = isOverdue ? '<span class="chip bad">Overdue</span>' : '<span class="chip warn">Pending</span>';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${fee.studentName}</td><td>${fee.rollNo}</td><td>${fee.className}</td><td>${fee.feeType}</td>
      <td>₹${fee.amount.toLocaleString()}</td><td>₹${fee.paidAmount.toLocaleString()}</td>
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
    if (index !== -1) fees[index] = { ...fees[index], feeType, amount, paidAmount, dueDate, academicYear, semester, status, notes };
  } else {
    feeId = 'F' + Math.random().toString(36).slice(2, 8).toUpperCase();
    fees.push({ id: feeId, studentId: student.id, studentName: student.name, rollNo: student.roll, className: student.class, feeType, amount, paidAmount, dueDate, academicYear, semester, status, notes, createdAt: todayISO() });
  }
  db.set(store.fees, fees);
  if (paidAmount > 0) {
    const payments = db.get(store.payments, []);
    payments.push({ id: 'P' + Math.random().toString(36).slice(2, 8).toUpperCase(), feeId: feeId, studentId: student.id, amount: paidAmount, date: todayISO(), paymentMode: 'Manual Entry', receiptNo: 'RCPT' + Math.random().toString(36).slice(2, 6).toUpperCase(), referenceNo: 'MANUAL' + Date.now(), status: 'Completed' });
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
  payments.push({ id: 'P' + Math.random().toString(36).slice(2, 8).toUpperCase(), feeId: selectedFeeForPayment.id, studentId: selectedFeeForPayment.studentId, amount: paymentAmount, date: paymentDate, paymentMode: paymentMethod, receiptNo, referenceNo: referenceNo || 'N/A', status: 'Completed', notes });
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
  // stats (could display in overview if needed)
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
        payments.push({ id: 'P' + Math.random().toString(36).slice(2, 8).toUpperCase(), feeId: feeData.feeId, studentId: auth.current.id, amount: feeData.amount, date: todayISO(), paymentMode: paymentMethod, receiptNo, referenceNo: transactionId, status: 'Completed', notes: `Paid via ${paymentMethod}` });
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
   ASSIGNMENT SYSTEM
   ===================== */

// ---------- Shared file state ----------
let teacherFiles = [];    // files for new/edit assignment (teacher)
let studentSubFiles = []; // files for student submission
let currentEditAssignmentId = null;
let currentViewAssignmentId = null;
let currentGradeSubmissionId = null;
let currentSubmitAssignmentId = null;

// ---------- File helpers ----------
function fileIcon(name) {
  const ext = (name.split('.').pop() || '').toLowerCase();
  const icons = { pdf:'📄', doc:'📝', docx:'📝', png:'🖼️', jpg:'🖼️', jpeg:'🖼️', gif:'🖼️', webp:'🖼️', zip:'🗜️', txt:'📃', cpp:'💻', c:'💻', java:'💻', py:'💻', js:'💻', html:'💻', xlsx:'📊', xls:'📊', csv:'📊', pptx:'📊' };
  return icons[ext] || '📎';
}

function formatBytes(b) {
  if(!b || b <= 0) return '';
  if(b < 1024) return b + ' B';
  if(b < 1024*1024) return (b/1024).toFixed(1) + ' KB';
  return (b/(1024*1024)).toFixed(1) + ' MB';
}

function isImage(name) { return /\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i.test(name); }
function isPDF(name)   { return /\.pdf$/i.test(name); }
function isText(name)  { return /\.(txt|cpp|c|py|js|html|css|json|csv|md|java)$/i.test(name); }

// ---------- File Viewer Modal ----------
function openFileViewer(file) {
  $('#fileViewerName').textContent = file.name;
  $('#fileViewerSize').textContent = file.size ? formatBytes(file.size) : '';
  const dlBtn = $('#fileViewerDownload');
  const body  = $('#fileViewerBody');
  body.innerHTML = '';

  if (file.data) {
    dlBtn.href     = file.data;
    dlBtn.download = file.name;
    dlBtn.style.display = '';

    if (isImage(file.name)) {
      const img = document.createElement('img');
      img.src = file.data;
      img.style.cssText = 'max-width:100%;max-height:68vh;border-radius:10px;box-shadow:0 4px 24px rgba(0,0,0,.18)';
      img.alt = file.name;
      body.style.background = '#0f172a';
      body.appendChild(img);

    } else if (isPDF(file.name)) {
      body.style.background = '#f1f5f9';
      const iframe = document.createElement('iframe');
      iframe.src   = file.data;
      iframe.style.cssText = 'width:100%;height:72vh;border:none;border-radius:10px;display:block';
      iframe.title = file.name;
      body.appendChild(iframe);

    } else if (isText(file.name)) {
      body.style.background = '#0f172a';
      try {
        const b64  = file.data.split(',')[1] || '';
        const text = atob(b64);
        const pre  = document.createElement('pre');
        pre.style.cssText = 'margin:0;padding:24px;color:#e2e8f0;font-family:monospace;font-size:.85rem;line-height:1.65;white-space:pre-wrap;word-break:break-all;overflow:auto;max-height:68vh;width:100%';
        pre.textContent = text;
        body.appendChild(pre);
      } catch {
        body.style.background = '#f1f5f9';
        body.innerHTML = `<div style="text-align:center;color:var(--muted);padding:40px"><div style="font-size:3.5rem">${fileIcon(file.name)}</div><div style="font-weight:600;margin-top:12px">${file.name}</div><div style="margin-top:8px">Could not decode — click Download</div></div>`;
      }

    } else {
      body.style.background = '#f1f5f9';
      body.innerHTML = `<div style="text-align:center;color:var(--muted);padding:48px"><div style="font-size:4rem;margin-bottom:16px">${fileIcon(file.name)}</div><div style="font-weight:700;font-size:1.05rem;margin-bottom:8px">${file.name}</div><div style="margin-bottom:20px;font-size:.9rem">No preview available for this file type</div><a class="btn primary" href="${file.data}" download="${file.name}">⬇ Download File</a></div>`;
    }

  } else {
    // Demo seed placeholder — no real data
    body.style.background = '#f1f5f9';
    dlBtn.removeAttribute('href');
    dlBtn.style.display = 'none';
    body.innerHTML = `<div style="text-align:center;padding:48px"><div style="font-size:4rem;margin-bottom:16px">${fileIcon(file.name)}</div><div style="font-weight:700;font-size:1.05rem;margin-bottom:12px">${file.name}</div><div style="font-size:.9rem;background:#fef3c7;color:#92400e;padding:14px 22px;border-radius:10px;border:1px solid #fcd34d;display:inline-block">📋 Demo placeholder file — no real content stored.<br>Actual uploaded files will be fully viewable here.</div></div>`;
  }

  $('#fileViewerModal').classList.remove('hide');
}

function closeFileViewer() {
  $('#fileViewerModal').classList.add('hide');
  const body = $('#fileViewerBody');
  body.innerHTML = '';
  body.style.background = '';
}

// ---------- Render clickable file chips (unified across teacher & student views) ----------
function renderFileChips(containerEl, files, label = '') {
  if (!files || files.length === 0) {
    containerEl.innerHTML = label
      ? `<div style="font-weight:600;margin-bottom:8px;font-size:.9rem">${label}</div><span style="color:var(--muted);font-size:.85rem">No files attached</span>`
      : '';
    return;
  }
  containerEl.innerHTML = label
    ? `<div style="font-weight:600;margin-bottom:10px;font-size:.9rem">${label}</div>`
    : '';
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px';
  files.forEach(f => {
    const chip = document.createElement('span');
    chip.className = 'attach-chip';
    chip.style.cssText = 'cursor:pointer;user-select:none';
    chip.title = f.data ? `Click to view: ${f.name}` : 'Demo placeholder — no real file';
    chip.innerHTML = `${fileIcon(f.name)} ${f.name}${f.size ? ` <span style="color:var(--muted);font-size:.78rem">(${formatBytes(f.size)})</span>` : ''}`;
    if (!f.data) chip.style.opacity = '0.55';
    chip.addEventListener('click', () => openFileViewer(f));
    wrap.appendChild(chip);
  });
  containerEl.appendChild(wrap);
}

// Simulate base64 storage (store file metadata + simulated data string)
function fileToStored(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve({
      name: file.name,
      size: file.size,
      type: file.name.split('.').pop().toLowerCase(),
      data: e.target.result  // base64 dataURL
    });
    reader.readAsDataURL(file);
  });
}

function renderFileList(containerEl, files, removeCallback) {
  containerEl.innerHTML = '';
  files.forEach((f, idx) => {
    const div = document.createElement('div');
    div.className = 'file-item';
    div.innerHTML = `
      <span class="file-item-icon">${fileIcon(f.name)}</span>
      <span class="file-item-name">${f.name}</span>
      <span class="file-item-size">${formatBytes(f.size)}</span>
      <button class="file-item-remove" data-idx="${idx}" title="Remove">✕</button>
    `;
    containerEl.appendChild(div);
  });
  containerEl.querySelectorAll('.file-item-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeCallback(parseInt(btn.dataset.idx));
    });
  });
}

// filesArrayGetter: a function () => array, so drop zone always operates on the CURRENT array
function setupDropZone(dropZoneEl, fileInputEl, filesArrayGetter, listElGetter) {
  dropZoneEl.addEventListener('click', () => fileInputEl.click());
  dropZoneEl.addEventListener('dragover', (e) => { e.preventDefault(); dropZoneEl.classList.add('drag-over'); });
  dropZoneEl.addEventListener('dragleave', () => dropZoneEl.classList.remove('drag-over'));
  dropZoneEl.addEventListener('drop', async (e) => {
    e.preventDefault(); dropZoneEl.classList.remove('drag-over');
    await addFilesToArray(Array.from(e.dataTransfer.files), filesArrayGetter(), listElGetter());
  });
  fileInputEl.addEventListener('change', async () => {
    await addFilesToArray(Array.from(fileInputEl.files), filesArrayGetter(), listElGetter());
    fileInputEl.value = '';
  });
}

async function addFilesToArray(newFiles, filesArray, listEl) {
  const MAX = 10 * 1024 * 1024; // 10MB
  for(const f of newFiles) {
    if(f.size > MAX) { alert(`${f.name} exceeds 10 MB limit.`); continue; }
    const stored = await fileToStored(f);
    filesArray.push(stored);
  }
  renderFileList(listEl, filesArray, makeRemoveCallback(filesArray, listEl));
}

// Dedicated remove callbacks (using closures)
function makeRemoveCallback(arr, listEl) {
  return function remove(idx) {
    arr.splice(idx, 1);
    renderFileList(listEl, arr, remove);
  };
}

// ---------- Populate class filter for assignments ----------
function populateAssignmentClassFilters() {
  const students = db.get(store.students, []);
  const classes = [...new Set(students.map(s => s.class))].sort();

  // Teacher filter
  const tf = $('#assignmentClassFilter');
  tf.innerHTML = '<option value="">All Classes</option>' + classes.map(c=>`<option value="${c}">${c}</option>`).join('');

  // Modal class select
  const ms = $('#aClass');
  ms.innerHTML = '<option value="">Select Class</option><option value="All">All Classes</option>' + classes.map(c=>`<option value="${c}">${c}</option>`).join('');
}

// ---------- Deadline helpers ----------
function deadlineStatus(deadlineStr) {
  const dl = new Date(deadlineStr);
  const now = new Date();
  const diff = dl - now; // ms
  if(diff < 0) return { label: 'Overdue', cls: 'passed', status: 'overdue' };
  const hours = diff / 3600000;
  if(hours < 24) return { label: `${Math.ceil(hours)}h left`, cls: 'urgent', status: 'active' };
  if(hours < 72) return { label: `${Math.floor(diff/86400000)}d left`, cls: 'soon', status: 'active' };
  return { label: `${Math.floor(diff/86400000)}d left`, cls: 'ok', status: 'active' };
}

function formatDeadline(str) {
  const d = new Date(str);
  return d.toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'}) + ' · ' +
    d.toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'});
}

// ---------- Teacher assignment list ----------
function getAssignmentStatus(a) {
  const dl = new Date(a.deadline);
  const now = new Date();
  if(dl < now) return 'overdue';
  return 'active';
}

function renderAssignments() {
  const assignments = db.get(store.assignments, []);
  const submissions = db.get(store.submissions, []);
  const students = db.get(store.students, []);

  const clsFilter = $('#assignmentClassFilter').value;
  const statusFilter = $('#assignmentStatusFilter').value;
  const q = $('#assignmentSearch').value.toLowerCase();

  let filtered = assignments.filter(a => {
    if(clsFilter && a.targetClass !== 'All' && a.targetClass !== clsFilter) return false;
    if(statusFilter) {
      const as = getAssignmentStatus(a);
      const isClosed = a.closed;
      if(statusFilter === 'active' && (as !== 'active' || isClosed)) return false;
      if(statusFilter === 'overdue' && as !== 'overdue') return false;
      if(statusFilter === 'closed' && !isClosed) return false;
    }
    if(q && !a.title.toLowerCase().includes(q) && !a.subject.toLowerCase().includes(q)) return false;
    return true;
  }).sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));

  // Stats
  const now = new Date();
  const totalSubs = submissions.length;
  const active = assignments.filter(a => new Date(a.deadline) > now && !a.closed).length;
  const overdue = assignments.filter(a => new Date(a.deadline) <= now && !a.closed).length;
  $('#aStatTotal').textContent = assignments.length;
  $('#aStatActive').textContent = active;
  $('#aStatOverdue').textContent = overdue;
  $('#aStatSubmissions').textContent = totalSubs;

  const grid = $('#assignmentCardsGrid');
  grid.innerHTML = '';

  if(filtered.length === 0) {
    grid.innerHTML = `<div style="color:var(--muted); padding:32px; text-align:center; grid-column:1/-1">No assignments found. Click <strong>+ New Assignment</strong> to create one.</div>`;
    return;
  }

  filtered.forEach(a => {
    const dl = deadlineStatus(a.deadline);
    // Determine eligible students
    const eligibleStudents = a.targetClass === 'All'
      ? students
      : students.filter(s => s.class === a.targetClass);
    const aSubmissions = submissions.filter(s => s.assignmentId === a.id);
    const subCount = aSubmissions.length;
    const total = eligibleStudents.length;
    const pct = total > 0 ? Math.round(subCount / total * 100) : 0;

    const card = document.createElement('div');
    card.className = 'assignment-card';
    card.dataset.aid = a.id;
    card.innerHTML = `
      <div class="assignment-card-header">
        <div class="assignment-card-title">${a.title}</div>
        <span class="chip ${dl.status === 'overdue' ? 'bad' : 'ok'}">${dl.status === 'overdue' ? 'Overdue' : 'Active'}</span>
      </div>
      <div class="assignment-card-meta">
        <span>📚 ${a.subject}</span>
        <span>🏫 ${a.targetClass}</span>
        <span>⭐ ${a.maxMarks || '—'} marks</span>
        <span>👤 ${a.createdByName}</span>
      </div>
      <div>
        <div style="display:flex; justify-content:space-between; font-size:.82rem; color:var(--muted); margin-bottom:4px">
          <span>Submissions</span>
          <span>${subCount} / ${total}</span>
        </div>
        <div class="submission-bar"><div class="submission-bar-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="assignment-card-footer">
        <span>📅 ${formatDeadline(a.deadline)}</span>
        <span class="deadline-countdown ${dl.cls}">⏰ ${dl.label}</span>
      </div>
      <div class="row" style="gap:8px; margin-top:4px">
        <button class="btn small primary" data-aid="${a.id}" data-act="view-assignment">View Submissions</button>
        <button class="btn small" data-aid="${a.id}" data-act="edit-assignment">Edit</button>
        <button class="btn small danger" data-aid="${a.id}" data-act="delete-assignment">Delete</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ---------- Open create/edit modal ----------
function openAssignmentModal(assignment = null) {
  currentEditAssignmentId = assignment ? assignment.id : null;
  // Reset teacherFiles in-place so the getter closure still points to the same variable
  teacherFiles.length = 0;
  renderFileList($('#aFileList'), teacherFiles, makeRemoveCallback(teacherFiles, $('#aFileList')));

  if(assignment) {
    $('#assignmentModalTitle').textContent = 'Edit Assignment';
    $('#saveAssignmentBtn').textContent = 'Update Assignment';
    $('#aTitle').value = assignment.title;
    $('#aSubject').value = assignment.subject;
    $('#aClass').value = assignment.targetClass;
    $('#aDeadline').value = assignment.deadline;
    $('#aMaxMarks').value = assignment.maxMarks || '';
    $('#aDescription').value = assignment.description || '';
    // Load existing attachments (only ones with real stored data)
    if(assignment.attachments && assignment.attachments.length) {
      assignment.attachments.filter(f => f.data).forEach(f => teacherFiles.push(f));
      renderFileList($('#aFileList'), teacherFiles, makeRemoveCallback(teacherFiles, $('#aFileList')));
    }
  } else {
    $('#assignmentModalTitle').textContent = 'New Assignment';
    $('#saveAssignmentBtn').textContent = 'Publish Assignment';
    $('#aTitle').value = '';
    $('#aSubject').value = '';
    $('#aClass').value = '';
    // Default deadline: 7 days from now
    const dl = new Date(); dl.setDate(dl.getDate() + 7);
    $('#aDeadline').value = dl.toISOString().slice(0, 16);
    $('#aMaxMarks').value = '100';
    $('#aDescription').value = '';
  }

  $('#assignmentModal').classList.remove('hide');
  $('#aTitle').focus();
}

function closeAssignmentModal() {
  $('#assignmentModal').classList.add('hide');
  currentEditAssignmentId = null;
  teacherFiles.length = 0;
  $('#aFileList').innerHTML = '';
}

function saveAssignment() {
  const title = $('#aTitle').value.trim();
  const subject = $('#aSubject').value.trim();
  const targetClass = $('#aClass').value;
  const deadline = $('#aDeadline').value;
  const maxMarks = parseInt($('#aMaxMarks').value) || null;
  const description = $('#aDescription').value.trim();

  if(!title || !subject || !targetClass || !deadline) { alert('Title, Subject, Class and Deadline are required.'); return }

  const assignments = db.get(store.assignments, []);
  const u = auth.current;

  if(currentEditAssignmentId) {
    const idx = assignments.findIndex(a => a.id === currentEditAssignmentId);
    if(idx !== -1) {
      assignments[idx] = { ...assignments[idx], title, subject, targetClass, deadline, maxMarks, description,
        attachments: teacherFiles.length ? teacherFiles : assignments[idx].attachments,
        updatedAt: new Date().toISOString() };
    }
  } else {
    assignments.push({
      id: 'A' + Math.random().toString(36).slice(2,8).toUpperCase(),
      title, subject, targetClass, deadline, maxMarks, description,
      attachments: teacherFiles,
      createdBy: u.id, createdByName: u.name,
      createdAt: new Date().toISOString()
    });
  }

  db.set(store.assignments, assignments);
  closeAssignmentModal();
  renderAssignments();
  refreshTeacherStats();
  alert(currentEditAssignmentId ? 'Assignment updated!' : 'Assignment published successfully!');
}

// ---------- View assignment detail (teacher sees submissions) ----------
function openAssignmentDetail(assignmentId) {
  currentViewAssignmentId = assignmentId;
  const assignments = db.get(store.assignments, []);
  const submissions = db.get(store.submissions, []);
  const students = db.get(store.students, []);
  const a = assignments.find(x => x.id === assignmentId);
  if(!a) return;

  const dl = deadlineStatus(a.deadline);

  $('#detailTitle').textContent = a.title;
  $('#detailMeta').innerHTML = `
    <span>📚 ${a.subject}</span> &nbsp;·&nbsp;
    <span>🏫 ${a.targetClass}</span> &nbsp;·&nbsp;
    <span>⭐ ${a.maxMarks || '—'} marks</span> &nbsp;·&nbsp;
    <span>📅 Deadline: ${formatDeadline(a.deadline)}</span> &nbsp;·&nbsp;
    <span class="deadline-countdown ${dl.cls}">⏰ ${dl.label}</span>
  `;
  $('#detailDescription').textContent = a.description || 'No description provided.';

  // Attachments
  const attDiv = $('#detailAttachments');
  renderFileChips(attDiv, a.attachments, '📎 Assignment Files');

  // Eligible students
  const eligibleStudents = a.targetClass === 'All' ? students : students.filter(s => s.class === a.targetClass);
  const aSubmissions = submissions.filter(s => s.assignmentId === assignmentId);

  const tbody = $('#submissionsTbody');
  tbody.innerHTML = '';
  aSubmissions.sort((a,b)=> new Date(a.submittedAt) - new Date(b.submittedAt)).forEach(sub => {
    const submittedAt = new Date(sub.submittedAt);
    const deadline = new Date(a.deadline);
    const late = submittedAt > deadline;
    const tr = document.createElement('tr');

    // Build each cell via DOM so event listeners on file chips work
    const tdName = document.createElement('td');
    tdName.innerHTML = `${sub.studentName} ${late ? '<span class="chip bad" style="font-size:.75rem;padding:2px 6px">Late</span>' : ''}`;

    const tdRoll  = document.createElement('td'); tdRoll.textContent  = sub.rollNo;
    const tdCls   = document.createElement('td'); tdCls.textContent   = sub.className;
    const tdTime  = document.createElement('td');
    tdTime.style.fontSize = '.85rem';
    tdTime.textContent    = submittedAt.toLocaleString('en-IN');

    // *** Student uploaded files — clickable via file viewer ***
    const tdFiles = document.createElement('td');
    tdFiles.style.minWidth = '160px';
    const fileWrap = document.createElement('div');
    renderFileChips(fileWrap, sub.files && sub.files.length ? sub.files : []);
    tdFiles.appendChild(fileWrap);

    // Student notes
    const tdNotes = document.createElement('td');
    tdNotes.style.cssText = 'font-size:.82rem;color:var(--muted);max-width:140px';
    tdNotes.textContent = sub.notes || '—';

    const tdMarks = document.createElement('td');
    tdMarks.innerHTML = sub.graded
      ? `<span class="grade-badge">🏆 ${sub.marks}/${a.maxMarks || '—'}</span>`
      : '<span style="color:var(--muted);font-size:.9rem">—</span>';

    const tdAction = document.createElement('td');
    tdAction.innerHTML = `<button class="btn small" data-sub-id="${sub.id}" data-act="grade-sub">${sub.graded ? 'Update Grade' : 'Grade'}</button>`;

    [tdName, tdRoll, tdCls, tdTime, tdFiles, tdNotes, tdMarks, tdAction].forEach(td => tr.appendChild(td));
    tbody.appendChild(tr);
  });

  // Not submitted
  const submittedStudentIds = new Set(aSubmissions.map(s => s.studentId));
  const notSubmitted = eligibleStudents.filter(s => !submittedStudentIds.has(s.id));
  const notList = $('#notSubmittedList');
  notList.innerHTML = '';
  if(notSubmitted.length === 0) {
    notList.innerHTML = '<span style="color:var(--accent); font-weight:600">✅ All students submitted!</span>';
  } else {
    notSubmitted.forEach(s => {
      const span = document.createElement('span');
      span.className = 'not-sub-tag';
      span.textContent = `${s.name} (${s.roll})`;
      notList.appendChild(span);
    });
  }

  $('#assignmentDetailModal').classList.remove('hide');
}

function closeAssignmentDetail() {
  $('#assignmentDetailModal').classList.add('hide');
  currentViewAssignmentId = null;
}

// ---------- Grade submission ----------
function openGradeModal(submissionId) {
  const submissions = db.get(store.submissions, []);
  const sub = submissions.find(s => s.id === submissionId);
  if(!sub) return;
  currentGradeSubmissionId = submissionId;
  $('#gradeStudentName').value = `${sub.studentName} (${sub.rollNo})`;
  $('#gradeMarks').value = sub.marks || '';
  $('#gradeFeedback').value = sub.feedback || '';
  $('#gradeModal').classList.remove('hide');
}

function closeGradeModal() {
  $('#gradeModal').classList.add('hide');
  currentGradeSubmissionId = null;
}

function saveGrade() {
  const marks = parseFloat($('#gradeMarks').value);
  const feedback = $('#gradeFeedback').value.trim();
  if(isNaN(marks) || marks < 0) { alert('Please enter valid marks.'); return }
  const submissions = db.get(store.submissions, []);
  const idx = submissions.findIndex(s => s.id === currentGradeSubmissionId);
  if(idx !== -1) {
    const assignments = db.get(store.assignments, []);
    const a = assignments.find(x => x.id === submissions[idx].assignmentId);
    if(a && a.maxMarks && marks > a.maxMarks) { alert(`Marks cannot exceed max marks (${a.maxMarks}).`); return }
    submissions[idx].marks = marks;
    submissions[idx].feedback = feedback;
    submissions[idx].graded = true;
    db.set(store.submissions, submissions);
  }
  closeGradeModal();
  // Refresh detail view
  if(currentViewAssignmentId) openAssignmentDetail(currentViewAssignmentId);
  alert('Grade saved!');
}

// ---------- Export submissions ----------
function exportSubmissions() {
  if(!currentViewAssignmentId) return;
  const assignments = db.get(store.assignments, []);
  const a = assignments.find(x => x.id === currentViewAssignmentId);
  const submissions = db.get(store.submissions, []).filter(s => s.assignmentId === currentViewAssignmentId);
  const rows = [['Assignment', a.title], ['Subject', a.subject], ['Class', a.targetClass], ['Deadline', a.deadline], [''],
    ['Student', 'Roll No', 'Class', 'Submitted At', 'Files', 'Marks', 'Feedback', 'Status']];
  submissions.forEach(sub => {
    rows.push([sub.studentName, sub.rollNo, sub.className, new Date(sub.submittedAt).toLocaleString(),
      sub.files.map(f=>f.name).join('; '),
      sub.graded ? sub.marks : 'Not graded', sub.feedback || '', sub.graded ? 'Graded' : 'Submitted']);
  });
  downloadCSV(rows, `submissions_${a.title.slice(0,20).replace(/\s/g,'_')}.csv`);
}

// ---------- Student assignment view ----------
function renderStudentAssignments() {
  const user = auth.current;
  if(!user || user.role !== 'student') return;

  const assignments = db.get(store.assignments, []);
  const submissions = db.get(store.submissions, []).filter(s => s.studentId === user.id);
  const filterVal = $('#stuAssignmentFilter').value;

  // My assignments = assigned to my class or All
  const mine = assignments.filter(a => a.targetClass === 'All' || a.targetClass === user.class);

  const submittedSet = new Set(submissions.map(s => s.assignmentId));
  const gradedSet = new Set(submissions.filter(s => s.graded).map(s => s.assignmentId));
  const now = new Date();

  let filtered = mine.filter(a => {
    if(!filterVal) return true;
    const submitted = submittedSet.has(a.id);
    const graded = gradedSet.has(a.id);
    const overdue = new Date(a.deadline) < now && !submitted;
    if(filterVal === 'submitted' && !submitted) return false;
    if(filterVal === 'pending' && (submitted || new Date(a.deadline) < now)) return false;
    if(filterVal === 'graded' && !graded) return false;
    if(filterVal === 'overdue' && !overdue) return false;
    return true;
  }).sort((a,b) => new Date(a.deadline) - new Date(b.deadline));

  // Stats
  const total = mine.length;
  const subCount = mine.filter(a => submittedSet.has(a.id)).length;
  const pending = mine.filter(a => !submittedSet.has(a.id) && new Date(a.deadline) >= now).length;
  const graded = mine.filter(a => gradedSet.has(a.id)).length;
  $('#stuAStatTotal').textContent = total;
  $('#stuAStatSubmitted').textContent = subCount;
  $('#stuAStatPending').textContent = pending;
  $('#stuAStatGraded').textContent = graded;

  const grid = $('#stuAssignmentCards');
  grid.innerHTML = '';

  if(filtered.length === 0) {
    grid.innerHTML = `<div style="color:var(--muted); padding:32px; text-align:center; grid-column:1/-1">No assignments to show.</div>`;
    return;
  }

  filtered.forEach(a => {
    const sub = submissions.find(s => s.assignmentId === a.id);
    const submitted = !!sub;
    const graded = sub && sub.graded;
    const dl = deadlineStatus(a.deadline);
    const overdue = new Date(a.deadline) < now;

    let statusChip = '';
    if(graded) statusChip = `<span class="chip ok">Graded · ${sub.marks}/${a.maxMarks||'—'}</span>`;
    else if(submitted) statusChip = `<span class="chip ok">Submitted</span>`;
    else if(overdue) statusChip = `<span class="chip bad">Overdue</span>`;
    else statusChip = `<span class="chip warn">Pending</span>`;

    const card = document.createElement('div');
    card.className = 'assignment-card';
    card.innerHTML = `
      <div class="assignment-card-header">
        <div class="assignment-card-title">${a.title}</div>
        ${statusChip}
      </div>
      <div class="assignment-card-meta">
        <span>📚 ${a.subject}</span>
        <span>⭐ ${a.maxMarks || '—'} marks</span>
        <span>👤 ${a.createdByName}</span>
      </div>
      ${graded && sub.feedback ? `<div style="font-size:.88rem; padding:8px 12px; background:#eff6ff; border-radius:8px; color:var(--primary)">💬 <em>${sub.feedback}</em></div>` : ''}
      <div class="assignment-card-footer">
        <span>📅 ${formatDeadline(a.deadline)}</span>
        <span class="deadline-countdown ${dl.cls}">⏰ ${dl.label}</span>
      </div>
      <div class="row" style="gap:8px; margin-top:4px">
        <button class="btn small primary" data-aid="${a.id}" data-act="open-submit">
          ${submitted ? (overdue ? 'View Submission' : 'Update Submission') : (overdue ? 'View (Overdue)' : 'Submit')}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

$('#stuAssignmentFilter').addEventListener('change', renderStudentAssignments);

// ---------- Submit modal ----------
function openSubmitModal(assignmentId) {
  currentSubmitAssignmentId = assignmentId;
  studentSubFiles.length = 0;
  const assignments = db.get(store.assignments, []);
  const submissions = db.get(store.submissions, []);
  const a = assignments.find(x => x.id === assignmentId);
  if(!a) return;

  const sub = submissions.find(s => s.assignmentId === assignmentId && s.studentId === auth.current.id);
  const dl = deadlineStatus(a.deadline);
  const overdue = new Date(a.deadline) < new Date();

  $('#submitModalTitle').textContent = a.title;
  $('#submitModalMeta').innerHTML = `📚 ${a.subject} &nbsp;·&nbsp; 🏫 ${a.targetClass} &nbsp;·&nbsp; ⭐ ${a.maxMarks||'—'} marks &nbsp;·&nbsp; 📅 ${formatDeadline(a.deadline)} &nbsp;·&nbsp; <span class="deadline-countdown ${dl.cls}">⏰ ${dl.label}</span>`;
  $('#submitModalDesc').textContent = a.description || 'No description provided.';

  // Teacher attachments - always show, clearly downloadable
  const attDiv = $('#submitModalAttachments');
  if(a.attachments && a.attachments.length > 0) {
    renderFileChips(attDiv, a.attachments, '📎 Assignment Files — Download & Read Before Submitting');
  } else {
    attDiv.innerHTML = '<p style="color:var(--muted);font-size:.9rem;margin:0">No files attached by teacher.</p>';
  }

  // Already submitted?
  const alreadyBanner = $('#alreadySubmittedBanner');
  const gradeBanner = $('#gradeResultBanner');
  const submitForm = $('#submitForm');

  if(sub) {
    alreadyBanner.classList.remove('hide');
    alreadyBanner.innerHTML = `✅ Submitted on ${new Date(sub.submittedAt).toLocaleString('en-IN')}`;
    if(sub.graded) {
      gradeBanner.classList.remove('hide');
      gradeBanner.innerHTML = `🏆 <strong>Marks: ${sub.marks}/${a.maxMarks||'—'}</strong>${sub.feedback ? ` &nbsp;·&nbsp; 💬 ${sub.feedback}` : ''}`;
    } else {
      gradeBanner.classList.add('hide');
    }
    // Show existing submitted files as clickable/viewable chips
    if(sub.files && sub.files.length) {
      const existingDiv = document.createElement('div');
      existingDiv.dataset.existingFiles = '1';
      existingDiv.style.cssText = 'margin-bottom:14px;padding:12px;background:#f8fafc;border-radius:10px;border:1px solid var(--border)';
      const label = document.createElement('div');
      label.style.cssText = 'font-weight:600;margin-bottom:8px;font-size:.9rem;color:var(--muted)';
      label.textContent = '📤 Your submitted files:';
      existingDiv.appendChild(label);
      renderFileChips(existingDiv, sub.files);
      submitForm.prepend(existingDiv);
    }
    $('#subNotes').value = sub.notes || '';
    // Allow resubmit if not overdue
    if(overdue) {
      submitForm.querySelector('#saveSubmitBtn').disabled = true;
      submitForm.querySelector('#saveSubmitBtn').textContent = 'Deadline Passed';
    } else {
      submitForm.querySelector('#saveSubmitBtn').disabled = false;
      submitForm.querySelector('#saveSubmitBtn').textContent = 'Update Submission';
    }
  } else {
    alreadyBanner.classList.add('hide');
    gradeBanner.classList.add('hide');
    $('#subNotes').value = '';
    if(overdue) {
      submitForm.querySelector('#saveSubmitBtn').disabled = true;
      submitForm.querySelector('#saveSubmitBtn').textContent = 'Deadline Passed';
    } else {
      submitForm.querySelector('#saveSubmitBtn').disabled = false;
      submitForm.querySelector('#saveSubmitBtn').textContent = 'Submit Assignment';
    }
  }

  renderFileList($('#subFileList'), studentSubFiles, makeRemoveCallback(studentSubFiles, $('#subFileList')));
  $('#submitAssignmentModal').classList.remove('hide');
}

function closeSubmitModal() {
  $('#submitAssignmentModal').classList.add('hide');
  currentSubmitAssignmentId = null;
  studentSubFiles.length = 0;
  // Clean up any injected existing-files display
  const submitForm = $('#submitForm');
  const extra = submitForm.querySelector('[data-existing-files]');
  if(extra) extra.remove();
  $('#alreadySubmittedBanner').classList.add('hide');
  $('#gradeResultBanner').classList.add('hide');
  $('#subFileList').innerHTML = '';
  $('#subNotes').value = '';
}

function saveSubmission() {
  if(!currentSubmitAssignmentId) return;
  const user = auth.current;
  const assignments = db.get(store.assignments, []);
  const a = assignments.find(x => x.id === currentSubmitAssignmentId);
  if(!a) return;

  const overdue = new Date(a.deadline) < new Date();
  if(overdue) { alert('Deadline has passed. You cannot submit.'); return }

  const submissions = db.get(store.submissions, []);
  const existingIdx = submissions.findIndex(s => s.assignmentId === currentSubmitAssignmentId && s.studentId === user.id);
  const existingSub = existingIdx > -1 ? submissions[existingIdx] : null;

  // Allow resubmit keeping old files if no new files uploaded
  const filesToSave = studentSubFiles.length > 0 
    ? studentSubFiles 
    : (existingSub ? existingSub.files : []);

  if(filesToSave.length === 0) { alert('Please attach at least one file before submitting.'); return }

  const notes = $('#subNotes').value.trim();

  const subData = {
    id: existingSub ? existingSub.id : 'SUB' + Math.random().toString(36).slice(2,8).toUpperCase(),
    assignmentId: currentSubmitAssignmentId,
    studentId: user.id,
    studentName: user.name,
    rollNo: user.roll || user.id,
    className: user.class || '—',
    submittedAt: new Date().toISOString(),
    notes,
    files: filesToSave,
    marks: existingSub ? existingSub.marks : null,
    feedback: existingSub ? existingSub.feedback : null,
    graded: existingSub ? existingSub.graded : false
  };

  if(existingIdx > -1) submissions[existingIdx] = subData;
  else submissions.push(subData);

  db.set(store.submissions, submissions);
  closeSubmitModal();
  renderStudentAssignments();
  alert(existingSub ? 'Submission updated successfully!' : 'Assignment submitted successfully!');
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

  if(isAdmin(u)){
    userRole.textContent = 'Admin';
    userRole.classList.add('admin-pill');
  } else {
    userRole.textContent = u.role;
    userRole.classList.remove('admin-pill');
  }

  if(u.role==='teacher'){
    $('#navTeacherHome').classList.remove('hide');
    $('#navManageStudents').classList.remove('hide');
    $('#navFeeMonitoring').classList.remove('hide');
    $('#navAssignments').classList.remove('hide');
    $('#navReports').classList.remove('hide');
    $('#navStudentHome').classList.add('hide');
    $('#navStudentFees').classList.add('hide');
    $('#navStudentAssignments').classList.add('hide');

    if(isAdmin(u)){
      $('#navManageTeachers').classList.remove('hide');
      $('#navTakeAttendance').classList.add('hide');
      $('#quickTakeBtn').classList.add('hide');
      $('#adminExtraStats').classList.remove('hide');
      setActive('teacherHome');
    } else {
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
    populateAssignmentClassFilters();
    renderAssignments();

    if(isAdmin(u)) listTeachers();

  }else{
    // Student
    $('#navTeacherHome').classList.add('hide');
    $('#navManageStudents').classList.add('hide');
    $('#navTakeAttendance').classList.add('hide');
    $('#navFeeMonitoring').classList.add('hide');
    $('#navAssignments').classList.add('hide');
    $('#navReports').classList.add('hide');
    $('#navManageTeachers').classList.add('hide');
    $('#navStudentHome').classList.remove('hide');
    $('#navStudentFees').classList.remove('hide');
    $('#navStudentAssignments').classList.remove('hide');
    setActive('studentHome');
    $('#stuMonth').value = monISO();
    renderStudentHome();
    renderStudentFeeView();
    renderStudentAssignments();
  }
}

function leaveDashboard(){
  show(authPage); hide(dash); hide(navLogoutBtn); refreshLandingStats(); loginPass.value='';
}

/* =====================
   Role Selector (3 buttons)
   ===================== */
let selectedRole = 'teacher';

function selectRole(role) {
  selectedRole = role;
  $$('.role-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.role === role));
  if (role === 'student') {
    $('#radioStudent').checked = true;
  } else {
    $('#radioTeacher').checked = true;
  }
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

loginBtn.addEventListener('click', ()=>{
  const id = loginId.value.trim();
  const pw = loginPass.value.trim();
  if(!id || !pw){ loginMsg.textContent = 'Please fill all fields.'; return }
  const loginRoleForAuth = selectedRole === 'student' ? 'student' : 'teacher';
  const res = auth.login(id, pw, loginRoleForAuth);
  if(res.ok){
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
  if(target==='assignments'){ populateAssignmentClassFilters(); renderAssignments(); }
  if(target==='studentAssignments') renderStudentAssignments();
  if(target==='manageTeachers') listTeachers($('#teacherSearch').value);
})

// Quick actions
$('#quickTakeBtn').addEventListener('click', ()=>{ setActive('takeAttendance'); renderAttendanceTable() });
$('#seedBtn').addEventListener('click', ()=>{
  if(confirm('Reset demo data?')){
    seedDemo();
    refreshLandingStats(); refreshTeacherStats(); listStudents(); renderAttendanceTable(); renderReports(); renderStudentFeeView();
    populateAssignmentClassFilters(); renderAssignments();
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

// Fee tabs (student fees page only - use the specific tabs inside #studentFees)
$('#studentFees').addEventListener('click', (e) => {
  const tab = e.target.closest('.tab'); if (!tab) return;
  // Only handle tabs within #studentFees
  if(!$('#studentFees').contains(tab)) return;
  $$('#studentFees .tab').forEach(t => t.classList.remove('active'));
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

// =====================
// Assignment Event Listeners
// =====================
$('#createAssignmentBtn').addEventListener('click', () => openAssignmentModal());
$('#closeAssignmentModal').addEventListener('click', closeAssignmentModal);
$('#cancelAssignmentBtn').addEventListener('click', closeAssignmentModal);
$('#saveAssignmentBtn').addEventListener('click', saveAssignment);

$('#assignmentClassFilter').addEventListener('change', renderAssignments);
$('#assignmentStatusFilter').addEventListener('change', renderAssignments);
$('#assignmentSearch').addEventListener('input', renderAssignments);

// Teacher file drop zone - uses getter so always targets current teacherFiles array
setupDropZone($('#aFileDropZone'), $('#aFileInput'), () => teacherFiles, () => $('#aFileList'));
$('#aFileDropZone').addEventListener('click', (e) => {
  if(e.target.classList.contains('file-drop-link')) { e.stopPropagation(); $('#aFileInput').click(); }
});

// Assignment card actions (teacher)
$('#assignmentCardsGrid').addEventListener('click', (e) => {
  const btn = e.target.closest('button'); if(!btn) return;
  const aid = btn.dataset.aid; const act = btn.dataset.act;
  if(!aid) return;
  if(act === 'view-assignment') openAssignmentDetail(aid);
  else if(act === 'edit-assignment') {
    const a = db.get(store.assignments, []).find(x => x.id === aid);
    if(a) openAssignmentModal(a);
  }
  else if(act === 'delete-assignment') {
    if(confirm('Delete this assignment? All submissions will also be deleted.')) {
      db.set(store.assignments, db.get(store.assignments, []).filter(a => a.id !== aid));
      db.set(store.submissions, db.get(store.submissions, []).filter(s => s.assignmentId !== aid));
      renderAssignments(); refreshTeacherStats();
    }
  }
});

// Detail modal listeners
$('#closeDetailModal').addEventListener('click', closeAssignmentDetail);
$('#exportSubmissionsBtn').addEventListener('click', exportSubmissions);

$('#submissionsTbody').addEventListener('click', (e) => {
  const btn = e.target.closest('button'); if(!btn) return;
  const subId = btn.dataset.subId; const act = btn.dataset.act;
  if(act === 'grade-sub') openGradeModal(subId);
});

// Grade modal
$('#closeGradeModal').addEventListener('click', closeGradeModal);
$('#cancelGradeBtn').addEventListener('click', closeGradeModal);
$('#saveGradeBtn').addEventListener('click', saveGrade);

// Student assignment cards
$('#stuAssignmentCards').addEventListener('click', (e) => {
  const btn = e.target.closest('button'); if(!btn) return;
  const aid = btn.dataset.aid; const act = btn.dataset.act;
  if(act === 'open-submit') openSubmitModal(aid);
});

// Submit modal
$('#closeSubmitModal').addEventListener('click', closeSubmitModal);
$('#cancelSubmitBtn').addEventListener('click', closeSubmitModal);
$('#saveSubmitBtn').addEventListener('click', saveSubmission);

// Student file drop zone - uses getter so always targets current studentSubFiles array
setupDropZone($('#subFileDropZone'), $('#subFileInput'), () => studentSubFiles, () => $('#subFileList'));
$('#subFileDropZone').addEventListener('click', (e) => {
  if(e.target.classList.contains('file-drop-link')) { e.stopPropagation(); $('#subFileInput').click(); }
});

// Reports month filter
$('#repMonth').addEventListener('change', renderReports);

// Login on Enter key
loginPass.addEventListener('keydown', (e) => { if(e.key === 'Enter') loginBtn.click(); });
loginId.addEventListener('keydown', (e) => { if(e.key === 'Enter') loginBtn.click(); });

// =====================
// Global Escape key & backdrop-click closes all modals
// =====================
const modalMap = [
  { overlay: '#assignmentModal',         close: closeAssignmentModal },
  { overlay: '#assignmentDetailModal',   close: closeAssignmentDetail },
  { overlay: '#gradeModal',              close: closeGradeModal },
  { overlay: '#submitAssignmentModal',   close: closeSubmitModal },
  { overlay: '#paymentModal',            close: closePaymentModal },
  { overlay: '#paymentProcessingModal',  close: closePaymentProcessing },
  { overlay: '#fileViewerModal',         close: closeFileViewer },
];

document.addEventListener('keydown', (e) => {
  if(e.key !== 'Escape') return;
  for(const m of modalMap){
    const el = $(m.overlay);
    if(el && !el.classList.contains('hide')){ m.close(); break; }
  }
});

modalMap.forEach(({ overlay, close }) => {
  const el = $(overlay);
  if(!el) return;
  el.addEventListener('click', (e) => {
    // Only close if the click was directly on the overlay backdrop (not inner card)
    if(e.target === el) close();
  });
});
ensureSeed();
refreshLandingStats();
todayDate.textContent = new Date().toLocaleDateString();
selectRole('teacher');

const existing = auth.load(); 
if(existing){ enterDashboard(); } else { leaveDashboard(); }
