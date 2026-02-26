import { useEffect, useState } from 'react';
import { Save, RefreshCw, Globe, Percent, Clock, Bell, Building2 } from 'lucide-react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'InstaFix Admin – General Settings';

// Mock – replace with API
const MOCK_SETTINGS = {
  platformName: 'InstaFix',
  supportEmail: 'support@instafix.com',
  supportPhone: '+1 (555) 123-4567',
  supportUrl: 'https://instafix.com/support',
  logoUrl: 'https://instafix.com/logo.png',
  currency: 'USD',
  timezone: 'America/New_York',
  taxRatePercent: 0,
  defaultCommissionPercent: 15,
  maxBookingsPerDayPerProfessional: 8,
  minBookingNoticeHours: 2,
  cancellationWindowHours: 24,
  notifyCustomerBookingConfirmed: true,
  notifyCustomerReminder: true,
  notifyProfessionalNewJob: true,
  notifyProfessionalReminder: true,
};

const GeneralSettingsPage = () => {
  const [settings, setSettings] = useState(MOCK_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const update = (key: keyof typeof settings, value: string | number | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">General Settings</h4>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <Button variant="outline-primary" size="sm">
            <RefreshCw size={16} className="me-1" />
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            <Save size={16} className="me-1" />
            Save all
          </Button>
        </div>
      </div>

      <p className="text-secondary mb-4">
        Control global platform configurations such as currency, tax rates, timezone, and default commission values. Update platform name, contact information, branding elements, and operational policies. System-wide rules such as booking limits, cancellation windows, and default notification preferences are also managed here. This section centralizes core configurations that affect the overall behavior of the platform.
      </p>

      {saved && (
        <div className="alert alert-success py-2 mb-3" role="alert">
          Settings saved successfully.
        </div>
      )}

      {/* Platform identity & branding */}
      <Card className="mb-3">
        <Card.Header className="d-flex align-items-center">
          <Building2 size={18} className="me-2" />
          Platform identity & branding
        </Card.Header>
        <Card.Body>
          <Row className="g-2">
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label className="small">Platform name</Form.Label>
                <Form.Control
                  size="sm"
                  value={settings.platformName}
                  onChange={(e) => update('platformName', e.target.value)}
                  placeholder="e.g. InstaFix"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label className="small">Logo URL</Form.Label>
                <Form.Control
                  size="sm"
                  type="url"
                  value={settings.logoUrl}
                  onChange={(e) => update('logoUrl', e.target.value)}
                  placeholder="https://..."
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label className="small">Support email</Form.Label>
                <Form.Control
                  size="sm"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => update('supportEmail', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label className="small">Support phone</Form.Label>
                <Form.Control
                  size="sm"
                  value={settings.supportPhone}
                  onChange={(e) => update('supportPhone', e.target.value)}
                  placeholder="+1 ..."
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label className="small">Support / help URL</Form.Label>
                <Form.Control
                  size="sm"
                  type="url"
                  value={settings.supportUrl}
                  onChange={(e) => update('supportUrl', e.target.value)}
                  placeholder="https://..."
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Currency & locale */}
      <Card className="mb-3">
        <Card.Header className="d-flex align-items-center">
          <Globe size={18} className="me-2" />
          Currency & locale
        </Card.Header>
        <Card.Body>
          <Row className="g-2">
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label className="small">Currency</Form.Label>
                <Form.Select
                  size="sm"
                  value={settings.currency}
                  onChange={(e) => update('currency', e.target.value)}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label className="small">Timezone</Form.Label>
                <Form.Select
                  size="sm"
                  value={settings.timezone}
                  onChange={(e) => update('timezone', e.target.value)}
                >
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Los_Angeles">America/Los_Angeles</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Europe/Paris">Europe/Paris</option>
                  <option value="Asia/Dubai">Asia/Dubai</option>
                  <option value="UTC">UTC</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label className="small">Tax rate (%)</Form.Label>
                <Form.Control
                  size="sm"
                  type="number"
                  min={0}
                  step={0.01}
                  value={settings.taxRatePercent}
                  onChange={(e) => update('taxRatePercent', parseFloat(e.target.value) || 0)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Commissions */}
      <Card className="mb-3">
        <Card.Header className="d-flex align-items-center">
          <Percent size={18} className="me-2" />
          Default commission
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-0">
                <Form.Label className="small">Default commission (%)</Form.Label>
                <Form.Control
                  size="sm"
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={settings.defaultCommissionPercent}
                  onChange={(e) =>
                    update('defaultCommissionPercent', parseFloat(e.target.value) || 0)
                  }
                />
                <Form.Text className="text-muted">Applied when no category-specific rate is set.</Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Operational policies */}
      <Card className="mb-3">
        <Card.Header className="d-flex align-items-center">
          <Clock size={18} className="me-2" />
          Operational policies
        </Card.Header>
        <Card.Body>
          <Row className="g-2">
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label className="small">Max bookings per day (per professional)</Form.Label>
                <Form.Control
                  size="sm"
                  type="number"
                  min={1}
                  value={settings.maxBookingsPerDayPerProfessional}
                  onChange={(e) =>
                    update('maxBookingsPerDayPerProfessional', parseInt(e.target.value, 10) || 1)
                  }
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label className="small">Min booking notice (hours)</Form.Label>
                <Form.Control
                  size="sm"
                  type="number"
                  min={0}
                  value={settings.minBookingNoticeHours}
                  onChange={(e) =>
                    update('minBookingNoticeHours', parseInt(e.target.value, 10) || 0)
                  }
                />
                <Form.Text className="text-muted">How far in advance customers must book.</Form.Text>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label className="small">Cancellation window (hours)</Form.Label>
                <Form.Control
                  size="sm"
                  type="number"
                  min={0}
                  value={settings.cancellationWindowHours}
                  onChange={(e) =>
                    update('cancellationWindowHours', parseInt(e.target.value, 10) || 0)
                  }
                />
                <Form.Text className="text-muted">Free cancellation before job start.</Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Default notification preferences */}
      <Card className="mb-3">
        <Card.Header className="d-flex align-items-center">
          <Bell size={18} className="me-2" />
          Default notification preferences
        </Card.Header>
        <Card.Body>
          <p className="small text-muted mb-3">
            System-wide defaults for when to send notifications. Can be overridden per template or user.
          </p>
          <Row>
            <Col md={6} lg={3}>
              <Form.Check
                type="switch"
                id="notify-booking-confirmed"
                label="Booking confirmed (customer)"
                checked={settings.notifyCustomerBookingConfirmed}
                onChange={(e) => update('notifyCustomerBookingConfirmed', e.target.checked)}
              />
            </Col>
            <Col md={6} lg={3}>
              <Form.Check
                type="switch"
                id="notify-reminder-customer"
                label="Booking reminder (customer)"
                checked={settings.notifyCustomerReminder}
                onChange={(e) => update('notifyCustomerReminder', e.target.checked)}
              />
            </Col>
            <Col md={6} lg={3}>
              <Form.Check
                type="switch"
                id="notify-new-job"
                label="New job assigned (professional)"
                checked={settings.notifyProfessionalNewJob}
                onChange={(e) => update('notifyProfessionalNewJob', e.target.checked)}
              />
            </Col>
            <Col md={6} lg={3}>
              <Form.Check
                type="switch"
                id="notify-reminder-pro"
                label="Job reminder (professional)"
                checked={settings.notifyProfessionalReminder}
                onChange={(e) => update('notifyProfessionalReminder', e.target.checked)}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default GeneralSettingsPage;
