// ═══════════════════════════════════════════════════════
// نظام النقاط - كل 100,000 د.ع = نقطة واحدة
// ═══════════════════════════════════════════════════════
async function awardPoints(uo, orderTotal, shopName, orderId) {
  if(!uo||!uo._id) return;
  
  try {
    // جلب أو إنشاء سجل النقاط
    let pointsDoc = null;
    const allPts = await fbGet('points');
    pointsDoc = allPts.find(p => p.userId === uo._id || p.username === uo.username);
    
    const prevTotal = parseFloat(pointsDoc?.totalSales || 0);
    const prevPoints = parseInt(pointsDoc?.totalPoints || 0);
    const newTotal = prevTotal + orderTotal;
    
    // حساب النقاط الجديدة
    const newTotalPoints = Math.floor(newTotal / POINTS_PER_IQD);
    const earnedPoints = newTotalPoints - prevPoints;
    
    if(earnedPoints > 0) {
      // تحديث سجل النقاط
      const ptsData = {
        userId: uo._id,
        username: uo.username,
        userName: uo.name,
        totalSales: newTotal,
        totalPoints: newTotalPoints,
        redeemedPoints: parseInt(pointsDoc?.redeemedPoints || 0),
        updatedAt: new Date().toLocaleDateString('ar-IQ')
      };
      
      if(pointsDoc?._id) {
        await fbUpdate('points', pointsDoc._id, ptsData).catch(()=>{});
      } else {
        await fbAdd('points', ptsData).catch(()=>{});
      }
      
      // إضافة سجل في تاريخ النقاط
      const histParentId = pointsDoc?._id || uo._id;
      await fbAddSub('points', histParentId, 'history', {
        type: 'earn',
        points: earnedPoints,
        orderTotal: orderTotal,
        totalSalesReached: newTotal,
        orderId: orderId,
        shopName: shopName,
        date: new Date().toLocaleDateString('ar-IQ'),
        note: `${earnedPoints} نقطة مقابل ${orderTotal.toLocaleString()} د.ع`
      }).catch(()=>{});
      
      // إشعار للمستخدم
      toast(`⭐ مبارك! ربحت ${earnedPoints} نقطة جديدة`, true);
      
      // إشعار في قاعدة البيانات
      await fbAdd('notifications', {
        title: '⭐ نقاط جديدة!',
        body: `حصلت على ${earnedPoints} نقطة. إجمالي نقاطك: ${newTotalPoints}`,
        type: 'info', read: false,
        targetUser: uo.username,
        date: new Date().toLocaleDateString('ar-IQ')
      }).catch(()=>{});
      
    } else {
      // تحديث إجمالي المبيعات حتى لو لم تتراكم نقطة جديدة
      const ptsData = {
        userId: uo._id,
        username: uo.username,
        userName: uo.name,
        totalSales: newTotal,
        totalPoints: newTotalPoints,
        redeemedPoints: parseInt(pointsDoc?.redeemedPoints || 0),
      };
      if(pointsDoc?._id) {
        await fbUpdate('points', pointsDoc._id, ptsData).catch(()=>{});
      } else {
        await fbAdd('points', ptsData).catch(()=>{});
      }
    }
  } catch(e) {
    console.warn('Points award error:', e);
  }
}
