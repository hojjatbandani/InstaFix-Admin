import { useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  RefreshCw,
  Clock,
  Receipt,
  Filter,
} from 'lucide-react';
import { Card, Table, Badge, Button, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'Admin InstaFix – Payments Overview';

export type PaymentStatus = 'success' | 'failed' | 'pending' | 'refunded';

export interface PaymentTransaction {
  id: string;
  jobId: string;
  amount: number;
  status: PaymentStatus;
  serviceCategory: string;
  date: string;
  customerName: string;
}

const formatCurrency = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Placeholder metrics – replace with API
const MOCK_METRICS = {
  totalRevenue: 124580,
  platformEarnings: 18687,
  processedTransactions: 1247,
  successfulPaymentsCount: 1189,
  successfulPaymentsAmount: 119420,
  failedPaymentsCount: 32,
  failedPaymentsAmount: 2840,
  refundRate: 4.2,
  pendingPayouts: 15230,
};

// Placeholder recent transactions
const MOCK_TRANSACTIONS: PaymentTransaction[] = [
  { id: 't1', jobId: 'J-2841', amount: 120, status: 'success', serviceCategory: 'Home Cleaning', date: '2025-02-16 10:00', customerName: 'Sarah Mitchell' },
  { id: 't2', jobId: 'J-2839', amount: 85, status: 'success', serviceCategory: 'AC Repair', date: '2025-02-16 14:30', customerName: 'James Chen' },
  { id: 't3', jobId: 'J-2835', amount: 150, status: 'pending', serviceCategory: 'Plumbing', date: '2025-02-16 09:00', customerName: 'Emma Wilson' },
  { id: 't4', jobId: 'J-2832', amount: 95, status: 'success', serviceCategory: 'Electrical', date: '2025-02-15 11:00', customerName: 'David Brown' },
  { id: 't5', jobId: 'J-2828', amount: 200, status: 'success', serviceCategory: 'Carpentry', date: '2025-02-15 16:00', customerName: 'Lisa Anderson' },
  { id: 't6', jobId: 'J-2825', amount: 75, status: 'failed', serviceCategory: 'Pest Control', date: '2025-02-15 08:00', customerName: 'Robert Lee' },
  { id: 't7', jobId: 'J-2810', amount: 90, status: 'refunded', serviceCategory: 'Home Cleaning', date: '2025-02-12 09:15', customerName: 'Anna Bell' },
];

const STATUS_LABEL: Record<PaymentStatus, string> = {
  success: 'Success',
  failed: 'Failed',
  pending: 'Pending',
  refunded: 'Refunded',
};

const STATUS_VARIANT: Record<PaymentStatus, string> = {
  success: 'success',
  failed: 'danger',
  pending: 'warning',
  refunded: 'secondary',
};

const PaymentsOverviewPage = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Payments Overview</h4>
        <Button variant="outline-primary" size="sm">
          <RefreshCw size={16} className="me-1" />
          Refresh
        </Button>
      </div>

      <p className="text-secondary mb-4">
        High-level summary of financial activity: total revenue, platform earnings, processed transactions. Key metrics include successful payments, failed payments, refund rate, and pending payouts. Filter by date range, service category, or payment status for a quick financial snapshot and cash flow monitoring.
      </p>

      <Row className="mb-3">
        <Col md={6} lg={4}>
          <Form.Group>
            <Form.Label className="small text-secondary">Date range</Form.Label>
            <div className="d-flex gap-1">
              <Form.Control type="date" size="sm" aria-label="From" />
              <Form.Control type="date" size="sm" aria-label="To" />
            </div>
          </Form.Group>
        </Col>
        <Col md={6} lg={2}>
          <Form.Group>
            <Form.Label className="small text-secondary">Service category</Form.Label>
            <Form.Select size="sm" aria-label="Service category">
              <option value="">All categories</option>
              <option value="Home Cleaning">Home Cleaning</option>
              <option value="AC Repair">AC Repair</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Pest Control">Pest Control</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6} lg={2}>
          <Form.Group>
            <Form.Label className="small text-secondary">Payment status</Form.Label>
            <Form.Select size="sm" aria-label="Payment status">
              <option value="">All statuses</option>
              {Object.entries(STATUS_LABEL).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6} lg={2} className="d-flex align-items-end">
          <Button variant="outline-secondary" size="sm">
            <Filter size={14} className="me-1" />
            Apply
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col sm={6} lg={3} className="mb-3">
          <Card className="border-0 bg-primary bg-opacity-10 h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="rounded bg-primary bg-opacity-25 p-2 me-3">
                  <DollarSign size={24} className="text-primary" />
                </div>
                <div>
                  <div className="small text-secondary">Total revenue</div>
                  <div className="h4 mb-0 text-primary">{formatCurrency(MOCK_METRICS.totalRevenue)}</div>
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
                  <TrendingUp size={24} className="text-success" />
                </div>
                <div>
                  <div className="small text-secondary">Platform earnings</div>
                  <div className="h4 mb-0 text-success">{formatCurrency(MOCK_METRICS.platformEarnings)}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3} className="mb-3">
          <Card className="border-0 bg-info bg-opacity-10 h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="rounded bg-info bg-opacity-25 p-2 me-3">
                  <Receipt size={24} className="text-info" />
                </div>
                <div>
                  <div className="small text-secondary">Processed transactions</div>
                  <div className="h4 mb-0 text-info">{MOCK_METRICS.processedTransactions.toLocaleString()}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3} className="mb-3">
          <Card className="border-0 bg-warning bg-opacity-10 h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="rounded bg-warning bg-opacity-25 p-2 me-3">
                  <Clock size={24} className="text-warning" />
                </div>
                <div>
                  <div className="small text-secondary">Pending payouts</div>
                  <div className="h4 mb-0 text-warning">{formatCurrency(MOCK_METRICS.pendingPayouts)}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6} lg={3} className="mb-3">
          <Card className="border-0 bg-light h-100">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <CheckCircle size={20} className="text-success me-2" />
                <div>
                  <div className="small text-secondary">Successful payments</div>
                  <div className="fw-semibold">{MOCK_METRICS.successfulPaymentsCount}</div>
                  <div className="small text-success">{formatCurrency(MOCK_METRICS.successfulPaymentsAmount)}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="border-0 bg-light h-100">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <XCircle size={20} className="text-danger me-2" />
                <div>
                  <div className="small text-secondary">Failed payments</div>
                  <div className="fw-semibold">{MOCK_METRICS.failedPaymentsCount}</div>
                  <div className="small text-danger">{formatCurrency(MOCK_METRICS.failedPaymentsAmount)}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="border-0 bg-light h-100">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <Receipt size={20} className="text-secondary me-2" />
                <div>
                  <div className="small text-secondary">Refund rate</div>
                  <div className="fw-semibold">{MOCK_METRICS.refundRate}%</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header className="py-2 d-flex justify-content-between align-items-center">
          <span className="fw-medium">Recent transactions</span>
          <Link to="/jobs-list" className="btn btn-sm btn-outline-primary">
            View all
          </Link>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th className="pt-2 pb-2">Job</th>
                <th className="pt-2 pb-2">Customer</th>
                <th className="pt-2 pb-2">Category</th>
                <th className="pt-2 pb-2">Amount</th>
                <th className="pt-2 pb-2">Status</th>
                <th className="pt-2 pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TRANSACTIONS.map((t) => (
                <tr key={t.id}>
                  <td>
                    <Link to={`/general/blank-page?job=${t.jobId}`} className="fw-medium text-decoration-none">
                      {t.jobId}
                    </Link>
                  </td>
                  <td>{t.customerName}</td>
                  <td>
                    <small>{t.serviceCategory}</small>
                  </td>
                  <td>{formatCurrency(t.amount)}</td>
                  <td>
                    <Badge
                      bg={STATUS_VARIANT[t.status]}
                      text={t.status === 'pending' ? 'dark' : undefined}
                    >
                      {STATUS_LABEL[t.status]}
                    </Badge>
                  </td>
                  <td>
                    <small>{t.date}</small>
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

export default PaymentsOverviewPage;
