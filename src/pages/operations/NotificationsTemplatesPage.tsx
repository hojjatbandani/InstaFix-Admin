import { useEffect, useState } from 'react';
import {
  Mail,
  MessageSquare,
  Bell,
  Eye,
  Send,
  Edit3,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
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
  Nav,
  Modal,
} from 'react-bootstrap';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'InstaFix Admin – Notifications Templates';

export type ChannelType = 'email' | 'sms' | 'push';
export type TriggerEvent =
  | 'booking_confirmed'
  | 'booking_reminder'
  | 'professional_assigned'
  | 'job_completed'
  | 'cancellation'
  | 'payment_received';

export interface NotificationTemplate {
  id: string;
  name: string;
  channel: ChannelType;
  triggerEvent: TriggerEvent;
  subject?: string;
  body: string;
  active: boolean;
  updatedAt: string;
}

const CHANNEL_LABEL: Record<ChannelType, string> = {
  email: 'Email',
  sms: 'SMS',
  push: 'Push',
};

const CHANNEL_ICON: Record<ChannelType, typeof Mail> = {
  email: Mail,
  sms: MessageSquare,
  push: Bell,
};

const TRIGGER_LABEL: Record<TriggerEvent, string> = {
  booking_confirmed: 'Booking confirmed',
  booking_reminder: 'Booking reminder',
  professional_assigned: 'Professional assigned',
  job_completed: 'Job completed',
  cancellation: 'Cancellation',
  payment_received: 'Payment received',
};

const DYNAMIC_VARS = [
  { key: '{{user_name}}', description: 'Customer or professional name' },
  { key: '{{job_title}}', description: 'Job/service title' },
  { key: '{{scheduled_time}}', description: 'Scheduled date and time' },
  { key: '{{professional_name}}', description: 'Assigned professional name' },
  { key: '{{booking_id}}', description: 'Booking reference ID' },
];

// Mock data – replace with API
const MOCK_TEMPLATES: NotificationTemplate[] = [
  {
    id: 't1',
    name: 'Booking confirmation (customer)',
    channel: 'email',
    triggerEvent: 'booking_confirmed',
    subject: 'Your booking is confirmed – {{job_title}}',
    body: 'Hi {{user_name}}, your booking for {{job_title}} on {{scheduled_time}} is confirmed. Booking ID: {{booking_id}}.',
    active: true,
    updatedAt: '2025-02-20',
  },
  {
    id: 't2',
    name: 'Booking reminder (SMS)',
    channel: 'sms',
    triggerEvent: 'booking_reminder',
    body: '{{user_name}}, reminder: {{job_title}} on {{scheduled_time}}. Reply HELP for support.',
    active: true,
    updatedAt: '2025-02-19',
  },
  {
    id: 't3',
    name: 'Professional assigned (push)',
    channel: 'push',
    triggerEvent: 'professional_assigned',
    body: '{{professional_name}} has been assigned to your job {{job_title}} on {{scheduled_time}}.',
    active: true,
    updatedAt: '2025-02-18',
  },
  {
    id: 't4',
    name: 'Job completed (email)',
    channel: 'email',
    triggerEvent: 'job_completed',
    subject: 'Job completed – {{job_title}}',
    body: 'Hi {{user_name}}, your job {{job_title}} has been completed. Thank you for using InstaFix.',
    active: true,
    updatedAt: '2025-02-17',
  },
  {
    id: 't5',
    name: 'Cancellation notice',
    channel: 'email',
    triggerEvent: 'cancellation',
    subject: 'Booking cancelled – {{booking_id}}',
    body: 'Hi {{user_name}}, your booking {{booking_id}} for {{job_title}} has been cancelled.',
    active: true,
    updatedAt: '2025-02-16',
  },
];

