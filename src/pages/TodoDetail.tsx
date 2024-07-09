import { string } from "prop-types";
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import {
  DatePicker,
  Input,
  Icon,
  List,
  Checkbox,
  Modal,
  useNavigate,
} from "zmp-ui";

interface Job {
  id: string; // Thêm trường id
  job: string;
  date: string;
  status: boolean;
  subtasks: { text: string; StatusTask: boolean }[];
}

const TodoDetail: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>(); // Sử dụng id thay vì index
  const { Item } = List;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [modalAdd, setModalAdd] = useState(false);
  const [subtask, setSubtask] = useState('');
  const [isEditingSubtask, setIsEditingSubtask] = useState(false);
  const [currentSubtaskIndex, setCurrentSubtaskIndex] = useState<number | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [subtaskToDelete, setSubtaskToDelete] = useState<number | null>(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [newDate, setNewDate] = useState<Date>(new Date());

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]') as Job[];
    setJobs(storedJobs);
    const currentJob = storedJobs.find(j => j.id === id);
    if (currentJob) {
      setJob(currentJob);
      setNewDate(new Date(currentJob.date));
    }
  }, [id]);

  if (!job) {
    return <div>Dữ liệu không xác định</div>;
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSubmit = () => {
    if (!job) return;

    const updatedJob = {
      ...job,
      subtasks: isEditingSubtask && currentSubtaskIndex !== null
        ? job.subtasks.map((st, i) => (i === currentSubtaskIndex ? { text: subtask, StatusTask: false } : st))
        : [...job.subtasks, { text: subtask, StatusTask: false }]
    };

    const updatedJobs = jobs.map(j => j.id === job.id ? updatedJob : j);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    setJobs(updatedJobs);
    setJob(updatedJob);
    setSubtask('');
    setIsEditingSubtask(false);
    setCurrentSubtaskIndex(null);
    setModalAdd(false);
  };

  const handleEditSubtask = (subtaskIndex: number) => {
    if (!job) return;
    setSubtask(job.subtasks[subtaskIndex].text);
    setIsEditingSubtask(true);
    setCurrentSubtaskIndex(subtaskIndex);
    setModalAdd(true);
  };

  const handleDeleteSubtask = (subtaskIndex: number) => {
    setSubtaskToDelete(subtaskIndex);
    setDeleteDialogVisible(true);
  };

  const confirmDeleteSubtask = () => {
    if (!job || subtaskToDelete === null) return;

    const updatedJob = {
      ...job,
      subtasks: job.subtasks.filter((_, i) => i !== subtaskToDelete)
    };
    const updatedJobs = jobs.map(j => j.id === job.id ? updatedJob : j);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    setJobs(updatedJobs);
    setJob(updatedJob);
    setDeleteDialogVisible(false);
  };

  const handleCheckboxChange = (subtaskIndex: number) => {
    if (!job) return;

    const updatedJob = {
      ...job,
      subtasks: job.subtasks.map((st, i) =>
        i === subtaskIndex ? { ...st, StatusTask: !st.StatusTask } : st
      )
    };
    const updatedJobs = jobs.map(j => j.id === job.id ? updatedJob : j);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    setJobs(updatedJobs);
    setJob(updatedJob);
  };

  const handleSaveDate = () => {
    if (!job) return;

    const updatedJob = {
      ...job,
      date: newDate.toISOString()
    };
    const updatedJobs = jobs.map(j => j.id === job.id ? updatedJob : j);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    setJobs(updatedJobs);
    setJob(updatedJob);
    setShowDateModal(false);
  };

  return (
    <div className="container" style={{ padding: '12px' }}>
      <div className="content-todo"
        style={{
          backgroundColor: '#fff',
          padding: '12px',
          minHeight: '230px',
          display: 'grid',
          marginBottom: '17px',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '18px',
              fontWeight: '500'
            }}
          >
            {job.job}
          </p>
          <p>{formatDate(job.date)}</p>
          {job.subtasks && job.subtasks.length > 0 && (
            <div style={{ marginTop: '7px' }}>
              {/* <h4>Subtasks</h4> */}
              <ul>
                {job.subtasks.map((subtask, idx) => (
                  <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Checkbox
                        size="small"
                        checked={subtask.StatusTask}
                        value={idx}
                        onChange={() => handleCheckboxChange(idx)}
                      />
                      <span style={{ marginLeft: '12px' }}>
                        {subtask.text}
                      </span>
                    </div>

                    <div>
                      <button onClick={() => handleEditSubtask(idx)}>
                        <Icon icon="zi-post" />
                      </button>
                      <button onClick={() => handleDeleteSubtask(idx)}>
                        <Icon icon="zi-delete" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
          style={{
            color: 'green'
          }}
          onClick={() => {
            setIsEditingSubtask(false);
            setSubtask('');
            setModalAdd(true);
          }}
        >
          + thêm nhiệm vụ phụ
        </button>
      </div>

      <div className="time-todo"
        style={{
          backgroundColor: '#fff',
          padding: '12px',
          marginBottom: '17px',
        }}
      >
        <List>
          <Item className='expiration-date'
            onClick={() => setShowDateModal(true)}
            title="Ngày hết hạn"
            suffix={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {formatDate(job.date)}
                <Icon icon="zi-chevron-right" style={{ marginLeft: '8px' }} />
              </div>
            }
          />
        </List>
        <Modal
          visible={showDateModal}
          title="Chọn ngày hết hạn mới"
          onClose={() => setShowDateModal(false)}
          actions={[
            {
              text: "Cancel",
              onClick: () => setShowDateModal(false),
            },
            {
              text: "Save",
              onClick: handleSaveDate,
              highLight: true,
            },
          ]}
        >
          <DatePicker
            label='Ngày hết hạn'
            title='Ngày hết hạn'
            dateFormat='dd/mm/yyyy'
            value={newDate}
            onChange={(date) => setNewDate(date)}
            mask
            maskClosable
          />
        </Modal>
      </div>

      <div className="action-todo"
        style={{
          backgroundColor: '#fff',
          padding: '12px',
          marginBottom: '17px',
        }}
      >
      </div>

      <Modal
        visible={modalAdd}
        title={isEditingSubtask ? "Chỉnh sửa nhiệm vụ phụ" : "Thêm nhiệm vụ phụ"}
        onClose={() => {
          setModalAdd(false);
        }}
        actions={[
          {
            text: "Cancel",
            onClick: () => setModalAdd(false),
          },
          {
            text: isEditingSubtask ? "Update" : "Add",
            onClick: handleSubmit,
            highLight: true,
          },
        ]}
      >
        <div className="form-job"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <Input
            type="text"
            value={subtask}
            onChange={e => setSubtask(e.target.value)}
            placeholder="nhiệm vụ phụ"
          />
        </div>
      </Modal>

      <Modal
        visible={deleteDialogVisible}
        title="Xoá dữ liệu"
        onClose={() => {
          setDeleteDialogVisible(false);
        }}
        actions={[
          {
            text: "Cancel",
            onClick: () => setDeleteDialogVisible(false),
          },
          {
            text: "Delete",
            onClick: confirmDeleteSubtask,
            highLight: true,
          },
        ]}
      >
        <div>
          Bạn có chắc muốn xoá nhiệm vụ phụ này không?
        </div>
      </Modal>
    </div>
  );
};

export default TodoDetail;
