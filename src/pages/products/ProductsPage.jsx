import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../../features/products/productSlice';
import { addToCart } from '../../features/cart/cartSlice';
import { getProductImageUrl } from '../../utils/imageHelper';
import { useToast } from '../../contexts/ToastContext';
import StoriesFeed from '../../components/stories/StoriesFeed';
import CategoriesBar from '../../components/categories/CategoriesBar';

const ProductsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const { items: products, loading, filters } = useSelector((state) => state.products);

  useEffect(() => {
    // Only fetch if no category filter is set (CategoriesBar will handle category fetching)
    console.log("product ",getProductImageUrl(products[0]));
    if (!filters.category) {
      dispatch(fetchProducts());
    }
  }, [dispatch, filters.category]);

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Prevent navigation to product detail page
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.title} added to cart!`);
  };

  // Get the title based on the selected category
  const getPageTitle = () => {
    if (filters.category) {
      return `${t(`categories.${filters.category}`)} - ${t('products.allProducts')}`;
    }
    return t('products.allProducts');
  };

  return (
    <div className="space-y-6">
      {/* Stories Feed */}
      <StoriesFeed />

      {/* Categories Bar */}
      <CategoriesBar />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {getPageTitle()}
        </h1> */}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="card bg-white dark:bg-gray-800 text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {filters.category
              ? `No products found in ${t(`categories.${filters.category}`)} category`
              : 'No products found'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {products.map((product, index) => (
            <Link
              key={`${product._id || product.id}-${index}`}
              to={`/products/${product._id || product.id}`}
              className="card bg-white hover:shadow-lg transition-shadow duration-200 p-3 sm:p-4 flex flex-col h-full"
            >
              {/* Image - Fixed aspect ratio */}
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 sm:mb-3 overflow-hidden shrink-0">
                {getProductImageUrl(product) ? (
                  <img
                    src={getProductImageUrl(product)}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs">
                    No Image
                  </div>
                )}
              </div>

              {/* Content - Grows to fill space */}
              <div className="flex flex-col grow">
                {/* Title - Fixed 2 lines */}
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2 line-clamp-2 text-sm sm:text-base h-10 sm:h-12">
                  {product.title}
                </h3>

                {/* Description - Fixed 2 lines, hidden on mobile */}
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 hidden sm:block h-10">
                  {product.description || '\u00A0'}
                </p>

                {/* Price and Button - Pushed to bottom */}
                <div className="mt-auto">
                  <p className="text-primary-600 dark:text-primary-400 font-bold text-sm sm:text-base mb-2">
                    TSh {product.price?.toLocaleString()}
                  </p>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full btn-primary text-xs sm:text-sm py-1.5 sm:py-2"
                  >
                    {t('products.addToCart')}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
