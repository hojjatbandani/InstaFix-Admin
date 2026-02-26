import { useEffect, useState } from 'react';
import { RefreshCw, Plus, Edit3, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card, Table, Badge, Button, Form, Row, Col, Modal } from 'react-bootstrap';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'InstaFix Admin – Coupons & Promotions';

export type CouponApplicableTo = 'customers' | 'professionals' | 'both';
export type DiscountType = 'percent' | 'fixed';

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  expirationDate: string;
  usageLimit: number | null;
  usageCount: number;
  applicableTo: CouponApplicableTo;
  applicableServices: string; // e.g. "All" or "Plumbing, HVAC"
  active: boolean;
  financialImpact: number; // total discount given
  createdAt: string;
}

const APPLICABLE_LABEL: Record<CouponApplicableTo, string> = {
  customers: 'Customers',
  professionals: 'Professionals',
  both: 'Both',
};

const MOCK_COUPONS: Coupon[] = [
  {
    id: 'c1',
    code: 'WELCOME20',
    discountType: 'percent',
    discountValue: 20,
    expirationDate: '2025-03-31',
    usageLimit: 500,
    usageCount: 142,
    applicableTo: 'customers',
    applicableServices: 'All',
    active: true,
    financialImpact: 2840,
    createdAt: '2025-01-15',
  },
  {
    id: 'c2',
    code: 'PROFIRST',
    discountType: 'fixed',
    discountValue: 10,
    expirationDate: '2025-06-30',
    usageLimit: null,
    usageCount: 28,
    applicableTo: 'professionals',
    applicableServices: 'First month subscription',
    active: true,
    financialImpact: 280,
    createdAt: '2025-02-01',
  },
  {
    id: 'c3',
    code: 'HVAC15',
    discountType: 'percent',
    discountValue: 15,
    expirationDate: '2025-02-28',
    usageLimit: 100,
    usageCount: 100,
    applicableTo: 'customers',
    applicableServices: 'HVAC',
    active: false,
    financialImpact: 1200,
    createdAt: '2025-01-20',
  },
];

const CouponsPromotionsPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percent',
    discountValue: 0,
    expirationDate: '',
    usageLimit: null,
    applicableTo: 'customers',
    applicableServices: 'All',
    active: true,
  });

  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => { document.title = DEFAULT_TITLE; };
  }, []);

  const handleToggleActive = (id: string) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  };

  const handleSaveEdit = () => {
    if (!editingCoupon) return;
    setCoupons((prev) => prev.map((c) => (c.id === editingCoupon.id ? { ...editingCoupon } : c)));
    setEditModalShow(false);
    setEditingCoupon(null);
  };

  const handleAddCoupon = () => {
    if (!newCoupon.code?.trim()) return;
    const c: Coupon = {
      id: `c${Date.now()}`,
      code: newCoupon.code.trim().toUpperCase(),
      discountType: newCoupon.discountType ?? 'percent',
      discountValue: newCoupon.discountValue ?? 0,
      expirationDate: newCoupon.expirationDate ?? '',
      usageLimit: newCoupon.usageLimit ?? null,
      usageCount: 0,
      applicableTo: newCoupon.applicableTo ?? 'customers',
      applicableServices: newCoupon.applicableServices ?? 'All',
      active: newCoupon.active ?? true,
      financialImpact: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setCoupons((prev) => [...prev, c]);
    setAddModalShow(false);
    setNewCoupon({ code: '', discountType: 'percent', discountValue: 0, expirationDate: '', usageLimit: null, applicableTo: 'customers', applicableServices: 'All', active: true });
  };

  const formatDiscount = (c: Coupon) =>
    c.discountType === 'percent' ? `${c.discountValue}%` : `$${c.discountValue}`;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Coupons & Promotions</h4>
        <div className="d-flex gap-2">
          <Button variant="primary" size="sm" onClick={() => setAddModalShow(true)}>
            <Plus size={16} className="me-1" />
            Create coupon
          </Button>
          <Button variant="outline-primary" size="sm">
            <RefreshCw size={16} className="me-1" />
            Refresh
          </Button>
        </div>
      </div>

      <p className="text-secondary mb-4">
        Manage discount codes and promotional campaigns for customers or professionals. Create, edit, activate, or deactivate coupons with rules for discount amount, expiration, usage limits, and applicable services. Track redemption history, usage count, and financial impact to support marketing and user acquisition.
      </p>

      <Card>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th className="pt-0">Code</th>
                <th className="pt-0">Discount</th>
                <th className="pt-0">Expires</th>
                <th className="pt-0">Usage</th>
                <th className="pt-0">Applicable to</th>
                <th className="pt-0">Services</th>
                <th className="pt-0">Financial impact</th>
                <th className="pt-0">Status</th>
                <th className="pt-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td><code>{c.code}</code></td>
                  <td>{formatDiscount(c)}</td>
                  <td className="small">{c.expirationDate}</td>
                  <td className="small">{c.usageCount}{c.usageLimit != null ? ` / ${c.usageLimit}` : ''}</td>
                  <td><Badge bg="light" text="dark">{APPLICABLE_LABEL[c.applicableTo]}</Badge></td>
                  <td className="small">{c.applicableServices}</td>
                  <td className="small">${c.financialImpact}</td>
                  <td><Badge bg={c.active ? 'success' : 'secondary'}>{c.active ? 'Active' : 'Inactive'}</Badge></td>
                  <td className="text-end">
                    <Button variant="outline-primary" size="sm" className="me-1" onClick={() => { setEditingCoupon({ ...c }); setEditModalShow(true); }}>
                      <Edit3 size={14} />
                    </Button>
                    <Button variant="link" size="sm" className="p-0 text-secondary" onClick={() => handleToggleActive(c.id)}>
                      {c.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={addModalShow} onHide={() => setAddModalShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Create coupon</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-2">
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="small">Code</Form.Label>
                  <Form.Control size="sm" placeholder="e.g. SAVE20" value={newCoupon.code ?? ''} onChange={(e) => setNewCoupon((p) => ({ ...p, code: e.target.value }))} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label className="small">Type</Form.Label>
                  <Form.Select size="sm" value={newCoupon.discountType ?? 'percent'} onChange={(e) => setNewCoupon((p) => ({ ...p, discountType: e.target.value as DiscountType }))}>
                    <option value="percent">Percent</option>
                    <option value="fixed">Fixed $</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label className="small">Value</Form.Label>
                  <Form.Control size="sm" type="number" min={0} value={newCoupon.discountValue ?? 0} onChange={(e) => setNewCoupon((p) => ({ ...p, discountValue: parseInt(e.target.value, 10) || 0 }))} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="small">Expiration date</Form.Label>
                  <Form.Control size="sm" type="date" value={newCoupon.expirationDate ?? ''} onChange={(e) => setNewCoupon((p) => ({ ...p, expirationDate: e.target.value }))} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="small">Usage limit (optional)</Form.Label>
                  <Form.Control size="sm" type="number" min={0} placeholder="Unlimited" value={newCoupon.usageLimit ?? ''} onChange={(e) => setNewCoupon((p) => ({ ...p, usageLimit: e.target.value ? parseInt(e.target.value, 10) : null }))} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="small">Applicable to</Form.Label>
                  <Form.Select size="sm" value={newCoupon.applicableTo ?? 'customers'} onChange={(e) => setNewCoupon((p) => ({ ...p, applicableTo: e.target.value as CouponApplicableTo }))}>
                    <option value="customers">Customers</option>
                    <option value="professionals">Professionals</option>
                    <option value="both">Both</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="small">Applicable services</Form.Label>
                  <Form.Control size="sm" placeholder="All or list" value={newCoupon.applicableServices ?? ''} onChange={(e) => setNewCoupon((p) => ({ ...p, applicableServices: e.target.value }))} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Check type="switch" id="new-active" label="Active" checked={newCoupon.active ?? true} onChange={(e) => setNewCoupon((p) => ({ ...p, active: e.target.checked }))} />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAddModalShow(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddCoupon} disabled={!newCoupon.code?.trim()}>Create</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={editModalShow} onHide={() => { setEditModalShow(false); setEditingCoupon(null); }} centered>
        <Modal.Header closeButton><Modal.Title>Edit coupon</Modal.Title></Modal.Header>
        <Modal.Body>
          {editingCoupon && (
            <Form>
              <Row className="g-2">
                <Col md={6}><Form.Group className="mb-2"><Form.Label className="small">Code</Form.Label><Form.Control size="sm" value={editingCoupon.code} onChange={(e) => setEditingCoupon((p) => p ? { ...p, code: e.target.value } : null)} /></Form.Group></Col>
                <Col md={3}><Form.Group className="mb-2"><Form.Label className="small">Type</Form.Label><Form.Select size="sm" value={editingCoupon.discountType} onChange={(e) => setEditingCoupon((p) => p ? { ...p, discountType: e.target.value as DiscountType } : null)}><option value="percent">Percent</option><option value="fixed">Fixed $</option></Form.Select></Form.Group></Col>
                <Col md={3}><Form.Group className="mb-2"><Form.Label className="small">Value</Form.Label><Form.Control size="sm" type="number" min={0} value={editingCoupon.discountValue} onChange={(e) => setEditingCoupon((p) => p ? { ...p, discountValue: parseInt(e.target.value, 10) || 0 } : null)} /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-2"><Form.Label className="small">Expiration</Form.Label><Form.Control size="sm" type="date" value={editingCoupon.expirationDate} onChange={(e) => setEditingCoupon((p) => p ? { ...p, expirationDate: e.target.value } : null)} /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-2"><Form.Label className="small">Usage limit</Form.Label><Form.Control size="sm" type="number" min={0} value={editingCoupon.usageLimit ?? ''} onChange={(e) => setEditingCoupon((p) => p ? { ...p, usageLimit: e.target.value ? parseInt(e.target.value, 10) : null } : null)} /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-2"><Form.Label className="small">Applicable to</Form.Label><Form.Select size="sm" value={editingCoupon.applicableTo} onChange={(e) => setEditingCoupon((p) => p ? { ...p, applicableTo: e.target.value as CouponApplicableTo } : null)}><option value="customers">Customers</option><option value="professionals">Professionals</option><option value="both">Both</option></Form.Select></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-2"><Form.Label className="small">Services</Form.Label><Form.Control size="sm" value={editingCoupon.applicableServices} onChange={(e) => setEditingCoupon((p) => p ? { ...p, applicableServices: e.target.value } : null)} /></Form.Group></Col>
                <Col md={12}><Form.Check type="switch" id="edit-active" label="Active" checked={editingCoupon.active} onChange={(e) => setEditingCoupon((p) => p ? { ...p, active: e.target.checked } : null)} /></Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setEditModalShow(false); setEditingCoupon(null); }}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveEdit}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CouponsPromotionsPage;
