import { useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  FilePlus,
  Eye,
  MoreHorizontal,
  Filter,
  RefreshCw,
  FileText,
  Shield,
  CreditCard,
  IdCard,
  FileCheck,
} from 'lucide-react';
import { Card, Table, Badge, Button, ButtonGroup, Dropdown, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'Admin InstaFix – Verifications';

export type DocumentType = 'id' | 'license' | 'insurance' | 'background_check';
export type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'additional_required';

export interface VerificationDocument {
  id: string;
  type: DocumentType;
  label: string;
  status: DocumentStatus;
  submittedAt: string;
  adminNote?: string;
}

export interface VerificationItem {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalEmail: string;
  documents: VerificationDocument[];
  overallStatus: 'pending' | 'approved' | 'rejected' | 'partial';
  submittedAt: string;
}

const DOC_TYPE_LABEL: Record<DocumentType, string> = {
  id: 'ID',
  license: 'License',
  insurance: 'Insurance',
  background_check: 'Background check',
};

const DOC_TYPE_ICON: Record<DocumentType, typeof FileText> = {
  id: IdCard,
  license: FileCheck,
  insurance: CreditCard,
  background_check: Shield,
};

const DOC_STATUS_LABEL: Record<DocumentStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  additional_required: 'Additional required',
};

const DOC_STATUS_VARIANT: Record<DocumentStatus, string> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  additional_required: 'info',
};

// Placeholder data – replace with API
const MOCK_VERIFICATIONS: VerificationItem[] = [
  {
    id: 'v1',
    professionalId: '1',
    professionalName: 'Mike Johnson',
    professionalEmail: 'mike.j@example.com',
    documents: [
      { id: 'd1', type: 'id', label: 'National ID', status: 'approved', submittedAt: '2025-02-10' },
      { id: 'd2', type: 'license', label: 'HVAC License', status: 'approved', submittedAt: '2025-02-10' },
      { id: 'd3', type: 'insurance', label: 'Liability Insurance', status: 'approved', submittedAt: '2025-02-11' },
      { id: 'd4', type: 'background_check', label: 'Background Check', status: 'approved', submittedAt: '2025-02-12' },
    ],
    overallStatus: 'approved',
    submittedAt: '2025-02-12',
  },
  {
    id: 'v2',
    professionalId: '3',
    professionalName: 'Sarah Chen',
    professionalEmail: 'sarah.c@example.com',
    documents: [
      { id: 'd5', type: 'id', label: 'Passport', status: 'approved', submittedAt: '2025-02-14' },
      { id: 'd6', type: 'license', label: 'Cleaning Cert', status: 'pending', submittedAt: '2025-02-14' },
      { id: 'd7', type: 'insurance', label: 'Insurance Certificate', status: 'pending', submittedAt: '2025-02-14' },
      { id: 'd8', type: 'background_check', label: 'Background Check', status: 'pending', submittedAt: '2025-02-15' },
    ],
    overallStatus: 'pending',
    submittedAt: '2025-02-15',
  },
  {
    id: 'v3',
    professionalId: '5',
    professionalName: 'Emma Wilson',
    professionalEmail: 'emma.w@example.com',
    documents: [
      { id: 'd9', type: 'id', label: 'Driver License', status: 'rejected', submittedAt: '2025-02-08', adminNote: 'Image unclear; please re-upload a clearer copy.' },
      { id: 'd10', type: 'license', label: 'Plumbing License', status: 'additional_required', submittedAt: '2025-02-08', adminNote: 'Expired. Submit renewed license.' },
      { id: 'd11', type: 'insurance', label: 'Insurance', status: 'pending', submittedAt: '2025-02-09' },
      { id: 'd12', type: 'background_check', label: 'Background Check', status: 'pending', submittedAt: '2025-02-09' },
    ],
    overallStatus: 'rejected',
    submittedAt: '2025-02-09',
  },
  {
    id: 'v4',
    professionalId: '7',
    professionalName: 'James Park',
    professionalEmail: 'james.p@example.com',
    documents: [
      { id: 'd13', type: 'id', label: 'National ID', status: 'approved', submittedAt: '2025-02-13' },
      { id: 'd14', type: 'license', label: 'Electrical License', status: 'approved', submittedAt: '2025-02-13' },
      { id: 'd15', type: 'insurance', label: 'Insurance', status: 'additional_required', submittedAt: '2025-02-13', adminNote: 'Coverage amount below minimum. Please provide updated certificate.' },
      { id: 'd16', type: 'background_check', label: 'Background Check', status: 'pending', submittedAt: '2025-02-14' },
    ],
    overallStatus: 'partial',
    submittedAt: '2025-02-14',
  },
  {
    id: 'v5',
    professionalId: '8',
    professionalName: 'Lisa Anderson',
    professionalEmail: 'lisa.a@example.com',
    documents: [
      { id: 'd17', type: 'id', label: 'ID Card', status: 'pending', submittedAt: '2025-02-16' },
      { id: 'd18', type: 'license', label: 'Carpentry License', status: 'pending', submittedAt: '2025-02-16' },
      { id: 'd19', type: 'insurance', label: 'Insurance', status: 'pending', submittedAt: '2025-02-16' },
      { id: 'd20', type: 'background_check', label: 'Background Check', status: 'pending', submittedAt: '2025-02-16' },
    ],
    overallStatus: 'pending',
    submittedAt: '2025-02-16',
  },
];

