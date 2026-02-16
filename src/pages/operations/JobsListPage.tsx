import { useEffect } from 'react';
import {
  Eye,
  Filter,
  RefreshCw,
  Download,
  ArrowUpDown,
} from 'lucide-react';
import { Card, Table, Badge, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'Admin InstaFix – Jobs List';

export type JobStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'pending_approval'
  | 'unassigned'
  | 'reschedule_request'
  | 'payment_issue';

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface JobListItem {
  id: string;
  jobId: string;
  customerName: string;
  serviceCategory: string;
  location: string;
  scheduledTime: string;
  price: number;
  paymentStatus: PaymentStatus;
  jobStatus: JobStatus;
  assignedProfessional: string | null;
  createdAt: string;
}

// Placeholder data – replace with API
const MOCK_JOBS: JobListItem[] = [
  {
    id: '1',
    jobId: 'J-2841',
    customerName: 'Sarah Mitchell',
    serviceCategory: 'Home Cleaning',
    location: 'Downtown, North District',
    scheduledTime: '2025-02-15 10:00',
    price: 120,
    paymentStatus: 'paid',
    jobStatus: 'scheduled',
    assignedProfessional: null,
    createdAt: '2025-02-14',
  },
  {
    id: '2',
    jobId: 'J-2839',
    customerName: 'James Chen',
    serviceCategory: 'AC Repair',
    location: 'Central',
    scheduledTime: '2025-02-15 14:30',
    price: 85,
    paymentStatus: 'paid',
    jobStatus: 'in_progress',
    assignedProfessional: 'Mike Johnson',
    createdAt: '2025-02-13',
  },
  {
    id: '3',
    jobId: 'J-2835',
    customerName: 'Emma Wilson',
    serviceCategory: 'Plumbing',
    location: 'West, South',
    scheduledTime: '2025-02-16 09:00',
    price: 150,
    paymentStatus: 'pending',
    jobStatus: 'payment_issue',
    assignedProfessional: null,
    createdAt: '2025-02-14',
  },
  {
    id: '4',
    jobId: 'J-2832',
    customerName: 'David Brown',
    serviceCategory: 'Electrical',
    location: 'East Side',
    scheduledTime: '2025-02-16 11:00',
    price: 95,
    paymentStatus: 'paid',
    jobStatus: 'reschedule_request',
    assignedProfessional: 'Alex Rivera',
    createdAt: '2025-02-12',
  },
  {
    id: '5',
    jobId: 'J-2828',
    customerName: 'Lisa Anderson',
    serviceCategory: 'Carpentry',
    location: 'North District',
    scheduledTime: '2025-02-15 16:00',
    price: 200,
    paymentStatus: 'paid',
    jobStatus: 'completed',
    assignedProfessional: 'David Kim',
    createdAt: '2025-02-10',
  },
  {
    id: '6',
    jobId: 'J-2825',
    customerName: 'Robert Lee',
    serviceCategory: 'Pest Control',
    location: 'Central, Downtown',
    scheduledTime: '2025-02-17 08:00',
    price: 75,
    paymentStatus: 'paid',
    jobStatus: 'scheduled',
    assignedProfessional: 'Chris Taylor',
    createdAt: '2025-02-14',
  },
  {
    id: '7',
    jobId: 'J-2820',
    customerName: 'Maria Garcia',
    serviceCategory: 'Painting',
    location: 'All areas',
    scheduledTime: '2025-02-16 13:00',
    price: 320,
    paymentStatus: 'pending',
    jobStatus: 'unassigned',
    assignedProfessional: null,
    createdAt: '2025-02-15',
  },
  {
    id: '8',
    jobId: 'J-2815',
    customerName: 'Tom Harris',
    serviceCategory: 'HVAC',
    location: 'Downtown',
    scheduledTime: '2025-02-14 09:00',
    price: 110,
    paymentStatus: 'paid',
    jobStatus: 'completed',
    assignedProfessional: 'Mike Johnson',
    createdAt: '2025-02-11',
  },
  {
    id: '9',
    jobId: 'J-2810',
    customerName: 'Anna Bell',
    serviceCategory: 'Home Cleaning',
    location: 'North District',
    scheduledTime: '2025-02-12 10:00',
    price: 90,
    paymentStatus: 'refunded',
    jobStatus: 'cancelled',
    assignedProfessional: null,
    createdAt: '2025-02-09',
  },
];

const JOB_STATUS_LABEL: Record<JobStatus, string> = {
  scheduled: 'Scheduled',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  pending_approval: 'Pending approval',
  unassigned: 'Unassigned',
  reschedule_request: 'Reschedule request',
  payment_issue: 'Payment issue',
};

const JOB_STATUS_VARIANT: Record<JobStatus, string> = {
  scheduled: 'info',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'secondary',
  pending_approval: 'warning',
  unassigned: 'warning',
  reschedule_request: 'info',
  payment_issue: 'danger',
};

const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  paid: 'Paid',
  pending: 'Pending',
  failed: 'Failed',
  refunded: 'Refunded',
};

