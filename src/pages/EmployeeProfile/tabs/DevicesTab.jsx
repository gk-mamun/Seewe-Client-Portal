import DataTable from '../../../components/DataTable/DataTable.jsx';

export default function DevicesTab({ employee }) {
  const cols = [
    { key: 'type',      header: 'Type' },
    { key: 'brand',     header: 'Brand' },
    { key: 'model',     header: 'Model' },
    { key: 'serial',    header: 'Serial' },
    { key: 'asset',     header: 'Asset ID' },
    { key: 'issued',    header: 'Issued' },
    { key: 'condition', header: 'Condition' },
  ];

  return (
    <>
      <div className="section-hd">Assigned Devices</div>
      <DataTable
        columns={cols}
        rows={employee.devices || []}
        getRowKey={(r) => r.asset || r.serial}
        emptyText="No devices assigned."
        landscape
      />
    </>
  );
}
