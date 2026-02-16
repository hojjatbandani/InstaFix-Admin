import { useEffect } from 'react';
import {
  Eye,
  Filter,
  RefreshCw,
  DollarSign,
  MessageSquare,
  MoreHorizontal,
  ArrowDownCircle,
  ArrowUpCircle,
  FileText,
} from 'lucide-react';
import { Card, Table, Badge, Button, ButtonGroup, Dropdown, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'Admin InstaFix – Refunds & Adjustments';

export type AdjustmentType = 'refund_full' | 'refund_partial' | 'credit' | 'deduction';

export type RelatedTo = 'job' | 'payment' | 'wallet';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface RefundAdjustmentItem {
  id: string;
  type: AdjustmentType;
  amount: number;
  reason: string;
  relatedTo: RelatedTo;
  originalTransaction: {
    referenceId: string; // job ID or transaction ID
    originalAmount: number;
    date: string;
    description?: string;
  };
  approvalStatus: ApprovalStatus;
  requestedAt: string;
  approvedBy?: string;
  internalNotes?: string;
}

// Placeholder data – replace with API
const MOCK_ITEMS: RefundAdjustmentItem[] = [
  {
    id: 'ra1',
    type: 'refund_full',
    amount: 90,
    reason: 'Customer cancellation – trip postponed',
    relatedTo: 'job',
    originalTransaction: {
      referenceId: 'J-2810',
      originalAmount: 90,
      date: '2025-02-12',
      description: 'Home Cleaning – Anna Bell',
    },
    approvalStatus: 'approved',
    requestedAt: '2025-02-12 09:20',
    approvedBy: 'Admin',
    internalNotes: 'Policy: full refund within 24h cancel.',
  },
  {
    id: 'ra2',
    type: 'refund_partial',
    amount: 55,
    reason: 'Dispute resolution – partial refund agreed',
    relatedTo: 'job',
    originalTransaction: {
      referenceId: 'J-2828',
      originalAmount: 200,
      date: '2025-02-14',
      description: 'Carpentry – Lisa Anderson',
    },
    approvalStatus: 'approved',
    requestedAt: '2025-02-15 10:00',
    approvedBy: 'Admin',
    internalNotes: 'Quality dispute; 55 refund to customer.',
  },
  {
    id: 'ra3',
    type: 'credit',
    amount: 25,
    reason: 'Goodwill credit – service delay',
    relatedTo: 'wallet',
    originalTransaction: {
      referenceId: 'TXN-8842',
      originalAmount: 95,
      date: '2025-02-16',
      description: 'Electrical – David Brown',
    },
    approvalStatus: 'pending',
    requestedAt: '2025-02-16 14:00',
    internalNotes: 'Professional late; credit to customer wallet.',
  },
  {
    id: 'ra4',
    type: 'deduction',
    amount: 25,
    reason: 'Late cancellation penalty',
    relatedTo: 'payment',
    originalTransaction: {
      referenceId: 'J-2805',
      originalAmount: 110,
      date: '2025-02-11',
      description: 'HVAC – Tom Harris',
    },
    approvalStatus: 'approved',
    requestedAt: '2025-02-11 14:15',
    approvedBy: 'Admin',
    internalNotes: 'Pro cancelled; penalty applied per policy.',
  },
  {
    id: 'ra5',
    type: 'refund_full',
    amount: 65,
    reason: 'Duplicate booking – refund',
    relatedTo: 'job',
    originalTransaction: {
      referenceId: 'J-2800',
      originalAmount: 65,
      date: '2025-02-10',
      description: 'Cleaning – Lisa Park',
    },
    approvalStatus: 'rejected',
    requestedAt: '2025-02-10 12:00',
    internalNotes: 'Rejected: duplicate claim already refunded.',
  },
];

const TYPE_LABEL: Record<AdjustmentType, string> = {
  refund_full: 'Full refund',
  refund_partial: 'Partial refund',
  credit: 'Credit',
  deduction: 'Deduction',
};

const TYPE_VARIANT: Record<AdjustmentType, string> = {
  refund_full: 'info',
  refund_partial: 'primary',
  credit: 'success',
  deduction: 'warning',
};

const RELATED_TO_LABEL: Record<RelatedTo, string> = {
  job: 'Job',
  payment: 'Payment',
  wallet: 'Wallet',
};

const APPROVAL_LABEL: Record<ApprovalStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

const APPROVAL_VARIANT: Record<ApprovalStatus, string> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
};

const formatCurrency = (n: number) => `$${n.toFixed(2)}`;

