import { useEffect, useState } from 'react';
import {
  Wrench,
  Zap,
  ThermometerSun,
  Refrigerator,
  Plus,
  Edit3,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Users,
  DollarSign,
  type LucideIcon,
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
  Modal,
} from 'react-bootstrap';
import { Link } from 'react-router';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'InstaFix Admin – Service Categories';

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconId: string;
  active: boolean;
  professionalsCount: number;
  pricingRulesCount: number;
  updatedAt: string;
}

const ICON_OPTIONS: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: 'wrench', label: 'Plumbing / General', Icon: Wrench },
  { id: 'zap', label: 'Electrical', Icon: Zap },
  { id: 'thermometer', label: 'HVAC', Icon: ThermometerSun },
  { id: 'refrigerator', label: 'Appliance repair', Icon: Refrigerator },
];

const getIconById = (id: string) => ICON_OPTIONS.find((o) => o.id === id)?.Icon ?? Wrench;

// Mock data – replace with API
const MOCK_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat1',
    name: 'Plumbing',
    slug: 'plumbing',
    description: 'Pipe repair, leaks, installations, and drain services.',
    iconId: 'wrench',
    active: true,
    professionalsCount: 24,
    pricingRulesCount: 3,
    updatedAt: '2025-02-22',
  },
  {
    id: 'cat2',
    name: 'Electrical',
    slug: 'electrical',
    description: 'Wiring, outlets, panels, and electrical repairs.',
    iconId: 'zap',
    active: true,
    professionalsCount: 18,
    pricingRulesCount: 2,
    updatedAt: '2025-02-21',
  },
  {
    id: 'cat3',
    name: 'HVAC',
    slug: 'hvac',
    description: 'Heating, ventilation, air conditioning, and thermostat services.',
    iconId: 'thermometer',
    active: true,
    professionalsCount: 15,
    pricingRulesCount: 4,
    updatedAt: '2025-02-20',
  },
  {
    id: 'cat4',
    name: 'Appliance Repair',
    slug: 'appliance-repair',
    description: 'Refrigerators, washers, dryers, and other home appliances.',
    iconId: 'refrigerator',
    active: true,
    professionalsCount: 12,
    pricingRulesCount: 2,
    updatedAt: '2025-02-19',
  },
  {
    id: 'cat5',
    name: 'Carpentry',
    slug: 'carpentry',
    description: 'Furniture repair, custom woodwork, and installations.',
    iconId: 'wrench',
    active: false,
    professionalsCount: 8,
    pricingRulesCount: 1,
    updatedAt: '2025-02-18',
  },
];

