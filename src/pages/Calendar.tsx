import React, { useState, useEffect } from "react";
import {
  Page,
  List,
  Text,
  Input,
  Button,
  Modal,
  Icon,
  Box,
  Checkbox,
  useNavigate,
  Select,
} from "zmp-ui";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Job {
  id: string; // Thêm trường id
  job: string;
  date: string;
  status: boolean;
  categories: number[];
  subtasks: { StatusTask: boolean }[];
}

interface Category {
  id: number;
  name: string;
}

const { Option } = Select;

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString());
  const [jobs, setJobs] = useState<Job[]>([]);
  const [job, setJob] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem('jobs') as string) as Job[];
    setJobs(storedJobs);
    const storedCategories = JSON.parse(localStorage.getItem("categories") as string);
    if (storedCategories) {
      setCategories(storedCategories);
    }
  }, []);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date.toISOString());
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredJobs = selectedDate
    ? jobs.filter(job => formatDate(job.date) === formatDate(selectedDate))
    : [];

  const handleEdit = (jobId: string) => {
    const jobToEdit = jobs.find(job => job.id === jobId);
    if (jobToEdit) {
      setJob(jobToEdit.job);
      setSelectedCategories(jobToEdit.categories); // Thêm dòng này
      setIsEditing(true);
      setCurrentJobId(jobId);
      setDialogVisible(true);
    }
  };

  const handleDelete = (jobId: string) => {
    setJobToDelete(jobId);
    setDeleteDialogVisible(true);
  };

  const confirmDelete = () => {
    if (jobToDelete !== null) {
      const updatedJobs = jobs.filter(job => job.id !== jobToDelete);
      setJobs(updatedJobs);
      localStorage.setItem('jobs', JSON.stringify(updatedJobs));
      setDeleteDialogVisible(false);
    }
  };

  const handleSubmit = () => {
    if (isEditing && currentJobId !== null) {
      const updatedJobs = jobs.map(item => {
        if (item.id === currentJobId) {
          return {
            ...item,
            job,
            categories: selectedCategories,
          };
        }
        return item;
      });
      setJobs(updatedJobs);
      localStorage.setItem('jobs', JSON.stringify(updatedJobs));
      setIsEditing(false);
      setCurrentJobId(null);
    } else {
      const newJob: Job = {
        id: Date.now().toString(), // Tạo id mới
        job,
        date: new Date().toISOString(),
        status: false,
        categories: selectedCategories,
        subtasks: []
      };
      const updatedJobs = [...jobs, newJob];
      setJobs(updatedJobs);
      localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    }
    setJob('');
    setSelectedCategories([]);
    setDialogVisible(false);
  };

  const handleCheckboxChange = (jobId: string) => {
    const updatedJobs = jobs.map(job => {
      if (job.id === jobId) {
        return { ...job, status: !job.status };
      }
      return job;
    });
    setJobs(updatedJobs);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
  };

  return (
    <Page className='section-container'>
      <Calendar onChange={handleDayClick} />
      <div style={{ padding: '12px' }}>
        {selectedDate && (
          <>
            <Text>{`Nhiệm vụ từ ngày ${formatDate(selectedDate)}`}</Text>
            <List>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <List.Item
                    style={{
                      alignItems: "center",
                    }}
                    key={job.id}
                    title={job.job}
                    prefix={
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          size="small"
                          checked={job.status}
                          value={job.id}
                          onChange={() => handleCheckboxChange(job.id)}
                        />
                      </div>
                    }
                    onClick={() => navigate(`/todo/${job.id}`)}
                    subTitle={formatDate(job.date)}
                    suffix={
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(job.id);
                          }}
                        >
                          <Icon icon="zi-post" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(job.id);
                          }}
                        >
                          <Icon icon="zi-delete" />
                        </button>
                      </>
                    }
                  />
                ))
              ) : (
                <Text>Không có nhiệm vụ cho ngày hôm nay</Text>
              )}
            </List>
          </>
        )}
      </div>

      <Box mt={4}>
        <Button
          variant="primary"
          onClick={() => {
            setIsEditing(false);
            setJob('');
            setSelectedCategories([]); // Reset selectedCategories
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
          setJob('');
          setSelectedCategories([]); // Reset selectedCategories khi đóng modal
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
          <Select
            placeholder="Chọn danh mục"
            multiple
            defaultValue={[]}
            value={selectedCategories}
            onChange={(value: number[]) => setSelectedCategories(value)}
          >
            {categories.map((category, index) => (
              <Option key={index} value={category.id} title={category.name} />
            ))}
          </Select>
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
    </Page>
  );
};

export default CalendarPage;
