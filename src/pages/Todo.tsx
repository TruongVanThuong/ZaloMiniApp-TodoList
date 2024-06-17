import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Icon,
  List,
  Radio,
  Modal,
  Box,
  useNavigate,
} from "zmp-ui";

const { Item } = List;

const Todo: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [job, setJob] = useState('');
  const [jobs, setJobs] = useState(() => {
    const storageJobs = JSON.parse(localStorage.getItem('jobs') ?? '[]');
    return storageJobs;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  // modal add
  const [dialogVisible, setDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  const handleSubmit = () => {
    const currentDate = new Date();
    const jobWithDate = { job, date: currentDate.toISOString() };

    if (isEditing) {
      const updatedJobs = jobs.map((item, index) =>
        index === currentIndex ? jobWithDate : item
      );
      setJobs(updatedJobs);
      setIsEditing(false);
      setCurrentIndex(null);
    } else {
      setJobs(prev => [...prev, jobWithDate]);
    }
    setJob('');
    setDialogVisible(false);
  };

  const handleEdit = (index) => {
    setJob(jobs[index].job);
    setIsEditing(true);
    setCurrentIndex(index);
    setDialogVisible(true);
  };

  const handleDelete = (index) => {
    setJobToDelete(index);
    setDeleteDialogVisible(true);
  };

  const confirmDelete = () => {
    const updatedJobs = jobs.filter((_, i) => i !== jobToDelete);
    setJobs(updatedJobs);
    setDeleteDialogVisible(false);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleItemClick = (index) => {
    navigate(`/todo/${index}`);
  };


  return (
    <div style={{ padding: '12px' }}>
      <List>
        {jobs.map((jobObj, index) => (
          <List.Item
            style={{
              alignItems: "center",
              backgroundColor: "#fff"
            }}
            prefix={
              <div onClick={(e) => e.stopPropagation()}>
                <Radio size="small" name="small-1" />
              </div>
            }
            key={index}
            onClick={() => handleItemClick(index)}
            title={jobObj.job}
            subTitle={formatDate(jobObj.date)}
            suffix={
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(index);
                  }}
                >
                  <Icon icon="zi-post" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(index);
                  }}
                >
                  <Icon icon="zi-delete" />
                </button>
              </>
            }
          />
        ))}
      </List>



      <Box mt={4}>
        <Button
          variant="primary"
          onClick={() => {
            setIsEditing(false);
            setJob('');
            setDialogVisible(true);
          }}
          style={{
            position: 'fixed',
            bottom: '70px',
            right: '20px',
            minWidth: '24px',
            width: '24px !important',
            height: '24px !important',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px'
          }}
        >
          <Icon icon="zi-add-story" />
        </Button>
      </Box>

      <Modal
        visible={dialogVisible}
        title={isEditing ? "Chỉnh sửa nhiệm vụ" : "Thêm nhiệm vụ"}
        onClose={() => {
          setDialogVisible(false);
        }}
        actions={[
          {
            text: "Cancel",
            onClick: () => setDialogVisible(false),
          },
          {
            text: isEditing ? "Update" : "Add",
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
            value={job}
            onChange={e => setJob(e.target.value)}
            placeholder="nhiệm vụ"
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
            onClick: confirmDelete,
            highLight: true,
          },
        ]}
      >
        <div>
          Bạn có chắc muốn xoá dữ liệu này không?
        </div>
      </Modal>

    </div>
  );
};

export default Todo;
