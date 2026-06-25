// Utility for high-DPI HTML5 Canvas PDF rendering for Kazakhstan Oil Depots (SmartME)
import { Hub } from '../types';

export function renderHubPDF(activeHub: Hub, operatorName: string) {
  // Setup standard A4 size at 150 DPI: 1240 x 1754
  const canvas = document.createElement('canvas');
  canvas.width = 1240;
  canvas.height = 1754;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Fill pristine white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1240, 1754);

  // 2. Draw luxury Navy and Gold margins
  ctx.strokeStyle = '#1e3a8a';
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, 1180, 1694);

  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(40, 40, 1160, 1674);

  // 3. Official Header block
  ctx.fillStyle = '#0f172a'; // Deep slate
  ctx.fillRect(50, 50, 1140, 120);

  ctx.fillStyle = '#eab308'; // Amber separator
  ctx.fillRect(50, 170, 1140, 6);

  // Header Texts
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('MERCURY ENERGY LLC • СИСТЕМНЫЙ СЕКТОР МОНИТОРИНГА SMARTME', 80, 95);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px sans-serif';
  // Fully supported Kazakh Cyrillic glyphs inside the drawn text
  ctx.fillText('Қазақстан мұнай базаларының ағымдағы күйі', 80, 140);

  // 4. Metadata Info Block
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Резервуарларды бақылау және телеметрияның жүйелік есебі', 50, 220);

  ctx.font = '14px sans-serif';
  ctx.fillText('Шығарылған уақыты: ' + new Date().toLocaleString('kk-KZ'), 50, 248);
  ctx.fillText('Нысан / Белсенді Хаб: ' + activeHub.name + ` (${activeHub.lat.toFixed(3)}° N, ${activeHub.lng.toFixed(3)}° E)`, 50, 274);
  ctx.fillText('Тексерген оператор: ' + (operatorName || 'Ахметжанов Мақсат Ақанұлы'), 50, 300);

  // 5. Stat Cards Calculations
  const reservoirs = activeHub.reservoirs || [];
  const totalCapacity = reservoirs.reduce((sum, r) => sum + r.capacity, 0);
  const totalVolume = reservoirs.reduce((sum, r) => sum + r.volume, 0);
  const avgTemp = reservoirs.length > 0 ? (reservoirs.reduce((sum, r) => sum + r.temperature, 0) / reservoirs.length) : 0;
  const fillPctAverage = totalCapacity > 0 ? (totalVolume / totalCapacity) * 100 : 0;

  // Render 3 stats cards
  // Card 1
  ctx.shadowColor = 'rgba(0,0,0,0.04)';
  ctx.shadowBlur = 6;
  ctx.fillStyle = '#f0fdf4';
  ctx.strokeStyle = '#bbf7d0';
  ctx.fillRect(70, 340, 330, 90);
  ctx.strokeRect(70, 340, 330, 90);
  ctx.shadowColor = 'transparent';

  ctx.fillStyle = '#166534';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('ЖАЛПЫ СЫЙЫМДЫЛЫҚ (CAPACITY)', 90, 368);
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(totalCapacity.toLocaleString() + ' м³', 90, 405);

  // Card 2
  ctx.fillStyle = '#f0f9ff';
  ctx.strokeStyle = '#bae6fd';
  ctx.fillRect(455, 340, 330, 90);
  ctx.strokeRect(455, 340, 330, 90);

  ctx.fillStyle = '#075985';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('АҒЫМДАҒЫ ОТЫН ҚАЛДЫҒЫ (STOCK)', 475, 368);
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(totalVolume.toLocaleString() + ' м³ (' + fillPctAverage.toFixed(0) + '%)', 475, 405);

  // Card 3
  ctx.fillStyle = '#fffbeb';
  ctx.strokeStyle = '#fef08a';
  ctx.fillRect(840, 340, 330, 90);
  ctx.strokeRect(840, 340, 330, 90);

  ctx.fillStyle = '#854d0e';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('ОРТАША ОТЫН ТЕМПЕРАТУРАСЫ', 860, 368);
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(avgTemp.toFixed(1) + ' °C', 860, 405);

  // 6. Grid Tables Layout
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(50, 470, 1140, 42);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('ID', 70, 496);
  ctx.fillText('Отын Маркасы (Brand)', 180, 496);
  ctx.fillText('Макс. Көлемі', 460, 496);
  ctx.fillText('Ағымдағы Мөлшер', 620, 496);
  ctx.fillText('Прогресс / Толықтығы', 780, 496);
  ctx.fillText('Подтоварная Су (H2O)', 980, 496);
  ctx.fillText('Күйі (Status)', 1110, 496);

  let currentY = 512;
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;

  reservoirs.forEach((res, index) => {
    // Alternating row background
    if (index % 2 === 1) {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(50, currentY, 1140, 38);
    }

    // Row outline
    ctx.beginPath();
    ctx.moveTo(50, currentY + 38);
    ctx.lineTo(1190, currentY + 38);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(res.id, 70, currentY + 24);
    ctx.fillText(res.fuel, 180, currentY + 24);

    ctx.font = '12px sans-serif';
    ctx.fillText(res.capacity.toLocaleString() + ' м³', 460, currentY + 24);
    ctx.fillText(res.volume.toLocaleString() + ' м³', 620, currentY + 24);

    const fillPercent = (res.volume / res.capacity) * 100;
    ctx.fillText(fillPercent.toFixed(0) + '%', 780, currentY + 24);

    // Mini linear level progress bar inside cell
    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(825, currentY + 14, 110, 11);
    ctx.fillStyle = fillPercent > 80 ? '#10b981' : fillPercent > 40 ? '#3b82f6' : '#f59e0b';
    ctx.fillRect(826, currentY + 15, Math.ceil((fillPercent / 100) * 108), 9);

    // Water height + alarm triggers
    if (res.waterLevel > 5) {
      ctx.fillStyle = '#dc2626'; // bold warning flags red
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('⚠️ ' + res.waterLevel + ' см', 980, currentY + 24);
    } else {
      ctx.fillStyle = '#475569';
      ctx.fillText(res.waterLevel + ' см', 980, currentY + 24);
    }

    // Status display
    if (res.isOpen) {
      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('БЕЛСЕНДІ (OK)', 1110, currentY + 24);
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('ҚЫЗМЕТТЕ (OFF)', 1110, currentY + 24);
    }

    currentY += 38;
  });

  // 7. Interactive Bar Chart section
  const chartY = Math.max(currentY + 50, 1130);

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(50, chartY, 1140, 250);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.strokeRect(50, chartY, 1140, 250);

  // Chart Title
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('Резервуарлардың толу деңгейлерінің графикалық көрсеткіші (%)', 70, chartY + 28);

  // Plot X-Axis baseline
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(90, chartY + 200);
  ctx.lineTo(1150, chartY + 200);
  ctx.stroke();

  // Draw columns
  const barCount = reservoirs.length || 1;
  const barWidth = Math.min(45, Math.floor(920 / barCount));
  const spacing = Math.min(18, Math.floor(100 / barCount));
  let startX = 110;

  reservoirs.forEach((res) => {
    const fillPercent = (res.volume / res.capacity) * 100;
    const barHeight = Math.ceil((fillPercent / 100) * 135);
    const topY = chartY + 200 - barHeight;

    // Color code matching brand
    let fillStyle = '#3b82f6';
    if (res.fuel.includes('95')) fillStyle = '#a855f7';
    else if (res.fuel.includes('92')) fillStyle = '#eab308';
    else if (res.fuel.toLowerCase().includes('дт') || res.fuel.toLowerCase().includes('diesel')) fillStyle = '#10b981';
    else if (res.fuel.includes('Jet') || res.fuel.includes('ТС')) fillStyle = '#06b6d4';

    ctx.fillStyle = fillStyle;
    ctx.fillRect(startX, topY, barWidth, barHeight);

    // Frame
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.strokeRect(startX, topY, barWidth, barHeight);

    // Top Label %
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(fillPercent) + '%', startX + barWidth / 2, topY - 5);

    // Bottom Label ID
    ctx.fillText(res.id, startX + barWidth / 2, chartY + 218);
    ctx.textAlign = 'left';

    startX += barWidth + spacing;
  });

  // 8. Seal stamp & Hand-drawn design signatures
  const sealBaseY = chartY + 280;

  // Signature lines
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, sealBaseY + 110);
  ctx.lineTo(380, sealBaseY + 110);
  ctx.stroke();

  ctx.fillStyle = '#475569';
  ctx.font = '12px sans-serif';
  ctx.fillText('Бас менеджер / Оператор қолы', 80, sealBaseY + 128);

  // Handwritten blue ink signature wave
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(110, sealBaseY + 105);
  ctx.bezierCurveTo(140, sealBaseY + 75, 170, sealBaseY + 115, 200, sealBaseY + 95);
  ctx.bezierCurveTo(220, sealBaseY + 80, 240, sealBaseY + 105, 280, sealBaseY + 90);
  ctx.stroke();

  // Draw Double Circular Stamps (Official Ministry look)
  const stampX = 980;
  const stampY = sealBaseY + 95;

  ctx.strokeStyle = 'rgba(29, 78, 216, 0.85)'; // Ink stamp color
  ctx.lineWidth = 2.5;

  // Outside circle
  ctx.beginPath();
  ctx.arc(stampX, stampY, 68, 0, Math.PI * 2);
  ctx.stroke();

  // Inside circle
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(stampX, stampY, 58, 0, Math.PI * 2);
  ctx.stroke();

  // Circular labels inside seal stamp
  ctx.fillStyle = 'rgba(29, 78, 216, 0.85)';
  ctx.textAlign = 'center';

  ctx.font = 'bold 8px sans-serif';
  ctx.fillText('МҰНАЙ ТАСЫМАЛДАУ СЕКТОРЫ', stampX, stampY - 32);

  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('MERCURY', stampX, stampY - 6);
  ctx.fillText('LOGISTICS', stampX, stampY + 14);

  ctx.font = 'bold 8px sans-serif';
  ctx.fillText('★ SmartME ТЕРМИНАЛЫ ★', stampX, stampY + 36);
  ctx.textAlign = 'left';

  // Output to image and trigger direct pop-up print window
  const finalImage = canvas.toDataURL('image/jpeg', 0.95);
  const win = window.open('', '_blank');
  if (!win) {
    alert("Браузер поп-ап терезелерді бұғаттады. Есепті баспаға шығару үшін поп-ап терезелерді ашуға рұқсат беріңіз!");
    return;
  }

  win.document.write(`
    <html>
      <head>
        <title>SmartME Есебі - ${activeHub.name} (${new Date().toLocaleDateString()})</title>
        <style>
          body { margin: 0; background-color: #334155; display: flex; justify-content: center; align-items: start; padding: 25px; font-family: sans-serif; }
          img { max-width: 950px; width: 100%; box-shadow: 0 12px 35px rgba(0,0,0,0.6); background-color: white; border-radius: 4px; }
          @media print {
            img { max-width: 100% !important; box-shadow: none !important; margin: 0; border-radius: 0; }
            body { background: white; padding: 0; }
          }
        </style>
      </head>
      <body>
        <img src="${finalImage}" />
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `);
  win.document.close();
}
