import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Icon,
  List,
  Select,
  Modal,
  Box,
  useNavigate,
  Checkbox,
  Tabs,
} from "zmp-ui";
import CryptoJS from 'crypto-js';
import '../../public/css/todo.css';

const { Item } = List;
const { OtpGroup, Option } = Select;

interface Job {
  id: string;
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


const Todo: React.FunctionComponent = () => {

  const navigate = useNavigate();
  const [job, setJob] = useState('');
  const [jobs, setJobs] = useState(() => {
    const storageJobs = JSON.parse(localStorage.getItem('jobs') ?? '[]');
    return storageJobs.map((job: Job) => ({
      ...job,
      categories: job.categories || [],
      subtasks: job.subtasks || [] // Ensure subtasks is always an array
    }));
  });
  const [activeTab, setActiveTab] = useState('0');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);

  const [isEditing, setIsEditing] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  // modal add
  const [dialogVisible, setDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
    const storedCategories = JSON.parse(localStorage.getItem("categories") as string);
    if (storedCategories) {
      setCategories(storedCategories);
    }
    // Không cần cập nhật filteredJobs ở đây nữa
  }, [jobs]);

  useEffect(() => {
    if (activeTab === '0') {
      setFilteredJobs(jobs);
    } else {
      const newFilteredJobs = jobs.filter(job => job.categories && job.categories.includes(parseInt(activeTab)));
      setFilteredJobs(newFilteredJobs);
    }
  }, [activeTab, jobs]);

  // const handleSubmit = () => {
  //   const currentDate = new Date();
  //   const jobWithDate = {
  //     job,
  //     id: Date.now().toString(),
  //     date: currentDate.toISOString(),
  //     status: false,
  //     categories: selectedCategories,
  //     subtasks: []
  //   };

  //   if (isEditing) {
  //     const updatedJobs = jobs.map((item, index) => {
  //       if (index === currentIndex) {
  //         // Giữ nguyên mảng subtasks hiện tại
  //         return {
  //           job,
  //           date: item.date,
  //           status: item.status,
  //           subtasks: item.subtasks,
  //           categories: item.categories,
  //         };
  //       }
  //       return item;
  //     });
  //     setJobs(updatedJobs);
  //     setIsEditing(false);
  //     setCurrentIndex(null);

  //   } else {
  //     setJobs(prev => [...prev, jobWithDate]);
  //   }
  //   setJob('');
  //   setSelectedCategories([]);

  //   setDialogVisible(false);
  // };
  const handleSubmit = () => {
    let updatedJobs;
    if (isEditing) {
      updatedJobs = jobs.map(item => {
        if (item.id === currentJobId) {
          return {
            ...item,
            job,
            categories: selectedCategories,
          };
        }
        return item;
      });
    } else {
      const newJob = {
        id: Date.now().toString(),
        job,
        date: new Date().toISOString(),
        status: false,
        categories: selectedCategories,
        subtasks: []
      };
      updatedJobs = [...jobs, newJob];
    }

    setJobs(updatedJobs);

    // Cập nhật filteredJobs
    if (activeTab === '0') {
      setFilteredJobs(updatedJobs);
    } else {
      const newFilteredJobs = updatedJobs.filter(job =>
        job.categories && job.categories.includes(parseInt(activeTab))
      );
      setFilteredJobs(newFilteredJobs);
    }

    setJob('');
    setSelectedCategories([]);
    setIsEditing(false);
    setCurrentJobId(null);
    setDialogVisible(false);
  };

  const handleEdit = (id: string) => {
    const jobToEdit = jobs.find(job => job.id === id);
    if (jobToEdit) {
      setJob(jobToEdit.job);
      setSelectedCategories(jobToEdit.categories); // Thêm dòng này
      setIsEditing(true);
      setCurrentJobId(id); // Thay vì lưu index, lưu id
      setDialogVisible(true);
    }
  };

  const handleDelete = (id: string) => {
    setJobToDelete(id);
    setDeleteDialogVisible(true);
  };

  const confirmDelete = () => {
    if (jobToDelete !== null) {
      const updatedJobs = jobs.filter(job => job.id !== jobToDelete);
      setJobs(updatedJobs);
      setDeleteDialogVisible(false);
      setJobToDelete(null); // Reset jobToDelete sau khi xóa
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const [isCompletedList, setIsCompletedList] = useState(jobs.map(() => false));

  const handleCheckboxChange = (id: string) => {
    const updatedJobs = jobs.map(job =>
      job.id === id ? { ...job, status: !job.status } : job
    );
    setJobs(updatedJobs);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));

    if (activeTab === '0') {
      setFilteredJobs(updatedJobs);
    } else {
      const newFilteredJobs = updatedJobs.filter(job =>
        job.categories && job.categories.includes(parseInt(activeTab))
      );
      setFilteredJobs(newFilteredJobs);
    }
  };

  const handleTabChange = (index: string) => {
    setActiveTab(index);

    if (index !== '0') {
      const filteredJobs = jobs.filter(job => job.categories && job.categories.includes(parseInt(index)));
      setFilteredJobs(filteredJobs);
      console.log(index)
    } else {
      console.log(index)
      setFilteredJobs(jobs);
    }
  };


  return (
    <div style={{ padding: '12px' }}>

      <div className="categories">
        <div className="tabs-container">
          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            <Tabs.Tab key="0" label="Tất cả" />
            {categories.map((category, index) => (
              <Tabs.Tab key={category.id} label={category.name} />
            ))}
          </Tabs>
        </div>
        <div>
          <button onClick={() => navigate(`/todo-category`)}>
            <Icon icon="zi-more-grid" />
          </button>
        </div>
      </div>


      <List>
        {filteredJobs.map((jobObj) => (
          <List.Item
            key={jobObj.id}
            style={{
              alignItems: "center",
              backgroundColor: "#fff"
            }}
            prefix={
              <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  size="small"
                  checked={jobObj.status}
                  value={jobObj.id}
                  onChange={() => handleCheckboxChange(jobObj.id)}
                />
              </div>
            }
            onClick={() => navigate(`/todo/${jobObj.id}`)}
            title={jobObj.job}
            subTitle={formatDate(jobObj.date)}
            suffix={
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(jobObj.id);
                  }}
                >
                  <Icon icon="zi-post" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(jobObj.id);
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
            bottom: '120px',
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

    </div>
  );
};

export default Todo;
