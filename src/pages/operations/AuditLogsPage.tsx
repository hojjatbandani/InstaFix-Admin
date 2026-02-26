import { useEffect, useState, useMemo, Fragment } from 'react';
import {
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp,
  User,
  CreditCard,
  Users,
  Percent,
  Settings,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import { Card, Table, Badge, Button, Form, Row, Col, Collapse } from 'react-bootstrap';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'InstaFix Admin – Audit Logs';

export type AuditCategory = 'payments' | 'users' | 'commissions' | 'system_settings' | 'other';

export interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO or formatted
  adminId: string;
  adminEmail: string;
  adminName: string;
  category: AuditCategory;
  action: string;
  entityType: string;
  entityId: string;
  field?: string;
  previousValue?: string;
  newValue?: string;
  ip?: string;
}

const CATEGORY_LABEL: Record<AuditCategory, string> = {
  payments: 'Payments',
  users: 'Users',
  commissions: 'Commissions',
  system_settings: 'System settings',
  other: 'Other',
};

const CATEGORY_ICON: Record<AuditCategory, LucideIcon> = {
  payments: CreditCard,
  users: Users,
  commissions: Percent,
  system_settings: Settings,
  other: FileText,
};

// Mock data – replace with API
const MOCK_LOGS: AuditLogEntry[] = [
  {
    id: 'log1',
    timestamp: '2025-02-25T14:32:00Z',
    adminId: 'a1',
    adminEmail: 'admin@instafix.com',
    adminName: 'Jane Admin',
    category: 'payments',
    action: 'Adjusted payout',
    entityType: 'Payout',
    entityId: 'PY-1024',
    field: 'status',
    previousValue: 'pending',
    newValue: 'completed',
    ip: '192.168.1.10',
  },
  {
    id: 'log2',
    timestamp: '2025-02-25T13:15:00Z',
    adminId: 'a2',
    adminEmail: 'ops@instafix.com',
    adminName: 'Ops User',
    category: 'users',
    action: 'Updated professional status',
    entityType: 'Professional',
    entityId: 'pro-42',
    field: 'status',
    previousValue: 'active',
    newValue: 'suspended',
    ip: '192.168.1.12',
  },
  {
    id: 'log3',
    timestamp: '2025-02-25T11:08:00Z',
    adminId: 'a1',
    adminEmail: 'admin@instafix.com',
    adminName: 'Jane Admin',
    category: 'commissions',
    action: 'Changed commission rate',
    entityType: 'Category',
    entityId: 'plumbing',
    field: 'commissionPercent',
    previousValue: '15',
    newValue: '18',
    ip: '192.168.1.10',
  },
  {
    id: 'log4',
    timestamp: '2025-02-25T10:00:00Z',
    adminId: 'a1',
    adminEmail: 'admin@instafix.com',
    adminName: 'Jane Admin',
    category: 'system_settings',
    action: 'Updated platform setting',
    entityType: 'Setting',
    entityId: 'min_booking_notice_hours',
    field: 'value',
    previousValue: '2',
    newValue: '4',
    ip: '192.168.1.10',
  },
  {
    id: 'log5',
    timestamp: '2025-02-24T16:45:00Z',
    adminId: 'a2',
    adminEmail: 'ops@instafix.com',
    adminName: 'Ops User',
    category: 'payments',
    action: 'Processed refund',
    entityType: 'Refund',
    entityId: 'RF-88',
    field: 'amount',
    previousValue: '0',
    newValue: '125.00',
    ip: '192.168.1.12',
  },
  {
    id: 'log6',
    timestamp: '2025-02-24T15:20:00Z',
    adminId: 'a1',
    adminEmail: 'admin@instafix.com',
    adminName: 'Jane Admin',
    category: 'users',
    action: 'Edited customer profile',
    entityType: 'Customer',
    entityId: 'cust-101',
    field: 'email',
    previousValue: 'old@example.com',
    newValue: 'new@example.com',
    ip: '192.168.1.10',
  },
  {
    id: 'log7',
    timestamp: '2025-02-24T12:00:00Z',
    adminId: 'a2',
    adminEmail: 'ops@instafix.com',
    adminName: 'Ops User',
    category: 'system_settings',
    action: 'Updated notification template',
    entityType: 'NotificationTemplate',
    entityId: 'booking_confirmed',
    field: 'body',
    previousValue: 'Hi {{user_name}}...',
    newValue: 'Hello {{user_name}}...',
    ip: '192.168.1.12',
  },
];

const formatTimestamp = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'medium',
  });
};

