import { useEffect, useState, useMemo } from 'react';
import {
  RefreshCw,
  Check,
  X,
  Clock,
  Send,
  Eye,
  Calendar,
  User,
  Briefcase,
  MapPin,
  MessageSquare,
} from 'lucide-react';
import {
  Card,
  Table,
  Badge,
  Button,
  ButtonGroup,
  Form,
  Row,
  Col,
  Modal,
  Dropdown,
} from 'react-bootstrap';
import { Link } from 'react-router';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'InstaFix Admin – Reschedule Requests';

export type RequestedBy = 'customer' | 'professional';
export type RescheduleStatus = 'pending' | 'approved' | 'rejected' | 'alternative_proposed';

export interface RescheduleRequest {
  id: string;
  jobId: string;
  customerName: string;
  professionalName: string;
  serviceCategory: string;
  location: string;
  originalStart: string;
  originalEnd: string;
  proposedStart: string;
  proposedEnd: string;
  requestedBy: RequestedBy;
  reason: string;
  status: RescheduleStatus;
  requestedAt: string;
  adminNote?: string;
  alternativeSlot?: string;
}

const REQUESTED_BY_LABEL: Record<RequestedBy, string> = {
  customer: 'Customer',
  professional: 'Professional',
};

const STATUS_LABEL: Record<RescheduleStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  alternative_proposed: 'Alternative proposed',
};

const STATUS_VARIANT: Record<RescheduleStatus, string> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  alternative_proposed: 'info',
};

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });

// Mock data – replace with API
const MOCK_REQUESTS: RescheduleRequest[] = [
  {
    id: 'rr1',
    jobId: 'J-2901',
    customerName: 'Sarah Mitchell',
    professionalName: 'Mike Johnson',
    serviceCategory: 'Plumbing',
    location: '123 Main St, Downtown',
    originalStart: '2025-02-26T09:00:00',
    originalEnd: '2025-02-26T11:00:00',
    proposedStart: '2025-02-27T14:00:00',
    proposedEnd: '2025-02-27T16:00:00',
    requestedBy: 'customer',
    reason: 'Unexpected meeting; need to move to next day afternoon.',
    status: 'pending',
    requestedAt: '2025-02-25T10:30:00',
  },
  {
    id: 'rr2',
    jobId: 'J-2905',
    customerName: 'Anna Lee',
    professionalName: 'Emma Wilson',
    serviceCategory: 'Appliance repair',
    location: 'East Valley',
    originalStart: '2025-02-26T08:00:00',
    originalEnd: '2025-02-26T10:00:00',
    proposedStart: '2025-02-26T15:00:00',
    proposedEnd: '2025-02-26T17:00:00',
    requestedBy: 'professional',
    reason: 'Previous job running late; requesting same-day afternoon slot.',
    status: 'pending',
    requestedAt: '2025-02-25T07:00:00',
  },
  {
    id: 'rr3',
    jobId: 'J-2898',
    customerName: 'John Doe',
    professionalName: 'Lisa Chen',
    serviceCategory: 'Cleaning',
    location: 'North Side',
    originalStart: '2025-02-24T10:00:00',
    originalEnd: '2025-02-24T13:00:00',
    proposedStart: '2025-02-25T09:00:00',
    proposedEnd: '2025-02-25T12:00:00',
    requestedBy: 'customer',
    reason: 'Family emergency on original date.',
    status: 'approved',
    requestedAt: '2025-02-23T16:00:00',
    adminNote: 'Approved; customer notified.',
  },
  {
    id: 'rr4',
    jobId: 'J-2890',
    customerName: 'Tom Brown',
    professionalName: 'James Park',
    serviceCategory: 'Electrical',
    location: 'South Park Ave',
    originalStart: '2025-02-23T14:00:00',
    originalEnd: '2025-02-23T17:00:00',
    proposedStart: '2025-02-24T08:00:00',
    proposedEnd: '2025-02-24T11:00:00',
    requestedBy: 'professional',
    reason: 'Vehicle breakdown; need morning slot next day.',
    status: 'alternative_proposed',
    requestedAt: '2025-02-22T20:00:00',
    alternativeSlot: '2025-02-24 14:00–17:00',
    adminNote: 'Suggested afternoon slot; waiting for response.',
  },
];

