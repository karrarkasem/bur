// ═══════════════════════════════════════════════════════
// MAP
// ═══════════════════════════════════════════════════════
function toggleMap(){
  const c=document.getElementById('mapContainer');
  c.style.display=c.style.display==='none'?'block':'none';
  if(c.style.display==='block'&&!leafMap){
    setTimeout(()=>{
      leafMap=L.map('map').setView(HQ,15);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{attribution:'©OSM'}).addTo(leafMap);
      L.marker(HQ).addTo(leafMap).bindPopup('🏪 برجمان').openPopup();
    },200);
  } else if(c.style.display==='block') leafMap?.invalidateSize();
}
function confirmLoc(){
  if(!leafMap) return;
  const c=leafMap.getCenter();
  selLoc=`https://www.google.com/maps?q=${c.lat},${c.lng}`;
  document.getElementById('mapContainer').style.display='none';
  document.getElementById('locOk').style.display='block';
  toast('✅ تم تحديد الموقع');
}
