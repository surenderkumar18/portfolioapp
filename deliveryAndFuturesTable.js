const deliveryData = {"MUTHOOTFIN":{"27 Nov 2025":{"price":3760.5,"deliveryQty":194279,"deliveryPerc":50.85,"deliveryValue":73.06,"changePct":0.94},"26 Nov 2025":{"price":3725.6,"deliveryQty":183659,"deliveryPerc":54.86,"deliveryValue":68.42,"changePct":1.2},"25 Nov 2025":{"price":3681.4,"deliveryQty":263032,"deliveryPerc":41.15,"deliveryValue":96.83,"changePct":1.85},"24 Nov 2025":{"price":3614.4,"deliveryQty":331219,"deliveryPerc":67.66,"deliveryValue":119.72,"changePct":-0.59},"21 Nov 2025":{"price":3636,"deliveryQty":127650,"deliveryPerc":43.94,"deliveryValue":46.41,"changePct":-1.66},"20 Nov 2025":{"price":3697.5,"deliveryQty":172907,"deliveryPerc":56.29,"deliveryValue":63.93,"changePct":-0.11},"19 Nov 2025":{"price":3701.7,"deliveryQty":166587,"deliveryPerc":52.92,"deliveryValue":61.67,"changePct":0.16},"18 Nov 2025":{"price":3695.9,"deliveryQty":291544,"deliveryPerc":55.49,"deliveryValue":107.75,"changePct":-1.72},"17 Nov 2025":{"price":3760.5,"deliveryQty":517785,"deliveryPerc":44.01,"deliveryValue":194.71,"changePct":0.94},"14 Nov 2025":{"price":3725.6,"deliveryQty":677038,"deliveryPerc":14.27,"deliveryValue":252.24,"changePct":9.8},"13 Nov 2025":{"price":3393.1,"deliveryQty":185283,"deliveryPerc":36.37,"deliveryValue":62.87,"changePct":2.05},"12 Nov 2025":{"price":3324.9,"deliveryQty":126241,"deliveryPerc":36.09,"deliveryValue":41.97,"changePct":-1.9},"11 Nov 2025":{"price":3389.3,"deliveryQty":163372,"deliveryPerc":34.86,"deliveryValue":55.37,"changePct":1.84},"10 Nov 2025":{"price":3328.2,"deliveryQty":194624,"deliveryPerc":43.04,"deliveryValue":64.77,"changePct":3.04},"07 Nov 2025":{"price":3230,"deliveryQty":184341,"deliveryPerc":46.33,"deliveryValue":59.54,"changePct":1.45},"06 Nov 2025":{"price":3183.8,"deliveryQty":218081,"deliveryPerc":58.12,"deliveryValue":69.43,"changePct":-0.14},"04 Nov 2025":{"price":3188.3,"deliveryQty":419208,"deliveryPerc":66.16,"deliveryValue":133.66,"changePct":-0.07},"03 Nov 2025":{"price":3190.6,"deliveryQty":125385,"deliveryPerc":43.55,"deliveryValue":40.01,"changePct":0.37},"31 Oct 2025":{"price":3178.7,"deliveryQty":200613,"deliveryPerc":43.33,"deliveryValue":63.77,"changePct":-0.4},"30 Oct 2025":{"price":3191.4,"deliveryQty":191927,"deliveryPerc":53.12,"deliveryValue":61.25,"changePct":0.26},"29 Oct 2025":{"price":3183.2,"deliveryQty":271845,"deliveryPerc":57.75,"deliveryValue":86.53,"changePct":0.04},"28 Oct 2025":{"price":3182,"deliveryQty":577864,"deliveryPerc":47.07,"deliveryValue":183.88,"changePct":1.15},"27 Oct 2025":{"price":3145.9,"deliveryQty":209306,"deliveryPerc":44.65,"deliveryValue":65.85,"changePct":-0.54},"24 Oct 2025":{"price":3163.1,"deliveryQty":289212,"deliveryPerc":47.32,"deliveryValue":91.48,"changePct":-0.6},"23 Oct 2025":{"price":3182.1,"deliveryQty":735000,"deliveryPerc":42.14,"deliveryValue":233.88,"changePct":-2.83},"21 Oct 2025":{"price":3274.7,"deliveryQty":45077,"deliveryPerc":34.28,"deliveryValue":14.76,"changePct":-1.43},"20 Oct 2025":{"price":3322.2,"deliveryQty":149920,"deliveryPerc":39.91,"deliveryValue":49.81,"changePct":-0.37},"17 Oct 2025":{"price":3334.5,"deliveryQty":487057,"deliveryPerc":43.37,"deliveryValue":162.41,"changePct":2.02},"16 Oct 2025":{"price":3268.5,"deliveryQty":114288,"deliveryPerc":48.81,"deliveryValue":37.36,"changePct":0.25},"15 Oct 2025":{"price":3260.3,"deliveryQty":290531,"deliveryPerc":54.88,"deliveryValue":94.72,"changePct":1.31},"14 Oct 2025":{"price":3218.3,"deliveryQty":167987,"deliveryPerc":32,"deliveryValue":54.06,"changePct":0.13},"13 Oct 2025":{"price":3214,"deliveryQty":100506,"deliveryPerc":30.71,"deliveryValue":32.3,"changePct":1.81},"10 Oct 2025":{"price":3156.9,"deliveryQty":266944,"deliveryPerc":49.21,"deliveryValue":84.27,"changePct":-2.85},"09 Oct 2025":{"price":3249.5,"deliveryQty":205251,"deliveryPerc":56.05,"deliveryValue":66.7,"changePct":-0.42},"08 Oct 2025":{"price":3263.1,"deliveryQty":137250,"deliveryPerc":42.07,"deliveryValue":44.79,"changePct":0.63},"07 Oct 2025":{"price":3242.6,"deliveryQty":216557,"deliveryPerc":48.08,"deliveryValue":70.22,"changePct":0.46},"06 Oct 2025":{"price":3227.7,"deliveryQty":189544,"deliveryPerc":45.97,"deliveryValue":61.18,"changePct":1.9},"03 Oct 2025":{"price":3167.6,"deliveryQty":298189,"deliveryPerc":54.38,"deliveryValue":94.45,"changePct":0.73},"01 Oct 2025":{"price":3144.5,"deliveryQty":182310,"deliveryPerc":46.38,"deliveryValue":57.33,"changePct":2.19}}}
;

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
// =============================================================================================================================
function createDeliveryAndFutureOIAnalyzer() {
  console.clear();

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

  // basic ranges
  const maxDelValue = Math.max(...rows.map((r) => r.deliveryValue || 0), 1);
  const maxPrice = Math.max(...rows.map((r) => r.price || 0), 1);
  const minPrice = Math.min(
    ...rows.map((r) => r.price).filter((p) => p > 0) // <-- FIX: ignore zero prices
  );
  const maxOIValue = Math.max(...rows.map((r) => r.OIValue || 0), 1);

  // =========================
  // maxPremium, minPremium
  // =========================

  const maxPremium = Math.max(...rows.map((r) => r.premium || 0), 1);
  const minPremium = Math.min(
    ...rows.map((r) => r.premium).filter((p) => p > 0)
  );

  // =========================
  // BAR FUNCTIONS
  // =========================
  const BAR_FILLED = "█";
  const BAR_EMPTY = " ";

  function linearBar(val, maxv, len) {
    const ratio = Math.max(0, Math.min(1, val / maxv));
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
  };

  // =========================
  // HEADER
  // =========================
  const TITLE = `${symbol} Delivery Analyzer`;

  console.log(
    `%c${TITLE}%c ::::::  DELIVERY + FUTURES ANALYZER`,
    `color:#00bcd4; font-size:26px; font-weight:900;`,
    `color:#80d8ff; font-size:14px; font-weight:bold;`
  );


  const heading =
  "Date".padEnd(9) + "│ " +
  "DelQty".padEnd(11) + "│ " +
  "Del%".padEnd(5) + "│ " +
  "Price Bar".padEnd(19) + "│ " +
  "Price".padEnd(8) + "│ " +
  "%Chg".padEnd(6) + "│ " +
  "Delivery Value Bar (₹ Cr)".padEnd(38) + "│ " +
  "Price/DelValue/Premium/OiValue".padEnd(34) + "│ " +
  "Premium".padEnd(26) + "│ " +
  "OI Value Bar".padEnd(38) + "│ " +
  "Val(Δ)".padEnd(28)  + "│ "  +
  "Signal".padEnd(24);

console.log(
  `%c${heading}`,
  `background:${COLORS.darkBg}; color:#e0e0e0; font-size: 16px; font-weight:bold; padding:4px 2px;`
);

  // =========================
  // MAIN LOOP
  // =========================
  for (let idx = 0; idx < rows.length; idx++) {
    const r = rows[idx];
    const prev = rows[idx + 1] ?? r;

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

    const deliveryStrong = (r.delPct >= 40) || (r.deliveryValue >= maxDelValue * 0.40);

    if (priceUp && oiUp && premiumUp && deliveryStrong) {
        signal = "BUY 🔥";
    }
    else if (deliveryStrong && oiUp) {
        signal = "ACCUMULATE 🟧";
    }
    else if (priceDown && oiDown && premiumDown) {
        signal = "SELL 🚨";
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
      `%c${delValCrStr} , ${OIValCrStr}  │ ` +
      `%c${signal}`;

    // =========================
    // STYLES
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
      `color:${COLORS.softGreen};`, // del%

      // PRICE BAR (color depends on price movement)
      `color:${
        r.price > prev.price
          ? COLORS.green
          : r.price < prev.price
          ? COLORS.red
          : COLORS.neutral
      }; font-weight:bold;`, // priceBar

      // PRICE VALUE (UP/DOWN)
      `color:${
        r.price > prev.price
          ? COLORS.green
          : r.price < prev.price
          ? COLORS.red
          : COLORS.neutral
      };
        font-weight:bold; font-family:monospace;`, // price

      // % CHANGE COLOR
      `color:${
        r.changePct > 0
          ? COLORS.green
          : r.changePct < 0
          ? COLORS.red
          : COLORS.neutral
      }; font-weight:bold;`, // %chg

      `color:${COLORS.amberSoft}; font-weight:bold;`, // delVal bar

      // saperator
      `color:#131722;`,
      

      // NEW 4 color boxes (last column)
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
      // saperator
      `color:#131722;`,
      // PREMIUM BAR (color by premium movement)
      `color:${
        r.premium > prev.premium
          ? COLORS.green
          : r.premium < prev.premium
          ? COLORS.red
          : COLORS.neutral
      }; font-weight:bold;`,

      // PREMIUM (UP/DOWN)
      `color:${
        r.premium > prev.premium
          ? COLORS.green
          : r.premium < prev.premium
          ? COLORS.red
          : COLORS.neutral
      }; font-weight:bold;`, // premium

      // OI VALUE BAR (UP/DOWN)
      `color:${
        r.OIValue > prev.OIValue
          ? COLORS.green
          : r.OIValue < prev.OIValue
          ? COLORS.red
          : COLORS.neutral
      }; font-weight:bold;`, // oi value bar

      // DELIVERY VALUE (big font)
      `color:${COLORS.amberSoft}; font-weight:bold; font-family:monospace; font-size:16px;`, // delVal big
      // signal
      `color:${
        signal.includes("BUY") ? COLORS.green :
        signal.includes("SELL") ? COLORS.red :
        signal.includes("ACCUMULATE") ? COLORS.amberSoft :
        COLORS.neutral
    }; font-weight:bold; font-family:monospace;`,

    ];

    console.log(fmt, ...styles);
  }

  console.log("Delivery Analyzer executed (Delivery + Futures mode).");
}

// RUN
createDeliveryAndFutureOIAnalyzer();
