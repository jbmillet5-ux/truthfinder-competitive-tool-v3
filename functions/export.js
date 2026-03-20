function csvEscape(value) {
  const str = String(value ?? "");
  if (str.includes('"') || str.includes(",") || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function onRequestPost(context) {
  try {
    const payload = await context.request.json();
    const rows = Array.isArray(payload?.rows) ? payload.rows : [];

    let csv = "category,value\n";
    for (const row of rows) {
      csv += `${csvEscape(row.category)},${csvEscape(row.value)}\n`;
    }

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="truthfinder_growth_opportunity_plan.csv"'
      }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err?.message || "Export failed" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
