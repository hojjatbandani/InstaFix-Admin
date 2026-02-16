import { useEffect } from 'react';
import {
  XCircle,
  Eye,
  Filter,
  RefreshCw,
  DollarSign,
  AlertTriangle,
  UserX,
  MoreHorizontal,
  BarChart3,
} from 'lucide-react';
import { Card, Table, Badge, Button, ButtonGroup, Dropdown, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'Admin InstaFix – Cancellations Management';

export type InitiatedBy = 'customer' | 'professional' | 'admin' | 'system';

export type CancellationReason =
  | 'customer_change_of_plans'
  | 'professional_unavailable'
  | 'schedule_conflict'
  | 'payment_issue'
  | 'no_show'
  | 'duplicate_booking'
  | 'other';

export interface CancellationItem {
  id: string;
  jobId: string;
  customerName: string;
  professionalId: string | null;
  professionalName: string | null;
  initiatedBy: InitiatedBy;
  reason: CancellationReason;
  reasonDetail?: string;
  cancelledAt: string;
  penaltyAmount: number;
  penaltyOverridden: boolean;
  refundAmount: number;
  professionalImpact: {
    completionRateBefore: number;
    completionRateAfter: number;
    cancellationCount: number;
  };
}

// Placeholder data – replace with API
const MOCK_CANCELLATIONS: CancellationItem[] = [
  {
    id: '1',
    jobId: 'J-2810',
    customerName: 'Anna Bell',
    professionalId: null,
    professionalName: null,
    initiatedBy: 'customer',
    reason: 'customer_change_of_plans',
    reasonDetail: 'Trip postponed.',
    cancelledAt: '2025-02-12 09:15',
    penaltyAmount: 0,
    penaltyOverridden: false,
    refundAmount: 90,
    professionalImpact: {
      completionRateBefore: 98,
      completionRateAfter: 98,
      cancellationCount: 0,
    },
  },
  {
    id: '2',
    jobId: 'J-2805',
    customerName: 'Tom Harris',
    professionalId: '1',
    professionalName: 'Mike Johnson',
    initiatedBy: 'professional',
    reason: 'professional_unavailable',
    reasonDetail: 'Emergency; could not attend.',
    cancelledAt: '2025-02-11 14:00',
    penaltyAmount: 25,
    penaltyOverridden: false,
    refundAmount: 110,
    professionalImpact: {
      completionRateBefore: 99,
      completionRateAfter: 97,
      cancellationCount: 2,
    },
  },
  {
    id: '3',
    jobId: 'J-2800',
    customerName: 'Lisa Park',
    professionalId: '3',
    professionalName: 'Sarah Chen',
    initiatedBy: 'customer',
    reason: 'schedule_conflict',
    cancelledAt: '2025-02-10 11:30',
    penaltyAmount: 0,
    penaltyOverridden: false,
    refundAmount: 65,
    professionalImpact: {
      completionRateBefore: 100,
      completionRateAfter: 100,
      cancellationCount: 0,
    },
  },
  {
    id: '4',
    jobId: 'J-2795',
    customerName: 'David Brown',
    professionalId: '2',
    professionalName: 'Alex Rivera',
    initiatedBy: 'professional',
    reason: 'no_show',
    reasonDetail: 'Customer not at address.',
    cancelledAt: '2025-02-09 16:45',
    penaltyAmount: 0,
    penaltyOverridden: true,
    refundAmount: 0,
    professionalImpact: {
      completionRateBefore: 95,
      completionRateAfter: 95,
      cancellationCount: 1,
    },
  },
  {
    id: '5',
    jobId: 'J-2790',
    customerName: 'Emma Wilson',
    professionalId: '4',
    professionalName: 'Chris Taylor',
    initiatedBy: 'admin',
    reason: 'payment_issue',
    reasonDetail: 'Fraud flag; cancelled by support.',
    cancelledAt: '2025-02-08 10:00',
    penaltyAmount: 0,
    penaltyOverridden: false,
    refundAmount: 0,
    professionalImpact: {
      completionRateBefore: 92,
      completionRateAfter: 92,
      cancellationCount: 3,
    },
  },
];

const INITIATED_BY_LABEL: Record<InitiatedBy, string> = {
  customer: 'Customer',
  professional: 'Professional',
  admin: 'Admin',
  system: 'System',
};

const INITIATED_BY_VARIANT: Record<InitiatedBy, string> = {
  customer: 'info',
  professional: 'warning',
  admin: 'primary',
  system: 'secondary',
};

const REASON_LABEL: Record<CancellationReason, string> = {
  customer_change_of_plans: 'Customer change of plans',
  professional_unavailable: 'Professional unavailable',
  schedule_conflict: 'Schedule conflict',
  payment_issue: 'Payment issue',
  no_show: 'No show',
  duplicate_booking: 'Duplicate booking',
  other: 'Other',
};

const formatCurrency = (n: number) => `$${n.toFixed(2)}`;

const CancellationsManagementPage = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const handleOverridePenalty = (c: CancellationItem) => console.log('Override penalty', c.id);
  const handleDisciplinaryAction = (c: CancellationItem) => console.log('Disciplinary action', c.id);
  const handleViewPatterns = () => console.log('Review cancellation patterns');

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Cancellations Management</h4>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <Button variant="outline-secondary" size="sm" onClick={handleViewPatterns}>
            <BarChart3 size={16} className="me-1" />
            Review patterns
          </Button>
          <Button variant="outline-primary" size="sm">
            <RefreshCw size={16} className="me-1" />
            Refresh
          </Button>
        </div>
      </div>

      <p className="text-secondary mb-4">
        Track all cancelled jobs: who initiated, reason, time, penalties, refunds, and impact on professional performance. Override penalties or take disciplinary action when needed. Maintain fairness, enforce platform policies, and monitor cancellation behavior.
      </p>

      <Row className="mb-3">
        <Col md={6} lg={3}>
          <Card className="border-0 bg-light">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="rounded bg-danger bg-opacity-10 p-2 me-2">
                  <XCircle size={20} className="text-danger" />
                </div>
                <div>
                  <div className="small text-secondary">Total cancellations</div>
                  <div className="fw-semibold">{MOCK_CANCELLATIONS.length}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="border-0 bg-light">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="rounded bg-warning bg-opacity-10 p-2 me-2">
                  <DollarSign size={20} className="text-warning" />
                </div>
                <div>
                  <div className="small text-secondary">Total penalties</div>
                  <div className="fw-semibold">
                    {formatCurrency(MOCK_CANCELLATIONS.reduce((s, c) => s + c.penaltyAmount, 0))}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="border-0 bg-light">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="rounded bg-info bg-opacity-10 p-2 me-2">
                  <DollarSign size={20} className="text-info" />
                </div>
                <div>
                  <div className="small text-secondary">Total refunds</div>
                  <div className="fw-semibold">
                    {formatCurrency(MOCK_CANCELLATIONS.reduce((s, c) => s + c.refundAmount, 0))}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="border-0 bg-light">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="rounded bg-secondary bg-opacity-10 p-2 me-2">
                  <UserX size={20} className="text-secondary" />
                </div>
                <div>
                  <div className="small text-secondary">By professional</div>
                  <div className="fw-semibold">
                    {new Set(MOCK_CANCELLATIONS.filter((c) => c.professionalName).map((c) => c.professionalName)).size}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6} lg={3}>
              <InputGroup size="sm">
                <Form.Control placeholder="Search Job ID, customer..." />
                <Button variant="outline-secondary">
                  <Filter size={16} />
                </Button>
              </InputGroup>
            </Col>
            <Col md={6} lg={2}>
              <Form.Select size="sm" aria-label="Initiated by">
                <option value="">Who initiated</option>
                {Object.entries(INITIATED_BY_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6} lg={2}>
              <Form.Select size="sm" aria-label="Reason">
                <option value="">All reasons</option>
                {Object.entries(REASON_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6} lg={2}>
              <Form.Control type="date" size="sm" aria-label="From date" placeholder="From" />
            </Col>
            <Col md={6} lg={2}>
              <Form.Control type="date" size="sm" aria-label="To date" placeholder="To" />
            </Col>
          </Row>

          <Table responsive hover>
            <thead>
              <tr>
                <th className="pt-0">Job</th>
                <th className="pt-0">Customer</th>
                <th className="pt-0">Professional</th>
                <th className="pt-0">Initiated by</th>
                <th className="pt-0">Reason</th>
                <th className="pt-0">Cancelled at</th>
                <th className="pt-0">Penalty</th>
                <th className="pt-0">Refund</th>
                <th className="pt-0">Impact</th>
                <th className="pt-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CANCELLATIONS.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link to={`/general/blank-page?job=${c.jobId}`} className="fw-medium text-decoration-none">
                      {c.jobId}
                    </Link>
                  </td>
                  <td>{c.customerName}</td>
                  <td>
                    {c.professionalName ? (
                      c.professionalId ? (
                        <Link to={`/general/profile?pro=${c.professionalId}`} className="text-decoration-none">
                          {c.professionalName}
                        </Link>
                      ) : (
                        c.professionalName
                      )
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <Badge bg={INITIATED_BY_VARIANT[c.initiatedBy]} text="dark">
                      {INITIATED_BY_LABEL[c.initiatedBy]}
                    </Badge>
                  </td>
                  <td>
                    <span title={c.reasonDetail}>
                      {REASON_LABEL[c.reason]}
                    </span>
                    {c.penaltyOverridden && (
                      <Badge bg="light" text="dark" className="ms-1">Overridden</Badge>
                    )}
                  </td>
                  <td>
                    <small>{c.cancelledAt}</small>
                  </td>
                  <td>
                    {c.penaltyAmount > 0 ? (
                      <span className="text-warning">{formatCurrency(c.penaltyAmount)}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    {c.refundAmount > 0 ? (
                      <span className="text-success">{formatCurrency(c.refundAmount)}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    {c.professionalName ? (
                      <small className="d-block">
                        Completion: {c.professionalImpact.completionRateAfter}%
                      </small>
                    ) : (
                      '—'
                    )}
                    {c.professionalImpact.cancellationCount > 0 && (
                      <small className="d-block text-secondary">
                        {c.professionalImpact.cancellationCount} cancel(s)
                      </small>
                    )}
                  </td>
                  <td className="text-end">
                    <ButtonGroup size="sm">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        as={Link}
                        to={`/general/blank-page?job=${c.jobId}`}
                        title="View full details"
                      >
                        <Eye size={14} />
                      </Button>
                      <Dropdown align="end" as={ButtonGroup}>
                        <Dropdown.Toggle variant="outline-secondary" size="sm" className="no-toggle-icon">
                          <MoreHorizontal size={14} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleOverridePenalty(c)}>
                            <DollarSign size={14} className="me-2" />
                            Override penalty
                          </Dropdown.Item>
                          {c.professionalName && (
                            <Dropdown.Item onClick={() => handleDisciplinaryAction(c)} className="text-danger">
                              <AlertTriangle size={14} className="me-2" />
                              Disciplinary action
                            </Dropdown.Item>
                          )}
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

export default CancellationsManagementPage;
