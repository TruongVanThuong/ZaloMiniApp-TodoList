import { string } from "prop-types";
import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import {
  Button,
  Input,
  Icon,
  List,
  Radio,
  Modal,
  useNavigate,
} from "zmp-ui";

const TodoDetail: React.FunctionComponent = () => {
  const { index } = useParams();
  const { Item } = List;
  const jobs = JSON.parse(localStorage.getItem('jobs') as string);
  const job = jobs[index as string];
  const [modalAdd, setModalAdd] = useState(false);
  const [subtask, setSubtask] = useState('');
  const [isEditingSubtask, setIsEditingSubtask] = useState(false);
  const [currentSubtaskIndex, setCurrentSubtaskIndex] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [subtaskToDelete, setSubtaskToDelete] = useState(null);

  if (!job) {
    return <div>Dữ liệu không xác định</div>;
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSubmit = () => {
    const updatedJob = {
      ...job,
      subtasks: isEditingSubtask
        ? job.subtasks.map((st, i) => (i === currentSubtaskIndex ? subtask : st))
        : [...(job.subtasks ?? []), subtask]
    };
    const updatedJobs = jobs.map((j, i) => i === parseInt(index as string) ? updatedJob : j);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    setSubtask('');
    setIsEditingSubtask(false);
    setCurrentSubtaskIndex(null);
    setModalAdd(false);
  };

  const handleEditSubtask = (subtaskIndex) => {
    setSubtask(job.subtasks[subtaskIndex]);
    setIsEditingSubtask(true);
    setCurrentSubtaskIndex(subtaskIndex);
    setModalAdd(true);
  };

  const handleDeleteSubtask = (subtaskIndex) => {
    setSubtaskToDelete(subtaskIndex);
    setDeleteDialogVisible(true);
  };

  const confirmDeleteSubtask = () => {
    const updatedJob = {
      ...job,
      subtasks: job.subtasks.filter((_, i) => i !== subtaskToDelete)
    };
    const updatedJobs = jobs.map((j, i) => i === parseInt(index as string) ? updatedJob : j);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    setDeleteDialogVisible(false);
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
                      <Radio
                        size="small"
                        name="small-1"
                      />
                      {subtask}
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
            title="Ngày hết hạn"
            suffix={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {formatDate(job.date)}
                <Icon icon="zi-chevron-right" style={{ marginLeft: '8px' }} />
              </div>
            }
          />
        </List>
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
