// ═══════════════════════════════════════════════════════
// FIREBASE HELPERS
// ═══════════════════════════════════════════════════════
function db()  { return window._db; }
function fb()  { return window._fb; }

function tsToStr(ts) {
  if (!ts) return '—';
  if (typeof ts === 'string') return ts;
  if (ts && typeof ts === 'object' && ts.seconds) {
    return new Date(ts.seconds * 1000).toLocaleDateString('ar-IQ');
  }
  if (ts && typeof ts.toDate === 'function') {
    return ts.toDate().toLocaleDateString('ar-IQ');
  }
  return String(ts);
}

function parseProducts(prods) {
  if (!prods) return '—';
  if (typeof prods === 'string') return prods;
  if (Array.isArray(prods)) {
    return prods.map(p => {
      if (typeof p === 'string') return p;
      if (p && p.name) return `${p.name}×${p.qty||1}`;
      return '—';
    }).join('، ');
  }
  if (typeof prods === 'object') return JSON.stringify(prods);
  return String(prods);
}

async function fbGet(colName) {
  if (!fbReady) return [];
  try {
    const snap = await fb().getDocs(fb().collection(db(), colName));
    return snap.docs.map(d => ({ _id: d.id, ...d.data() }));
  } catch(e) { console.warn('fbGet', colName, e); return []; }
}

async function fbAdd(colName, data) {
  if (!fbReady) return null;
  try {
    const ref = await fb().addDoc(fb().collection(db(), colName), {
      ...data, createdAt: fb().serverTimestamp()
    });
    return ref.id;
  } catch(e) { console.warn('fbAdd', e); return null; }
}

async function fbUpdate(colName, docId, data) {
  if (!fbReady) return;
  try {
    await fb().updateDoc(fb().doc(db(), colName, docId), {
      ...data, updatedAt: fb().serverTimestamp()
    });
  } catch(e) { console.warn('fbUpdate', e); }
}

async function fbDel(colName, docId) {
  if (!fbReady) return;
  try { await fb().deleteDoc(fb().doc(db(), colName, docId)); } catch(e) {}
}

async function fbAddSub(colName, docId, subCol, data) {
  if (!fbReady) return null;
  try {
    const ref = await fb().addDoc(
      fb().collection(db(), colName, docId, subCol),
      { ...data, createdAt: fb().serverTimestamp() }
    );
    return ref.id;
  } catch(e) { return null; }
}

async function fbGetSub(colName, docId, subCol) {
  if (!fbReady) return [];
  try {
    const snap = await fb().getDocs(fb().collection(db(), colName, docId, subCol));
    return snap.docs.map(d => ({ _id: d.id, ...d.data() }));
  } catch(e) { return []; }
}

function setFbStatus(ok, txt) {
  document.getElementById('fbDot').className = 'fb-dot ' + (ok ? 'ok' : 'err');
  document.getElementById('fbStatusTxt').textContent = txt;
}