const PAYMENT_STATUS_VARIANT: Record<PaymentStatus, string> = {
  paid: 'success',
  pending: 'warning',
  failed: 'danger',
  refunded: 'secondary',
};

const formatPrice = (n: number) => `$${n.toFixed(2)}`;

const JobsListPage = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const handleExport = () => {
    console.log('Export data (CSV/Excel)');
    // TODO: wire to API or client-side export
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Jobs List</h4>
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
        Complete record of all jobs on the platform. Filter by status, date, service category, location, and assigned professional. Search, sort, export data, and open full job details from this list. Main operational overview for tracking and managing all service requests.
      </p>

      <Card>
        <Card.Body>
          <Row className="mb-3 g-2">
            <Col md={6} lg={3}>
              <InputGroup size="sm">
                <Form.Control placeholder="Search Job ID, customer..." />
                <Button variant="outline-secondary">
                  <Filter size={16} />
                </Button>
              </InputGroup>
            </Col>
            <Col md={6} lg={2}>
              <Form.Select size="sm" aria-label="Job status">
                <option value="">All statuses</option>
                {Object.entries(JOB_STATUS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6} lg={2}>
              <Form.Select size="sm" aria-label="Payment status">
                <option value="">All payment</option>
                {Object.entries(PAYMENT_STATUS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6} lg={2}>
              <Form.Select size="sm" aria-label="Service category">
                <option value="">All categories</option>
                <option value="Home Cleaning">Home Cleaning</option>
                <option value="AC Repair">AC Repair</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Pest Control">Pest Control</option>
                <option value="Painting">Painting</option>
                <option value="HVAC">HVAC</option>
              </Form.Select>
            </Col>
            <Col md={6} lg={2}>
              <Form.Select size="sm" aria-label="Assigned professional">
                <option value="">Any professional</option>
                <option value="Mike Johnson">Mike Johnson</option>
                <option value="Alex Rivera">Alex Rivera</option>
                <option value="David Kim">David Kim</option>
                <option value="Chris Taylor">Chris Taylor</option>
              </Form.Select>
            </Col>
            <Col md={6} lg={1}>
              <Form.Control type="date" size="sm" placeholder="Date" aria-label="Date" />
            </Col>
          </Row>

          <Table responsive hover>
            <thead>
              <tr>
                <th className="pt-0">
                  <span className="d-inline-flex align-items-center">
                    Job ID
                    <ArrowUpDown size={12} className="ms-1 text-muted" />
                  </span>
                </th>
                <th className="pt-0">Customer</th>
                <th className="pt-0">Category</th>
                <th className="pt-0">Location</th>
                <th className="pt-0">Scheduled</th>
                <th className="pt-0">Price</th>
                <th className="pt-0">Payment</th>
                <th className="pt-0">Status</th>
                <th className="pt-0">Assigned</th>
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
                  <td>
                    <small>{job.serviceCategory}</small>
                  </td>
                  <td>
                    <small className="text-secondary">{job.location}</small>
                  </td>
                  <td>
                    <small>{job.scheduledTime}</small>
                  </td>
                  <td>{formatPrice(job.price)}</td>
                  <td>
                    <Badge
                      bg={PAYMENT_STATUS_VARIANT[job.paymentStatus]}
                      text={job.paymentStatus === 'pending' ? 'dark' : undefined}
                    >
                      {PAYMENT_STATUS_LABEL[job.paymentStatus]}
                    </Badge>
                  </td>
                  <td>
                    <Badge
                      bg={JOB_STATUS_VARIANT[job.jobStatus]}
                      text={job.jobStatus === 'scheduled' || job.jobStatus === 'unassigned' || job.jobStatus === 'pending_approval' || job.jobStatus === 'reschedule_request' ? 'dark' : undefined}
                    >
                      {JOB_STATUS_LABEL[job.jobStatus]}
                    </Badge>
                  </td>
                  <td>
                    <small>{job.assignedProfessional ?? '—'}</small>
                  </td>
                  <td className="text-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      as={Link}
                      to={`/general/blank-page?job=${job.jobId}`}
                      title="Full job details"
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

export default JobsListPage;
