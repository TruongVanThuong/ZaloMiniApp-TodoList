import React, { useState, useEffect } from "react";
import {
  Avatar,
  List,
  Text,
  Box,
  Page,
  Button,
  Icon,
  Input,
  Modal,
} from "zmp-ui";

interface Category {
  id: number;
  name: string;
}

const TodoCategory: React.FunctionComponent = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategoryName, setCurrentCategoryName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem("categories") as string);
    if (storedCategories) {
      setCategories(storedCategories);
    }
  }, []);

  const handleSubmitCategory = () => {
    if (currentCategoryName.trim() !== "") {
      if (isEditing && categoryToEdit) {
        const updatedCategories = categories.map(cat =>
          cat.id === categoryToEdit.id ? { ...cat, name: currentCategoryName.trim() } : cat
        );
        setCategories(updatedCategories);
        localStorage.setItem("categories", JSON.stringify(updatedCategories));
      } else {
        const newCategory = {
          id: categories.length ? categories[categories.length - 1].id + 1 : 1,
          name: currentCategoryName.trim(),
        };
        const updatedCategories = [...categories, newCategory];
        setCategories(updatedCategories);
        localStorage.setItem("categories", JSON.stringify(updatedCategories));
      }

      setCurrentCategoryName("");
      setModalVisible(false);
      setIsEditing(false);
      setCategoryToEdit(null);
    }
  };

  const handleEditCategory = (category: Category) => {
    setCurrentCategoryName(category.name);
    setCategoryToEdit(category);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      const updatedCategories = categories.filter(category => category.id !== categoryToDelete.id);
      setCategories(updatedCategories);
      localStorage.setItem("categories", JSON.stringify(updatedCategories));
      setDeleteDialogVisible(false);
    }
  };

  return (
    <Page>
      <p style={{
        backgroundColor: '#a3d5ff',
        textAlign: 'center',
        padding: '12px'
      }}>
        Danh mục hiển thị trên trang chủ
      </p>
      <Box className="container" style={{ padding: "12px" }}>
        <List>
          {categories.map(category => (
            <List.Item
              key={category.id}
              title={category.name}
              suffix={
                <>
                  <span style={{ fontSize: '17px', marginRight: '7px' }}>0</span>
                  <button onClick={() => handleEditCategory(category)} >
                    <Icon icon="zi-edit" />
                  </button>
                  <button onClick={() => {
                    setCategoryToDelete(category);
                    setDeleteDialogVisible(true);
                  }} >
                    <Icon icon="zi-delete" />
                  </button>
                </>
              }
            />
          ))}
        </List>

        <button onClick={() => {
          setModalVisible(true);
          setIsEditing(false);
          setCurrentCategoryName("");
        }} >
          <Icon icon="zi-save-to-collection" />  Add Category
        </button>

      </Box>

      <Modal
        visible={modalVisible}
        title={isEditing ? "Edit Category" : "Add New Category"}
        onClose={() => setModalVisible(false)}
        actions={[
          {
            text: "Cancel",
            onClick: () => setModalVisible(false),
          },
          {
            text: isEditing ? "Save" : "Add",
            onClick: handleSubmitCategory,
            highLight: true,
          },
        ]}
      >
        <Input
          type="text"
          value={currentCategoryName}
          onChange={e => setCurrentCategoryName(e.target.value)}
          placeholder="Category Name"
        />
      </Modal>

      <Modal
        visible={deleteDialogVisible}
        title="Delete Category"
        onClose={() => setDeleteDialogVisible(false)}
        actions={[
          {
            text: "Cancel",
            onClick: () => setDeleteDialogVisible(false),
          },
          {
            text: "Delete",
            onClick: handleDeleteCategory,
            highLight: true,
          },
        ]}
      >
        <Text>
          Are you sure you want to delete the category "{categoryToDelete?.name}"?
        </Text>
      </Modal>
    </Page>
  );
};

export default TodoCategory;
