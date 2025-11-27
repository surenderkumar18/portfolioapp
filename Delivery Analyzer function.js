// Delivery Analyzer - Full Upgraded Version
// Matches OI Analyzer visual style, includes: colored bars, triple-bar profile,
// entry type detection (REG/PB/BB/TP), spike/cluster highlight, cumulative flow,
// divergence engine, and larger font variations for big Delivery Values.

function runDeliveryAnalyzer() {
  console.clear();

  // =========================
  // CONFIG / SETTINGS
  // =========================
  const SETTINGS = {
    VALUE_BAR_LEN: 28,
    QTY_BAR_LEN: 20,
    PCT_BAR_LEN: 14,
    PRICE_BAR_LEN: 25,

    FONT_SIZES: [10, 12, 14, 18, 22, 28, 32, 36], // five tiers for DelVal Cr

    // thresholds
    CLUSTER_MULT: 1.2,          // cluster threshold relative to avg
    SPIKE_MULT: 2.0,            // spike threshold relative to avg
    DIP_ACCUM_MULT: 1.3,        // dip accumulation multiplier

    // entry detection distances (percent of range)
    ENTRY_PULLBACK_PCT: 0.03,   // 3% pullback threshold
    ENTRY_BREAKOUT_PCT: 0.02,   // 2% breakout threshold

    // running sums window
    CUM_WINDOW: 20
  };

  // =========================
  // Utilities
  // =========================
  const cleanNum = (v) => { const s = String(v ?? "").replace(/[^0-9.-]/g, ""); 
  const n = parseFloat(s); return isFinite(n) ? n : 0; };
  const avg = (arr) => (arr && arr.length) ? arr.reduce((a,b)=>a+b,0)/arr.length : 0;
  const fmtCr = (n) => `₹${(n).toFixed(2)} Cr`;
  const fmtNumIN = (n) => { try { return (Math.abs(n)).toLocaleString('en-IN'); } catch(e){ return String(n); } };
  const sign = (n) => n>0?'+': (n<0?'-':'');

  // =========================
  // Data acquisition
  // =========================
  if (typeof DELIVERYDATA === 'undefined') {
    console.error('Please provide DELIVERYDATA global object with stock data.');
    return;
  }

  const symbol = Object.keys(DELIVERYDATA)[0];
  let rows = (DELIVERYDATA[symbol] || []).map(r => ({ ...r }));
  if (!rows.length) { console.error('No rows in DELIVERYDATA for symbol'); return; }
  //rows = rows.reverse(); // newest-first

  // =========================
  // Normalize & compute fields
  // =========================
  rows = rows.map(r => {
    const price = cleanNum(r['close price']);
    const delQty = cleanNum(r['Delivered qty']);
    const tradedQty = cleanNum(r['Traded qty']);
    const deliveryPct = cleanNum(r['Delivery %']);
    const changePct = cleanNum(r['Change %']);
    const deliveryValue = (delQty * price) / 1e7; // Cr
    return { raw: r, DATE: r.DATE, price, changePct, tradedQty, delQty, deliveryPct, deliveryValue };
  });

  // basic ranges
  const maxDelValue = Math.max(...rows.map(r=>r.deliveryValue||0), 1);
  const minDelValue = Math.min(...rows.map(r=>r.deliveryValue||maxDelValue), 0);
  const maxDelQty = Math.max(...rows.map(r=>r.delQty||0), 1);
  const maxPrice = Math.max(...rows.map(r=>r.price||0), 1);
  const minPrice = Math.min(...rows.map(r=>r.price||maxPrice), 0);

  // 20-day baselines
  const N_BASE = Math.min(20, rows.length);
  const baseline = rows.slice(0, N_BASE);
  const avgDelValue20 = avg(baseline.map(r=>r.deliveryValue));
  const avgDelQty20 = avg(baseline.map(r=>r.delQty));
  const avgDelPct20 = avg(baseline.map(r=>r.deliveryPct));
  const avgVol20 = avg(baseline.map(r=>r.tradedQty));

  // cumulative running sum (newest-first) for last CUM_WINDOW days
  let runningSum = 0;
  for (let i = 0; i < rows.length; i++) {
    runningSum += rows[i].deliveryValue;
    rows[i].cumValue = runningSum; // Cr cumulative
  }

  // =========================
  // Bars helpers (log-normal for value, linear for others)
  // =========================
  
  //const BAR_FILLED = "█";
  //const BAR_EMPTY  = "░";
  
  const BAR_FILLED = "█";
  const BAR_EMPTY  = " ";   // ← replace dot with space
  
  
  function repeatBar(chars, n) { return chars.repeat(Math.max(0, n)); }

  function valueBarLog(val, minv, maxv, len) {
	  const v = Math.max(val, 0.000001);

	  const logA = Math.log(Math.max(minv, 0.000001));
	  const logB = Math.log(maxv);
	  const logRatio = (Math.log(v) - logA) / (logB - logA);

	  const linearRatio = (v - minv) / (maxv - minv);

	  const ratio = (linearRatio * 0.4) + (logRatio * 0.6);

	  const filled = Math.round(Math.max(0, Math.min(1, ratio)) * len);

	  return BAR_FILLED.repeat(filled) + BAR_EMPTY.repeat(len - filled);
	}


	function linearBar(val, maxv, len) {
	  const ratio = Math.min(1, Math.max(0, val / (maxv || 1)));
	  const filled = Math.round(ratio * len);
	  return BAR_FILLED.repeat(filled) + BAR_EMPTY.repeat(len - filled);
	}



  // =========================
  // Scoring (advanced institutional) - reuse previous computeAdvancedScore with slight tweaks
  // =========================
  function computeAdvancedScore(idx){
    const r = rows[idx];
    const valueRatio = avgDelValue20 > 0 ? r.deliveryValue / avgDelValue20 : 1;
    const qtyRatio = avgDelQty20 > 0 ? r.delQty / avgDelQty20 : 1;
    const pctRatio = avgDelPct20 > 0 ? r.deliveryPct / avgDelPct20 : 1;

    const r1 = rows[idx+1] ?? r;
    const r2 = rows[idx+2] ?? r1;
    const momentumValue = r.deliveryValue - (r2.deliveryValue ?? r.deliveryValue);
    const momentumPrice = r.price - (r2.price ?? r.price);

    const clusterWindow = rows.slice(Math.max(0, idx-9), idx+1);
    const clusterCount = clusterWindow.filter(x => x.deliveryValue >= (avgDelValue20 * SETTINGS.CLUSTER_MULT)).length;

    const uVal = Math.min(valueRatio / 4, 1);
    const uQty = Math.min(qtyRatio / 3, 1);
    const uPct = Math.min(pctRatio / 2, 1);

    const w_value = 0.36, w_qty = 0.18, w_pct = 0.12, w_mom = 0.12, w_cluster = 0.12, w_priceAlign = 0.10;

    const priceAlign = (r.changePct > 0 && r.deliveryValue > avgDelValue20) ? 1 : (r.changePct < 0 && r.deliveryValue > avgDelValue20 ? -0.6 : 0);

    const momValNorm = Math.tanh((momentumValue||0)/(avgDelValue20||1));
    const momPriceNorm = Math.tanh((momentumPrice||0)/((maxPrice-minPrice)||1));
    const momCombined = (momValNorm + momPriceNorm)/2;

    const clusterScore = Math.min(clusterCount/5,1);

    let raw = (uVal*w_value + uQty*w_qty + uPct*w_pct + ((momCombined+1)/2)*w_mom + clusterScore*w_cluster + ((priceAlign+1)/2)*w_priceAlign) * 100;

    if (r.deliveryValue >= avgDelValue20 * SETTINGS.SPIKE_MULT) raw += 10; // spike boost
    if (clusterCount >= 3 && r.deliveryValue >= avgDelValue20 * 1.1) raw += 6;
    if (r.changePct < 0 && r.deliveryValue > avgDelValue20 && momCombined > 0) raw += 5;
    if (r.changePct > 0 && r.deliveryValue < avgDelValue20) raw -= 6;

    raw = Math.max(0, Math.min(100, Math.round(raw)));
    return { score: raw, components: { valueRatio, qtyRatio, pctRatio, momCombined, clusterCount, priceAlign } };
  }

  // =========================
  // Signal, Action, Warn mapping (enhanced)
  // =========================
  function mapSignal(r, score, comps){
    if (score >= 85 && comps.clusterCount >= 2) return 'High Accumulation';
    if (score >= 70) return 'Silent Accumulation';
    if (score >= 55) return 'Healthy Demand';
    if (r.deliveryValue >= avgDelValue20 * SETTINGS.DIP_ACCUM_MULT && r.changePct < 0) return 'Dip Accumulation';
    if (score >= 40) return 'Weak Accumulation';
    return 'Distribution / Noise';
  }
  function mapAction(signal, score){
    if (signal === 'High Accumulation') return 'BUY';
    if (signal === 'Silent Accumulation') return score >= 75 ? 'BUY' : 'WATCH';
    if (signal === 'Healthy Demand') return 'WATCH';
    if (signal === 'Dip Accumulation') return 'BUY';
    return 'AVOID';
  }
  function mapWarn(r){
    if (r.changePct > 0 && r.deliveryPct < avgDelPct20) return 'Price↑ Delivery↓';
    if (r.changePct < 0 && r.deliveryValue > avgDelValue20) return 'HighValue on DownDay';
    return '-';
  }

  // =========================
  // Entry Type detection (REG / PB / BB / TP)
  // Uses price relation to recent high/low and momentum
  // =========================
  function detectEntryType(idx){
    const r = rows[idx];
    const lookBack = Math.min(30, rows.length - 1);
    const window = rows.slice(Math.min(rows.length-1, idx+1), Math.min(rows.length-1, idx+1+lookBack));
    // window holds previous days (older) because newest-first ordering
    const highs = window.map(x=>x.price);
    const lows = window.map(x=>x.price);
    const recentHigh = Math.max(...(highs.length?highs:[r.price]));
    const recentLow = Math.min(...(lows.length?lows:[r.price]));

    const range = Math.max(1, recentHigh - recentLow);
    const toHighPct = (recentHigh - r.price)/range;
    const toLowPct = (r.price - recentLow)/range;

    // breakout: price near or above recent high by small margin
    if (toHighPct <= SETTINGS.ENTRY_BREAKOUT_PCT) return 'BB';
    // pullback: price near recent low with accumulation
    if (toLowPct <= SETTINGS.ENTRY_PULLBACK_PCT) return 'PB';
    // regular otherwise
    return 'REG';
  }

  // =========================
  // Divergence Engine: volume vs delivery
  // =========================
  function detectDivergence(r, prev){
    if (!prev) return null;
    // volume up but delivery% down -> retail pump
    if (r.tradedQty > prev.tradedQty * 1.25 && r.deliveryPct < prev.deliveryPct * 0.9) return 'Vol↑ Del%↓ (Retail Pump)';
    // delivery up but volume flat -> stealth accumulation
    if (r.deliveryValue > prev.deliveryValue * 1.2 && r.tradedQty <= prev.tradedQty * 1.1) return 'Del↑ Vol~ (Stealth)';
    return null;
  }

  // =========================
  // Color mapping for bars by signal
  // =========================
  const COLORS = {
    green: '#13814b',
    softGreen: '#66BB6A',
    red: '#c8062e',
	softRed: '#EF9A9A',
    orange: '#FB8C00',
    cyan: '#039BE5',
    softGold: '#D7B56D',
    amberSoft: '#D9A441',
    neutral: '#9e9e9e',
    empty: '#363636',
    darkBg: '#1d1d1d',
	offWhite:  '#f7e5e5',
  };

  // =========================
  // Console Header
  // =========================
  function pageTitle(){ const h1 = document.querySelector('h1'); return h1? h1.textContent.trim().replace(/\s+/g,' '): `${symbol} Delivery Analyzer`; }
  const TITLE = pageTitle();
  console.log(`%c${TITLE}%c ::::::  DELIVERY ANALYZER`, `color:#00bcd4; font-size:26px; font-weight:900;`, `color:#80d8ff; font-size:14px; font-weight:bold;`);
  console.log(`%cDate │ DelVal Bar (₹ Cr)                 │ Val(Δ)      │ DelQty     │ Del%   │ Price Bar                     │ Price    │ %Chg    │ Score    │ Signal            │ Action │ Entry │ Warn │ Divergence`, `background:${COLORS.darkBg}; color:#e0e0e0; font-weight:bold; padding:4px 2px;`);

  // =========================
  // Iterate rows and print
  // =========================
  for (let idx = 0; idx < rows.length; idx++){
    const r = rows[idx];
    const prev = rows[idx+1] ?? r;

    // bars
    const delValBar = linearBar(r.deliveryValue, Math.max(maxDelValue, 1), SETTINGS.VALUE_BAR_LEN);

    const delQtyBar = linearBar(r.delQty, Math.max(maxDelQty,1), SETTINGS.QTY_BAR_LEN);
    const delPctBar = linearBar(r.deliveryPct, Math.max(100, avgDelPct20*2), SETTINGS.PCT_BAR_LEN);
    const priceBar = linearBar(r.price - minPrice, maxPrice - minPrice || 1, SETTINGS.PRICE_BAR_LEN);

    // score, comps
    const { score, components } = computeAdvancedScore(idx);
    const signal = mapSignal(r, score, components);
    const action = mapAction(signal, score);
    const warn = mapWarn(r);
    const entry = detectEntryType(idx);
    const divergence = detectDivergence(r, prev) || '-';

    // Determine bar color by signal
    let barColor = COLORS.green;
    if (signal === 'High Accumulation') barColor = COLORS.green;
    else if (signal === 'Silent Accumulation') barColor = COLORS.softGreen;
    else if (signal === 'Dip Accumulation') barColor = COLORS.cyan;
    else if (signal === 'Weak Accumulation') barColor = COLORS.orange;
    else barColor = COLORS.red;

    // DelVal Cr and delta
    const delValCr = r.deliveryValue;
    const prevValCr = prev.deliveryValue || 0;
    const deltaCr = delValCr - prevValCr;
    const delValCrStr = `${fmtCr(delValCr)}`.padEnd(12);
    const deltaCrStr = deltaCr >= 0 ? `+${fmtCr(deltaCr)}` : `-${fmtCr(Math.abs(deltaCr))}`;
	
	// Determine deltaCr font size (6-level scaling)
	const absDelta = Math.abs(deltaCr);
	const pctOfMaxDelta = maxDelValue > 0 ? absDelta / maxDelValue : 0;
	
	const DELTA_FONT_SIZES = [4, 5, 6, 7, 8, 9, 10, 11];

	
	let deltaFontIdx = 0;
	if (pctOfMaxDelta >= 0.90) deltaFontIdx = 7;        // insane spike/dump
	else if (pctOfMaxDelta >= 0.70) deltaFontIdx = 6;
	else if (pctOfMaxDelta >= 0.50) deltaFontIdx = 5;
	else if (pctOfMaxDelta >= 0.35) deltaFontIdx = 4;
	else if (pctOfMaxDelta >= 0.22) deltaFontIdx = 3;
	else if (pctOfMaxDelta >= 0.12) deltaFontIdx = 2;
	else if (pctOfMaxDelta >= 0.05) deltaFontIdx = 1;
	else deltaFontIdx = 0;

	const deltaFontSize = DELTA_FONT_SIZES[deltaFontIdx];


    // Font size bucket for DelVal (8-level scaling)
	const maxV = maxDelValue;
	const pctOfMax = maxV > 0 ? (delValCr / maxV) : 0;

	let fontIdx = 0;

	if      (pctOfMax >= 0.92) fontIdx = 7;  // 36px
	else if (pctOfMax >= 0.78) fontIdx = 6;  // 32px
	else if (pctOfMax >= 0.62) fontIdx = 5;  // 28px
	else if (pctOfMax >= 0.48) fontIdx = 4;  // 22px
	else if (pctOfMax >= 0.34) fontIdx = 3;  // 18px
	else if (pctOfMax >= 0.20) fontIdx = 2;  // 14px
	else if (pctOfMax >= 0.10) fontIdx = 1;  // 12px
	else                       fontIdx = 0;  // 10px

	const fontSize = SETTINGS.FONT_SIZES[fontIdx];


    // Score color
    const scoreColor = score >= 80 ? COLORS.green : score >= 60 ? COLORS.softGold : COLORS.red;
    const signalColor = signal.includes('Accumul') ? COLORS.green : signal.includes('Dip') ? COLORS.cyan : COLORS.red;
    const actionColor = action === 'BUY' ? COLORS.green : action === 'WATCH' ? COLORS.cyan : COLORS.neutral;

    // Build console format
    const fmt =
      `%c${(r.DATE||'').padEnd(10)} │ ` +
      `%c ${fmtNumIN(r.delQty).padEnd(11)} │ ` +
      `%c ${r.deliveryPct.toFixed(2).padEnd(6)} │ ` +
      `%c ${priceBar}   │ %c` +
      `%c ${('₹'+r.price.toFixed(2)).padEnd(10)} │ ` +
      `%c ${r.changePct.toFixed(2).padEnd(7)} │ ` +
      `%c ${('Score '+score).padEnd(8)} │ ` +
      `%c ${signal.padEnd(22)} │ ` +
      `%c ${action.padEnd(6)} │ ` +
      `%c ${entry.padEnd(4)} │ ` +
      `%c ${warn.padEnd(20)} │ ` +
      `%c ${divergence.padEnd(24)} │ ` +
      //`%c│ ` +
      `%c${delValBar} │ %c` +
      `%c${delValCrStr} %c(${deltaCrStr}) │ `;

    const styles = [
      // date
      `color:${COLORS.neutral}; font-weight:bold; font-family:monospace;`,
      
      // delQty
      `color:${COLORS.neutral};  font-weight:bold; font-family:monospace; font-size: 14px;`,
      // delPct
      `color:${r.deliveryPct >= avgDelPct20 ? COLORS.green : COLORS.neutral};`,
      // price bar
      `color:${r.price > prev.price ? COLORS.green : (r.price < prev.price ? COLORS.red : COLORS.neutral)}; font-weight:bold;`,
      `color:${COLORS.empty};`,
      // price value
      `color:${r.price > prev.price ? COLORS.green : (r.price < prev.price ? COLORS.red : COLORS.neutral)}; font-family:monospace; font-weight:bold;`,
      // change pct
      `color:${r.changePct > 0 ? COLORS.green : (r.changePct < 0 ? COLORS.red : COLORS.neutral)};`,
      // score
      `color:${scoreColor}; font-weight:bold;`,
      // signal
      `color:${signalColor}; font-weight:bold;`,
      // action
      `color:${actionColor}; font-weight:bold;`,
      // entry
      `color:#ffffff; font-weight:bold;`,
      // warn
      `color:${warn==='-'?COLORS.neutral:COLORS.orange};`,
      // divergence
      `color:${divergence==='-'?COLORS.neutral:COLORS.cyan}; font-weight:bold;`,
	  //`color:${COLORS.empty};`,
      // delVal bar (colored by signal)
      `color:${barColor}; font-weight:bold;`,
      `color:${COLORS.empty};`,
      // delValCr (dynamic sized)
		`color:${COLORS.amberSoft};
		 font-weight:bold;
		 font-family:monospace;
		 font-size:${fontSize}px;`,

		// deltaCr (fixed 12px)
		`color:${deltaCr >= 0 ? COLORS.softGreen : COLORS.softRed};
		 font-weight:bold;
		 font-family:monospace;
		 font-size:12px;`,


    ];

    console.log(fmt, ...styles);

    // Additional three-line compact profile (optional visual stacking) -> small extra lines to mimic UI density
    //const profileFmt = `%c     %cVal:%c ${delValBar} %c %cQty:%c ${delQtyBar} %c %cDel%%:%c ${delPctBar}`;
    const profileStyles = [
      `color:${COLORS.empty};`,
      `color:${COLORS.neutral}; font-weight:bold;`,
      `color:${barColor};`,
      `color:${COLORS.empty};`,
      `color:${COLORS.neutral}; font-weight:bold;`,
      `color:${COLORS.neutral};`,
      `color:${COLORS.empty};`,
      `color:${COLORS.neutral}; font-weight:bold;`,
      `color:${COLORS.neutral};`
    ];
    //console.log(profileFmt, ...profileStyles);
       //console.log( ...profileStyles);

  } // end for

  // final summary
  console.table([
    { Check: '20-day Avg Del Value', Value: fmtCr(avgDelValue20) },
    { Check: '20-day Avg Del Qty', Value: `${Math.round(avgDelQty20).toLocaleString()}` },
    { Check: '20-day Avg Del %', Value: `${avgDelPct20.toFixed(2)}%` },
    { Check: 'Rows', Value: rows.length },
    { Check: 'Cumulative Last', Value: fmtCr(rows[rows.length-1]?.cumValue || 0) }
  ]);

  console.log('Delivery Analyzer (all upgrades) executed.');
}

// USAGE: ensure DELIVERYDATA global is present and then call runDeliveryAnalyzer();
