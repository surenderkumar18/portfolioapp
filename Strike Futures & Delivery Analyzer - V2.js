	

function runDeliveryAnalyzer() {
  console.clear();
  console.log("📊 NSE Delivery Data — Professional Daily Analysis (Last 10 Days)\n---------------------------------------------------");

  // ✅ Locate delivery rows
  const rows = document.querySelectorAll('.volumeDelevery-tables .ag-center-cols-container [role="row"]');
  if (!rows.length) {
    console.error("❌ No delivery table rows found. Please open the 'Volume & Delivery' tab first.");
    return;
  }

    
  // ✅ Extract latest 10 rows
  const data = Array.from(rows).map(row => ({
    date: row.querySelector('[col-id="dateTime"]')?.textContent.trim(),
    close: parseFloat(row.querySelector('[col-id="close"] span')?.textContent.replace(/,/g, "") || 0),
    change: parseFloat(row.querySelector('[col-id="changePerc"] span')?.textContent.replace(/%|,/g, "") || 0),
    traded: parseFloat(row.querySelector('[col-id="volume"] span')?.textContent.replace(/,/g, "") || 0),
    deliveryQty: parseFloat(row.querySelector('[col-id="deliveryVolume"] span')?.textContent.replace(/,/g, "") || 0),
    deliveryPerc: parseFloat(row.querySelector('[col-id="deliveryPerc"] span')?.textContent.replace(/,/g, "") || 0)
  }));
  if (data.length < 3) {
    console.warn("⚠️ Need at least 3 days of data to compute trends.");
    return;
  }
  // ✅ Global constants
  const TOL = 0.10; // 10% margin of tolerance
  const VALUE_MULT_TARGET = 1.5;
  const WEIGHTS = { value: 0.6, qty: 0.2, perc: 0.2 };

  // ✅ Format helpers
  const fmtIN = num => num.toLocaleString('en-IN');
  const fmtCrLakh = num => {
    if (num >= 1e7) return (num / 1e7).toFixed(2) + " Cr";
    if (num >= 1e5) return (num / 1e5).toFixed(2) + " Lakh";
    return fmtIN(num);
  };
  const diffPerc = (cur, avg) => (((cur - avg) / avg) * 100).toFixed(1);

  // ✅ Compute averages
  const avgPerc = data.reduce((a, b) => a + b.deliveryPerc, 0) / data.length;
  const avgQty = data.reduce((a, b) => a + b.deliveryQty, 0) / data.length;
  const avgValue = data.reduce((a, b) => a + (b.close * b.deliveryQty), 0) / data.length;

  // ✅ Today’s values
  const t = data[0];
  const todayValue = t.close * t.deliveryQty;

  // ✅ Individual strengths
  const percStr = t.deliveryPerc / avgPerc;
  const qtyStr = t.deliveryQty / avgQty;
  const valStr = todayValue / avgValue;

  // ✅ Weighted institutional footprint
  const weightedScoreRaw = (valStr * WEIGHTS.value) + (qtyStr * WEIGHTS.qty) + (percStr * WEIGHTS.perc);
  const weightedStatus =
    weightedScoreRaw >= 1.2 ? "✅ Strong" :
    weightedScoreRaw >= 1.0 ? "⚠️ Moderate" :
    weightedScoreRaw >= 0.8 ? "🟡 Neutral" : "❌ Weak";

  // ✅ Table results
  const results = [
    {
      "Check": "✅ Weighted Delivery Strength — Institutional Footprint",
      "Current (Today)": `₹Str ${valStr.toFixed(2)}, QtyStr ${qtyStr.toFixed(2)}, %Str ${percStr.toFixed(2)}`,
      "10-Day Average": "Composite Benchmark = 1.0",
      "Diff %": diffPerc(weightedScoreRaw, 1),
      "Status": weightedStatus
    },
    {
      "Check": "✅ Today Delivery % > 35% — Institutional Conviction",
      "Current (Today)": t.deliveryPerc.toFixed(2) + " %",
      "10-Day Average": avgPerc.toFixed(2) + " %",
      "Diff %": diffPerc(t.deliveryPerc, avgPerc) + "%",
      "Status": t.deliveryPerc >= 35 * (1 - TOL) ? (t.deliveryPerc >= 35 ? "✅ Pass" : "⚠️ Near") : "❌ Low"
    },
    {
      "Check": "✅ Delivered Qty > 10-Day Avg — Rising Participation",
      "Current (Today)": fmtCrLakh(t.deliveryQty),
      "10-Day Average": fmtCrLakh(avgQty),
      "Diff %": diffPerc(t.deliveryQty, avgQty) + "%",
      "Status": t.deliveryQty >= avgQty * (1 - TOL) ? (t.deliveryQty > avgQty ? "✅ Pass" : "⚠️ Near") : "❌ Weak"
    },
    {
      "Check": "✅ Delivery Value > 1.5× Avg — ₹ Inflow Strength",
      "Current (Today)": fmtCrLakh(todayValue),
      "10-Day Average": fmtCrLakh(avgValue),
      "Diff %": diffPerc(todayValue, avgValue) + "%",
      "Status": todayValue >= avgValue * (VALUE_MULT_TARGET * (1 - TOL))
        ? (todayValue > avgValue * VALUE_MULT_TARGET ? "✅ Pass" : "⚠️ Near") : "❌ Weak"
    },
    {
      "Check": "✅ Price ↑ + High Delivery → Accumulation",
      "Current (Today)": t.change.toFixed(2) + "%",
      "10-Day Average": "-",
      "Diff %": "-",
      "Status": t.change > 0 && weightedScoreRaw >= 1.0 ? "✅ Pass"
        : (t.change > 0 && weightedScoreRaw >= 0.9 ? "⚠️ Near" : "❌ No Accumulation")
    },
    {
      "Check": "✅ 3-Day Delivery Trend Rising — Absorption",
      "Current (Today)": `${fmtCrLakh(data[0].deliveryQty)} → ${fmtCrLakh(data[2].deliveryQty)}`,
      "10-Day Average": "-",
      "Diff %": "-",
      "Status": data[0].deliveryQty > data[1].deliveryQty && data[1].deliveryQty > data[2].deliveryQty
        ? "✅ Rising"
        : (data[0].deliveryQty > data[1].deliveryQty || data[1].deliveryQty > data[2].deliveryQty ? "⚠️ Partial" : "❌ Flat")
    }
  ];

  console.table(results, ["Check", "Current (Today)", "10-Day Average", "Diff %", "Status"]);

  // ✅ Score aggregation (1 = pass, 0.5 = near)
  const score = results.reduce((sum, r) => {
    if (r.Status.includes("✅")) return sum + 1;
    if (r.Status.includes("⚠️")) return sum + 0.5;
    return sum;
  }, 0);

  // ✅ Trend tracking (localStorage)
  try {
    const today = new Date().toISOString().split("T")[0];
    const key = "deliveryTracker";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const updated = [...existing.filter(d => d.date !== today), { date: today, score: score.toFixed(1) }].slice(-7);
    localStorage.setItem(key, JSON.stringify(updated));

    const blocks = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];
    const chart = updated.map(d => {
      const level = Math.min(blocks.length - 1, Math.round((d.score / 6) * (blocks.length - 1)));
      return blocks[level];
    }).join(" ");
    const trend = updated.map(d => `${d.date.slice(5)}:${d.score}`).join(" → ");
    const avg3 = updated.slice(-3).reduce((a, b) => a + parseFloat(b.score), 0) / Math.min(3, updated.length);

    console.log(`\n%c📆 7-Day Score Trend:`, "color:#0288d1; font-weight:bold; font-size:16px;");
    console.log(`%c${trend}\n📊 ${chart}`, "color:#00b0ff; font-size:14px;");
    console.log(`%c3-Day Avg Score: ${avg3.toFixed(2)} → ${avg3 >= 4 ? "📈 Bullish Continuation" : avg3 >= 3 ? "⚖️ Neutral Zone" : "📉 Weak Flow"}`,
      "color:#ffa000; font-weight:bold;");
  } catch (e) {
    console.warn("⚠️ Could not update 7-day tracker:", e);
  }

  // ✅ Final summary
  const scoreMap = {
    5.5: { text: "🔥 Strong Institutional Accumulation", color: "#00c853" },
    4.0: { text: "✅ Healthy Accumulation", color: "#2e7d32" },
    3.0: { text: "⚠️ Neutral / Watch", color: "#fbc02d" },
    2.0: { text: "🟡 Weak / Transition", color: "#ffb300" },
    1.0: { text: "🔻 Distribution / Exit Zone", color: "#d32f2f" }
  };
  const interpretation =
    score >= 5 ? scoreMap[5.5].text :
    score >= 4 ? scoreMap[4.0].text :
    score >= 3 ? scoreMap[3.0].text :
    score >= 2 ? scoreMap[2.0].text : scoreMap[1.0].text;
  const color =
    score >= 5 ? scoreMap[5.5].color :
    score >= 4 ? scoreMap[4.0].color :
    score >= 3 ? scoreMap[3.0].color :
    score >= 2 ? scoreMap[2.0].color : scoreMap[1.0].color;

  console.log(`\n%c📈 Final Score: ${score.toFixed(1)}/6 → ${interpretation}`,
    `color:${color}; font-size:20px; font-weight:bold; font-family:Segoe UI;`);

  // ✅ Professional Read
  console.log(`\n%c🧠 Professional Read:`, "color:#df3079; font-weight:bold; font-size:16px;");
  if (score >= 5) console.log("→ Smart money accumulation visible. Add to watchlist for EMA breakout confirmation.");
  else if (score >= 4) console.log("→ Strong footprint but moderate conviction. Monitor next session for follow-through.");
  else if (score >= 3) console.log("→ Mixed behavior. Wait for trend confirmation or delivery support.");
  else console.log("→ Weak / distribution phase. Avoid new longs until delivery strengthens.");

  // ✅ Scoring Documentation
  (function printScoringDoc() {
    try {
      const tolPct = Math.round(TOL * 100);
      console.log(`\n%c📘 Scoring Documentation: How numbers are computed`,
        "color:#e9950c; font-weight:bold; font-size:16px;");
      console.log(`%cInputs (Today vs 10D Avg):`, "color:#e9950c; font-weight:bold;");
      console.log(`• Today Delivery %: ${t.deliveryPerc.toFixed(2)}%  |  10D Avg: ${avgPerc.toFixed(2)}%`);
      console.log(`• Today Delivery Qty: ${fmtIN(t.deliveryQty)}  |  10D Avg: ${fmtIN(avgQty)}`);
      console.log(`• Today Delivery Value: ${fmtCrLakh(todayValue)}  |  10D Avg: ${fmtCrLakh(avgValue)}`);
      console.log(`\n%cStrength Ratios (Today ÷ 10D Avg):`, "color:#e9950c; font-weight:bold;");
      console.log(`• Conviction (Delivery %): ${percStr.toFixed(2)}`);
      console.log(`• Participation (Delivery Qty): ${qtyStr.toFixed(2)}`);
      console.log(`• Money Flow (₹ Value): ${valStr.toFixed(2)}`);
      console.log(`• Weighted Composite = (₹×${WEIGHTS.value} + Qty×${WEIGHTS.qty} + %×${WEIGHTS.perc}) = ${weightedScoreRaw.toFixed(2)}`);
      console.log(`\n%cRule Targets & Tolerance (±${tolPct}%):`, "color:#e9950c; font-weight:bold;");
      console.log(`• Delivery % ≥ 35%, Near ≥ ${(35*(1-TOL)).toFixed(1)}%`);
      console.log(`• Qty ≥ 1.0× avg, Near ≥ ${(1-TOL).toFixed(2)}×`);
      console.log(`• Value ≥ 1.5× avg, Near ≥ ${(1.5*(1-TOL)).toFixed(2)}×`);
      console.log(`• Composite: Strong ≥ 1.2, Moderate ≥ 1.0, Neutral ≥ 0.8`);
      console.log(`• Price + Delivery: Price > 0 + composite ≥ 1.0 = Pass; 0.9 = Near`);
      console.log(`• 3-Day Trend: Pass if D0 > D1 > D2; Near if partial rising`);
      console.log(`\n%cFinal Score Bands (0–6, half-points for Near):`, "color:#e9950c; font-weight:bold;");
      console.log("• ≥5.0 → 🔥 Strong Institutional Accumulation");
      console.log("• 4.0–4.9 → ✅ Healthy Accumulation");
      console.log("• 3.0–3.9 → ⚠️ Neutral / Watch");
      console.log("• 2.0–2.9 → 🟡 Weak / Transition");
      console.log("• <2.0 → 🔻 Distribution / Exit");
    } catch (e) {
      console.warn("⚠️ Could not print Scoring Documentation:", e);
    }
  })();
  
    /*==================================================================================*/
	/* ----------  Delivery Build-Up + Price Chart (Logarithmic Bars) ---------*/
	/*==================================================================================*/

	/*==================================================================================*/
	/* ----------  Delivery Build-Up + Price Chart (Logarithmic Bars) (WITH DEBUG) ---------*/
	/*==================================================================================*/

	console.log("\n%c📊 Delivery Build-Up + Price Chart (Logarithmic Scaling) — DEBUG MODE",
	  "color:#4fc3f7; font-weight:bold; font-size:15px;");
	console.log("Date        │ Delivery Qty Build-Up (Logarithmic Fill)      │   Price Movement (Logarithmic Fill)");
	console.log("─".repeat(115));

	// ----------------- Debug helper -----------------
	const safePad = (v, n) => String(v ?? "").padEnd(n);
	const safePadLeft  = (v, n) => String(v ?? "").padStart(n);   // left-pad (optional)
	const dbg = (...args) => console.debug("%c[DBG]", "color:#ffa000; font-weight:bold;", ...args);

	// Show raw `data` head for quick inspection
	dbg("Raw `data` (first 10):", data.slice(0, 10));

	// Safety guard
	if (!Array.isArray(data) || data.length === 0) {
	  console.error("❌ `data` is empty or not an array. Cannot build chart.");
	  
	}

	// ----------------- Build deliverySeries -----------------
	const deliverySeries = data.map((d, i) => {
	  // Log the raw row object into console for first few elements
	  if (i < 6) dbg(`row[${i}] raw:`, d);

	  return {
		dateStr: (d.date ?? "").toString().trim(), // ensure string
		qty: Number.isFinite(d.deliveryQty) ? d.deliveryQty : (parseFloat(d.deliveryQty) || 0),
		price: Number.isFinite(d.close) ? d.close : (parseFloat(d.close) || 0)
	  };
	});

	dbg("Mapped `deliverySeries` (reversed):", deliverySeries);

	// Pause so you can inspect deliverySeries, and step into loop after confirming values


	const BAR = "▇";
	const TOTAL_BAR_LEN = 20;

	// BASES: ensure at least sensible fallbacks
	const baseQty = (deliverySeries[0] && deliverySeries[0].qty) || 1;
	const basePrice = (deliverySeries[0] && deliverySeries[0].price) || 1;

	const maxQty = Math.max(...deliverySeries.map(d => d.qty || 1));
	const minQty = Math.min(...deliverySeries.map(d => d.qty || 1));
	const maxPrice = Math.max(...deliverySeries.map(d => d.price || 1));
	const minPrice = Math.min(...deliverySeries.map(d => d.price || 1));

	dbg({ baseQty, basePrice, maxQty, minQty, maxPrice, minPrice });

	// If min values are invalid, pause
	if (!isFinite(minQty) || !isFinite(minPrice) || minQty <= 0 || minPrice <= 0) {
	  console.warn("⚠️ minQty/minPrice invalid — check data. minQty:", minQty, "minPrice:", minPrice);
	 
	}

	console.log("─".repeat(115));

	// Iterate with try/catch and a debugger inside to step through problematic row
	deliverySeries.forEach((d, idx) => {
	  try {
		// Show each row before computing
		dbg(`Processing idx=${idx}`, d);

		// safe date
		const dateLabelRaw = d.dateStr || "";
		const dateLabel = safePad(dateLabelRaw, 12);

		// QTY computations — guarded
		const qtyVal = (typeof d.qty === "number" && !isNaN(d.qty)) ? d.qty : (parseFloat(d.qty) || 0);
		const qtyPct = ((qtyVal - baseQty) / (baseQty || 1)) * 100;

		// guard logs for log() arguments
		const safeMinQty = (minQty > 0 ? minQty : 1);
		const safeMaxQty = (maxQty > 0 ? maxQty : safeMinQty + 1);
		const qtyRatio = (Math.log(qtyVal || safeMinQty) - Math.log(safeMinQty)) / ((Math.log(safeMaxQty) - Math.log(safeMinQty)) || 1);

		const qtyFill = Math.round(TOTAL_BAR_LEN * Math.max(0, Math.min(1, qtyRatio)));
		const qtyEmpty = TOTAL_BAR_LEN - qtyFill;

		const qtyFilledBar = `%c${BAR.repeat(qtyFill)}`;
		const qtyEmptyBar = `%c${BAR.repeat(qtyEmpty)}`;
		const qtyColor = qtyVal >= baseQty ? "#27AE60" : "#777";

		const qtyLabel = safePad(`${(qtyVal || 0).toLocaleString("en-IN")} | ${qtyPct.toFixed(2)}%`, 32);

		// PRICE computations — guarded
		const priceVal = (typeof d.price === "number" && !isNaN(d.price)) ? d.price : (parseFloat(d.price) || 0);
		const pricePct = ((priceVal - basePrice) / (basePrice || 1)) * 100;

		const safeMinPrice = (minPrice > 0 ? minPrice : 1);
		const safeMaxPrice = (maxPrice > 0 ? maxPrice : safeMinPrice + 1);
		const priceRatio = (Math.log(priceVal || safeMinPrice) - Math.log(safeMinPrice)) / ((Math.log(safeMaxPrice) - Math.log(safeMinPrice)) || 1);

		const priceFill = Math.round(TOTAL_BAR_LEN * Math.max(0, Math.min(1, priceRatio)));
		const priceEmpty = TOTAL_BAR_LEN - priceFill;

		const priceFilledBar = `%c${BAR.repeat(priceFill)}`;
		const priceEmptyBar = `%c${BAR.repeat(priceEmpty)}`;

		const priceColor = pricePct >= 0 ? "#A78BFA" : "#FF6B6B";
		const priceLabel = `₹${(priceVal || 0).toFixed(2)} | ${pricePct.toFixed(2)}%`;

		// Print row (styles applied to bar segments)
		console.log(
		  `${dateLabel} │ ${qtyFilledBar}${qtyEmptyBar} ${qtyLabel} │ ${priceFilledBar}${priceEmptyBar} ${priceLabel}`,
		  `color:${qtyColor}; font-weight:bold;`,
		  "color:#444;",
		  `color:${priceColor}; font-weight:bold;`,
		  "color:#444;"
		);

		// Stepper breakpoint for a specific index — change or remove as needed
		if (idx === 0) {
		  dbg("Paused after printing first row — inspect variables.", { idx, dateLabelRaw, qtyVal, priceVal });
		 // pause after first printed row
		}

	  } catch (err) {
		console.error("❌ Error while building chart row:", err, "row:", d, "idx:", idx);
		// pause on error so you can inspect state
	  }
	});

	console.log("─".repeat(115));
	console.log(`Base Delivery Qty: ${(baseQty || 0).toLocaleString("en-IN")} | Base Price: ₹${(basePrice || 0).toFixed(2)}`);
	console.log("→ Logarithmic bars for both Delivery Qty and Price ensure proportional visual scaling.");

	/*==================================================================================*/
	/* ---- Delivery Value (₹ Money Flow) — PERFECT LINEAR BARS (Best Visual Clarity) --*/
	/*==================================================================================*/

	console.log("\n%c💰 Delivery Value (Money Flow) — Equal-Width Bars + Colored Delivery %",
	  "color:#ffa726; font-weight:bold; font-size:15px;");
	console.log("Date        │ Delivery Value (Linear Bars)");
	console.log("─".repeat(130));

	const DELV_BAR_LEN      = 50;
	const DELV_BAR_CHAR     = "█";   // full block
	const DELV_EMPTY_CHAR   = "░";
	const DELV_EMPTY_COLOR  = "#333";

	const safePad1 = (v, n) => String(v ?? "").padEnd(n);
	let valueSeries = data.map(d => ({
	  dateStr: d.date?.trim() || "",
	  value: (d.close || 0) * (d.deliveryQty || 0),
	  perc: Number(d.deliveryPerc) || 0
	}));

	/* ---- LINEAR RANGE ---- */
	const maxVal = Math.max(...valueSeries.map(v => v.value));
	const minVal = Math.min(...valueSeries.map(v => v.value));

	/* Reverse chronological */
	valueSeries = valueSeries;

	valueSeries.forEach(v => {

	  const raw = v.value;
	  const ratio = raw / maxVal;                // LINEAR SCALE
	  const pct = Math.max(0, Math.min(1, ratio));

	  const fillCount  = Math.round(DELV_BAR_LEN * pct);
	  const emptyCount = DELV_BAR_LEN - fillCount;

	  const filledBar = `%c${DELV_BAR_CHAR.repeat(fillCount)}`;
	  const emptyBar  = `%c${DELV_EMPTY_CHAR.repeat(emptyCount)}`;

	  const cr = (raw / 1e7).toFixed(2);

	  let percColor = "#42a5f5";
	  if (v.perc >= 50) percColor = "#27AE60";
	  else if (v.perc >= 35) percColor = "#E6C07A";
	  else if (v.perc < 25)  percColor = "#FF6B6B";

	  /*console.log(
		`${safePad1(v.dateStr, 12)} │   %c₹${cr} Cr   %c|${filledBar}${emptyBar} ${v.perc.toFixed(2)}%`,
		"color:#66bb6a; font-weight:bold;",
		`color:${DELV_EMPTY_COLOR};`,
		"color:#66bb6a; font-weight:bold;",
		`color:${percColor}; font-weight:bold;`
	  );
	  */
		 console.log(
		`${safePad1(v.dateStr, 12)} │   %c₹${safePad1(cr, 6)} Cr   %c|${filledBar}${emptyBar} ${v.perc.toFixed(2)}%`,
		"color:#66bb6a; font-weight:bold;opacity: .5;",
		`color:${DELV_EMPTY_COLOR};`,
		"color:#66bb6a; font-weight:bold; opacity: .5;",
		`color:${percColor}; font-weight:bold;`
	  );
	});

	console.log("─".repeat(130));

		/*==================================================================================*/
	/* ---------- Delivery % Cluster Heatmap -------------------------------------------*/
	/*==================================================================================*/

	console.log("\n%c🌡 Delivery % Heatmap — Accumulation Clusters",
	  "color:#29b6f6; font-weight:bold; font-size:15px;");

	let week = 1;
	let buffer = "";

	data
	  .slice()       // copy array
	  .reverse()     // oldest → newest
	  .forEach((d, i) => {
		let c = "░"; // low

		if (d.deliveryPerc >= 40) c = "█";    // strong
		else if (d.deliveryPerc >= 30) c = "▓"; // moderate

		buffer += c + " ";

		if ((i + 1) % 5 === 0) {  // 5 days per week
		  console.log(`Week ${week}: ${buffer}`);
		  buffer = "";
		  week++;
		}
	  });


	/*==================================================================================*/
	/* ---------- END ----------------------------------------*/
	/*==================================================================================*/

	}  


	/*==================================================================================*/
	/*==================================================================================*/
	/*==================================================================================*/
	/*==================================================================================*/
	/*==================================================================================*/
	/*==================================================================================*/
	/*==================================================================================*/
	/*==================================================================================*/
	/*==================================================================================*/


	function runFutureAnalyzer() {
		console.clear();
	  // ========= Utilities
	  const cleanNum = (v) => { const s = String(v || "").replace(/[^\d.-]/g, ""); const n = parseFloat(s); return isFinite(n) ? n : 0; };
	  const avg = (arr) => (arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0);
	  const fmtCr = (n) => (n/1e7).toFixed(2) + " Cr";
	  const fmtNumIN = (n) => { try { return (Math.abs(n)).toLocaleString('en-IN'); } catch(e){ return String(n); } };
	  const sign = (n) => n>0?'+': (n<0?'-':'');

	  // small helper for safe CSS token
	  const css = (s) => s;

	  // ========= Detect active symbol (attempt)
	  function getActiveSymbol() {
		try {
		  const tabs = document.querySelectorAll('.top_tab_parent .draggable_top_bar .top_bar .w-100');
		  for (const tab of tabs) {
			const a = tab.querySelector('.top_bar_item.active a');
			if (a && a.textContent.trim()) return a.textContent.trim().toUpperCase();
		  }
		} catch (e) { /* ignore */ }
		return null;
	  }

	  // ---------- pick symbol & rollover object (if you use rollover map externally)
	  let symbol = getActiveSymbol();
	  if (!symbol) {
		// don't force prompt in automated runs; keep fallback null
		console.warn("⚠️ Could not auto-detect symbol. Rollover lookups will be skipped unless you provide rollover data in `rollover` object.");
	  } else {
		//console.log(`🧭 Active Symbol: ${symbol}`);
	  }

	  // ========= Read futures table rows once
	  const rows = Array.from(document.querySelectorAll('.futures-table .ag-center-cols-container [role="row"]'));
	  if (!rows.length) {
		console.error("❌ No Futures OI rows found in DOM (selector '.futures-table .ag-center-cols-container [role=\"row\"]').");
		return;
	  }

	  // pick helper: prefer span under col-id then fallback to element text
	  const pick = (row, colSel) => {
		return row.querySelector(`${colSel} span`)?.textContent ??
			   row.querySelector(colSel)?.textContent ??
			   "0";
	  };

	  // parse rows into data objects (date descending assumed)
	  const allSeriesData = rows.map(row => {
		const dateStr = (row.querySelector('[col-id="date"]')?.textContent || "").trim();
		let parsedDate = null;
		if (dateStr && dateStr.includes("-")) {
		  const [d,m,y] = dateStr.split("-");
		  parsedDate = new Date(`${y}-${m.padStart(2,"0")}-${d}`);
		}
		const price = cleanNum(pick(row,'[col-id="month1close"]'));
		const priceChange = cleanNum(pick(row,'[col-id="month1changePerc"]'));
		const oi = cleanNum(pick(row,'[col-id="month1combinedOi"]'));
		const oiChangePerc = cleanNum(pick(row,'[col-id="month1combinedOiChangePerc"]'));
		const vol = cleanNum(pick(row,'[col-id="month1combinedVolume"]'));
		const mwpl = cleanNum(pick(row,'[col-id="mwplPerc"]'));
		return { dateStr, date: parsedDate, price, priceChange, oi, oiChangePerc, vol, mwpl };
	  }).filter(x => x.date instanceof Date && !isNaN(x.date));

	  if (allSeriesData.length < 1) {
		console.error("❌ After parsing rows, no valid series rows found.");
		return;
	  }

	  // sort oldest -> newest, then later we reverse to have newest first
	  allSeriesData.sort((a,b)=>a.date - b.date);
	  const series = [...allSeriesData].reverse(); // newest first

	  // basic stats
	  const basePrice = series[series.length-1]?.price || series[0].price || 1;
	  const baseOI = series[series.length-1]?.oi || series[0].oi || 1;
	  const latest = series[0];
	  const maxOI = Math.max(...series.map(d=>d.oi||1));
	  const minOI = Math.min(...series.map(d=>d.oi||1));
	  const maxPrice = Math.max(...series.map(d=>d.price||1));
	  const minPrice = Math.min(...series.map(d=>d.price||1));

	  // ========= Spot price (optional)
	  let spotPrice = 0;
	  try {
		const spotEl = document.querySelector('.amount-info .amount span');
		if (spotEl) spotPrice = cleanNum(spotEl.textContent);
	  } catch(e){}

	  // ========= Rollover benchmarks (if rollover object exists) - safe checks
	  const rolloverProvided = typeof rollover !== 'undefined' && rollover !== null;
	  let prevOI = baseOI, prevPrice = basePrice;
	  if (rolloverProvided && symbol && rollover[symbol]) {
		// best-effort pick a field; this section is optional in charts
		prevOI = cleanNum(rollover[symbol]["Nov_25"]) || prevOI;
		prevPrice = cleanNum(rollover[symbol]["Nov_25_Price"]) || prevPrice;
	  } else {
		// fallback: use second row's values (yesterday) if available
		prevOI = series[1]?.oi ?? prevOI;
		prevPrice = series[1]?.price ?? prevPrice;
	  }

	  // ========= Lightweight summary (console.table)
	  const data = series; // use up to 20 rows for table output

	  const avgVol = avg(series.map(d=>d.vol||0));
	  const avgMoney = avg(series.map(d => ((d.price||0)*(d.oi||0))/1e7));

	  // trend 10-day if available
	  const priceTrend10 = series.length >= 10 ? (series[0].price - series[9].price) : (series[0].price - series[series.length-1].price);
	  const dominantTrend = priceTrend10 > 0 ? "UP" : priceTrend10 < 0 ? "DOWN" : "SIDE";
	  const trendEmoji = dominantTrend === "UP" ? "📈" : dominantTrend === "DOWN" ? "📉" : "➖";
	  

	  //console.log("\n%c📊 SMART OI Analyzer — Summary", "color:#80d8ff;font-weight:bold;font-size:13px;");
	  //console.log(`%cSymbol: ${symbol || "N/A"}   Latest price: ₹${(series[0].price||0).toFixed(2)}   Latest OI: ${fmtNumIN(series[0].oi||0)}`, "color:#bdbdbd;");

	  // =========================
	  // Console Table: Two-column style output
	  // =========================

	  // Colors & theme
		const COLORS = {
			// Core signals — smooth / professional
			green:      "#388E3C",   // 🟢 strong long (your requested tone)
			red:        "#c8062e",   // 🔴 soft red (not harsh)
			orange:     "#FB8C00",   // 🟠 soft unwinding / caution
			cyan:       "#039BE5",   // 🔵 smooth blue, non-distracting

			softGold:   "#D7B56D",   // ✨ medium score accent
			amberSoft:  "#D9A441",   // 💛 OI Cr abs (smooth amber)
			softGreen:  "#66BB6A",   // 🟢 delta +ve (soft)
			softRed:    "#EF9A9A",   // 🔴 delta -ve (soft)

			priceUp:    "#9575CD",   // 📈 soft violet for uptrend
			neutral:    "#9e9e9e",   // ⚪ neutral gray
			empty:      "#363636",   // ▒ dark gray empty block (subtle)
			breakout:   "#00C853",    // 🚀 calm neon green for breakout  
			greenBar:   "#13814b",
			redBar:     "#c8062e",
		};




	  const BAR = "■│";
	  const TOTAL_BAR_LEN_OI = 25;
	  const TOTAL_BAR_LEN_PRICE = 25;
	  // ===== Extract stock name from <h1> =====
	  function getStockName() {
			const h1 = document.querySelector("h1");
			if (!h1) return "";
			let name = h1.textContent.trim();
			// Remove extra junk, keep only first word or first token if needed
			name = name.replace(/\s+/g, " "); 
			return name;
		}

		const STOCK_NAME = getStockName();

	  console.log(
		  `%c${STOCK_NAME}%c ::::::  SMART OI Analyzer `,
		  "color:#00bcd4; font-size:26px; font-weight:900;",
		  "color:#80d8ff; font-size:14px; font-weight:bold;"
		);

	  console.log(
  "%cDate   │ OI Bar & Qty                                 │ Δ OI       │ Delta       │ Price Bar                                   │ Price    │ % Chng    │ Score      │ Smart Signal   │ Action │ Entry  │ Warn  │ OI Cr                                ", "background:#1d1d1d; color:#e0e0e0; font-size:14px; font-weight:bolder; padding:4px 2px;"
);

	  //console.log("─".repeat(240));

	  // iterate newest -> older
	  for (let idx=0; idx < data.length; idx++) {
		const d = data[idx];
		const histIdx = series.indexOf(d);
		const prevRow = series[histIdx+1] ?? d; // next in series is previous day (since series is reversed)
		const prevOIrow = prevRow?.oi ?? d.oi;
		const prevPriceRow = prevRow?.price ?? d.price;

		const priceChange = d.price - prevPriceRow;
		const oiChangeQty = d.oi - prevOIrow;
		const priceMomentum3 = d.price - (series[Math.min(histIdx+3, series.length-1)]?.price ?? d.price);
		const oiMomentum3 = d.oi - (series[Math.min(histIdx+3, series.length-1)]?.oi ?? d.oi);

		// Row background highlight when both price & oi increased vs previous row (soft)
		let rowBgStyle = "";
		if (priceChange > 0 && oiChangeQty > 0) {
		  rowBgStyle = ""; // soft green
		}
		let dateStyle = "color:#9e9e9e; font-size:14px; font-weight:bold;";
		// Smart signal (simple)
		let smartSignal = "Neutral / Range", smartColor = COLORS.neutral;
		if (priceChange > 0 && oiChangeQty > 0) { smartSignal = "Fresh Longs"; smartColor = COLORS.green; }
		else if (priceChange < 0 && oiChangeQty > 0) { smartSignal = "Fresh Shorts"; smartColor = COLORS.red; }
		else if (priceChange > 0 && oiChangeQty < 0) { smartSignal = "Short Covering"; smartColor = COLORS.cyan; }
		else if (priceChange < 0 && oiChangeQty < 0) { smartSignal = "Long Unwinding"; smartColor = COLORS.orange; }

		// Score (lightweight mimic of your logic)
		const high = d.rollingHigh || d.price || maxPrice;
		const low = d.rollingLow || d.price || minPrice;
		const range = (high - low) || 1;
		const distH = ((high - d.price) / range) * 100;
		const distL = ((d.price - low) / range) * 100;
		const proximityScore = distL <= 5 ? 1 : distH <= 5 ? 0 : 0.5;

		const oiRange = Math.max(1, maxOI - minOI);
		const priceRange = Math.max(1, maxPrice - minPrice);
		const normOiDay = Math.min(100, Math.abs(oiChangeQty) / oiRange * 100);
		const normPriceDay = Math.min(100, Math.abs(priceChange) / priceRange * 100);
		const normOiMom3 = Math.min(100, Math.abs(oiMomentum3) / oiRange * 100);
		const normPriceMom3 = Math.min(100, Math.abs(priceMomentum3) / priceRange * 100);

		let dirFactor = (smartSignal === "Fresh Longs") ? 1 : (smartSignal === "Fresh Shorts") ? -1 : (smartSignal === "Short Covering") ? 0.25 : (smartSignal === "Long Unwinding") ? -0.6 : 0;
		let rawScore = 50 + dirFactor * (normPriceDay*0.32 + normOiDay*0.36 + (normPriceMom3+normOiMom3)*0.1 + proximityScore*15);
		if (proximityScore === 1 && smartSignal === "Fresh Longs") rawScore += 7;
		if (proximityScore === 0 && smartSignal === "Fresh Shorts") rawScore -= 7;
		if ((priceMomentum3>0 && priceChange>0) || (priceMomentum3<0 && priceChange<0)) rawScore += 3;
		const score = Math.round(Math.max(0, Math.min(100, rawScore)));
		const scoreStr = `Score ${score}`;
		const scoreColor = score >= 70 ? COLORS.green : score >= 50 ? COLORS.softGold : COLORS.red;

		// Action / Entry (kept minimal so not to deviate)
		let action = "AVOID", actionColor = COLORS.neutral;
		let entry = "—", entryColor = COLORS.neutral;
		let warn = "", warnColor = COLORS.neutral;

		if (smartSignal === "Fresh Longs" && score >= 62) { action="BUY"; actionColor=COLORS.green; entry="REG"; entryColor=COLORS.green; }
		if (smartSignal === "Short Covering" && score >= 62) { action="BUY"; actionColor=COLORS.cyan; entry="REG"; entryColor=COLORS.cyan; }
		if (smartSignal === "Fresh Shorts" && score <= 30) { action="SELL"; actionColor=COLORS.red; entry="REG"; entryColor=COLORS.red; }

		// -----------------------------
		// OI Bars
		const oiVal = d.oi || 1;
		const oiRatioLog = (Math.log(Math.max(oiVal,1)) - Math.log(Math.max(minOI,1))) /
						   ((Math.log(Math.max(maxOI,1)) - Math.log(Math.max(minOI,1))) || 1);
		const oiFill = Math.round(TOTAL_BAR_LEN_OI * Math.max(0, Math.min(1, oiRatioLog)));
		const oiFilledBar = BAR.repeat(oiFill);
		const oiEmptyBar = BAR.repeat(TOTAL_BAR_LEN_OI - oiFill);
		// Soft bar color mapping
		let barColor = COLORS.green; // default
		if (priceChange > 0 && oiChangeQty > 0) barColor = COLORS.greenBar;      // Fresh Longs
		else if (priceChange < 0 && oiChangeQty > 0) barColor = COLORS.redBar;   // Fresh Shorts
		else if (priceChange > 0 && oiChangeQty < 0) barColor = COLORS.cyan;  // Short Covering
		else if (priceChange < 0 && oiChangeQty < 0) barColor = COLORS.orange;// Long Unwinding

		const oiBarColor = barColor;
		const oiBarStyle = `color:${oiBarColor};font-weight:bold;`;
		const oiEmptyStyle = `color:${COLORS.empty};font-weight:bold;`;

		// OI qty label colored by direction vs prev row
		const oiQtyText = d.oi.toLocaleString("en-IN").padEnd(14);
		let oiQtyStyle = `color:${COLORS.neutral};font-family:monospace;font-size:12px;`;
		if (d.oi > prevOIrow) oiQtyStyle = `color:${COLORS.green};font-family:monospace;font-size:12px;`;
		else if (d.oi < prevOIrow) oiQtyStyle = `color:${COLORS.red};font-family:monospace;font-size:12px;`;

		// OI Δ (qty) colored
		const oiDeltaQtyNum = d.oi - prevOIrow;
		const oiDeltaQtyText = `${sign(oiDeltaQtyNum)}${fmtNumIN(Math.abs(oiDeltaQtyNum))}`.padEnd(14);
		let oiDeltaQtyStyle = `color:${COLORS.neutral};font-weight:bold;font-family:monospace;`;
		if (oiDeltaQtyNum > 0) oiDeltaQtyStyle = `color:${COLORS.green};font-family:monospace;`;
		else if (oiDeltaQtyNum < 0) oiDeltaQtyStyle = `color:${COLORS.red};font-family:monospace;`;

		// Price bar & value coloring (same logic as OI direction)
		const priceVal = d.price || 1;
		const priceRatioLog = (Math.log(Math.max(priceVal,1)) - Math.log(Math.max(minPrice,1))) /
							  ((Math.log(Math.max(maxPrice,1)) - Math.log(Math.max(minPrice,1))) || 1);
		const priceFill = Math.round(TOTAL_BAR_LEN_PRICE * Math.max(0, Math.min(1, priceRatioLog)));
		const priceFilledBar = BAR.repeat(priceFill);
		const priceEmptyBar = BAR.repeat(TOTAL_BAR_LEN_PRICE - priceFill);

		let priceBarFilledStyle = `color:${COLORS.neutral};font-weight:bold;`;
		let priceValStyle       = `color:${COLORS.neutral};font-weight:bold;font-family:monospace;`;

		if (priceVal > prevPriceRow) {
			priceBarFilledStyle = `color:${COLORS.greenBar};font-weight:bold;`;
			priceValStyle       = `color:${COLORS.green};font-weight:bold;font-family:monospace;`;
		} 
		else if (priceVal < prevPriceRow) {
			priceBarFilledStyle = `color:${COLORS.redBar};font-weight:bold;`;
			priceValStyle       = `color:${COLORS.red};font-weight:bold;font-family:monospace;`;
		}


		const pricePctStr = `${(((priceVal - basePrice)/basePrice)*100).toFixed(2)}%`;

		// OI Cr last column (absolute + delta in Cr)
		const oiCrAbs = Math.abs((oiVal * priceVal)/1e7);
		// compute previous row value in Cr safely
		const prevCr = ((prevOIrow * prevPriceRow)/1e7) || 0;
		const oiDeltaCrNum = ((oiVal * priceVal)/1e7) - prevCr;
		const oiCrText = `₹${oiCrAbs.toFixed(2)} Cr`;
		const oiDeltaCrSign = oiDeltaCrNum >= 0 ? "+" : "−";
		const oiDeltaCrText = `${oiDeltaCrSign}₹${fmtNumIN(Math.abs(Math.round(oiDeltaCrNum)))} Cr`;

		// font-size bucket (4 sizes)
		let oiPercent = 0;
		if (maxOI > minOI) oiPercent = ((oiVal - minOI) / (maxOI - minOI)) * 100;
		let oiFontSize = 10;
		if (oiPercent >= 75) oiFontSize = 20;
		else if (oiPercent >= 50) oiFontSize = 16;
		else if (oiPercent >= 25) oiFontSize = 12;

		const oiCrStyleAbs = `font-family:monospace;color:${COLORS.amberSoft};font-weight:bold;font-size:${oiFontSize}px;`;
		const oiCrStyleDelta = `font-family:monospace;color:${oiDeltaCrNum>=0?COLORS.softGreen:COLORS.softRed};font-weight:bold;font-size:${Math.max(8, oiFontSize-2)}px;`;
		const oiCrLabel = `%c${oiCrText}%c(${oiDeltaCrText})`;
		
		let oppIcon = "●";
		let oppStyle = "color:#363636;";
		let oppStyleCom = "font-size:18px; line-height: 18px;";

		// Price ↑ but OI ↓ → weak long / short covering
		if (priceChange > 0 && oiChangeQty < 0) {
			oppStyle = `${oppStyleCom} color:#4FC3F7;`; // blue big
		}

		// Price ↓ but OI ↑ → fresh shorts / bearish pressure
		else if (priceChange < 0 && oiChangeQty > 0) {
			oppStyle = `${oppStyleCom}color:#ffeb3b;`; // yellow big
		}

		// Price ↑ & OI ↑ → strong long buildup
		else if (priceChange > 0 && oiChangeQty > 0) {
			oppStyle = `${oppStyle}${oppStyleCom}`; // gray big
		}

		// Price ↓ & OI ↓ → long unwinding
		else if (priceChange < 0 && oiChangeQty < 0) {
			oppStyle = `${oppStyle}${oppStyleCom}`; // gray big
		}

		// Completely neutral
		else {
			oppStyle = "color:#d31313;font-size:18px;"; // gray medium
		}




		// BUILD console.log format + styles (order MUST match)
		// We'll print pieces with %c tokens in exact order below.
		// ===== Format date from DD-MM-YYYY → "DD Mon, YYYY"
		function formatDateDMY(dstr) {
			if (!dstr || !dstr.includes("-")) return dstr;
			const [dd, mm, yy] = dstr.split("-");
			const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			const mon = months[parseInt(mm,10) - 1] || mm;
			return `${dd} ${mon}`;
		}

		const priceStr = `₹${priceVal.toFixed(2)} %c${oppIcon}`;
		
		const dateFormatted = formatDateDMY(d.dateStr).padEnd(3);
		
		
		const COL_BG_OI    = "";
		const COL_BG_PRICE = COL_BG_OI;
		
		let borderRight = "|";
		let borderRightStyle = "color:#ffffff;font-size:18px; line-height: 18px;";
		
		const fmt =
		  `%c${dateFormatted} ` +               // 1 dateStyle
		  `%c${borderRight} ` +
		  `%c${oiFilledBar}%c${oiEmptyBar} ` +            // 2 oiBarStyle, 3 oiEmptyStyle
		  `%c ${oiQtyText} │ ` +                          // 4 oiQtyStyle
		  `%c${oiDeltaQtyText}` +                     // 5 oiDeltaQtyStyle
		  `%c${borderRight}` +  
		  `%c ${priceFilledBar}%c${priceEmptyBar} ` +     // 6 priceBarFilledStyle, 7 priceEmptyStyle
	      `%c ${priceStr.padEnd(12)} │` +                // 8 priceValStyle
		  `%c ${pricePctStr.padEnd(12)}` +  
		  `%c${borderRight}` + 		  // 9 price% soft grey
		  `%c ${scoreStr.padEnd(12)} │ ` +                 //10 scoreColor
		  `%c${smartSignal.padEnd(16)} │ ` +              //11 smartColor
		  `%c${action.padEnd(8)} │ ` +                    //12 actionColor
		  `%c${entry.padEnd(8)} │ ` +                     //13 entryColor
		  `%c${warn.padEnd(6)} │ ` +                      //14 warnColor
		  `${oiCrLabel}`;                                // 15,16 oiCrStyleAbs, oiCrStyleDelta

		const styles = [
		  // 1 date Style
		  dateStyle,
		   borderRightStyle,
		  // 2-3 oi bars
		  oiBarStyle,
		  oiEmptyStyle,
		  `${COL_BG_OI}; ${oiQtyStyle}`,// 4 oi qty style
		  `${COL_BG_OI}; ${oiDeltaQtyStyle}`,// 5 oi delta qty style
		  borderRightStyle,      // 6 NEW border column
		  // 6-7 price bars
		  priceBarFilledStyle,
		  `color:${COLORS.empty};`,
		  // 8 price value
		  `${COL_BG_PRICE}; ${priceValStyle}`,
		  `${COL_BG_PRICE}; ${oppStyle}`,
		  // 9 price % (soft grey)
		  `${COL_BG_PRICE};color:#9e9e9e;`,
		  borderRightStyle,
		  // 10 score
		  `color:${scoreColor};`,
		  // 11 smart signal
		  `color:${smartColor};`,
		  // 12 action
		  `color:${actionColor};font-weight:bold;`,
		  // 13 entry
		  `color:${entryColor};`,
		  // 14 warn
		  `color:${warnColor};`,
		  // 15-16 oiCr ABS + delta
		  oiCrStyleAbs,
		  oiCrStyleDelta,
		];
		
		// finally print the row
		console.log(fmt, ...styles);
	  } // end for

	  //console.log("─".repeat(240));
	  console.log(`Base OI: ${baseOI.toLocaleString()} | Base Price: ₹${basePrice.toFixed(2)}`);
	  console.log("→ v3.3 Final+: Row Highlight Enabled (OI↑ & Price↑).");
	  
	  
	  console.table([
		{ Check: "10d Price Trend", Value: `${trendEmoji} ${dominantTrend}` },
		{ Check: "Latest Money (Price×OI)", Value: `${fmtCr((series[0].price||0)*(series[0].oi||0))}  | Avg: ${fmtCr(avgMoney)}` },
		{ Check: "Avg Volume", Value: avgVol.toLocaleString() },
		{ Check: "Spot Price", Value: spotPrice ? `₹${spotPrice.toLocaleString("en-IN")}` : "N/A" }
	  ]);

	}
	 