const NotificationsTemplatesPage = () => {
  const [channelFilter, setChannelFilter] = useState<ChannelType | 'all'>('all');
  const [templates, setTemplates] = useState<NotificationTemplate[]>(MOCK_TEMPLATES);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<NotificationTemplate | null>(null);
  const [testModalShow, setTestModalShow] = useState(false);
  const [testTarget, setTestTarget] = useState('');

  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const filteredTemplates =
    channelFilter === 'all'
      ? templates
      : templates.filter((t) => t.channel === channelFilter);

  const handleToggleActive = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  };

  const handleSaveEdit = (updated: NotificationTemplate) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === updated.id ? { ...updated, updatedAt: new Date().toISOString().slice(0, 10) } : t))
    );
    setEditingTemplate(null);
  };

  const handleTestNotification = () => {
    console.log('Test notification to:', testTarget);
    setTestModalShow(false);
    setTestTarget('');
    setEditingTemplate(null);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Notifications Templates</h4>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <Button variant="outline-primary" size="sm">
            <RefreshCw size={16} className="me-1" />
            Refresh
          </Button>
        </div>
      </div>

      <p className="text-secondary mb-4">
        Manage and customize automated messages sent to customers and professionals via email, SMS, or push notifications. Edit message content, subject lines, and use dynamic variables such as user name, job details, and scheduled time. Preview templates, test notifications, and control when they are triggered for consistent communication throughout the booking lifecycle.
      </p>

      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6} lg={4}>
              <Form.Label className="small text-muted">Channel</Form.Label>
              <Form.Select
                size="sm"
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value as ChannelType | 'all')}
              >
                <option value="all">All channels</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="push">Push</option>
              </Form.Select>
            </Col>
          </Row>

          <Table responsive hover>
            <thead>
              <tr>
                <th className="pt-0">Template</th>
                <th className="pt-0">Channel</th>
                <th className="pt-0">Trigger</th>
                <th className="pt-0">Status</th>
                <th className="pt-0">Updated</th>
                <th className="pt-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTemplates.map((t) => {
                const Icon = CHANNEL_ICON[t.channel];
                return (
                  <tr key={t.id}>
                    <td>
                      <div className="fw-medium">{t.name}</div>
                      {t.channel === 'email' && t.subject && (
                        <small className="text-secondary">{t.subject}</small>
                      )}
                    </td>
                    <td>
                      <Badge bg="light" text="dark" className="d-inline-flex align-items-center">
                        <Icon size={12} className="me-1" />
                        {CHANNEL_LABEL[t.channel]}
                      </Badge>
                    </td>
                    <td>{TRIGGER_LABEL[t.triggerEvent]}</td>
                    <td>
                      <Badge bg={t.active ? 'success' : 'secondary'}>
                        {t.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <small>{t.updatedAt}</small>
                    </td>
                    <td className="text-end">
                      <ButtonGroup size="sm">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          title="Preview"
                          onClick={() => setPreviewTemplate(t)}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          title="Test notification"
                          onClick={() => {
                            setEditingTemplate(null);
                            setPreviewTemplate(null);
                            setEditingTemplate(t);
                            setTestModalShow(true);
                          }}
                        >
                          <Send size={14} />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          title="Edit template"
                          onClick={() => {
                            setTestModalShow(false);
                            setEditingTemplate(t);
                          }}
                        >
                          <Edit3 size={14} />
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 text-secondary"
                          title={t.active ? 'Deactivate' : 'Activate'}
                          onClick={() => handleToggleActive(t.id)}
                        >
                          {t.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Preview modal */}
      <Modal show={!!previewTemplate} onHide={() => setPreviewTemplate(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Preview template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {previewTemplate && (
            <>
              {previewTemplate.channel === 'email' && previewTemplate.subject && (
                <div className="mb-3">
                  <Form.Label className="small text-muted">Subject</Form.Label>
                  <p className="mb-0 fw-medium">{previewTemplate.subject}</p>
                </div>
              )}
              <Form.Label className="small text-muted">Body (with sample variables)</Form.Label>
              <Card className="bg-light">
                <Card.Body className="small">
                  {previewTemplate.body
                    .replace(/\{\{user_name\}\}/g, 'John Doe')
                    .replace(/\{\{job_title\}\}/g, 'HVAC Repair')
                    .replace(/\{\{scheduled_time\}\}/g, 'Feb 25, 2025 at 10:00 AM')
                    .replace(/\{\{professional_name\}\}/g, 'Mike Johnson')
                    .replace(/\{\{booking_id\}\}/g, 'BK-12345')}
                </Card.Body>
              </Card>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPreviewTemplate(null)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (previewTemplate) {
                setPreviewTemplate(null);
                setEditingTemplate(previewTemplate);
                setTestModalShow(true);
              }
            }}
          >
            <Send size={14} className="me-1" />
            Test send
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit template modal */}
      <Modal
        show={!!editingTemplate && !testModalShow}
        onHide={() => setEditingTemplate(null)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingTemplate && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Template name</Form.Label>
                <Form.Control
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, name: e.target.value })
                  }
                />
              </Form.Group>
              {editingTemplate.channel === 'email' && (
                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    value={editingTemplate.subject || ''}
                    onChange={(e) =>
                      setEditingTemplate({ ...editingTemplate, subject: e.target.value })
                    }
                    placeholder="e.g. Your booking is confirmed – {{job_title}}"
                  />
                </Form.Group>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Body</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={editingTemplate.body}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, body: e.target.value })
                  }
                  placeholder="Use {{user_name}}, {{job_title}}, {{scheduled_time}}, etc."
                />
              </Form.Group>
              <div className="mb-3">
                <Form.Label className="small text-muted">Available variables</Form.Label>
                <Nav as="ul" className="flex-column small">
                  {DYNAMIC_VARS.map((v) => (
                    <Nav.Item as="li" key={v.key}>
                      <code>{v.key}</code> – {v.description}
                    </Nav.Item>
                  ))}
                </Nav>
              </div>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditingTemplate(null)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => editingTemplate && handleSaveEdit(editingTemplate)}
          >
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Test notification modal */}
      <Modal
        show={testModalShow}
        onHide={() => {
          setTestModalShow(false);
          setEditingTemplate(null);
          setTestTarget('');
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Test notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>
              {editingTemplate?.channel === 'email'
                ? 'Email address'
                : editingTemplate?.channel === 'sms'
                  ? 'Phone number'
                  : 'Device / user'}
            </Form.Label>
            <Form.Control
              type="text"
              placeholder={
                editingTemplate?.channel === 'email'
                  ? 'test@example.com'
                  : editingTemplate?.channel === 'sms'
                    ? '+1234567890'
                    : 'User ID or token'
              }
              value={testTarget}
              onChange={(e) => setTestTarget(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setTestModalShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleTestNotification}>
            <Send size={14} className="me-1" />
            Send test
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NotificationsTemplatesPage;
