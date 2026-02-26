import { useEffect, useState, useMemo } from 'react';
import { Filter, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';
import { Card, Form, Row, Col, Button, Modal, Badge } from 'react-bootstrap';
import { Link } from 'react-router';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg, EventInput } from '@fullcalendar/core';

const DEFAULT_TITLE = 'InstaFix Admin';
const PAGE_TITLE = 'InstaFix Admin – Scheduling Calendar';

export type JobStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type ServiceCategory = 'plumbing' | 'electrical' | 'hvac' | 'cleaning' | 'appliance';

export interface ScheduledJob {
  id: string;
  jobId: string;
  title: string;
  serviceCategory: ServiceCategory;
  status: JobStatus;
  location: string;
  professionalId: string;
  professionalName: string;
  customerName: string;
  start: string; // ISO
  end: string;
}

const CATEGORY_LABEL: Record<ServiceCategory, string> = {
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  hvac: 'HVAC',
  cleaning: 'Cleaning',
  appliance: 'Appliance repair',
};

const STATUS_LABEL: Record<JobStatus, string> = {
  scheduled: 'Scheduled',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_VARIANT: Record<JobStatus, string> = {
  scheduled: 'primary',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'secondary',
};

const CATEGORY_COLORS: Record<ServiceCategory, { bg: string; border: string }> = {
  plumbing: { bg: 'rgba(1,104,250,.2)', border: '#0168fa' },
  electrical: { bg: 'rgba(253,126,20,.25)', border: '#fd7e14' },
  hvac: { bg: 'rgba(0,204,204,.25)', border: '#00cccc' },
  cleaning: { bg: 'rgba(16,183,89,.25)', border: '#10b759' },
  appliance: { bg: 'rgba(91,71,251,.2)', border: '#5b47fb' },
};

// Mock scheduled jobs – replace with API
const MOCK_JOBS: ScheduledJob[] = (() => {
  const y = new Date().getFullYear();
  const m = String(new Date().getMonth() + 1).padStart(2, '0');
  const base = `${y}-${m}`;
  return [
    {
      id: 'ev1',
      jobId: 'J-2901',
      title: 'Pipe repair',
      serviceCategory: 'plumbing',
      status: 'scheduled',
      location: 'Downtown, 123 Main St',
      professionalId: 'pro1',
      professionalName: 'Mike Johnson',
      customerName: 'Sarah Mitchell',
      start: `${base}-25T09:00:00`,
      end: `${base}-25T11:00:00`,
    },
    {
      id: 'ev2',
      jobId: 'J-2902',
      title: 'AC maintenance',
      serviceCategory: 'hvac',
      status: 'scheduled',
      location: 'West District',
      professionalId: 'pro2',
      professionalName: 'Emma Wilson',
      customerName: 'John Doe',
      start: `${base}-25T10:00:00`,
      end: `${base}-25T12:00:00`,
    },
    {
      id: 'ev3',
      jobId: 'J-2903',
      title: 'Outlet installation',
      serviceCategory: 'electrical',
      status: 'scheduled',
      location: 'North Side',
      professionalId: 'pro1',
      professionalName: 'Mike Johnson',
      customerName: 'Maria Garcia',
      start: `${base}-25T11:30:00`,
      end: `${base}-25T13:00:00`,
    },
    {
      id: 'ev4',
      jobId: 'J-2904',
      title: 'Deep cleaning',
      serviceCategory: 'cleaning',
      status: 'scheduled',
      location: 'South Park Ave',
      professionalId: 'pro3',
      professionalName: 'Lisa Chen',
      customerName: 'Tom Brown',
      start: `${base}-25T14:00:00`,
      end: `${base}-25T17:00:00`,
    },
    {
      id: 'ev5',
      jobId: 'J-2905',
      title: 'Washer repair',
      serviceCategory: 'appliance',
      status: 'scheduled',
      location: 'East Valley',
      professionalId: 'pro2',
      professionalName: 'Emma Wilson',
      customerName: 'Anna Lee',
      start: `${base}-26T08:00:00`,
      end: `${base}-26T10:00:00`,
    },
    {
      id: 'ev6',
      jobId: 'J-2906',
      title: 'Water heater check',
      serviceCategory: 'plumbing',
      status: 'scheduled',
      location: 'Central Plaza',
      professionalId: 'pro1',
      professionalName: 'Mike Johnson',
      customerName: 'David Kim',
      start: `${base}-26T09:00:00`,
      end: `${base}-26T10:30:00`,
    },
    {
      id: 'ev7',
      jobId: 'J-2907',
      title: 'Panel upgrade',
      serviceCategory: 'electrical',
      status: 'in_progress',
      location: 'Downtown',
      professionalId: 'pro4',
      professionalName: 'James Park',
      customerName: 'Rachel Green',
      start: `${base}-25T08:00:00`,
      end: `${base}-25T12:00:00`,
    },
  ];
})();

function getOverlappingJobs(jobs: ScheduledJob[]): { professionalName: string; jobIds: string[] }[] {
  const byPro = new Map<string, ScheduledJob[]>();
  jobs.forEach((j) => {
    if (j.status === 'cancelled') return;
    const list = byPro.get(j.professionalId) ?? [];
    list.push(j);
    byPro.set(j.professionalId, list);
  });
  const conflicts: { professionalName: string; jobIds: string[] }[] = [];
  byPro.forEach((list, proId) => {
    const name = list[0]?.professionalName ?? '';
    for (let i = 0; i < list.length; i++) {
      for (let k = i + 1; k < list.length; k++) {
        const a = list[i];
        const b = list[k];
        const aStart = new Date(a.start).getTime();
        const aEnd = new Date(a.end).getTime();
        const bStart = new Date(b.start).getTime();
        const bEnd = new Date(b.end).getTime();
        if (aStart < bEnd && bStart < aEnd) {
          const ids = [a.jobId, b.jobId];
          const existing = conflicts.find((c) => c.professionalName === name);
          if (existing) {
            ids.forEach((id) => { if (!existing.jobIds.includes(id)) existing.jobIds.push(id); });
          } else {
            conflicts.push({ professionalName: name, jobIds: ids });
          }
        }
      }
    }
  });
  return conflicts;
}

const SchedulingCalendarPage = () => {
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<ScheduledJob | null>(null);
  const [detailModalShow, setDetailModalShow] = useState(false);

  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter((j) => {
      const catMatch = categoryFilter === 'all' || j.serviceCategory === categoryFilter;
      const statusMatch = statusFilter === 'all' || j.status === statusFilter;
      const locMatch =
        !locationSearch ||
        j.location.toLowerCase().includes(locationSearch.toLowerCase());
      return catMatch && statusMatch && locMatch;
    });
  }, [categoryFilter, statusFilter, locationSearch]);

  const calendarEvents: EventInput[] = useMemo(() => {
    return filteredJobs.map((j) => {
      const colors = CATEGORY_COLORS[j.serviceCategory];
      return {
        id: j.id,
        title: `${j.title} · ${j.professionalName}`,
        start: j.start,
        end: j.end,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        extendedProps: {
          job: j,
        },
      };
    });
  }, [filteredJobs]);

  const conflicts = useMemo(() => getOverlappingJobs(filteredJobs), [filteredJobs]);

  const handleEventClick = (info: EventClickArg) => {
    const job = info.event.extendedProps?.job as ScheduledJob | undefined;
    if (job) {
      setSelectedJob(job);
      setDetailModalShow(true);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <h4 className="mb-3 mb-md-0">Scheduling Calendar</h4>
        <Button variant="outline-primary" size="sm">
          <RefreshCw size={16} className="me-1" />
          Refresh
        </Button>
      </div>

      <p className="text-secondary mb-4">
        Visual overview of all scheduled jobs organized by date, time, and assigned professional. Filter by service category, job status, and location. View availability, detect scheduling conflicts, and access job details directly from the calendar for workload distribution and efficient daily operations.
      </p>

      {/* Filters */}
      <Card className="mb-3">
        <Card.Body className="py-2">
          <Row className="g-2 align-items-center">
            <Col md={6} lg={2}>
              <Form.Label className="small mb-0">Category</Form.Label>
              <Form.Select
                size="sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as ServiceCategory | 'all')}
              >
                <option value="all">All categories</option>
                {(Object.keys(CATEGORY_LABEL) as ServiceCategory[]).map((c) => (
                  <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6} lg={2}>
              <Form.Label className="small mb-0">Status</Form.Label>
              <Form.Select
                size="sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as JobStatus | 'all')}
              >
                <option value="all">All statuses</option>
                {(Object.keys(STATUS_LABEL) as JobStatus[]).map((s) => (
                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6} lg={3}>
              <Form.Label className="small mb-0">Location</Form.Label>
              <Form.Control
                size="sm"
                placeholder="Search location..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Scheduling conflicts */}
      {conflicts.length > 0 && (
        <div className="alert alert-warning d-flex align-items-center mb-3 py-2" role="alert">
          <AlertTriangle size={20} className="me-2 flex-shrink-0" />
          <div>
            <strong>Scheduling conflicts detected:</strong>{' '}
            {conflicts.map((c) => (
              <span key={c.professionalName} className="me-2">
                <strong>{c.professionalName}</strong> – overlapping jobs: {c.jobIds.join(', ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Calendar */}
      <Card>
        <Card.Body>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
            }}
            initialView="timeGridWeek"
            editable={false}
            selectable={false}
            dayMaxEvents={true}
            weekends={true}
            events={calendarEvents}
            eventClick={handleEventClick}
          />
        </Card.Body>
      </Card>

      {/* Job detail modal */}
      <Modal show={detailModalShow} onHide={() => setDetailModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Job details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedJob && (
            <div className="small">
              <p className="mb-1"><strong>Job:</strong> {selectedJob.jobId}</p>
              <p className="mb-1"><strong>Title:</strong> {selectedJob.title}</p>
              <p className="mb-1">
                <strong>Category:</strong>{' '}
                <Badge bg="light" text="dark">{CATEGORY_LABEL[selectedJob.serviceCategory]}</Badge>
              </p>
              <p className="mb-1">
                <strong>Status:</strong>{' '}
                <Badge bg={STATUS_VARIANT[selectedJob.status]}>{STATUS_LABEL[selectedJob.status]}</Badge>
              </p>
              <p className="mb-1"><strong>Professional:</strong> {selectedJob.professionalName}</p>
              <p className="mb-1"><strong>Customer:</strong> {selectedJob.customerName}</p>
              <p className="mb-1"><strong>Location:</strong> {selectedJob.location}</p>
              <p className="mb-0">
                <strong>Time:</strong>{' '}
                {new Date(selectedJob.start).toLocaleString()} – {new Date(selectedJob.end).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDetailModalShow(false)}>
            Close
          </Button>
          {selectedJob && (
            <Link to={`/jobs-list?job=${selectedJob.jobId}`}>
              <Button variant="primary">
                <ExternalLink size={14} className="me-1" />
                Open job
              </Button>
            </Link>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SchedulingCalendarPage;
