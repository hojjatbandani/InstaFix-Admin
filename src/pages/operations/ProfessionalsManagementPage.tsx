import { useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  PauseCircle,
  PlayCircle,
  Percent,
  CreditCard,
  FileText,
  Eye,
  MoreHorizontal,
  Filter,
  RefreshCw,
  Star,
} from 'lucide-react';
import { Card, Table, Badge, Button, ButtonGroup, Dropdown, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'Admin InstaFix – Professionals';

export type VerificationStatus = 'verified' | 'pending' | 'rejected';
export type AccountStatus = 'active' | 'suspended' | 'pending_approval';

export interface ProfessionalItem {
  id: string;
  name: string;
  email: string;
  serviceCategories: string[];
  serviceAreas: string[];
  rating: number;
  totalJobs: number;
  completionRate: number;
  verificationStatus: VerificationStatus;
  documentsCount: number;
  subscriptionPlan: string;
  commissionRate: number;
  payoutMethod: string;
  accountStatus: AccountStatus;
}

// Placeholder data – replace with API
const MOCK_PROFESSIONALS: ProfessionalItem[] = [
  {
    id: '1',
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    serviceCategories: ['AC Repair', 'HVAC'],
    serviceAreas: ['Downtown', 'North District'],
    rating: 4.8,
    totalJobs: 124,
    completionRate: 98,
    verificationStatus: 'verified',
    documentsCount: 4,
    subscriptionPlan: 'Pro',
    commissionRate: 15,
    payoutMethod: 'Bank transfer',
    accountStatus: 'active',
  },
  {
    id: '2',
    name: 'Alex Rivera',
    email: 'alex.r@example.com',
    serviceCategories: ['Electrical', 'Smart Home'],
    serviceAreas: ['Central', 'East Side'],
    rating: 4.6,
    totalJobs: 89,
    completionRate: 95,
    verificationStatus: 'verified',
    documentsCount: 4,
    subscriptionPlan: 'Standard',
    commissionRate: 18,
    payoutMethod: 'PayPal',
    accountStatus: 'active',
  },
  {
    id: '3',
    name: 'Sarah Chen',
    email: 'sarah.c@example.com',
    serviceCategories: ['Home Cleaning', 'Deep Clean'],
    serviceAreas: ['All areas'],
    rating: 4.9,
    totalJobs: 56,
    completionRate: 100,
    verificationStatus: 'pending',
    documentsCount: 3,
    subscriptionPlan: 'Trial',
    commissionRate: 20,
    payoutMethod: 'Bank transfer',
    accountStatus: 'pending_approval',
  },
  {
    id: '4',
    name: 'Chris Taylor',
    email: 'chris.t@example.com',
    serviceCategories: ['Plumbing', 'Pest Control'],
    serviceAreas: ['West', 'South'],
    rating: 4.4,
    totalJobs: 201,
    completionRate: 92,
    verificationStatus: 'verified',
    documentsCount: 5,
    subscriptionPlan: 'Pro',
    commissionRate: 15,
    payoutMethod: 'Bank transfer',
    accountStatus: 'suspended',
  },
  {
    id: '5',
    name: 'Emma Wilson',
    email: 'emma.w@example.com',
    serviceCategories: ['Plumbing'],
    serviceAreas: ['North District'],
    rating: 4.7,
    totalJobs: 78,
    completionRate: 97,
    verificationStatus: 'rejected',
    documentsCount: 2,
    subscriptionPlan: '—',
    commissionRate: 20,
    payoutMethod: '—',
    accountStatus: 'pending_approval',
  },
  {
    id: '6',
    name: 'David Kim',
    email: 'david.k@example.com',
    serviceCategories: ['Carpentry', 'Furniture'],
    serviceAreas: ['Central', 'Downtown'],
    rating: 4.5,
    totalJobs: 34,
    completionRate: 94,
    verificationStatus: 'verified',
    documentsCount: 4,
    subscriptionPlan: 'Standard',
    commissionRate: 18,
    payoutMethod: 'PayPal',
    accountStatus: 'active',
  },
];

const verificationLabel: Record<VerificationStatus, string> = {
  verified: 'Verified',
  pending: 'Pending',
  rejected: 'Rejected',
};

const verificationVariant: Record<VerificationStatus, string> = {
  verified: 'success',
  pending: 'warning',
  rejected: 'danger',
};

const accountStatusLabel: Record<AccountStatus, string> = {
  active: 'Active',
  suspended: 'Suspended',
  pending_approval: 'Pending approval',
};

const accountStatusVariant: Record<AccountStatus, string> = {
  active: 'success',
  suspended: 'danger',
  pending_approval: 'warning',
};

const ProfessionalsManagementPage = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const handleApprove = (p: ProfessionalItem) => console.log('Approve', p.id);
  const handleReject = (p: ProfessionalItem) => console.log('Reject', p.id);
  const handleSuspend = (p: ProfessionalItem) => console.log('Suspend', p.id);
  const handleReactivate = (p: ProfessionalItem) => console.log('Reactivate', p.id);
  const handleAdjustCommission = (p: ProfessionalItem) => console.log('Adjust commission', p.id);
  const handleUpdatePlan = (p: ProfessionalItem) => console.log('Update plan', p.id);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Professionals Management</h4>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <Button variant="outline-primary" size="sm">
            <RefreshCw size={16} className="me-1" />
            Refresh
          </Button>
        </div>
      </div>

      <p className="text-secondary mb-4">
        Complete overview of all registered professionals: profile details, service categories & areas, ratings, performance metrics, verification status, documents, subscription, commission, payout method, and job history. Approve or reject applications, suspend or reactivate accounts, adjust commission rates, and update subscription plans.
      </p>

      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6} lg={4}>
              <InputGroup size="sm">
                <Form.Control placeholder="Search by name or email..." />
                <Button variant="outline-secondary">
                  <Filter size={16} />
                </Button>
              </InputGroup>
            </Col>
            <Col md={6} lg={4}>
              <Form.Select size="sm" aria-label="Verification status">
                <option value="">All verification</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Col>
            <Col md={6} lg={4}>
              <Form.Select size="sm" aria-label="Account status">
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending_approval">Pending approval</option>
              </Form.Select>
            </Col>
          </Row>

          <Table responsive hover>
            <thead>
              <tr>
                <th className="pt-0">Profile</th>
                <th className="pt-0">Service categories</th>
                <th className="pt-0">Service areas</th>
                <th className="pt-0">Rating</th>
                <th className="pt-0">Performance</th>
                <th className="pt-0">Verification</th>
                <th className="pt-0">Documents</th>
                <th className="pt-0">Subscription</th>
                <th className="pt-0">Commission</th>
                <th className="pt-0">Payout</th>
                <th className="pt-0">Jobs</th>
                <th className="pt-0">Status</th>
                <th className="pt-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PROFESSIONALS.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div>
                      <Link to={`/general/profile?pro=${p.id}`} className="fw-medium text-decoration-none d-block">
                        {p.name}
                      </Link>
                      <small className="text-secondary">{p.email}</small>
                    </div>
                  </td>
                  <td>
                    <small>{p.serviceCategories.join(', ')}</small>
                  </td>
                  <td>
                    <small>{p.serviceAreas.join(', ')}</small>
                  </td>
                  <td>
                    <span className="d-inline-flex align-items-center">
                      <Star size={14} className="text-warning me-1" fill="currentColor" />
                      {p.rating}
                    </span>
                  </td>
                  <td>
                    <small>{p.completionRate}% completion</small>
                  </td>
                  <td>
                    <Badge bg={verificationVariant[p.verificationStatus]} text={p.verificationStatus === 'pending' ? 'dark' : undefined}>
                      {verificationLabel[p.verificationStatus]}
                    </Badge>
                  </td>
                  <td>
                    <Link to={`/general/blank-page?documents=${p.id}`} className="text-decoration-none">
                      {p.documentsCount} docs
                    </Link>
                  </td>
                  <td>
                    <Badge bg="light" text="dark">{p.subscriptionPlan}</Badge>
                  </td>
                  <td>{p.commissionRate}%</td>
                  <td>
                    <small>{p.payoutMethod}</small>
                  </td>
                  <td>
                    <Link to={`/general/blank-page?jobs=${p.id}`} className="text-decoration-none">
                      {p.totalJobs} jobs
                    </Link>
                  </td>
                  <td>
                    <Badge bg={accountStatusVariant[p.accountStatus]} text={p.accountStatus === 'pending_approval' ? 'dark' : undefined}>
                      {accountStatusLabel[p.accountStatus]}
                    </Badge>
                  </td>
                  <td className="text-end">
                    <ButtonGroup size="sm">
                      <Link
                        to={`/general/profile?pro=${p.id}`}
                        className="btn btn-outline-primary btn-sm"
                        title="View full profile"
                      >
                        <Eye size={14} />
                      </Link>
                      <Dropdown align="end" as={ButtonGroup}>
                        <Dropdown.Toggle variant="outline-secondary" size="sm" className="no-toggle-icon">
                          <MoreHorizontal size={14} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {p.accountStatus === 'pending_approval' && (
                            <>
                              <Dropdown.Item onClick={() => handleApprove(p)}>
                                <CheckCircle size={14} className="me-2" />
                                Approve application
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleReject(p)} className="text-danger">
                                <XCircle size={14} className="me-2" />
                                Reject application
                              </Dropdown.Item>
                              <Dropdown.Divider />
                            </>
                          )}
                          {p.accountStatus === 'active' && (
                            <Dropdown.Item onClick={() => handleSuspend(p)}>
                              <PauseCircle size={14} className="me-2" />
                              Suspend account
                            </Dropdown.Item>
                          )}
                          {p.accountStatus === 'suspended' && (
                            <Dropdown.Item onClick={() => handleReactivate(p)}>
                              <PlayCircle size={14} className="me-2" />
                              Reactivate account
                            </Dropdown.Item>
                          )}
                          <Dropdown.Item onClick={() => handleAdjustCommission(p)}>
                            <Percent size={14} className="me-2" />
                            Adjust commission rate
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleUpdatePlan(p)}>
                            <CreditCard size={14} className="me-2" />
                            Update subscription plan
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item as={Link} to={`/general/blank-page?documents=${p.id}`}>
                            <FileText size={14} className="me-2" />
                            View uploaded documents
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

export default ProfessionalsManagementPage;
