import React, { useState, useEffect } from "react";
import ProductList from "../components/products/ProductList";
import ProductForm from "../components/products/ProductForm";
import Modal from "../components/common/Modal";
import Loading from "../components/common/Loading";
import { productService } from "../services/productService";
import "../styles/pages.css";
import "../styles/components.css";
import "../styles/global.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        const updated = await productService.updateProduct(
          editingProduct.id,
          productData
        );
        setProducts(
          products.map((p) => (p.id === editingProduct.id ? updated : p))
        );
      } else {
        const newProduct = await productService.createProduct(productData);
        setProducts([...products, newProduct]);
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={handleAddProduct}>
          Add Product
        </button>
      </div>

      <ProductList
        products={products}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Products;
