import React, { useEffect, useState } from "react";
import Card from "./Card";

interface Food {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

interface FoodsProps {
  selectedCategory: string;
}

const Foods: React.FC<FoodsProps> = ({ selectedCategory }) => {
  const [foodData, setFoodData] = useState<Food[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setFoodData(data.meals);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="flex justify-center h-[80%] p-6">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {foodData.length > 0 &&
          foodData.map((food) => {
            const price = (food.idMeal % 10) + 10;
            return (
              <div key={food.idMeal} className="w-full max-w-xs">
                <Card
                  name={food.strMeal}
                  image={food.strMealThumb}
                  price={price}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Foods;
