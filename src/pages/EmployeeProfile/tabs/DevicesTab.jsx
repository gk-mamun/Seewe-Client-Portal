import DataTable from '../../../components/DataTable/DataTable.jsx';

const fmtDate = (v) => String(v ?? '').slice(0, 10); // strip any time portion

export default function DevicesTab({ employee }) {
  const rows = (employee?.devices ?? []).map((d = {}, i) => ({
    id: d.id ?? i,
    item: d.item ?? '',
    type: d.type ?? '',
    model: d.model ?? '',
    special_status: d.special_status ?? '',
    date: fmtDate(d.date),
  }));

  const cols = [
    { key: 'item',           header: 'Item' },
    { key: 'type',           header: 'Type' },
    { key: 'model',          header: 'Model' },
    { key: 'special_status', header: 'Special Status' },
    { key: 'date',           header: 'Date' },
  ];

  return (
    <>
      <div className="section-hd">Assigned Devices</div>
      <DataTable
        columns={cols}
        rows={rows}
        getRowKey={(r) => r.id}
        emptyText="No devices assigned."
        landscape
      />
    </>
  );
}
