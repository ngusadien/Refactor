import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchProducts, setFilters } from '../../features/products/productSlice';

const CategoriesBar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.products);
  const selectedCategory = filters.category || 'all';

  const categories = [
    { id: 'all', icon: '🏪' },
    { id: 'electronics', icon: '📱' },
    { id: 'fashion', icon: '👔' },
    { id: 'home', icon: '🏡' },
    { id: 'beauty', icon: '💄' },
    { id: 'sports', icon: '⚽' },
    { id: 'toys', icon: '🧸' },
    { id: 'books', icon: '📚' },
    { id: 'food', icon: '🍕' },
    { id: 'automotive', icon: '🚗' },
  ];

  const handleCategoryClick = (categoryId) => {
    // Update the filter in Redux state
    const newCategory = categoryId === 'all' ? null : categoryId;
    dispatch(setFilters({ category: newCategory }));

    // Fetch products with the new category filter
    if (categoryId === 'all') {
      dispatch(fetchProducts({ search: filters.search }));
    } else {
      dispatch(fetchProducts({ category: categoryId, search: filters.search }));
    }
  };

  // Load initial products on mount
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      dispatch(fetchProducts({ category: selectedCategory }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mb-6">
      {/* <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        {t('categories.title')}
      </h2> */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`shrink-0 flex flex-col items-center gap-2 cursor-pointer transition-all ${
              selectedCategory === category.id
                ? 'opacity-100'
                : 'opacity-70 hover:opacity-100'
            }`}
            aria-label={t(`categories.${category.id}`)}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-600 dark:border-primary-500'
                  : 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
              }`}
            >
              {category.icon}
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t(`categories.${category.id}`)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoriesBar;
