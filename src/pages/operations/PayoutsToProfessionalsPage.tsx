import { useEffect } from 'react';
import {
  CheckCircle,
  Calendar,
  PauseCircle,
  Edit3,
  Eye,
  Filter,
  RefreshCw,
  DollarSign,
  CreditCard,
  MoreHorizontal,
} from 'lucide-react';
import { Card, Table, Badge, Button, ButtonGroup, Dropdown, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'Admin InstaFix – Payouts to Professionals';

export type PayoutStatus = 'pending' | 'scheduled' | 'held' | 'processing' | 'processed' | 'failed';

export type PaymentMethod = 'bank_transfer' | 'paypal' | 'wallet';

export interface PayoutItem {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalEmail: string;
  grossAmount: number;
  commissionDeduction: number;
  netAmount: number;
  paymentMethod: PaymentMethod;
  paymentMethodDetail: string; // last4, email, etc.
  status: PayoutStatus;
  jobsCount: number;
  scheduledDate?: string;
  processedAt?: string;
}

// Placeholder data – replace with API
const MOCK_PAYOUTS: PayoutItem[] = [
  {
    id: 'po1',
    professionalId: '1',
    professionalName: 'Mike Johnson',
    professionalEmail: 'mike.j@example.com',
    grossAmount: 340,
    commissionDeduction: 51,
    netAmount: 289,
    paymentMethod: 'bank_transfer',
    paymentMethodDetail: '****4521',
    status: 'pending',
    jobsCount: 4,
  },
  {
    id: 'po2',
    professionalId: '2',
    professionalName: 'Alex Rivera',
    professionalEmail: 'alex.r@example.com',
    grossAmount: 456,
    commissionDeduction: 68.4,
    netAmount: 387.6,
    paymentMethod: 'paypal',
    paymentMethodDetail: 'alex.r@example.com',
    status: 'scheduled',
    jobsCount: 5,
    scheduledDate: '2025-02-18',
  },
  {
    id: 'po3',
    professionalId: '3',
    professionalName: 'Sarah Chen',
    professionalEmail: 'sarah.c@example.com',
    grossAmount: 185,
    commissionDeduction: 37,
    netAmount: 148,
    paymentMethod: 'bank_transfer',
    paymentMethodDetail: '****7832',
    status: 'held',
    jobsCount: 2,
  },
  {
    id: 'po4',
    professionalId: '4',
    professionalName: 'Chris Taylor',
    professionalEmail: 'chris.t@example.com',
    grossAmount: 320,
    commissionDeduction: 48,
    netAmount: 272,
    paymentMethod: 'wallet',
    paymentMethodDetail: 'Platform wallet',
    status: 'processing',
    jobsCount: 3,
  },
  {
    id: 'po5',
    professionalId: '5',
    professionalName: 'David Kim',
    professionalEmail: 'david.k@example.com',
    grossAmount: 420,
    commissionDeduction: 75.6,
    netAmount: 344.4,
    paymentMethod: 'bank_transfer',
    paymentMethodDetail: '****9012',
    status: 'processed',
    jobsCount: 6,
    processedAt: '2025-02-15 09:00',
  },
  {
    id: 'po6',
    professionalId: '6',
    professionalName: 'Emma Wilson',
    professionalEmail: 'emma.w@example.com',
    grossAmount: 95,
    commissionDeduction: 19,
    netAmount: 76,
    paymentMethod: 'paypal',
    paymentMethodDetail: 'emma.w@example.com',
    status: 'failed',
    jobsCount: 1,
    processedAt: '2025-02-14 14:00',
  },
];

const STATUS_LABEL: Record<PayoutStatus, string> = {
  pending: 'Pending',
  scheduled: 'Scheduled',
  held: 'Held',
  processing: 'Processing',
  processed: 'Processed',
  failed: 'Failed',
};

const STATUS_VARIANT: Record<PayoutStatus, string> = {
  pending: 'warning',
  scheduled: 'info',
  held: 'secondary',
  processing: 'primary',
  processed: 'success',
  failed: 'danger',
};

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  bank_transfer: 'Bank transfer',
  paypal: 'PayPal',
  wallet: 'Wallet',
};

const formatCurrency = (n: number) => `$${n.toFixed(2)}`;

