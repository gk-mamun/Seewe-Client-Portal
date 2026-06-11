import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import Card from '../../components/Card/Card.jsx';
import InfoGrid from '../../components/InfoGrid/InfoGrid.jsx';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

const KL_OFFICE = [
  { label: 'Office',  value: 'Kuala Lumpur HQ' },
  { label: 'Address', value: 'Suite 12.05, Wisma KL, Jalan Sultan Ismail, KL' },
  { label: 'Phone',   value: '+60 3-2096 1234' },
  { label: 'Email',   value: 'kloffice@seewe.work' },
];
const HK_OFFICE = [
  { label: 'Office',  value: 'Hong Kong Branch' },
  { label: 'Address', value: 'Unit 1810, Wan Chai, Hong Kong' },
  { label: 'Phone',   value: '+852 2345 6789' },
  { label: 'Email',   value: 'hkoffice@seewe.work' },
];

export default function SeeweContactPage() {
  useDocumentTitle('SeeWe Contact');
  return (
    <>
      <PageHeader title="SeeWe Contact" />
      <Card title="Kuala Lumpur HQ"><InfoGrid items={KL_OFFICE} /></Card>
      <Card title="Hong Kong Branch"><InfoGrid items={HK_OFFICE} /></Card>
      <Card title="Account Manager">
        <p style={{ fontSize: 13 }}>
          For account-level questions please reach out to your dedicated relationship manager,
          or write to <strong>kloffice@seewe.work</strong>.
        </p>
      </Card>
    </>
  );
}