const RescheduleRequestsPage = () => {
  const [requests, setRequests] = useState<RescheduleRequest[]>(MOCK_REQUESTS);
  const [statusFilter, setStatusFilter] = useState<RescheduleStatus | 'all'>('all');
  const [requestedByFilter, setRequestedByFilter] = useState<RequestedBy | 'all'>('all');
  const [detailModalShow, setDetailModalShow] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RescheduleRequest | null>(null);
  const [alternativeModalShow, setAlternativeModalShow] = useState(false);
  const [alternativeSlot, setAlternativeSlot] = useState('');
  const [notifyConfirmShow, setNotifyConfirmShow] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState('');

  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const statusMatch = statusFilter === 'all' || r.status === statusFilter;
      const whoMatch = requestedByFilter === 'all' || r.requestedBy === requestedByFilter;
      return statusMatch && whoMatch;
    });
  }, [requests, statusFilter, requestedByFilter]);

  const handleApprove = (req: RescheduleRequest) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === req.id ? { ...r, status: 'approved' as RescheduleStatus } : r
      )
    );
    setDetailModalShow(false);
    setSelectedRequest(null);
  };

  const handleReject = (req: RescheduleRequest) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === req.id ? { ...r, status: 'rejected' as RescheduleStatus } : r
      )
    );
    setDetailModalShow(false);
    setSelectedRequest(null);
  };

  const openAlternativeModal = (req: RescheduleRequest) => {
    setSelectedRequest(req);
    setAlternativeSlot(req.alternativeSlot ?? '');
    setDetailModalShow(false);
    setAlternativeModalShow(true);
  };

  const handleSuggestAlternative = () => {
    if (!selectedRequest) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: 'alternative_proposed' as RescheduleStatus,
              alternativeSlot,
              adminNote: 'Alternative slot suggested; other party notified.',
            }
          : r
      )
    );
    setAlternativeModalShow(false);
    setSelectedRequest(null);
    setAlternativeSlot('');
  };

  const handleNotifyParty = (req: RescheduleRequest, message: string) => {
    console.log('Notify party:', req.id, message);
    setNotifyConfirmShow(false);
    setNotifyMessage('');
    setSelectedRequest(null);
  };

  const openDetail = (req: RescheduleRequest) => {
    setSelectedRequest(req);
    setDetailModalShow(true);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Reschedule Requests</h4>
        <Button variant="outline-primary" size="sm">
          <RefreshCw size={16} className="me-1" />
          Refresh
        </Button>
      </div>

      <p className="text-secondary mb-4">
        Manage customer or professional requests to change the scheduled time of an existing job. View original booking details, proposed new time, reason for rescheduling, and approval status. Approve, reject, suggest alternative time slots, or notify the other party of the decision for fair and efficient handling of scheduling changes.
      </p>

      <Card>
        <Card.Body>
          <Row className="mb-3 g-2">
            <Col md={6} lg={2}>
              <Form.Select
                size="sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as RescheduleStatus | 'all')}
              >
                <option value="all">All statuses</option>
                {(Object.keys(STATUS_LABEL) as RescheduleStatus[]).map((s) => (
                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6} lg={2}>
              <Form.Select
                size="sm"
                value={requestedByFilter}
                onChange={(e) => setRequestedByFilter(e.target.value as RequestedBy | 'all')}
              >
                <option value="all">Requested by</option>
                <option value="customer">Customer</option>
                <option value="professional">Professional</option>
              </Form.Select>
            </Col>
          </Row>

          <Table responsive hover>
            <thead>
              <tr>
                <th className="pt-0">Job</th>
                <th className="pt-0">Original time</th>
                <th className="pt-0">Proposed time</th>
                <th className="pt-0">Requested by</th>
                <th className="pt-0">Reason</th>
                <th className="pt-0">Status</th>
                <th className="pt-0">Requested at</th>
                <th className="pt-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id}>
                  <td>
                    <Link to={`/jobs-list?job=${req.jobId}`} className="fw-medium text-decoration-none">
                      {req.jobId}
                    </Link>
                    <small className="d-block text-muted">{req.serviceCategory}</small>
                  </td>
                  <td className="small text-nowrap">
                    {formatDateTime(req.originalStart)}
                  </td>
                  <td className="small text-nowrap">
                    {formatDateTime(req.proposedStart)}
                  </td>
                  <td>
                    <Badge bg="light" text="dark">
                      {REQUESTED_BY_LABEL[req.requestedBy]}
                    </Badge>
                  </td>
                  <td className="small" style={{ maxWidth: 180 }}>
                    <span className="text-truncate d-inline-block" title={req.reason}>
                      {req.reason}
                    </span>
                  </td>
                  <td>
                    <Badge bg={STATUS_VARIANT[req.status]}>
                      {STATUS_LABEL[req.status]}
                    </Badge>
                  </td>
                  <td className="small text-nowrap">
                    {formatDateTime(req.requestedAt)}
                  </td>
                  <td className="text-end">
                    <ButtonGroup size="sm">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        title="View details"
                        onClick={() => openDetail(req)}
                      >
                        <Eye size={14} />
                      </Button>
                      {req.status === 'pending' && (
                        <>
                          <Button
                            variant="outline-success"
                            size="sm"
                            title="Approve"
                            onClick={() => handleApprove(req)}
                          >
                            <Check size={14} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            title="Reject"
                            onClick={() => handleReject(req)}
                          >
                            <X size={14} />
                          </Button>
                          <Dropdown as={ButtonGroup} align="end">
                            <Dropdown.Toggle variant="outline-secondary" size="sm" className="no-toggle-icon">
                              <Clock size={14} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => openAlternativeModal(req)}>
                                Suggest alternative time
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => { setSelectedRequest(req); setNotifyConfirmShow(true); }}>
                                Notify other party
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </>
                      )}
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Detail modal */}
      <Modal show={detailModalShow} onHide={() => setDetailModalShow(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Reschedule request details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <div className="small">
              <Row>
                <Col md={6}>
                  <p className="mb-1"><Briefcase size={14} className="me-1" /> <strong>Job:</strong> {selectedRequest.jobId}</p>
                  <p className="mb-1"><strong>Category:</strong> {selectedRequest.serviceCategory}</p>
                  <p className="mb-1"><MapPin size={14} className="me-1" /> <strong>Location:</strong> {selectedRequest.location}</p>
                  <p className="mb-2"><User size={14} className="me-1" /> <strong>Customer:</strong> {selectedRequest.customerName}</p>
                  <p className="mb-2"><User size={14} className="me-1" /> <strong>Professional:</strong> {selectedRequest.professionalName}</p>
                </Col>
                <Col md={6}>
                  <p className="mb-1"><Calendar size={14} className="me-1" /> <strong>Original time:</strong></p>
                  <p className="mb-2">{formatDateTime(selectedRequest.originalStart)} – {formatDateTime(selectedRequest.originalEnd)}</p>
                  <p className="mb-1"><Clock size={14} className="me-1" /> <strong>Proposed time:</strong></p>
                  <p className="mb-2">{formatDateTime(selectedRequest.proposedStart)} – {formatDateTime(selectedRequest.proposedEnd)}</p>
                  <p className="mb-1"><strong>Requested by:</strong> {REQUESTED_BY_LABEL[selectedRequest.requestedBy]}</p>
                  <p className="mb-1"><strong>Status:</strong> <Badge bg={STATUS_VARIANT[selectedRequest.status]}>{STATUS_LABEL[selectedRequest.status]}</Badge></p>
                </Col>
              </Row>
              <p className="mb-1"><MessageSquare size={14} className="me-1" /> <strong>Reason:</strong></p>
              <p className="mb-2">{selectedRequest.reason}</p>
              {selectedRequest.alternativeSlot && (
                <p className="mb-1"><strong>Alternative slot suggested:</strong> {selectedRequest.alternativeSlot}</p>
              )}
              {selectedRequest.adminNote && (
                <p className="mb-0 text-muted"><strong>Admin note:</strong> {selectedRequest.adminNote}</p>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDetailModalShow(false)}>Close</Button>
          {selectedRequest?.status === 'pending' && (
            <>
              <Button variant="success" onClick={() => selectedRequest && handleApprove(selectedRequest)}>
                <Check size={14} className="me-1" /> Approve
              </Button>
              <Button variant="danger" onClick={() => selectedRequest && handleReject(selectedRequest)}>
                <X size={14} className="me-1" /> Reject
              </Button>
              <Button variant="outline-primary" onClick={() => selectedRequest && openAlternativeModal(selectedRequest)}>
                <Clock size={14} className="me-1" /> Suggest alternative
              </Button>
              <Button variant="primary" onClick={() => { setNotifyConfirmShow(true); setDetailModalShow(false); }}>
                <Send size={14} className="me-1" /> Notify other party
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Suggest alternative modal */}
      <Modal show={alternativeModalShow} onHide={() => { setAlternativeModalShow(false); setSelectedRequest(null); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Suggest alternative time</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Alternative date/time (e.g. 2025-02-28 14:00–17:00)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Enter suggested slot(s)..."
              value={alternativeSlot}
              onChange={(e) => setAlternativeSlot(e.target.value)}
            />
            <Form.Text className="text-muted">The other party will be notified of this suggestion.</Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setAlternativeModalShow(false); setSelectedRequest(null); }}>Cancel</Button>
          <Button variant="primary" onClick={handleSuggestAlternative}>
            <Send size={14} className="me-1" /> Send suggestion & notify
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Notify other party modal */}
      <Modal show={notifyConfirmShow} onHide={() => { setNotifyConfirmShow(false); setNotifyMessage(''); setSelectedRequest(null); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notify other party</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <p className="small text-muted mb-2">
              Send a notification about the reschedule decision to the {selectedRequest.requestedBy === 'customer' ? 'customer' : 'professional'}.
            </p>
          )}
          <Form.Group>
            <Form.Label className="small">Message (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Add a short note to include in the notification..."
              value={notifyMessage}
              onChange={(e) => setNotifyMessage(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setNotifyConfirmShow(false); setNotifyMessage(''); setSelectedRequest(null); }}>Cancel</Button>
          <Button variant="primary" onClick={() => selectedRequest && handleNotifyParty(selectedRequest, notifyMessage)}>
            <Send size={14} className="me-1" /> Send notification
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RescheduleRequestsPage;
