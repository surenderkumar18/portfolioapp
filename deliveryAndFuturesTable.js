const deliveryData = {"CHOLAFIN":{"28 Nov 2025":{"price":1736,"deliveryQty":603046,"deliveryPerc":62.59,"deliveryValue":104.69,"changePct":0.66},"27 Nov 2025":{"price":1724.6,"deliveryQty":858725,"deliveryPerc":55.6,"deliveryValue":148.1,"changePct":0.68},"26 Nov 2025":{"price":1712.9,"deliveryQty":486660,"deliveryPerc":53.59,"deliveryValue":83.36,"changePct":1.63},"25 Nov 2025":{"price":1685.4,"deliveryQty":576214,"deliveryPerc":52.74,"deliveryValue":97.12,"changePct":2.04},"24 Nov 2025":{"price":1651.7,"deliveryQty":1415958,"deliveryPerc":67.46,"deliveryValue":233.87,"changePct":-0.48},"21 Nov 2025":{"price":1659.7,"deliveryQty":1092734,"deliveryPerc":57.87,"deliveryValue":181.36,"changePct":-2.55},"20 Nov 2025":{"price":1703.2,"deliveryQty":477935,"deliveryPerc":54.27,"deliveryValue":81.4,"changePct":1.5},"19 Nov 2025":{"price":1678.1,"deliveryQty":639573,"deliveryPerc":57.72,"deliveryValue":107.33,"changePct":-1.01},"18 Nov 2025":{"price":1695.3,"deliveryQty":659500,"deliveryPerc":61.68,"deliveryValue":111.81,"changePct":-0.26},"17 Nov 2025":{"price":1699.7,"deliveryQty":559301,"deliveryPerc":62.96,"deliveryValue":95.06,"changePct":-0.87},"14 Nov 2025":{"price":1714.6,"deliveryQty":566733,"deliveryPerc":62.11,"deliveryValue":97.17,"changePct":0.23},"13 Nov 2025":{"price":1710.6,"deliveryQty":516318,"deliveryPerc":62.09,"deliveryValue":88.32,"changePct":-0.48},"12 Nov 2025":{"price":1718.8,"deliveryQty":822060,"deliveryPerc":61.2,"deliveryValue":141.3,"changePct":-1.32},"11 Nov 2025":{"price":1741.8,"deliveryQty":1137729,"deliveryPerc":68.57,"deliveryValue":198.17,"changePct":-0.72},"10 Nov 2025":{"price":1754.4,"deliveryQty":801801,"deliveryPerc":48.68,"deliveryValue":140.67,"changePct":2.96},"07 Nov 2025":{"price":1703.9,"deliveryQty":1133381,"deliveryPerc":48.16,"deliveryValue":193.12,"changePct":1.22},"06 Nov 2025":{"price":1683.4,"deliveryQty":988124,"deliveryPerc":42.94,"deliveryValue":166.34,"changePct":-3.58},"04 Nov 2025":{"price":1745.9,"deliveryQty":1317844,"deliveryPerc":69.86,"deliveryValue":230.08,"changePct":1.59},"03 Nov 2025":{"price":1718.5,"deliveryQty":488216,"deliveryPerc":41.71,"deliveryValue":83.9,"changePct":1.28},"31 Oct 2025":{"price":1696.8,"deliveryQty":629229,"deliveryPerc":57.55,"deliveryValue":106.77,"changePct":-0.88},"30 Oct 2025":{"price":1711.8,"deliveryQty":310580,"deliveryPerc":47.48,"deliveryValue":53.17,"changePct":0.08},"29 Oct 2025":{"price":1710.4,"deliveryQty":1162303,"deliveryPerc":57.74,"deliveryValue":198.8,"changePct":-0.74},"28 Oct 2025":{"price":1723.2,"deliveryQty":1383329,"deliveryPerc":68.56,"deliveryValue":238.38,"changePct":-0.53},"27 Oct 2025":{"price":1732.4,"deliveryQty":1667483,"deliveryPerc":55.93,"deliveryValue":288.87,"changePct":-0.07},"24 Oct 2025":{"price":1733.6,"deliveryQty":1171185,"deliveryPerc":55.03,"deliveryValue":203.04,"changePct":2.9},"23 Oct 2025":{"price":1684.7,"deliveryQty":1006947,"deliveryPerc":74.68,"deliveryValue":169.64,"changePct":0.86},"21 Oct 2025":{"price":1670.3,"deliveryQty":71785,"deliveryPerc":54.35,"deliveryValue":11.99,"changePct":-0.18},"20 Oct 2025":{"price":1673.3,"deliveryQty":399142,"deliveryPerc":55.81,"deliveryValue":66.79,"changePct":1.15},"17 Oct 2025":{"price":1654.3,"deliveryQty":323816,"deliveryPerc":49.45,"deliveryValue":53.57,"changePct":-0.83},"16 Oct 2025":{"price":1668.1,"deliveryQty":1597682,"deliveryPerc":49.9,"deliveryValue":266.51,"changePct":-1.78},"15 Oct 2025":{"price":1698.4,"deliveryQty":1259977,"deliveryPerc":62.86,"deliveryValue":213.99,"changePct":3.2},"14 Oct 2025":{"price":1645.7,"deliveryQty":1114439,"deliveryPerc":59.06,"deliveryValue":183.4,"changePct":-0.09},"13 Oct 2025":{"price":1647.2,"deliveryQty":949229,"deliveryPerc":68.14,"deliveryValue":156.36,"changePct":2.04},"10 Oct 2025":{"price":1614.2,"deliveryQty":270454,"deliveryPerc":59.85,"deliveryValue":43.66,"changePct":-0.44},"09 Oct 2025":{"price":1621.4,"deliveryQty":1025361,"deliveryPerc":73.02,"deliveryValue":166.25,"changePct":0.88},"08 Oct 2025":{"price":1607.3,"deliveryQty":555678,"deliveryPerc":62.79,"deliveryValue":89.31,"changePct":-1.49},"07 Oct 2025":{"price":1631.6,"deliveryQty":1129769,"deliveryPerc":65.6,"deliveryValue":184.33,"changePct":-0.15},"06 Oct 2025":{"price":1634.1,"deliveryQty":995764,"deliveryPerc":53.56,"deliveryValue":162.72,"changePct":4.02},"03 Oct 2025":{"price":1570.9,"deliveryQty":926018,"deliveryPerc":61.09,"deliveryValue":145.47,"changePct":-2.14}}}


