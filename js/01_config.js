// ═══════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════
const WA  = '9647742222194';
const HQ  = [32.57664096812528, 44.05991539922393];
const POINTS_PER_IQD = 100000; // كل 100,000 د.ع = نقطة واحدة

const PERMS = {
  admin:         { order:1, manage:1, dash:1, users:1, wallet:1, inv:1, inv_write:1, offers:1, tracking:1, reports:1, notif:1, repField:0, repHome:0 },
  sales_manager: { order:1, manage:1, dash:1, users:0, wallet:1, inv:1, inv_write:1, offers:1, tracking:1, reports:1, notif:1, repField:1, repHome:0 },
  rep:           { order:1, manage:0, dash:0, users:0, wallet:1, inv:0, inv_write:0, offers:0, tracking:0, reports:0, notif:1, repField:1, repHome:1 },
  market_owner:  { order:1, manage:0, dash:1, users:0, wallet:1, inv:0, inv_write:0, offers:1, tracking:0, reports:0, notif:1, repField:0, repHome:0 },
  guest:         { order:1, manage:0, dash:0, users:0, wallet:0, inv:0, inv_write:0, offers:1, tracking:0, reports:0, notif:0, repField:0, repHome:0 }
};
const ROLES = { admin:'🛡️ أدمن', sales_manager:'📊 مشرف', rep:'🤝 مندوب', market_owner:'🏪 صاحب ماركت', guest:'🌐 زائر' };

// ═══ STATE ═══════════════════════════════════════════
let users=[], products=[], orders=[], purInvoices=[], discounts=[], offers=[], notifications=[];
let cart={}, selLoc='', curProd=null, pmQtyVal=1;
let leafMap=null, purItems=[];
let CU=null;
let fbReady=false;
let _uploadedImgUrl = '';
