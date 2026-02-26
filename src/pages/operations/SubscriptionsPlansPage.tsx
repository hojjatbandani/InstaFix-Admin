import { useEffect, useState } from 'react';
import { RefreshCw, Edit3, Check } from 'lucide-react';
import { Card, Button, Form, Row, Col, Modal, Badge } from 'react-bootstrap';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'InstaFix Admin – Subscriptions & Plans';

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  bestFor: string;
  commissionFrom: number;
  commissionTo: number;
  teamSupport: string;
  priorityListing: string;
  jobAccess: string;
  summary: string;
  active: boolean;
}

const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    priceMonthly: 0,
    bestFor: 'Testing the platform',
    commissionFrom: 20,
    commissionTo: 15,
    teamSupport: 'Not included',
    priorityListing: 'Not included',
    jobAccess: 'Limited',
    summary:
      'Perfect for new professionals who want to explore InstaFix and try getting their first few jobs without paying a subscription fee.',
    active: true,
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    priceMonthly: 39,
    bestFor: 'Solo contractors',
    commissionFrom: 10,
    commissionTo: 8,
    teamSupport: 'Not included',
    priorityListing: 'Not included',
    jobAccess: 'Unlimited',
    summary:
      'Ideal for independent professionals who want unlimited access to jobs with lower commission and steady workflow.',
    active: true,
  },
  {
    id: 'business',
    name: 'Business Plan',
    priceMonthly: 79,
    bestFor: 'Active professionals',
    commissionFrom: 7,
    commissionTo: 5,
    teamSupport: 'Limited',
    priorityListing: 'Included',
    jobAccess: 'Unlimited',
    summary:
      'For active professionals and small teams who need priority listing, limited team support, and unlimited job access with the lowest commission.',
    active: true,
  },
];

const SubscriptionsPlansPage = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(MOCK_PLANS);
  const [editModalShow, setEditModalShow] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const handleSavePlan = () => {
    if (!editingPlan) return;
    setPlans((prev) =>
      prev.map((p) => (p.id === editingPlan.id ? { ...editingPlan } : p))
    );
    setEditModalShow(false);
    setEditingPlan(null);
  };

  const openEdit = (plan: SubscriptionPlan) => {
    setEditingPlan({ ...plan });
    setEditModalShow(true);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Subscriptions & Plans</h4>
        <Button variant="outline-primary" size="sm">
          <RefreshCw size={16} className="me-1" />
          Refresh
        </Button>
      </div>

      <p className="text-secondary mb-4">
        Manage subscription tiers offered to professionals: pricing, commission rates, and included features such as team support, priority listing, and job access. Admins can edit plan details to keep offerings aligned with platform strategy.
      </p>

      <Row className="g-3">
        {plans.map((plan) => (
          <Col key={plan.id} md={12} lg={4}>
            <Card className="h-100 border shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center py-3">
                <Card.Title className="mb-0 fs-5">{plan.name}</Card.Title>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => openEdit(plan)}
                  title="Edit plan"
                >
                  <Edit3 size={14} />
                </Button>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <span className="fs-3 fw-bold">${plan.priceMonthly}</span>
                  <span className="text-muted">/month</span>
                </div>
                <p className="small text-muted mb-2">
                  <strong>Best for:</strong> {plan.bestFor}
                </p>
                <ul className="list-unstyled small mb-2">
                  <li className="mb-1">
                    <strong>Commission:</strong>{' '}
                    <span className="text-decoration-line-through">{plan.commissionFrom}%</span>
                    {' → '}
                    <span className="text-success fw-medium">{plan.commissionTo}%</span>
                  </li>
                  <li className="mb-1"><strong>Team Support:</strong> {plan.teamSupport}</li>
                  <li className="mb-1"><strong>Priority Listing:</strong> {plan.priorityListing}</li>
                  <li className="mb-1"><strong>Job Access:</strong> {plan.jobAccess}</li>
                </ul>
                <p className="small text-secondary mb-0">{plan.summary}</p>
              </Card.Body>
              {plan.active && (
                <Card.Footer className="py-2">
                  <Badge bg="success">Active</Badge>
                </Card.Footer>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* Edit plan modal */}
      <Modal show={editModalShow} onHide={() => { setEditModalShow(false); setEditingPlan(null); }} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingPlan && (
            <Form>
              <Row className="g-2">
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">Plan name</Form.Label>
                    <Form.Control
                      size="sm"
                      value={editingPlan.name}
                      onChange={(e) => setEditingPlan((p) => p && { ...p, name: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">Price ($/month)</Form.Label>
                    <Form.Control
                      size="sm"
                      type="number"
                      min={0}
                      value={editingPlan.priceMonthly}
                      onChange={(e) =>
                        setEditingPlan((p) => p && { ...p, priceMonthly: parseInt(e.target.value, 10) || 0 })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">Best for</Form.Label>
                    <Form.Control
                      size="sm"
                      value={editingPlan.bestFor}
                      onChange={(e) => setEditingPlan((p) => p && { ...p, bestFor: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">Commission from (%)</Form.Label>
                    <Form.Control
                      size="sm"
                      type="number"
                      min={0}
                      max={100}
                      value={editingPlan.commissionFrom}
                      onChange={(e) =>
                        setEditingPlan((p) => p && { ...p, commissionFrom: parseInt(e.target.value, 10) || 0 })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">Commission to (%)</Form.Label>
                    <Form.Control
                      size="sm"
                      type="number"
                      min={0}
                      max={100}
                      value={editingPlan.commissionTo}
                      onChange={(e) =>
                        setEditingPlan((p) => p && { ...p, commissionTo: parseInt(e.target.value, 10) || 0 })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">Team Support</Form.Label>
                    <Form.Control
                      size="sm"
                      value={editingPlan.teamSupport}
                      onChange={(e) => setEditingPlan((p) => p && { ...p, teamSupport: e.target.value })}
                      placeholder="e.g. Not included, Limited"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">Priority Listing</Form.Label>
                    <Form.Control
                      size="sm"
                      value={editingPlan.priorityListing}
                      onChange={(e) => setEditingPlan((p) => p && { ...p, priorityListing: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">Job Access</Form.Label>
                    <Form.Control
                      size="sm"
                      value={editingPlan.jobAccess}
                      onChange={(e) => setEditingPlan((p) => p && { ...p, jobAccess: e.target.value })}
                      placeholder="e.g. Limited, Unlimited"
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">Summary</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={editingPlan.summary}
                      onChange={(e) => setEditingPlan((p) => p && { ...p, summary: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Check
                    type="switch"
                    id="plan-active"
                    label="Plan active"
                    checked={editingPlan.active}
                    onChange={(e) => setEditingPlan((p) => p && { ...p, active: e.target.checked })}
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setEditModalShow(false); setEditingPlan(null); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSavePlan}>
            <Check size={14} className="me-1" />
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SubscriptionsPlansPage;
