const token = localStorage.getItem('token');
const BASE_URL = 'http://api.nguyenphuocvinh.me';

export const createProduct = (formData) => {
  const token = localStorage.getItem("token");
  return fetch(`${BASE_URL}/admin/createproduct`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((res) => res.json())
    .catch((error) => {
      throw new Error(error.message || "Create tour failed");
    });
};


export const updateProduct = (_id, updateFields) => {
  return fetch(`${BASE_URL}/admin/updateproduct/${_id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateFields),
  })
  .then((res) => res.json())
  .catch((error) => {
    throw new Error(error.message || 'Update tour failed');
  });
};

export const deleteProduct = (_id) => {
  return fetch(`${BASE_URL}/admin/deleteproduct/${_id}`, {
    method: 'DELETE',
    headers:{
      Authorization: `Bearer ${token}`,
    }
  })
  .then((res) => res.json())
  .catch((error) => {
    throw new Error(error.message || 'Delete tour failed');
  });
};


export const deleteUser = (_id) => {
  return fetch(`${BASE_URL}/admin/deleteuser/${_id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((error) => {
      throw new Error(error.message || 'Delete user failed');
    });
};
export const getAllProducts = async () => {
    // Lấy token từ local storage
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${BASE_URL}/admin/getallproducts`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const getAllUser = async () => {
    // Lấy token từ local storage
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${BASE_URL}/admin/getalluser`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const getallcategories = async () => {
    // Lấy token từ local storage
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${BASE_URL}/admin/getallcategories`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const getOrders = async () => {
  // Lấy token từ local storage
  const token = localStorage.getItem('token');

  try {
      const response = await fetch(`${BASE_URL}/admin/getorders`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });
      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
  }
};

export const createCategory = (formData) => {
  const token = localStorage.getItem("token");
  return fetch(`${BASE_URL}/admin/createcategory`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((res) => res.json())
    .catch((error) => {
      throw new Error(error.message || "Create tour failed");
    });
};


export const updateCategory = (_id, updateFields) => {
  return fetch(`${BASE_URL}/admin/updatecategory/${_id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateFields),
  })
  .then((res) => res.json())
  .catch((error) => {
    throw new Error(error.message || 'Update tour failed');
  });
};

export const deleteCategory = (_id) => {
  return fetch(`${BASE_URL}/admin/deletecategory/${_id}`, {
    method: 'DELETE',
    headers:{
      Authorization: `Bearer ${token}`,
    }
  })
  .then((res) => res.json())
  .catch((error) => {
    throw new Error(error.message || 'Delete tour failed');
  });
};

export const getSingleProduct = async (_id) => {
  // Lấy token từ local storage
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${BASE_URL}/api/v1/product/${_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tour data');
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error fetching tour data:', error);
    throw error;
  }
};

export const getSingleCategory = async (_id) => {
  // Lấy token từ local storage
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${BASE_URL}/admin/getsinglecategory/${_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tour data');
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error fetching tour data:', error);
    throw error;
  }
};