const RefundsAdjustmentsPage = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const handleIssueFullRefund = () => console.log('Issue full refund');
  const handleIssuePartialRefund = () => console.log('Issue partial refund');
  const handleApplyCredit = () => console.log('Apply credit');
  const handleApplyDeduction = () => console.log('Apply deduction');
  const handleAddNotes = (item: RefundAdjustmentItem) => console.log('Add internal notes', item.id);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Refunds & Adjustments</h4>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle variant="primary" size="sm">
              New adjustment
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleIssueFullRefund}>
                <DollarSign size={14} className="me-2" />
                Issue full refund
              </Dropdown.Item>
              <Dropdown.Item onClick={handleIssuePartialRefund}>
                <DollarSign size={14} className="me-2" />
                Issue partial refund
              </Dropdown.Item>
              <Dropdown.Item onClick={handleApplyCredit}>
                <ArrowUpCircle size={14} className="me-2" />
                Apply credit
              </Dropdown.Item>
              <Dropdown.Item onClick={handleApplyDeduction}>
                <ArrowDownCircle size={14} className="me-2" />
                Apply deduction
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button variant="outline-primary" size="sm">
            <RefreshCw size={16} className="me-1" />
            Refresh
          </Button>
        </div>
      </div>

      <p className="text-secondary mb-4">
        Manage manual financial corrections for jobs, payments, and wallet balances. View refund amounts, adjustment reasons, original transaction details, and approval status. Issue full or partial refunds, apply credits or deductions, and add internal notes for record keeping. Accurate financial handling and resolution of billing discrepancies.
      </p>

      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6} lg={3}>
              <InputGroup size="sm">
                <Form.Control placeholder="Search reference, reason..." />
                <Button variant="outline-secondary">
                  <Filter size={16} />
                </Button>
              </InputGroup>
            </Col>
            <Col md={6} lg={2}>
              <Form.Select size="sm" aria-label="Type">
                <option value="">All types</option>
                {Object.entries(TYPE_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6} lg={2}>
              <Form.Select size="sm" aria-label="Approval status">
                <option value="">All statuses</option>
                {Object.entries(APPROVAL_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6} lg={2}>
              <Form.Select size="sm" aria-label="Related to">
                <option value="">Related to</option>
                {Object.entries(RELATED_TO_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <Table responsive hover>
            <thead>
              <tr>
                <th className="pt-0">Type</th>
                <th className="pt-0">Amount</th>
                <th className="pt-0">Reason</th>
                <th className="pt-0">Related to</th>
                <th className="pt-0">Original transaction</th>
                <th className="pt-0">Requested</th>
                <th className="pt-0">Approval</th>
                <th className="pt-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ITEMS.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Badge bg={TYPE_VARIANT[item.type]} text="dark">
                      {TYPE_LABEL[item.type]}
                    </Badge>
                  </td>
                  <td>
                    <span className={item.type === 'deduction' ? 'text-warning' : 'text-success'}>
                      {item.type === 'deduction' ? '-' : ''}{formatCurrency(item.amount)}
                    </span>
                  </td>
                  <td>
                    <span className="small" title={item.reason}>
                      {item.reason.length > 40 ? `${item.reason.slice(0, 40)}…` : item.reason}
                    </span>
                  </td>
                  <td>
                    <small>{RELATED_TO_LABEL[item.relatedTo]}</small>
                  </td>
                  <td>
                    <div className="small">
                      {item.relatedTo === 'job' ? (
                        <Link to={`/general/blank-page?job=${item.originalTransaction.referenceId}`} className="text-decoration-none">
                          {item.originalTransaction.referenceId}
                        </Link>
                      ) : (
                        item.originalTransaction.referenceId
                      )}
                      <div className="text-secondary">
                        {formatCurrency(item.originalTransaction.originalAmount)} · {item.originalTransaction.date}
                      </div>
                      {item.originalTransaction.description && (
                        <div className="text-secondary">{item.originalTransaction.description}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <small>{item.requestedAt}</small>
                    {item.approvedBy && (
                      <div className="text-secondary small">by {item.approvedBy}</div>
                    )}
                  </td>
                  <td>
                    <Badge
                      bg={APPROVAL_VARIANT[item.approvalStatus]}
                      text={item.approvalStatus === 'pending' ? 'dark' : undefined}
                    >
                      {APPROVAL_LABEL[item.approvalStatus]}
                    </Badge>
                  </td>
                  <td className="text-end">
                    <ButtonGroup size="sm">
                      <Link
                        to={`/general/blank-page?refund=${item.id}`}
                        className="btn btn-outline-primary btn-sm"
                        title="View details & notes"
                      >
                        <Eye size={14} />
                      </Link>
                      <Dropdown align="end" as={ButtonGroup}>
                        <Dropdown.Toggle variant="outline-secondary" size="sm" className="no-toggle-icon">
                          <MoreHorizontal size={14} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item as={Link} to={`/general/blank-page?refund=${item.id}`}>
                            <FileText size={14} className="me-2" />
                            View details & transaction
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleAddNotes(item)}>
                            <MessageSquare size={14} className="me-2" />
                            Add internal notes
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

export default RefundsAdjustmentsPage;
