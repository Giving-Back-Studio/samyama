import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Cloud, Sun, Droplets, Wind } from 'lucide-react';

const fetchWeather = async () => {
  // This is a mock function. In a real app, you'd call an actual weather API.
  return {
    temperature: 22,
    condition: 'Partly Cloudy',
    humidity: 60,
    windSpeed: 5
  };
};

const WeatherWidget = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['weather'],
    queryFn: fetchWeather,
  });

  if (isLoading) return <div>Loading weather data...</div>;
  if (error) return <div>Error fetching weather data</div>;

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center">
        <Sun className="w-6 h-6 mr-2" />
        <span>{data.temperature}°C</span>
      </div>
      <div className="flex items-center">
        <Cloud className="w-6 h-6 mr-2" />
        <span>{data.condition}</span>
      </div>
      <div className="flex items-center">
        <Droplets className="w-6 h-6 mr-2" />
        <span>{data.humidity}% Humidity</span>
      </div>
      <div className="flex items-center">
        <Wind className="w-6 h-6 mr-2" />
        <span>{data.windSpeed} km/h Wind</span>
      </div>
    </div>
  );
};

export default WeatherWidget;