import { Printer, DownloadCloud, ArrowUp, ArrowDown, DollarSign, TrendingUp, CreditCard, RotateCcw, Wallet, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button, Row, Card, Col, Badge, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import DatePicker from './components/DatePicker';
import CardActionsDropdown from './components/CardActionsDropdown';
import CustomersChart from './components/CustomersChart';
import OrdersChart from './components/OrdersChart';
import GrowthChart from './components/GrowthChart';

// Placeholder data – replace with real API data
const OPERATIONAL_METRICS = {
  totalJobs: { value: 1247, change: 5.2, trend: 'up' as const },
  activeBookings: { value: 89, change: -2.1, trend: 'down' as const },
  pendingApprovals: { value: 23, change: 12, trend: 'up' as const },
  completedJobs: { value: 1089, change: 3.8, trend: 'up' as const },
  cancellations: { value: 45, change: -8, trend: 'down' as const },
  openDisputes: { value: 7, change: 1, trend: 'up' as const },
};

const FINANCIAL_METRICS = {
  gmv: { value: 284500, change: 4.2, trend: 'up' as const },
  platformRevenue: { value: 25605, change: 6.1, trend: 'up' as const },
  failedPayments: { value: 12, change: -15, trend: 'down' as const },
  refunds: { value: 3420, change: 2, trend: 'up' as const },
  pendingPayouts: { value: 18900, change: 0, trend: 'neutral' as const },
};

const URGENT_ITEMS = [
  { id: 1, type: 'Dispute', title: 'Payment dispute #7821', priority: 'high', age: '2h' },
  { id: 2, type: 'Approval', title: 'Pro verification pending', priority: 'high', age: '5h' },
  { id: 3, type: 'Payment', title: 'Failed payout – retry required', priority: 'medium', age: '1d' },
  { id: 4, type: 'Booking', title: 'Cancellation request #4455', priority: 'medium', age: '3h' },
];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

const MetricCard = ({
  title,
  value,
  change,
  trend,
  chart,
}: {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  chart?: React.ReactNode;
}) => (
  <Card>
    <Card.Body>
      <div className="d-flex justify-content-between align-items-baseline mb-2">
        <Card.Title className="mb-0">{title}</Card.Title>
        <CardActionsDropdown />
      </div>
      <Row>
        <Col xs={6} md={12} xl={chart ? 5 : 12}>
          <h3 className="mb-2">{typeof value === 'number' && value > 1000 ? value.toLocaleString() : value}</h3>
          {change !== undefined && trend && trend !== 'neutral' && (
            <div className="d-flex align-items-baseline">
              <p className={trend === 'up' ? 'text-success' : 'text-danger'}>
                <span>{trend === 'up' ? '+' : ''}{change}%</span>
                {trend === 'up' ? <ArrowUp className="icon-sm mb-1" /> : <ArrowDown className="icon-sm mb-1" />}
              </p>
            </div>
          )}
        </Col>
        {chart && (
          <Col xs={6} md={12} xl={7}>
            <div className="mt-md-3 mt-xl-0">{chart}</div>
          </Col>
        )}
      </Row>
    </Card.Body>
  </Card>
);

const DEFAULT_TITLE = 'Admin InstaFix';
const DASHBOARD_TITLE = 'Admin InstaFix';

const DashboardPage = () => {
  const [selected, setSelected] = useState<Date>(new Date());

  useEffect(() => {
    document.title = DASHBOARD_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Admin Dashboard</h4>
        <div className="d-flex align-items-center flex-wrap text-nowrap">
          <DatePicker selected={selected} onDateSelect={setSelected} className="w-200px me-2 mb-2 mb-md-0" />
          <Button variant="outline-primary" className="btn-icon-text me-2 mb-2 mb-md-0">
            <Printer size={16} className="me-2" />
            Print
          </Button>
          <Button variant="primary" className="btn-icon-text mb-2 mb-md-0">
            <DownloadCloud size={16} className="me-2" />
            Download Report
          </Button>
        </div>
      </div>

      <p className="text-secondary mb-4">
        Real-time overview of platform performance and operational health. Key metrics and financial summaries at a glance.
      </p>

      {/* Operational metrics */}
      <h6 className="text-uppercase text-secondary mb-3">Operational metrics</h6>
      <Row>
        <Col md={4} className="grid-margin stretch-card">
          <MetricCard
            title="Total jobs"
            value={OPERATIONAL_METRICS.totalJobs.value}
            change={OPERATIONAL_METRICS.totalJobs.change}
            trend={OPERATIONAL_METRICS.totalJobs.trend}
            chart={<CustomersChart />}
          />
        </Col>
        <Col md={4} className="grid-margin stretch-card">
          <MetricCard
            title="Active bookings"
            value={OPERATIONAL_METRICS.activeBookings.value}
            change={OPERATIONAL_METRICS.activeBookings.change}
            trend={OPERATIONAL_METRICS.activeBookings.trend}
            chart={<OrdersChart />}
          />
        </Col>
        <Col md={4} className="grid-margin stretch-card">
          <MetricCard
            title="Pending approvals"
            value={OPERATIONAL_METRICS.pendingApprovals.value}
            change={OPERATIONAL_METRICS.pendingApprovals.change}
            trend={OPERATIONAL_METRICS.pendingApprovals.trend}
            chart={<GrowthChart />}
          />
        </Col>
      </Row>
      <Row>
        <Col md={4} className="grid-margin stretch-card">
          <MetricCard title="Completed jobs" value={OPERATIONAL_METRICS.completedJobs.value} change={OPERATIONAL_METRICS.completedJobs.change} trend={OPERATIONAL_METRICS.completedJobs.trend} />
        </Col>
        <Col md={4} className="grid-margin stretch-card">
          <MetricCard title="Cancellations" value={OPERATIONAL_METRICS.cancellations.value} change={OPERATIONAL_METRICS.cancellations.change} trend={OPERATIONAL_METRICS.cancellations.trend} />
        </Col>
        <Col md={4} className="grid-margin stretch-card">
          <MetricCard title="Open disputes" value={OPERATIONAL_METRICS.openDisputes.value} change={OPERATIONAL_METRICS.openDisputes.change} trend={OPERATIONAL_METRICS.openDisputes.trend} />
        </Col>
      </Row>

      {/* Financial summary */}
      <h6 className="text-uppercase text-secondary mb-3 mt-4">Financial summary</h6>
      <Row>
        <Col md={4} lg={2} className="grid-margin stretch-card">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-baseline mb-2">
                <Card.Title className="mb-0 fs-6">GMV</Card.Title>
                <DollarSign className="text-primary icon-sm" />
              </div>
              <h5 className="mb-1">{formatCurrency(FINANCIAL_METRICS.gmv.value)}</h5>
              <p className="text-success small mb-0"><ArrowUp size={12} /> +{FINANCIAL_METRICS.gmv.change}%</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={2} className="grid-margin stretch-card">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-baseline mb-2">
                <Card.Title className="mb-0 fs-6">Platform revenue</Card.Title>
                <TrendingUp className="text-success icon-sm" />
              </div>
              <h5 className="mb-1">{formatCurrency(FINANCIAL_METRICS.platformRevenue.value)}</h5>
              <p className="text-success small mb-0"><ArrowUp size={12} /> +{FINANCIAL_METRICS.platformRevenue.change}%</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={2} className="grid-margin stretch-card">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-baseline mb-2">
                <Card.Title className="mb-0 fs-6">Failed payments</Card.Title>
                <CreditCard className="text-danger icon-sm" />
              </div>
              <h5 className="mb-1">{FINANCIAL_METRICS.failedPayments.value}</h5>
              <p className="text-danger small mb-0"><ArrowDown size={12} /> {FINANCIAL_METRICS.failedPayments.change}%</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={2} className="grid-margin stretch-card">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-baseline mb-2">
                <Card.Title className="mb-0 fs-6">Refunds</Card.Title>
                <RotateCcw className="text-warning icon-sm" />
              </div>
              <h5 className="mb-1">{formatCurrency(FINANCIAL_METRICS.refunds.value)}</h5>
              <p className="text-success small mb-0"><ArrowUp size={12} /> +{FINANCIAL_METRICS.refunds.change}%</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={2} className="grid-margin stretch-card">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-baseline mb-2">
                <Card.Title className="mb-0 fs-6">Pending payouts</Card.Title>
                <Wallet className="text-info icon-sm" />
              </div>
              <h5 className="mb-1">{formatCurrency(FINANCIAL_METRICS.pendingPayouts.value)}</h5>
              <p className="text-secondary small mb-0">—</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick links to urgent queues */}
      <h6 className="text-uppercase text-secondary mb-3 mt-4">Quick links</h6>
      <Row>
        <Col md={6} lg={3} className="grid-margin">
          <Card className="h-100">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <Card.Title className="mb-1 fs-6">Pending approvals</Card.Title>
                <Badge bg="warning" text="dark">{OPERATIONAL_METRICS.pendingApprovals.value} items</Badge>
              </div>
              <Link to="/tables/datatable" className="btn btn-sm btn-outline-primary">
                View <ChevronRight size={14} />
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="grid-margin">
          <Card className="h-100">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <Card.Title className="mb-1 fs-6">Open disputes</Card.Title>
                <Badge bg="danger">{OPERATIONAL_METRICS.openDisputes.value} items</Badge>
              </div>
              <Link to="/tables/datatable" className="btn btn-sm btn-outline-primary">
                View <ChevronRight size={14} />
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="grid-margin">
          <Card className="h-100">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <Card.Title className="mb-1 fs-6">Failed payments</Card.Title>
                <Badge bg="danger">{FINANCIAL_METRICS.failedPayments.value} items</Badge>
              </div>
              <Link to="/tables/datatable" className="btn btn-sm btn-outline-primary">
                View <ChevronRight size={14} />
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="grid-margin">
          <Card className="h-100">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <Card.Title className="mb-1 fs-6">Pending payouts</Card.Title>
                <Badge bg="info">{formatCurrency(FINANCIAL_METRICS.pendingPayouts.value)}</Badge>
              </div>
              <Link to="/tables/datatable" className="btn btn-sm btn-outline-primary">
                View <ChevronRight size={14} />
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* High-priority issues table */}
      <Row className="mt-4">
        <Col xl={12} className="grid-margin stretch-card">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-baseline mb-3">
                <Card.Title className="mb-0">High-priority issues</Card.Title>
                <CardActionsDropdown />
              </div>
              <p className="text-secondary small mb-3">Urgent items requiring attention.</p>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th className="pt-0">#</th>
                    <th className="pt-0">Type</th>
                    <th className="pt-0">Title</th>
                    <th className="pt-0">Priority</th>
                    <th className="pt-0">Age</th>
                    <th className="pt-0">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {URGENT_ITEMS.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.type}</td>
                      <td>{item.title}</td>
                      <td>
                        <Badge bg={item.priority === 'high' ? 'danger' : 'warning'} text="dark">
                          {item.priority}
                        </Badge>
                      </td>
                      <td>{item.age}</td>
                      <td>
                        <Link to="/tables/datatable" className="btn btn-sm btn-outline-primary">
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Link to="/tables/datatable" className="btn btn-sm btn-primary">
                View all issues <ChevronRight size={14} />
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
