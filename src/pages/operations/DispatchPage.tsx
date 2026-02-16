import { useEffect, useState } from 'react';
import {
  Send,
  UserCheck,
  Clock,
  MessageSquare,
  RefreshCw,
  Star,
  MapPin,
  Briefcase,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Card, Table, Badge, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'Admin InstaFix – Dispatch / Manual Matching';

export type JobPriority = 'normal' | 'priority' | 'emergency' | 'vip';

export interface UnassignedJob {
  id: string;
  jobId: string;
  customerName: string;
  serviceCategory: string;
  location: string;
  scheduledTime: string;
  priority: JobPriority;
  internalNotes?: string;
}

export interface EligibleProfessional {
  id: string;
  name: string;
  serviceCategory: string;
  distanceKm: number;
  availability: 'available' | 'busy_soon' | 'limited';
  rating: number;
  currentWorkload: number; // active jobs count
  responseDeadline?: string;
}

// Jobs needing manual assignment
const MOCK_UNASSIGNED_JOBS: UnassignedJob[] = [
  {
    id: '1',
    jobId: 'J-2841',
    customerName: 'Sarah Mitchell',
    serviceCategory: 'Home Cleaning',
    location: 'Downtown, North District',
    scheduledTime: '2025-02-15 10:00',
    priority: 'normal',
  },
  {
    id: '2',
    jobId: 'J-2835',
    customerName: 'Emma Wilson',
    serviceCategory: 'Plumbing',
    location: 'West, South',
    scheduledTime: '2025-02-16 09:00',
    priority: 'emergency',
    internalNotes: 'Customer requested same-day; payment confirmed.',
  },
  {
    id: '3',
    jobId: 'J-2820',
    customerName: 'Maria Garcia',
    serviceCategory: 'Painting',
    location: 'All areas',
    scheduledTime: '2025-02-16 13:00',
    priority: 'vip',
    internalNotes: 'VIP – prefer high rating, flexible time.',
  },
];

// Eligible professionals for selected job (filtered by service category, etc.)
const MOCK_ELIGIBLE: EligibleProfessional[] = [
  {
    id: 'p1',
    name: 'Mike Johnson',
    serviceCategory: 'Home Cleaning, HVAC',
    distanceKm: 2.1,
    availability: 'available',
    rating: 4.8,
    currentWorkload: 2,
  },
  {
    id: 'p2',
    name: 'Sarah Chen',
    serviceCategory: 'Home Cleaning, Deep Clean',
    distanceKm: 4.5,
    availability: 'available',
    rating: 4.9,
    currentWorkload: 1,
  },
  {
    id: 'p3',
    name: 'David Kim',
    serviceCategory: 'Carpentry, Home Cleaning',
    distanceKm: 5.2,
    availability: 'busy_soon',
    rating: 4.5,
    currentWorkload: 4,
  },
  {
    id: 'p4',
    name: 'Alex Rivera',
    serviceCategory: 'Electrical, Smart Home',
    distanceKm: 3.0,
    availability: 'limited',
    rating: 4.6,
    currentWorkload: 3,
  },
];

const PRIORITY_LABEL: Record<JobPriority, string> = {
  normal: 'Normal',
  priority: 'Priority',
  emergency: 'Emergency',
  vip: 'VIP',
};

const PRIORITY_VARIANT: Record<JobPriority, string> = {
  normal: 'secondary',
  priority: 'info',
  emergency: 'danger',
  vip: 'warning',
};

const AVAILABILITY_LABEL: Record<EligibleProfessional['availability'], string> = {
  available: 'Available',
  busy_soon: 'Busy soon',
  limited: 'Limited',
};

const AVAILABILITY_VARIANT: Record<EligibleProfessional['availability'], string> = {
  available: 'success',
  busy_soon: 'warning',
  limited: 'secondary',
};

const DispatchPage = () => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(MOCK_UNASSIGNED_JOBS[0]?.id ?? null);
  const [responseDeadline, setResponseDeadline] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const selectedJob = MOCK_UNASSIGNED_JOBS.find((j) => j.id === selectedJobId) ?? null;

  const handleSendOffer = (proId: string) => console.log('Send job offer to', proId);
  const handleDirectAssign = (proId: string) => console.log('Direct assign to', proId);
  const handleSaveDeadline = () => console.log('Set response deadline', responseDeadline);
  const handleSaveNotes = () => console.log('Save internal notes', internalNotes);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Dispatch / Manual Matching</h4>
        <Button variant="outline-primary" size="sm">
          <RefreshCw size={16} className="me-1" />
          Refresh
        </Button>
      </div>

      <p className="text-secondary mb-4">
        Assign or reassign jobs to professionals when automatic matching fails or when priority handling is needed. View eligible professionals by service category, distance, availability, rating, and workload. Send job offers, directly assign, set response deadlines, and add internal notes. For edge cases, emergencies, and VIP requests.
      </p>

      <Row>
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header className="py-2">
              <span className="fw-medium">Jobs needing assignment</span>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="list-group list-group-flush">
                {MOCK_UNASSIGNED_JOBS.map((job) => (
                  <button
                    key={job.id}
                    type="button"
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-start ${selectedJobId === job.id ? 'active' : ''}`}
                    onClick={() => setSelectedJobId(job.id)}
                  >
                    <div className="text-start">
                      <span className="fw-medium">{job.jobId}</span>
                      <span className="ms-2">
                        <Badge bg={PRIORITY_VARIANT[job.priority]} text="dark">
                          {PRIORITY_LABEL[job.priority]}
                        </Badge>
                      </span>
                      <div className="small opacity-75">{job.customerName} · {job.serviceCategory}</div>
                      <div className="small opacity-75">{job.scheduledTime}</div>
                    </div>
                  </button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          {selectedJob ? (
            <>
              <Card className="mb-4">
                <Card.Header className="py-2 d-flex justify-content-between align-items-center">
                  <span className="fw-medium">Job details – {selectedJob.jobId}</span>
                  <Link to={`/general/blank-page?job=${selectedJob.jobId}`} className="btn btn-sm btn-outline-primary">
                    Full details
                  </Link>
                </Card.Header>
                <Card.Body>
                  <Row className="g-2 small">
                    <Col xs={6} md={3}>
                      <span className="text-secondary">Customer</span>
                      <div>{selectedJob.customerName}</div>
                    </Col>
                    <Col xs={6} md={3}>
                      <span className="text-secondary">Category</span>
                      <div>{selectedJob.serviceCategory}</div>
                    </Col>
                    <Col xs={6} md={3}>
                      <span className="text-secondary">Location</span>
                      <div>{selectedJob.location}</div>
                    </Col>
                    <Col xs={6} md={3}>
                      <span className="text-secondary">Scheduled</span>
                      <div>{selectedJob.scheduledTime}</div>
                    </Col>
                  </Row>
                  {selectedJob.internalNotes && (
                    <div className="mt-2 pt-2 border-top">
                      <span className="text-secondary small d-flex align-items-center">
                        <AlertCircle size={14} className="me-1" />
                        Internal notes
                      </span>
                      <div className="small">{selectedJob.internalNotes}</div>
                    </div>
                  )}
                </Card.Body>
              </Card>

              <Card className="mb-4">
                <Card.Header className="py-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <span className="fw-medium">Assignment options</span>
                  <div className="d-flex flex-wrap gap-2">
                    <InputGroup size="sm" style={{ width: '180px' }}>
                      <InputGroup.Text className="bg-transparent border-end-0">
                        <Clock size={14} />
                      </InputGroup.Text>
                      <Form.Control
                        type="datetime-local"
                        value={responseDeadline}
                        onChange={(e) => setResponseDeadline(e.target.value)}
                        aria-label="Response deadline"
                      />
                    </InputGroup>
                    <Button variant="outline-secondary" size="sm" onClick={handleSaveDeadline}>
                      Set deadline
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-0">
                    <Form.Label className="small text-secondary d-flex align-items-center">
                      <MessageSquare size={14} className="me-1" />
                      Internal notes for this assignment
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="e.g. VIP request, special instructions..."
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                    />
                    <Button variant="outline-secondary" size="sm" className="mt-2" onClick={handleSaveNotes}>
                      Save notes
                    </Button>
                  </Form.Group>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header className="py-2">
                  <span className="fw-medium">Eligible professionals</span>
                  <span className="small text-secondary ms-2">(by category, distance, availability, rating, workload)</span>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive hover className="mb-0">
                    <thead>
                      <tr>
                        <th className="pt-2 pb-2">Professional</th>
                        <th className="pt-2 pb-2">Category</th>
                        <th className="pt-2 pb-2">Distance</th>
                        <th className="pt-2 pb-2">Availability</th>
                        <th className="pt-2 pb-2">Rating</th>
                        <th className="pt-2 pb-2">Workload</th>
                        <th className="pt-2 pb-2 text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_ELIGIBLE.map((pro) => (
                        <tr key={pro.id}>
                          <td>
                            <Link to={`/general/profile?pro=${pro.id}`} className="fw-medium text-decoration-none">
                              {pro.name}
                            </Link>
                          </td>
                          <td>
                            <small className="d-flex align-items-center">
                              <Briefcase size={12} className="me-1 text-secondary" />
                              {pro.serviceCategory}
                            </small>
                          </td>
                          <td>
                            <small className="d-flex align-items-center">
                              <MapPin size={12} className="me-1 text-secondary" />
                              {pro.distanceKm} km
                            </small>
                          </td>
                          <td>
                            <Badge
                              bg={AVAILABILITY_VARIANT[pro.availability]}
                              text={pro.availability === 'busy_soon' || pro.availability === 'limited' ? 'dark' : undefined}
                            >
                              {AVAILABILITY_LABEL[pro.availability]}
                            </Badge>
                          </td>
                          <td>
                            <span className="d-inline-flex align-items-center">
                              <Star size={14} className="text-warning me-1" fill="currentColor" />
                              {pro.rating}
                            </span>
                          </td>
                          <td>
                            <small>{pro.currentWorkload} active jobs</small>
                          </td>
                          <td className="text-end">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-1"
                              onClick={() => handleSendOffer(pro.id)}
                              title="Send job offer"
                            >
                              <Send size={14} />
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleDirectAssign(pro.id)}
                              title="Direct assign"
                            >
                              <UserCheck size={14} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </>
          ) : (
            <Card>
              <Card.Body className="text-center text-secondary py-5">
                <Calendar size={48} className="mb-2 opacity-50" />
                <p className="mb-0">Select a job from the list to see eligible professionals and assign.</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </>
  );
};

export default DispatchPage;
