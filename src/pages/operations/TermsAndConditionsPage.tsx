import { useEffect, useState } from 'react';
import { FileText, RefreshCw, Save, History } from 'lucide-react';
import { Card, Button, Form, Badge } from 'react-bootstrap';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'InstaFix Admin – Terms & Conditions';

// Mock: official version stored for legal reference – replace with API
const MOCK_TERMS = {
  effectiveDate: '2025-01-01',
  lastUpdated: '2025-02-20',
  version: '2.1',
  content: `This document is the official Terms and Conditions for the InstaFix platform. The version displayed here is the one presented to and accepted by both the customer and the professional during the booking process.

**1. Acceptance**
By completing a booking, the customer and the professional acknowledge that they have read, understood, and agreed to these Terms and Conditions in effect at the time of booking.

**2. Service agreement**
The booking creates a binding agreement between the customer and the professional for the requested service, subject to these terms and the platform's policies.

**3. Cancellation and disputes**
Cancellation and refund rules, as well as dispute resolution procedures, are governed by the terms in effect at the time of booking. This record serves as the legal reference in case of disputes or claims.

**4. Changes**
InstaFix may update these terms from time to time. The version accepted at the time of booking remains the governing version for that booking.`,
};

const TermsAndConditionsPage = () => {
  const [content, setContent] = useState(MOCK_TERMS.content);
  const [effectiveDate, setEffectiveDate] = useState(MOCK_TERMS.effectiveDate);
  const [lastUpdated, setLastUpdated] = useState(MOCK_TERMS.lastUpdated);
  const [version, setVersion] = useState(MOCK_TERMS.version);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const handleSave = () => {
    setLastUpdated(new Date().toISOString().slice(0, 10));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Terms & Conditions</h4>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <Button variant="outline-secondary" size="sm" title="View version history">
            <History size={16} className="me-1" />
            History
          </Button>
          <Button variant="outline-primary" size="sm">
            <RefreshCw size={16} className="me-1" />
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            <Save size={16} className="me-1" />
            Save
          </Button>
        </div>
      </div>

      <p className="text-secondary mb-4">
        This section stores and displays the official version of the Terms and Conditions that were reviewed and accepted by both the customer and the professional during the booking process. This record serves as a legal reference in case of disputes or claims.
      </p>

      <Card className="mb-3">
        <Card.Header className="d-flex align-items-center flex-wrap gap-2">
          <FileText size={18} />
          <span className="fw-medium">Official Terms & Conditions</span>
          <Badge bg="light" text="dark">
            Version {version}
          </Badge>
          <span className="small text-muted ms-auto">
            Effective: {effectiveDate} · Last updated: {lastUpdated}
          </span>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-0">
            <Form.Label className="small text-muted">
              Content (this version is shown to users at booking and stored for legal reference)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={14}
              className="font-monospace small"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Terms and Conditions text..."
            />
          </Form.Group>
          {saved && (
            <small className="text-success d-block mt-2">Changes saved. Last updated date refreshed.</small>
          )}
        </Card.Body>
      </Card>

      <Card className="bg-light border-0">
        <Card.Body className="small text-muted py-3">
          <strong>Legal note:</strong> The version of the Terms and Conditions that was in effect at the time of each booking is the one that applies to that booking. This page shows the current official document; for a specific dispute or claim, use the version that was accepted at the time of the relevant booking.
        </Card.Body>
      </Card>
    </>
  );
};

export default TermsAndConditionsPage;