const ServiceCategoriesPage = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>(MOCK_CATEGORIES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [editModalShow, setEditModalShow] = useState(false);
  const [editCategory, setEditCategory] = useState<ServiceCategory | null>(null);
  const [addModalShow, setAddModalShow] = useState(false);
  const [newCategory, setNewCategory] = useState<Partial<ServiceCategory>>({
    name: '',
    slug: '',
    description: '',
    iconId: 'wrench',
    active: true,
    professionalsCount: 0,
    pricingRulesCount: 0,
  });

  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const filteredCategories = categories.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && c.active) ||
      (statusFilter === 'inactive' && !c.active);
    return matchSearch && matchStatus;
  });

  const handleToggleActive = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const handleOpenEdit = (category: ServiceCategory) => {
    setEditCategory({ ...category });
    setEditModalShow(true);
  };

  const handleSaveEdit = () => {
    if (!editCategory) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === editCategory.id
          ? { ...editCategory, updatedAt: new Date().toISOString().slice(0, 10) }
          : c
      )
    );
    setEditModalShow(false);
    setEditCategory(null);
  };

  const slugify = (name: string) =>
    name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

  const handleAddCategory = () => {
    if (!newCategory.name?.trim()) return;
    const slug = newCategory.slug?.trim() || slugify(newCategory.name);
    const cat: ServiceCategory = {
      id: `cat${Date.now()}`,
      name: newCategory.name.trim(),
      slug,
      description: newCategory.description?.trim() ?? '',
      iconId: newCategory.iconId ?? 'wrench',
      active: newCategory.active ?? true,
      professionalsCount: 0,
      pricingRulesCount: 0,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setCategories((prev) => [...prev, cat]);
    setAddModalShow(false);
    setNewCategory({
      name: '',
      slug: '',
      description: '',
      iconId: 'wrench',
      active: true,
      professionalsCount: 0,
      pricingRulesCount: 0,
    });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Service Categories</h4>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <Button variant="primary" size="sm" onClick={() => setAddModalShow(true)}>
            <Plus size={16} className="me-1" />
            Add category
          </Button>
          <Button variant="outline-primary" size="sm">
            <RefreshCw size={16} className="me-1" />
            Refresh
          </Button>
        </div>
      </div>

      <p className="text-secondary mb-4">
        Manage the list of services offered on the platform (e.g. plumbing, electrical, HVAC, appliance repair). Add, edit, activate, or deactivate categories and define descriptions or icons. Categories are linked to professionals, pricing rules, and job filtering logic for an organized service structure and accurate job matching.
      </p>

      <Card>
        <Card.Body>
          <Row className="mb-3 g-2">
            <Col md={6} lg={4}>
              <Form.Control
                size="sm"
                placeholder="Search by name or slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col md={6} lg={3}>
              <Form.Select
                size="sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Col>
          </Row>

          <Table responsive hover>
            <thead>
              <tr>
                <th className="pt-0">Category</th>
                <th className="pt-0">Description</th>
                <th className="pt-0">Professionals</th>
                <th className="pt-0">Pricing rules</th>
                <th className="pt-0">Status</th>
                <th className="pt-0">Updated</th>
                <th className="pt-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((c) => {
                const Icon = getIconById(c.iconId);
                return (
                  <tr key={c.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="d-inline-flex align-items-center justify-content-center rounded bg-light me-2" style={{ width: 32, height: 32 }}>
                          <Icon size={18} className="text-primary" />
                        </span>
                        <div>
                          <span className="fw-medium">{c.name}</span>
                          <small className="d-block text-muted">{c.slug}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <small className="text-secondary">
                        {c.description || '—'}
                      </small>
                    </td>
                    <td>
                      <Link
                        to={`/professionals?category=${c.id}`}
                        className="d-inline-flex align-items-center text-decoration-none"
                        title="Filter professionals by this category"
                      >
                        <Users size={14} className="me-1" />
                        {c.professionalsCount}
                      </Link>
                    </td>
                    <td>
                      <span className="d-inline-flex align-items-center text-muted">
                        <DollarSign size={14} className="me-1" />
                        {c.pricingRulesCount}
                      </span>
                    </td>
                    <td>
                      <Badge bg={c.active ? 'success' : 'secondary'}>
                        {c.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <small>{c.updatedAt}</small>
                    </td>
                    <td className="text-end">
                      <ButtonGroup size="sm">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          title="Edit category"
                          onClick={() => handleOpenEdit(c)}
                        >
                          <Edit3 size={14} />
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 text-secondary"
                          title={c.active ? 'Deactivate' : 'Activate'}
                          onClick={() => handleToggleActive(c.id)}
                        >
                          {c.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
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

      {/* Add category modal */}
      <Modal show={addModalShow} onHide={() => setAddModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add service category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Plumbing"
                value={newCategory.name ?? ''}
                onChange={(e) => {
                  setNewCategory((prev) => ({
                    ...prev,
                    name: e.target.value,
                    slug: prev?.slug || slugify(e.target.value),
                  }));
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Slug (URL key)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. plumbing"
                value={newCategory.slug ?? ''}
                onChange={(e) => setNewCategory((prev) => ({ ...prev, slug: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Short description of this service category"
                value={newCategory.description ?? ''}
                onChange={(e) => setNewCategory((prev) => ({ ...prev, description: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Icon</Form.Label>
              <Form.Select
                value={newCategory.iconId ?? 'wrench'}
                onChange={(e) => setNewCategory((prev) => ({ ...prev, iconId: e.target.value }))}
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Check
              type="switch"
              id="add-active"
              label="Active"
              checked={newCategory.active ?? true}
              onChange={(e) => setNewCategory((prev) => ({ ...prev, active: e.target.checked }))}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAddModalShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddCategory} disabled={!newCategory.name?.trim()}>
            Add category
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit category modal */}
      <Modal
        show={editModalShow}
        onHide={() => {
          setEditModalShow(false);
          setEditCategory(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit service category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editCategory && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editCategory.name}
                  onChange={(e) => setEditCategory((prev) => prev && { ...prev, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Slug (URL key)</Form.Label>
                <Form.Control
                  type="text"
                  value={editCategory.slug}
                  onChange={(e) => setEditCategory((prev) => prev && { ...prev, slug: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={editCategory.description}
                  onChange={(e) =>
                    setEditCategory((prev) => prev && { ...prev, description: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Icon</Form.Label>
                <Form.Select
                  value={editCategory.iconId}
                  onChange={(e) =>
                    setEditCategory((prev) => prev && { ...prev, iconId: e.target.value })
                  }
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Check
                type="switch"
                id="edit-active"
                label="Active"
                checked={editCategory.active}
                onChange={(e) =>
                  setEditCategory((prev) => prev && { ...prev, active: e.target.checked })
                }
              />
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setEditModalShow(false);
              setEditCategory(null);
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ServiceCategoriesPage;
