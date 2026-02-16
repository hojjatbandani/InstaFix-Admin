import { useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  PauseCircle,
  PlayCircle,
  Users,
  UserCog,
  BarChart3,
  Building2,
  Eye,
  MoreHorizontal,
  Filter,
  RefreshCw,
  CreditCard,
  Shield,
} from 'lucide-react';
import { Card, Table, Badge, Button, ButtonGroup, Dropdown, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'Admin InstaFix – Companies & Employees';

export type CompanyApprovalStatus = 'pending' | 'approved' | 'rejected';
export type CompanyAccountStatus = 'active' | 'suspended' | 'pending_approval';

export interface CompanyEmployee {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface CompanyItem {
  id: string;
  companyName: string;
  contactEmail: string;
  contactName: string;
  subscriptionPlan: string;
  employeesCount: number;
  employees: CompanyEmployee[];
  approvalStatus: CompanyApprovalStatus;
  accountStatus: CompanyAccountStatus;
  totalJobs: number;
  completedJobs: number;
  completionRate: number;
  avgRating: number;
  jobDistributionNote?: string;
}

// Placeholder data – replace with API
const MOCK_COMPANIES: CompanyItem[] = [
  {
    id: '1',
    companyName: 'ProFix Services Co.',
    contactEmail: 'admin@profix.co',
    contactName: 'John Smith',
    subscriptionPlan: 'Enterprise',
    employeesCount: 12,
    employees: [
      { id: 'e1', name: 'John Smith', email: 'john@profix.co', role: 'Admin' },
      { id: 'e2', name: 'Jane Doe', email: 'jane@profix.co', role: 'Manager' },
      { id: 'e3', name: 'Bob Wilson', email: 'bob@profix.co', role: 'Technician' },
    ],
    approvalStatus: 'approved',
    accountStatus: 'active',
    totalJobs: 340,
    completedJobs: 328,
    completionRate: 96,
    avgRating: 4.7,
    jobDistributionNote: 'Balanced across teams',
  },
  {
    id: '2',
    companyName: 'HomeCare Solutions',
    contactEmail: 'info@homecare-sol.com',
    contactName: 'Maria Garcia',
    subscriptionPlan: 'Pro',
    employeesCount: 8,
    employees: [
      { id: 'e4', name: 'Maria Garcia', email: 'maria@homecare-sol.com', role: 'Admin' },
      { id: 'e5', name: 'Carlos Ruiz', email: 'carlos@homecare-sol.com', role: 'Technician' },
    ],
    approvalStatus: 'approved',
    accountStatus: 'active',
    totalJobs: 156,
    completedJobs: 148,
    completionRate: 95,
    avgRating: 4.5,
  },
  {
    id: '3',
    companyName: 'QuickRepair LLC',
    contactEmail: 'hello@quickrepair.io',
    contactName: 'Alex Chen',
    subscriptionPlan: 'Standard',
    employeesCount: 5,
    employees: [
      { id: 'e6', name: 'Alex Chen', email: 'alex@quickrepair.io', role: 'Admin' },
    ],
    approvalStatus: 'pending',
    accountStatus: 'pending_approval',
    totalJobs: 0,
    completedJobs: 0,
    completionRate: 0,
    avgRating: 0,
  },
  {
    id: '4',
    companyName: 'AllRound Maintenance',
    contactEmail: 'contact@allround.com',
    contactName: 'David Brown',
    subscriptionPlan: 'Enterprise',
    employeesCount: 20,
    employees: [
      { id: 'e7', name: 'David Brown', email: 'david@allround.com', role: 'Admin' },
      { id: 'e8', name: 'Sarah Lee', email: 'sarah@allround.com', role: 'Manager' },
    ],
    approvalStatus: 'approved',
    accountStatus: 'suspended',
    totalJobs: 520,
    completedJobs: 498,
    completionRate: 96,
    avgRating: 4.6,
  },
  {
    id: '5',
    companyName: 'Clean & Fix Team',
    contactEmail: 'team@cleanfix.xyz',
    contactName: 'Emma Wilson',
    subscriptionPlan: 'Trial',
    employeesCount: 3,
    employees: [
      { id: 'e9', name: 'Emma Wilson', email: 'emma@cleanfix.xyz', role: 'Admin' },
    ],
    approvalStatus: 'approved',
    accountStatus: 'active',
    totalJobs: 42,
    completedJobs: 40,
    completionRate: 95,
    avgRating: 4.8,
  },
];

const approvalLabel: Record<CompanyApprovalStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

const approvalVariant: Record<CompanyApprovalStatus, string> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
};

const accountStatusLabel: Record<CompanyAccountStatus, string> = {
  active: 'Active',
  suspended: 'Suspended',
  pending_approval: 'Pending approval',
};

const accountStatusVariant: Record<CompanyAccountStatus, string> = {
  active: 'success',
  suspended: 'danger',
  pending_approval: 'warning',
};

const CompaniesPage = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const handleApprove = (c: CompanyItem) => console.log('Approve company', c.id);
  const handleReject = (c: CompanyItem) => console.log('Reject company', c.id);
  const handleSuspend = (c: CompanyItem) => console.log('Suspend company', c.id);
  const handleReactivate = (c: CompanyItem) => console.log('Reactivate company', c.id);
  const handleManageEmployees = (c: CompanyItem) => console.log('Manage employees', c.id);
  const handleAssignRoles = (c: CompanyItem) => console.log('Assign roles', c.id);
  const handleJobDistribution = (c: CompanyItem) => console.log('Job distribution', c.id);
  const handleUpdatePlan = (c: CompanyItem) => console.log('Update plan', c.id);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Companies & Employees</h4>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <Button variant="outline-primary" size="sm">
            <RefreshCw size={16} className="me-1" />
            Refresh
          </Button>
        </div>
      </div>

      <p className="text-secondary mb-4">
        Manage business accounts that operate with multiple team members under one company profile. View company details, subscription plan, assigned employees, roles, and overall performance metrics. Approve company accounts, manage employee access, assign roles, and monitor job distribution within each company.
      </p>

      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6} lg={4}>
              <InputGroup size="sm">
                <Form.Control placeholder="Search by company or contact..." />
                <Button variant="outline-secondary">
                  <Filter size={16} />
                </Button>
              </InputGroup>
            </Col>
            <Col md={6} lg={4}>
              <Form.Select size="sm" aria-label="Approval status">
                <option value="">All approval</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
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
                <th className="pt-0">Company</th>
                <th className="pt-0">Contact</th>
                <th className="pt-0">Plan</th>
                <th className="pt-0">Employees</th>
                <th className="pt-0">Performance</th>
                <th className="pt-0">Approval</th>
                <th className="pt-0">Status</th>
                <th className="pt-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_COMPANIES.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="rounded bg-light d-flex align-items-center justify-content-center me-2" style={{ width: 36, height: 36 }}>
                        <Building2 size={18} className="text-primary" />
                      </div>
                      <div>
                        <Link to={`/general/blank-page?company=${c.id}`} className="fw-medium text-decoration-none d-block">
                          {c.companyName}
                        </Link>
                        <small className="text-secondary">{c.contactEmail}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <small>{c.contactName}</small>
                  </td>
                  <td>
                    <Badge bg="light" text="dark">{c.subscriptionPlan}</Badge>
                  </td>
                  <td>
                    <span className="d-inline-flex align-items-center">
                      <Users size={14} className="me-1 text-secondary" />
                      {c.employeesCount}
                    </span>
                    <small className="d-block text-secondary">{c.employees.length} shown</small>
                  </td>
                  <td>
                    <div className="small">
                      <span className="d-inline-flex align-items-center">
                        <BarChart3 size={12} className="me-1" />
                        {c.totalJobs} jobs
                      </span>
                      <span className="d-block">{c.completionRate}% completion</span>
                      {c.avgRating > 0 && <span className="text-warning">★ {c.avgRating}</span>}
                    </div>
                  </td>
                  <td>
                    <Badge bg={approvalVariant[c.approvalStatus]} text={c.approvalStatus === 'pending' ? 'dark' : undefined}>
                      {approvalLabel[c.approvalStatus]}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={accountStatusVariant[c.accountStatus]} text={c.accountStatus === 'pending_approval' ? 'dark' : undefined}>
                      {accountStatusLabel[c.accountStatus]}
                    </Badge>
                  </td>
                  <td className="text-end">
                    <ButtonGroup size="sm">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        as={Link}
                        to={`/general/blank-page?company=${c.id}`}
                        title="View company details"
                      >
                        <Eye size={14} />
                      </Button>
                      <Dropdown align="end" as={ButtonGroup}>
                        <Dropdown.Toggle variant="outline-secondary" size="sm" className="no-toggle-icon">
                          <MoreHorizontal size={14} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {c.approvalStatus === 'pending' && c.accountStatus === 'pending_approval' && (
                            <>
                              <Dropdown.Item onClick={() => handleApprove(c)}>
                                <CheckCircle size={14} className="me-2" />
                                Approve company account
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleReject(c)} className="text-danger">
                                <XCircle size={14} className="me-2" />
                                Reject company account
                              </Dropdown.Item>
                              <Dropdown.Divider />
                            </>
                          )}
                          {c.accountStatus === 'active' && (
                            <Dropdown.Item onClick={() => handleSuspend(c)}>
                              <PauseCircle size={14} className="me-2" />
                              Suspend account
                            </Dropdown.Item>
                          )}
                          {c.accountStatus === 'suspended' && (
                            <Dropdown.Item onClick={() => handleReactivate(c)}>
                              <PlayCircle size={14} className="me-2" />
                              Reactivate account
                            </Dropdown.Item>
                          )}
                          <Dropdown.Item onClick={() => handleManageEmployees(c)}>
                            <UserCog size={14} className="me-2" />
                            Manage employee access
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleAssignRoles(c)}>
                            <Shield size={14} className="me-2" />
                            Assign roles
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleJobDistribution(c)}>
                            <BarChart3 size={14} className="me-2" />
                            Monitor job distribution
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item onClick={() => handleUpdatePlan(c)}>
                            <CreditCard size={14} className="me-2" />
                            Update subscription plan
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

export default CompaniesPage;
