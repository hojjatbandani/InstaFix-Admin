import { useEffect } from 'react';
import {
  MessageSquare,
  Filter,
  RefreshCw,
  ArrowUpCircle,
  UserPlus,
  MoreHorizontal,
  Clock,
} from 'lucide-react';
import { Card, Table, Badge, Button, ButtonGroup, Dropdown, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'Admin InstaFix – Support Tickets Inbox';

export type TicketStatus = 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type SubmittedByType = 'customer' | 'professional';

export interface SupportTicketItem {
  id: string;
  ticketId: string;
  subject: string;
  submittedByType: SubmittedByType;
  submittedByName: string;
  submittedByEmail: string;
  relatedJobId: string | null;
  relatedAccountLabel: string; // e.g. "Customer account" or "Pro: Mike Johnson"
  priority: TicketPriority;
  status: TicketStatus;
  messageCount: number;
  lastMessagePreview: string;
  lastActivityAt: string;
  assignedTo: string | null;
}

// Placeholder data – replace with API
const MOCK_TICKETS: SupportTicketItem[] = [
  {
    id: '1',
    ticketId: 'TKT-2841',
    subject: 'Payment not reflecting after job completion',
    submittedByType: 'customer',
    submittedByName: 'Sarah Mitchell',
    submittedByEmail: 'sarah.m@example.com',
    relatedJobId: 'J-2841',
    relatedAccountLabel: 'Customer account',
    priority: 'high',
    status: 'in_progress',
    messageCount: 4,
    lastMessagePreview: 'Thank you for looking into this. I still don\'t see the refund...',
    lastActivityAt: '2025-02-16 11:30',
    assignedTo: 'Support Agent',
  },
  {
    id: '2',
    ticketId: 'TKT-2839',
    subject: 'Cannot update availability calendar',
    submittedByType: 'professional',
    submittedByName: 'Mike Johnson',
    submittedByEmail: 'mike.j@example.com',
    relatedJobId: null,
    relatedAccountLabel: 'Pro: Mike Johnson',
    priority: 'medium',
    status: 'open',
    messageCount: 1,
    lastMessagePreview: 'The calendar page shows an error when I try to block dates.',
    lastActivityAt: '2025-02-16 10:00',
    assignedTo: null,
  },
  {
    id: '3',
    ticketId: 'TKT-2835',
    subject: 'Request to cancel and refund J-2835',
    submittedByType: 'customer',
    submittedByName: 'Emma Wilson',
    submittedByEmail: 'emma.w@example.com',
    relatedJobId: 'J-2835',
    relatedAccountLabel: 'Customer account',
    priority: 'urgent',
    status: 'open',
    messageCount: 2,
    lastMessagePreview: 'I need to cancel due to emergency. Please process refund.',
    lastActivityAt: '2025-02-16 09:15',
    assignedTo: null,
  },
  {
    id: '4',
    ticketId: 'TKT-2830',
    subject: 'Payout delay – when will I receive payment?',
    submittedByType: 'professional',
    submittedByName: 'Alex Rivera',
    submittedByEmail: 'alex.r@example.com',
    relatedJobId: null,
    relatedAccountLabel: 'Pro: Alex Rivera',
    priority: 'high',
    status: 'waiting_customer',
    messageCount: 6,
    lastMessagePreview: 'We have requested your bank confirmation. Please reply with the details.',
    lastActivityAt: '2025-02-15 16:00',
    assignedTo: 'Support Agent',
  },
  {
    id: '5',
    ticketId: 'TKT-2825',
    subject: 'Issue with job completion rating',
    submittedByType: 'professional',
    submittedByName: 'David Kim',
    submittedByEmail: 'david.k@example.com',
    relatedJobId: 'J-2828',
    relatedAccountLabel: 'Job J-2828',
    priority: 'low',
    status: 'resolved',
    messageCount: 3,
    lastMessagePreview: 'Resolved: rating corrected after review.',
    lastActivityAt: '2025-02-14 14:00',
    assignedTo: 'Support Agent',
  },
];

const STATUS_LABEL: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  waiting_customer: 'Waiting on customer',
  resolved: 'Resolved',
  closed: 'Closed',
};

const STATUS_VARIANT: Record<TicketStatus, string> = {
  open: 'danger',
  in_progress: 'primary',
  waiting_customer: 'warning',
  resolved: 'success',
  closed: 'secondary',
};

const PRIORITY_LABEL: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

const PRIORITY_VARIANT: Record<TicketPriority, string> = {
  low: 'secondary',
  medium: 'info',
  high: 'warning',
  urgent: 'danger',
};