const AuditLogsPage = () => {
  const [logs] = useState<AuditLogEntry[]>(MOCK_LOGS);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<AuditCategory | 'all'>('all');
  const [userFilter, setUserFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const textMatch =
        !searchText ||
        log.action.toLowerCase().includes(searchText.toLowerCase()) ||
        log.entityType.toLowerCase().includes(searchText.toLowerCase()) ||
        log.entityId.toLowerCase().includes(searchText.toLowerCase()) ||
        log.adminName.toLowerCase().includes(searchText.toLowerCase()) ||
        log.adminEmail.toLowerCase().includes(searchText.toLowerCase()) ||
        (log.previousValue && log.previousValue.toLowerCase().includes(searchText.toLowerCase())) ||
        (log.newValue && log.newValue.toLowerCase().includes(searchText.toLowerCase()));
      const categoryMatch =
        categoryFilter === 'all' || log.category === categoryFilter;
      const userMatch =
        !userFilter ||
        log.adminName.toLowerCase().includes(userFilter.toLowerCase()) ||
        log.adminEmail.toLowerCase().includes(userFilter.toLowerCase());
      const fromMatch = !dateFrom || log.timestamp >= dateFrom;
      const toMatch = !dateTo || log.timestamp <= `${dateTo}T23:59:59.999Z`;
      return textMatch && categoryMatch && userMatch && fromMatch && toMatch;
    });
  }, [logs, searchText, categoryFilter, userFilter, dateFrom, dateTo]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Audit Logs</h4>
        <Button variant="outline-primary" size="sm">
          <RefreshCw size={16} className="me-1" />
          Refresh
        </Button>
      </div>

      <p className="text-secondary mb-4">
        Audit Logs record all important actions performed in the admin panel, especially sensitive changes related to payments, users, commissions, and system settings. They track who performed the action, what was changed, the previous and new values, and the exact time of the update. Search and filter logs to investigate disputes, financial discrepancies, or unauthorized changes. This ensures accountability, transparency, and operational security across the platform.
      </p>

      <Card>
        <Card.Body>
          <Row className="mb-3 g-2">
            <Col md={6} lg={5}>
              <Form.Control
                size="sm"
                placeholder="Search by action, entity, user, or value..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col md="auto">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
              >
                <Filter size={16} className="me-1" />
                Filters
                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            </Col>
          </Row>

          <Collapse in={showFilters}>
            <div className="mb-3">
              <Row className="g-2">
                <Col md={6} lg={2}>
                  <Form.Select
                    size="sm"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as AuditCategory | 'all')}
                  >
                    <option value="all">All categories</option>
                    {(Object.keys(CATEGORY_LABEL) as AuditCategory[]).map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_LABEL[cat]}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={6} lg={2}>
                  <Form.Control
                    size="sm"
                    placeholder="User name or email"
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                  />
                </Col>
                <Col md={6} lg={2}>
                  <Form.Control
                    size="sm"
                    type="date"
                    placeholder="From"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </Col>
                <Col md={6} lg={2}>
                  <Form.Control
                    size="sm"
                    type="date"
                    placeholder="To"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </Col>
              </Row>
            </div>
          </Collapse>

          <Table responsive hover>
            <thead>
              <tr>
                <th className="pt-0">Time</th>
                <th className="pt-0">User</th>
                <th className="pt-0">Category</th>
                <th className="pt-0">Action</th>
                <th className="pt-0">Entity</th>
                <th className="pt-0">Change</th>
                <th className="pt-0 text-end">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const Icon = CATEGORY_ICON[log.category];
                const isExpanded = expandedRow === log.id;
                return (
                  <Fragment key={log.id}>
                    <tr>
                      <td className="small text-nowrap">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <User size={14} className="me-1 text-muted" />
                          <div>
                            <span className="fw-medium">{log.adminName}</span>
                            <small className="d-block text-muted">{log.adminEmail}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge
                          bg="light"
                          text="dark"
                          className="d-inline-flex align-items-center"
                        >
                          <Icon size={12} className="me-1" />
                          {CATEGORY_LABEL[log.category]}
                        </Badge>
                      </td>
                      <td>{log.action}</td>
                      <td>
                        <span className="fw-medium">{log.entityType}</span>
                        <small className="d-block text-muted">{log.entityId}</small>
                      </td>
                      <td>
                        {(log.previousValue != null || log.newValue != null) && (
                          <div className="small">
                            {log.field && (
                              <span className="text-muted">{log.field}: </span>
                            )}
                            <span className="text-danger text-decoration-line-through">
                              {log.previousValue ?? '—'}
                            </span>
                            <span className="mx-1">→</span>
                            <span className="text-success">{log.newValue ?? '—'}</span>
                          </div>
                        )}
                      </td>
                      <td className="text-end">
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0"
                          onClick={() =>
                            setExpandedRow(isExpanded ? null : log.id)
                          }
                        >
                          {isExpanded ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </Button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="bg-light small py-2">
                          <Row>
                            <Col md={6}>
                              <strong>Previous value:</strong>{' '}
                              <code>{log.previousValue ?? '—'}</code>
                            </Col>
                            <Col md={6}>
                              <strong>New value:</strong>{' '}
                              <code>{log.newValue ?? '—'}</code>
                            </Col>
                            {log.field && (
                              <Col md={6} className="mt-1">
                                <strong>Field:</strong> {log.field}
                              </Col>
                            )}
                            {log.ip && (
                              <Col md={6} className="mt-1">
                                <strong>IP:</strong> {log.ip}
                              </Col>
                            )}
                          </Row>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </Table>

          {filteredLogs.length === 0 && (
            <div className="text-center text-muted py-4">
              No audit log entries match your filters.
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default AuditLogsPage;