const OVERALL_STATUS_LABEL: Record<VerificationItem['overallStatus'], string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  partial: 'Partial',
};

const OVERALL_STATUS_VARIANT: Record<VerificationItem['overallStatus'], string> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  partial: 'info',
};

const VerificationsPage = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const handleApprove = (v: VerificationItem, doc?: VerificationDocument) =>
    console.log('Approve', doc ? doc.id : v.id);
  const handleReject = (v: VerificationItem, doc?: VerificationDocument) =>
    console.log('Reject', doc ? doc.id : v.id);
  const handleRequestAdditional = (v: VerificationItem, doc?: VerificationDocument) =>
    console.log('Request additional', doc ? doc.id : v.id);

  const renderDocBadge = (doc: VerificationDocument) => {
    const Icon = DOC_TYPE_ICON[doc.type];
    return (
      <Badge
        key={doc.id}
        bg={DOC_STATUS_VARIANT[doc.status]}
        text={doc.status === 'pending' || doc.status === 'additional_required' ? 'dark' : undefined}
        className="me-1 mb-1 d-inline-flex align-items-center"
      >
        <Icon size={10} className="me-1" />
        {DOC_TYPE_LABEL[doc.type]}: {DOC_STATUS_LABEL[doc.status]}
      </Badge>
    );
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Verifications</h4>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <Button variant="outline-primary" size="sm">
            <RefreshCw size={16} className="me-1" />
            Refresh
          </Button>
        </div>
      </div>

      <p className="text-secondary mb-4">
        Review and approve professional identity and compliance documents: IDs, licenses, insurance certificates, and background checks. Approve, reject, or request additional documents with notes. This ensures platform trust, safety, and regulatory compliance before professionals become active.
      </p>

      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6} lg={4}>
              <InputGroup size="sm">
                <Form.Control placeholder="Search by professional name or email..." />
                <Button variant="outline-secondary">
                  <Filter size={16} />
                </Button>
              </InputGroup>
            </Col>
            <Col md={6} lg={4}>
              <Form.Select size="sm" aria-label="Document type">
                <option value="">All document types</option>
                <option value="id">ID</option>
                <option value="license">License</option>
                <option value="insurance">Insurance</option>
                <option value="background_check">Background check</option>
              </Form.Select>
            </Col>
            <Col md={6} lg={4}>
              <Form.Select size="sm" aria-label="Status">
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="additional_required">Additional required</option>
                <option value="partial">Overall partial</option>
              </Form.Select>
            </Col>
          </Row>

          <Table responsive hover>
            <thead>
              <tr>
                <th className="pt-0">Professional</th>
                <th className="pt-0">Documents & status</th>
                <th className="pt-0">Submitted</th>
                <th className="pt-0">Overall</th>
                <th className="pt-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_VERIFICATIONS.map((v) => (
                <tr key={v.id}>
                  <td>
                    <div>
                      <Link to={`/general/profile?pro=${v.professionalId}`} className="fw-medium text-decoration-none d-block">
                        {v.professionalName}
                      </Link>
                      <small className="text-secondary">{v.professionalEmail}</small>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {v.documents.map((doc) => renderDocBadge(doc))}
                    </div>
                    {v.documents.some((d) => d.adminNote) && (
                      <small className="d-block text-secondary mt-1" title={v.documents.find((d) => d.adminNote)?.adminNote}>
                        Notes present
                      </small>
                    )}
                  </td>
                  <td>
                    <small>{v.submittedAt}</small>
                  </td>
                  <td>
                    <Badge
                      bg={OVERALL_STATUS_VARIANT[v.overallStatus]}
                      text={v.overallStatus === 'pending' || v.overallStatus === 'partial' ? 'dark' : undefined}
                    >
                      {OVERALL_STATUS_LABEL[v.overallStatus]}
                    </Badge>
                  </td>
                  <td className="text-end">
                    <ButtonGroup size="sm">
                      <Link
                        to={`/general/blank-page?verification=${v.id}`}
                        className="btn btn-outline-primary btn-sm"
                        title="View all documents & add notes"
                      >
                        <Eye size={14} />
                      </Link>
                      <Dropdown align="end" as={ButtonGroup}>
                        <Dropdown.Toggle variant="outline-secondary" size="sm" className="no-toggle-icon">
                          <MoreHorizontal size={14} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item as={Link} to={`/general/blank-page?verification=${v.id}`}>
                            <FileText size={14} className="me-2" />
                            View documents & add decision notes
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item onClick={() => handleApprove(v)}>
                            <CheckCircle size={14} className="me-2" />
                            Approve all pending
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleReject(v)} className="text-danger">
                            <XCircle size={14} className="me-2" />
                            Reject (with note)
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleRequestAdditional(v)}>
                            <FilePlus size={14} className="me-2" />
                            Request additional documents
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

export default VerificationsPage;
