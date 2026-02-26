import { useEffect, useState } from 'react';
import { RefreshCw, LogOut, Key, ShieldOff, Monitor } from 'lucide-react';
import { Card, Table, Badge, Button, Form, Row, Col, Modal } from 'react-bootstrap';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'InstaFix Admin – Devices & Login Security';

export interface Session {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  device: string;
  ip: string;
  location?: string;
  lastActive: string;
  twoFactorEnabled: boolean;
  isCurrentSession?: boolean;
}

const MOCK_SESSIONS: Session[] = [
  {
    id: 's1',
    userId: 'admin1',
    userEmail: 'admin@instafix.com',
    userName: 'Admin User',
    device: 'Chrome on Windows',
    ip: '192.168.1.10',
    location: 'New York, US',
    lastActive: '2025-02-25T14:30:00',
    twoFactorEnabled: true,
    isCurrentSession: true,
  },
  {
    id: 's2',
    userId: 'admin1',
    userEmail: 'admin@instafix.com',
    userName: 'Admin User',
    device: 'Safari on iPhone',
    ip: '192.168.1.25',
    location: 'New York, US',
    lastActive: '2025-02-25T10:15:00',
    twoFactorEnabled: true,
  },
  {
    id: 's3',
    userId: 'pro1',
    userEmail: 'mike.j@example.com',
    userName: 'Mike Johnson',
    device: 'Chrome on Android',
    ip: '203.0.113.42',
    location: 'Chicago, US',
    lastActive: '2025-02-25T13:00:00',
    twoFactorEnabled: false,
  },
  {
    id: 's4',
    userId: 'pro2',
    userEmail: 'emma.w@example.com',
    userName: 'Emma Wilson',
    device: 'Firefox on Windows',
    ip: '198.51.100.10',
    location: 'Boston, US',
    lastActive: '2025-02-24T18:22:00',
    twoFactorEnabled: true,
  },
];

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });

const DevicesLoginSecurityPage = () => {
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [userFilter, setUserFilter] = useState('');
  const [resetPasswordModalShow, setResetPasswordModalShow] = useState(false);
  const [blockModalShow, setBlockModalShow] = useState(false);
  const [targetUser, setTargetUser] = useState<Session | null>(null);

  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => { document.title = DEFAULT_TITLE; };
  }, []);

  const filteredSessions = sessions.filter(
    (s) =>
      !userFilter ||
      s.userName.toLowerCase().includes(userFilter.toLowerCase()) ||
      s.userEmail.toLowerCase().includes(userFilter.toLowerCase())
  );

  const handleForceLogout = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handleResetPassword = (user: Session) => {
    console.log('Reset password for', user.userId);
    setResetPasswordModalShow(false);
    setTargetUser(null);
  };

  const handleBlockAccess = (user: Session) => {
    console.log('Block access for', user.userId);
    setSessions((prev) => prev.filter((s) => s.userId !== user.userId));
    setBlockModalShow(false);
    setTargetUser(null);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Devices & Login Security</h4>
        <Button variant="outline-primary" size="sm">
          <RefreshCw size={16} className="me-1" />
          Refresh
        </Button>
      </div>

      <p className="text-secondary mb-4">
        Manage account-level and admin-level security for logins and device access. View recent login activity, device sessions, IP addresses, and 2FA status. Force logout sessions, reset passwords, block suspicious access, and enforce security policies to prevent unauthorized access and support incident investigation.
      </p>

      <Card className="mb-3">
        <Card.Body className="py-2">
          <Row>
            <Col md={6} lg={4}>
              <Form.Label className="small mb-0">Filter by user</Form.Label>
              <Form.Control
                size="sm"
                placeholder="Name or email..."
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th className="pt-0">User</th>
                <th className="pt-0">Device</th>
                <th className="pt-0">IP</th>
                <th className="pt-0">Location</th>
                <th className="pt-0">Last active</th>
                <th className="pt-0">2FA</th>
                <th className="pt-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div>
                      <span className="fw-medium">{s.userName}</span>
                      <small className="d-block text-muted">{s.userEmail}</small>
                    </div>
                  </td>
                  <td className="small">
                    <Monitor size={14} className="me-1 text-muted" />
                    {s.device}
                  </td>
                  <td className="small">{s.ip}</td>
                  <td className="small">{s.location ?? '—'}</td>
                  <td className="small">{formatDateTime(s.lastActive)}</td>
                  <td>
                    {s.twoFactorEnabled ? (
                      <Badge bg="success">Enabled</Badge>
                    ) : (
                      <Badge bg="secondary">Disabled</Badge>
                    )}
                  </td>
                  <td className="text-end">
                    {!s.isCurrentSession && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="me-1"
                        onClick={() => handleForceLogout(s.id)}
                        title="Force logout"
                      >
                        <LogOut size={14} />
                      </Button>
                    )}
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-1"
                      onClick={() => { setTargetUser(s); setResetPasswordModalShow(true); }}
                      title="Reset password"
                    >
                      <Key size={14} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => { setTargetUser(s); setBlockModalShow(true); }}
                      title="Block access"
                    >
                      <ShieldOff size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={resetPasswordModalShow} onHide={() => { setResetPasswordModalShow(false); setTargetUser(null); }} centered>
        <Modal.Header closeButton><Modal.Title>Reset password</Modal.Title></Modal.Header>
        <Modal.Body>
          {targetUser && (
            <p className="mb-2">
              Send a password reset link to <strong>{targetUser.userEmail}</strong>?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setResetPasswordModalShow(false); setTargetUser(null); }}>Cancel</Button>
          <Button variant="primary" onClick={() => targetUser && handleResetPassword(targetUser)}>
            <Key size={14} className="me-1" />
            Send reset link
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={blockModalShow} onHide={() => { setBlockModalShow(false); setTargetUser(null); }} centered>
        <Modal.Header closeButton><Modal.Title>Block access</Modal.Title></Modal.Header>
        <Modal.Body>
          {targetUser && (
            <p className="mb-2">
              Block all sessions for <strong>{targetUser.userName}</strong> ({targetUser.userEmail})? They will be logged out and unable to sign in until an admin unblocks the account.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setBlockModalShow(false); setTargetUser(null); }}>Cancel</Button>
          <Button variant="danger" onClick={() => targetUser && handleBlockAccess(targetUser)}>
            <ShieldOff size={14} className="me-1" />
            Block account
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DevicesLoginSecurityPage;
