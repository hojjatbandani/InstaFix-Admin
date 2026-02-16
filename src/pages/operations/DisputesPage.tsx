import { useEffect } from 'react';
import {
  Eye,
  Filter,
  RefreshCw,
  MessageSquare,
  FileText,
  DollarSign,
  AlertCircle,
  MoreHorizontal,
  Briefcase,
} from 'lucide-react';
import { Card, Table, Badge, Button, ButtonGroup, Dropdown, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'Admin InstaFix – Disputes / Claims';

export type RaisedBy = 'customer' | 'professional';

export type DisputeStatus = 'open' | 'under_review' | 'awaiting_info' | 'resolved' | 'closed';

export type DisputeReason =
  | 'quality_issue'
  | 'payment_disagreement'
  | 'no_show'
  | 'damage_claim'
  | 'scope_dispute'
  | 'other';

export interface DisputeItem {
  id: string;
  jobId: string;
  jobStatus: 'completed' | 'ongoing';
  customerName: string;
  professionalName: string;
  raisedBy: RaisedBy;
  reason: DisputeReason;
  reasonSummary: string;
  status: DisputeStatus;
  openedAt: string;
  jobAmount: number;
  evidenceCount: number;
  hasChatHistory: boolean;
}

// Placeholder data – replace with API
const MOCK_DISPUTES: DisputeItem[] = [
  {
    id: 'd1',
    jobId: 'J-2828',
    jobStatus: 'completed',
    customerName: 'Lisa Anderson',
    professionalName: 'David Kim',
    raisedBy: 'customer',
    reason: 'quality_issue',
    reasonSummary: 'Work not completed to standard; corners left unfinished.',
    status: 'under_review',
    openedAt: '2025-02-14 11:00',
    jobAmount: 200,
    evidenceCount: 3,
    hasChatHistory: true,
  },
  {
    id: 'd2',
    jobId: 'J-2825',
    jobStatus: 'completed',
    customerName: 'Robert Lee',
    professionalName: 'Chris Taylor',
    raisedBy: 'professional',
    reason: 'payment_disagreement',
    reasonSummary: 'Customer disputes final invoice; claims extra charges not agreed.',
    status: 'open',
    openedAt: '2025-02-15 09:30',
    jobAmount: 75,
    evidenceCount: 2,
    hasChatHistory: true,
  },
  {
    id: 'd3',
    jobId: 'J-2832',
    jobStatus: 'ongoing',
    customerName: 'David Brown',
    professionalName: 'Alex Rivera',
    raisedBy: 'customer',
    reason: 'no_show',
    reasonSummary: 'Professional did not arrive at scheduled time.',
    status: 'awaiting_info',
    openedAt: '2025-02-15 14:00',
    jobAmount: 95,
    evidenceCount: 1,
    hasChatHistory: true,
  },
  {
    id: 'd4',
    jobId: 'J-2815',
    jobStatus: 'completed',
    customerName: 'Tom Harris',
    professionalName: 'Mike Johnson',
    raisedBy: 'customer',
    reason: 'damage_claim',
    reasonSummary: 'Claim of damage to property during service.',
    status: 'resolved',
    openedAt: '2025-02-10 16:00',
    jobAmount: 110,
    evidenceCount: 5,
    hasChatHistory: true,
  },
  {
    id: 'd5',
    jobId: 'J-2808',
    jobStatus: 'completed',
    customerName: 'Anna Bell',
    professionalName: 'Sarah Chen',
    raisedBy: 'professional',
    reason: 'scope_dispute',
    reasonSummary: 'Customer requested additional work not in original scope.',
    status: 'closed',
    openedAt: '2025-02-08 10:00',
    jobAmount: 65,
    evidenceCount: 2,
    hasChatHistory: false,
  },
];

const RAISED_BY_LABEL: Record<RaisedBy, string> = {
  customer: 'Customer',
  professional: 'Professional',
};

const RAISED_BY_VARIANT: Record<RaisedBy, string> = {
  customer: 'info',
  professional: 'warning',
};

const STATUS_LABEL: Record<DisputeStatus, string> = {
  open: 'Open',
  under_review: 'Under review',
  awaiting_info: 'Awaiting info',
  resolved: 'Resolved',
  closed: 'Closed',
};

const STATUS_VARIANT: Record<DisputeStatus, string> = {
  open: 'danger',
  under_review: 'warning',
  awaiting_info: 'info',
  resolved: 'success',
  closed: 'secondary',
};

const REASON_LABEL: Record<DisputeReason, string> = {
  quality_issue: 'Quality issue',
  payment_disagreement: 'Payment disagreement',
  no_show: 'No show',
  damage_claim: 'Damage claim',
  scope_dispute: 'Scope dispute',
  other: 'Other',
};

const formatCurrency = (n: number) => `$${n.toFixed(2)}`;

const DisputesPage = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const handleRequestInfo = (d: DisputeItem) => console.log('Request additional info', d.id);
  const handlePartialRefund = (d: DisputeItem) => console.log('Issue partial refund', d.id);
  const handleFullRefund = (d: DisputeItem) => console.log('Issue full refund', d.id);
  const handleApplyPenalty = (d: DisputeItem) => console.log('Apply penalty', d.id);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Disputes / Claims</h4>
        <Button variant="outline-primary" size="sm">
          <RefreshCw size={16} className="me-1" />
          Refresh
        </Button>
      </div>

      <p className="text-secondary mb-4">
        Manage customer and professional complaints for completed or ongoing jobs. Review dispute reason, supporting evidence, chat history, job details, and payment. Request additional information, issue partial or full refunds, or apply penalties. Fair conflict resolution, platform reputation, and trust between users and professionals.
      </p>

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
              <Form.Select size="sm" aria-label="Status">
                <option value="">All statuses</option>
                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6} lg={2}>
              <Form.Select size="sm" aria-label="Raised by">
                <option value="">Raised by</option>
                {Object.entries(RAISED_BY_LABEL).map(([value, label]) => (
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
          </Row>

          <Table responsive hover>
            <thead>
              <tr>
                <th className="pt-0">Job</th>
                <th className="pt-0">Raised by</th>
                <th className="pt-0">Reason</th>
                <th className="pt-0">Summary</th>
                <th className="pt-0">Payment</th>
                <th className="pt-0">Evidence / Chat</th>
                <th className="pt-0">Opened</th>
                <th className="pt-0">Status</th>
                <th className="pt-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DISPUTES.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div>
                      <Link to={`/general/blank-page?job=${d.jobId}`} className="fw-medium text-decoration-none">
                        {d.jobId}
                      </Link>
                      <div className="small text-secondary">
                        {d.customerName} · {d.professionalName}
                      </div>
                      <Badge bg="light" text="dark" className="mt-1">{d.jobStatus}</Badge>
                    </div>
                  </td>
                  <td>
                    <Badge bg={RAISED_BY_VARIANT[d.raisedBy]} text="dark">
                      {RAISED_BY_LABEL[d.raisedBy]}
                    </Badge>
                  </td>
                  <td>
                    <small>{REASON_LABEL[d.reason]}</small>
                  </td>
                  <td>
                    <span className="text-secondary small" title={d.reasonSummary}>
                      {d.reasonSummary.length > 50 ? `${d.reasonSummary.slice(0, 50)}…` : d.reasonSummary}
                    </span>
                  </td>
                  <td>
                    <span className="d-inline-flex align-items-center">
                      <DollarSign size={12} className="me-1 text-secondary" />
                      {formatCurrency(d.jobAmount)}
                    </span>
                  </td>
                  <td>
                    <span className="d-inline-flex align-items-center small">
                      <FileText size={12} className="me-1 text-secondary" />
                      {d.evidenceCount} evidence
                    </span>
                    {d.hasChatHistory && (
                      <Link
                        to={`/general/blank-page?dispute=${d.id}&chat=1`}
                        className="d-inline-flex align-items-center small ms-1 text-decoration-none"
                        title="View chat history"
                      >
                        <MessageSquare size={12} className="me-1" />
                        Chat
                      </Link>
                    )}
                  </td>
                  <td>
                    <small>{d.openedAt}</small>
                  </td>
                  <td>
                    <Badge
                      bg={STATUS_VARIANT[d.status]}
                      text={d.status === 'under_review' || d.status === 'awaiting_info' ? 'dark' : undefined}
                    >
                      {STATUS_LABEL[d.status]}
                    </Badge>
                  </td>
                  <td className="text-end">
                    <ButtonGroup size="sm">
                      <Link
                        to={`/general/blank-page?dispute=${d.id}`}
                        className="btn btn-outline-primary btn-sm"
                        title="Review both sides: job details, payment, evidence, chat"
                      >
                        <Eye size={14} />
                      </Link>
                      <Dropdown align="end" as={ButtonGroup}>
                        <Dropdown.Toggle variant="outline-secondary" size="sm" className="no-toggle-icon">
                          <MoreHorizontal size={14} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item as={Link} to={`/general/blank-page?dispute=${d.id}`}>
                            <Eye size={14} className="me-2" />
                            Review job details, evidence & chat
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item onClick={() => handleRequestInfo(d)}>
                            <AlertCircle size={14} className="me-2" />
                            Request additional information
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handlePartialRefund(d)}>
                            <DollarSign size={14} className="me-2" />
                            Issue partial refund
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleFullRefund(d)}>
                            <DollarSign size={14} className="me-2" />
                            Issue full refund
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleApplyPenalty(d)} className="text-danger">
                            <Briefcase size={14} className="me-2" />
                            Apply penalty
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

export default DisputesPage;
