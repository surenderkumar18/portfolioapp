function createDeliveryDataJSON() {
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

  // ✅ Locate delivery rows
  const rows = document.querySelectorAll(
    '.volumeDelevery-tables .ag-center-cols-container [role="row"]'
  );
  if (!rows.length) {
    console.error(
      "❌ No delivery table rows found. Please open the 'Volume & Delivery' tab first."
    );
    //return;
  }

  // ✅ Extract rows → object keyed by date
  const data = Object.fromEntries(
    Array.from(rows).map(row => {
      const date = row.querySelector('[col-id="dateTime"]')?.textContent.trim();

      const price = parseFloat(row.querySelector('[col-id="close"] span')?.textContent.replace(/,/g, "") || 0);
      const deliveryQty = parseFloat(row.querySelector('[col-id="deliveryVolume"] span')?.textContent.replace(/,/g, "") || 0);
      const deliveryPerc = parseFloat(row.querySelector('[col-id="deliveryPerc"] span')?.textContent.replace(/,/g, "") || 0);
      const changePct = parseFloat(row.querySelector('[col-id="changePerc"] span')?.textContent.replace(/%|,/g, "") || 0);

      // ➕ NEW FIELD: deliveryValue in ₹ Cr
      const deliveryValue = +((deliveryQty * price) / 1e7).toFixed(2);

      return [
        date,
        { price, deliveryQty, deliveryPerc, deliveryValue,changePct }
      ];
    })
  );

  console.log(data);

  let combineDeliveryData = {
    [symbol]: data,
  };

  // Log the list
  const deliveryDataString = JSON.stringify(combineDeliveryData);
  console.log(deliveryDataString);

  // Copy it to the clipboard
  const textarea = document.createElement("textarea");
  textarea.value = deliveryDataString;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);

  console.log("Copied to clipboard!");
}

createDeliveryDataJSON();
