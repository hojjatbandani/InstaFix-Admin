import { useEffect } from 'react';
import {
  CheckCircle,
  UserPlus,
  UserCog,
  ArrowUpCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { Card, Table, Badge, Button, ButtonGroup, Dropdown, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'Admin InstaFix – Jobs Queue';

export type JobStatus =
  | 'pending_approval'
  | 'unassigned'
  | 'active'
  | 'reschedule_request'
  | 'payment_issue'
  | 'verification_issue'
  | 'urgent'
  | 'cancelled';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface JobsQueueItem {
  id: string;
  jobId: string;
  customerName: string;
  serviceCategory: string;
  scheduledTime: string;
  assignedProfessional: string | null;
  status: JobStatus;
  priority: PriorityLevel;
  flag?: string; // e.g. 'reschedule', 'payment', 'verification'
}

// Placeholder data – replace with API
const MOCK_JOBS: JobsQueueItem[] = [
  {
    id: '1',
    jobId: 'J-2841',
    customerName: 'Sarah Mitchell',
    serviceCategory: 'Home Cleaning',
    scheduledTime: '2025-02-15 10:00',
    assignedProfessional: null,
    status: 'unassigned',
    priority: 'high',
  },
  {
    id: '2',
    jobId: 'J-2839',
    customerName: 'James Chen',
    serviceCategory: 'AC Repair',
    scheduledTime: '2025-02-15 14:30',
    assignedProfessional: 'Mike Johnson',
    status: 'pending_approval',
    priority: 'medium',
  },
  {
    id: '3',
    jobId: 'J-2835',
    customerName: 'Emma Wilson',
    serviceCategory: 'Plumbing',
    scheduledTime: '2025-02-16 09:00',
    assignedProfessional: null,
    status: 'payment_issue',
    priority: 'urgent',
  },
  {
    id: '4',
    jobId: 'J-2832',
    customerName: 'David Brown',
    serviceCategory: 'Electrical',
    scheduledTime: '2025-02-16 11:00',
    assignedProfessional: 'Alex Rivera',
    status: 'reschedule_request',
    priority: 'medium',
    flag: 'reschedule',
  },
  {
    id: '5',
    jobId: 'J-2828',
    customerName: 'Lisa Anderson',
    serviceCategory: 'Carpentry',
    scheduledTime: '2025-02-15 16:00',
    assignedProfessional: null,
    status: 'verification_issue',
    priority: 'high',
  },
  {
    id: '6',
    jobId: 'J-2825',
    customerName: 'Robert Lee',
    serviceCategory: 'Pest Control',
    scheduledTime: '2025-02-17 08:00',
    assignedProfessional: 'Chris Taylor',
    status: 'urgent',
    priority: 'urgent',
  },
  {
    id: '7',
    jobId: 'J-2820',
    customerName: 'Maria Garcia',
    serviceCategory: 'Painting',
    scheduledTime: '2025-02-16 13:00',
    assignedProfessional: null,
    status: 'unassigned',
    priority: 'low',
  },
];

const statusLabel: Record<JobStatus, string> = {
  pending_approval: 'Pending approval',
  unassigned: 'Unassigned',
  active: 'Active',
  reschedule_request: 'Reschedule request',
  payment_issue: 'Payment issue',
  verification_issue: 'Verification issue',
  urgent: 'Urgent',
  cancelled: 'Cancelled',
};

const statusVariant: Record<JobStatus, string> = {
  pending_approval: 'warning',
  unassigned: 'info',
  active: 'success',
  reschedule_request: 'primary',
  payment_issue: 'danger',
  verification_issue: 'danger',
  urgent: 'danger',
  cancelled: 'secondary',
};

const priorityVariant: Record<PriorityLevel, string> = {
  low: 'secondary',
  medium: 'info',
  high: 'warning',
  urgent: 'danger',
};

const JobsQueuePage = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const handleApprove = (job: JobsQueueItem) => {
    console.log('Approve', job.jobId);
  };
  const handleAssign = (job: JobsQueueItem) => {
    console.log('Assign', job.jobId);
  };
  const handleReassign = (job: JobsQueueItem) => {
    console.log('Reassign', job.jobId);
  };
  const handleEscalate = (job: JobsQueueItem) => {
    console.log('Escalate', job.jobId);
  };
  const handleCancel = (job: JobsQueueItem) => {
    console.log('Cancel', job.jobId);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Live Operations / Jobs Queue</h4>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <Button variant="outline-primary" size="sm">
            <RefreshCw size={16} className="me-1" />
            Refresh
          </Button>
        </div>
      </div>

      <p className="text-secondary mb-4">
        All active and pending jobs that require immediate attention. Approve, assign, reassign, escalate, cancel, or open full job details from this queue.
      </p>

      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6} lg={4}>
              <InputGroup size="sm">
                <Form.Control placeholder="Search by Job ID or customer..." />
                <Button variant="outline-secondary">
                  <Filter size={16} />
                </Button>
              </InputGroup>
            </Col>
            <Col md={6} lg={4}>
              <Form.Select size="sm" aria-label="Filter by status">
                <option value="">All statuses</option>
                <option value="pending_approval">Pending approval</option>
                <option value="unassigned">Unassigned</option>
                <option value="urgent">Urgent</option>
                <option value="reschedule_request">Reschedule request</option>
                <option value="payment_issue">Payment issue</option>
                <option value="verification_issue">Verification issue</option>
              </Form.Select>
            </Col>
            <Col md={6} lg={4}>
              <Form.Select size="sm" aria-label="Filter by priority">
                <option value="">All priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Form.Select>
            </Col>
          </Row>

          <Table responsive hover>
            <thead>
              <tr>
                <th className="pt-0">Job ID</th>
                <th className="pt-0">Customer</th>
                <th className="pt-0">Service category</th>
                <th className="pt-0">Scheduled time</th>
                <th className="pt-0">Assigned professional</th>
                <th className="pt-0">Status</th>
                <th className="pt-0">Priority</th>
                <th className="pt-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_JOBS.map((job) => (
                <tr key={job.id}>
                  <td>
                    <Link to={`/general/blank-page?job=${job.jobId}`} className="fw-medium text-decoration-none">
                      {job.jobId}
                    </Link>
                  </td>
                  <td>{job.customerName}</td>
                  <td>{job.serviceCategory}</td>
                  <td>{job.scheduledTime}</td>
                  <td>{job.assignedProfessional ?? '—'}</td>
                  <td>
                    <Badge bg={statusVariant[job.status]} text={job.status === 'pending_approval' || job.status === 'unassigned' ? 'dark' : undefined}>
                      {statusLabel[job.status]}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={priorityVariant[job.priority]} text={job.priority === 'medium' || job.priority === 'high' ? 'dark' : undefined}>
                      {job.priority}
                    </Badge>
                  </td>
                  <td className="text-end">
                    <ButtonGroup size="sm">
                      <Link
                        to={`/general/blank-page?job=${job.jobId}`}
                        className="btn btn-outline-primary btn-sm"
                        title="Open full job details"
                      >
                        <Eye size={14} />
                      </Link>
                      <Dropdown align="end" as={ButtonGroup}>
                        <Dropdown.Toggle variant="outline-secondary" size="sm" className="no-toggle-icon">
                          <MoreHorizontal size={14} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {job.status === 'pending_approval' && (
                            <Dropdown.Item onClick={() => handleApprove(job)}>
                              <CheckCircle size={14} className="me-2" />
                              Approve
                            </Dropdown.Item>
                          )}
                          {(!job.assignedProfessional || job.status === 'unassigned') && (
                            <Dropdown.Item onClick={() => handleAssign(job)}>
                              <UserPlus size={14} className="me-2" />
                              Assign
                            </Dropdown.Item>
                          )}
                          {job.assignedProfessional && (
                            <Dropdown.Item onClick={() => handleReassign(job)}>
                              <UserCog size={14} className="me-2" />
                              Reassign
                            </Dropdown.Item>
                          )}
                          <Dropdown.Item onClick={() => handleEscalate(job)}>
                            <ArrowUpCircle size={14} className="me-2" />
                            Escalate
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item className="text-danger" onClick={() => handleCancel(job)}>
                            <XCircle size={14} className="me-2" />
                            Cancel job
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

export default JobsQueuePage;