const SupportTicketsInboxPage = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const handleRespond = (t: SupportTicketItem) => console.log('Respond to ticket', t.id);
  const handleEscalate = (t: SupportTicketItem) => console.log('Escalate ticket', t.id);
  const handleAssign = (t: SupportTicketItem) => console.log('Assign ticket', t.id);
  const handleUpdateStatus = (t: SupportTicketItem) => console.log('Update status', t.id);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Support Tickets Inbox</h4>
        <Button variant="outline-primary" size="sm">
          <RefreshCw size={16} className="me-1" />
          Refresh
        </Button>
      </div>

      <p className="text-secondary mb-4">
        Manage customer and professional inquiries submitted through the platform. View ticket status, priority, related job or account, and full conversation history. Respond, escalate, assign tickets internally, and update status for organized communication and timely resolution.
      </p>

      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6} lg={4}>
              <InputGroup size="sm">
                <Form.Control placeholder="Search ticket ID, subject, or user..." />
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
              <Form.Select size="sm" aria-label="Priority">
                <option value="">All priorities</option>
                {Object.entries(PRIORITY_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <Table responsive hover>
            <thead>
              <tr>
                <th className="pt-0">Ticket</th>
                <th className="pt-0">Submitted by</th>
                <th className="pt-0">Related</th>
                <th className="pt-0">Priority</th>
                <th className="pt-0">Status</th>
                <th className="pt-0">Conversation</th>
                <th className="pt-0">Assigned</th>
                <th className="pt-0">Last activity</th>
                <th className="pt-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TICKETS.map((t) => (
                <tr key={t.id}>
                  <td>
                    <Link to={`/general/blank-page?ticket=${t.id}`} className="fw-medium text-decoration-none d-block">
                      {t.ticketId}
                    </Link>
                    <small className="text-secondary d-block" title={t.subject}>
                      {t.subject.length > 45 ? `${t.subject.slice(0, 45)}…` : t.subject}
                    </small>
                  </td>
                  <td>
                    <div className="small">
                      <span className="text-secondary">{t.submittedByType === 'customer' ? 'Customer' : 'Professional'}</span>
                      <div>{t.submittedByName}</div>
                      <div className="text-secondary">{t.submittedByEmail}</div>
                    </div>
                  </td>
                  <td>
                    <div className="small">
                      {t.relatedJobId ? (
                        <Link to={`/general/blank-page?job=${t.relatedJobId}`} className="text-decoration-none">
                          {t.relatedJobId}
                        </Link>
                      ) : (
                        '—'
                      )}
                      <div className="text-secondary">{t.relatedAccountLabel}</div>
                    </div>
                  </td>
                  <td>
                    <Badge
                      bg={PRIORITY_VARIANT[t.priority]}
                      text={t.priority === 'medium' || t.priority === 'high' ? 'dark' : undefined}
                    >
                      {PRIORITY_LABEL[t.priority]}
                    </Badge>
                  </td>
                  <td>
                    <Badge
                      bg={STATUS_VARIANT[t.status]}
                      text={t.status === 'in_progress' || t.status === 'waiting_customer' ? 'dark' : undefined}
                    >
                      {STATUS_LABEL[t.status]}
                    </Badge>
                  </td>
                  <td>
                    <span className="d-inline-flex align-items-center small">
                      <MessageSquare size={12} className="me-1 text-secondary" />
                      {t.messageCount} messages
                    </span>
                    <div className="text-secondary small mt-1" title={t.lastMessagePreview}>
                      {t.lastMessagePreview.length > 50 ? `${t.lastMessagePreview.slice(0, 50)}…` : t.lastMessagePreview}
                    </div>
                  </td>
                  <td>
                    <small>{t.assignedTo ?? 'Unassigned'}</small>
                  </td>
                  <td>
                    <small className="d-flex align-items-center">
                      <Clock size={12} className="me-1 text-secondary" />
                      {t.lastActivityAt}
                    </small>
                  </td>
                  <td className="text-end">
                    <ButtonGroup size="sm">
                      <Link
                        to={`/general/blank-page?ticket=${t.id}`}
                        className="btn btn-outline-primary btn-sm"
                        title="View conversation & respond"
                      >
                        <MessageSquare size={14} />
                      </Link>
                      <Dropdown align="end" as={ButtonGroup}>
                        <Dropdown.Toggle variant="outline-secondary" size="sm" className="no-toggle-icon">
                          <MoreHorizontal size={14} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item as={Link} to={`/general/blank-page?ticket=${t.id}`} onClick={() => handleRespond(t)}>
                            <MessageSquare size={14} className="me-2" />
                            Respond / View conversation
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleEscalate(t)}>
                            <ArrowUpCircle size={14} className="me-2" />
                            Escalate
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleAssign(t)}>
                            <UserPlus size={14} className="me-2" />
                            Assign internally
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleUpdateStatus(t)}>
                            <Clock size={14} className="me-2" />
                            Update status
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

export default SupportTicketsInboxPage;
