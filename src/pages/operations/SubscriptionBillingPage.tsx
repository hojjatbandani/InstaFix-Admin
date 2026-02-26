import { useEffect, useState } from 'react';
import { RefreshCw, Send, Play, Pause, XCircle, StickyNote } from 'lucide-react';
import {
  Card,
  Table,
  Badge,
  Button,
  ButtonGroup,
  Form,
  Col,
  Nav,
  Modal,
} from 'react-bootstrap';
import { Link } from 'react-router';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'InstaFix Admin – Subscription Billing';

export type BillingStatus = 'active' | 'trial' | 'past_due' | 'cancelled' | 'paused';

export interface BillingRecord {
  id: string;
  professionalId: string;
  professionalName: string;
  planName: string;
  status: BillingStatus;
  currentPeriodEnd: string;
  nextChargeAmount?: number;
  nextChargeDate?: string;
  trialEnd?: string;
  billingNotes?: string;
}

export interface InvoiceItem {
  id: string;
  billingRecordId: string;
  invoiceNumber: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  dueDate: string;
  paidAt?: string;
}

const STATUS_LABEL: Record<BillingStatus, string> = {
  active: 'Active',
  trial: 'Trial',
  past_due: 'Past due',
  cancelled: 'Cancelled',
  paused: 'Paused',
};

const STATUS_VARIANT: Record<BillingStatus, string> = {
  active: 'success',
  trial: 'info',
  past_due: 'danger',
  cancelled: 'secondary',
  paused: 'warning',
};

const MOCK_BILLING: BillingRecord[] = [
  {
    id: 'b1',
    professionalId: 'pro1',
    professionalName: 'Mike Johnson',
    planName: 'Pro Plan',
    status: 'active',
    currentPeriodEnd: '2025-03-25',
    nextChargeAmount: 39,
    nextChargeDate: '2025-03-25',
  },
  {
    id: 'b2',
    professionalId: 'pro2',
    professionalName: 'Emma Wilson',
    planName: 'Business Plan',
    status: 'trial',
    currentPeriodEnd: '2025-03-10',
    trialEnd: '2025-03-10',
    nextChargeAmount: 79,
    nextChargeDate: '2025-03-10',
  },
  {
    id: 'b3',
    professionalId: 'pro3',
    professionalName: 'Lisa Chen',
    planName: 'Pro Plan',
    status: 'past_due',
    currentPeriodEnd: '2025-02-20',
    billingNotes: 'Card declined; contacted 2025-02-22.',
  },
];

const MOCK_INVOICES: InvoiceItem[] = [
  { id: 'inv1', billingRecordId: 'b1', invoiceNumber: 'INV-2025-001', amount: 39, status: 'paid', dueDate: '2025-02-25', paidAt: '2025-02-24' },
  { id: 'inv2', billingRecordId: 'b2', invoiceNumber: 'INV-2025-002', amount: 79, status: 'pending', dueDate: '2025-03-10' },
  { id: 'inv3', billingRecordId: 'b3', invoiceNumber: 'INV-2025-003', amount: 39, status: 'failed', dueDate: '2025-02-20' },
];

const SubscriptionBillingPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'failed'>('overview');
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>(MOCK_BILLING);
  const [invoices] = useState<InvoiceItem[]>(MOCK_INVOICES);
  const [notesModalShow, setNotesModalShow] = useState(false);
  const [notesRecord, setNotesRecord] = useState<BillingRecord | null>(null);
  const [trialModalShow, setTrialModalShow] = useState(false);
  const [trialRecord, setTrialRecord] = useState<BillingRecord | null>(null);
  const [trialDays, setTrialDays] = useState(14);

  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => { document.title = DEFAULT_TITLE; };
  }, []);

  const failedPayments = billingRecords.filter((r) => r.status === 'past_due');
  const failedInvoices = invoices.filter((i) => i.status === 'failed');

  const handleSaveNotes = () => {
    if (!notesRecord) return;
    setBillingRecords((prev) =>
      prev.map((r) => (r.id === notesRecord.id ? { ...r, billingNotes: notesRecord.billingNotes } : r))
    );
    setNotesModalShow(false);
    setNotesRecord(null);
  };

  const handleExtendTrial = () => {
    if (!trialRecord) return;
    const newEnd = new Date(trialRecord.trialEnd || trialRecord.currentPeriodEnd);
    newEnd.setDate(newEnd.getDate() + trialDays);
    setBillingRecords((prev) =>
      prev.map((r) =>
        r.id === trialRecord.id
          ? { ...r, trialEnd: newEnd.toISOString().slice(0, 10), currentPeriodEnd: newEnd.toISOString().slice(0, 10) }
          : r
      )
    );
    setTrialModalShow(false);
    setTrialRecord(null);
    setTrialDays(14);
  };

  const handlePauseSubscription = (r: BillingRecord) => {
    setBillingRecords((prev) =>
      prev.map((x) => (x.id === r.id ? { ...x, status: 'paused' as BillingStatus } : x))
    );
  };

  const handleCancelSubscription = (r: BillingRecord) => {
    setBillingRecords((prev) =>
      prev.map((x) => (x.id === r.id ? { ...x, status: 'cancelled' as BillingStatus } : x))
    );
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Subscription Billing</h4>
        <Button variant="outline-primary" size="sm">
          <RefreshCw size={16} className="me-1" />
          Refresh
        </Button>
      </div>

      <p className="text-secondary mb-4">
        Manage all billing activity for professional subscription plans: invoices, trial periods, renewals, and payment status. View billing history, upcoming charges, failed payments, and current subscription state. Start or extend trials, cancel or pause subscriptions, resend invoices, and update billing notes to track revenue and enforce plan access.
      </p>

      <Nav variant="tabs" className="mb-3" onSelect={(k) => setActiveTab((k as 'overview' | 'invoices' | 'failed') ?? 'overview')}>
        <Nav.Item>
          <Nav.Link eventKey="overview" active={activeTab === 'overview'}>Overview</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="invoices" active={activeTab === 'invoices'}>Invoices</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="failed" active={activeTab === 'failed'}>
            Failed payments {failedInvoices.length > 0 && <Badge bg="danger">{failedInvoices.length}</Badge>}
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === 'overview' && (
        <Card>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th className="pt-0">Professional</th>
                  <th className="pt-0">Plan</th>
                  <th className="pt-0">Status</th>
                  <th className="pt-0">Period end</th>
                  <th className="pt-0">Next charge</th>
                  <th className="pt-0 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {billingRecords.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <Link to={`/professionals?id=${r.professionalId}`} className="fw-medium text-decoration-none">
                        {r.professionalName}
                      </Link>
                    </td>
                    <td>{r.planName}</td>
                    <td><Badge bg={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge></td>
                    <td className="small">{r.currentPeriodEnd}</td>
                    <td className="small">
                      {r.nextChargeAmount != null && r.nextChargeDate
                        ? `$${r.nextChargeAmount} on ${r.nextChargeDate}`
                        : '—'}
                    </td>
                    <td className="text-end">
                      <ButtonGroup size="sm">
                        {r.status === 'trial' && (
                          <Button variant="outline-primary" size="sm" onClick={() => { setTrialRecord(r); setTrialModalShow(true); }}>
                            <Play size={14} className="me-1" /> Extend trial
                          </Button>
                        )}
                        {(r.status === 'active' || r.status === 'trial') && (
                          <>
                            <Button variant="outline-warning" size="sm" onClick={() => handlePauseSubscription(r)}>
                              <Pause size={14} />
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleCancelSubscription(r)}>
                              <XCircle size={14} />
                            </Button>
                          </>
                        )}
                        <Button variant="outline-secondary" size="sm" onClick={() => { setNotesRecord(r); setNotesModalShow(true); }}>
                          <StickyNote size={14} />
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {activeTab === 'invoices' && (
        <Card>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th className="pt-0">Invoice</th>
                  <th className="pt-0">Amount</th>
                  <th className="pt-0">Status</th>
                  <th className="pt-0">Due date</th>
                  <th className="pt-0 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>{inv.invoiceNumber}</td>
                    <td>${inv.amount}</td>
                    <td><Badge bg={inv.status === 'paid' ? 'success' : inv.status === 'failed' ? 'danger' : 'warning'}>{inv.status}</Badge></td>
                    <td className="small">{inv.dueDate}</td>
                    <td className="text-end">
                      <Button variant="outline-primary" size="sm">
                        <Send size={14} className="me-1" /> Resend
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {activeTab === 'failed' && (
        <Card>
          <Card.Body>
            {failedInvoices.length === 0 ? (
              <p className="text-muted mb-0">No failed payments.</p>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th className="pt-0">Invoice</th>
                    <th className="pt-0">Professional</th>
                    <th className="pt-0">Amount</th>
                    <th className="pt-0">Due date</th>
                    <th className="pt-0 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {failedInvoices.map((inv) => {
                    const rec = billingRecords.find((r) => r.id === inv.billingRecordId);
                    return (
                      <tr key={inv.id}>
                        <td>{inv.invoiceNumber}</td>
                        <td>{rec?.professionalName ?? '—'}</td>
                        <td>${inv.amount}</td>
                        <td className="small">{inv.dueDate}</td>
                        <td className="text-end">
                          <Button variant="outline-primary" size="sm">Resend invoice</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      )}

      <Modal show={notesModalShow} onHide={() => { setNotesModalShow(false); setNotesRecord(null); }} centered>
        <Modal.Header closeButton><Modal.Title>Billing notes</Modal.Title></Modal.Header>
        <Modal.Body>
          {notesRecord && (
            <Form.Group>
              <Form.Label>Notes for {notesRecord.professionalName}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={notesRecord.billingNotes ?? ''}
                onChange={(e) => setNotesRecord((p) => p ? { ...p, billingNotes: e.target.value } : null)}
              />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setNotesModalShow(false); setNotesRecord(null); }}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveNotes}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={trialModalShow} onHide={() => { setTrialModalShow(false); setTrialRecord(null); }} centered>
        <Modal.Header closeButton><Modal.Title>Extend trial</Modal.Title></Modal.Header>
        <Modal.Body>
          {trialRecord && (
            <Form.Group>
              <Form.Label>Additional trial days</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={trialDays}
                onChange={(e) => setTrialDays(parseInt(e.target.value, 10) || 14)}
              />
              <Form.Text className="text-muted">Current trial end: {trialRecord.trialEnd ?? trialRecord.currentPeriodEnd}</Form.Text>
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setTrialModalShow(false); setTrialRecord(null); }}>Cancel</Button>
          <Button variant="primary" onClick={handleExtendTrial}>Extend trial</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SubscriptionBillingPage;