const PayoutsToProfessionalsPage = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const pendingTotal = MOCK_PAYOUTS.filter((p) => p.status === 'pending' || p.status === 'scheduled').reduce((s, p) => s + p.netAmount, 0);
  const processedCount = MOCK_PAYOUTS.filter((p) => p.status === 'processed').length;

  const handleApprove = (p: PayoutItem) => console.log('Approve payout', p.id);
  const handleSchedule = (p: PayoutItem) => console.log('Schedule payout', p.id);
  const handleHold = (p: PayoutItem) => console.log('Hold payout', p.id);
  const handleAdjust = (p: PayoutItem) => console.log('Adjust payout', p.id);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Payouts to Professionals</h4>
        <Button variant="outline-primary" size="sm">
          <RefreshCw size={16} className="me-1" />
          Refresh
        </Button>
      </div>

      <p className="text-secondary mb-4">
        Manage transfer of earnings from completed jobs to professional accounts. View pending and processed payouts, amounts, commission deductions, and payment method details. Approve, schedule, hold, or adjust payouts when necessary. Accurate and timely compensation with financial control and oversight.
      </p>

      <Row className="mb-4">
        <Col sm={6} lg={3} className="mb-3">
          <Card className="border-0 bg-warning bg-opacity-10 h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="rounded bg-warning bg-opacity-25 p-2 me-3">
                  <DollarSign size={24} className="text-warning" />
                </div>
                <div>
                  <div className="small text-secondary">Pending payouts</div>
                  <div className="h4 mb-0 text-warning">{formatCurrency(pendingTotal)}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3} className="mb-3">
          <Card className="border-0 bg-success bg-opacity-10 h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="rounded bg-success bg-opacity-25 p-2 me-3">
                  <CheckCircle size={24} className="text-success" />
                </div>
                <div>
                  <div className="small text-secondary">Processed (this period)</div>
                  <div className="h4 mb-0 text-success">{processedCount}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6} lg={4}>
              <InputGroup size="sm">
                <Form.Control placeholder="Search professional name or email..." />
                <Button variant="outline-secondary">
                  <Filter size={16} />
                </Button>
              </InputGroup>
            </Col>
            <Col md={6} lg={3}>
              <Form.Select size="sm" aria-label="Status">
                <option value="">All statuses</option>
                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6} lg={2}>
              <Form.Select size="sm" aria-label="Payment method">
                <option value="">Payment method</option>
                {Object.entries(PAYMENT_METHOD_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <Table responsive hover>
            <thead>
              <tr>
                <th className="pt-0">Professional</th>
                <th className="pt-0">Gross</th>
                <th className="pt-0">Commission</th>
                <th className="pt-0">Net amount</th>
                <th className="pt-0">Payment method</th>
                <th className="pt-0">Jobs</th>
                <th className="pt-0">Status</th>
                <th className="pt-0">Scheduled / Processed</th>
                <th className="pt-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PAYOUTS.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div>
                      <Link to={`/general/profile?pro=${p.professionalId}`} className="fw-medium text-decoration-none d-block">
                        {p.professionalName}
                      </Link>
                      <small className="text-secondary">{p.professionalEmail}</small>
                    </div>
                  </td>
                  <td>{formatCurrency(p.grossAmount)}</td>
                  <td>
                    <span className="text-secondary">−{formatCurrency(p.commissionDeduction)}</span>
                  </td>
                  <td>
                    <span className="fw-semibold text-success">{formatCurrency(p.netAmount)}</span>
                  </td>
                  <td>
                    <div className="small d-flex align-items-center">
                      <CreditCard size={12} className="me-1 text-secondary" />
                      {PAYMENT_METHOD_LABEL[p.paymentMethod]}
                      <span className="text-secondary ms-1">({p.paymentMethodDetail})</span>
                    </div>
                  </td>
                  <td>{p.jobsCount}</td>
                  <td>
                    <Badge
                      bg={STATUS_VARIANT[p.status]}
                      text={p.status === 'pending' || p.status === 'scheduled' || p.status === 'processing' ? 'dark' : undefined}
                    >
                      {STATUS_LABEL[p.status]}
                    </Badge>
                  </td>
                  <td>
                    <small>
                      {p.scheduledDate ?? p.processedAt ?? '—'}
                    </small>
                  </td>
                  <td className="text-end">
                    <ButtonGroup size="sm">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        as={Link}
                        to={`/general/blank-page?payout=${p.id}`}
                        title="View payout details"
                      >
                        <Eye size={14} />
                      </Button>
                      <Dropdown align="end" as={ButtonGroup}>
                        <Dropdown.Toggle variant="outline-secondary" size="sm" className="no-toggle-icon">
                          <MoreHorizontal size={14} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {(p.status === 'pending' || p.status === 'held') && (
                            <Dropdown.Item onClick={() => handleApprove(p)}>
                              <CheckCircle size={14} className="me-2" />
                              Approve payout
                            </Dropdown.Item>
                          )}
                          {(p.status === 'pending' || p.status === 'held') && (
                            <Dropdown.Item onClick={() => handleSchedule(p)}>
                              <Calendar size={14} className="me-2" />
                              Schedule payout
                            </Dropdown.Item>
                          )}
                          {(p.status === 'pending' || p.status === 'scheduled') && (
                            <Dropdown.Item onClick={() => handleHold(p)}>
                              <PauseCircle size={14} className="me-2" />
                              Hold payout
                            </Dropdown.Item>
                          )}
                          <Dropdown.Item onClick={() => handleAdjust(p)}>
                            <Edit3 size={14} className="me-2" />
                            Adjust payout
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default PayoutsToProfessionalsPage;
