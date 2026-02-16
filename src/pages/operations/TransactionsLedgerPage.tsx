import { useEffect } from 'react';
import {
  Eye,
  Filter,
  RefreshCw,
  Download,
} from 'lucide-react';
import { Card, Table, Badge, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'Admin InstaFix – Transactions Ledger';

export type TransactionType = 'payment' | 'refund' | 'commission' | 'payout';

export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'reversed';

export interface LedgerEntry {
  id: string;
  transactionId: string;
  type: TransactionType;
  relatedJobId: string | null;
  relatedUserId: string | null;
  relatedUserLabel: string; // customer or professional name
  amount: number;
  fees: number;
  taxes: number;
  status: TransactionStatus;
  timestamp: string;
}

// Placeholder data – replace with API
const MOCK_LEDGER: LedgerEntry[] = [
  {
    id: '1',
    transactionId: 'TXN-8921',
    type: 'payment',
    relatedJobId: 'J-2841',
    relatedUserId: 'u1',
    relatedUserLabel: 'Sarah Mitchell',
    amount: 120,
    fees: 18,
    taxes: 0,
    status: 'completed',
    timestamp: '2025-02-16 10:05',
  },
  {
    id: '2',
    transactionId: 'TXN-8920',
    type: 'commission',
    relatedJobId: 'J-2841',
    relatedUserId: 'p1',
    relatedUserLabel: 'Mike Johnson',
    amount: -18,
    fees: 0,
    taxes: 0,
    status: 'completed',
    timestamp: '2025-02-16 10:05',
  },
  {
    id: '3',
    transactionId: 'TXN-8918',
    type: 'refund',
    relatedJobId: 'J-2810',
    relatedUserId: 'u2',
    relatedUserLabel: 'Anna Bell',
    amount: -90,
    fees: 0,
    taxes: 0,
    status: 'completed',
    timestamp: '2025-02-12 09:22',
  },
  {
    id: '4',
    transactionId: 'TXN-8915',
    type: 'payout',
    relatedJobId: null,
    relatedUserId: 'p2',
    relatedUserLabel: 'Alex Rivera',
    amount: -456,
    fees: 5,
    taxes: 0,
    status: 'completed',
    timestamp: '2025-02-15 08:00',
  },
  {
    id: '5',
    transactionId: 'TXN-8912',
    type: 'payment',
    relatedJobId: 'J-2828',
    relatedUserId: 'u3',
    relatedUserLabel: 'Lisa Anderson',
    amount: 200,
    fees: 30,
    taxes: 0,
    status: 'completed',
    timestamp: '2025-02-15 16:02',
  },
  {
    id: '6',
    transactionId: 'TXN-8910',
    type: 'commission',
    relatedJobId: 'J-2828',
    relatedUserId: 'p3',
    relatedUserLabel: 'David Kim',
    amount: -30,
    fees: 0,
    taxes: 0,
    status: 'completed',
    timestamp: '2025-02-15 16:02',
  },
  {
    id: '7',
    transactionId: 'TXN-8908',
    type: 'payment',
    relatedJobId: 'J-2835',
    relatedUserId: 'u4',
    relatedUserLabel: 'Emma Wilson',
    amount: 150,
    fees: 22.5,
    taxes: 0,
    status: 'pending',
    timestamp: '2025-02-16 09:01',
  },
  {
    id: '8',
    transactionId: 'TXN-8905',
    type: 'payout',
    relatedJobId: null,
    relatedUserId: 'p4',
    relatedUserLabel: 'Chris Taylor',
    amount: -320,
    fees: 4,
    taxes: 0,
    status: 'pending',
    timestamp: '2025-02-16 07:00',
  },
  {
    id: '9',
    transactionId: 'TXN-8900',
    type: 'payment',
    relatedJobId: 'J-2825',
    relatedUserId: 'u5',
    relatedUserLabel: 'Robert Lee',
    amount: 75,
    fees: 11.25,
    taxes: 0,
    status: 'failed',
    timestamp: '2025-02-15 08:05',
  },
];

const TYPE_LABEL: Record<TransactionType, string> = {
  payment: 'Payment',
  refund: 'Refund',
  commission: 'Commission',
  payout: 'Payout',
};

const TYPE_VARIANT: Record<TransactionType, string> = {
  payment: 'primary',
  refund: 'info',
  commission: 'secondary',
  payout: 'warning',
};

const STATUS_LABEL: Record<TransactionStatus, string> = {
  completed: 'Completed',
  pending: 'Pending',
  failed: 'Failed',
  reversed: 'Reversed',
};

const STATUS_VARIANT: Record<TransactionStatus, string> = {
  completed: 'success',
  pending: 'warning',
  failed: 'danger',
  reversed: 'secondary',
};

const formatCurrency = (n: number) => (n < 0 ? `−$${Math.abs(n).toFixed(2)}` : `$${n.toFixed(2)}`);

const TransactionsLedgerPage = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const handleExport = () => console.log('Export ledger (CSV/Excel)');

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Transactions Ledger</h4>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <Button variant="outline-success" size="sm" onClick={handleExport}>
            <Download size={16} className="me-1" />
            Export
          </Button>
          <Button variant="outline-primary" size="sm">
            <RefreshCw size={16} className="me-1" />
            Refresh
          </Button>
        </div>
      </div>

      <p className="text-secondary mb-4">
        Detailed record of all financial transactions: payments, refunds, commissions, and payouts. Each entry shows transaction ID, related job or user, amount, fees, taxes, status, and timestamp. Filter, search, and export for accounting and reconciliation. Transparency and accurate tracking of all financial movements.
      </p>

      <Card>
        <Card.Body>
          <Row className="mb-3 g-2">
            <Col md={6} lg={3}>
              <InputGroup size="sm">
                <Form.Control placeholder="Search TXN ID, job, user..." />
                <Button variant="outline-secondary">
                  <Filter size={16} />
                </Button>
              </InputGroup>
            </Col>
            <Col md={6} lg={2}>
              <Form.Select size="sm" aria-label="Transaction type">
                <option value="">All types</option>
                {Object.entries(TYPE_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6} lg={2}>
              <Form.Select size="sm" aria-label="Status">
                <option value="">All statuses</option>
                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6} lg={2}>
              <Form.Control type="date" size="sm" aria-label="From date" />
            </Col>
            <Col md={6} lg={2}>
              <Form.Control type="date" size="sm" aria-label="To date" />
            </Col>
          </Row>

          <Table responsive hover>
            <thead>
              <tr>
                <th className="pt-0">Transaction ID</th>
                <th className="pt-0">Type</th>
                <th className="pt-0">Related job / user</th>
                <th className="pt-0">Amount</th>
                <th className="pt-0">Fees</th>
                <th className="pt-0">Taxes</th>
                <th className="pt-0">Status</th>
                <th className="pt-0">Timestamp</th>
                <th className="pt-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LEDGER.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <span className="fw-mono small">{entry.transactionId}</span>
                  </td>
                  <td>
                    <Badge bg={TYPE_VARIANT[entry.type]} text="dark">
                      {TYPE_LABEL[entry.type]}
                    </Badge>
                  </td>
                  <td>
                    <div className="small">
                      {entry.relatedJobId ? (
                        <Link to={`/general/blank-page?job=${entry.relatedJobId}`} className="text-decoration-none d-block">
                          {entry.relatedJobId}
                        </Link>
                      ) : (
                        <span className="text-secondary">—</span>
                      )}
                      <span className="text-secondary">{entry.relatedUserLabel}</span>
                    </div>
                  </td>
                  <td>
                    <span className={entry.amount < 0 ? 'text-danger' : 'text-success'}>
                      {formatCurrency(entry.amount)}
                    </span>
                  </td>
                  <td>
                    {entry.fees > 0 ? (
                      <span className="text-secondary">{formatCurrency(entry.fees)}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    {entry.taxes > 0 ? (
                      <span className="text-secondary">{formatCurrency(entry.taxes)}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <Badge
                      bg={STATUS_VARIANT[entry.status]}
                      text={entry.status === 'pending' ? 'dark' : undefined}
                    >
                      {STATUS_LABEL[entry.status]}
                    </Badge>
                  </td>
                  <td>
                    <small>{entry.timestamp}</small>
                  </td>
                  <td className="text-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      as={Link}
                      to={`/general/blank-page?txn=${entry.transactionId}`}
                      title="View transaction details"
                    >
                      <Eye size={14} />
                    </Button>
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

export default TransactionsLedgerPage;