function createFutureDataJSON() {
  // ========= Read futures table rows once
  const rows = Array.from(
    document.querySelectorAll(
      '.futures-table .ag-center-cols-container [role="row"]'
    )
  );

  if (!rows.length) {
    console.error("❌ No Futures OI rows found.");
    return {};
  }

  const cleanNum = (v) => {
    const s = String(v || "").replace(/[^\d.-]/g, "");
    const n = parseFloat(s);
    return isFinite(n) ? n : 0;
  };

  // Convert "03-11-2025" → "03 Nov 2025"
  const formatDate = (dmy) => {
    if (!dmy.includes("-")) return dmy;

    const [d, m, y] = dmy.split("-");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${d} ${months[parseInt(m) - 1]} ${y}`;
  };

  const pick = (row, colSel) =>
    row.querySelector(`${colSel} span`)?.textContent ??
    row.querySelector(colSel)?.textContent ??
    "0";

  // =========================================
  // BUILD EXACT STRUCTURE:
  // { "ASHOKLEY": { "27 Nov 2025": {...}, ... } }
  // =========================================

  const dataByDate = {};

  rows.forEach((row) => {
    const rawDate = (
      row.querySelector('[col-id="date"]')?.textContent || ""
    ).trim();
    if (!rawDate) return;

    const dateStr = formatDate(rawDate);

    const premium = cleanNum(pick(row, '[col-id="month1close"]'));
    const premiumChange = cleanNum(pick(row, '[col-id="month1changePerc"]'));
    const Oi = cleanNum(pick(row, '[col-id="month1combinedOi"]'));
    const OiChangePerc = cleanNum(
      pick(row, '[col-id="month1combinedOiChangePerc"]')
    );

    // ✅ Add OIValue in Crores
    const OIValue = (Oi * premium) / 1e7;

    dataByDate[dateStr] = {
      premium,
      premiumChange,
      Oi,
      OiChangePerc,
      OIValue,
    };
  });

  // ========= Detect active symbol (attempt)
  function getActiveSymbol() {
    try {
      const tabs = document.querySelectorAll(
        ".top_tab_parent .draggable_top_bar .top_bar .w-100"
      );
      for (const tab of tabs) {
        const a = tab.querySelector(".top_bar_item.active a");
        if (a && a.textContent.trim())
          return a.textContent.trim().toUpperCase();
      }
    } catch (e) {
      /* ignore */
    }
    return null;
  }

  // ---------- pick symbol & rollover object (if you use rollover map externally)
  let symbol = getActiveSymbol();

  // wrap inside symbol object
  let futdata = {
    [symbol]: dataByDate,
  };

  // Log futures list
  const futuresDataString = JSON.stringify(futdata);
  //console.log(futuresDataString);

  //console.log("✔ FUTURES DATA FINAL STRUCTURE:", futuresData);

  return futdata;
}
/*
let futuresData = 
{"ASHOKLEY":{
        "28 Nov 2025":{"premium":157,"premiumChange":0.13,"Oi":129710000,"OiChangePerc":1.06},
        "27 Nov 2025":{"premium":156.8,"premiumChange":4.51,"Oi":128345000,"OiChangePerc":10.3},
        "26 Nov 2025":{"premium":150.04,"premiumChange":2.76,"Oi":116355000,"OiChangePerc":-7.61}
    }
}

*/

// USAGE:
let futuresData = createFutureDataJSON();

function mergeDeliveryAndFuturesData(deliveryData, futuresData) {
  const symbol = Object.keys(deliveryData)[0]; // "ASHOKLEY"
  const finalObj = { [symbol]: {} };

  const deliveryDates = deliveryData[symbol];
  const futureDates = futuresData[symbol] || {};

  // --- Merge both datasets date-wise ---
  const allDates = new Set([
    ...Object.keys(deliveryDates),
    ...Object.keys(futureDates),
  ]);

  allDates.forEach((date) => {
    finalObj[symbol][date] = {
      ...futureDates[date], // premium, OI...
      ...deliveryDates[date], // price, deliveryQty...
    };
  });

  return finalObj;
}

let combined = mergeDeliveryAndFuturesData(deliveryData, futuresData);

// Log combined list
const mergeDeliveryAndFuturesDataString = JSON.stringify(combined);
console.log("FINAL COMBINED:", mergeDeliveryAndFuturesDataString);


// =============================================================================================================================
// runDeliveryAnalyzer  — using `combined` data with Delivery + Futures
// Adds two columns at the END: Confidence (%) and Risk (LOW/MEDIUM/HIGH color label)
// =============================================================================================================================
function createDeliveryAndFutureOIAnalyzer() {
  console.clear();

  // ---- 5 DAY ROLLING AVERAGE HELPER ----
  function fiveDayAvg(arr, idx, key) {
    let count = 0,
      sum = 0;
    for (let i = idx; i < idx + 5 && i < arr.length; i++) {
      const v = Number(arr[i][key]) || 0;
      if (v > 0) {
        sum += v;
        count++;
      }
    }
    return count ? sum / count : 0;
  }

  // =========================
  // CONFIG
  // =========================
  const SETTINGS = {
    VALUE_BAR_LEN: 50,
    PRICE_BAR_LEN: 25,
    OIVALUE_BAR_LEN: 50,

    FONT_SIZES: [10, 12, 14, 18, 22, 28, 32, 36],
    PRICE_MINI_BAR_LEN: 6,
  };

  // =========================
  // UTILITIES
  // =========================
  const cleanNum = (v) => {
    const s = String(v ?? "").replace(/[^0-9.-]/g, "");
    const n = parseFloat(s);
    return isFinite(n) ? n : 0;
  };

  const fmtCr = (n) => `₹${Number(n).toFixed(2)} Cr`;
  const fmtNumIN = (n) => {
    try {
      return Math.abs(n).toLocaleString("en-IN");
    } catch {
      return String(n);
    }
  };

  // =========================
  // READ COMBINED DATA
  // =========================
  const symbol = Object.keys(combined)[0];
  let rows = Object.entries(combined[symbol]).map(([date, obj]) => ({
    DATE: date,
    ...obj,
  }));

  if (!rows.length) {
    console.error("❌ No rows in COMBINED object for:", symbol);
    return;
  }

  // =========================
  // NORMALIZE & COMPUTE
  // =========================
  rows = rows.map((r) => {
    const price = cleanNum(r.price);
    const delQty = cleanNum(r.deliveryQty);
    const delPct = cleanNum(r.deliveryPerc);
    const premium = cleanNum(r.premium);
    const OIValue = cleanNum(r.OIValue); // already in Cr

    const deliveryValue = (delQty * price) / 1e7; // in Cr
    const changePct = cleanNum(r.changePct || 0);

    return {
      ...r,
      price,
      delQty,
      delPct,
      premium,
      OIValue,
      deliveryValue,
      changePct,
    };
  });

  // =========================
  // 5-DAY ROLLING AVERAGES
  // =========================
  for (let i = 0; i < rows.length; i++) {
    const window = rows.slice(i, i + 5); // 5 rows

    const avg = (arr, fn) => arr.reduce((s, x) => s + fn(x), 0) / arr.length;

    rows[i].avgPrice5 = avg(window, (r) => r.price || 0);
    rows[i].avgDelPct5 = avg(window, (r) => r.delPct || 0);
    rows[i].avgDelVal5 = avg(window, (r) => r.deliveryValue || 0);
    rows[i].avgPremium5 = avg(window, (r) => r.premium || 0);
    rows[i].avgOIValue5 = avg(window, (r) => r.OIValue || 0);
  }

  // filter-out rows with price == 0 from ranges but keep them in rows array for display (you asked earlier to skip zero-price only for min calc)
  const pricedRows = rows.filter((r) => r.price > 0);

  // basic ranges
  const maxDelValue = Math.max(...rows.map((r) => r.deliveryValue || 0), 1);
  const maxPrice = Math.max(...rows.map((r) => r.price || 0), 1);
  const minPrice = Math.min(...pricedRows.map((r) => r.price), maxPrice || 1); // ignore zero priced rows for min
  const maxOIValue = Math.max(...rows.map((r) => r.OIValue || 0), 1);

  // =========================
  // maxPremium, minPremium
  // =========================
  const maxPremium = Math.max(...rows.map((r) => r.premium || 0), 1);
  const minPremium = Math.min(
    ...rows.map((r) => r.premium).filter((p) => p > 0),
    1
  );

  // =========================
  // BAR FUNCTIONS
  // =========================
  const BAR_FILLED = "█";
  const BAR_EMPTY = " ";

  function linearBar(val, maxv, len) {
    const ratio = Math.max(0, Math.min(1, val / (maxv || 1)));
    const filled = Math.round(ratio * len);
    return BAR_FILLED.repeat(filled) + BAR_EMPTY.repeat(len - filled);
  }

  // =========================
  // COLORS
  // =========================
  const COLORS = {
    green: "#13814b",
    softGreen: "#66BB6A",
    red: "#c8062e",
    softRed: "#EF9A9A",
    neutral: "#9e9e9e",
    empty: "#363636",
    darkBg: "#1d1d1d",
    amberSoft: "#D9A441",
    black: "#282828",
    white: "#ffffff",
    yellow: "#D9A441", // reuse amber as yellowish
    softBlue: "#3867a9",
  };

  // =========================
  // HEADER
  // =========================
  const TITLE = `${symbol} Delivery Analyzer`;

  console.log(
    `%c${TITLE}%c ::::::  DELIVERY + FUTURES ANALYZER`,
    `color:#00bcd4; font-size:26px; font-weight:900;  padding:10px 0px;`,
    `color:#80d8ff; font-size:14px; font-weight:bold;`
  );

  const heading =
    "Date".padEnd(9) +
    "│ " +
    "DelQty".padEnd(11) +
    "│ " +
    "Del%".padEnd(5) +
    "│ " +
    "Price Bar".padEnd(19) +
    "│ " +
    "Price".padEnd(8) +
    "│ " +
    "%Chg".padEnd(6) +
    "│ " +
    "Delivery Value Bar (₹ Cr)".padEnd(38) +
    "│ " +
    "Price/DelValue/Premium/OiValue".padEnd(34) +
    "│ " +
    "Premium".padEnd(26) +
    "│ " +
    "OI Value Bar".padEnd(38) +
    "│ " +
    "Val(Δ)".padEnd(28) +
    "│ " +
    "Signal".padEnd(28);

  console.log(
    `%c${heading}`,
    `background:${COLORS.darkBg}; color:#e0e0e0; font-size: 16px; font-weight:bold; padding:6px 2px;`
  );

  // =========================
  // MAIN LOOP
  // =========================
  for (let idx = 0; idx < rows.length; idx++) {
    const r = rows[idx];
    const prev = rows[idx + 1] ?? r;

    // ---- 5 DAY AVERAGES ----
    const avg5_price = fiveDayAvg(rows, idx, "price");
    const avg5_deliveryValue = fiveDayAvg(rows, idx, "deliveryValue");
    const avg5_OIValue = fiveDayAvg(rows, idx, "OIValue");
    const avg5_premium = fiveDayAvg(rows, idx, "premium");

    function normalize(val) {
      if (val > 0.1) return 1;
      if (val < -0.1) return -1;
      return val / 0.1; // scale between -1 to 1
    }

    // Avoid divide-by-zero
    const priceScore = normalize((r.price - avg5_price) / (avg5_price || 1));
    const delScore = normalize(
      (r.deliveryValue - avg5_deliveryValue) / (avg5_deliveryValue || 1)
    );
    const oiScore = normalize((r.OIValue - avg5_OIValue) / (avg5_OIValue || 1));
    const premScore = normalize(
      (r.premium - avg5_premium) / (avg5_premium || 1)
    );

    const finalScore =
      0.4 * oiScore + 0.3 * delScore + 0.2 * priceScore + 0.1 * premScore;

    const finalScorePercent = Math.round(finalScore * 100);

    // ========= Bars
    let priceBar;
    {
      const range = maxPrice - minPrice || 1;
      const ratio = (r.price - minPrice) / range;
      const filled = Math.max(0, Math.round(ratio * SETTINGS.PRICE_BAR_LEN));
      const empty = SETTINGS.PRICE_BAR_LEN - filled;

      const FILLED = "█";
      const EMPTY = "░";

      priceBar = FILLED.repeat(filled) + EMPTY.repeat(empty);
    }
    let premiumBar;
    {
      const range = maxPremium - minPremium || 1;
      const ratio = (r.premium - minPremium) / range;
      const filled = Math.max(0, Math.round(ratio * SETTINGS.PRICE_BAR_LEN));
      const empty = SETTINGS.PRICE_BAR_LEN - filled;

      const FILLED = "█";
      const EMPTY = "░";

      premiumBar = FILLED.repeat(filled) + EMPTY.repeat(empty);
    }

    const delValBar = linearBar(
      r.deliveryValue,
      maxDelValue,
      SETTINGS.VALUE_BAR_LEN
    );
    const oiValueBar = linearBar(
      r.OIValue,
      maxOIValue,
      SETTINGS.OIVALUE_BAR_LEN
    );

    // ========= Value + delta
    const delValCr = r.deliveryValue;
    const prevValCr = prev.deliveryValue || 0;
    const deltaCr = delValCr - prevValCr;
    const delValCrStr = String(fmtCr(delValCr)).padEnd(12);
    const deltaCrStr = (deltaCr >= 0 ? "+" : "-") + fmtCr(Math.abs(deltaCr));

    // ========= Dynamic font for delivery value
    const pctOfMax = delValCr / maxDelValue;
    let fontIdx = 0;

    if (pctOfMax >= 0.92) fontIdx = 7;
    else if (pctOfMax >= 0.78) fontIdx = 6;
    else if (pctOfMax >= 0.62) fontIdx = 5;
    else if (pctOfMax >= 0.48) fontIdx = 4;
    else if (pctOfMax >= 0.34) fontIdx = 3;
    else if (pctOfMax >= 0.2) fontIdx = 2;
    else if (pctOfMax >= 0.1) fontIdx = 1;
    else fontIdx = 0;

    const fontSize = SETTINGS.FONT_SIZES[fontIdx];

    const OIValCrStr = fmtCr(r.OIValue).padEnd(12);

    // =========================
    // SIGNAL LOGIC
    // =========================
    let signal = "HOLD ➖";

    const priceUp = r.price > prev.price;
    const priceDown = r.price < prev.price;

    const premiumUp = r.premium > prev.premium;
    const premiumDown = r.premium < prev.premium;

    const oiUp = r.OIValue > prev.OIValue;
    const oiDown = r.OIValue < prev.OIValue;

    const deliveryStrong =
      r.delPct >= 40 || r.deliveryValue >= maxDelValue * 0.4;

    if (priceUp && oiUp && premiumUp && deliveryStrong) {
      signal = "BUY 🔥";
    } else if (deliveryStrong && oiUp) {
      signal = "ACCUMULATE 🟧";
    } else if (priceDown && oiDown && premiumDown) {
      signal = "SELL 🚨";
    }

    let scoreSignal = "";

    if (finalScorePercent >= 60) scoreSignal = "BUY 🔥";
    else if (finalScorePercent >= 25) scoreSignal = "ACCUMULATE 🟧";
    else if (finalScorePercent > -25) scoreSignal = "HOLD ➖";
    else if (finalScorePercent > -60) scoreSignal = "LIGHT SELL ⚠️";
    else scoreSignal = "SELL 🚨";

    // =========================
    // CONFIDENCE SCORE (0-100)
    // Weighted:
    // Price Trend = 20
    // Premium Trend = 20
    // OI Trend = 25
    // Delivery% strength = 20
    // DeliveryValue strength = 15
    // =========================

    const premiumScore = premiumUp ? 20 : 0;
    const delPctScore = Math.min(20, (r.delPct / 40) * 20); // scale to 0-20 (40% -> full)
    const delValScore = Math.min(
      15,
      (r.deliveryValue / (maxDelValue || 1)) * 15
    ); // scale 0-15

    const rawConfidence =
      priceScore + premiumScore + oiScore + delPctScore + delValScore;
    const confidence = Math.round(Math.max(0, Math.min(100, rawConfidence)));

    // =========================
    // RISK LABEL (LOW / MEDIUM / HIGH) as color label
    // Simple rule using trend alignment and confidence:
    // trendScore = number of positive trends (priceUp, premiumUp, oiUp, deliveryStrong)
    // 4 => LOW, 3 => MEDIUM, <=2 => HIGH
    // Also bump to LOW if confidence >= 80 and trendScore >= 3
    // =========================
    const trendScore =
      (priceUp ? 1 : 0) +
      (premiumUp ? 1 : 0) +
      (oiUp ? 1 : 0) +
      (deliveryStrong ? 1 : 0);

    let riskLabel = "HIGH";
    let riskColor = COLORS.red;

    if (trendScore === 4 || (confidence >= 80 && trendScore >= 3)) {
      riskLabel = "LOW";
      riskColor = COLORS.green;
    } else if (trendScore === 3 || confidence >= 60) {
      riskLabel = "MEDIUM";
      riskColor = COLORS.yellow;
    } else {
      riskLabel = "HIGH";
      riskColor = COLORS.red;
    }

    // =========================
    // FORMAT STRING
    // =========================
    const fmt =
      `%c${String(r.DATE || "").padEnd(12)} │ ` +
      `%c${fmtNumIN(r.delQty).padEnd(14)} │ ` +
      `%c${r.delPct.toFixed(2).padEnd(6)} │ ` +
      `%c${priceBar} │ ` +
      `%c${("₹" + r.price.toFixed(2)).padEnd(10)} │ ` +
      `%c${r.changePct?.toFixed(2).padEnd(8)} │ ` +
      `%c${delValBar} ` +
      `%c █████████████  │ ` +
      `%c██ ` +
      `%c██ ` +
      `%c██ ` +
      `%c██` +
      `%c   │  █████████████ ` +
      `%c${premiumBar} │ ` +
      `%c${String(r.premium).padEnd(7)} │ ` +
      `%c${oiValueBar} │ ` +
      `%c${delValCrStr} , %c${OIValCrStr}  │ ` +
      `%c${String(finalScorePercent).padEnd(5)} │ ` +
      `%c${scoreSignal}`;

    // =========================
    // STYLES
    // (appended the two new style entries for Confidence and Risk)
    // =========================
    const priceColor =
      r.price > prev.price
        ? COLORS.green
        : r.price < prev.price
        ? COLORS.red
        : COLORS.neutral;

    const styles = [
      `color:${COLORS.neutral}; font-weight:bold; font-family:monospace;`, // date
      `color:${COLORS.neutral}; font-weight:bold;`, // delQty
      `color:${COLORS.softBlue}; font-weight:bold;`, // del%
      // PRICE BAR (color depends on price movement)
      `color:${priceColor}; font-weight:bold;`, // priceBar
      // PRICE VALUE (UP/DOWN)
      `color:${priceColor}; font-weight:bold; font-family:monospace;`, // price
      // % CHANGE COLOR
      `color:${
        r.changePct > 0
          ? COLORS.green
          : r.changePct < 0
          ? COLORS.red
          : COLORS.neutral
      }; font-weight:bold;`, // %chg
      `color:${COLORS.amberSoft}; font-weight:bold;`, // delVal bar
      // separator
      `color:#131722;`,
      // the 4 small boxes (price / delVal / premium / OI)
      `color:${priceColor}; font-weight:bold;`, // price box
      `color:${COLORS.amberSoft}; font-weight:bold;`, // delivery value box
      `color:${
        r.premium > prev.premium
          ? COLORS.green
          : r.premium < prev.premium
          ? COLORS.red
          : COLORS.neutral
      }; font-weight:bold;`, // premium box
      `color:${
        r.OIValue > prev.OIValue
          ? COLORS.green
          : r.OIValue < prev.OIValue
          ? COLORS.red
          : COLORS.neutral
      }; font-weight:bold;`, // OIValue box
      `color:#131722;`,
      // premium bar color
      `color:${
        r.premium > prev.premium
          ? COLORS.green
          : r.premium < prev.premium
          ? COLORS.red
          : COLORS.neutral
      }; font-weight:bold;`, // premium bar
      // premium numeric
      `color:${
        r.premium > prev.premium
          ? COLORS.green
          : r.premium < prev.premium
          ? COLORS.red
          : COLORS.neutral
      }; font-weight:bold;`, // premium
      // OI value bar
      `color:${
        r.OIValue > prev.OIValue
          ? COLORS.green
          : r.OIValue < prev.OIValue
          ? COLORS.red
          : COLORS.neutral
      }; font-weight:bold;`, // oi value bar
      // Delivery Value (big)
      `color:${COLORS.amberSoft}; font-weight:bold; font-family:monospace; font-size:16px;`, // delVal big
      // Delivery Value (big)
      `color:${COLORS.softBlue}; font-weight:bold; font-family:monospace; font-size:16px;`, // OilVal big
      // Score color
      `color:${
        finalScorePercent >= 50
          ? COLORS.green
          : finalScorePercent >= 20
          ? COLORS.amberSoft
          : finalScorePercent > -20
          ? COLORS.neutral
          : finalScorePercent > -50
          ? COLORS.softRed
          : COLORS.red
      }; font-weight:bold; font-family:monospace;`,

      // Score Signal color
      `color:${
        scoreSignal.includes("BUY")
          ? COLORS.green
          : scoreSignal.includes("SELL")
          ? COLORS.red
          : scoreSignal.includes("ACCUMULATE")
          ? COLORS.amberSoft
          : COLORS.neutral
      }; font-weight:bold; font-family:monospace;`,
    ];

    console.log(fmt, ...styles);
  }

  console.log("Delivery Analyzer executed (Delivery + Futures mode).");
}

// RUN
createDeliveryAndFutureOIAnalyzer();
